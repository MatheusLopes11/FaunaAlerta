export const ESTADOS = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' },
]

const BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
const cache = new Map<string, string[]>()

export function normalizar(s: string) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export async function municipiosDoEstado(uf: string): Promise<string[]> {
    const guardado = cache.get(uf)
    if (guardado) return guardado

    const res = await fetch(`${BASE}/${encodeURIComponent(uf)}/municipios`)
    if (!res.ok) throw new Error('A lista de cidades do IBGE não está disponível.')

    const dados: { nome: string }[] = await res.json()
    const nomes = dados.map((d) => d.nome).sort((a, b) => a.localeCompare(b, 'pt-BR'))
    cache.set(uf, nomes)
    return nomes
}

// Devolve o nome oficial (com acentos e maiúsculas) ou null se não existir na lista.
export function acharMunicipio(lista: string[], texto: string): string | null {
    const alvo = normalizar(texto)
    return lista.find((c) => normalizar(c) === alvo) ?? null
}