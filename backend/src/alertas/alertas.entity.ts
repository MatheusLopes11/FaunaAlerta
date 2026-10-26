import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Especies } from '../especies/especies.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Entity('alertas')
export class Alerta {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ name: 'especie_id', type: 'int', unsigned: true, nullable: true })
    especieId: number;

    @ManyToOne(() => Especies, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'especie_id' })
    especie: Especies;

    @Column({ name: 'usuario_id', type: 'int', unsigned: true, nullable: true })
    usuarioId: number;

    @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column({ type: 'varchar', length: 100, nullable: false })
    municipio: string;

    @Column({ type: 'char', length: 2, nullable: false })
    uf: string;

    @Column({
      type: 'enum',
      enum: ['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL'],
      nullable: true,
    })
    bioma: 'AMAZONIA' | 'CERRADO' | 'MATA ATLANTICA' | 'CAATINGA' | 'PAMPA' | 'PANTANAL';

    @Column({ name: 'data_avistamento', type: 'date', nullable: false })
    dataAvistamento: string;

    @Column({ type: 'text', nullable: true })
    descricao: string;

    @Column({
      type: 'enum',
      enum: ['PENDENTE', 'VERIFICADO', 'REJEITADO'],
      default: 'PENDENTE',
    })
    situacao: 'PENDENTE' | 'VERIFICADO' | 'REJEITADO';
}