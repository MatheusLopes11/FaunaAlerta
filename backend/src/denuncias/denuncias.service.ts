import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'node:crypto';
import { Repository } from 'typeorm';
import { Denuncias } from './denuncias.entity.js';
import { DenunciaHistorico } from '../denuncia_historico/denuncia_historico.entity.js';
import { CreateDenunciaDto } from './dto/create-denuncias.dto.js';
import { DenunciasRecebidasService } from '../orgao mock/denuncia recebida/denuncia-recebida.service.js';

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
  ) {}

  private async gerarProtocolo(): Promise<string> {
    const ano = new Date().getFullYear();
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      let codigo = '';
      for (let i = 0; i < 6; i++) codigo += ALFABETO[randomInt(ALFABETO.length)];
      const protocolo = `FA-${ano}-${codigo}`;
      const existe = await this.orgao.existeProtocolo(protocolo);
      if (!existe) return protocolo;
    }
    throw new InternalServerErrorException('Não foi possível gerar o protocolo.');
  }

  async findAll(): Promise<Denuncias[]> {
    return await this.denunciasRepository.find({ order: { criadoEm: 'DESC' } });
  }

  async create(dto: CreateDenunciaDto, usuarioId?: number) {
    if ((dto.latitude == null) !== (dto.longitude == null)) {
      throw new BadRequestException('Informe latitude e longitude juntas.');
    }

    const protocolo = await this.gerarProtocolo();
    const local = [`${dto.municipio.trim()}/${dto.uf.toUpperCase()}`, dto.referencia?.trim()]
      .filter(Boolean)
      .join(' - ');

    // 1) Envia ao órgão primeiro. Se falhar, nada é salvo aqui.
    let recebida;
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

    if (usuarioId == null) {
      return {
        protocolo,
        statusAtual: recebida.statusDenun,
        criadoEm: recebida.recebidaEm,
        identificada: false,
      };
    }

    
    // 2) Registra no nosso banco. Se falhar, desfaz o envio ao órgão.
    try {
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
      return { protocolo: nova.protocolo, statusAtual: nova.statusAtual, criadoEm: nova.criadoEm, identificada: true };
    } catch (e) {
      await this.orgao.remover(recebida.id).catch(() => undefined);
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

    try {
      await this.sincronizar(data);
    } catch (e) {
      // se o órgão estiver fora do ar, mostra o que já temos
      this.logger.warn(`Sincronização com o órgão falhou: ${e instanceof Error ? e.message : e}`);
    }

    return {
      data: data.map((d) => ({
        id: d.id,
        protocolo: d.protocolo,
        tipo: d.tipo,
        statusAtual: d.statusAtual,
        criadoEm: d.criadoEm,
        atualizadoEm: d.atualizadoEm,
      })),
      total,
      page,
      limit,
    };
  }

  private async sincronizar(denuncias: Denuncias[]) {
    const abertas = denuncias.filter((d) => !STATUS_FINAIS.includes(d.statusAtual));
    if (abertas.length === 0) return;

    const remotos = await this.orgao.statusPorProtocolo(abertas.map((d) => d.protocolo));
    const porProtocolo = new Map(remotos.map((r) => [r.protocolo, r.statusDenun]));

    for (const d of abertas) {
      const novo = porProtocolo.get(d.protocolo);
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