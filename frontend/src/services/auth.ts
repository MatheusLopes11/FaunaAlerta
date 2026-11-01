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

export async function lerErro(res: Response, padrao: string): Promise<string> {
    try {
        const j = await res.json()
        return Array.isArray(j.message) ? j.message.join(' • ') : (j.message ?? padrao)
    } catch {
        return padrao
    }
}

export interface DadosCadastro {
    nome: string
    email: string
    telefone?: string
    senha: string
}

export interface DadosPesquisador extends DadosCadastro {
    instituicao: string
    areaPesquisa: string
    linkLattesOrcid?: string
}

// Cria a conta e já entra no sistema.
export async function cadastrarUsuario(d: DadosCadastro): Promise<Sessao> {
    const res = await fetch(`${API}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
    })
    if (!res.ok) throw new Error(await lerErro(res, 'Não foi possível criar a conta.'))
    return login(d.email, d.senha)
}

export async function cadastrarPesquisador(d: DadosPesquisador): Promise<Sessao> {
    const res = await fetch(`${API}/pesquisador/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
    })
    if (!res.ok) throw new Error(await lerErro(res, 'Não foi possível enviar o cadastro.'))
    return login(d.email, d.senha)
}

// Busca os dados atuais do usuário (ex.: cadastro de pesquisador aprovado desde o último login).
export async function atualizarSessao(): Promise<Sessao | null> {
    const atual = lerSessao()
    if (!atual) return null
    try {
        const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${atual.token}` } })
        if (res.status === 401) {
            sair()
            return null
        }
        if (!res.ok) return atual
        const usuario: UsuarioLogado = await res.json()
        const nova = { token: atual.token, usuario }
        localStorage.setItem(CHAVE, JSON.stringify(nova))
        return nova
    } catch {
        return atual
    }
}