import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './FormAlerta.css'
import { SeletorLocalizacao } from '../SeletorLocalizacao/SeletorLocalizacao'
import { AvisoEnvio } from '../AvisoEnvio/AvisoEnvio'
import { enviarAlerta } from '../../services/alertas'
import { listarEspecies } from '../../services/especies'
import type { Especie } from '../../services/especies'
import { ESTADOS } from '../../services/estados'
import { useLocalizacao } from '../../hooks/useLocalizacao'

interface Props {
    onVoltar: () => void
}

function FormAlerta({ onVoltar }: Props) {
    const loc = useLocalizacao()
    const [especies, setEspecies] = useState<Especie[]>([])
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
        const local = loc.referencia.trim()
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
                municipio: loc.municipio.trim(),
                uf: loc.uf,
                dataAvistamento: String(f.get('data')),
                descricao: partes.length ? partes.join('\n') : undefined,
                latitude: loc.coord?.latitude,
                longitude: loc.coord?.longitude,
            })
            formulario.reset()
            loc.limpar()
            setSucesso(true)
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao enviar o alerta.')
        } finally {
            setEnviando(false)
        }
    }

    const hoje = new Date().toLocaleDateString('en-CA') // AAAA-MM-DD no fuso local

    return (
        <>
            {sucesso && (
                <AvisoEnvio titulo="Alerta enviado!" onFechar={() => setSucesso(false)}>
                    <p>
                        Obrigado por ajudar a proteger a fauna. Seu alerta foi registrado e fica
                        disponível para análise dos pesquisadores, com situação "Pendente".
                    </p>
                </AvisoEnvio>
            )}

            <form className="form-alerta" onSubmit={enviar}>
                <div className="campo-alerta">
                    <input type="text" id="nome-especie" name="nome" list="lista-especies" placeholder="Nome da espécie" autoComplete="off" />
                    <datalist id="lista-especies">
                        {especies.map((s) => <option key={s.id} value={s.nomePopular} />)}
                    </datalist>
                    <input type="date" id="data-alerta" name="data" max={hoje} required />
                </div>

                <div className="alerta-local">
                    <input
                        type="text" id="municipio-alerta" name="municipio" required
                        placeholder="Digite o município do evento"
                        value={loc.municipio}
                        onChange={(e) => loc.setMunicipio(e.target.value)}
                        onBlur={() => loc.sincronizarMapa()}
                    />
                    <select
                        name="estados" id="uf-alerta" required
                        value={loc.uf}
                        onChange={(e) => { loc.setUf(e.target.value); loc.sincronizarMapa(loc.municipio, e.target.value) }}
                    >
                        <option value="" disabled hidden>Estado</option>
                        {Object.entries(ESTADOS).map(([sigla, nome]) => (
                            <option key={sigla} value={sigla}>{nome}</option>
                        ))}
                    </select>
                </div>

                <SeletorLocalizacao valor={loc.coord} onChange={loc.aoEscolherNoMapa} />
                {loc.buscando && <p className="alerta-info">Buscando endereço…</p>}
                {loc.aviso && <p className="alerta-info">{loc.aviso}</p>}

                <div>
                    <input
                        type="text" id="localizacao-alerta" name="local"
                        placeholder="Digite a rua ou ponto de referência próximo"
                        value={loc.referencia}
                        onChange={(e) => loc.setReferencia(e.target.value)}
                    />
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

                <div className="container-btn">
                    <button type="submit" className="alerta-enviar" disabled={enviando}>
                        {enviando ? 'Enviando...' : 'Enviar'}
                    </button>
                    <button type="button" className="alerta-voltar" onClick={onVoltar}>Voltar</button>
                </div>
            </form>
        </>
    )
}

export default FormAlerta