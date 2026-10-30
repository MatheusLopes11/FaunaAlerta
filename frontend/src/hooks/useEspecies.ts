import { useEffect, useState } from 'react'
import { listarEspecies } from '../services/especies'
import type { Filtros, ListaEspecies } from '../services/especies'

export function useEspecies(filtros: Filtros) {
    const [resultado, setResultado] = useState<ListaEspecies | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    const { page, limit, busca, grupo, status, apareceEmCasas } = filtros

    useEffect(() => {
        const controller = new AbortController()
        setCarregando(true)

        listarEspecies({ page, limit, busca, grupo, status, apareceEmCasas }, controller.signal)
            .then((r) => {
                setResultado(r)
                setErro('')
            })
            .catch((e: Error) => {
                if (e.name !== 'AbortError') setErro(e.message)
            })
            .finally(() => {
                if (!controller.signal.aborted) setCarregando(false)
            })

        return () => controller.abort()
    }, [page, limit, busca, grupo, status, apareceEmCasas])

    return { resultado, carregando, erro }
}