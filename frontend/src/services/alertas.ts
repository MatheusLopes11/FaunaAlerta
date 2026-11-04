import { authHeaders, lerErro, sair } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type Situacao = 'PENDENTE' | 'VERIFICADO' | 'REJEITADO'

export interface NovoAlerta {
    especieId?: number
    municipio: string
    uf: string
    dataAvistamento: string
    descricao?: string
    latitude?: number
    longitude?: number
}

export interface AlertaRelatorio {
    id: number
    especieId: number | null
    especieNome: string | null
    especieCientifico: string | null
    municipio: string
    uf: string
    bioma: string | null
    dataAvistamento: string
    descricao: string | null
    situacao: Situacao
    latitude: number | null
    longitude: number | null
}

export interface RespostaRelatorio {
    data: AlertaRelatorio[]
    total: number
    limite: number
}

export interface FiltrosRelatorio {
    uf?: string
    municipio?: string
    especieId?: number
    de?: string
    ate?: string
}

export async function enviarAlerta(a: NovoAlerta): Promise<void> {
    const res = await fetch(`${API}/alertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(a),
    })
    if (res.ok) return
    throw new Error(await lerErro(res, 'Não foi possível enviar o alerta. Tente novamente.'))
}

async function falhar(res: Response, padrao: string): Promise<never> {
    if (res.status === 401) {
        sair()
        throw new Error('Sua sessão expirou. Faça login novamente.')
    }
    if (res.status === 403) throw new Error('Você não tem permissão para esta ação ou seu cadastro ainda não foi aprovado.')
    throw new Error(await lerErro(res, padrao))
}

export async function buscarRelatorio(f: FiltrosRelatorio): Promise<RespostaRelatorio> {
    const params = new URLSearchParams()
    if (f.uf) params.set('uf', f.uf)
    if (f.municipio) params.set('municipio', f.municipio)
    if (f.especieId) params.set('especieId', String(f.especieId))
    if (f.de) params.set('de', f.de)
    if (f.ate) params.set('ate', f.ate)

    const res = await fetch(`${API}/alertas/relatorio?${params}`, { headers: { ...authHeaders() } })
    if (!res.ok) return falhar(res, 'Não foi possível gerar o relatório.')
    return res.json()
}

export async function listarMunicipios(uf: string): Promise<string[]> {
    const res = await fetch(`${API}/alertas/municipios?uf=${encodeURIComponent(uf)}`, { headers: { ...authHeaders() } })
    if (!res.ok) return falhar(res, 'Não foi possível carregar as cidades.')
    return res.json()
}

export async function alterarSituacao(id: number, situacao: Situacao): Promise<void> {
    const res = await fetch(`${API}/alertas/${id}/situacao`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ situacao }),
    })
    if (!res.ok) return falhar(res, 'Não foi possível alterar o alerta.')
}