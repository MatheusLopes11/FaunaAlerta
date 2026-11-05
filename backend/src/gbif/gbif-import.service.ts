import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especies } from '../especies/especies.entity.js';
import { GbifService } from './gbif.service.js';

// Seu enum `grupo` ↔ classes do GBIF
export const CLASSES_GBIF: Record<string, { classKeys: number[] }> = {
  MAMIFERO: { classKeys: [359] },
  AVE: { classKeys: [212] },
  REPTIL: { classKeys: [11592253, 11418114, 11493978] },
  ANFIBIO: { classKeys: [131] },
  ARACNIDEO: { classKeys: [367] },
  INSETO: { classKeys: [216] },
  PEIXE: { classKeys: [204, 119, 234] }
};

@Injectable()
export class GbifImportService {
  private readonly logger = new Logger(GbifImportService.name);

  constructor(
    private readonly gbif: GbifService,
    @InjectRepository(Especies)
    private readonly especiesRepository: Repository<Especies>,
  ) {}

  async importar(grupo: string, quantidade: number) {
    const { classKeys } = CLASSES_GBIF[grupo];
    
    const chaves: number[] = [];

    
    for (const key of classKeys) {
      
      const qtdPorClasse = Math.ceil(quantidade / classKeys.length);
      
      const chavesDaClasse = await this.gbif.listarEspeciesDoBrasil(key, qtdPorClasse);
      chaves.push(...chavesDaClasse);
    }

   
    const chavesUnicas = [...new Set(chaves)].slice(0, quantidade);

    let criadas = 0, puladas = 0, falhas = 0;

    
    for (const chave of chavesUnicas) {
      try {
        const jaExiste = await this.especiesRepository.findOne({ where: { gbifKey: chave } });
        if (jaExiste) { puladas++; continue; }

        const d = await this.gbif.buscarEspecie(chave);

        let nomePopular = d.nomePopular ?? d.nomeCientifico;
        const colisao = await this.especiesRepository.findOne({ where: { nomePopular } });
        if (colisao) nomePopular = `${nomePopular} (${d.nomeCientifico})`.slice(0, 120);

        await this.especiesRepository.save(
          this.especiesRepository.create({
            gbifKey: d.gbifKey,
            nomePopular,
            nomeCientifico: d.nomeCientifico,
            origem: 'NATIVA',        
            grupo,
            imagemUrl: d.imagemUrl,
            imagemCredito: d.imagemCredito,
            fonte: 'GBIF',
          }),
        );
        criadas++;
      } catch (erro) {
        falhas++;
        this.logger.warn(`Falha na espécie ${chave}: ${(erro as Error).message}`);
      }
    }
    return { grupo, encontradas: chavesUnicas.length, criadas, puladas, falhas };
  }
}
