import { useMemo } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { latLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapaAlertas.css'
import type { AlertaRelatorio } from '../../services/alertas'
import { SITUACAO_COR, SITUACAO_ROTULO, dataBR } from '../../services/relatorios'

interface Props {
    alertas: AlertaRelatorio[]
    geracao: number // muda a cada relatório novo: refaz o enquadramento do mapa
}

type ComCoordenada = AlertaRelatorio & { latitude: number; longitude: number }

export function MapaAlertas({ alertas, geracao }: Props) {
    const pontos = useMemo(
        () => alertas.filter((a): a is ComCoordenada => a.latitude != null && a.longitude != null),
        [alertas],
    )

    const inicial =
        pontos.length > 0
            ? {
                  bounds: latLngBounds(pontos.map((a) => [a.latitude, a.longitude] as [number, number])),
                  boundsOptions: { padding: [30, 30] as [number, number], maxZoom: 13 },
              }
            : { center: [-14.2, -51.9] as [number, number], zoom: 4 }

    return (
        <div className="mapa-alertas">
            <div className="mapa-alertas-caixa">
                <MapContainer key={geracao} {...inicial} scrollWheelZoom={false} className="mapa-alertas-leaflet">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {pontos.map((a) => (
                        <CircleMarker
                            key={a.id}
                            center={[a.latitude, a.longitude]}
                            radius={8}
                            pathOptions={{ color: '#222', weight: 1, fillColor: SITUACAO_COR[a.situacao], fillOpacity: 0.8 }}
                        >
                            <Popup>
                                <strong>{a.especieNome ?? 'Espécie não identificada'}</strong>
                                <br />
                                {dataBR(a.dataAvistamento)} · {a.municipio}/{a.uf}
                                <br />
                                Situação: {SITUACAO_ROTULO[a.situacao]}
                                {a.descricao && <p className="mapa-alertas-desc">{a.descricao.slice(0, 200)}</p>}
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            <div className="mapa-alertas-legenda">
                {(Object.keys(SITUACAO_COR) as (keyof typeof SITUACAO_COR)[]).map((s) => (
                    <span key={s}>
                        <i style={{ background: SITUACAO_COR[s] }} /> {SITUACAO_ROTULO[s]}
                    </span>
                ))}
                <span className="mapa-alertas-contagem">
                    {pontos.length} de {alertas.length} alerta(s) com coordenadas
                </span>
            </div>
        </div>
    )
}