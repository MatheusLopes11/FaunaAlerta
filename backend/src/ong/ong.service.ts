import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ong } from './ong.entity.js';
import { CreateOngDto } from './dto/ong.dto.js';

@Injectable()
export class OngsService {
  constructor(
    @InjectRepository(Ong)
    private readonly ongRepository: Repository<Ong>,
  ) {}

  async findAll(): Promise<Ong[]> {
    return await this.ongRepository.find();
  }

  async create(dto: CreateOngDto): Promise<Ong> {
    const novaOng = this.ongRepository.create(dto);
    return await this.ongRepository.save(novaOng);
  }
}