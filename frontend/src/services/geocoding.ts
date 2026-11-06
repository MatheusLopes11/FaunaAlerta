import { arredondar, dentroDoBrasil } from './geo'
import type { Coordenada } from './geo'
import { ESTADOS } from './estados'

const NOMINATIM = 'https://nominatim.openstreetmap.org'

export interface Endereco {
    municipio: string
    uf: string
    referencia: string
}

// Coordenada -> município/UF/rua
export async function buscarEndereco({ latitude, longitude }: Coordenada): Promise<Endereco | null> {
    const p = new URLSearchParams({
        format: 'jsonv2', lat: String(latitude), lon: String(longitude),
        zoom: '18', addressdetails: '1', 'accept-language': 'pt-BR',
    })
    const res = await fetch(`${NOMINATIM}/reverse?${p}`)
    if (!res.ok) throw new Error('Falha no geocoding')
    const a = (await res.json()).address
    if (!a || a.country_code !== 'br') return null

    const uf = String(a['ISO3166-2-lvl4'] ?? '').replace('BR-', '')
    const municipio = a.city ?? a.town ?? a.village ?? a.municipality ?? ''
    if (!uf || !municipio) return null

    const referencia = [a.road, a.suburb ?? a.neighbourhood].filter(Boolean).join(', ').slice(0, 150)
    return { municipio, uf, referencia }
}

// município + UF -> coordenada (centro da cidade)
export async function buscarCoordenada(municipio: string, uf: string): Promise<Coordenada | null> {
    const p = new URLSearchParams({
        format: 'jsonv2', city: municipio, state: ESTADOS[uf] ?? uf,
        country: 'Brasil', countrycodes: 'br', limit: '1',
    })
    const res = await fetch(`${NOMINATIM}/search?${p}`)
    if (!res.ok) throw new Error('Falha no geocoding')
    const [r] = await res.json()
    if (!r) return null
    const lat = arredondar(parseFloat(r.lat))
    const lng = arredondar(parseFloat(r.lon))
    return dentroDoBrasil(lat, lng) ? { latitude: lat, longitude: lng } : null
}