import { useState } from 'react'

interface Props {
    src: string | null
    alt: string
    grande?: boolean
    className?: string
}

export default function FotoEspecie({ src, alt, grande = false, className }: Props) {
    const [falhou, setFalhou] = useState(false)

    if (!src || falhou) {
        return <div className={`especie-sem-foto${grande ? ' grande' : ''}`}>Sem foto</div>
    }
    return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFalhou(true)} />
}