import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pesquisador } from './pesquisador.entity.js';
import { CreatePesquisadorDto } from './dto/create-pesquisador.Dto.js';
import { RegistroPesquisadorDto } from './dto/registro-pesquisador.dto.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Injectable()
export class PesquisadorService {
    constructor(
        @InjectRepository(Pesquisador)
        private readonly pesquisadorRepository: Repository<Pesquisador>,

        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async findAll(): Promise<Pesquisador[]> {
        return await this.pesquisadorRepository.find({ relations: { usuario: true } });
    }

    async create(dto: CreatePesquisadorDto): Promise<Pesquisador> {
        const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuarioId } });
        if (!usuario) {
            throw new NotFoundException('Usuário associado não encontrado.');
        }

        const emailExiste = await this.pesquisadorRepository.findOne({
            where: { emailInstituicional: dto.emailInstituicional },
        });
        if (emailExiste) {
            throw new ConflictException('E-mail institucional já cadastrado no sistema.');
        }

        const novoPesquisador = this.pesquisadorRepository.create({ ...dto, usuarioId: dto.usuarioId });
        return await this.pesquisadorRepository.save(novoPesquisador);
    }

    async registrar(dto: RegistroPesquisadorDto) {
        const existe = await this.usuarioRepository.findOne({ where: { email: dto.email } });
        if (existe) {
            throw new ConflictException('E-mail já cadastrado no sistema.');
        }

        const senhaHash = await bcrypt.hash(dto.senha, 10);

        await this.pesquisadorRepository.manager.transaction(async (m) => {
            const usuario = await m.save(
                m.create(Usuario, {
                    nome: dto.nome,
                    email: dto.email,
                    telefone: dto.telefone,
                    senhaHash,
                    perfil: 'Pesquisador',
                    statusCadastro: 'Pendente',
                }),
            );
            await m.save(
                m.create(Pesquisador, {
                    usuarioId: usuario.id,
                    instituicao: dto.instituicao,
                    areaPesquisa: dto.areaPesquisa,
                    linkLattesOrcid: dto.linkLattesOrcid,
                    emailInstituicional: dto.email,
                }),
            );
        });

        return { mensagem: 'Cadastro enviado para análise.' };
    }
}