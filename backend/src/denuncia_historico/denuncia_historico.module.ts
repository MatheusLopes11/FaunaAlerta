import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciaHistoricoController } from './denuncia_historico.controller.js';
import { DenunciaHistoricoService } from './denuncia_historico.service.js';
import { DenunciaHistorico } from './denuncia_historico.entity.js';
import { Denuncias } from '../denuncias/denuncias.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([DenunciaHistorico, Denuncias])],
    controllers: [DenunciaHistoricoController],
    providers: [DenunciaHistoricoService],
})
export class DenunciaHistoricoModule {}