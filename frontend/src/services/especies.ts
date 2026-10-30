import { authHeaders, sair } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type Bioma = 'AMAZONIA' | 'CERRADO' | 'MATA ATLANTICA' | 'CAATINGA' | 'PAMPA' | 'PANTANAL'

export interface Especie {
    id: number
    nomePopular: string
    nomeCientifico: string
    origem: string
    statusConservacao: string
    descricao: string | null
    imagemUrl: string | null
    grupo: string
    nivelRisco: string
    descricaoRisco: string | null
    expectativaVidaMin: number | null
    expectativaVidaMax: number | null
    apareceEmCasas: boolean
    curiosidades: string | null
    fonte: string | null
    biomas: { bioma: Bioma }[]
    imagemCredito: string | null
    revisado: boolean
}

export interface ListaEspecies {
    data: Especie[]
    total: number
    page: number
    limit: number
}

export interface Filtros {
    page: number
    limit: number
    busca: string
    grupo: string
    status: string
    apareceEmCasas: boolean
    revisado?: boolean;
}

export async function listarEspecies(f: Filtros, signal?: AbortSignal): Promise<ListaEspecies> {
    const params = new URLSearchParams({ page: String(f.page), limit: String(f.limit) })
    if (f.busca) params.set('busca', f.busca)
    if (f.grupo) params.set('grupo', f.grupo)
    if (f.status) params.set('status', f.status)
    if (f.apareceEmCasas) params.set('apareceEmCasas', 'true')
    if (f.revisado !== undefined) params.set('revisado', String(f.revisado))

    const res = await fetch(`${API}/especies?${params}`, { signal })
    if (!res.ok) throw new Error('Não foi possível carregar as espécies.')
    return res.json()
}

export async function buscarEspecie(id: string, signal?: AbortSignal): Promise<Especie> {
    const res = await fetch(`${API}/especies/${id}`, { signal })
    if (res.status === 404) throw new Error('Espécie não encontrada.')
    if (!res.ok) throw new Error('Não foi possível carregar a espécie.')
    return res.json()
}

export const STATUS: Record<string, { nome: string; cor: string }> = {
    LC: { nome: 'Pouco preocupante', cor: '#14ae5c' },
    NT: { nome: 'Quase ameaçada', cor: '#8bc34a' },
    VU: { nome: 'Vulnerável', cor: '#d4a309' },
    EN: { nome: 'Em perigo', cor: '#d47e09' },
    CR: { nome: 'Criticamente em perigo', cor: '#b3261e' },
    EW: { nome: 'Extinta na natureza', cor: '#5c1515' },
    DD: { nome: 'Dados insuficientes', cor: '#777' },
    NE: { nome: 'Não avaliada', cor: '#999' },
}

export const RISCO: Record<string, { nome: string; cor: string }> = {
    NENHUM: { nome: 'Sem risco', cor: '#14ae5c' },
    BAIXO: { nome: 'Risco baixo', cor: '#8bc34a' },
    MODERADO: { nome: 'Risco moderado', cor: '#d47e09' },
    ALTO: { nome: 'Risco alto', cor: '#b3261e' },
}

export const GRUPOS: Record<string, string> = {
    MAMIFERO: 'Mamíferos',
    AVE: 'Aves',
    REPTIL: 'Répteis',
    ANFIBIO: 'Anfíbios',
    PEIXE: 'Peixes',
    ARACNIDEO: 'Aracnídeos',
    INSETO: 'Insetos',
    OUTRO: 'Outros',
}

export const BIOMA_ROTULO: Record<Bioma, string> = {
    AMAZONIA: 'Amazônia',
    CERRADO: 'Cerrado',
    'MATA ATLANTICA': 'Mata Atlântica',
    CAATINGA: 'Caatinga',
    PAMPA: 'Pampa',
    PANTANAL: 'Pantanal',
}

export function formatarBioma(b: string) {
    return BIOMA_ROTULO[b as Bioma] ?? b
}

export interface EspecieMapa {
    id: number
    nomePopular: string
    nomeCientifico: string
    statusConservacao: string
    imagemUrl: string | null
}

export type MapaBiomasDados = Record<Bioma, EspecieMapa[]>

export async function buscarMapaBiomas(signal?: AbortSignal): Promise<MapaBiomasDados> {
    const res = await fetch(`${API}/especies/mapa/biomas`, { signal })
    if (!res.ok) throw new Error('Não foi possível carregar os dados do mapa.')
    return res.json()
}

export interface EspeciePayload {
    nomePopular?: string
    nomeCientifico?: string
    origem?: string
    statusConservacao?: string
    grupo?: string
    nivelRisco?: string
    descricaoRisco?: string
    expectativaVidaMin?: number
    expectativaVidaMax?: number
    apareceEmCasas?: boolean
    descricao?: string
    curiosidades?: string
    imagemUrl?: string
    fonte?: string
    biomas?: Bioma[]
    revisado?: boolean
}

async function erroDaResposta(res: Response, padrao: string): Promise<Error> {
    if (res.status === 401) {
        sair()
        return new Error('Sua sessão expirou. Faça login novamente.')
    }
    if (res.status === 403) return new Error('Você não tem permissão para esta ação.')
    try {
        const j = await res.json()
        const msg = Array.isArray(j.message) ? j.message.join(' • ') : j.message
        return new Error(msg ?? padrao)
    } catch {
        return new Error(padrao)
    }
}

export async function criarEspecie(p: EspeciePayload): Promise<Especie> {
    const res = await fetch(`${API}/especies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(p),
    })
    if (!res.ok) throw await erroDaResposta(res, 'Não foi possível criar a espécie.')
    return res.json()
}

export async function atualizarEspecie(id: number, p: EspeciePayload): Promise<Especie> {
    const res = await fetch(`${API}/especies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(p),
    })
    if (!res.ok) throw await erroDaResposta(res, 'Não foi possível atualizar a espécie.')
    return res.json()
}

export async function excluirEspecie(id: number): Promise<void> {
    const res = await fetch(`${API}/especies/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
    if (!res.ok) throw await erroDaResposta(res, 'Não foi possível excluir a espécie.')
}

export interface ResultadoImportacao {
    grupo: string
    encontradas: number
    criadas: number
    puladas: number
    falhas: number
}

export async function importarGbif(grupo: string, quantidade: number): Promise<ResultadoImportacao> {
    const res = await fetch(`${API}/gbif/importar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ grupo, quantidade }),
    })
    if (!res.ok) throw await erroDaResposta(res, 'Não foi possível importar do GBIF.')
    return res.json()
}

export const RISCO_NAO_AVALIADO = { nome: 'Risco ainda não avaliado', cor: '#999' }

export function riscoDaEspecie(e: Especie) {
    return e.revisado ? (RISCO[e.nivelRisco] ?? RISCO_NAO_AVALIADO) : RISCO_NAO_AVALIADO
}
