import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertaMidiaController } from './alerta-media.controller.js';
import { AlertaMidiasService } from './alerta-media.service.js';
import { AlertaMidia } from './alerta-media.entity.js';
import { Alerta } from '../alertas/alertas.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([AlertaMidia, Alerta])],
    controllers: [AlertaMidiaController],
    providers: [AlertaMidiasService],
})
export class AlertaMidiaModule {}