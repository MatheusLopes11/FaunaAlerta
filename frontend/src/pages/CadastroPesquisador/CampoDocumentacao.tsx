import './CadastroPesquisador.css'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import '../../global/global.css'
import { Link } from 'react-router-dom'
import foto_cadastro from '../../assets/foto_cadastro.jpg'
import type { DadosEtapa1 } from './CadastroPesquisador'

interface Props {
    dadosEtapa1: DadosEtapa1
    onVoltar: () => void
}

function CampoDocumentacao({ dadosEtapa1, onVoltar }: Props) {
    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = new FormData(e.currentTarget)
        const cadastroCompleto = {
            ...dadosEtapa1, // nome, email, telefone, senha (etapa 1)
            areaPesquisa: String(form.get('areaPesquisa')),
            instituicao: String(form.get('instituicao')),
        }

        // TODO: enviar para o back-end (fetch/axios) e depois redirecionar
        console.log(cadastroCompleto)
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

                            <div className="termos-cadastro col-12">
                                <input type="checkbox" id="termos" required />
                                <label htmlFor="termos">Li e aceito os <strong>Termos e Condições</strong> e a <strong>Política de Privacidade</strong></label>
                            </div>

                            <div className="col-12">
                                <p className="verifica-login">
                                    Já tem uma conta? <Link to="/Login"><strong>Faça o login</strong></Link>
                                </p>
                            </div>

                            <div className="col-12">
                                <button type="submit" className="btn-cadastro">Criar conta</button>
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
