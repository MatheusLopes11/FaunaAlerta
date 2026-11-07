import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciasController } from './denuncias.controller.js';
import { DenunciasService } from './denuncias.service.js';
import { Denuncias } from './denuncias.entity.js';
import { DenunciaHistorico } from '../denuncia_historico/denuncia_historico.entity.js';
import { DenunciaRecebidaModule } from '../orgao mock/denuncia recebida/denuncia-recebida.module.js';
import { DenunciaMidiaMockModule } from '../orgao mock/denuncia midias/denuncia-media.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Denuncias, DenunciaHistorico]), DenunciaRecebidaModule, DenunciaMidiaMockModule],
    controllers: [DenunciasController],
    providers: [DenunciasService],
})
export class DenunciasModule {}