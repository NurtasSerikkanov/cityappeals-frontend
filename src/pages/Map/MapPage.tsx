import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getHexagons, getFastHexagons } from '../../apiCode/api';
import styles from './MapPage.module.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoibnVydGFzIiwiYSI6ImNtM2Jzejd1ZTFpczkyanNjMms2djc3MG8ifQ.fNSvd6RJ_-bJo_NHsSLunQ';

const centerCoords: [number, number] = [76.889709, 43.238949];

const MapPage = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [year, setYear] = useState<string>('all');
    const [month, setMonth] = useState<string>('all');
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
    const months = [
        { value: 'all', label: 'Все месяцы' },
        { value: '1', label: 'Январь' },
        { value: '2', label: 'Февраль' },
        { value: '3', label: 'Март' },
        { value: '4', label: 'Апрель' },
        { value: '5', label: 'Май' },
        { value: '6', label: 'Июнь' },
        { value: '7', label: 'Июль' },
        { value: '8', label: 'Август' },
        { value: '9', label: 'Сентябрь' },
        { value: '10', label: 'Октябрь' },
        { value: '11', label: 'Ноябрь' },
        { value: '12', label: 'Декабрь' },
    ];

    const loadHexagons = () => {
        getFastHexagons(year, month).then((res) => {
            const max = Math.max(...res.data.map((h: any) => h.count));
            const min = Math.min(...res.data.map((h: any) => h.count));

            const features = res.data.map((hex: any) => {
                const ratio = (hex.count - min) / (max - min || 1);

                let color = '#22c55e';
                if (ratio > 0.66) color = '#ef4444';
                else if (ratio > 0.33) color = '#f97316';

                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [hex.boundary_coords],
                    },
                    properties: {
                        hex_id: hex.hexagon_id,
                        count: hex.count,
                        types: hex.types,
                        fillColor: color,
                    },
                };
            });


            const geojson = {
                type: 'FeatureCollection',
                features,
            };

            const map = mapRef.current!;
            if (map.getSource('hexagons')) {
                (map.getSource('hexagons') as mapboxgl.GeoJSONSource).setData(geojson);
            } else {
                map.addSource('hexagons', { type: 'geojson', data: geojson });

                map.addLayer({
                    id: 'hex-layer',
                    type: 'fill',
                    source: 'hexagons',
                    paint: {
                        'fill-color': ['get', 'fillColor'],
                        'fill-opacity': 0.2,
                    },
                });

                map.addLayer({
                    id: 'hex-outline',
                    type: 'line',
                    source: 'hexagons',
                    paint: {
                        'line-color': '#000000', // чёрная обводка
                        'line-width': 1,
                    },
                });

                map.on('click', 'hex-layer', (e) => {
                    const feature = e.features?.[0];
                    if (!feature) return;

                    const { count, types } = feature.properties;
                    const coords = e.lngLat;

                    let parsedTypes: Record<string, number> = {};
                    try {
                        parsedTypes = typeof types === 'string' ? JSON.parse(types) : types ?? {};
                    } catch {
                        parsedTypes = {};
                    }

                    const typeList = Object.entries(parsedTypes)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, val]) => `<div>• ${key}: ${val}</div>`)
                        .join("");

                    const popupContent = `
                    <div style="font-weight: bold; margin-bottom: 4px;">Обращений: ${count}</div>
                    ${typeList}
                `;

                    const allPopups = document.querySelectorAll('.mapboxgl-popup');
                    allPopups.forEach(p => p.remove());

                    popupRef.current?.remove();

                    popupRef.current = new mapboxgl.Popup()
                        .setLngLat(coords)
                        .setHTML(popupContent)
                        .addTo(map);

                    map.flyTo({ center: coords, zoom: 13 });
                });
            }
        });
    };

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: centerCoords,
            zoom: 10,
        });

        mapRef.current = map;

        map.on('load', loadHexagons);

        return () => map.remove();
    }, []);

    useEffect(() => {
        if (mapRef.current?.isStyleLoaded()) {
            loadHexagons();
        }
    }, [year, month]);

    const handleReset = () => {
        popupRef.current?.remove();
        mapRef.current?.flyTo({ center: centerCoords, zoom: 11 });
    };

    const toggleFullscreen = () => {
        const elem = mapContainerRef.current;
        if (!document.fullscreenElement && elem) {
            elem.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div ref={mapContainerRef} className={styles.mapContainer}>
            <div className={styles.header}>🗺 Карта обращений г. Алматы</div>
            <div className={styles.filters}>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="all">Все годы</option>
                    {years.filter(y => y !== 'all').map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>
            <div className={styles.legend}>
                <div><span className={styles.red}></span> Много обращений</div>
                <div><span className={styles.orange}></span> Среднее количество</div>
                <div><span className={styles.green}></span> Мало обращений</div>
            </div>

            <div className={styles.buttons}>
                <button onClick={toggleFullscreen}>
                    {isFullscreen ? '🧭 Обычный экран' : '🗺️ Во весь экран'}
                </button>
                <button onClick={handleReset}>♻️ Сброс</button>
            </div>
        </div>
    );
};

export default MapPage;