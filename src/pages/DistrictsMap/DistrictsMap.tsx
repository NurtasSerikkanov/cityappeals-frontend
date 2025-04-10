import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, Popup, MapRef } from 'react-map-gl';
import { getDistrictPolygons } from '../../apiCode/api';
import styles from './DistrictsMap.module.scss';

const DistrictsMap = () => {
    const [districts, setDistricts] = useState([]);
    const [popupInfo, setPopupInfo] = useState<{
        lng: number;
        lat: number;
        district: any;
    } | null>(null);
    const [filters, setFilters] = useState({ year: '2024', month: '' });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [layerIds, setLayerIds] = useState<string[]>([]);

    const mapRef = useRef<MapRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleReset = () => {
        mapRef.current?.flyTo({ center: [76.9, 43.24], zoom: 10.5 });
        setPopupInfo(null);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!document.fullscreenElement && container) {
            container.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        setDistricts([]);

        getDistrictPolygons(filters.year, filters.month).then(res => {
            setDistricts(res.data);
            setLayerIds(res.data.map((_, i) => `district-layer-${i}`));
        });
    }, [filters]);


    const colors = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#FB7185', '#FCD34D'];

    const handleClick = (event: any) => {
        const feature = event.features?.find((f: any) =>
            f.layer.id.startsWith('district-layer-') && f.properties?.name
        );

        if (feature) {
            const district = districts.find(d => d.name === feature.properties.name);
            if (district) {
                setPopupInfo({
                    lng: event.lngLat.lng,
                    lat: event.lngLat.lat,
                    district,
                });
            }
        } else {
            setPopupInfo(null);
        }
    };

    return (
        <div ref={containerRef} className={styles.mapPage}>
            <div className={styles.mapWrapper}>
                <div className={styles.header}>📍 Районы города</div>

                <div className={styles.filters}>
                    <select value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })}>
                        {['2024','2023','2022','2021','2020','2019','2018','2017'].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select value={filters.month} onChange={e => setFilters({ ...filters, month: e.target.value })}>
                        <option value="">Все месяцы</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1} месяц
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.buttons}>
                    <button onClick={toggleFullscreen}>
                        {isFullscreen ? '🧭 Обычный экран' : '🗺 Во весь экран'}
                    </button>
                    <button onClick={handleReset}>♻️ Сброс</button>
                </div>
            </div>

            <Map
                ref={mapRef}
                initialViewState={{ longitude: 76.9, latitude: 43.24, zoom: 10 }}
                style={{ width: '100%', height: '80vh' }}
                mapStyle="mapbox://styles/mapbox/light-v10"
                mapboxAccessToken="pk.eyJ1IjoibnVydGFzIiwiYSI6ImNtM2Jzejd1ZTFpczkyanNjMms2djc3MG8ifQ.fNSvd6RJ_-bJo_NHsSLunQ"
                onClick={handleClick}
                interactiveLayerIds={layerIds}
            >
                {districts.map((d, i) => (
                    <Source
                        key={`${d.name}-${filters.year}-${filters.month}`}
                        id={`source-${i}`}
                        type="geojson"
                        data={{
                            type: 'Feature',
                            geometry: JSON.parse(d.geometry),
                            properties: { name: d.name },
                        }}
                    >
                        <Layer
                            id={`district-layer-${i}`}
                            type="fill"
                            paint={{
                                'fill-color': colors[i % colors.length],
                                'fill-opacity': 0.4,
                            }}
                        />
                    </Source>
                ))}


                {popupInfo && (
                    <Popup
                        longitude={popupInfo.lng}
                        latitude={popupInfo.lat}
                        closeOnClick={false}
                        onClose={() => setPopupInfo(null)}
                    >
                        <div>
                            <strong>{popupInfo.district.name}</strong>
                            <p>Обращений: {popupInfo.district.count}</p>
                            {Object.entries(popupInfo.district.types).map(([type, count]: any) => (
                                <div key={type}>• {type}: {count}</div>
                            ))}
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
};

export default DistrictsMap;
