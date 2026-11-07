import './Perfil.css'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import '../../global/global.css'
import { atualizarSessao, lerSessao, sair } from '../../services/auth'
import type { UsuarioLogado } from '../../services/auth'
import { STATUS_DENUNCIA, TIPOS_DENUNCIA, minhasDenuncias } from '../../services/denuncias'
import type { DenunciaResumo, ListaMinhasDenuncias } from '../../services/denuncias'
import { urlMidia } from '../../services/midias'

const POR_PAGINA = 5

function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR')
}

function paginasVisiveis(atual: number, total: number) {
    const inicio = Math.max(1, Math.min(atual - 2, total - 4))
    const fim = Math.min(total, inicio + 4)
    return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i)
}

function Miniatura({ midia }: { midia: DenunciaResumo['midia'] }) {
    const foto = midia?.tipo === 'FOTO' ? urlMidia(midia.url) : ''
    return (
        <div className="perfil-thumb" aria-hidden="true">
            {foto ? <img src={foto} alt="" /> : <i className={`bi ${midia ? 'bi-camera-video' : 'bi-image-alt'}`}></i>}
        </div>
    )
}

function PerfilConteudo({ inicial }: { inicial: UsuarioLogado }) {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState(inicial)
    const [aba, setAba] = useState<'relatorios' | 'historico'>('historico')
    const [page, setPage] = useState(1)
    const [lista, setLista] = useState<ListaMinhasDenuncias | null>(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    const pesquisador = usuario.perfil === 'Pesquisador'
    const primeiroNome = usuario.nome.split(' ')[0]

    useEffect(() => {
        atualizarSessao().then((s) => {
            if (s) setUsuario(s.usuario)
            else navigate('/login')
        })
    }, [navigate])

    useEffect(() => {
        if (aba !== 'historico') return
        const controller = new AbortController()
        setCarregando(true)
        minhasDenuncias(page, POR_PAGINA, controller.signal)
            .then((r) => {
                setLista(r)
                setErro('')
            })
            .catch((e: Error) => {
                if (e.name === 'AbortError') return
                setErro(e.message)
                if (!lerSessao()) navigate('/login')
            })
            .finally(() => {
                if (!controller.signal.aborted) setCarregando(false)
            })
        return () => controller.abort()
    }, [page, aba, navigate])

    const totalPaginas = lista ? Math.max(1, Math.ceil(lista.total / lista.limit)) : 1

    function sairDaConta() {
        sair()
        navigate('/')
    }

    const historico = (
        <>
            <h2 className="perfil-titulo-secao"><span>Meu histórico</span></h2>

            {erro && <p className="perfil-erro" role="alert">{erro}</p>}
            {carregando && !lista && <p>Carregando...</p>}

            {lista && lista.data.length === 0 && (
                <p>Você ainda não fez nenhuma denúncia. <Link to="/denuncia"><strong>Fazer uma denúncia</strong></Link></p>
            )}

            {lista?.data.map((d) => {
                const st = STATUS_DENUNCIA[d.statusAtual]
                return (
                    <article className="perfil-item" key={d.id}>
                        <Miniatura midia={d.midia} />
                        <div className="perfil-item-dados">
                            <p>Feito em: {formatarData(d.criadoEm)}</p>
                            <p>Última atualização: {formatarData(d.atualizadoEm)}</p>
                            <p>Tipo da denúncia: {TIPOS_DENUNCIA[d.tipo] ?? d.tipo}</p>
                        </div>
                        <div className="perfil-item-status">
                            <small className="perfil-protocolo">{d.protocolo}</small>
                            <span>STATUS: <strong style={{ color: st?.cor }}>{(st?.nome ?? d.statusAtual).toUpperCase()}</strong></span>
                        </div>
                    </article>
                )
            })}

            {totalPaginas > 1 && (
                <nav className="perfil-paginas" aria-label="Páginas do histórico">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Página anterior">‹</button>
                    {paginasVisiveis(page, totalPaginas).map((n) => (
                        <button key={n} className={n === page ? 'ativa' : ''} onClick={() => setPage(n)}>{n}</button>
                    ))}
                    <button disabled={page >= totalPaginas} onClick={() => setPage(page + 1)} aria-label="Próxima página">›</button>
                </nav>
            )}

            <div className="perfil-atalhos">
                <Link to="/denuncia" className="perfil-atalho">Fazer denúncia</Link>
            </div>
        </>
    )

    return (
        <>
            <Helmet>
                <title>PERFIL - FaunaAlerta</title>
            </Helmet>

            <main className={`perfil-page ${pesquisador ? 'perfil-pesquisador' : ''}`}>
                <div className="perfil-card">
                    {pesquisador && (
                        <aside className="perfil-lateral">
                            <div className="perfil-avatar">{primeiroNome.charAt(0).toUpperCase()}</div>
                            <nav>
                                <button className={aba === 'relatorios' ? 'ativa' : ''} onClick={() => setAba('relatorios')}>
                                    Meus relatórios
                                </button>
                                <button className={aba === 'historico' ? 'ativa' : ''} onClick={() => setAba('historico')}>
                                    Meu histórico
                                </button>
                            </nav>
                        </aside>
                    )}

                    <section className="perfil-conteudo">
                        {!pesquisador && <div className="perfil-avatar perfil-avatar-topo">{primeiroNome.charAt(0).toUpperCase()}</div>}

                        <div className="perfil-saudacao">
                            <h1>Olá, {primeiroNome}!</h1>
                            <button className="perfil-sair" onClick={sairDaConta}>Sair da conta</button>
                        </div>

                        {pesquisador && usuario.statusCadastro === 'Pendente' && (
                            <p className="perfil-aviso">
                                Seu cadastro de pesquisador está em análise. Os dados dos alertas serão liberados após a aprovação.
                            </p>
                        )}
                        {pesquisador && usuario.statusCadastro === 'Negado' && (
                            <p className="perfil-aviso perfil-aviso-negado">Seu cadastro de pesquisador não foi aprovado.</p>
                        )}

                        {aba === 'relatorios' ? (
                            <>
                                <h2 className="perfil-titulo-secao"><span>Meus relatórios</span></h2>
                                <p>Gere relatórios com os alertas de avistamento, filtrando por local, espécie e período.</p>
                                <Link to="/relatorios" className="perfil-atalho">Solicitar relatório</Link>
                            </>
                        ) : historico}
                    </section>
                </div>
            </main>
        </>
    )
}

function Perfil() {
    const sessao = lerSessao()
    if (!sessao) return <Navigate to="/login" replace />
    return <PerfilConteudo inicial={sessao.usuario} />
}

export default Perfil