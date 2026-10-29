import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import { Alerta } from './alertas.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('alertas')
export class AlertaController {
    constructor(private readonly alertaService: AlertasService) {}

    // Coordenadas exatas: só para pesquisador e admin.
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Pesquisador', 'Admin')
    async findAll(@Req() req: { user: { sub: number } }): Promise<Alerta[]> {
        return await this.alertaService.findAll(req.user.sub);
    }

    // Qualquer pessoa pode avisar. Se estiver logada, o alerta fica vinculado a ela.
    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    async create(@Body() dto: CreateAlertaDto, @Req() req: { user?: { sub: number } }): Promise<Alerta> {
        return await this.alertaService.create(dto, req.user?.sub);
    }
}