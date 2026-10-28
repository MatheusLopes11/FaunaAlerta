import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { Especies } from './especies.entity.js';
import { EspecieBioma } from './especie-bioma.entity.js';
import { CreateEspecieDto } from './dto/create-especie.dto.js';
import { UpdateEspecieDto } from './dto/update-especie.dto.js';
import { ListEspeciesQueryDto } from './dto/list-especies-query.dto.js';

@Injectable()
export class EspeciesService {
    constructor(
        @InjectRepository(Especies)
        private readonly especiesRepository: Repository<Especies>,
        @InjectRepository(EspecieBioma)
        private readonly biomaRepository: Repository<EspecieBioma>,
    ) {}

    async findAll(q: ListEspeciesQueryDto) {
        const page = q.page ?? 1;
        const limit = q.limit ?? 12;

        const base: FindOptionsWhere<Especies> = {};
        if (q.grupo) base.grupo = q.grupo;
        if (q.status) base.statusConservacao = q.status;
        if (q.apareceEmCasas !== undefined) base.apareceEmCasas = q.apareceEmCasas;

        const where: FindOptionsWhere<Especies>[] = q.busca
            ? [
                  { ...base, nomePopular: Like(`%${q.busca}%`) },
                  { ...base, nomeCientifico: Like(`%${q.busca}%`) },
              ]
            : [base];

        const [data, total] = await this.especiesRepository.findAndCount({
            where,
            relations: { biomas: true },
            order: { nomePopular: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data, total, page, limit };
    }

    async findOne(id: number): Promise<Especies> {
        const especie = await this.especiesRepository.findOne({ where: { id }, relations: { biomas: true } });
        if (!especie) throw new NotFoundException('Espécie não encontrada.');
        return especie;
    }

    async create(dto: CreateEspecieDto): Promise<Especies> {
        const { biomas, ...resto } = dto;
        const nova = this.especiesRepository.create({
            ...resto,
            biomas: biomas?.map((bioma) => ({ bioma })) as EspecieBioma[],
        });
        const salva = await this.especiesRepository.save(nova);
        return this.findOne(salva.id);
    }

    async update(id: number, dto: UpdateEspecieDto): Promise<Especies> {
        await this.findOne(id);
        const { biomas, ...resto } = dto;

        if (Object.keys(resto).length > 0) {
            await this.especiesRepository.update(id, resto);
        }
        if (biomas) {
            await this.biomaRepository.delete({ especieId: id });
            if (biomas.length > 0) {
                await this.biomaRepository.save(biomas.map((bioma) => ({ especieId: id, bioma })));
            }
        }
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.especiesRepository.delete(id);
    }

    // MAPA
    async mapaBiomas() {
    const BIOMAS = ['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL'];

    const linhas = await this.biomaRepository.find({
        where: { especie: { statusConservacao: In(['NT', 'VU', 'EN', 'CR', 'EW']) } },
        relations: { especie: true },
    });

    const resultado: Record<string, { id: number; nomePopular: string; nomeCientifico: string; statusConservacao: string; imagemUrl: string | null }[]> = {};
    for (const b of BIOMAS) resultado[b] = [];

    for (const l of linhas) {
        resultado[l.bioma].push({
            id: l.especie.id,
            nomePopular: l.especie.nomePopular,
            nomeCientifico: l.especie.nomeCientifico,
            statusConservacao: l.especie.statusConservacao,
            imagemUrl: l.especie.imagemUrl,
        });
    }
    for (const b of BIOMAS) resultado[b].sort((a, c) => a.nomePopular.localeCompare(c.nomePopular));

    return resultado;
}
}