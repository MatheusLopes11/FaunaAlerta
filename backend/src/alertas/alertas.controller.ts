import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AlertasService } from './alertas.service.js';
import { CreateAlertaDto } from './dto/create-alertas.dto.js';
import { AlterarSituacaoDto, MunicipiosQueryDto, RelatorioAlertasQueryDto } from './dto/relatorio-alertas.dto.js';
import { Alerta } from './alertas.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { LIMITE_VIDEO, MAX_ARQUIVOS } from '../common/uploads.js';
import type { ArquivoEnviado } from '../common/uploads.js';

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

    @Post('recalcular-biomas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    recalcularBiomas() {
        return this.alertaService.recalcularBiomas();
    }

    // Qualquer pessoa pode avisar (com até 3 fotos ou vídeos). Se estiver logada, o alerta fica vinculado a ela.
    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    @UseInterceptors(FilesInterceptor('arquivos', MAX_ARQUIVOS, { limits: { fileSize: LIMITE_VIDEO, files: MAX_ARQUIVOS } }))
    async create(
        @Body() dto: CreateAlertaDto,
        @UploadedFiles() arquivos: ArquivoEnviado[] | undefined,
        @Req() req: { user?: { sub: number } },
    ): Promise<Alerta> {
        return await this.alertaService.create(dto, req.user?.sub, arquivos ?? []);
    }
}