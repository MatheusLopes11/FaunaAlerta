import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EspeciesService } from "./especies.service.js";
import { EspeciesController } from "./especies.controller.js";
import { Especies } from "./especies.entity.js";
import { EspecieBioma } from "./especie-bioma.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Especies, EspecieBioma])],
    controllers: [EspeciesController],
    providers: [EspeciesService],
})
export class EspeciesModule {}