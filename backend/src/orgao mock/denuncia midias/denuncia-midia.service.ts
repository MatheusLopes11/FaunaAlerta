import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DenunciaMidiaMock } from './denuncia-midia.entity.js';
import { CreateDenunciaMidiaMockDto } from './dto/create-denuncia-midias.dto.js';
import { DenunciaRecebida } from '../denuncia recebida/Denuncia-Recebida.entity.js';

@Injectable()
export class DenunciaMidiasMockService {
    constructor(
      @InjectRepository(DenunciaMidiaMock, 'orgaoMock')
      private readonly midiaRepository: Repository<DenunciaMidiaMock>,

      @InjectRepository(DenunciaRecebida, 'orgaoMock')
      private readonly denunciaRepository: Repository<DenunciaRecebida>,
    ) {}

    async findAll(): Promise<DenunciaMidiaMock[]> {
        return await this.midiaRepository.find({ relations: { denuncia: true}});
    }

    async create(dto: CreateDenunciaMidiaMockDto): Promise<DenunciaMidiaMock> {
        const denuncia = await this.denunciaRepository.findOne({ where: { id: dto.denunciaId }});
        if (!denuncia) {
            throw new NotFoundException('Denúncia associada não encontrada no órgão mock.');
        }

        const novaMidia = this.midiaRepository.create(dto);
        return await this.midiaRepository.save(novaMidia)
    }
}