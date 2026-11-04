import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import { AlterarSituacaoDto, MunicipiosQueryDto, RelatorioAlertasQueryDto } from './dto/relatorio-alertas.dto.js';
import { Alerta } from './alertas.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('alertas')
export class AlertaController {
    constructor(private readonly alertaService: AlertasService) {}

    // Coordenadas exatas: só para pesquisador aprovado e admin.
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Pesquisador', 'Admin')
    async findAll(@Req() req: { user: { sub: number } }): Promise<Alerta[]> {
        return await this.alertaService.findAll(req.user.sub);
    }

    @Get('relatorio')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Pesquisador', 'Admin')
    relatorio(@Req() req: { user: { sub: number } }, @Query() q: RelatorioAlertasQueryDto) {
        return this.alertaService.relatorio(req.user.sub, q);
    }

    @Get('municipios')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Pesquisador', 'Admin')
    municipios(@Req() req: { user: { sub: number } }, @Query() q: MunicipiosQueryDto) {
        return this.alertaService.municipios(req.user.sub, q.uf);
    }

    @Patch(':id/situacao')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Pesquisador', 'Admin')
    alterarSituacao(
        @Req() req: { user: { sub: number } },
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AlterarSituacaoDto,
    ) {
        return this.alertaService.alterarSituacao(req.user.sub, id, dto.situacao);
    }

    // Qualquer pessoa pode avisar. Se estiver logada, o alerta fica vinculado a ela.
    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    async create(@Body() dto: CreateAlertaDto, @Req() req: { user?: { sub: number } }): Promise<Alerta> {
        return await this.alertaService.create(dto, req.user?.sub);
    }
}