
import React from 'react';
import { Folder } from 'lucide-react';
import { UserList, Listing } from '../../../shared/types';

interface CollectionsTabProps {
    userLists: UserList[];
    listings: Listing[];
    onNavigateToList: (id: string) => void;
    onCreateList: () => void;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({
    userLists,
    listings,
    onNavigateToList,
    onCreateList
}) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    Minhas Coleções <Folder className="w-8 h-8 text-facil-blue animate-icon-pulse" />
                </h2>
                <button
                    onClick={onCreateList}
                    className="bg-facil-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-facil-blue/90 transition shadow-lg text-[10px] uppercase tracking-widest active:scale-95"
                >
                    + Nova Lista
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userLists.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-50 rounded-xl text-center border-2 border-dashed border-slate-200">
                        <Folder className="w-16 h-16 text-slate-200 mx-auto mb-6 animate-icon-bounce" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Ainda não criou nenhuma lista personalizada.</p>
                    </div>
                ) : (
                    userLists.map(list => (
                        <div
                            key={list.id}
                            onClick={() => onNavigateToList(list.id)}
                            className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-blue-50/50 rounded-xl flex items-center justify-center text-facil-blue group-hover:scale-110 transition duration-300">
                                    <Folder className="w-8 h-8 group-hover:animate-icon-pulse" />
                                </div>
                                <span className="bg-blue-100 text-facil-blue px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{list.listings.length} items</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{list.name}</h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-medium">{list.description || 'Sem descrição'}</p>
                            <div className="flex -space-x-3 overflow-hidden">
                                {list.listings.slice(0, 3).map((id) => {
                                    const listing = listings.find(l => l.id === id);
                                    return listing ? (
                                        <img key={id} src={listing.images[0]} className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" alt="" title={listing.title} />
                                    ) : null;
                                })}
                                {list.listings.length > 3 && (
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-black text-slate-400">
                                        +{list.listings.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
