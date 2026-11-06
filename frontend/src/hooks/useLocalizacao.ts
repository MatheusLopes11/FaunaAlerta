import { useRef, useState } from 'react'
import type { Coordenada } from '../services/geo'
import { buscarCoordenada, buscarEndereco } from '../services/geocoding'

export function useLocalizacao() {
    const [coord, setCoord] = useState<Coordenada | null>(null)
    const [municipio, setMunicipio] = useState('')
    const [uf, setUf] = useState('')
    const [referencia, setReferencia] = useState('')
    const [buscando, setBuscando] = useState(false)
    const [aviso, setAviso] = useState('')

    const pedido = useRef(0)                                   // ignora respostas antigas
    const doMapa = useRef({ municipio: '', uf: '' })           // último valor vindo do mapa

    // mapa -> inputs
    async function aoEscolherNoMapa(c: Coordenada | null) {
        setCoord(c)
        if (!c) return
        const id = ++pedido.current
        setBuscando(true)
        setAviso('')
        try {
            const e = await buscarEndereco(c)
            if (id !== pedido.current) return
            if (!e) {
                setAviso('Não consegui identificar a cidade neste ponto. Preencha manualmente.')
                return
            }
            doMapa.current = { municipio: e.municipio, uf: e.uf }
            setMunicipio(e.municipio)
            setUf(e.uf)
            setReferencia((atual) => atual || e.referencia)    // não sobrescreve o que a pessoa digitou
        } catch {
            if (id === pedido.current) setAviso('Não foi possível buscar o endereço. Preencha manualmente.')
        } finally {
            if (id === pedido.current) setBuscando(false)
        }
    }

    // inputs -> mapa (chamar no onBlur do município e no onChange do estado)
    async function sincronizarMapa(mun = municipio, sigla = uf) {
        const m = mun.trim()
        if (!m || !sigla) return
        if (m === doMapa.current.municipio && sigla === doMapa.current.uf) return // já veio do mapa

        const id = ++pedido.current
        setAviso('')
        try {
            const c = await buscarCoordenada(m, sigla)
            if (id !== pedido.current) return
            if (c) setCoord(c)
            else setAviso('Não encontrei essa cidade no mapa. Você pode marcar o ponto manualmente.')
        } catch {
            /* sem rede: o formulário continua funcionando com texto */
        }
    }

    function limpar() {
        pedido.current++
        doMapa.current = { municipio: '', uf: '' }
        setCoord(null); setMunicipio(''); setUf(''); setReferencia(''); setAviso('')
    }

    return {
        coord, municipio, uf, referencia, buscando, aviso,
        setMunicipio, setUf, setReferencia,
        aoEscolherNoMapa, sincronizarMapa, limpar,
    }
}