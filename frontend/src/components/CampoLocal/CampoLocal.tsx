import { useEffect, useRef, useState } from 'react'
import { ESTADOS, acharMunicipio, municipiosDoEstado } from '../../services/ibge'

interface Props {
    classe: string // 'alerta-local' ou 'denuncia-local' (já têm o estilo dos campos)
    idUf: string
    idMunicipio: string
    uf: string
    municipio: string
    onUf: (uf: string) => void
    onMunicipio: (municipio: string) => void
}

export function CampoLocal({ classe, idUf, idMunicipio, uf, municipio, onUf, onMunicipio }: Props) {
    const [lista, setLista] = useState<string[] | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [falhou, setFalhou] = useState(false)
    const pedido = useRef(0)
    const refMunicipio = useRef<HTMLInputElement>(null)

    // Com a lista carregada, só aceita cidades que existem no estado escolhido.
    const invalido = lista !== null && municipio.trim() !== '' && acharMunicipio(lista, municipio) === null

    useEffect(() => {
        refMunicipio.current?.setCustomValidity(invalido ? 'Escolha uma cidade da lista deste estado.' : '')
    }, [invalido])

    async function trocarUf(nova: string) {
        onUf(nova)
        onMunicipio('')
        setLista(null)
        setFalhou(false)

        const meu = ++pedido.current // ignora respostas de pedidos antigos
        if (!nova) return

        setCarregando(true)
        try {
            const cidades = await municipiosDoEstado(nova)
            if (meu === pedido.current) setLista(cidades)
        } catch {
            if (meu === pedido.current) setFalhou(true) // sem lista: a pessoa digita o nome
        } finally {
            if (meu === pedido.current) setCarregando(false)
        }
    }

    // Ao sair do campo, troca "sao paulo" por "São Paulo".
    function aoSair() {
        const oficial = lista ? acharMunicipio(lista, municipio) : null
        if (oficial && oficial !== municipio) onMunicipio(oficial)
    }

    const placeholder = !uf
        ? 'Escolha o estado primeiro'
        : carregando
          ? 'Carregando cidades...'
          : falhou
            ? 'Digite o nome do município'
            : 'Digite o município do evento'

    return (
        <div className={classe}>
            <select id={idUf} value={uf} onChange={(e) => trocarUf(e.target.value)} required aria-label="Estado">
                <option value="" disabled hidden>Estado</option>
                {ESTADOS.map((e) => <option key={e.sigla} value={e.sigla}>{e.nome}</option>)}
            </select>
            <input
                ref={refMunicipio}
                id={idMunicipio}
                type="text"
                list={`${idMunicipio}-lista`}
                value={municipio}
                onChange={(e) => onMunicipio(e.target.value)}
                onBlur={aoSair}
                placeholder={placeholder}
                disabled={!uf}
                autoComplete="off"
                maxLength={100}
                required
            />
            <datalist id={`${idMunicipio}-lista`}>
                {lista?.map((c) => <option key={c} value={c} />)}
            </datalist>
        </div>
    )
}