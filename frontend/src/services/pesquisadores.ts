import { authHeaders, lerErro, sair } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type StatusCadastro = 'Aprovado' | 'Pendente' | 'Negado'

export interface Solicitacao {
    usuarioId: number
    nome: string
    email: string
    telefone: string | null
    statusCadastro: StatusCadastro
    instituicao: string
    areaPesquisa: string
    linkLattesOrcid: string | null
    emailInstituicional: string
}

async function tratar(res: Response, padrao: string): Promise<never> {
    if (res.status === 401) {
        sair()
        throw new Error('Sua sessão expirou. Faça login novamente.')
    }
    if (res.status === 403) throw new Error('Você não tem permissão para esta ação.')
    throw new Error(await lerErro(res, padrao))
}

export async function listarSolicitacoes(status?: StatusCadastro, signal?: AbortSignal): Promise<Solicitacao[]> {
    const res = await fetch(`${API}/pesquisador/solicitacoes${status ? `?status=${status}` : ''}`, {
        headers: { ...authHeaders() },
        signal,
    })
    if (!res.ok) return tratar(res, 'Não foi possível carregar os pesquisadores.')
    return res.json()
}

export async function alterarStatusPesquisador(usuarioId: number, statusCadastro: StatusCadastro): Promise<void> {
    const res = await fetch(`${API}/pesquisador/${usuarioId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ statusCadastro }),
    })
    if (!res.ok) return tratar(res, 'Não foi possível alterar o cadastro.')
}