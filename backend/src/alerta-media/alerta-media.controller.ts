import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AlertaMidiasService } from './alerta-media.service.js';
import { CreateAlertaMidiaDto } from './dto/create-alerta-media.dto.js';
import { AlertaMidia } from './alerta-media.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('alerta-midias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class AlertaMidiaController {
    constructor(private readonly alertaMidiiasServices: AlertaMidiasService) {}

    @Get()
    async findAll(): Promise<AlertaMidia[]> {
        return await this.alertaMidiiasServices.findAll();
    }

    @Post()
    async create(@Body() dto: CreateAlertaMidiaDto): Promise<AlertaMidia> {
        return await this.alertaMidiiasServices.create(dto);
    }
}