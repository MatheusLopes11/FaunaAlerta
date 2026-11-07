import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './FormAlerta.css'
import { SeletorLocalizacao } from '../SeletorLocalizacao/SeletorLocalizacao'
import { SeletorArquivos } from '../SeletorArquivos/SeletorArquivos'
import { CampoLocal } from '../CampoLocal/CampoLocal'
import type { Coordenada } from '../../services/geo'
import { enviarAlerta } from '../../services/alertas'
import { listarEspecies } from '../../services/especies'
import type { Especie } from '../../services/especies'

interface Props {
    onVoltar: () => void
}

function FormAlerta({ onVoltar }: Props) {
    const [especies, setEspecies] = useState<Especie[]>([])
    const [uf, setUf] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [coord, setCoord] = useState<Coordenada | null>(null)
    const [arquivos, setArquivos] = useState<File[]>([])
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
            await enviarAlerta(
                {
                    especieId: especie?.id,
                    municipio: municipio.trim(),
                    uf,
                    dataAvistamento: String(f.get('data')),
                    descricao: partes.length ? partes.join('\n') : undefined,
                    latitude: coord?.latitude,
                    longitude: coord?.longitude,
                },
                arquivos,
            )
            formulario.reset()
            setUf('')
            setMunicipio('')
            setCoord(null)
            setArquivos([])
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

            <CampoLocal
                classe="alerta-local"
                idUf="uf-alerta"
                idMunicipio="municipio-alerta"
                uf={uf}
                municipio={municipio}
                onUf={setUf}
                onMunicipio={setMunicipio}
            />

            <SeletorLocalizacao valor={coord} onChange={setCoord} />

            <div>
                <input type="text" id="localizacao-alerta" name="local" placeholder="Digite a rua ou ponto de refência próximo" />
            </div>
            <div>
                <textarea name="descricao" id="descricao-alerta" placeholder="Digite a descrição do evento" />
            </div>

            <SeletorArquivos id="arquivos-alerta" arquivos={arquivos} onChange={setArquivos} />

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