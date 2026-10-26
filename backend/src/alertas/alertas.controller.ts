import { Controller, Get, Post, Body } from '@nestjs/common';
import { AlertasService } from './alertas.service.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import { Alerta } from './alertas.entity.js';

@Controller('alertas')
export class AlertaController {
    constructor(private readonly alertaService: AlertasService) {}

    @Get()
    async findAll(): Promise<Alerta[]> {
        return await this.alertaService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateAlertaDto): Promise<Alerta> {
        return await this.alertaService.create(dto);
    }
}