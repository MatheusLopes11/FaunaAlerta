import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/usuario.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto) {
        const usuario = await this.usuarioRepository.findOne({
            where: { email: dto.email },
            select: { id: true, nome: true, email: true, senhaHash: true, perfil: true, statusCadastro: true },
        });

        const senhaOk = usuario ? await bcrypt.compare(dto.senha, usuario.senhaHash) : false;
        if (!usuario || !senhaOk) {
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }
        if (usuario.statusCadastro === 'Negado') {
            throw new ForbiddenException('Seu cadastro foi negado.');
        }

        const token = await this.jwtService.signAsync({ sub: usuario.id, perfil: usuario.perfil });

        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                statusCadastro: usuario.statusCadastro,
            },
        };
    }
}