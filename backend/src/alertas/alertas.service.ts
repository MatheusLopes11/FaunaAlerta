import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Alerta } from './alertas.entity.js';
import { AlertaMidia } from '../alerta-media/alerta-media.entity.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import type { RelatorioAlertasQueryDto, Situacao } from './dto/relatorio-alertas.dto.js';
import { Especies } from '../especies/especies.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { BiomaService } from '../geo/bioma.service.js';
import { apagarArquivos, salvarArquivos } from '../common/uploads.js';
import type { ArquivoEnviado } from '../common/uploads.js';

const LIMITE_RELATORIO = 1000;

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Alerta)
    private readonly alertaRepository: Repository<Alerta>,
    @InjectRepository(Especies)
    private readonly especieRepository: Repository<Especies>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly biomas: BiomaService,
  ) {}

  // Consulta o banco a cada pedido: quem for revogado perde o acesso na hora.
  private async exigirAprovado(usuarioId: number) {
    const u = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!u || u.statusCadastro !== 'Aprovado') {
      throw new ForbiddenException('Seu cadastro ainda não foi aprovado.');
    }
  }

  async findAll(solicitanteId: number): Promise<Alerta[]> {
    await this.exigirAprovado(solicitanteId);
    return await this.alertaRepository.find({
      relations: { especie: true },
      order: { id: 'DESC' },
    });
  }

  async create(dto: CreateAlertaDto, usuarioId?: number, arquivos: ArquivoEnviado[] = []): Promise<Alerta> {
    if ((dto.latitude == null) !== (dto.longitude == null)) {
      throw new BadRequestException('Informe latitude e longitude juntas.');
    }

    if (dto.especieId) {
      const especie = await this.especieRepository.findOne({ where: { id: dto.especieId } });
      if (!especie) {
        throw new NotFoundException('Espécie associada não encontrada.');
      }
    }

    // O bioma vem do ponto marcado no mapa, não do que o cliente informar.
    const biomaDoPonto =
      dto.latitude != null && dto.longitude != null ? this.biomas.identificar(dto.latitude, dto.longitude) : null;

    // Valida e grava os arquivos primeiro. Se o banco falhar, eles são apagados.
    const midias = await salvarArquivos(arquivos);
    try {
      return await this.alertaRepository.manager.transaction(async (m) => {
        const alerta = await m.save(m.create(Alerta, { ...dto, usuarioId, bioma: biomaDoPonto ?? dto.bioma }));
        for (const x of midias) {
          await m.save(m.create(AlertaMidia, { alertaId: alerta.id, tipo: x.tipo, url: x.url }));
        }
        return alerta;
      });
    } catch (e) {
      await apagarArquivos(midias.map((x) => x.url));
      throw e;
    }
  }

  // Preenche o bioma dos alertas antigos que têm coordenadas mas ainda não têm bioma.
  async recalcularBiomas() {
    const alertas = await this.alertaRepository.find({ where: { bioma: IsNull() } });
    let atualizados = 0;
    for (const a of alertas) {
      if (a.latitude == null || a.longitude == null) continue;
      const b = this.biomas.identificar(a.latitude, a.longitude);
      if (b) {
        await this.alertaRepository.update(a.id, { bioma: b });
        atualizados++;
      }
    }
    return { analisados: alertas.length, atualizados };
  }

  async relatorio(solicitanteId: number, q: RelatorioAlertasQueryDto) {
    await this.exigirAprovado(solicitanteId);

    if (q.de && q.ate && q.de > q.ate) {
      throw new BadRequestException('A data inicial não pode ser depois da data final.');
    }

    const where: FindOptionsWhere<Alerta> = {};
    if (q.uf) where.uf = q.uf.toUpperCase();
    if (q.municipio) where.municipio = q.municipio;
    if (q.especieId) where.especieId = q.especieId;
    if (q.situacao) where.situacao = q.situacao;
    if (q.de && q.ate) where.dataAvistamento = Between(q.de, q.ate);
    else if (q.de) where.dataAvistamento = MoreThanOrEqual(q.de);
    else if (q.ate) where.dataAvistamento = LessThanOrEqual(q.ate);

    const [alertas, total] = await this.alertaRepository.findAndCount({
      where,
      relations: { especie: true },
      order: { dataAvistamento: 'DESC', id: 'DESC' },
      take: LIMITE_RELATORIO,
    });

    return {
      data: alertas.map((a) => ({
        id: a.id,
        especieId: a.especieId,
        especieNome: a.especie?.nomePopular ?? null,
        especieCientifico: a.especie?.nomeCientifico ?? null,
        municipio: a.municipio,
        uf: a.uf,
        bioma: a.bioma,
        dataAvistamento: a.dataAvistamento,
        descricao: a.descricao,
        situacao: a.situacao,
        latitude: a.latitude,
        longitude: a.longitude,
      })),
      total,
      limite: LIMITE_RELATORIO,
    };
  }

  async municipios(solicitanteId: number, uf: string): Promise<string[]> {
    await this.exigirAprovado(solicitanteId);

    const linhas = await this.alertaRepository
      .createQueryBuilder('a')
      .select('DISTINCT a.municipio', 'municipio')
      .where('a.uf = :uf', { uf: uf.toUpperCase() })
      .orderBy('municipio', 'ASC')
      .getRawMany<{ municipio: string }>();

    return linhas.map((l) => l.municipio);
  }

  async alterarSituacao(solicitanteId: number, id: number, situacao: Situacao) {
    await this.exigirAprovado(solicitanteId);

    const alerta = await this.alertaRepository.findOne({ where: { id } });
    if (!alerta) throw new NotFoundException('Alerta não encontrado.');

    await this.alertaRepository.update(id, { situacao });
    return { id, situacao };
  }
}