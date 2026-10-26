import './Cadastro.css'
import { Helmet } from 'react-helmet-async'
import '../../global/global.css'
import { Link } from 'react-router-dom'
import foto_cadastro from '../../assets/foto_cadastro.jpg'

function Cadastro() {
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

                        <form className="form-cadastro row g-2">
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
                                <input name="senha" type="password" id="senha" placeholder="Insira uma senha" required />
                            </div>
                            <div className="campo-cadastro col-md-12">
                                <label htmlFor="confirmar-senha">Confirme sua senha:</label>
                                <input name="confirmarSenha" type="password" id="confirmar-senha" placeholder="Confirme a senha" required />
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
                                <Link to="/CampoDocumentacao"><button type="submit" className="btn-cadastro">Criar conta</button></Link>
                            </div>
                            <div className="col-12 container-troca-cadastro">
                                <Link to="/CadastroPesquisador"><button type="button" className="btn-troca-cadastro">Cadastre-se como <strong>Pesquisador</strong></button></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Cadastro