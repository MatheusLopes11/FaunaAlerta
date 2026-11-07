import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type Bioma = 'AMAZONIA' | 'CERRADO' | 'MATA ATLANTICA' | 'CAATINGA' | 'PAMPA' | 'PANTANAL';

const NOMES = new Set(['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL']);

interface Poligono {
    aneis: number[][][]; // o primeiro é o contorno, os demais são "buracos"
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

interface AreaBioma {
    bioma: Bioma;
    poligonos: Poligono[];
}

@Injectable()
export class BiomaService implements OnModuleInit {
    private readonly logger = new Logger(BiomaService.name);
    private areas: AreaBioma[] = [];

    async onModuleInit() {
        try {
            const texto = await readFile(join(process.cwd(), 'data', 'biomas.json'), 'utf-8');
            this.areas = this.carregar(JSON.parse(texto));
            this.logger.log(`Biomas carregados (${this.areas.length} áreas).`);
        } catch {
            this.logger.warn('Arquivo data/biomas.json não encontrado ou inválido: o bioma dos alertas não será calculado.');
        }
    }

    identificar(lat: number, lng: number): Bioma | null {
        for (const area of this.areas) {
            for (const p of area.poligonos) {
                if (lng < p.minX || lng > p.maxX || lat < p.minY || lat > p.maxY) continue;
                const [externo, ...buracos] = p.aneis;
                if (externo && this.dentroDoAnel(lng, lat, externo) && !buracos.some((b) => this.dentroDoAnel(lng, lat, b))) {
                    return area.bioma;
                }
            }
        }
        return null;
    }

    private carregar(geo: any): AreaBioma[] {
        const resultado: AreaBioma[] = [];
        for (const f of geo?.features ?? []) {
            const bioma = this.nomeDoBioma(f?.properties);
            const g = f?.geometry;
            if (!bioma || !g) continue;

            const listas: number[][][][] = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
            const poligonos: Poligono[] = listas.map((aneis) => {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (const [x, y] of aneis[0] ?? []) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
                return { aneis, minX, minY, maxX, maxY };
            });
            resultado.push({ bioma, poligonos });
        }
        return resultado;
    }

    // Procura em qualquer propriedade um texto que seja o nome de um bioma.
    private nomeDoBioma(props: unknown): Bioma | null {
        if (!props || typeof props !== 'object') return null;
        for (const v of Object.values(props as Record<string, unknown>)) {
            if (typeof v !== 'string') continue;
            const k = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
            if (NOMES.has(k)) return k as Bioma;
        }
        return null;
    }

    private dentroDoAnel(x: number, y: number, anel: number[][]): boolean {
        let dentro = false;
        for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
            const [xi, yi] = anel[i];
            const [xj, yj] = anel[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
        }
        return dentro;
    }
}