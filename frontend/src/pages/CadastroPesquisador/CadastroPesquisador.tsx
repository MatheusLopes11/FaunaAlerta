import './CadastroPesquisador.css'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import '../../global/global.css'
import { Link, useNavigate } from 'react-router-dom'
import foto_cadastro from '../../assets/foto_cadastro.jpg'
import CampoDocumentacao from './CampoDocumentacao'

// Dados da etapa 1. A etapa 2 recebe isso e junta com os dela no envio final.
export interface DadosEtapa1 {
    nome: string
    email: string
    telefone: string
    senha: string
}

function CadastroPesquisador() {
    const navigate = useNavigate()
    const [etapa, setEtapa] = useState<1 | 2>(1)
    const [dados, setDados] = useState<DadosEtapa1>({ nome: '', email: '', telefone: '', senha: '' })
    const [erro, setErro] = useState('')

    function avancar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault() // impede o recarregamento da página

        // Se chegou aqui, o navegador já validou os "required", "type=email", etc.
        const form = new FormData(e.currentTarget)
        const senha = String(form.get('senha'))
        const confirmarSenha = String(form.get('confirmarSenha'))

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.')
            return
        }

        setErro('')
        setDados({
            nome: String(form.get('nome')),
            email: String(form.get('email')),
            telefone: String(form.get('telefone')),
            senha,
        })
        setEtapa(2)
    }

    if (etapa === 2) {
        return <CampoDocumentacao dadosEtapa1={dados} onVoltar={() => setEtapa(1)} />
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

                        <form className="form-cadastro row g-3" onSubmit={avancar}>
                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="nome-pesquisador">Digite seu nome:</label>
                                <input name="nome" type="text" id="nome-pesquisador" placeholder="Insira seu nome" defaultValue={dados.nome} required />
                            </div>

                            <div className="campo-cadastro col-12">
                                <label htmlFor="email-institucional">Digite seu email institucional:</label>
                                <input name="email" type="email" id="email-institucional" placeholder="Insira seu e-mail" defaultValue={dados.email} required />
                            </div>

                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="telefone-pesquisador">Digite seu telefone:</label>
                                <input name="telefone" type="tel" id="telefone-pesquisador" placeholder="Insira seu telefone com DDD" defaultValue={dados.telefone} required />
                            </div>

                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="senha">Crie uma senha:</label>
                                <input name="senha" type="password" id="senha" placeholder="Insira uma senha" minLength={8} required />
                            </div>
                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="confirmar-senha">Confirme sua senha:</label>
                                <input name="confirmarSenha" type="password" id="confirmar-senha" placeholder="Confirme a senha" minLength={8} required />
                            </div>

                            {erro && <p className="erro-cadastro" role="alert">{erro}</p>}

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
                                <button type="submit" className="btn-cadastro">Continuar</button>
                            </div>
                            <div className="col-12 container-troca-cadastro">
                                <button type="button" className="btn-troca-cdusuario" onClick={() => navigate('/Cadastro')}>
                                    Cadastre-se como <strong>Usuário</strong>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CadastroPesquisador
