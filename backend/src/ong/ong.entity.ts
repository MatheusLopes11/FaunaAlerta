import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ong')
export class Ong {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contato: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  site: string;

  @Column({ name: 'areas_atuacao', type: 'varchar', length: 255, nullable: true })
  areasAtuacao: string;

  @Column({ type: 'char', length: 2, nullable: true })
  uf: string;
}