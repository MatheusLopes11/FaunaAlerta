import './Home.css';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../../global/global.css';
import Logo_IBAMA from '../../assets/Logo_IBAMA.svg.png';
import logoipe from '../../assets/logoipe.png';
import ambientallogo from '../../assets/ambientallogo.png';
import ICMBioLOGO from '../../assets/ICMBioLOGO.png.png';
import { NoticiasCarousel } from '../../components/NoticiasCarrossel/NoticiasCarousel';
import tarantula from '../../assets/tarantula.jpg'
import { MapaBiomas } from '../../components/MapaBiomas/MapaBiomas'


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

        <section className="container-como-funciona">
          <div className="texto-como-funciona">
            <h2>O QUE FAZEMOS?</h2>
            <p>
              Nós do FaunaAlerta temos como objetivo redirecionar seu alerta para o responsável certo,
              recebemos sua denúncia e a entregamos diretamente para o Órgão Ambiental de sua cidade.
              Para mais informações, consulte nossos Termos de Uso!
            </p>
          </div>
          <div className="diagrama">
            <div className="icones-person">
              <div className="item">
                <i className="bi bi-person-exclamation icone"></i>
                <span>FaunAlerta</span>
              </div>

              <div className="item">
                <i className="bi bi-bank2 icone"></i>
                <span>Órgão Ambiental</span>
              </div>
            </div>
            <div className="icones-arrows-triangle">
              <i className="bi bi-arrow-up-left seta seta-esquerda"></i>
              <div className="item">
                <i className="bi bi-exclamation-triangle-fill icone"></i>
                <span>Sua denúncia</span>
              </div>
              <i className="bi bi-arrow-up-right seta"></i>
            </div>
          </div>
        </section>

        {/* ===== MAPA DOS BIOMAS ===== */}
        <MapaBiomas />

        {/* ===== NOTÍCIAS (SWIPER) ===== */}
        <section>
          <div className="container-carrosel mb-4">
            <NoticiasCarousel />
          </div>
        </section>

        {/* ===== CARDS INFORMATIVOS ===== */}
        <section className="container-card">
          <div className="card-especie-home">
            <div className="img-card">
              <img src={tarantula} alt="Tarântula" />
            </div>
            <div className="card-conteudo">
              <h2>Tarântulas</h2>
              <p>
                As tarântulas têm a incrível capacidade de regenerar as patas perdidas após uma muda de pele.
              </p>
              <Link to="/Especies" className="card-link">
                <button type="button" className="btn-especie-home">Saiba mais!</button>
              </Link>
            </div>
          </div>

          <div className="card-pesquisador">
            <div className="card-conteudo">
              <h2>SEJA UM PESQUISADOR</h2>
              <p>
                Sabia que sendo um estudante você pode ter acesso a milhares de dados?
                Com o FaunaAlerta você pode ter acesso a relatórios gráficos filtrados por espécies e região a sua escolha!
              </p>
              <Link to="/CadastroPesquisador" className="card-link">
                <button type="button" className="btn-cadastro-pesquisador">
                  Clique aqui para ser um <strong>Pesquisador</strong>
                </button>
              </Link>
            </div>
          </div>
        </section>
        {/* ===== PARCEIROS ===== */}
        <section className="parceiros py-5">
          <div className="container">

            <h2 className="titulo-parceiros text-center mb-4">PARCEIROS</h2>

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