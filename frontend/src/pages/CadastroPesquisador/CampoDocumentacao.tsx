import './CadastroPesquisador.css'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import '../../global/global.css'
import { Link, useNavigate } from 'react-router-dom'
import foto_cadastro from '../../assets/foto_cadastro.jpg'
import type { DadosEtapa1 } from './CadastroPesquisador'
import { cadastrarPesquisador } from '../../services/auth'

interface Props {
    dadosEtapa1: DadosEtapa1
    onVoltar: () => void
}

function CampoDocumentacao({ dadosEtapa1, onVoltar }: Props) {
    const navigate = useNavigate()
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const lattes = String(form.get('linkLattesOrcid')).trim()

        setErro('')
        setEnviando(true)
        try {
            await cadastrarPesquisador({
                nome: dadosEtapa1.nome.trim(),
                email: dadosEtapa1.email.trim(),
                telefone: dadosEtapa1.telefone.trim(),
                senha: dadosEtapa1.senha,
                areaPesquisa: String(form.get('areaPesquisa')).trim(),
                instituicao: String(form.get('instituicao')).trim(),
                linkLattesOrcid: lattes || undefined,
            })
            navigate('/perfil')
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao enviar o cadastro.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>CADASTRO - FaunaAlerta</title>
            </Helmet>

            <main className="main-cadastro flex-grow-1 d-flex align-items-center justify-content-center py-4 px-3">
                <div className="container-cadastro">
                    <div className="imagem-cadastro d-none d-md-block">
                        <img src={foto_cadastro} alt="imagem de cadastro" />
                    </div>

                    <div className="box-cadastros">
                        <h1 className="titulo-cadastro">CRIE UMA CONTA</h1>

                        <form className="form-cadastro row g-2" onSubmit={enviar}>
                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="area-pesquisa">Digite sua área de pesquisa:</label>
                                <input name="areaPesquisa" type="text" id="area-pesquisa" placeholder="Insira sua área de pesquisa" required />
                            </div>

                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="instituicao">Digite sua instituição:</label>
                                <input name="instituicao" type="text" id="instituicao" placeholder="Insira sua instituição" required />
                            </div>

                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="lattes">Link do Lattes ou ORCID (opcional):</label>
                                <input name="linkLattesOrcid" type="url" id="lattes" placeholder="https://lattes.cnpq.br/..." />
                            </div>

                            <p className="verifica-login">
                                Seu cadastro será analisado por um administrador antes de liberar os dados dos alertas.
                            </p>

                            {erro && <p className="erro-cadastro" role="alert">{erro}</p>}

                            <div className="termos-cadastro col-12">
                                <input type="checkbox" id="termos" required />
                                <label htmlFor="termos">Li e aceito os <strong>Termos e Condições</strong> e a <strong>Política de Privacidade</strong></label>
                            </div>

                            <div className="col-12">
                                <p className="verifica-login">
                                    Já tem uma conta? <Link to="/login"><strong>Faça o login</strong></Link>
                                </p>
                            </div>

                            <div className="col-12">
                                <button type="submit" className="btn-cadastro" disabled={enviando}>
                                    {enviando ? 'Enviando...' : 'Criar conta'}
                                </button>
                            </div>
                            <div className="col-12 container-troca-cadastro">
                                <button type="button" className="btn-troca-cdusuario" onClick={onVoltar}>
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CampoDocumentacao