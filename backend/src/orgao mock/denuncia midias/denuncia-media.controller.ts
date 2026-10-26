import { Controller, Get, Post, Body } from '@nestjs/common';
import { DenunciaMidiasMockService } from './denuncia-midia.service.js';
import { CreateDenunciaMidiaMockDto } from './dto/create-denuncia-midias.dto.js';
import { DenunciaMidiaMock } from './denuncia-midia.entity.js';

@Controller('orgao-mock/midias')
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