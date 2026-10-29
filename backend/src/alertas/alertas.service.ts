import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from './alertas.entity.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import { Especies } from '../especies/especies.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

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

  async findAll(solicitanteId: number): Promise<Alerta[]> {
    const solicitante = await this.usuarioRepository.findOne({ where: { id: solicitanteId } });
    if (!solicitante || solicitante.statusCadastro !== 'Aprovado') {
      throw new ForbiddenException('Seu cadastro ainda não foi aprovado.');
    }

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
}