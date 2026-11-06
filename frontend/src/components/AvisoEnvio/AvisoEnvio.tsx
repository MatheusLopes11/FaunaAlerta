import { useEffect } from 'react'
import type { ReactNode } from 'react'
import './AvisoEnvio.css'

interface Props {
    titulo: string
    children: ReactNode
    onFechar: () => void
}

export function AvisoEnvio({ titulo, children, onFechar }: Props) {
    useEffect(() => {
        const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar() }
        window.addEventListener('keydown', aoTeclar)
        return () => window.removeEventListener('keydown', aoTeclar)
    }, [onFechar])

    return (
        <div className="aviso-fundo" onClick={onFechar}>
            <div className="aviso-caixa" role="alertdialog" aria-modal="true" aria-labelledby="aviso-titulo"
                 onClick={(e) => e.stopPropagation()}>
                <h2 id="aviso-titulo">{titulo}</h2>
                {children}
                <button type="button" className="aviso-fechar" onClick={onFechar}>Entendi</button>
            </div>
        </div>
    )
}