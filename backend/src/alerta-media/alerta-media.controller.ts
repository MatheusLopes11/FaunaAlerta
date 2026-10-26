import { Controller, Get, Post, Body } from '@nestjs/common';
import { AlertaMidiasService } from './alerta-media.service.js';
import { CreateAlertaMidiaDto } from './dto/create-alerta-media.dto.js';
import { AlertaMidia } from './alerta-media.entity.js';

@Controller('alerta-midias')
export class AlertaMidiaController {
    constructor(private readonly alertaMidiiasServices: AlertaMidiasService) {}

    @Get()
    async findAll(): Promise<AlertaMidia[]> {
        return await this.alertaMidiiasServices.findAll();
    }

    @Post()
    async create(@Body() dto: CreateAlertaMidiaDto): Promise<AlertaMidia> {
        return await this .alertaMidiiasServices.create(dto);
    }
}