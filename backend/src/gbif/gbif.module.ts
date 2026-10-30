// gbif.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especies } from '../especies/especies.entity.js';
import { GbifController } from './gbif.controller.js';
import { GbifService } from './gbif.service.js';
import { GbifImportService } from './gbif-import.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Especies])],
  controllers: [GbifController],
  providers: [GbifService, GbifImportService],
})
export class GbifModule {}