import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<Alerta[]> {
    return await this.alertaRepository.find({
      relations: { especie: true, usuario: true },
    });
  }

  async create(dto: CreateAlertaDto): Promise<Alerta> {
    if (dto.especieId) {
      const especie = await this.especieRepository.findOne({ where: { id: dto.especieId } });
      if (!especie) {
        throw new NotFoundException('Espécie associada não encontrada.');
      }
    }

    if (dto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuarioId } });
      if (!usuario) {
        throw new NotFoundException('Usuário associado não encontrado.');
      }
    }

    const novoAlerta = this.alertaRepository.create(dto);
    return await this.alertaRepository.save(novoAlerta);
  }
}