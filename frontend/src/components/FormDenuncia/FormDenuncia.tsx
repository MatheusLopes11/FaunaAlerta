import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './FormDenuncia.css'
import { SeletorLocalizacao } from '../SeletorLocalizacao/SeletorLocalizacao'
import { AvisoEnvio } from '../AvisoEnvio/AvisoEnvio'
import { AvisoAnonimato } from '../AvisoAnonimato/AvisoAnonimato'
import { lerSessao } from '../../services/auth'
import { TIPOS_DENUNCIA, enviarDenuncia } from '../../services/denuncias'
import { ESTADOS } from '../../services/estados'
import { useLocalizacao } from '../../hooks/useLocalizacao'

interface Props {
    onVoltar: () => void
}

function FormDenuncia({ onVoltar }: Props) {
    const [identificada, setIdentificada] = useState(false)
    const loc = useLocalizacao()
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState('')
    const [protocolo, setProtocolo] = useState('')
    const logado = lerSessao() !== null
    const hoje = new Date().toLocaleDateString('en-CA')

    async function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formulario = e.currentTarget
        const f = new FormData(formulario)

        setErro('')
        setEnviando(true)
        try {
            const r = await enviarDenuncia({
                tipo: String(f.get('tipo-denuncia')),
                dataOcorrencia: String(f.get('data')),
                municipio: loc.municipio.trim(),
                uf: loc.uf,
                referencia: loc.referencia.trim() || undefined,
                descricao: String(f.get('descricao')).trim(),
                latitude: loc.coord?.latitude,
                longitude: loc.coord?.longitude,
            })
            formulario.reset()
            loc.limpar()
            setProtocolo(r.protocolo)
            setIdentificada(r.identificada)
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao enviar a denúncia.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <>
            {protocolo && (
                <AvisoEnvio titulo="Denúncia enviada!" onFechar={() => setProtocolo('')}>
                    <p>Sua denúncia foi encaminhada ao órgão responsável. Seu protocolo:</p>
                    <strong className="denuncia-protocolo">{protocolo}</strong>
                    {identificada ? (
                        <>
                            <p>Ela está vinculada à sua conta. Acompanhe o andamento no seu perfil.</p>
                            <Link to="/perfil" className="denuncia-link">Ver meu histórico</Link>
                        </>
                    ) : (
                        <p>Guarde este número. Como você não está logado, a denúncia é anônima e não aparece em nenhum histórico.</p>
                    )}
                </AvisoEnvio>
            )}

            <form className="form-denuncia" onSubmit={enviar}>
                <AvisoAnonimato logado={logado} />

                <div className="campo-denuncia">
                    <select name="tipo-denuncia" id="tipo-denuncia" required>
                        {Object.entries(TIPOS_DENUNCIA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <input type="date" id="data-denuncia" name="data" max={hoje} required />
                </div>

                <div className="denuncia-local">
                    <input
                        type="text" id="municipio-denuncia" name="municipio" required
                        placeholder="Digite o município do evento"
                        value={loc.municipio}
                        onChange={(e) => loc.setMunicipio(e.target.value)}
                        onBlur={() => loc.sincronizarMapa()}
                    />
                    <select
                        name="estados" id="uf-denuncia" required
                        value={loc.uf}
                        onChange={(e) => { loc.setUf(e.target.value); loc.sincronizarMapa(loc.municipio, e.target.value) }}
                    >
                        <option value="" disabled hidden>Estado</option>
                        {Object.entries(ESTADOS).map(([sigla, nome]) => <option key={sigla} value={sigla}>{nome}</option>)}
                    </select>
                </div>

                <SeletorLocalizacao valor={loc.coord} onChange={loc.aoEscolherNoMapa} />
                {loc.buscando && <p className="denuncia-info">Buscando endereço…</p>}
                {loc.aviso && <p className="denuncia-info">{loc.aviso}</p>}

                <div>
                    <input
                        type="text" id="localizacao-denuncia" name="local" maxLength={150}
                        placeholder="Digite a rua ou ponto de referência próximo"
                        value={loc.referencia}
                        onChange={(e) => loc.setReferencia(e.target.value)}
                    />
                </div>
                <div>
                    <textarea name="descricao" id="descricao-denuncia" placeholder="Descreva o que aconteceu" required />
                </div>
                <div className="file-box-denuncia">
                    <input type="file" id="file-denuncia" name="arquivo" disabled />
                    <label htmlFor="file-denuncia" className="file-label-denuncia">
                        <span className="file-text-denuncia">Envio de fotos e vídeos em breve</span>
                    </label>
                </div>

                {erro && <p className="denuncia-erro" role="alert">{erro}</p>}

                <div className="container-btn-form">
                    <button type="submit" className="denuncia-enviar" disabled={enviando}>
                        {enviando ? 'Enviando...' : 'Enviar'}
                    </button>
                    <button type="button" className="denuncia-voltar" onClick={onVoltar}>Voltar</button>
                </div>
            </form>
        </>
    )
}

export default FormDenuncia