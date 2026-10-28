import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import type { Feature, FeatureCollection } from 'geojson'
import type { Layer, PathOptions } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapaBiomas.css'
import { BIOMA_ROTULO, STATUS, buscarMapaBiomas } from '../../services/especies'
import type { Bioma, EspecieMapa, MapaBiomasDados } from '../../services/especies'

const CORES = ['#e4e0db', '#fbd9a5', '#f2b66d', '#d47e09', '#8a4b00']
const BIOMAS = Object.keys(BIOMA_ROTULO) as Bioma[]

function semAcento(s: string) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()
}

// Procura em qualquer propriedade do polígono um texto que seja o nome de um bioma.
function chaveBioma(f: Feature): Bioma | null {
    const props = (f.properties ?? {}) as Record<string, unknown>
    for (const v of Object.values(props)) {
        if (typeof v === 'string') {
            const k = semAcento(v)
            if (Object.hasOwn(BIOMA_ROTULO, k)) return k as Bioma
        }
    }
    return null
}

function corDaContagem(n: number, max: number) {
    if (n === 0) return CORES[0]
    return CORES[Math.min(4, Math.ceil((n / max) * 4))]
}

export function MapaBiomas() {
    const [geo, setGeo] = useState<FeatureCollection | null>(null)
    const [dados, setDados] = useState<MapaBiomasDados | null>(null)
    const [erro, setErro] = useState('')
    const [incluirNT, setIncluirNT] = useState(true)
    const [selecionado, setSelecionado] = useState<Bioma | null>(null)

    useEffect(() => {
        const c = new AbortController()
        Promise.all([
            fetch('/geo/biomas.json', { signal: c.signal }).then((r) => r.json() as Promise<FeatureCollection>),
            buscarMapaBiomas(c.signal),
        ])
            .then(([g, d]) => {
                setGeo(g)
                setDados(d)
            })
            .catch((e: Error) => {
                if (e.name !== 'AbortError') {
                    setErro('Não foi possível carregar o mapa. Confira se o arquivo public/geo/biomas.json existe e se a API está no ar.')
                }
            })
        return () => c.abort()
    }, [])

    const visiveis = (lista: EspecieMapa[] = []) => lista.filter((e) => incluirNT || e.statusConservacao !== 'NT')

    const contagem = useMemo(() => {
        const m = {} as Record<Bioma, number>
        for (const b of BIOMAS) m[b] = dados ? visiveis(dados[b]).length : 0
        return m
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dados, incluirNT])

    const maximo = Math.max(1, ...Object.values(contagem))

    const estilo = (f?: Feature): PathOptions => {
        const b = f ? chaveBioma(f) : null
        return {
            fillColor: corDaContagem(b ? contagem[b] : 0, maximo),
            fillOpacity: 0.75,
            color: '#4e3f37',
            weight: 1.5,
        }
    }

    const aoCadaBioma = (f: Feature, layer: Layer) => {
        const b = chaveBioma(f)
        if (!b) return
        layer.bindTooltip(`${BIOMA_ROTULO[b]}: ${contagem[b]} espécie(s)`, { sticky: true })
        layer.on({ click: () => setSelecionado(b) })
    }

    const listaSelecionada = selecionado && dados ? visiveis(dados[selecionado]) : []

    return (
        <section className="mapa-biomas py-5">
            <div className="container">
                <h2 className="section-title text-center mb-2">ONDE VIVEM AS ESPÉCIES AMEAÇADAS</h2>
                <p className="text-center mapa-sub">
                    Clique em um bioma para ver as espécies. O mapa mostra regiões, não locais exatos, para proteger os animais.
                </p>

                <label className="mapa-check">
                    <input type="checkbox" checked={incluirNT} onChange={(e) => setIncluirNT(e.target.checked)} />
                    Incluir espécies quase ameaçadas
                </label>

                {erro && <p className="mapa-erro" role="alert">{erro}</p>}

                <div className="mapa-caixa">
                    <MapContainer center={[-14.2, -51.9]} zoom={4} minZoom={3} scrollWheelZoom={false} className="mapa-leaflet">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {geo && dados && (
                            <GeoJSON
                                key={String(incluirNT)} // força redesenhar quando o filtro muda
                                data={geo}
                                style={estilo}
                                onEachFeature={aoCadaBioma}
                                filter={(f) => chaveBioma(f) !== null}
                            />
                        )}
                    </MapContainer>
                </div>

                <div className="mapa-legenda">
                    <span>Menos espécies</span>
                    {CORES.map((c) => <i key={c} style={{ background: c }} />)}
                    <span>Mais espécies</span>
                </div>
                <p className="mapa-fonte">Limites dos biomas: IBGE. Mapa base: OpenStreetMap.</p>

                {selecionado && (
                    <div className="mapa-painel">
                        <h3>{BIOMA_ROTULO[selecionado]}</h3>
                        {listaSelecionada.length === 0 ? (
                            <p>Nenhuma espécie ameaçada cadastrada neste bioma.</p>
                        ) : (
                            <ul>
                                {listaSelecionada.map((e) => (
                                    <li key={e.id}>
                                        <Link to={`/especies/${e.id}`}>{e.nomePopular}</Link>{' '}
                                        <em>({e.nomeCientifico})</em>{' '}
                                        <span className="selo" style={{ background: STATUS[e.statusConservacao]?.cor }}>
                                            {STATUS[e.statusConservacao]?.nome ?? e.statusConservacao}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}