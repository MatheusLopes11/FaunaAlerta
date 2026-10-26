import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DenunciaRecebida } from './Denuncia-Recebida.entity.js';
import { CreateDenunciaRecebidaDto } from './dto/create-denuncia-recebida.dto.js';

@Injectable()
export class DenunciasRecebidasService {
  constructor(
    @InjectRepository(DenunciaRecebida, 'orgaoMock')
    private readonly denunciaRecebidaRepository: Repository<DenunciaRecebida>,
  ) {}

  async findAll(): Promise<DenunciaRecebida[]> {
    return await this.denunciaRecebidaRepository.find({ relations: { midias: true } });
  }

  async create(dto: CreateDenunciaRecebidaDto): Promise<DenunciaRecebida> {
    const jaExiste = await this.denunciaRecebidaRepository.findOne({
      where: { protocolo: dto.protocolo },
    });

    if (jaExiste) {
      throw new ConflictException(`Denúncia com protocolo ${dto.protocolo} já existe.`);
    }

    const nova = this.denunciaRecebidaRepository.create(dto);
    return await this.denunciaRecebidaRepository.save(nova);
  }
}