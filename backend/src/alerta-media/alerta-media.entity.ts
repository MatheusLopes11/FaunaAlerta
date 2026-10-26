import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Alerta } from '../alertas/alertas.entity.js';

@Entity('alerta_midias')
export class AlertaMidia {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ name: 'alerta_id', type: 'int', unsigned: true, nullable: false })
    alertaId: number;

    @ManyToOne(() => Alerta, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'alerta_id' })
    alerta: Alerta;

    @Column({
      type: 'enum',
      enum: ['FOTO', 'VIDEO'],
      nullable: false,
    })
    tipo: 'FOTO' | 'VIDEO';

    @Column({ type: 'varchar', length: 500, nullable: false })
    url: string;
}