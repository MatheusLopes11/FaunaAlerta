import { Controller, Get, Post, Body, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DenunciasService } from './denuncias.service.js';
import { CreateDenunciaDto } from './dto/create-denuncias.dto.js';
import { PaginacaoQueryDto } from '../common/paginacao-query.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { LIMITE_VIDEO, MAX_ARQUIVOS } from '../common/uploads.js';
import type { ArquivoEnviado } from '../common/uploads.js';

@Controller('denuncias')
export class DenunciasController {
    constructor(private readonly denunciasService: DenunciasService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    findAll() {
        return this.denunciasService.findAll();
    }

    @Get('minhas')
    @UseGuards(JwtAuthGuard)
    minhas(@Req() req: { user: { sub: number } }, @Query() q: PaginacaoQueryDto) {
        return this.denunciasService.minhas(req.user.sub, q.page, q.limit);
    }

    // Qualquer pessoa pode denunciar (com até 3 fotos ou vídeos). Logada, a denúncia vai para o histórico dela.
    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    @UseInterceptors(FilesInterceptor('arquivos', MAX_ARQUIVOS, { limits: { fileSize: LIMITE_VIDEO, files: MAX_ARQUIVOS } }))
    create(
        @Body() dto: CreateDenunciaDto,
        @UploadedFiles() arquivos: ArquivoEnviado[] | undefined,
        @Req() req: { user?: { sub: number } },
    ) {
        return this.denunciasService.create(dto, req.user?.sub, arquivos ?? []);
    }
}