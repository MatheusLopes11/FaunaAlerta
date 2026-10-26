import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciasRecebidasController } from './denuncia-recebida.controller.js';
import { DenunciasRecebidasService } from './denuncia-recebida.service.js';
import { DenunciaRecebida } from './Denuncia-Recebida.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([DenunciaRecebida], 'orgaoMock')],
    controllers: [DenunciasRecebidasController],
    providers: [DenunciasRecebidasService],
    exports: [DenunciasRecebidasService],
})
export class DenunciaRecebidaModule {}