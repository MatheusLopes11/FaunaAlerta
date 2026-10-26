import { Controller, Get, Post, Body } from '@nestjs/common';
import { DenunciasService } from './denuncias.service.js';
import { CreateDenunciaDto } from './dto/create-denuncias.dto.js';
import { Denuncias } from './denuncias.entity.js';

@Controller('denuncias')
export class DenunciasController { 
    constructor(private readonly denunciasService: DenunciasService) {}

    @Get()
    async findAll(): Promise<Denuncias[]> {
        return await this.denunciasService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateDenunciaDto): Promise<Denuncias> {
        return await this.denunciasService.create(dto);
    }
}