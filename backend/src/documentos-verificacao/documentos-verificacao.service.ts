import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentosVerificacao } from './documentos-verificacao.entity.js';
import { CreateDocumentoVerificaoDto } from './dto/create-documentos-verificacao.dto.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Injectable()
export class DocumentosVerificacaoService {
    constructor(
        @InjectRepository(DocumentosVerificacao)
        private readonly documentoRepository: Repository<DocumentosVerificacao>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async findAll(): Promise<DocumentosVerificacao[]> {
        return await this.documentoRepository.find({
            relations: { usuario: true }
        });
    }

    async create(dto: CreateDocumentoVerificaoDto): Promise<DocumentosVerificacao> {
        const usuario = await this.usuarioRepository.findOne({ where: {id: dto.usuarioId }});
        if (!usuario) {
            throw new NotFoundException('Usuário associado não encontrado');
        }

        const novoDocumento = this.documentoRepository.create({
            ...dto,
            usuarioId: dto.usuarioId,
        });

        return await this.documentoRepository.save(novoDocumento);
    }
}