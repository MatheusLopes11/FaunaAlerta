import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EspeciesService } from './especies.service.js';
import { CreateEspecieDto } from './dto/create-especie.dto.js';
import { UpdateEspecieDto } from './dto/update-especie.dto.js';
import { ListEspeciesQueryDto } from './dto/list-especies-query.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('especies')
export class EspeciesController {
    constructor(private readonly especiesService: EspeciesService) {}

    @Get()
    findAll(@Query() query: ListEspeciesQueryDto) {
        return this.especiesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.especiesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    create(@Body() dto: CreateEspecieDto) {
        return this.especiesService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEspecieDto) {
        return this.especiesService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.especiesService.remove(id);
    }
}