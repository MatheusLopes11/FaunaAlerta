import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Usuario } from '../usuario/usuario.entity.js'

@Entity('denuncias')
export class Denuncias {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    protocolo: string;

    @Column({ name: 'usuario_id', type: 'int', unsigned: true, nullable: true })
    usuarioId: number;

    @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column({
      name: 'status_atual',
      type: 'enum',
      enum: ['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'],
      default: 'Recebida',
    })
    statusAtual: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';

    @Column({
      name: 'status_envio',
      type: 'enum',
      enum: ['PENDENTE', 'ENVIADA', 'FALHA'],
      default: 'PENDENTE',
    })
    statusEnvio: 'PENDENTE' | 'ENVIADA' | 'FALHA';

    @CreateDateColumn({ name: 'criado_em', type: 'datetime' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em', type: 'datetime' })
    atualizadoEm: Date;
}