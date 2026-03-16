
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useListings } from '../../../contexts/ListingsContext';
import { Listing } from '../../../shared/types';

export const useMapSearch = () => {
    const navigate = useNavigate();
    const { listings } = useListings();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersLayer = useRef<L.LayerGroup | null>(null);

    const [radius, setRadius] = useState(5); // KM
    const [center, setCenter] = useState<[number, number]>([-8.8368, 13.2344]); // Luanda
    const [visibleListings, setVisibleListings] = useState<Listing[]>([]);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView(center, 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            }).addTo(mapInstance.current);

            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

            markersLayer.current = L.layerGroup().addTo(mapInstance.current);

            // Fix for default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        }
    }, []);

    useEffect(() => {
        if (markersLayer.current && mapInstance.current) {
            markersLayer.current.clearLayers();

            listings.forEach(listing => {
                const marker = L.marker(listing.location.coords)
                    .bindPopup(`
                        <div style="font-family: inherit; width: 220px;">
                            <img src="${listing.images[0]}" style="width: 100%; height: 120px; border-radius: 1.5rem; object-fit: cover; margin-bottom: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" />
                            <h4 style="font-weight: 900; margin: 0 0 4px 0; color: #111827; letter-spacing: -0.025em;">${listing.title}</h4>
                            <p style="font-weight: 900; color: #2563eb; margin: 0 0 12px 0;">${listing.price.toLocaleString()} Kz</p>
                            <a href="/listing/${listing.id}" style="display: block; width: 100%; text-align: center; padding: 10px; background: #2563eb; color: white; border-radius: 1rem; text-decoration: none; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);">Ver Detalhes</a>
                        </div>
                    `, {
                        className: 'premium-popup'
                    })
                    .addTo(markersLayer.current!);
            });

            const circle = L.circle(center, {
                radius: radius * 1000,
                color: '#2563eb',
                fillColor: '#2563eb',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '10, 10'
            }).addTo(markersLayer.current);

            mapInstance.current.fitBounds(circle.getBounds(), { padding: [20, 20] });

            const filtered = listings.filter(l => {
                const dist = mapInstance.current!.distance(center, l.location.coords);
                return dist <= radius * 1000;
            });
            setVisibleListings(filtered);
        }
    }, [listings, radius, center]);

    return {
        navigate,
        mapRef,
        radius, setRadius,
        visibleListings
    };
};
