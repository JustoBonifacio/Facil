
import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Listing } from '../../../shared/types';
import { ListingCard } from '../../../components';

interface ListingsTabProps {
    listings: Listing[];
    onListingClick: (id: string) => void;
    onCreateListing: () => void;
}

export const ListingsTab: React.FC<ListingsTabProps> = ({
    listings,
    onListingClick,
    onCreateListing
}) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-slate-900">Os Meus Anúncios</h2>
                <span className="bg-facil-blue/10 text-facil-blue px-4 py-1 rounded-full font-bold text-sm tracking-tight">{listings.length} anúncios</span>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-6 animate-icon-bounce" />
                    <h3 className="text-2xl font-black text-slate-800">Ainda não tem anúncios</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Crie o seu primeiro anúncio para começar a vender ou alugar na plataforma.</p>
                    <button
                        onClick={onCreateListing}
                        className="bg-facil-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-5 h-5" /> Criar Primeiro Anúncio
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            onClick={onListingClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
