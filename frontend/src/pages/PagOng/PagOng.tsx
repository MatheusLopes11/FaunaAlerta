import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import '../ONG/Ong.css'
import '../../global/global.css'
import {useState} from 'react'

//IMPORT DAS IMAGENS UTILIZADAS
import Viralata from '../../assets/Viralata.png'
import Upaga from '../../assets/UPAGA.png'
import SAVA from '../../assets/SAVA.jpg'
import aaac from '../../assets/aaac.jpeg'
import uips from '../../assets/uips.jpeg'
import adotegatinho from '../../assets/adotegatinho.jpeg'
import ampara from '../../assets/ampara.jpeg'
import caramelo from '../../assets/caramelo.jpeg'
import amordebicho from '../../assets/amordebicho.jpeg'

import BannerSava2 from '../../assets/BannerSAVA2.jpg'
import IconePet2 from '../../assets/IconePet2.svg'
import IconeAbrigo2 from '../../assets/IconeAbrigo2.svg'

function PagOng(){
    const { id} = useParams();

    const dadosOngs = {
        viralatas: {
            nome: "Clube dos Viralatas",
            slogan: "Proteção e cuidado aos animais.",
            descricao: "O Clube dos Vira-Latas é um Grupo de Proteção aos Animais sediado em Ribeirão Pires, reconhecido como uma das maiores ONGs de animais do país e referência na causa animal.",
            imagem: Viralata,
            banner: Viralata,
            local: "São Paulo",
            instagram: "@clubedosviralatas",
            facebook: "@ClubeDosViraLatas"
        },
        upaga: {
            nome: "União de Proteção Animal",
            slogan: "Proteção animal.",
            descricao: "A União de Proteção Animal do Grande ABC é uma organização de protetores independentes que atua na região do Grande ABC, com 10 anos de trajetória na missão de salvar vidas de animais.  A entidade incentiva a participação da comunidade através da adoção, do trabalho como voluntário e de doações.",
            imagem: Upaga,
            banner: Upaga,
            local: "Grande ABC",
            instagram: "@protecaoanimalabc",
            facebook: "@upagasoficial"
        },
        sava: {
            nome: "Associação de Solidariedade A Vida Animal",
            slogan: "Solidariedade A Vida Animal",
            descricao: "Criada em 2006 e localizada em Diadema, a S.A.V.A é uma ONG que realiza eventos e trabalhos em prol dos animais. Foi pioneira na especialização de cuidar de animais com deficiência e idosos em São Paulo.",
            imagem: SAVA,
            banner: BannerSava2,
            local: "Diadema, São Paulo",
            instagram: "@ongsava",
            facebook: "@ONGSAVA"
        },
        aaac: {
            nome: "Associação Amigos dos Animais",
            slogan: "Proteção ambiental.",
            descricao: "A AAAC está localizada em uma área de proteção ambiental com cerca de cem mil metros quadrados, onde mantém por volta de 2500 animais, atuando desde 1983.",
            imagem: aaac,
            banner: aaac,
            local: "São Paulo",
            instagram: "@aaac_oficial",
            facebook: "@aaaccampinas"
        },
        uips: {
            nome: "União Internacional Protetora dos Animais",
            slogan: "Luta contra maus-tratos.",
            descricao: "A União Internacional Protetora dos Animais (UIPA), fundada em 1895 em São Paulo, é a mais antiga associação civil do Brasil e responsável por instituir o Movimento de Proteção Animal no país.  Diferente de outras entidades focadas apenas no bem-estar animal, a UIPA adota uma postura abolicionista, defendendo que os animais são seres titulares de direitos à vida e liberdade, e não meros objetos de utilidade humana. ",
            imagem: uips,
            banner: uips,
            local: "São Paulo",
            instagram: "@UIPASP",
            facebook: "@UIPASP"
        },
        adotegatinho: {
            nome: "Adote um gatinho",
            slogan: "Adoção de Animais",
            descricao: "A Adote um Gatinho (AUG) é uma organização sem fins lucrativos fundada em 2003 por Susan Yamamoto e Juliana Bussab, sendo considerada a maior ONG de resgate e adoção de gatos do Brasil.  A entidade atua na cidade de São Paulo e no ABC Paulista, focando no resgate, tratamento veterinário, castração e adoção responsável de felinos abandonados.",
            imagem: adotegatinho,
            banner: adotegatinho,
            local: "São Paulo",
            instagram: "@adoteumgatinho",
            facebook: "@adoteumgatinho"
        },
        ampara: {
            nome: "Instituto Ampara Animal",
            slogan: "Proteção e defesa animal.",
            descricao: "A AMPARA Animal (Instituto Ampara Animal) é uma ONG brasileira fundada em 2010 em São Paulo, reconhecida como OSCIP e líder na proteção animal, com foco em ações preventivas como castração, adoção e educação.",
            imagem: ampara,
            banner: ampara,
            local: "São Paulo",
            instagram: "@amparanimal",
            facebook: "@institutoamparasilvestre"
        },
        caramelo: {
            nome: "Instituto Caramelo",
            slogan: "Proteção animal e meio ambiente.",
            descricao: "O Instituto Caramelo (anteriormente Instituto Luisa Mell) é uma ONG brasileira sem fins lucrativos fundada em fevereiro de 2015, sediada em Ribeirão Pires, na Grande São Paulo.  Sua missão principal é o resgate, tratamento veterinário e adoção responsável de cães e gatos em situação de abandono, maus-tratos ou risco de morte. ",
            imagem: caramelo,
            banner: caramelo,
            local: "São Paulo",
            instagram: "@instituto.caramelo",
            facebook: "@InstitutoCaramelo"
        },
        amordebicho: {
            nome: "Amor de Bicho",
            slogan: "Amparo de animais.",
            descricao: "A ONG Amor de Bicho Campinas (Associação Propet de Amparo Animal, CNPJ 22.315.008/0001-80) foi fundada em 2014, na cidade de Campinas – SP, com o objetivo de amparar e mudar a triste realidade dos animais em situação de rua, abandono e maus tratos da região, através do resgate, cuidado, recuperação e realocação, especialmente de cães e gatos. Além dos resgates, trabalhamos com a realização de projetos de conscientização, a fim de obter reais resultados a longo prazo.",
            imagem: amordebicho,
            banner: amordebicho,
            local: "São Paulo",
            instagram: "@amordebicho",
            facebook: "@amordebichocampinas"
        },
    };

    const ong = id ? dadosOngs[id as keyof typeof dadosOngs] : undefined;

    if (!ong) {
        return <h1>ONG não encontrada!</h1>;
    }
    return(
        <>
            <Helmet>
               <title>{ong.nome} - FaunaAlerta</title>
            </Helmet>

            <main>
                <div className="container">
                    <img src={BannerSava2} style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '300px',
                    marginTop: '5%'}}
                    alt="{ong.nome}"></img>
                </div>

                <section className="container py-5">
                    <div className="card mb-3" style={{maxWidth: 'auto'}}>
                        <div className="row g-0">
                            <div className="row">
                                <div className="container">
                                    <div className="row justify-content-end">
                                        <div className="card-Titulo col-8">
                                            <h1>{ong.nome}</h1>
                                        </div>
                                        <div className="containerIcones">
                                            <div className="row justify-item-inline justify-content-end">
                                                <img src={IconePet2} style={{width: '80px'}}></img>
                                                <img src={IconeAbrigo2} style={{width: '80px'}}></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    
                                <div className="col-md-2">
                                    <img src={ong.imagem}
                                        style={{width: '300px',borderRadius: '20%',padding: 'auto',margin: '30%'}}
                                        alt={ong.nome}></img>
                                </div>

                                <div className="col-lg-10">
                                    <div className="card-Conteudo">
                                        <h2 className="card-subtitulo text-center">
                                            <b>"{ong.slogan}"</b>
                                        </h2>
                                        <p className="h3 card-texto text-center"> "{ong.descricao}"</p>
                                        <i className="bi bi-facebook">{ong.facebook}</i>
                                        <i className="bi bi-instagram">{ong.instagram}</i>
                                        <i className="bi bi-geo-alt">{ong.local}</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="card" style={{width: 'rem', margin: '60px'}}>
                    <div className="container">
                        <div className="row">
                            <div className="card-Titulo col col-lg-6">
                                <h1>COMO POSSO AJUDAR? </h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-body">
                        <h4 className="card-title"><b>Aceita doações em :</b></h4>
                        <ul className="list" style={{listStyleType: 'none'}}>
                            <li className="h4"><i className="bi bi-check2-square">Suprimentos (Ração de gatos e cachorros, areia para gatos, <br></br>mantas, remédios e outros.)</i></li>
                            <li className="h4"><i className="bi bi-check2-square">Financeiramento(Pix, dinheiro)</i></li>
                            <li className="h4"><i className="bi bi-check2-square">Reciclagem(Tampinhas, lacres, lixo elêtronico)</i></li>
                        </ul>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-4">
                            <a href="#" className="btn-primary">DOE AQUI!</a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default PagOng;