import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { EspeciesService } from './especies.service.js';
import { CreateEspecieDto } from './dto/create-especie.dto.js';
import { UpdateEspecieDto } from './dto/update-especie.dto.js';
import { ListEspeciesQueryDto } from './dto/list-especies-query.dto.js';

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
    create(@Body() dto: CreateEspecieDto) {
        return this.especiesService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEspecieDto) {
        return this.especiesService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.especiesService.remove(id);
    }
}