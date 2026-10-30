import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especies } from '../especies/especies.entity.js';
import { GbifService } from './gbif.service.js';

// Seu enum `grupo` ↔ classes do GBIF
export const CLASSES_GBIF: Record<string, { classKey: number }> = {
  MAMIFERO: { classKey: 359 },
  AVE: { classKey: 212 },
  REPTIL: { classKey: 358 },
  ANFIBIO: { classKey: 131 },
  ARACNIDEO: { classKey: 367 },
  INSETO: { classKey: 216 },
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
    const { classKey } = CLASSES_GBIF[grupo];
    const chaves = await this.gbif.listarEspeciesDoBrasil(classKey, quantidade);

    let criadas = 0, puladas = 0, falhas = 0;

    // Sequencial de propósito: não "metralha" o GBIF com milhares de chamadas
    for (const chave of chaves) {
      try {
        const jaExiste = await this.especiesRepository.findOne({ where: { gbifKey: chave } });
        if (jaExiste) { puladas++; continue; }

        const d = await this.gbif.buscarEspecie(chave);

        // nome_popular é UNIQUE: se faltar ou colidir, usa o científico
        let nomePopular = d.nomePopular ?? d.nomeCientifico;
        const colisao = await this.especiesRepository.findOne({ where: { nomePopular } });
        if (colisao) nomePopular = `${nomePopular} (${d.nomeCientifico})`.slice(0, 120);

        await this.especiesRepository.save(
          this.especiesRepository.create({
            gbifKey: d.gbifKey,
            nomePopular,
            nomeCientifico: d.nomeCientifico,
            origem: 'NATIVA',        // revisar depois: o GBIF não informa isso com confiança
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
    return { grupo, encontradas: chaves.length, criadas, puladas, falhas };
  }
}