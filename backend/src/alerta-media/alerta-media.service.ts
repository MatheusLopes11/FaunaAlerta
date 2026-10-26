import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertaMidia } from './alerta-media.entity.js';
import { Alerta } from '../alertas/alertas.entity.js';
import { CreateAlertaMidiaDto } from './dto/create-alerta-media.dto.js';

@Injectable()
export class AlertaMidiasService {
  constructor(
    @InjectRepository(AlertaMidia)
    private readonly alertaMidiaRepository: Repository<AlertaMidia>,
    @InjectRepository(Alerta)
    private readonly alertaRepository: Repository<Alerta>,
  ) {}

  async findAll(): Promise<AlertaMidia[]> {
    return await this.alertaMidiaRepository.find({
      relations: { alerta: true },
    });
  }

  async create(dto: CreateAlertaMidiaDto): Promise<AlertaMidia> {
    const alerta = await this.alertaRepository.findOne({ where: { id: dto.alertaId } });
    if (!alerta) {
      throw new NotFoundException('Alerta associado não encontrado.');
    }

    const novaMidia = this.alertaMidiaRepository.create(dto);
    return await this.alertaMidiaRepository.save(novaMidia);
  }
}