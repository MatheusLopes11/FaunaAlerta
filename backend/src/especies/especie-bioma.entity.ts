import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Especies } from './especies.entity.js';

export type Bioma = 'AMAZONIA' | 'CERRADO' | 'MATA ATLANTICA' | 'CAATINGA' | 'PAMPA' | 'PANTANAL';

@Entity('Especie_biomas')
export class EspecieBioma {
    @PrimaryColumn({ name: 'especie_id', type: 'int', unsigned: true })
    especieId: number;

    @PrimaryColumn({
        type: 'enum',
        enum: ['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL'],
    })
    bioma: Bioma;

    @ManyToOne('Especies', 'biomas', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'especie_id' })
    especie: Especies;
}