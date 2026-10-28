import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 250, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 70, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255, nullable: false, select: false })
  senhaHash: string;

  @Column({
    type: 'enum',
    enum: ['Usuario', 'Pesquisador', 'Orgao', 'Admin'],
    default: 'Usuario',
  })
  perfil: 'Usuario' | 'Pesquisador' | 'Orgao' | 'Admin';

  @Column({
    name: 'status_cadastro',
    type: 'enum',
    enum: ['Aprovado', 'Pendente', 'Negado'],
    default: 'Pendente',
  })
  statusCadastro: 'Aprovado' | 'Pendente' | 'Negado';
}