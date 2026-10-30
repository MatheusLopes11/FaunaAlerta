import './Cadastro.css'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import '../../global/global.css'
import { Link, useNavigate } from 'react-router-dom'
import foto_cadastro from '../../assets/foto_cadastro.jpg'
import { cadastrarUsuario } from '../../services/auth'

function Cadastro() {
    const navigate = useNavigate()
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const senha = String(form.get('senha'))

        if (senha !== String(form.get('confirmarSenha'))) {
            setErro('As senhas não coincidem.')
            return
        }

        setErro('')
        setEnviando(true)
        try {
            await cadastrarUsuario({
                nome: String(form.get('nome')).trim(),
                email: String(form.get('email')).trim(),
                telefone: String(form.get('telefone')).trim(),
                senha,
            })
            navigate('/')
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao criar a conta.')
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
                                <label htmlFor="nome">Digite seu nome:</label>
                                <input name="nome" type="text" id="nome" placeholder="Insira seu nome" required />
                            </div>

                            <div className="campo-cadastro col-12">
                                <label htmlFor="email">Digite seu email:</label>
                                <input name="email" type="email" id="email" placeholder="Insira seu e-mail" required />
                            </div>

                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="telefone">Digite seu telefone:</label>
                                <input name="telefone" type="tel" id="telefone" placeholder="Insira seu telefone com DDD" required />
                            </div>

                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="senha">Crie uma senha:</label>
                                <input name="senha" type="password" id="senha" placeholder="Mínimo de 8 caracteres" minLength={8} required />
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
                                    Já tem uma conta? <Link to="/login"><strong>Faça o login</strong></Link>
                                </p>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn-cadastro" disabled={enviando}>
                                    {enviando ? 'Criando conta...' : 'Criar conta'}
                                </button>
                            </div>
                            <div className="col-12 container-troca-cadastro">
                                <button type="button" className="btn-troca-cadastro" onClick={() => navigate('/CadastroPesquisador')}>
                                    Cadastre-se como <strong>Pesquisador</strong>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Cadastro