export interface Coordenada {
    latitude: number
    longitude: number
}

// Mesmos limites que a API aceita (retângulo que cobre o Brasil).
export const LIMITES_BRASIL = { latMin: -34.5, latMax: 6, lngMin: -74.5, lngMax: -28 }

export function dentroDoBrasil(lat: number, lng: number) {
    return (
        lat >= LIMITES_BRASIL.latMin && lat <= LIMITES_BRASIL.latMax &&
        lng >= LIMITES_BRASIL.lngMin && lng <= LIMITES_BRASIL.lngMax
    )
}

export function arredondar(n: number) {
    return Math.round(n * 1e6) / 1e6
}