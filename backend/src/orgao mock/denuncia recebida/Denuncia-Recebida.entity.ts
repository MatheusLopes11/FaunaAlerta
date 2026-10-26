import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { DenunciaMidiaMock } from '../denuncia midias/denuncia-midia.entity.js';

@Entity('denuncias_recebidas')
export class DenunciaRecebida {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  protocolo: string;

  @Column({
    type: 'enum',
    enum: ['CACA', 'PESCA', 'MAUS_TRATOS', 'TRAFICO', 'OUTRO'],
    nullable: false,
  })
  tipo: 'CACA' | 'PESCA' | 'MAUS_TRATOS' | 'TRAFICO' | 'OUTRO';

  @Column({ type: 'text', nullable: false })
  descricao: string;

  @Column({ name: 'local_descricao', type: 'varchar', length: 255, nullable: true })
  localDescricao: string;

  @Column({ name: 'data_ocorrencia', type: 'date', nullable: true })
  dataOcorrencia: string;

  @Column({
    name: 'status_denun',
    type: 'enum',
    enum: ['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'],
    default: 'Recebida',
  })
  statusDenun: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';

  @CreateDateColumn({ name: 'recebida_em', type: 'datetime' })
  recebidaEm: Date;

  @OneToMany(() => DenunciaMidiaMock, (midia) => midia.denuncia)
  midias: DenunciaMidiaMock[];
}