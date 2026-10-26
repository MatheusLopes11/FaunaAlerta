import './Home.css'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom' 
import '../../global/global.css'
import noticiaa1 from '../../assets/noticia1.jpg'
import noticiaa2 from '../../assets/noticia2.jpeg'
import noticiaa3 from '../../assets/noticia3.jpg'
import Logo_IBAMA from '../../assets/Logo_IBAMA.svg.png'
import logoipe from '../../assets/logoipe.png'
import ambientallogo from '../../assets/ambientallogo.png'
import ICMBioLOGO from '../../assets/ICMBioLOGO.png.png'


function Home() {

  return (
    <>
      <Helmet>
        <title>FaunaAlerta</title>
      </Helmet>
      
      <main className="container-home">

        {/* BANNER */}
        <section className="banner">
          <div className="overlay">
            <div className="container h-100 d-flex align-items-center">
              <Link to="/denuncia" className="btn">
                DENUNCIE AQUI
              </Link>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="como-funciona py-5">
          <div className="container">

            <h2 className="section-title text-center mb-4">COMO FUNCIONA?</h2>

            <div className="funciona-card mx-auto">
              <p className="funciona-descricao text-center mb-4">
                Somos como se fosse uma ponte para você, facilitando a sua denúncia
                e garantindo que ela chegue nas autoridades certas
              </p>

              {/* Fluxo: Usuário → Alerta → Autoridade */}
              <div className="fluxo d-flex align-items-center justify-content-center gap-3">

                {/* Usuário */}
                <div className="fluxo-item text-center">
                  <i className="bi bi-person-fill fluxo-icon"></i>
                </div>

                {/* Linha + Ícone de alerta */}
                <div className="fluxo-linha d-flex align-items-center flex-grow-1 position-relative">
                  <div className="linha"></div>
                  <div className="fluxo-alerta">
                    <i className="bi bi-exclamation-circle-fill"></i>
                  </div>
                </div>

                {/* Autoridade */}
                <div className="fluxo-item text-center">
                  <i className="bi bi-person-badge-fill fluxo-icon"></i>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ===== NOTÍCIAS ===== */}
        <section className="noticias py-5">
          <div className="container">

            <h2 className="section-title text-center mb-4">NOTÍCIAS</h2>

            <div id="carouselNoticias" className="carousel slide carousel-fade" data-bs-ride="carousel">

              {/* Indicadores */}
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselNoticias" data-bs-slide-to="0" className="active"></button>
                <button type="button" data-bs-target="#carouselNoticias" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#carouselNoticias" data-bs-slide-to="2"></button>
              </div>

              {/* Slides */}
              <div className="carousel-inner rounded-4 overflow-hidden shadow">

                {/* Slide 1 */}
                <div className="carousel-item active">
                  <img src={noticiaa1} className="d-block w-100 noticia-img" alt="Notícia 1" />

                  <div className="carousel-caption custom-caption">
                    <h3>Resgate de animais silvestres cresce no Brasil</h3>
                    <p>
                      Organizações ambientais registram aumento nas denúncias
                      e salvamentos de fauna em áreas urbanas.
                    </p>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="carousel-item">
                  <img src={noticiaa2} className="d-block w-100 noticia-img" alt="Notícia 2" />

                  <div className="carousel-caption custom-caption">
                    <h3>Combate ao tráfico de animais é intensificado</h3>
                    <p>
                      Autoridades ambientais reforçam operações em rodovias
                      e fronteiras brasileiras.
                    </p>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="carousel-item">
                  <img src={noticiaa3} className="d-block w-100 noticia-img" alt="Notícia 3" />

                  <div className="carousel-caption custom-caption">
                    <h3>Educação ambiental nas escolas</h3>
                    <p>
                      Projetos educativos incentivam crianças e jovens
                      a protegerem a fauna brasileira.
                    </p>
                  </div>
                </div>

              </div>

              {/* Botões */}
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselNoticias" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>

              <button className="carousel-control-next" type="button" data-bs-target="#carouselNoticias" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>

            </div>
          </div>
        </section>

        {/* ===== PARCEIROS ===== */}
        <section className="parceiros py-5">
          <div className="container">

            <h2 className="section-title text-center mb-4">PARCEIROS</h2>

            <div className="row justify-content-center align-items-center g-4">

              {/* IBAMA */}
              <div className="col-6 col-md-3 text-center">
                <div className="parceiro-card">
                  <img src={Logo_IBAMA} alt="IBAMA" className="parceiro-logo" />
                  <p className="parceiro-nome"><br /></p>
                </div>
              </div>

              {/* IPÊ */}
              <div className="col-6 col-md-3 text-center">
                <div className="parceiro-card">
                  <img src={logoipe} alt="IPÊ" className="parceiro-logo" />
                  <p className="parceiro-nome"></p>
                </div>
              </div>

              {/* AMBIENTAL */}
              <div className="col-6 col-md-3 text-center">
                <div className="parceiro-card">
                  <img src={ambientallogo} alt="Ambiental" className="parceiro-logo" />
                  <p className="parceiro-nome"></p>
                </div>
              </div>

              {/* ICMBio */}
              <div className="col-6 col-md-3 text-center">
                <div className="parceiro-card">
                  <img src={ICMBioLOGO} alt="ICMBio" className="parceiro-logo" />
                  <p className="parceiro-nome"></p>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>
    </>
  )
}

export default Home