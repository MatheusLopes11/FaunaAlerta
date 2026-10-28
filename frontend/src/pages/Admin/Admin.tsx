import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useNavigate } from 'react-router-dom'
import './Admin.css'
import '../../global/global.css'
import { lerSessao } from '../../services/auth'
import {
    GRUPOS, RISCO, STATUS, atualizarEspecie, criarEspecie, excluirEspecie, formatarBioma, listarEspecies,
} from '../../services/especies'
import type { Bioma, Especie, EspeciePayload } from '../../services/especies'

const BIOMAS: Bioma[] = ['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL']
const ORIGENS: Record<string, string> = { NATIVA: 'Nativa', EXOTICA: 'Exótica', EXOTICA_INVASORA: 'Exótica invasora' }

interface FormState {
    nomePopular: string
    nomeCientifico: string
    origem: string
    statusConservacao: string
    grupo: string
    nivelRisco: string
    descricaoRisco: string
    expectativaVidaMin: string
    expectativaVidaMax: string
    apareceEmCasas: boolean
    descricao: string
    curiosidades: string
    imagemUrl: string
    fonte: string
    biomas: Bioma[]
}

const VAZIO: FormState = {
    nomePopular: '', nomeCientifico: '', origem: 'NATIVA', statusConservacao: 'NE', grupo: 'OUTRO',
    nivelRisco: 'NENHUM', descricaoRisco: '', expectativaVidaMin: '', expectativaVidaMax: '',
    apareceEmCasas: false, descricao: '', curiosidades: '', imagemUrl: '', fonte: '', biomas: [],
}

function paraForm(e: Especie): FormState {
    return {
        nomePopular: e.nomePopular,
        nomeCientifico: e.nomeCientifico,
        origem: e.origem,
        statusConservacao: e.statusConservacao,
        grupo: e.grupo,
        nivelRisco: e.nivelRisco,
        descricaoRisco: e.descricaoRisco ?? '',
        expectativaVidaMin: e.expectativaVidaMin?.toString() ?? '',
        expectativaVidaMax: e.expectativaVidaMax?.toString() ?? '',
        apareceEmCasas: e.apareceEmCasas,
        descricao: e.descricao ?? '',
        curiosidades: e.curiosidades ?? '',
        imagemUrl: e.imagemUrl ?? '',
        fonte: e.fonte ?? '',
        biomas: e.biomas.map((b) => b.bioma),
    }
}

// Na edição, campo vazio vira '' para limpar o valor; na criação, vira undefined.
function paraPayload(f: FormState, edicao: boolean): EspeciePayload {
    const opt = (s: string) => s.trim() || (edicao ? '' : undefined)
    const num = (s: string) => (s === '' ? undefined : Number(s))
    return {
        nomePopular: f.nomePopular.trim(),
        nomeCientifico: f.nomeCientifico.trim(),
        origem: f.origem,
        statusConservacao: f.statusConservacao,
        grupo: f.grupo,
        nivelRisco: f.nivelRisco,
        descricaoRisco: opt(f.descricaoRisco),
        expectativaVidaMin: num(f.expectativaVidaMin),
        expectativaVidaMax: num(f.expectativaVidaMax),
        apareceEmCasas: f.apareceEmCasas,
        descricao: opt(f.descricao),
        curiosidades: opt(f.curiosidades),
        imagemUrl: opt(f.imagemUrl),
        fonte: opt(f.fonte),
        biomas: f.biomas,
    }
}

function Painel() {
    const navigate = useNavigate()
    const [lista, setLista] = useState<Especie[]>([])
    const [total, setTotal] = useState(0)
    const [busca, setBusca] = useState('')
    const [buscaAplicada, setBuscaAplicada] = useState('')
    const [editando, setEditando] = useState<Especie | 'novo' | null>(null)
    const [form, setForm] = useState<FormState>(VAZIO)
    const [erro, setErro] = useState('')
    const [msg, setMsg] = useState('')
    const [salvando, setSalvando] = useState(false)

    const carregar = useCallback(async () => {
        try {
            const r = await listarEspecies({
                page: 1, limit: 50, busca: buscaAplicada, grupo: '', status: '', apareceEmCasas: false,
            })
            setLista(r.data)
            setTotal(r.total)
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar.')
        }
    }, [buscaAplicada])

    useEffect(() => {
        carregar()
    }, [carregar])

    function tratarErro(e: unknown) {
        setErro(e instanceof Error ? e.message : 'Erro inesperado.')
        if (!lerSessao()) navigate('/login') // sessão expirada
    }

    function abrirNovo() {
        setForm(VAZIO)
        setEditando('novo')
        setErro('')
        setMsg('')
    }

    function abrirEdicao(e: Especie) {
        setForm(paraForm(e))
        setEditando(e)
        setErro('')
        setMsg('')
    }

    function campo<K extends keyof FormState>(k: K, v: FormState[K]) {
        setForm((f) => ({ ...f, [k]: v }))
    }

    function alternarBioma(b: Bioma) {
        setForm((f) => ({
            ...f,
            biomas: f.biomas.includes(b) ? f.biomas.filter((x) => x !== b) : [...f.biomas, b],
        }))
    }

    async function salvar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErro('')

        const min = form.expectativaVidaMin === '' ? null : Number(form.expectativaVidaMin)
        const max = form.expectativaVidaMax === '' ? null : Number(form.expectativaVidaMax)
        if (min !== null && max !== null && min > max) {
            setErro('A expectativa de vida mínima não pode ser maior que a máxima.')
            return
        }

        setSalvando(true)
        try {
            if (editando === 'novo') {
                await criarEspecie(paraPayload(form, false))
            } else if (editando) {
                await atualizarEspecie(editando.id, paraPayload(form, true))
            }
            setEditando(null)
            setMsg('Espécie salva com sucesso.')
            await carregar()
        } catch (err) {
            tratarErro(err)
        } finally {
            setSalvando(false)
        }
    }

    async function excluir(e: Especie) {
        if (!window.confirm(`Apagar "${e.nomePopular}"? Essa ação não pode ser desfeita.`)) return
        setErro('')
        setMsg('')
        try {
            await excluirEspecie(e.id)
            setMsg(`"${e.nomePopular}" foi apagada.`)
            await carregar()
        } catch (err) {
            tratarErro(err)
        }
    }

    return (
        <main className="admin-page">
            <section className="container py-5">
                <h1>Painel do administrador</h1>

                {erro && <p className="adm-erro" role="alert">{erro}</p>}
                {msg && <p className="adm-ok" role="status">{msg}</p>}

                {editando === null && (
                    <>
                        <div className="adm-barra">
                            <input
                                type="text"
                                placeholder="Buscar espécie..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && setBuscaAplicada(busca)}
                            />
                            <button className="adm-btn" onClick={() => setBuscaAplicada(busca)}>Buscar</button>
                            <button className="adm-btn adm-verde" onClick={abrirNovo}>+ Nova espécie</button>
                        </div>

                        <p>{total} espécie(s){total > lista.length && ` (mostrando as ${lista.length} primeiras, use a busca)`}</p>

                        <div className="table-responsive">
                            <table className="table adm-tabela align-middle">
                                <thead>
                                    <tr><th>Nome</th><th>Grupo</th><th>Status</th><th>Risco</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {lista.map((e) => (
                                        <tr key={e.id}>
                                            <td><strong>{e.nomePopular}</strong><br /><em>{e.nomeCientifico}</em></td>
                                            <td>{GRUPOS[e.grupo] ?? e.grupo}</td>
                                            <td>{STATUS[e.statusConservacao]?.nome ?? e.statusConservacao}</td>
                                            <td>{RISCO[e.nivelRisco]?.nome ?? e.nivelRisco}</td>
                                            <td className="adm-acoes">
                                                <button className="adm-btn" onClick={() => abrirEdicao(e)}>Editar</button>
                                                <button className="adm-btn adm-vermelho" onClick={() => excluir(e)}>Apagar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {lista.length === 0 && <tr><td colSpan={5} className="text-center">Nenhuma espécie.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {editando !== null && (
                    <form className="adm-form" onSubmit={salvar}>
                        <h2>{editando === 'novo' ? 'Nova espécie' : `Editar: ${editando.nomePopular}`}</h2>

                        <div className="adm-grade">
                            <label>Nome popular *
                                <input required maxLength={120} value={form.nomePopular} onChange={(e) => campo('nomePopular', e.target.value)} />
                            </label>
                            <label>Nome científico *
                                <input required maxLength={150} value={form.nomeCientifico} onChange={(e) => campo('nomeCientifico', e.target.value)} />
                            </label>
                            <label>Origem
                                <select value={form.origem} onChange={(e) => campo('origem', e.target.value)}>
                                    {Object.entries(ORIGENS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </label>
                            <label>Grupo
                                <select value={form.grupo} onChange={(e) => campo('grupo', e.target.value)}>
                                    {Object.entries(GRUPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </label>
                            <label>Status de conservação
                                <select value={form.statusConservacao} onChange={(e) => campo('statusConservacao', e.target.value)}>
                                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{k} - {v.nome}</option>)}
                                </select>
                            </label>
                            <label>Risco para as pessoas
                                <select value={form.nivelRisco} onChange={(e) => campo('nivelRisco', e.target.value)}>
                                    {Object.entries(RISCO).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
                                </select>
                            </label>
                            <label>Expectativa de vida mínima (anos)
                                <input type="number" min={0} value={form.expectativaVidaMin} onChange={(e) => campo('expectativaVidaMin', e.target.value)} />
                            </label>
                            <label>Expectativa de vida máxima (anos)
                                <input type="number" min={0} value={form.expectativaVidaMax} onChange={(e) => campo('expectativaVidaMax', e.target.value)} />
                            </label>
                        </div>

                        <fieldset className="adm-biomas">
                            <legend>Onde vive (biomas)</legend>
                            {BIOMAS.map((b) => (
                                <label key={b}>
                                    <input type="checkbox" checked={form.biomas.includes(b)} onChange={() => alternarBioma(b)} />
                                    {formatarBioma(b)}
                                </label>
                            ))}
                        </fieldset>

                        <label className="adm-check">
                            <input type="checkbox" checked={form.apareceEmCasas} onChange={(e) => campo('apareceEmCasas', e.target.checked)} />
                            Costuma aparecer em casas
                        </label>

                        <label>Descrição
                            <textarea rows={3} value={form.descricao} onChange={(e) => campo('descricao', e.target.value)} />
                        </label>
                        <label>Risco e o que fazer (aparece quando o risco não é "Sem risco")
                            <textarea rows={3} value={form.descricaoRisco} onChange={(e) => campo('descricaoRisco', e.target.value)} />
                        </label>
                        <label>Curiosidades
                            <textarea rows={2} value={form.curiosidades} onChange={(e) => campo('curiosidades', e.target.value)} />
                        </label>
                        <label>URL da imagem
                            <input type="url" maxLength={500} placeholder="https://..." value={form.imagemUrl} onChange={(e) => campo('imagemUrl', e.target.value)} />
                        </label>
                        <label>Fonte (cite a referência)
                            <input maxLength={255} value={form.fonte} onChange={(e) => campo('fonte', e.target.value)} />
                        </label>

                        <div className="adm-acoes">
                            <button type="submit" className="adm-btn adm-verde" disabled={salvando}>
                                {salvando ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button type="button" className="adm-btn" onClick={() => { setEditando(null); setErro('') }}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </main>
    )
}

function Admin() {
    const sessao = lerSessao()
    // Isso é só conveniência de tela. Quem protege de verdade é o guard da API.
    if (sessao?.usuario.perfil !== 'Admin') return <Navigate to="/login" replace />

    return (
        <>
            <Helmet>
                <title>ADMIN - FaunaAlerta</title>
            </Helmet>
            <Painel />
        </>
    )
}

export default Admin