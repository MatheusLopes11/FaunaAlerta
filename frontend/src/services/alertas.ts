import { authHeaders } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface NovoAlerta {
    especieId?: number
    municipio: string
    uf: string
    dataAvistamento: string
    descricao?: string
    latitude?: number
    longitude?: number
}

export async function enviarAlerta(a: NovoAlerta): Promise<void> {
    const res = await fetch(`${API}/alertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(a),
    })
    if (res.ok) return

    let msg = 'Não foi possível enviar o alerta. Tente novamente.'
    try {
        const j = await res.json()
        msg = Array.isArray(j.message) ? j.message.join(' • ') : (j.message ?? msg)
    } catch {
        /* mantém a mensagem padrão */
    }
    throw new Error(msg)
}