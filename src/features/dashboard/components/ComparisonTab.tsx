
import React from 'react';
import { Scale } from 'lucide-react';
import { Listing } from '../../../shared/types';

interface ComparisonTabProps {
    favoriteListings: Listing[];
    onNavigateToListing: (id: string) => void;
    onExplore: () => void;
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({
    favoriteListings,
    onNavigateToListing,
    onExplore
}) => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    Comparação Lado a Lado <Scale className="w-8 h-8 text-facil-blue animate-icon-pulse" />
                </h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Até 3 anúncios para comparar</span>
            </div>

            {favoriteListings.length < 2 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Scale className="w-16 h-16 text-slate-300 mx-auto mb-6 animate-icon-bounce" />
                    <h3 className="text-2xl font-black text-slate-800">Precisa de mais favoritos</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Adicione pelo menos 2 anúncios aos seus favoritos para os poder comparar.</p>
                    <button onClick={onExplore} className="bg-facil-blue text-white px-10 py-4 rounded-xl font-black hover:bg-facil-blue/90 transition shadow-lg text-[10px] uppercase tracking-widest">Explorar Imóveis</button>
                </div>
            ) : (
                <div className="overflow-x-auto pb-10">
                    <table className="w-full text-left border-separate border-spacing-0 min-w-[800px] rounded-xl overflow-hidden border border-slate-100">
                        <thead>
                            <tr>
                                <th className="p-6 bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">Característica</th>
                                {favoriteListings.slice(0, 3).map(l => (
                                    <th key={l.id} className="p-6 bg-white border-b border-slate-100 min-w-[250px]">
                                        <div className="flex flex-col gap-3">
                                            <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
                                                <img src={l.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                                            </div>
                                            <span className="font-black text-slate-900 line-clamp-1">{l.title}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr>
                                <td className="p-6 font-black text-slate-400 bg-slate-50/50 text-[10px] uppercase tracking-widest">Preço</td>
                                {favoriteListings.slice(0, 3).map(l => (
                                    <td key={l.id} className="p-6 font-black text-facil-blue text-xl">{l.price.toLocaleString()} {l.currency}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-black text-slate-400 bg-slate-50/50 text-[10px] uppercase tracking-widest">Localização</td>
                                {favoriteListings.slice(0, 3).map(l => (
                                    <td key={l.id} className="p-6 font-bold text-slate-700">{l.location.city}, {l.location.neighborhood}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-black text-slate-400 bg-slate-50/50 text-[10px] uppercase tracking-widest">Área / Tipologia</td>
                                {favoriteListings.slice(0, 3).map(l => (
                                    <td key={l.id} className="p-6 font-bold text-slate-700">{l.area ? `${l.area}m²` : 'N/A'} · {l.category}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-black text-slate-400 bg-slate-50/50 text-[10px] uppercase tracking-widest">Extras</td>
                                {favoriteListings.slice(0, 3).map(l => (
                                    <td key={l.id} className="p-6">
                                        <div className="flex flex-wrap gap-2">
                                            {l.features.slice(0, 3).map(f => (
                                                <span key={f} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-black uppercase tracking-tight">{f}</span>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 bg-slate-50"></td>
                                {favoriteListings.slice(0, 3).map(l => (
                                    <td key={l.id} className="p-6">
                                        <button onClick={() => onNavigateToListing(l.id)} className="w-full py-4 bg-facil-blue text-white rounded-lg font-black hover:bg-facil-blue/90 transition shadow-lg text-[10px] uppercase tracking-widest">Ver Detalhes</button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
