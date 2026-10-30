import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import './Especies.css'
import '../../global/global.css'
import { GRUPOS, riscoDaEspecie, STATUS, listarEspecies } from '../../services/especies'
import type { Filtros, ListaEspecies } from '../../services/especies'
import FotoEspecie from '../../components/FotoEspecie/FotoEspecie'

const LIMITE = 12

function Especies() {
    const [busca, setBusca] = useState('')
    const [buscaAplicada, setBuscaAplicada] = useState('')
    const [grupo, setGrupo] = useState('')
    const [status, setStatus] = useState('')
    const [apareceEmCasas, setApareceEmCasas] = useState(false)
    const [page, setPage] = useState(1)

    const [lista, setLista] = useState<ListaEspecies | null>(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    // espera o usuário parar de digitar antes de buscar
    useEffect(() => {
        const t = setTimeout(() => {
            setBuscaAplicada(busca)
            setPage(1)
        }, 400)
        return () => clearTimeout(t)
    }, [busca])

    useEffect(() => {
        const controller = new AbortController()
        const filtros: Filtros = { page, limit: LIMITE, busca: buscaAplicada, grupo, status, apareceEmCasas }

        setCarregando(true)
        listarEspecies(filtros, controller.signal)
            .then((r) => {
                setLista(r)
                setErro('')
            })
            .catch((e: Error) => {
                if (e.name !== 'AbortError') setErro(e.message)
            })
            .finally(() => {
                if (!controller.signal.aborted) setCarregando(false)
            })

        return () => controller.abort()
    }, [page, buscaAplicada, grupo, status, apareceEmCasas])

    const totalPaginas = lista ? Math.max(1, Math.ceil(lista.total / lista.limit)) : 1

    return (
        <>
            <Helmet>
                <title>Espécies - FaunaAlerta</title>
            </Helmet>

            <main className="especies-page">
                <section className="container py-5">
                    <h1 className="mb-1">Catálogo de espécies</h1>
                    <p className="especies-sub">Conheça a fauna brasileira, as espécies ameaçadas e os bichos que aparecem perto de você.</p>

                    <div className="especies-filtros">
                        <input
                            type="text"
                            placeholder="Buscar por nome popular ou científico..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                        <select value={grupo} onChange={(e) => { setGrupo(e.target.value); setPage(1) }}>
                            <option value="">Todos os grupos</option>
                            {Object.entries(GRUPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
                            <option value="">Todos os status</option>
                            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
                        </select>
                        <label className="especies-check">
                            <input
                                type="checkbox"
                                checked={apareceEmCasas}
                                onChange={(e) => { setApareceEmCasas(e.target.checked); setPage(1) }}
                            />
                            Aparece em casas
                        </label>
                    </div>

                    {erro && <p className="especies-erro" role="alert">{erro}</p>}
                    {carregando && !lista && <p>Carregando...</p>}

                    {lista && (
                        <>
                            <p className="especies-total">{lista.total} espécie(s) encontrada(s)</p>

                            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                                {lista.data.map((e) => {
                                    const risco = riscoDaEspecie(e)
                                    return (
                                        <div className="col" key={e.id}>
                                            <Link to={`/especies/${e.id}`} className="especie-card">
                                                <FotoEspecie src={e.imagemUrl} alt={e.nomePopular} />
                                                <div className="especie-corpo">
                                                    <h2>{e.nomePopular}</h2>
                                                    <em>{e.nomeCientifico}</em>
                                                    <div className="especie-selos">
                                                        <span className="selo" style={{ background: STATUS[e.statusConservacao]?.cor }}>
                                                            {STATUS[e.statusConservacao]?.nome ?? e.statusConservacao}
                                                        </span>
                                                        {(!e.revisado || e.nivelRisco !== 'NENHUM') && (
                                                            <span className="selo" style={{ background: risco.cor }}>{risco.nome}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>

                            {lista.data.length === 0 && <p className="text-center mt-4">Nenhuma espécie encontrada.</p>}

                            {totalPaginas > 1 && (
                                <div className="especies-paginacao">
                                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
                                    <span>Página {page} de {totalPaginas}</span>
                                    <button disabled={page >= totalPaginas} onClick={() => setPage(page + 1)}>Próxima</button>
                                </div>
                            )}
                        </>
                    )}
            </section>
        </main >
        </>
    )
}

export default Especies