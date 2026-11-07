import { useState } from 'react'
import type { ChangeEvent } from 'react'
import './SeletorArquivos.css'
import { ACEITAR, LIMITE_FOTO_MB, LIMITE_VIDEO_MB, MAX_ARQUIVOS, tamanhoLegivel, validarArquivos } from '../../services/midias'

interface Props {
    id: string
    arquivos: File[]
    onChange: (arquivos: File[]) => void
}

export function SeletorArquivos({ id, arquivos, onChange }: Props) {
    const [aviso, setAviso] = useState('')

    function aoEscolher(e: ChangeEvent<HTMLInputElement>) {
        const novos = Array.from(e.target.files ?? [])
        e.target.value = '' // permite escolher o mesmo arquivo de novo depois de remover
        if (novos.length === 0) return

        const todos = [...arquivos, ...novos]
        const erro = validarArquivos(todos)
        if (erro) {
            setAviso(erro)
            return
        }
        setAviso('')
        onChange(todos)
    }

    function remover(indice: number) {
        setAviso('')
        onChange(arquivos.filter((_, i) => i !== indice))
    }

    return (
        <div className="seletor-arquivos">
            <input id={id} type="file" multiple accept={ACEITAR} onChange={aoEscolher} className="seletor-arquivos-input" />
            <label htmlFor={id} className="seletor-arquivos-label">
                {arquivos.length > 0 ? 'Adicionar mais arquivos' : 'Escolha fotos ou vídeos (opcional)'}
            </label>
            <small>
                Até {MAX_ARQUIVOS} arquivos. Fotos JPG, PNG ou WebP (até {LIMITE_FOTO_MB} MB) e vídeos MP4, MOV ou WebM (até {LIMITE_VIDEO_MB} MB).
            </small>
            {aviso && <p className="seletor-arquivos-aviso" role="alert">{aviso}</p>}
            {arquivos.length > 0 && (
                <ul>
                    {arquivos.map((a, i) => (
                        <li key={`${a.name}-${i}`}>
                            <span>{a.name} ({tamanhoLegivel(a.size)})</span>
                            <button type="button" onClick={() => remover(i)} aria-label={`Remover ${a.name}`}>Remover</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}