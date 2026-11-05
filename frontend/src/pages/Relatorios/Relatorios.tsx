import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useNavigate } from 'react-router-dom'
import './Relatorios.css'
import '../../global/global.css'
import { atualizarSessao, lerSessao } from '../../services/auth'
import type { UsuarioLogado } from '../../services/auth'
import { alterarSituacao, buscarRelatorio, listarMunicipios } from '../../services/alertas'
import type { AlertaRelatorio, Situacao } from '../../services/alertas'
import { listarEspecies } from '../../services/especies'
import type { Especie } from '../../services/especies'
import {
    SITUACAO_COR, SITUACAO_ROTULO, baixar, contar, contarPorMes, dataBR, descreverPeriodo,
    gerarCsv, gerarGeoJson, gerarTexto,
} from '../../services/relatorios'
import { MapaAlertas } from '../../components/MapaAlertas/MapaAlertas'

type TipoRelatorio = 'COMPLETO' | 'GRAFICO' | 'ESCRITO'

const TIPOS: { chave: TipoRelatorio; rotulo: string; icone: string }[] = [
    { chave: 'COMPLETO', rotulo: 'Completo', icone: 'bi-clipboard-check' },
    { chave: 'GRAFICO', rotulo: 'Gráfico', icone: 'bi-bar-chart' },
    { chave: 'ESCRITO', rotulo: 'Escrito', icone: 'bi-text-left' },
]

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

interface Gerado {
    tipo: TipoRelatorio
    alertas: AlertaRelatorio[]
    total: number
    limite: number
    escopo: string
    periodo: string
    especie: string | null
}

function Barras({ titulo, dados }: { titulo: string; dados: { rotulo: string; valor: number }[] }) {
    const maximo = Math.max(1, ...dados.map((d) => d.valor))
    return (
        <div className="rel-grafico">
            <h3>{titulo}</h3>
            {dados.length === 0 && <p>Sem dados.</p>}
            {dados.map((d) => (
                <div className="rel-barra-linha" key={d.rotulo}>
                    <span className="rel-barra-rotulo" title={d.rotulo}>{d.rotulo}</span>
                    <div className="rel-barra-trilho">
                        <div className="rel-barra" style={{ width: `${(d.valor / maximo) * 100}%` }} />
                    </div>
                    <span className="rel-barra-valor">{d.valor}</span>
                </div>
            ))}
        </div>
    )
}

function Graficos({ alertas }: { alertas: AlertaRelatorio[] }) {
    return (
        <div className="rel-graficos">
            <Barras titulo="Alertas por espécie" dados={contar(alertas, (a) => a.especieNome ?? 'Não identificada').slice(0, 8)} />
            <Barras titulo="Alertas por estado" dados={contar(alertas, (a) => a.uf).slice(0, 8)} />
            <Barras titulo="Alertas por mês" dados={contarPorMes(alertas)} />
            <Barras titulo="Situação dos alertas" dados={contar(alertas, (a) => SITUACAO_ROTULO[a.situacao])} />
        </div>
    )
}

interface TabelaProps {
    alertas: AlertaRelatorio[]
    ocupado: number | null
    onMudar: (a: AlertaRelatorio, nova: Situacao) => void
}

function Tabela({ alertas, ocupado, onMudar }: TabelaProps) {
    if (alertas.length === 0) return <p>Nenhum alerta encontrado com esses filtros.</p>
    return (
        <div className="rel-tabela-wrap">
            <table className="rel-tabela">
                <thead>
                    <tr><th>Data</th><th>Espécie</th><th>Local</th><th>Coordenadas</th><th>Situação</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {alertas.map((a) => (
                        <tr key={a.id}>
                            <td>{dataBR(a.dataAvistamento)}</td>
                            <td>{a.especieNome ?? <em>Não identificada</em>}</td>
                            <td>{a.municipio}/{a.uf}</td>
                            <td>{a.latitude != null && a.longitude != null ? `${a.latitude.toFixed(5)}, ${a.longitude.toFixed(5)}` : '—'}</td>
                            <td><span className="rel-selo" style={{ background: SITUACAO_COR[a.situacao] }}>{SITUACAO_ROTULO[a.situacao]}</span></td>
                            <td className="rel-acoes-linha">
                                {a.situacao !== 'VERIFICADO' && (
                                    <button className="rel-btn rel-verde" disabled={ocupado === a.id} onClick={() => onMudar(a, 'VERIFICADO')}>Verificar</button>
                                )}
                                {a.situacao !== 'REJEITADO' && (
                                    <button className="rel-btn rel-vermelho" disabled={ocupado === a.id} onClick={() => onMudar(a, 'REJEITADO')}>Rejeitar</button>
                                )}
                                {a.situacao !== 'PENDENTE' && (
                                    <button className="rel-btn" disabled={ocupado === a.id} onClick={() => onMudar(a, 'PENDENTE')}>Desfazer</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function Conteudo({ inicial }: { inicial: UsuarioLogado }) {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState(inicial)

    const [tipo, setTipo] = useState<TipoRelatorio>('COMPLETO')
    const [uf, setUf] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [municipios, setMunicipios] = useState<string[]>([])
    const [de, setDe] = useState('')
    const [ate, setAte] = useState('')

    const [busca, setBusca] = useState('')
    const [resultadosBusca, setResultadosBusca] = useState<Especie[]>([])
    const [especie, setEspecie] = useState<Especie | null>(null)

    const [confirmando, setConfirmando] = useState(false)
    const [gerando, setGerando] = useState(false)
    const [gerado, setGerado] = useState<Gerado | null>(null)
    const [geracao, setGeracao] = useState(0)
    const [ocupado, setOcupado] = useState<number | null>(null)
    const [erro, setErro] = useState('')
    const [msg, setMsg] = useState('')

    const hoje = new Date().toLocaleDateString('en-CA')

    useEffect(() => {
        atualizarSessao().then((s) => {
            if (s) setUsuario(s.usuario)
            else navigate('/login')
        })
    }, [navigate])

    // espera a pessoa parar de digitar antes de buscar a espécie
    useEffect(() => {
        if (busca.trim().length < 2) return
        const t = setTimeout(() => {
            listarEspecies({ page: 1, limit: 5, busca: busca.trim(), grupo: '', status: '', apareceEmCasas: false })
                .then((r) => setResultadosBusca(r.data))
                .catch(() => setResultadosBusca([]))
        }, 300)
        return () => clearTimeout(t)
    }, [busca])

    const sugestoes = busca.trim().length >= 2 ? resultadosBusca : []
    const textoRelatorio = useMemo(
        () => (gerado ? gerarTexto(gerado.alertas, gerado.escopo, gerado.periodo, gerado.especie) : []),
        [gerado],
    )

    async function escolherUf(valor: string) {
        setUf(valor)
        setMunicipio('')
        setMunicipios([])
        if (!valor) return
        try {
            setMunicipios(await listarMunicipios(valor))
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar as cidades.')
        }
    }

    function pedir(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErro('')
        setMsg('')
        if (de && ate && de > ate) {
            setErro('A data inicial não pode ser depois da data final.')
            return
        }
        setConfirmando(true)
    }

    async function gerar() {
        setConfirmando(false)
        setGerando(true)
        setErro('')
        setMsg('')
        try {
            const r = await buscarRelatorio({
                uf: uf || undefined,
                municipio: municipio || undefined,
                especieId: especie?.id,
                de: de || undefined,
                ate: ate || undefined,
            })
            setGerado({
                tipo,
                alertas: r.data,
                total: r.total,
                limite: r.limite,
                escopo: municipio ? `o município de ${municipio} (${uf})` : uf ? `o estado ${uf}` : 'todo o Brasil',
                periodo: descreverPeriodo(de, ate),
                especie: especie?.nomePopular ?? null,
            })
            setGeracao((g) => g + 1)
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao gerar o relatório.')
            if (!lerSessao()) navigate('/login')
        } finally {
            setGerando(false)
        }
    }

    async function mudarSituacao(a: AlertaRelatorio, nova: Situacao) {
        setErro('')
        setMsg('')
        setOcupado(a.id)
        try {
            await alterarSituacao(a.id, nova)
            setGerado((g) => g && { ...g, alertas: g.alertas.map((x) => (x.id === a.id ? { ...x, situacao: nova } : x)) })
            setMsg(`Alerta #${a.id} marcado como ${SITUACAO_ROTULO[nova].toLowerCase()}.`)
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao alterar o alerta.')
            if (!lerSessao()) navigate('/login')
        } finally {
            setOcupado(null)
        }
    }

    if (usuario.statusCadastro !== 'Aprovado') {
        return (
            <main className="rel-page">
                <div className="rel-card">
                    <h1 className="rel-titulo">RELATÓRIOS</h1>
                    <p>
                        {usuario.statusCadastro === 'Negado'
                            ? 'Seu cadastro de pesquisador não foi aprovado.'
                            : 'Seu cadastro de pesquisador ainda está em análise. Os relatórios serão liberados após a aprovação.'}
                    </p>
                </div>
            </main>
        )
    }

    return (
        <>
            <Helmet>
                <title>RELATÓRIOS - FaunaAlerta</title>
            </Helmet>

            <main className="rel-page">
                <div className="rel-card">
                    <h1 className="rel-titulo">SOLICITE SEU RELATÓRIO</h1>

                    <form onSubmit={pedir}>
                        <p className="rel-subtitulo">Escolha seu tipo de relatório</p>
                        <div className="rel-tipos">
                            {TIPOS.map((t) => (
                                <button
                                    type="button"
                                    key={t.chave}
                                    className={`rel-tipo ${tipo === t.chave ? 'ativo' : ''}`}
                                    aria-pressed={tipo === t.chave}
                                    onClick={() => setTipo(t.chave)}
                                >
                                    <i className={`bi ${t.icone}`}></i> {t.rotulo}
                                </button>
                            ))}
                        </div>

                        <div className="rel-linha">
                            <div className="rel-campo">
                                <label>De onde você quer seus dados?</label>
                                <select value={uf} onChange={(e) => escolherUf(e.target.value)} aria-label="Estado">
                                    <option value="">Todos os estados</option>
                                    {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                                <select
                                    value={municipio}
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    disabled={!uf}
                                    aria-label="Cidade"
                                >
                                    <option value="">{uf ? 'Todas as cidades' : 'Escolha um estado'}</option>
                                    {municipios.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div className="rel-campo">
                                <label>Qual período de tempo?</label>
                                <label className="rel-data">De <input type="date" value={de} max={hoje} onChange={(e) => setDe(e.target.value)} /></label>
                                <label className="rel-data">Até <input type="date" value={ate} max={hoje} onChange={(e) => setAte(e.target.value)} /></label>
                            </div>
                        </div>

                        <div className="rel-campo">
                            <label htmlFor="rel-busca">Qual espécie está procurando? (opcional)</label>
                            {especie ? (
                                <div className="rel-especie-escolhida">
                                    <span>{especie.nomePopular} | <em>{especie.nomeCientifico}</em></span>
                                    <button type="button" aria-label="Remover espécie" onClick={() => { setEspecie(null); setBusca('') }}>×</button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        id="rel-busca"
                                        type="search"
                                        autoComplete="off"
                                        placeholder="Pesquise pelo nome popular ou científico"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                    />
                                    {sugestoes.length > 0 && (
                                        <ul className="rel-sugestoes">
                                            {sugestoes.map((s) => (
                                                <li key={s.id}>
                                                    <button type="button" onClick={() => { setEspecie(s); setBusca('') }}>
                                                        {s.nomePopular} | <em>{s.nomeCientifico}</em>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>

                        {erro && <p className="rel-erro" role="alert">{erro}</p>}

                        <div className="rel-centro">
                            <button type="submit" className="rel-gerar" disabled={gerando}>
                                {gerando ? 'GERANDO...' : 'GERAR RELATÓRIO'}
                            </button>
                        </div>
                    </form>

                    {msg && <p className="rel-ok" role="status">{msg}</p>}

                    {gerado && (
                        <section className="rel-resultado" aria-live="polite">
                            <h2>Resultado</h2>
                            <p className="rel-resumo">
                                {gerado.alertas.length} alerta(s)
                                {gerado.total > gerado.alertas.length && ` (de ${gerado.total}; mostrando os ${gerado.limite} mais recentes, refine os filtros para ver o restante)`}
                                {' · '}{gerado.escopo}{' · '}{gerado.periodo}{gerado.especie ? ` · ${gerado.especie}` : ''}
                            </p>

                            <div className="rel-exportar">
                                <button type="button" className="rel-btn" onClick={() => baixar(`alertas-faunalerta-${hoje}.csv`, gerarCsv(gerado.alertas), 'text/csv;charset=utf-8')}>
                                    Baixar CSV
                                </button>
                                <button type="button" className="rel-btn" onClick={() => baixar(`alertas-faunalerta-${hoje}.geojson`, gerarGeoJson(gerado.alertas), 'application/geo+json')}>
                                    Baixar GeoJSON
                                </button>
                                {gerado.tipo === 'ESCRITO' && (
                                    <button type="button" className="rel-btn" onClick={() => baixar(`relatorio-faunalerta-${hoje}.txt`, textoRelatorio.join('\n\n'), 'text/plain;charset=utf-8')}>
                                        Baixar texto
                                    </button>
                                )}
                            </div>

                            <MapaAlertas alertas={gerado.alertas} geracao={geracao} />

                            {gerado.tipo === 'COMPLETO' && <Tabela alertas={gerado.alertas} ocupado={ocupado} onMudar={mudarSituacao} />}
                            {gerado.tipo === 'GRAFICO' && <Graficos alertas={gerado.alertas} />}
                            {gerado.tipo === 'ESCRITO' && (
                                <div className="rel-texto">
                                    {textoRelatorio.map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>

            {confirmando && (
                <div className="rel-modal-fundo" role="dialog" aria-modal="true" aria-labelledby="rel-confirma-titulo">
                    <div className="rel-modal">
                        <button type="button" className="rel-modal-fechar" aria-label="Fechar" onClick={() => setConfirmando(false)}>×</button>
                        <h2 id="rel-confirma-titulo">CONFIRMAR RELATÓRIO?</h2>
                        <div className="rel-modal-acoes">
                            <button type="button" className="rel-modal-voltar" onClick={() => setConfirmando(false)}>← Voltar</button>
                            <button type="button" className="rel-modal-confirmar" onClick={gerar}>Confirmar ✓</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function Relatorios() {
    const sessao = lerSessao()
    if (!sessao) return <Navigate to="/login" replace />
    const perfil = sessao.usuario.perfil
    // Conveniência de tela. Quem protege de verdade é a API.
    if (perfil !== 'Pesquisador' && perfil !== 'Admin') return <Navigate to="/" replace />
    return <Conteudo inicial={sessao.usuario} />
}

export default Relatorios