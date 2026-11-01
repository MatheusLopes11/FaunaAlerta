import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './FormDenuncia.css'
import { SeletorLocalizacao } from '../SeletorLocalizacao/SeletorLocalizacao'
import type { Coordenada } from '../../services/geo'
import { lerSessao } from '../../services/auth'
import { TIPOS_DENUNCIA, enviarDenuncia } from '../../services/denuncias'

interface Props {
    onVoltar: () => void
}

function FormDenuncia({ onVoltar }: Props) {
    const [coord, setCoord] = useState<Coordenada | null>(null)
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
            const r = await enviarDenuncia({
                tipo: String(f.get('tipo-denuncia')),
                dataOcorrencia: String(f.get('data')),
                municipio: String(f.get('municipio')).trim(),
                uf: String(f.get('estados')),
                referencia: referencia || undefined,
                descricao: String(f.get('descricao')).trim(),
                latitude: coord?.latitude,
                longitude: coord?.longitude,
            })
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
            <div className="denuncia-local">
                <input type="text" id="municipio-denuncia" name="municipio" placeholder="Digite o munícipo do evento" required />
                <select name="estados" id="uf-denuncia" defaultValue="" required>
                    <option value="" disabled hidden>Estado</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceara</option>
                    <option value="ES">Espirito Santo</option>
                    <option value="GO">Goias</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraiba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                </select>
            </div>

            <SeletorLocalizacao valor={coord} onChange={setCoord} />

            <div>
                <input type="text" id="localizacao-denuncia" name="local" maxLength={150} placeholder="Digite a rua ou ponto de refência próximo" />
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
    )
}

export default FormDenuncia