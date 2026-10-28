import './Login.css'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import '../../global/global.css'
import { login } from '../../services/auth'

function Login() {
    const navigate = useNavigate()
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function entrar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)

        setErro('')
        setEnviando(true)
        try {
            const sessao = await login(String(form.get('email')), String(form.get('senha')))
            navigate(sessao.usuario.perfil === 'Admin' ? '/admin' : '/')
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao entrar.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>LOGIN - FaunaAlerta</title>
            </Helmet>

            <main className="d-flex align-items-center justify-content-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card-cadastro p-4 p-sm-5">
                                <h1 className="text-center mb-4 titulo-cadastro">EFETUE O LOGIN</h1>
                                <form onSubmit={entrar}>
                                    <div className="mb-4">
                                        <label className="form-label label-cadastro" htmlFor="email">E-mail</label>
                                        <input name="email" type="email" className="form-control input-cadastro" placeholder="E-mail" required id="email" />
                                    </div>

                                    <div className="mb-5">
                                        <label className="form-label label-cadastro" htmlFor="senha">Senha</label>
                                        <input name="senha" type="password" className="form-control input-cadastro" placeholder="Senha" required id="senha" />
                                    </div>

                                    {erro && <p className="text-danger text-center fw-bold" role="alert">{erro}</p>}

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-cadastro-laranja" disabled={enviando}>
                                            {enviando ? 'ENTRANDO...' : 'ENTRAR'}
                                        </button>
                                    </div>
                                    
                                </form>
                                <br/>
                                    <p className="nao-possui text-center mt-3 mb-0">
                                        Não possui conta?
                                    </p>
                                    <p className="clique-aqui text-center mt-3 mb-0">
                                        <Link to="/cadastro"><b>Clique aqui</b></Link>
                                    </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login