import { BadGatewayException, Injectable } from '@nestjs/common';
import type {
  GbifFacetResponse, GbifOccurrence, GbifPage, GbifSpecies, GbifVernacularName,
} from './gbif.types.js';

type Params = Record<string, string | number | boolean | string[]>;

@Injectable()
export class GbifService {
  private readonly base = 'https://api.gbif.org/v1';

  // Método genérico: <T> é o tipo que esperamos receber de volta
  private async get<T>(caminho: string, params: Params = {}): Promise<T> {
    const url = new URL(`${this.base}${caminho}`);
    for (const [chave, valor] of Object.entries(params)) {
      if (Array.isArray(valor)) valor.forEach((v) => url.searchParams.append(chave, v));
      else url.searchParams.set(chave, String(valor));
    }

    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new BadGatewayException(`GBIF respondeu ${resposta.status} em ${caminho}`);
    }
    return (await resposta.json()) as T;
  }

  /** IDs das espécies mais registradas no Brasil para uma classe (ex.: 359 = mamíferos) */
  async listarEspeciesDoBrasil(classKey: number, quantidade: number): Promise<number[]> {
    const dados = await this.get<GbifFacetResponse>('/occurrence/search', {
      country: 'BR',
      classKey,
      occurrenceStatus: 'PRESENT',
      facet: 'speciesKey',
      facetLimit: quantidade,
      limit: 0,
    });
    return (dados.facets[0]?.counts ?? []).map((c) => Number(c.name));
  }

  /** Reúne os dados de uma espécie em 3 chamadas paralelas */
  async buscarEspecie(speciesKey: number) {
    const [especie, nomes, ocorrencias] = await Promise.all([
      this.get<GbifSpecies>(`/species/${speciesKey}`),
      this.get<GbifPage<GbifVernacularName>>(`/species/${speciesKey}/vernacularNames`, { limit: 100 }),
      this.get<GbifPage<GbifOccurrence>>('/occurrence/search', {
        taxonKey: speciesKey,
        country: 'BR',
        mediaType: 'StillImage',
        license: ['CC0_1_0', 'CC_BY_4_0'], // só imagens com licença livre
        limit: 1,
      }),
    ]);

    const nomePopular = nomes.results.find((n) => n.language === 'por')?.vernacularName ?? null;
    const midia = ocorrencias.results[0]?.media?.[0];

    return {
      gbifKey: speciesKey,
      nomeCientifico: especie.canonicalName ?? especie.scientificName,
      classe: especie.class ?? null,
      nomePopular,
      imagemUrl: midia?.identifier ?? null,
      imagemCredito: midia ? `${midia.creator ?? 'Autor desconhecido'} (${midia.license ?? 'licença n/d'})` : null,
    };
  }
}