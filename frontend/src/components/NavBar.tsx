import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../assets/FaunaAlertaLogo.svg'
import '../global/global.css'
import { lerSessao, sair } from '../services/auth'

export function NavBar() {
    const navigate = useNavigate()
    const location = useLocation() // também faz a barra atualizar no login e no logout
    const sessao = lerSessao()
    const admin = sessao?.usuario.perfil === 'Admin'

    // Guardamos a página em que o menu foi aberto: ao navegar, ele fecha sozinho.
    const [menuEm, setMenuEm] = useState<string | null>(null)
    const [usuarioEm, setUsuarioEm] = useState<string | null>(null)
    const menuAberto = menuEm === location.pathname
    const usuarioAberto = usuarioEm === location.pathname
    const refUsuario = useRef<HTMLDivElement>(null)

    // fecha o menu do usuário ao clicar fora ou apertar Esc
    useEffect(() => {
        if (!usuarioAberto) return
        const fora = (e: MouseEvent) => {
            if (!refUsuario.current?.contains(e.target as Node)) setUsuarioEm(null)
        }
        const esc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setUsuarioEm(null)
        }
        document.addEventListener('mousedown', fora)
        document.addEventListener('keydown', esc)
        return () => {
            document.removeEventListener('mousedown', fora)
            document.removeEventListener('keydown', esc)
        }
    }, [usuarioAberto])

    function sairDaConta() {
        setUsuarioEm(null)
        sair()
        navigate('/')
    }

    return (
        <header className={`Topo ${sessao?.usuario.perfil === 'Pesquisador' ? 'modo-pesquisador' : ''}`}>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img src={Logo} width="60" alt="Logo" />
                        <span className="texto-logo ms-2">FaunAlerta</span>
                    </Link>

                    {/* Botão Hambúrguer */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-label="Abrir menu"
                        aria-expanded={menuAberto}
                        onClick={() => setMenuEm(menuAberto ? null : location.pathname)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Menu */}
                    <div className={`menuu collapse navbar-collapse ${menuAberto ? 'show' : ''}`} id="menu">

                        <ul className="navbar-nav mx-auto gap-3">
                            <li className="nav-item">
                                <Link className="nav-link menu-btn" to="/">
                                    <i className="bi bi-house-door fs-4"></i>
                                    <strong>Home</strong>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-btn" to="/Ong">
                                    <i className="bi bi-heart fs-4"></i>
                                    <strong>ONGs</strong>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-btn" to="/especies">
                                    <i className="bi bi-book fs-4"></i>
                                    <strong>Espécies</strong>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-btn" to="/denuncia">
                                    <i className="bi bi-megaphone fs-4"></i>
                                    <strong>Denúncia</strong>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-btn" to="/sobre">
                                    <i className="bi bi-info-circle fs-4"></i>
                                    <strong>Sobre</strong>
                                </Link>
                            </li>
                        </ul>

                        {/* Área do usuário */}
                        {sessao ? (
                            <div className="menu-usuario" ref={refUsuario}>
                                <button
                                    type="button"
                                    className="menu-btn border-0 bg-transparent"
                                    aria-haspopup="menu"
                                    aria-expanded={usuarioAberto}
                                    onClick={() => setUsuarioEm(usuarioAberto ? null : location.pathname)}
                                >
                                    <i className="bi bi-person-circle fs-4"></i>
                                    <strong>Olá, {sessao.usuario.nome.split(' ')[0]}</strong>
                                    <i className="bi bi-chevron-down"></i>
                                </button>

                                {usuarioAberto && (
                                    <div className="menu-usuario-lista" role="menu">
                                        <Link to="/perfil" role="menuitem">Meu perfil</Link>
                                        {admin && (
                                            <>
                                                <Link to="/admin" role="menuitem">Painel de espécies</Link>
                                                <Link to="/admin/pesquisadores" role="menuitem">Pesquisadores</Link>
                                            </>
                                        )}
                                        <button type="button" role="menuitem" onClick={sairDaConta}>Sair</button>
                                    </div>
                                )}
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