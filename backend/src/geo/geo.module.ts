import { Module } from '@nestjs/common';
import { BiomaService } from './bioma.service.js';

@Module({
    providers: [BiomaService],
    exports: [BiomaService],
})
export class GeoModule {}