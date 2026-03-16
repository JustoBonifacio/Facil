
import React from 'react';
import { Heart, Clock, Search, Plus } from 'lucide-react';
import { Listing, SearchAlert, SearchHistory } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/helpers';

interface ActivityTabProps {
    favoriteListings: Listing[];
    searchAlerts: SearchAlert[];
    searchHistory: SearchHistory[];
    recentListings: Listing[];
    onNavigateToListing: (id: string) => void;
    onViewCollections: () => void;
    onAddAlert: () => void;
    onRepeatSearch: (query: string) => void;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({
    favoriteListings,
    searchAlerts,
    searchHistory,
    recentListings,
    onNavigateToListing,
    onViewCollections,
    onAddAlert,
    onRepeatSearch
}) => {
    return (
        <div className="animate-fade-in space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Favorites Section */}
                <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            Meus Favoritos <Heart className="w-6 h-6 text-rose-500 fill-current animate-pulse" />
                        </h2>
                        <button
                            onClick={onViewCollections}
                            className="text-facil-blue font-bold hover:underline text-[10px] uppercase tracking-widest"
                        >
                            Ver todos
                        </button>
                    </div>
                    {favoriteListings.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-bounce" />
                            <p className="font-medium italic text-slate-400">Ainda não guardou nenhum imóvel.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {favoriteListings.slice(0, 3).map(listing => (
                                <div
                                    key={listing.id}
                                    onClick={() => onNavigateToListing(listing.id)}
                                    className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition"
                                >
                                    <img src={listing.images[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                                    <div>
                                        <p className="font-bold text-slate-900 line-clamp-1">{listing.title}</p>
                                        <p className="text-facil-blue font-black">{listing.price.toLocaleString()} {listing.currency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Intelligent Alerts Section */}
                <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            Alertas Ativos <Clock className="w-6 h-6 text-facil-blue" />
                        </h2>
                        <button
                            onClick={onAddAlert}
                            className="bg-slate-100 p-2 rounded-xl text-lg hover:bg-slate-200 transition-colors"
                        >
                            <Plus className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {searchAlerts.length === 0 ? (
                            <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                <p className="font-bold text-slate-300 italic">Sem alertas configurados</p>
                            </div>
                        ) : (
                            searchAlerts.map(alert => (
                                <div key={alert.id} className="flex items-center justify-between p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <Search className="w-4 h-4 text-facil-blue" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{alert.title}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                Filtros: {alert.filters.category} | {alert.filters.maxPrice ? `Até ${alert.filters.maxPrice.toLocaleString()} Kz` : 'Qualquer preço'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div
                                            className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${alert.isActive ? 'bg-facil-blue' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alert.isActive ? 'right-1' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest pt-2">Notificações em tempo real ativadas</p>
                    </div>
                </section>
            </div>

            {/* Recent Searches History */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        Pesquisas Recentes <Search className="w-6 h-6 text-slate-400" />
                    </h2>
                </div>
                <div className="space-y-3">
                    {searchHistory.length === 0 ? (
                        <p className="text-sm text-slate-400 font-medium italic">Nenhuma pesquisa guardada.</p>
                    ) : (
                        searchHistory.slice(0, 3).map(h => (
                            <div key={h.id} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100 hover:border-facil-blue/30 transition-all group">
                                <div>
                                    <p className="font-bold text-slate-900">"{h.query || 'Filtros aplicados'}"</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{formatDate(h.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => onRepeatSearch(h.query || '')}
                                    className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:border-facil-blue hover:text-facil-blue transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Search className="w-3 h-3 group-hover:animate-icon-pulse" /> REPETIR
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Recently Viewed */}
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-6 px-4 flex items-center gap-2">
                    Visualizados Recentemente <Clock className="w-6 h-6 text-slate-400" />
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recentListings.slice(0, 5).map(listing => (
                        <div
                            key={listing.id}
                            onClick={() => onNavigateToListing(listing.id)}
                            className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            <div className="relative overflow-hidden rounded-lg aspect-square">
                                <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                            </div>
                            <div className="p-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{listing.location.city}</p>
                                <p className="font-black text-slate-900 truncate tracking-tight">{listing.price.toLocaleString()} Kz</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
