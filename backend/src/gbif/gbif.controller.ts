// gbif.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { GbifImportService } from './gbif-import.service.js';
import { ImportarGbifDto } from './dto/importar-gbif.dto.js';

@Controller('gbif')
export class GbifController {
  constructor(private readonly importService: GbifImportService) {}

  @Post('importar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  importar(@Body() dto: ImportarGbifDto) {
    return this.importService.importar(dto.grupo, dto.quantidade);
  }
}