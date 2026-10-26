import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngsController } from './ong.controller.js';
import { OngsService } from './ong.service.js';
import { Ong } from './ong.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Ong])],
    controllers: [OngsController],
    providers: [OngsService]
})

export class OngsModule {}