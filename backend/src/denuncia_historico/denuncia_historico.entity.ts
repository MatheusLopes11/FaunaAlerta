import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Denuncias } from '../denuncias/denuncias.entity.js';

@Entity('denuncia_historico')
export class DenunciaHistorico {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ name: 'denuncia_id', type: 'int', unsigned: true, nullable: false })
    denunciaId: number;

    @ManyToOne(() => Denuncias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'denuncia_id' })
    denuncia: Denuncias;

    @Column({
      name: 'status_denun',
      type: 'enum',
      enum: ['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'],
      default: 'Recebida',
    })
    statusDenun: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';

    @Column({ type: 'varchar', length: 255, nullable: true })
    observacao: string;

    @Column({
      type: 'enum',
      enum: ['ORGAO', 'SISTEMA'],
      nullable: false,
    })
    origem: 'ORGAO' | 'SISTEMA';

    @CreateDateColumn({ name: 'criado_em', type: 'datetime' })
    criadoEm: Date;
}