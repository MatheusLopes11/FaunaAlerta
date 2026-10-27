const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const CHAVE = 'faunalerta.sessao'

export interface UsuarioLogado {
    id: number
    nome: string
    email: string
    perfil: 'Usuario' | 'Pesquisador' | 'Orgao' | 'Admin'
    statusCadastro: string
}

export interface Sessao {
    token: string
    usuario: UsuarioLogado
}

export async function login(email: string, senha: string): Promise<Sessao> {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    })
    if (res.status === 401) throw new Error('E-mail ou senha inválidos.')
    if (res.status === 403) throw new Error('Seu cadastro foi negado.')
    if (!res.ok) throw new Error('Não foi possível entrar. Tente novamente.')

    const sessao: Sessao = await res.json()
    localStorage.setItem(CHAVE, JSON.stringify(sessao))
    return sessao
}

export function lerSessao(): Sessao | null {
    try {
        const bruto = localStorage.getItem(CHAVE)
        return bruto ? (JSON.parse(bruto) as Sessao) : null
    } catch {
        return null
    }
}

export function sair() {
    localStorage.removeItem(CHAVE)
}

// usar nas chamadas que exigem login: fetch(url, { headers: { ...authHeaders() } })
export function authHeaders(): Record<string, string> {
    const sessao = lerSessao()
    return sessao ? { Authorization: `Bearer ${sessao.token}` } : {}
}