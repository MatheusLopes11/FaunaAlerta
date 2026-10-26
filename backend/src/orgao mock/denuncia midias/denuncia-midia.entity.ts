import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DenunciaRecebida } from '../denuncia recebida/Denuncia-Recebida.entity.js';

@Entity('denuncia_midias')
export class DenunciaMidiaMock {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'denuncia_id', type: 'int', unsigned: true, nullable: false })
  denunciaId: number;

  @ManyToOne('DenunciaRecebida', (denuncia: any) => denuncia.midias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'denuncia_id' })
  denuncia: any;

  @Column({
    type: 'enum',
    enum: ['FOTO', 'VIDEO'],
    nullable: false,
  })
  tipo: 'FOTO' | 'VIDEO';

  @Column({ type: 'varchar', length: 500, nullable: false })
  url: string;

  @Column({ name: 'denunciante_nome', type: 'varchar', length: 150, nullable: true })
  denuncianteNome: string;

  @Column({ name: 'denunciante_email', type: 'varchar', length: 150, nullable: true })
  denuncianteEmail: string;

  @Column({ name: 'denunciante_telefone', type: 'varchar', length: 20, nullable: true })
  denuncianteTelefone: string;
}