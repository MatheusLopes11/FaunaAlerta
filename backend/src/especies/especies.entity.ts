import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EspecieBioma } from './especie-bioma.entity.js';

@Entity('Especies')
export class Especies {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ name: 'nome_popular', type: 'varchar', length: 120, unique: true, nullable: false })
    nomePopular: string;

    @Column({ name: 'nome_cientifico', type: 'varchar', length: 150, unique: true, nullable: false })
    nomeCientifico: string;

    @Column({ type: 'enum', enum: ['NATIVA', 'EXOTICA', 'EXOTICA_INVASORA'], nullable: false })
    origem: string;

    @Column({
        name: 'status_conservacao',
        type: 'enum',
        enum: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'DD', 'NE'],
        default: 'NE',
        nullable: false,
    })
    statusConservacao: string;

    @Column({ type: 'text', nullable: true })
    descricao: string;

    @Column({ name: 'imagem_url', type: 'varchar', length: 500, nullable: true })
    imagemUrl: string;

    @Column({
        type: 'enum',
        enum: ['MAMIFERO', 'AVE', 'REPTIL', 'ANFIBIO', 'PEIXE', 'ARACNIDEO', 'INSETO', 'OUTRO'],
        default: 'OUTRO',
    })
    grupo: string;

    @Column({ name: 'nivel_risco', type: 'enum', enum: ['NENHUM', 'BAIXO', 'MODERADO', 'ALTO'], default: 'NENHUM' })
    nivelRisco: string;

    @Column({ name: 'descricao_risco', type: 'text', nullable: true })
    descricaoRisco: string;

    @Column({ name: 'expectativa_vida_min', type: 'smallint', unsigned: true, nullable: true })
    expectativaVidaMin: number;

    @Column({ name: 'expectativa_vida_max', type: 'smallint', unsigned: true, nullable: true })
    expectativaVidaMax: number;

    @Column({ name: 'aparece_em_casas', type: 'boolean', default: false })
    apareceEmCasas: boolean;

    @Column({ type: 'text', nullable: true })
    curiosidades: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fonte: string;

    @OneToMany(() => EspecieBioma, (eb) => eb.especie, { cascade: ['insert'] })
    biomas: EspecieBioma[];
}