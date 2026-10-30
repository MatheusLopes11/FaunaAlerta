import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PesquisadorService } from './pesquisador.service.js';
import { CreatePesquisadorDto } from './dto/create-pesquisador.Dto.js';
import { RegistroPesquisadorDto } from './dto/registro-pesquisador.dto.js';
import { Pesquisador } from './pesquisador.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('pesquisador')
export class PesquisadorController {
    constructor(private readonly pesquisadorService: PesquisadorService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    async findAll(): Promise<Pesquisador[]> {
        return await this.pesquisadorService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    async create(@Body() dto: CreatePesquisadorDto): Promise<Pesquisador> {
        return await this.pesquisadorService.create(dto);
    }

    @Post('registro')
    async registrar(@Body() dto: RegistroPesquisadorDto) {
        return await this.pesquisadorService.registrar(dto);
    }
}