import { Controller, Get, Post, Body } from '@nestjs/common';
import { DenunciaHistoricoService } from './denuncia_historico.service.js';
import { CreateDenunciaHistoricoDto } from './dto/create-denuncia-historico.dto.js';
import { DenunciaHistorico } from './denuncia_historico.entity.js';

@Controller('denuncia-historico')
export class DenunciaHistoricoController {
  constructor(private readonly historicoService: DenunciaHistoricoService) {}

  @Get()
  async findAll(): Promise<DenunciaHistorico[]> {
    return await this.historicoService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateDenunciaHistoricoDto): Promise<DenunciaHistorico> {
    return await this.historicoService.create(dto);
  }
}