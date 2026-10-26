import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DenunciaHistorico } from './denuncia_historico.entity.js';
import { Denuncias } from '../denuncias/denuncias.entity.js';
import { CreateDenunciaHistoricoDto } from './dto/create-denuncia-historico.dto.js';

@Injectable()
export class DenunciaHistoricoService {
  constructor(
    @InjectRepository(DenunciaHistorico)
    private readonly historicoRepository: Repository<DenunciaHistorico>,

    @InjectRepository(Denuncias)
    private readonly denunciaRepository: Repository<Denuncias>,
  ) {}

  async findAll(): Promise<DenunciaHistorico[]> {
    return await this.historicoRepository.find({
      relations: { denuncia: true },
    });
  }

  async create(dto: CreateDenunciaHistoricoDto): Promise<DenunciaHistorico> {
    const denuncia = await this.denunciaRepository.findOne({
         where: { id: dto.denunciaId } 
    });
    if (!denuncia) {
      throw new NotFoundException('Denúncia associada não encontrada.');
  }

  const novoHistorico = this.historicoRepository.create(dto);
  return await this.historicoRepository.save(novoHistorico);
  }
}