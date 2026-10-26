import { Controller, Get, Post, Body } from '@nestjs/common';
import { OngsService } from './ong.service.js';
import { CreateOngDto } from './dto/ong.dto.js';
import { Ong } from './ong.entity.js';

@Controller('ongs')
export class OngsController {
    constructor(private readonly ongsService: OngsService) {}

    @Get()
    async findAll(): Promise<Ong[]> {
        return await this,this.ongsService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateOngDto): Promise<Ong> {
        return await this.ongsService.create(dto);
    }
}