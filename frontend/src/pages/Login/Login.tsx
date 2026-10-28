import './Login.css'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom' 
import '../../global/global.css'

function Login() {

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
                                <form className="form-login"> 

                                    <div className="campo-cadastro col-12">
                                        <label htmlFor="email">Digite seu email:</label>
                                        <input name="email" type="email" id="email" placeholder="Insira seu e-mail" required />
                                    </div>
                                    <div className="campo-cadastro col-md-12">
                                        <label htmlFor="senha">Crie uma senha:</label>
                                        <input name="senha" type="password" id="senha" placeholder="Insira uma senha" required />
                                    </div>

                                    <div className="col-12">
                                        <Link to="/CampoDocumentacao"><button type="submit" className="btn-login">Entrar</button></Link>
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