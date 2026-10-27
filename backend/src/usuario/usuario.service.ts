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

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuarioExiste = await this.usuarioRepository.findOne({
        where: { email: createUsuarioDto.email },
    });
    if (usuarioExiste) {
        throw new ConflictException('E-mail já cadastrado no sistema.');
    }

    const { senha, perfil, ...dados } = createUsuarioDto;
    const senhaHash = await bcrypt.hash(senha, await bcrypt.genSalt());

    // Cadastro público só pode virar Usuario ou Pesquisador. Admin é promovido pelo banco.
    const perfilPermitido = perfil === 'Pesquisador' ? 'Pesquisador' : 'Usuario';

    const novo = this.usuarioRepository.create({ ...dados, perfil: perfilPermitido, senhaHash });
    const { senhaHash: _omitido, ...salvo } = await this.usuarioRepository.save(novo);
    return salvo as Usuario;
}

}