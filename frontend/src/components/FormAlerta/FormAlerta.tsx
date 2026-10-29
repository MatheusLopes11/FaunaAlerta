import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './FormAlerta.css'
import { SeletorLocalizacao } from '../SeletorLocalizacao/SeletorLocalizacao'
import type { Coordenada } from '../../services/geo'
import { enviarAlerta } from '../../services/alertas'
import { listarEspecies } from '../../services/especies'
import type { Especie } from '../../services/especies'

interface Props {
    onVoltar: () => void
}

function FormAlerta({ onVoltar }: Props) {
    const [especies, setEspecies] = useState<Especie[]>([])
    const [coord, setCoord] = useState<Coordenada | null>(null)
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState(false)

    useEffect(() => {
        listarEspecies({ page: 1, limit: 50, busca: '', grupo: '', status: '', apareceEmCasas: false })
            .then((r) => setEspecies(r.data))
            .catch(() => { /* sem sugestões: o campo continua aceitando texto livre */ })
    }, [])

    async function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formulario = e.currentTarget
        const f = new FormData(formulario)

        const nomeEspecie = String(f.get('nome') ?? '').trim()
        const especie = especies.find((s) => s.nomePopular.toLowerCase() === nomeEspecie.toLowerCase())
        const local = String(f.get('local') ?? '').trim()
        const detalhes = String(f.get('descricao') ?? '').trim()

        const partes: string[] = []
        if (nomeEspecie && !especie) partes.push(`Espécie informada: ${nomeEspecie}.`)
        if (local) partes.push(`Referência do local: ${local}.`)
        if (detalhes) partes.push(detalhes)

        setErro('')
        setSucesso(false)
        setEnviando(true)
        try {
            await enviarAlerta({
                especieId: especie?.id,
                municipio: String(f.get('municipio')).trim(),
                uf: String(f.get('estados')),
                dataAvistamento: String(f.get('data')),
                descricao: partes.length ? partes.join('\n') : undefined,
                latitude: coord?.latitude,
                longitude: coord?.longitude,
            })
            formulario.reset()
            setCoord(null)
            setSucesso(true)
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao enviar o alerta.')
        } finally {
            setEnviando(false)
        }
    }

    const hoje = new Date().toLocaleDateString('en-CA') // AAAA-MM-DD no fuso local

    return (
        <form className="form-alerta" onSubmit={enviar}>
            <div className="campo-alerta">
                <input type="text" id="nome-especie" name="nome" list="lista-especies" placeholder="Nome da espécie" autoComplete="off" />
                <datalist id="lista-especies">
                    {especies.map((s) => <option key={s.id} value={s.nomePopular} />)}
                </datalist>
                <input type="date" id="data-alerta" name="data" max={hoje} required />
            </div>
            <div className="alerta-local">
                <input type="text" id="municipio-alerta" name="municipio" placeholder="Digite o munícipo do evento" required />
                <select name="estados" id="uf-alerta" defaultValue="" required>
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
                <input type="text" id="localizacao-alerta" name="local" placeholder="Digite a rua ou ponto de refência próximo" />
            </div>
            <div>
                <textarea name="descricao" id="descricao-alerta" placeholder="Digite a descrição do evento" />
            </div>
            <div className="file-box-alert">
                <input type="file" id="file-alerta" name="arquivo" disabled />
                <label htmlFor="file-alerta" className="file-label-alerta">
                    <span className="file-text-alerta">Envio de fotos e vídeos em breve</span>
                </label>
            </div>

            {erro && <p className="alerta-erro" role="alert">{erro}</p>}
            {sucesso && <p className="alerta-sucesso" role="status">Alerta enviado! Obrigado por ajudar a proteger a fauna.</p>}

            <div className="container-btn">
                <button type="submit" className="alerta-enviar" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar'}
                </button>
                <button type="button" className="alerta-voltar" onClick={onVoltar}>Voltar</button>
            </div>
        </form>
    )
}

export default FormAlerta