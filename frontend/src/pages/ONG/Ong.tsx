import { Helmet } from 'react-helmet-async'
import './Ong.css'
import '../../global/global.css'
import {useState} from 'react'
import { Link } from 'react-router-dom' 

//IMPORT DAS LOGOS DAS ONGS
import Viralata from '../../assets/Viralata.png'
import Upaga from '../../assets/UPAGA.png'
import SAVA from '../../assets/SAVA.jpg'
import aaac from '../../assets/aaac.jpeg'
import uips from '../../assets/uips.jpeg'
import adotegatinho from '../../assets/adotegatinho.jpeg'
import ampara from '../../assets/ampara.jpeg'
import caramelo from '../../assets/caramelo.jpeg'
import amordebicho from '../../assets/amordebicho.jpeg'

//IMPORTS DOS ICONES DE PROCURAS
import IconePet2 from '../../assets/IconePet2.svg'
import IconeNatureza2 from '../../assets/IconeNatureza2.svg'
import IconeAbrigo2 from '../../assets/IconeAbrigo2.svg'
import IconeEstudo2 from '../../assets/IconeEstudo2.svg'

function Ong(){

    const ongs = [
        { 
            id: "viralatas",
            nome: "Clube dos Viralatas",
            descricao: "Ong Animal",
            imagem: Viralata,
        },
        {
            id: "upaga",
            nome: "União de Proteção Animal",
            descricao: "Grande ABC",
            imagem: Upaga
        },
        {
            id: "sava",
            nome: "SAVA",
            descricao: "Soliedariedade a Vida Animal",
            imagem: SAVA
        },
        {
            id: "aaac",
            nome: "Associação Amigos dos Animais",
            descricao: "Proteção Ambiental",
            imagem: aaac
        },
        {
            id: "uips",
            nome: "União Internacional Protetora dos Animais",
            descricao: "Luta contra Maus tratos",
            imagem: uips
        },
        {
            id: "adotegatinho",
            nome: "Adote um Gatinho",
            descricao: "Adoção de Animais",
            imagem: adotegatinho
        },
        {
            id: "ampara",
            nome: "Instituto Ampara Animal",
            descricao: "Proteção e Defesa Animal",
            imagem: ampara
        },
        {
            id: "caramelo",
            nome: "Instituo Caramelo",
            descricao: "Proteção Animal e Meio Ambiente",
            imagem: caramelo
        },
        {
            id: "amordebicho",
            nome: "Amor de Bicho",
            descricao: "Amparo de Animais",
            imagem: amordebicho
        },
    ];

    const [busca, setBusca] = useState("");
    const ongsFiltradas = ongs.filter((ong) =>
        ong.nome.toLowerCase().includes(busca.toLowerCase()));

    return(
        <>
            <Helmet>
                <title> Ong - FaunaAlerta</title>
            </Helmet>

            <main className = "ong-page">
                <section className = "container py-5" style={{backgroundColor: "#F7F1EE", marginTop: '60px'}}>
                    <div><h1> ONG's</h1></div>
                    <div className="row height d-flex justify-content-flex-start">
                        <div className="d-flex justify-content-flex-start">
                            <div className="formPesquisa">
                                <i className="bi bi-search"></i>
                                <input 
                                type="text"
                                className="form-controlform-input"
                                placeholder="Procurar ong..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                ></input>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 g-lg-3">
                        {ongsFiltradas.map((ong) => (
                            <div className="col" key={ong.id}>
                                <img
                                    src={ong.imagem}
                                    alt={ong.nome}
                                    className="OngsLogos"
                                />
                                <Link to={`/PagOng/${ong.id}`}>
                                    <h5 className="text-center">
                                        {ong.nome}
                                        <br />
                                        <small className="text-muted">
                                            {ong.descricao}
                                        </small>
                                    </h5>
                                </Link>
                            </div>
                        ))}

                        {ongsFiltradas.length === 0 && (
                            <div className="col-12 text-center">
                                <p>Nenhuma ONG encontrada.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        
        </>
    )
}
export default Ong;