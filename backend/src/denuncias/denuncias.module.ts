import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciasController } from './denuncias.controller.js';
import { DenunciasService } from './denuncias.service.js';
import { Denuncias } from './denuncias.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Denuncias, Usuario])],
    controllers: [DenunciasController],
    providers: [DenunciasService],
})
export class DenunciasModule {}