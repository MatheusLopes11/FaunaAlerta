import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { DenunciasRecebidasService } from './denuncia-recebida.service.js';
import { DenunciaRecebida } from './Denuncia-Recebida.entity.js';
import { CreateDenunciaRecebidaDto } from './dto/create-denuncia-recebida.dto.js';
import { AtualizarStatusDto } from './dto/atualizar-status.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('orgao-mock/denuncias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class DenunciasRecebidasController {
    constructor(private readonly service: DenunciasRecebidasService) {}

    @Get()
    async findAll(): Promise<DenunciaRecebida[]> {
        return await this.service.findAll();
    }

    @Post()
    async create(@Body() dto: CreateDenunciaRecebidaDto): Promise<DenunciaRecebida> {
        return await this.service.create(dto);
    }

    @Patch(':protocolo/status')
    async atualizarStatus(@Param('protocolo') protocolo: string, @Body() dto: AtualizarStatusDto) {
        return await this.service.atualizarStatus(protocolo, dto.statusDenun);
    }
}