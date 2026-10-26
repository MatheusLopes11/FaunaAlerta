import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosVerificacaoController } from './documentos-verificacao.controller.js';
import { DocumentosVerificacaoService } from './documentos-verificacao.service.js';
import { DocumentosVerificacao } from './documentos-verificacao.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Module({
    imports: [ TypeOrmModule.forFeature([DocumentosVerificacao, Usuario])],
    controllers: [DocumentosVerificacaoController],
    providers: [DocumentosVerificacaoService],
})
export class DocumentosVerificacaoModule {}