import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciaMidiasMockController } from "./denuncia-media.controller.js";
import { DenunciaMidiasMockService } from "./denuncia-midia.service.js";
import { DenunciaMidiaMock } from "./denuncia-midia.entity.js";
import { DenunciaRecebida } from "../denuncia recebida/Denuncia-Recebida.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([DenunciaMidiaMock, DenunciaRecebida], 'orgaoMock')],
    controllers: [DenunciaMidiasMockController],
    providers: [DenunciaMidiasMockService],
    exports: [DenunciaMidiasMockService],
})
export class DenunciaMidiaMockModule {}