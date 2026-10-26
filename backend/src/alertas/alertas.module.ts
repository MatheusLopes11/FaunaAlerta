import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlertaController } from "./alertas.controller.js";
import { AlertasService } from "./alertas.service.js";
import { Alerta } from "./alertas.entity.js";
import { Especies } from "../especies/especies.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Alerta, Especies, Usuario])],
    controllers: [AlertaController],
    providers: [AlertasService],
})
export class AlertaModule {}