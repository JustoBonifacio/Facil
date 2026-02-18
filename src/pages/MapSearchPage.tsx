
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../contexts/AppContext';
import { SearchBar } from '../components';
import { Listing } from '../types';

const MapSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useApp();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersLayer = useRef<L.LayerGroup | null>(null);

    const [radius, setRadius] = useState(5); // KM
    const [center, setCenter] = useState<[number, number]>([-8.8368, 13.2344]); // Luanda
    const [visibleListings, setVisibleListings] = useState<Listing[]>([]);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView(center, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance.current);

            markersLayer.current = L.layerGroup().addTo(mapInstance.current);

            // Fix for default marker icons in Leaflet + Vite
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

            state.listings.forEach(listing => {
                const marker = L.marker(listing.location.coords)
                    .bindPopup(`
                        <div class="p-2">
                            <img src="${listing.images[0]}" class="w-full h-24 object-cover rounded-lg mb-2" />
                            <h4 class="font-bold">${listing.title}</h4>
                            <p class="text-blue-600 font-black">${listing.price.toLocaleString()} Kz</p>
                            <button onclick="window.location.href='/listing/${listing.id}'" class="w-full mt-2 py-1 bg-blue-600 text-white rounded font-bold text-xs">Ver Detalhes</button>
                        </div>
                    `)
                    .addTo(markersLayer.current!);
            });

            // Add radius circle
            const circle = L.circle(center, {
                radius: radius * 1000,
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.1
            }).addTo(markersLayer.current);

            mapInstance.current.fitBounds(circle.getBounds());

            // Filter listings by radius (simplified haversine or just leaflet distance)
            const filtered = state.listings.filter(l => {
                const dist = mapInstance.current!.distance(center, l.location.coords);
                return dist <= radius * 1000;
            });
            setVisibleListings(filtered);
        }
    }, [state.listings, radius, center]);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Map Header / Filters */}
            <div className="bg-white p-6 shadow-md z-20 flex flex-col md:flex-row gap-6 items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition"
                >
                    ←
                </button>
                <div className="flex-grow max-w-2xl">
                    <SearchBar onSearch={() => { }} showFilters={false} placeholder="Pesquisar localização no mapa..." />
                </div>
                <div className="flex items-center gap-4 bg-blue-50 p-3 rounded-2xl border border-blue-100 min-w-[250px]">
                    <span className="text-xs font-black text-blue-900 uppercase">Raio:</span>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="flex-grow accent-blue-600"
                    />
                    <span className="font-black text-blue-700 min-w-[50px]">{radius} KM</span>
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Result Sidebar */}
                <div className="hidden lg:flex flex-col w-96 bg-white border-r overflow-y-auto">
                    <div className="p-6 border-b">
                        <h2 className="font-black text-xl text-gray-900 uppercase tracking-tight">
                            Resultados no Raio
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">{visibleListings.length} anúncios encontrados</p>
                    </div>
                    <div className="p-4 space-y-4">
                        {visibleListings.map(listing => (
                            <div
                                key={listing.id}
                                onClick={() => navigate(`/listing/${listing.id}`)}
                                className="flex gap-4 p-3 hover:bg-blue-50 rounded-3xl transition cursor-pointer group border border-transparent hover:border-blue-100"
                            >
                                <img src={listing.images[0]} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="" />
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">{listing.title}</h4>
                                    <p className="text-sm text-gray-500 font-medium">{listing.location.neighborhood}</p>
                                    <p className="text-lg font-black text-blue-700 mt-1">{listing.price.toLocaleString()} Kz</p>
                                </div>
                            </div>
                        ))}
                        {visibleListings.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <span className="text-4xl block mb-2">📍</span>
                                <p className="font-bold">Nenhum imóvel neste raio.</p>
                                <p className="text-xs">Tente aumentar o raio de pesquisa.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div ref={mapRef} className="flex-grow z-10" />
            </div>
        </div>
    );
};

export default MapSearchPage;
