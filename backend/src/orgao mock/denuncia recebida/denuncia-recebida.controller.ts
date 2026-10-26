import { Controller, Get, Post, Body } from '@nestjs/common';
import { DenunciasRecebidasService } from './denuncia-recebida.service.js';
import { DenunciaRecebida } from './Denuncia-Recebida.entity.js';
import { CreateDenunciaRecebidaDto } from './dto/create-denuncia-recebida.dto.js';

@Controller('orgao-mock/denuncias')
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
}