import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { DenunciasService } from './denuncias.service.js';
import { CreateDenunciaDto } from './dto/create-denuncias.dto.js';
import { PaginacaoQueryDto } from '../common/paginacao-query.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

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

    // Qualquer pessoa pode denunciar. Logada, a denúncia vai para o histórico dela.
    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    create(@Body() dto: CreateDenunciaDto, @Req() req: { user?: { sub: number } }) {
        return this.denunciasService.create(dto, req.user?.sub);
    }
}