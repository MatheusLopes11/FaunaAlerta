import { Link } from 'react-router-dom';
import Logo from '../assets/FaunaAlertaLogo.svg';
import '../global/global.css'

export function NavBar() {
    return (
        <header className="Topo">
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
                        <Link to="/login" className="user-btn">
                            <i className="bi bi-person fs-3"></i>
                        </Link>

                    </div>
                </div>
            </nav>
        </header>
    )
}