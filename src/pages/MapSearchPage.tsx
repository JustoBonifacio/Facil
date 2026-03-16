
import React from 'react';
import { useMapSearch } from '../features/search/hooks/useMapSearch';
import { SearchBar } from '../components';
import { ArrowLeft, MapPin, Globe, Shield, Navigation, Settings2 } from 'lucide-react';

const MapSearchPage: React.FC = () => {
    const {
        navigate,
        mapRef,
        radius, setRadius,
        visibleListings
    } = useMapSearch();

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-white">
            {/* Control Bar */}
            <div className="bg-white/95 backdrop-blur-xl p-8 border-b border-gray-100 z-30 flex flex-col md:flex-row gap-8 items-center shadow-xl shadow-gray-100/50">
                <button
                    onClick={() => navigate(-1)}
                    className="p-5 bg-gray-50 text-gray-400 rounded-3xl hover:bg-white hover:text-blue-600 hover:shadow-2xl transition-all active:scale-95 group"
                >
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex-grow max-w-2xl relative group">
                    <div className="absolute -inset-2 bg-blue-600/5 rounded-[2.5rem] opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative z-10 w-full">
                        <SearchBar onSearch={() => { }} placeholder="Pesquisar localização no mapa de Angola..." />
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100/50 min-w-[320px] shadow-sm">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200">
                        <Settings2 className="w-4 h-4" />
                    </div>
                    <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Raio de Pesquisa</span>
                            <span className="font-black text-blue-700 text-sm">{radius} KM</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Result Sidebar */}
                <div className="hidden lg:flex flex-col w-[26rem] bg-white border-r border-gray-100 overflow-y-auto z-20 shadow-2xl relative">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="font-black text-2xl text-gray-900 tracking-tight leading-none">
                                Proximo de Si
                            </h2>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2">{visibleListings.length} UNIDADES ENCONTRADAS</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Navigation className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {visibleListings.length === 0 ? (
                            <div className="text-center py-24 px-8 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto mb-6 text-4xl">📍</div>
                                <h3 className="font-black text-gray-900 mb-2">Sem Imóveis Próximos</h3>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Tente aumentar o raio para 20KM+</p>
                            </div>
                        ) : (
                            visibleListings.map(listing => (
                                <div
                                    key={listing.id}
                                    onClick={() => navigate(`/listing/${listing.id}`)}
                                    className="p-4 bg-white rounded-[2.5rem] transition-all cursor-pointer group border-2 border-transparent hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 relative overflow-hidden flex gap-5 items-center active:scale-[0.98]"
                                >
                                    <div className="h-32 w-32 rounded-[2rem] overflow-hidden shadow-lg flex-shrink-0 relative">
                                        <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[8px] font-black text-blue-600 uppercase tracking-widest shadow-lg">
                                            {listing.category === 'HOUSE' ? 'VIVENDA' : 'APTO'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-1">
                                        <h4 className="font-black text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition leading-tight">{listing.title}</h4>
                                        <div className="flex items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                            <MapPin className="w-3 h-3 mr-1 text-blue-400" />
                                            {listing.location.neighborhood}
                                        </div>
                                        <p className="text-2xl font-black text-blue-700 mt-2 tracking-tight">{listing.price.toLocaleString()} <span className="text-xs font-black uppercase text-gray-300 ml-1">Kz</span></p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-auto p-8 border-t border-gray-50 bg-gray-50/30">
                        <div className="flex items-center gap-4 text-gray-500">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-500">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Mapa Auditado FACIL</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Geolocalização verificada por IA</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div ref={mapRef} className="flex-grow z-10" />

                {/* Map Floating Controls */}
                <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                    <button className="p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 text-gray-400 hover:text-blue-600 transition group">
                        <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                    <button className="p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 text-gray-400 hover:text-blue-600 transition group">
                        <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="mt-4 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/50 space-y-3">
                        <div className="h-10 w-10 flex items-center justify-center font-black text-blue-600 bg-blue-50 rounded-xl cursor-help">i</div>
                    </div>
                </div>
            </div>

            <style>{`
                .premium-popup .leaflet-popup-content-wrapper {
                    padding: 12px;
                    border-radius: 2rem;
                    border: 4px solid white;
                    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
                }
                .premium-popup .leaflet-popup-tip {
                    background: white;
                }
                .leaflet-bar {
                    border: none !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                }
                .leaflet-bar a {
                    background-color: white !important;
                    color: #4b5563 !important;
                    border: 1px solid #f3f4f6 !important;
                    width: 44px !important;
                    height: 44px !important;
                    line-height: 44px !important;
                    border-radius: 12px !important;
                    margin-bottom: 8px !important;
                    font-weight: 900 !important;
                }
                .leaflet-bar a:hover {
                    color: #2563eb !important;
                    background-color: #f9fafb !important;
                }
            `}</style>
        </div>
    );
};

export default MapSearchPage;
