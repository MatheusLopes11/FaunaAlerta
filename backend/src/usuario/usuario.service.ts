import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity.js';    
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.usuarioRepository.findOne({ where: { email: dto.email } });
    if (existe) {
        throw new ConflictException('E-mail já cadastrado no sistema.');
    }

    const { senha, ...dados } = dto;
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cadastro público cria sempre usuário comum, já aprovado.
    // Pesquisador tem rota própria; Admin é promovido pelo banco.
    const novo = this.usuarioRepository.create({
        ...dados,
        senhaHash,
        perfil: 'Usuario',
        statusCadastro: 'Aprovado',
    });
    const { senhaHash: _omitido, ...salvo } = await this.usuarioRepository.save(novo);
    return salvo as Usuario;
}

}