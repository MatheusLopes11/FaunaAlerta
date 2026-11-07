const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const MAX_ARQUIVOS = 3
export const LIMITE_FOTO_MB = 10
export const LIMITE_VIDEO_MB = 30
export const ACEITAR = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm'

// Só aceita caminhos que o nosso servidor gerou ("/uploads/...").
export function urlMidia(url: string): string {
    return url.startsWith('/uploads/') ? `${API}${url}` : ''
}

// Confere o que dá para conferir no navegador. O servidor confere de novo pelo conteúdo.
export function validarArquivos(arquivos: File[]): string | null {
    if (arquivos.length > MAX_ARQUIVOS) return `Envie no máximo ${MAX_ARQUIVOS} arquivos.`
    for (const a of arquivos) {
        const foto = a.type.startsWith('image/')
        const video = a.type.startsWith('video/')
        if (!foto && !video) return `"${a.name}": formato não aceito. Use fotos JPG, PNG ou WebP, ou vídeos MP4, MOV ou WebM.`
        if (foto && a.size > LIMITE_FOTO_MB * 1024 * 1024) return `"${a.name}": a foto passa de ${LIMITE_FOTO_MB} MB.`
        if (video && a.size > LIMITE_VIDEO_MB * 1024 * 1024) return `"${a.name}": o vídeo passa de ${LIMITE_VIDEO_MB} MB.`
    }
    return null
}

export function tamanhoLegivel(bytes: number): string {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}