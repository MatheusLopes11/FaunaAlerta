import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { icon } from 'leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import marcador from 'leaflet/dist/images/marker-icon.png'
import marcador2x from 'leaflet/dist/images/marker-icon-2x.png'
import sombra from 'leaflet/dist/images/marker-shadow.png'
import './SeletorLocalizacao.css'
import { LIMITES_BRASIL, arredondar, dentroDoBrasil } from '../../services/geo'
import type { Coordenada } from '../../services/geo'

// O ícone padrão do Leaflet quebra com bundlers, então apontamos os arquivos na mão.
const iconePadrao = icon({
    iconUrl: marcador,
    iconRetinaUrl: marcador2x,
    shadowUrl: sombra,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
})

interface Props {
    valor: Coordenada | null
    onChange: (c: Coordenada | null) => void
}

function Cliques({ aoClicar }: { aoClicar: (lat: number, lng: number) => void }) {
    useMapEvents({ click: (e) => aoClicar(e.latlng.lat, e.latlng.lng) })
    return null
}

function Foco({ alvo }: { alvo: [number, number] | null }) {
    const map = useMap()
    useEffect(() => {
        if (alvo) map.flyTo(alvo, 14)
    }, [alvo, map])
    return null
}

export function SeletorLocalizacao({ valor, onChange }: Props) {
    const [aviso, setAviso] = useState('')
    const [buscando, setBuscando] = useState(false)
    const [alvo, setAlvo] = useState<[number, number] | null>(null)
    const [precisao, setPrecisao] = useState<number | null>(null)

    function definir(lat: number, lng: number) {
        if (!dentroDoBrasil(lat, lng)) {
            setAviso('Esse ponto está fora do Brasil.')
            return
        }
        setAviso('')
        setPrecisao(null)
        onChange({ latitude: arredondar(lat), longitude: arredondar(lng) })
    }

    function usarMinhaLocalizacao() {
        if (!navigator.geolocation) {
            setAviso('Seu navegador não suporta geolocalização. Marque o ponto no mapa.')
            return
        }
        setBuscando(true)
        setAviso('')
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setBuscando(false)
                const { latitude, longitude, accuracy } = pos.coords
                if (!dentroDoBrasil(latitude, longitude)) {
                    setAviso('Sua localização atual está fora do Brasil. Marque o ponto no mapa.')
                    return
                }
                onChange({ latitude: arredondar(latitude), longitude: arredondar(longitude) })
                setPrecisao(Math.round(accuracy))
                setAlvo([latitude, longitude])
            },
            (err) => {
                setBuscando(false)
                if (err.code === err.PERMISSION_DENIED) {
                    setAviso('Permissão negada. Libere a localização no navegador ou marque o ponto no mapa.')
                } else if (err.code === err.TIMEOUT) {
                    setAviso('Demorou demais para obter a localização. Tente de novo ou marque no mapa.')
                } else {
                    setAviso('Não foi possível obter sua localização. Marque o ponto no mapa.')
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        )
    }

    return (
        <div className="seletor-loc">
            <div className="seletor-acoes">
                <button type="button" onClick={usarMinhaLocalizacao} disabled={buscando}>
                    {buscando ? 'Buscando...' : 'Usar minha localização atual'}
                </button>
                {valor && (
                    <button type="button" onClick={() => { onChange(null); setPrecisao(null); setAviso('') }}>
                        Remover marcador
                    </button>
                )}
            </div>

            <div className="seletor-mapa">
                <MapContainer
                    className="seletor-leaflet"
                    center={[-14.2, -51.9]}
                    zoom={4}
                    minZoom={4}
                    maxBounds={[[LIMITES_BRASIL.latMin, LIMITES_BRASIL.lngMin], [LIMITES_BRASIL.latMax, LIMITES_BRASIL.lngMax]]}
                    maxBoundsViscosity={1}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Cliques aoClicar={definir} />
                    <Foco alvo={alvo} />
                    {valor && (
                        <Marker
                            position={[valor.latitude, valor.longitude]}
                            icon={iconePadrao}
                            draggable
                            eventHandlers={{
                                dragend: (e) => {
                                    const p = (e.target as LeafletMarker).getLatLng()
                                    definir(p.lat, p.lng)
                                },
                            }}
                        />
                    )}
                </MapContainer>
            </div>

            <p className="seletor-info">
                {valor
                    ? `Local marcado: ${valor.latitude.toFixed(5)}, ${valor.longitude.toFixed(5)}${precisao ? ` (precisão de cerca de ${precisao} m)` : ''}. Arraste o pino para ajustar.`
                    : 'Clique no mapa para marcar onde viu o animal, ou use sua localização atual (opcional).'}
            </p>
            {aviso && <p className="seletor-aviso" role="alert">{aviso}</p>}
        </div>
    )
}