import { useState } from 'react'
import './Denuncia.css'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom' 
import '../../global/global.css'
import FormAlerta from '../../components/FormAlerta/FormAlerta'
import FormDenuncia from '../../components/FormDenuncia/FormDenuncia'

function Denuncia() {
    const [tipo, setTipo] = useState<"alerta" | "denuncia" | null>(null);
    return (
        <>
            <Helmet>
                <title>DENÚNCIA - FaunaAlerta</title>
            </Helmet>
            
            <main className="box-form">
                <div className="container-form">
                    <h1 className="titulo">Seleciona uma opção:</h1>
                    <div className="btn-form">
                    <button className="btn-alerta" onClick={() => setTipo("alerta")}>
                        Alerta
                    </button>
                    <button className="btn-denuncia" onClick={() => setTipo("denuncia")}>
                        Denúncia
                    </button>
                    </div>
                    <div>
                        {tipo === "alerta" && <FormAlerta onVoltar={() => setTipo(null)} />}
                        {tipo === "denuncia" && <FormDenuncia/>}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Denuncia