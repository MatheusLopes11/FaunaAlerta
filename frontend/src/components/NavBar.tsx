import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/FaunaAlertaLogo.svg';
import '../global/global.css'
import { lerSessao, sair } from '../services/auth'

export function NavBar() {
    const navigate = useNavigate()
    useLocation() // faz a barra atualizar quando a rota muda (login e logout)
    const sessao = lerSessao()
    return (
        <header className={`Topo ${sessao?.usuario.perfil === 'Pesquisador' ? 'modo-pesquisador' : ''}`}>
            <nav className="navbar navbar-expand-md">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img src={Logo} width="60" alt="Logo" />
                        <span className="texto-logo ms-2">FaunAlerta</span>
                    </Link>
                    {/* Botão Hambúrguer (Bootstrap) */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Menu */}
                    <div className="menuu collapse navbar-collapse" id="menu">

                        {/* Lista não-ordenada */}
                        <ul className="navbar-nav mx-auto gap-3">

                        {/* Botão Home */}
                        <li className="nav-item">
                            <Link className="nav-link menu-btn" to="/">
                                <i className="bi bi-house-door fs-4"></i>
                                <strong>Home</strong>
                            </Link>
                        </li>

                        {/* Botão Informativa */}
                        <li className="nav-item">
                            <Link className="nav-link menu-btn" to="/especies">
                                <i className="bi bi-book fs-4"></i>
                                <strong>Espécies</strong>
                            </Link>
                        </li>

                        {/*Botão Ongs*/}
                        <li className="nav-item">
                        
                            <Link className="nav-link menu-btn " to="/Ong">
                                <i className="bi bi-heart fs-4"></i>
                                <strong>ONGs</strong>  
                            </Link>
                        </li>                       
                        {/* Botão Denúncia */}
                        <li className="nav-item">
                            <Link className="nav-link menu-btn" to="/denuncia">
                            <i className="bi bi-megaphone fs-4"></i>
                            <strong>Denúncia</strong>
                            </Link>
                        </li>

                        {/* Botão Sobre */}
                        <li className="nav-item">
                            <Link className="nav-link menu-btn" to="/sobre">
                            <i className="bi bi-info-circle fs-4"></i>
                            <strong>Sobre</strong>
                            </Link>
                        </li>

                        </ul>

                        {/* Botão Usuário (Login) */}
                        {sessao ? (
                             <div className="d-flex align-items-center gap-3">
                             {sessao.usuario.perfil === 'Admin' && (
                              <Link to="/admin" className="nav-link menu-btn"><strong>Admin</strong></Link>
                             )}
                             <span>Olá, {sessao.usuario.nome.split(' ')[0]}</span>
                            <button
                              type="button"
                                 className="menu-btn border-0 bg-transparent"
                                onClick={() => { sair(); navigate('/') }}
                                 >
                         <strong>Sair</strong>
                            </button>
                            </div>
                            ) : (
                                <Link to="/login" className="user-btn">
                                    <i className="bi bi-person fs-3"></i>
                                </Link>
                            )}

                    </div>
                </div>
            </nav>
        </header>
    )
}