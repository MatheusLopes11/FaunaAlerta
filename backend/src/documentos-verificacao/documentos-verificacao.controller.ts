import { Controller, Get, Post, Body } from '@nestjs/common';
import { DocumentosVerificacaoService } from './documentos-verificacao.service.js';
import { CreateDocumentoVerificaoDto } from './dto/create-documentos-verificacao.dto.js';
import { DocumentosVerificacao } from './documentos-verificacao.entity.js';

@Controller('documentos-verificacao')
export class DocumentosVerificacaoController {
    constructor(private readonly documentosService: DocumentosVerificacaoService) {}

    @Get()
    async findAll(): Promise<DocumentosVerificacao[]> {
        return await this.documentosService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateDocumentoVerificaoDto): Promise<DocumentosVerificacao> {
        return await this.documentosService.create(dto);
    }
}