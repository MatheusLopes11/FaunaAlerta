import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Alerta } from './alertas.entity.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import type { RelatorioAlertasQueryDto, Situacao } from './dto/relatorio-alertas.dto.js';
import { Especies } from '../especies/especies.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

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

  async create(dto: CreateAlertaDto, usuarioId?: number): Promise<Alerta> {
    if ((dto.latitude == null) !== (dto.longitude == null)) {
      throw new BadRequestException('Informe latitude e longitude juntas.');
    }

    if (dto.especieId) {
      const especie = await this.especieRepository.findOne({ where: { id: dto.especieId } });
      if (!especie) {
        throw new NotFoundException('Espécie associada não encontrada.');
      }
    }

    const novoAlerta = this.alertaRepository.create({ ...dto, usuarioId });
    return await this.alertaRepository.save(novoAlerta);
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