import { Link } from 'react-router-dom';
import Logo from '../assets/FaunaAlertaLogo.svg'
import twitterxicone from '../assets/twitterxicone.png'
import instragram from '../assets/instagram.png'
import facebook from '../assets/facebook.png'
import '../global/global.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center">

          {/* Logo */}
          <div className="col-12 col-md-4 text-center text-md-start mb-4 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <img src={Logo} className="footer-logo" alt="Logo FaunaAlerta" />
              <h2 className="logo-nome ms-3">
                <span style={{color: '#4e3f37'}}>Faun</span>Alerta
              </h2>
            </div>
          </div>

          {/* Contato e Redes Sociais */}
          <div className="divtelefone col-12 col-md-4 text-center mb-4 mb-md-0">
            <p className="telefone mb-1">
              <strong>Telefone</strong>
              <span>(11) 99999-9999</span>
            </p>

            <p className="email">
              <strong>Email</strong>
              <a href="mailto:faunalerta@gmail.com"><span>faunalerta@gmail.com</span></a>
            </p>

            <div className="d-flex justify-content-center gap-5 mt-3">
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                <img src={twitterxicone} className="icone-social" alt="Twitter/X" />
              </a>
              <a href="https://www.facebook.com/?locale=pt_BR" target="_blank" rel="noopener noreferrer">
                <img src={facebook} className="icone-social" alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <img src={instragram} className="icone-social" alt="Instagram" />
              </a>
            </div>
          </div>

          {/* Navegação do Rodapé */}
          <div className="links-footer col-12 col-md-4 text-center text-md-end">
            <nav className="footer-nav d-flex flex-column flex-md-column justify-content-md-end gap-3">
              <strong><Link to="/">Principal</Link></strong>
              <strong><Link to="/denuncia">Denúncias</Link></strong>
              <strong><Link to="/sobre">Sobre Nós</Link></strong>
              <strong><Link to="/login">Login</Link></strong>
            </nav>
          </div>

        </div>
      </div>
    </footer>
  );
}