import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Denuncias } from './denuncias.entity.js';
import { CreateDenunciaDto } from './dto/create-denuncias.dto.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Injectable()
export class DenunciasService {
  constructor(
    @InjectRepository(Denuncias)
    private readonly denunciasRepository: Repository<Denuncias>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Denuncias[]> {
    return await this.denunciasRepository.find({
        relations: { usuario: true},
    });
  }

  async create(dto: CreateDenunciaDto): Promise<Denuncias> {
    const protocoloExiste = await this.denunciasRepository.findOne({
        where: { protocolo: dto.protocolo },
    });
    if (protocoloExiste) {
        throw new ConflictException('Já existe uma denúncia cadastrada com este protocolo.')
    }

    if (dto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuarioId } });
      if (!usuario) {
        throw new NotFoundException('Usuário associado não encontrado.');
      }
    }

    const novaDenuncia = this.denunciasRepository.create(dto);
    return await this.denunciasRepository.save(novaDenuncia)
  }
}