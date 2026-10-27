import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { Usuario } from './usuario.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    async findAll(): Promise<Usuario[]> {
        return await this.usuarioService.findAll();
    }

    @Post()
    async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
        return await this.usuarioService.create(createUsuarioDto);
    }
}