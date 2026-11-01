import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DenunciaMidiasMockService } from './denuncia-midia.service.js';
import { CreateDenunciaMidiaMockDto } from './dto/create-denuncia-midias.dto.js';
import { DenunciaMidiaMock } from './denuncia-midia.entity.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('orgao-mock/midias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class DenunciaMidiasMockController {
    constructor(private readonly service: DenunciaMidiasMockService) {}

    @Get()
    async findAll(): Promise<DenunciaMidiaMock[]> {
        return await this.service.findAll();
    }

    @Post()
    async create(@Body() dto: CreateDenunciaMidiaMockDto): Promise<DenunciaMidiaMock> {
        return await this.service.create(dto);
    }
}