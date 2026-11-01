import { authHeaders, lerErro, sair } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const TIPOS_DENUNCIA: Record<string, string> = {
    CACA: 'Caça ilegal',
    PESCA: 'Pesca ilegal',
    MAUS_TRATOS: 'Maus-tratos',
    TRAFICO: 'Tráfico de animais',
    ABANDONO: 'Abandono',
    OUTRO: 'Outros',
}

export const STATUS_DENUNCIA: Record<string, { nome: string; cor: string }> = {
    Recebida: { nome: 'Pendente', cor: '#d47e09' },
    Em_validacao: { nome: 'Em validação', cor: '#d47e09' },
    Em_resolucao: { nome: 'Em resolução', cor: '#d47e09' },
    Concluida: { nome: 'Concluída', cor: '#14ae5c' },
    Rejeitada: { nome: 'Recusada', cor: '#8b1a1a' },
}

export interface NovaDenuncia {
    tipo: string
    dataOcorrencia: string
    municipio: string
    uf: string
    referencia?: string
    descricao: string
    latitude?: number
    longitude?: number
}

export interface DenunciaResumo {
    id: number
    protocolo: string
    tipo: string
    statusAtual: string
    criadoEm: string
    atualizadoEm: string
}

export interface ListaMinhasDenuncias {
    data: DenunciaResumo[]
    total: number
    page: number
    limit: number
}

export async function enviarDenuncia(d: NovaDenuncia): Promise<{ protocolo: string }> {
    const res = await fetch(`${API}/denuncias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(d),
    })
    if (!res.ok) throw new Error(await lerErro(res, 'Não foi possível enviar a denúncia. Tente novamente.'))
    return res.json()
}

export async function minhasDenuncias(page: number, limit: number, signal?: AbortSignal): Promise<ListaMinhasDenuncias> {
    const res = await fetch(`${API}/denuncias/minhas?page=${page}&limit=${limit}`, {
        headers: { ...authHeaders() },
        signal,
    })
    if (res.status === 401) {
        sair()
        throw new Error('Sua sessão expirou. Faça login novamente.')
    }
    if (!res.ok) throw new Error('Não foi possível carregar seu histórico.')
    return res.json()
}