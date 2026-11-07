import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './FormDenuncia.css'
import { SeletorLocalizacao } from '../SeletorLocalizacao/SeletorLocalizacao'
import { SeletorArquivos } from '../SeletorArquivos/SeletorArquivos'
import { CampoLocal } from '../CampoLocal/CampoLocal'
import type { Coordenada } from '../../services/geo'
import { lerSessao } from '../../services/auth'
import { TIPOS_DENUNCIA, enviarDenuncia } from '../../services/denuncias'

interface Props {
    onVoltar: () => void
}

function FormDenuncia({ onVoltar }: Props) {
    const [uf, setUf] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [coord, setCoord] = useState<Coordenada | null>(null)
    const [arquivos, setArquivos] = useState<File[]>([])
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState('')
    const [protocolo, setProtocolo] = useState('')
    const logado = lerSessao() !== null
    const hoje = new Date().toLocaleDateString('en-CA') // AAAA-MM-DD no fuso local

    async function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const referencia = String(f.get('local') ?? '').trim()

        setErro('')
        setEnviando(true)
        try {
            const r = await enviarDenuncia(
                {
                    tipo: String(f.get('tipo-denuncia')),
                    dataOcorrencia: String(f.get('data')),
                    municipio: municipio.trim(),
                    uf,
                    referencia: referencia || undefined,
                    descricao: String(f.get('descricao')).trim(),
                    latitude: coord?.latitude,
                    longitude: coord?.longitude,
                },
                arquivos,
            )
            setProtocolo(r.protocolo)
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao enviar a denúncia.')
        } finally {
            setEnviando(false)
        }
    }

    if (protocolo) {
        return (
            <div className="denuncia-sucesso" role="status">
                <h2>Denúncia enviada!</h2>
                <p>Seu protocolo:</p>
                <strong className="denuncia-protocolo">{protocolo}</strong>
                {logado ? (
                    <p>Acompanhe o andamento no seu perfil.</p>
                ) : (
                    <p>Guarde este número. Como você não está logado, a denúncia é anônima e não aparece em nenhum histórico.</p>
                )}
                <div className="container-btn-form">
                    {logado && <Link to="/perfil" className="denuncia-link">Ver meu histórico</Link>}
                    <button type="button" className="denuncia-voltar" onClick={onVoltar}>Nova denúncia</button>
                </div>
            </div>
        )
    }

    return (
        <form className="form-denuncia" onSubmit={enviar}>
            {!logado && (
                <p className="denuncia-aviso">
                    Você não está logado: a denúncia será anônima e não aparecerá no seu histórico.
                </p>
            )}

            <div className="campo-denuncia">
                <select name="tipo-denuncia" id="tipo-denuncia" required>
                    {Object.entries(TIPOS_DENUNCIA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input type="date" id="data-denuncia" name="data" max={hoje} required />
            </div>

            <CampoLocal
                classe="denuncia-local"
                idUf="uf-denuncia"
                idMunicipio="municipio-denuncia"
                uf={uf}
                municipio={municipio}
                onUf={setUf}
                onMunicipio={setMunicipio}
            />

            <SeletorLocalizacao valor={coord} onChange={setCoord} />

            <div>
                <input type="text" id="localizacao-denuncia" name="local" maxLength={150} placeholder="Digite a rua ou ponto de refência próximo" />
            </div>
            <div>
                <textarea name="descricao" id="descricao-denuncia" placeholder="Descreva o que aconteceu" required />
            </div>

            <SeletorArquivos id="arquivos-denuncia" arquivos={arquivos} onChange={setArquivos} />

            {erro && <p className="denuncia-erro" role="alert">{erro}</p>}

            <div className="container-btn-form">
                <button type="submit" className="denuncia-enviar" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar'}
                </button>
                <button type="button" className="denuncia-voltar" onClick={onVoltar}>Voltar</button>
            </div>
        </form>
    )
}

export default FormDenuncia