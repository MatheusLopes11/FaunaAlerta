import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import './Especies.css'
import '../../global/global.css'
import type { Especie } from '../../services/especies'
import { STATUS, GRUPOS, buscarEspecie, formatarBioma, riscoDaEspecie } from '../../services/especies'
import FotoEspecie from '../../components//FotoEspecie/FotoEspecie'

function EspecieDetalhe() {
    const { id } = useParams()
    const [especie, setEspecie] = useState<Especie | null>(null)
    const [erro, setErro] = useState('')

    useEffect(() => {
        if (!id) return
        const controller = new AbortController()
        setEspecie(null)
        setErro('')
        buscarEspecie(id, controller.signal)
            .then(setEspecie)
            .catch((e: Error) => {
                if (e.name !== 'AbortError') setErro(e.message)
            })
        return () => controller.abort()
    }, [id])

    const vida =
        especie?.expectativaVidaMin != null && especie?.expectativaVidaMax != null
            ? `${especie.expectativaVidaMin} a ${especie.expectativaVidaMax} anos`
            : especie?.expectativaVidaMax != null
              ? `até ${especie.expectativaVidaMax} anos`
              : especie?.expectativaVidaMin != null
                ? `${especie.expectativaVidaMin} anos ou mais`
                : 'Não informada'

    return (
        <>
            <Helmet>
                <title>{especie ? `${especie.nomePopular} - FaunaAlerta` : 'Espécie - FaunaAlerta'}</title>
            </Helmet>

            <main className="especies-page">
                <section className="container py-5">
                    <Link to="/especies" className="especie-voltar">← Voltar ao catálogo</Link>

                    {erro && <p className="especies-erro" role="alert">{erro}</p>}
                    {!especie && !erro && <p>Carregando...</p>}

                    {especie && (
                        <article className="especie-detalhe">
                            <div className="row g-4">
                                <div className="col-md-5">
                                    <FotoEspecie key={especie.id} src={especie.imagemUrl} alt={especie.nomePopular} grande className="especie-foto-grande" />
                                    {especie.imagemCredito && <small className="especie-credito">Foto: {especie.imagemCredito}</small>}
                                </div>

                                <div className="col-md-7">
                                    <h1>{especie.nomePopular}</h1>
                                    <em>{especie.nomeCientifico}</em>

                                    <div className="especie-selos my-3">
                                        <span className="selo" style={{ background: STATUS[especie.statusConservacao]?.cor }}>
                                            {STATUS[especie.statusConservacao]?.nome}
                                        </span>
                                        <span className="selo" style={{ background: riscoDaEspecie(especie).cor }}>
                                            {riscoDaEspecie(especie).nome}
                                        </span>
                                    </div>

                                    {especie.descricao && <p>{especie.descricao}</p>}

                                    <ul className="especie-dados">
                                        <li><strong>Grupo:</strong> {GRUPOS[especie.grupo] ?? especie.grupo}</li>
                                        <li><strong>Origem:</strong> {especie.revisado ? especie.origem.replace('_', ' ').toLowerCase() : 'Não confirmada'}</li>
                                        <li><strong>Expectativa de vida:</strong> {vida}</li>
                                        <li>
                                            <strong>Onde vive:</strong>{' '}
                                            {especie.biomas.length
                                                ? especie.biomas.map((b) => formatarBioma(b.bioma)).join(', ')
                                                : 'Não informado'}
                                        </li>
                                        <li><strong>Aparece em casas:</strong> {!especie.revisado ? 'Não informado' : especie.apareceEmCasas ? 'Sim' : 'Não'}</li>
                                    </ul>
                                </div>
                            </div>

                            {especie.revisado && especie.nivelRisco !== 'NENHUM' && especie.descricaoRisco && (
                                <div className="especie-alerta">
                                    <h2>Risco e o que fazer</h2>
                                    <p>{especie.descricaoRisco}</p>
                                </div>
                            )}

                            {!especie.revisado && (
                                <div className="especie-aviso">
                                    <h2>Informações de segurança em revisão</h2>
                                    <p>
                                        O risco desta espécie para as pessoas ainda não foi avaliado. Por precaução, não se aproxime
                                        nem manuseie animais silvestres e, se precisar de ajuda, avise o órgão ambiental da sua região.
                                    </p>
                                </div>
                            )}

                            {especie.curiosidades && (
                                <div className="mt-4">
                                    <h2>Curiosidades</h2>
                                    <p>{especie.curiosidades}</p>
                                </div>
                            )}

                            {especie.fonte && <p className="especie-fonte">Fonte: {especie.fonte}</p>}
                        </article>
                    )}
                </section>
            </main>
        </>
    )
}

export default EspecieDetalhe