import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useNavigate } from 'react-router-dom'
import './Admin.css'
import './AdminPesquisadores.css'
import '../../global/global.css'
import { lerSessao } from '../../services/auth'
import { alterarStatusPesquisador, listarSolicitacoes } from '../../services/pesquisadores'
import type { Solicitacao, StatusCadastro } from '../../services/pesquisadores'

const ABAS: { chave: StatusCadastro | ''; rotulo: string }[] = [
    { chave: 'Pendente', rotulo: 'Pendentes' },
    { chave: 'Aprovado', rotulo: 'Aprovados' },
    { chave: 'Negado', rotulo: 'Negados' },
    { chave: '', rotulo: 'Todos' },
]

const COR_STATUS: Record<StatusCadastro, string> = {
    Pendente: '#d47e09',
    Aprovado: '#14ae5c',
    Negado: '#8b1a1a',
}

// só deixa abrir links http(s), nunca "javascript:" ou parecidos
function linkSeguro(url: string | null) {
    return url && /^https?:\/\//i.test(url) ? url : null
}

function Painel() {
    const navigate = useNavigate()
    const [aba, setAba] = useState<StatusCadastro | ''>('Pendente')
    const [lista, setLista] = useState<Solicitacao[] | null>(null)
    const [erro, setErro] = useState('')
    const [msg, setMsg] = useState('')
    const [ocupado, setOcupado] = useState<number | null>(null)

    const carregar = useCallback(
        async (signal?: AbortSignal) => {
            try {
                setLista(await listarSolicitacoes(aba || undefined, signal))
                setErro('')
            } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') return
                setErro(e instanceof Error ? e.message : 'Erro ao carregar.')
                if (!lerSessao()) navigate('/login')
            }
        },
        [aba, navigate],
    )

    useEffect(() => {
        const controller = new AbortController()
        carregar(controller.signal)
        return () => controller.abort()
    }, [carregar])

    function trocarAba(nova: StatusCadastro | '') {
        setLista(null)
        setMsg('')
        setAba(nova)
    }

    async function mudar(s: Solicitacao, novo: StatusCadastro, confirmacao?: string) {
        if (confirmacao && !window.confirm(confirmacao)) return
        setMsg('')
        setErro('')
        setOcupado(s.usuarioId)
        try {
            await alterarStatusPesquisador(s.usuarioId, novo)
            setMsg(`${s.nome}: cadastro ${novo === 'Aprovado' ? 'aprovado' : 'negado'}.`)
            await carregar()
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao alterar o cadastro.')
            if (!lerSessao()) navigate('/login')
        } finally {
            setOcupado(null)
        }
    }

    return (
        <main className="admin-page">
            <section className="container py-5">
                <h1>Pesquisadores</h1>
                <p>Analise os cadastros antes de liberar o acesso aos dados dos alertas.</p>

                <div className="adm-abas">
                    {ABAS.map((a) => (
                        <button
                            key={a.rotulo}
                            className={`adm-aba ${aba === a.chave ? 'ativa' : ''}`}
                            onClick={() => trocarAba(a.chave)}
                        >
                            {a.rotulo}
                        </button>
                    ))}
                </div>

                {erro && <p className="adm-erro" role="alert">{erro}</p>}
                {msg && <p className="adm-ok" role="status">{msg}</p>}
                {!lista && !erro && <p>Carregando...</p>}
                {lista && lista.length === 0 && <p>Nenhum cadastro nesta lista.</p>}

                {lista?.map((s) => {
                    const lattes = linkSeguro(s.linkLattesOrcid)
                    return (
                        <article className="adm-cartao" key={s.usuarioId}>
                            <div>
                                <h2>
                                    {s.nome}{' '}
                                    <span className="adm-selo" style={{ background: COR_STATUS[s.statusCadastro] }}>
                                        {s.statusCadastro}
                                    </span>
                                </h2>
                                <p><strong>Instituição:</strong> {s.instituicao}</p>
                                <p><strong>Área de pesquisa:</strong> {s.areaPesquisa}</p>
                                <p><strong>E-mail:</strong> {s.emailInstituicional}</p>
                                {s.telefone && <p><strong>Telefone:</strong> {s.telefone}</p>}
                                <p>
                                    <strong>Lattes/ORCID:</strong>{' '}
                                    {lattes ? (
                                        <a href={lattes} target="_blank" rel="noopener noreferrer">{lattes}</a>
                                    ) : (
                                        'não informado'
                                    )}
                                </p>
                            </div>

                            <div className="adm-acoes adm-acoes-cartao">
                                {s.statusCadastro !== 'Aprovado' && (
                                    <button
                                        className="adm-btn adm-verde"
                                        disabled={ocupado === s.usuarioId}
                                        onClick={() => mudar(s, 'Aprovado')}
                                    >
                                        Aprovar
                                    </button>
                                )}
                                {s.statusCadastro === 'Pendente' && (
                                    <button
                                        className="adm-btn adm-vermelho"
                                        disabled={ocupado === s.usuarioId}
                                        onClick={() => mudar(s, 'Negado', `Negar o cadastro de ${s.nome}? A pessoa não conseguirá mais entrar no site.`)}
                                    >
                                        Negar
                                    </button>
                                )}
                                {s.statusCadastro === 'Aprovado' && (
                                    <button
                                        className="adm-btn adm-vermelho"
                                        disabled={ocupado === s.usuarioId}
                                        onClick={() => mudar(s, 'Negado', `Revogar o acesso de ${s.nome}? A pessoa não conseguirá mais entrar no site.`)}
                                    >
                                        Revogar acesso
                                    </button>
                                )}
                            </div>
                        </article>
                    )
                })}
            </section>
        </main>
    )
}

function AdminPesquisadores() {
    const sessao = lerSessao()
    // Conveniência de tela. Quem protege de verdade é o guard da API.
    if (sessao?.usuario.perfil !== 'Admin') return <Navigate to="/login" replace />

    return (
        <>
            <Helmet>
                <title>PESQUISADORES - FaunaAlerta</title>
            </Helmet>
            <Painel />
        </>
    )
}

export default AdminPesquisadores