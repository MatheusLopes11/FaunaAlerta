import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'node:crypto';
import { Repository } from 'typeorm';
import { Denuncias } from './denuncias.entity.js';
import { DenunciaHistorico } from '../denuncia_historico/denuncia_historico.entity.js';
import { CreateDenunciaDto } from './dto/create-denuncias.dto.js';
import { DenunciasRecebidasService } from '../orgao mock/denuncia recebida/denuncia-recebida.service.js';
import { DenunciaRecebida } from '../orgao mock/denuncia recebida/Denuncia-Recebida.entity.js';
import { DenunciaMidiasMockService } from '../orgao mock/denuncia midias/denuncia-midia.service.js';
import { apagarArquivos, salvarArquivos } from '../common/uploads.js';
import type { ArquivoEnviado } from '../common/uploads.js';

const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sem O, 0, I, 1, L
const STATUS_FINAIS = ['Concluida', 'Rejeitada'];

@Injectable()
export class DenunciasService {
  private readonly logger = new Logger(DenunciasService.name);

  constructor(
    @InjectRepository(Denuncias)
    private readonly denunciasRepository: Repository<Denuncias>,
    @InjectRepository(DenunciaHistorico)
    private readonly historicoRepository: Repository<DenunciaHistorico>,
    private readonly orgao: DenunciasRecebidasService,
    private readonly midiasOrgao: DenunciaMidiasMockService,
  ) {}

  private async gerarProtocolo(): Promise<string> {
    const ano = new Date().getFullYear();
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      let codigo = '';
      for (let i = 0; i < 6; i++) codigo += ALFABETO[randomInt(ALFABETO.length)];
      const protocolo = `FA-${ano}-${codigo}`;
      const existe = await this.denunciasRepository.findOne({ where: { protocolo } });
      if (!existe) return protocolo;
    }
    throw new InternalServerErrorException('Não foi possível gerar o protocolo.');
  }

  async findAll(): Promise<Denuncias[]> {
    return await this.denunciasRepository.find({ order: { criadoEm: 'DESC' } });
  }

  async create(dto: CreateDenunciaDto, usuarioId?: number, arquivos: ArquivoEnviado[] = []) {
    if ((dto.latitude == null) !== (dto.longitude == null)) {
      throw new BadRequestException('Informe latitude e longitude juntas.');
    }

    // Valida e grava os arquivos primeiro. Qualquer falha depois apaga tudo.
    const midias = await salvarArquivos(arquivos);
    let recebidaId: number | null = null;

    try {
      const protocolo = await this.gerarProtocolo();
      const local = [`${dto.municipio.trim()}/${dto.uf.toUpperCase()}`, dto.referencia?.trim()]
        .filter(Boolean)
        .join(' - ');

      // 1) Envia ao órgão primeiro. Se falhar, nada é salvo aqui.
      let recebida: DenunciaRecebida;
      try {
        recebida = await this.orgao.create({
          protocolo,
          tipo: dto.tipo,
          descricao: dto.descricao,
          localDescricao: local,
          dataOcorrencia: dto.dataOcorrencia.slice(0, 10),
          latitude: dto.latitude,
          longitude: dto.longitude,
        });
      } catch (e) {
        this.logger.error(`Falha ao enviar ao órgão (${protocolo}): ${e instanceof Error ? e.message : e}`);
        throw new BadGatewayException('Não foi possível enviar a denúncia ao órgão agora. Tente novamente em instantes.');
      }
      recebidaId = recebida.id;

      for (const m of midias) {
        await this.midiasOrgao.create({ denunciaId: recebida.id, tipo: m.tipo, url: m.url });
      }

      // 2) Registra no nosso banco.
      const nova = await this.denunciasRepository.save(
        this.denunciasRepository.create({
          protocolo,
          usuarioId,
          tipo: dto.tipo,
          statusAtual: 'Recebida',
          statusEnvio: 'ENVIADA',
        }),
      );
      await this.historicoRepository.save(
        this.historicoRepository.create({
          denunciaId: nova.id,
          statusDenun: 'Recebida',
          observacao: 'Denúncia registrada e enviada ao órgão.',
          origem: 'SISTEMA',
        }),
      );
      return { protocolo: nova.protocolo, statusAtual: nova.statusAtual, criadoEm: nova.criadoEm };
    } catch (e) {
      // desfaz o envio ao órgão (as mídias dele somem junto) e apaga os arquivos
      if (recebidaId !== null) await this.orgao.remover(recebidaId).catch(() => undefined);
      await apagarArquivos(midias.map((m) => m.url));
      throw e;
    }
  }

  async minhas(usuarioId: number, page = 1, limit = 5) {
    const [data, total] = await this.denunciasRepository.findAndCount({
      where: { usuarioId },
      order: { criadoEm: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    let remotos: DenunciaRecebida[] = [];
    try {
      remotos = await this.orgao.resumoPorProtocolo(data.map((d) => d.protocolo));
      await this.sincronizar(data, remotos);
    } catch (e) {
      // se o órgão estiver fora do ar, mostra o que já temos
      this.logger.warn(`Sincronização com o órgão falhou: ${e instanceof Error ? e.message : e}`);
    }
    const porProtocolo = new Map(remotos.map((r) => [r.protocolo, r]));

    return {
      data: data.map((d) => {
        const midias = porProtocolo.get(d.protocolo)?.midias ?? [];
        const principal = midias.find((m) => m.tipo === 'FOTO') ?? midias[0];
        return {
          id: d.id,
          protocolo: d.protocolo,
          tipo: d.tipo,
          statusAtual: d.statusAtual,
          criadoEm: d.criadoEm,
          atualizadoEm: d.atualizadoEm,
          midia: principal ? { tipo: principal.tipo, url: principal.url } : null,
        };
      }),
      total,
      page,
      limit,
    };
  }

  private async sincronizar(denuncias: Denuncias[], remotos: DenunciaRecebida[]) {
    const statusRemoto = new Map(remotos.map((r) => [r.protocolo, r.statusDenun]));

    for (const d of denuncias) {
      if (STATUS_FINAIS.includes(d.statusAtual)) continue;
      const novo = statusRemoto.get(d.protocolo);
      if (novo && novo !== d.statusAtual) {
        d.statusAtual = novo;
        await this.denunciasRepository.save(d);
        await this.historicoRepository.save(
          this.historicoRepository.create({
            denunciaId: d.id,
            statusDenun: novo,
            observacao: 'Status atualizado pelo órgão.',
            origem: 'ORGAO',
          }),
        );
      }
    }
  }
}