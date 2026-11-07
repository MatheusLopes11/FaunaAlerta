import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    const jaExiste = await this.denunciaRecebidaRepository.findOne({ where: { protocolo: dto.protocolo } });
    if (jaExiste) {
      throw new ConflictException(`Denúncia com protocolo ${dto.protocolo} já existe.`);
    }
    const nova = this.denunciaRecebidaRepository.create(dto);
    return await this.denunciaRecebidaRepository.save(nova);
  }

  async statusPorProtocolo(protocolos: string[]) {
    if (protocolos.length === 0) return [];
    return await this.denunciaRecebidaRepository.find({
      where: { protocolo: In(protocolos) },
      select: { protocolo: true, statusDenun: true },
    });
  }

  // Status e mídias das denúncias do usuário (usado no histórico do perfil).
  async resumoPorProtocolo(protocolos: string[]): Promise<DenunciaRecebida[]> {
    if (protocolos.length === 0) return [];
    return await this.denunciaRecebidaRepository.find({
      where: { protocolo: In(protocolos) },
      relations: { midias: true },
    });
  }

  async atualizarStatus(protocolo: string, status: DenunciaRecebida['statusDenun']) {
    const denuncia = await this.denunciaRecebidaRepository.findOne({ where: { protocolo } });
    if (!denuncia) throw new NotFoundException('Protocolo não encontrado no órgão.');
    denuncia.statusDenun = status;
    return await this.denunciaRecebidaRepository.save(denuncia);
  }

  async remover(id: number): Promise<void> {
    await this.denunciaRecebidaRepository.delete(id);
  }
}