import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DenunciaHistoricoService } from './denuncia_historico.service.js';
import { CreateDenunciaHistoricoDto } from './dto/create-denuncia-historico.dto.js';
import { DenunciaHistorico } from './denuncia_historico.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('denuncia-historico')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
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