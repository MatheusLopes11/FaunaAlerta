import './Sobre.css'
import { Helmet } from 'react-helmet-async'
import '../../global/global.css'

function Sobre() {

    return (
        <>
            <Helmet>
                <title>SOBRE - FaunaAlerta</title>
            </Helmet>
            
            <main className="sobre-page">

                {/* O QUE É NOSSO PROJETO */}
                <section className="container py-5">

                    

                    <div className="card card-sobre mx-auto shadow-sm">
                        <h1 className="titulo-secao text-center mb-5">
                            O QUE É NOSSO PROJETO?
                        </h1>
                        <div className="card-body">

                            <p>
                                O <span>FaunaAlerta</span> é um projeto de software desenvolvido para auxiliar na preservação
                                da fauna e flora brasileira por meio da participação da população e do apoio aos
                                órgãos ambientais. A plataforma foi criada para facilitar denúncias de crimes
                                ambientais, como tráfico de animais, caça, pesca ilegal e maus-tratos, além do
                                registro de avistamentos de espécies invasoras ou ameaçadas de extinção.
                            </p>
                            <hr/>
                                <p>
                                    O sistema permite que os usuários enviem informações sobre ocorrências,
                                    incluindo fotos, vídeos e localização, tornando a comunicação com órgãos
                                    responsáveis mais rápida, acessível e organizada. Além disso, o <span>FaunaAlerta</span>
                                    também busca conscientizar a população sobre a biodiversidade brasileira,
                                    incentivando a preservação ambiental e o combate à desinformação sobre animais
                                    silvestres.
                                </p>
                                <hr/>
                                    <p>
                                        O projeto está alinhado aos <span id="ONU"><b>Objetivos de Desenvolvimento Sustentável da ONU</b></span>,
                                        principalmente a <span id="ODS14">ODS 14</span> – <span id="ODS14">Vida na Água</span> e a <span id="ODS15">ODS 15</span> – <span id="ODS15">Vida Terrestre</span>.
                                        A <span id="ODS14">ODS 14</span> tem como objetivo a conservação dos oceanos, mares e recursos marinhos,
                                        combatendo práticas como a pesca ilegal e a degradação dos ecossistemas
                                        aquáticos. Já a <span id="ODS15">ODS 15</span> busca proteger os ecossistemas terrestres, preservar
                                        a biodiversidade, combater o tráfico de animais e reduzir os impactos causados
                                        por espécies invasoras.
                                    </p>



                                </div>
                        </div>

                </section>

                {/* QUEM SOMOS */}
                <section className="container py-5">

                    

                    <div className="card card-sobre mx-auto shadow-sm">
                        <h1 className="titulo-secao text-center mb-5">
                            QUEM SOMOS
                        </h1>
                        <div className="card-body">

                            <p>
                                Somos estudantes do curso de Desenvolvimento de Software Multiplataforma (DSM)
                                e desenvolvemos o projeto FaunaAlerta como parte do Projeto Integrador, unindo
                                tecnologia, conscientização ambiental e impacto social.


                                O projeto está sendo desenvolvido em Diadema – SP, utilizando tecnologias web como <span id="HTML"><b>HTML5</b></span>,
                                <span id="CSS"><b>CSS3</b></span> e <span id="JS"><b>JavaScript</b></span>, com foco em acessibilidade, usabilidade e inovação.
                            </p>

                            <hr/>
                                <div className="integrantes">
                                    <p className="mb-2">Equipe:</p>
                                    <ul className="lista-integrantes">
                                        <li><span className="nome-integrante">Anselmo Pereira de Lima</span>    <a href="https://github.com/AnselmoPlima"><i className="bi bi-github"></i></a></li>
                                        <li><span className="nome-integrante">Gustavo Fernández Ferreira</span> <a href="https://github.com/gustavo-ferndez"><i className="bi bi-github"></i></a></li>
                                        <li><span className="nome-integrante">Kevin Afonso de Jesus Gomes</span><a href="https://github.com/Kevingms-dev"><i className="bi bi-github"></i></a></li>
                                        <li><span className="nome-integrante">Marcelo de Souza Siciliano</span> <a href="https://github.com/MarceloFatec2450"><i className="bi bi-github"></i></a></li>
                                        <li><span className="nome-integrante">Matheus Ferreira Lopes</span>     <a href="https://github.com/MatheusLopes11"><i className="bi bi-github"></i></a></li>
                                        <li><span className="nome-integrante">Sophia Santoro Rodrigues</span>   <a href="https://github.com/SophiaRodrigues-S"><i className="bi bi-github"></i></a></li>
                                        <li><span className="nome-integrante">Wagner Acácio da Silva</span>     <a href="https://github.com/pequetux"><i className="bi bi-github"></i></a></li>
                                    </ul>
                                </div>


                        </div>
                    </div>

                </section>

            </main>
        </>
    )
}

export default Sobre