import type { AlertaRelatorio, Situacao } from './alertas'

export const SITUACAO_ROTULO: Record<Situacao, string> = {
    PENDENTE: 'Pendente',
    VERIFICADO: 'Verificado',
    REJEITADO: 'Rejeitado',
}

export const SITUACAO_COR: Record<Situacao, string> = {
    PENDENTE: '#d47e09',
    VERIFICADO: '#14ae5c',
    REJEITADO: '#8b1a1a',
}

export function dataBR(iso: string) {
    const [a, m, d] = iso.slice(0, 10).split('-')
    return `${d}/${m}/${a}`
}

export function descreverPeriodo(de: string, ate: string) {
    if (de && ate) return `entre ${dataBR(de)} e ${dataBR(ate)}`
    if (de) return `a partir de ${dataBR(de)}`
    if (ate) return `até ${dataBR(ate)}`
    return 'em todo o período disponível'
}

export function contar<T>(itens: T[], chave: (i: T) => string) {
    const mapa = new Map<string, number>()
    for (const i of itens) {
        const k = chave(i)
        mapa.set(k, (mapa.get(k) ?? 0) + 1)
    }
    return [...mapa.entries()]
        .map(([rotulo, valor]) => ({ rotulo, valor }))
        .sort((a, b) => b.valor - a.valor)
}

// Últimos 12 meses com registro, em ordem cronológica.
export function contarPorMes(alertas: AlertaRelatorio[]) {
    const mapa = new Map<string, number>()
    for (const a of alertas) {
        const m = a.dataAvistamento.slice(0, 7)
        mapa.set(m, (mapa.get(m) ?? 0) + 1)
    }
    return [...mapa.entries()]
        .sort(([x], [y]) => x.localeCompare(y))
        .slice(-12)
        .map(([m, valor]) => ({ rotulo: `${m.slice(5)}/${m.slice(0, 4)}`, valor }))
}

export function gerarTexto(alertas: AlertaRelatorio[], escopo: string, periodo: string, especie: string | null): string[] {
    if (alertas.length === 0) return ['Nenhum alerta foi encontrado com os filtros escolhidos.']

    const n = alertas.length
    const verificados = alertas.filter((a) => a.situacao === 'VERIFICADO').length
    const pendentes = alertas.filter((a) => a.situacao === 'PENDENTE').length
    const rejeitados = alertas.filter((a) => a.situacao === 'REJEITADO').length
    const comCoord = alertas.filter((a) => a.latitude != null && a.longitude != null).length
    const especies = contar(alertas, (a) => a.especieNome ?? 'Espécie não identificada').slice(0, 3)
    const ufs = contar(alertas, (a) => a.uf).slice(0, 3)
    const datas = alertas.map((a) => a.dataAvistamento).sort()

    const paragrafos = [
        `Considerando ${escopo}, ${periodo}${especie ? `, para a espécie ${especie}` : ''}, foram registrados ${n} alerta(s) de avistamento, com datas entre ${dataBR(datas[0])} e ${dataBR(datas[datas.length - 1])}.`,
        `Situação dos alertas: ${verificados} verificado(s), ${pendentes} pendente(s) e ${rejeitados} rejeitado(s).`,
        `As espécies mais citadas foram: ${especies.map((e) => `${e.rotulo} (${e.valor})`).join(', ')}.`,
    ]
    if (ufs.length > 1) {
        paragrafos.push(`Os estados com mais registros foram: ${ufs.map((u) => `${u.rotulo} (${u.valor})`).join(', ')}.`)
    }
    paragrafos.push(
        `${comCoord} de ${n} alerta(s) têm coordenadas geográficas informadas${comCoord < n ? '; os demais trazem apenas município e UF' : ''}.`,
        'Os dados são enviados pela população e podem conter imprecisões. Alertas pendentes ainda não foram verificados.',
    )
    return paragrafos
}

function celula(v: unknown): string {
    if (v === null || v === undefined) return ''
    let s = String(v)
    // evita que o Excel execute texto escrito por usuários como fórmula
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`
    s = s.replace(/"/g, '""')
    return /[";\n\r]/.test(s) ? `"${s}"` : s
}

const decimal = (n: number | null) => (n === null ? null : String(n).replace('.', ','))

// Separador ";" e decimal com vírgula: abre certo no Excel em português.
export function gerarCsv(alertas: AlertaRelatorio[]): string {
    const cabecalho = ['ID', 'Data do avistamento', 'Espécie', 'Nome científico', 'Município', 'UF', 'Bioma', 'Latitude', 'Longitude', 'Situação', 'Descrição']
    const linhas = alertas.map((a) => [
        a.id,
        dataBR(a.dataAvistamento),
        a.especieNome,
        a.especieCientifico,
        a.municipio,
        a.uf,
        a.bioma,
        decimal(a.latitude),
        decimal(a.longitude),
        SITUACAO_ROTULO[a.situacao],
        a.descricao?.replace(/\s+/g, ' '),
    ])
    return '\uFEFF' + [cabecalho, ...linhas].map((l) => l.map(celula).join(';')).join('\r\n')
}

export function gerarGeoJson(alertas: AlertaRelatorio[]): string {
    return JSON.stringify(
        {
            type: 'FeatureCollection',
            features: alertas
                .filter((a) => a.latitude != null && a.longitude != null)
                .map((a) => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [a.longitude, a.latitude] },
                    properties: {
                        id: a.id,
                        data: a.dataAvistamento,
                        especie: a.especieNome,
                        nomeCientifico: a.especieCientifico,
                        municipio: a.municipio,
                        uf: a.uf,
                        situacao: a.situacao,
                        descricao: a.descricao,
                    },
                })),
        },
        null,
        2,
    )
}

export function baixar(nome: string, conteudo: string, tipo: string) {
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }))
    const a = document.createElement('a')
    a.href = url
    a.download = nome
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}