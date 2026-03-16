
import React from 'react';
import { Listing, TransactionType } from '../../../shared/types';
import { Bed, Bath, Car, Maximize, MapPin, Heart, Share2, Plus } from 'lucide-react';

interface ListingCardProps {
    listing: Listing;
    onClick: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
    const formatPrice = (price: number, currency: string) => {
        const formatted = new Intl.NumberFormat('pt-AO', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
        return currency === 'AOA' ? `${formatted} Kz` : `$${formatted}`;
    };

    return (
        <article
            className="premium-card group cursor-pointer"
            onClick={() => onClick(listing.id)}
        >
            {/* Image Section */}
            <div className="relative h-[250px] overflow-hidden">
                <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {listing.isFeatured && (
                        <span className="bg-[#10b981] text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                            Destaque
                        </span>
                    )}
                    <span className="bg-[rgba(15,23,42,0.85)] backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider self-start shadow-sm">
                        {listing.transactionType === TransactionType.RENT ? 'Para Alugar' : 'Para Comprar'}
                    </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 left-4">
                    <span className="text-white text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {formatPrice(listing.price, listing.currency)}
                        {listing.transactionType === TransactionType.RENT && <span className="text-sm font-medium">/mês</span>}
                    </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2.5 bg-white rounded-xl text-facil-dark hover:bg-facil-blue hover:text-white transition-all shadow-lg hover:-translate-y-1 animate-icon-pulse">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-white rounded-xl text-facil-dark hover:bg-facil-blue hover:text-white transition-all shadow-lg hover:-translate-y-1 animate-icon-bounce">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-white rounded-xl text-facil-dark hover:bg-facil-blue hover:text-white transition-all shadow-lg hover:-translate-y-1 animate-icon-spin">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="text-[10px] font-bold text-facil-blue uppercase tracking-widest mb-2 px-2 py-0.5 bg-facil-blue/10 rounded-md inline-block">
                    {listing.category}
                </div>
                <h3 className="text-lg font-bold text-facil-dark mb-1 group-hover:text-facil-blue transition-colors line-clamp-1">
                    {listing.title}
                </h3>
                <div className="flex items-center text-facil-gray text-xs mb-4">
                    <MapPin className="w-3 h-3 mr-1" />
                    {listing.location.neighborhood}, {listing.location.city}
                </div>

                {/* Features Bar */}
                <div className="flex items-center gap-4 py-4 border-t border-gray-100 text-slate-600 text-[13px]">
                    <div className="flex items-center gap-1.5 group/icon">
                        <div className="animate-icon-bounce">
                            <Bed className="w-4 h-4 text-slate-400 group-hover/icon:text-facil-blue transition-colors" />
                        </div>
                        <span className="font-semibold">3</span>
                    </div>
                    <div className="flex items-center gap-1.5 group/icon">
                        <div className="animate-icon-pulse">
                            <Bath className="w-4 h-4 text-slate-400 group-hover/icon:text-facil-blue transition-colors" />
                        </div>
                        <span className="font-semibold">2</span>
                    </div>
                    <div className="flex items-center gap-1.5 group/icon">
                        <div className="animate-icon-bounce">
                            <Car className="w-4 h-4 text-slate-400 group-hover/icon:text-facil-blue transition-colors" />
                        </div>
                        <span className="font-semibold">1</span>
                    </div>
                    <div className="flex items-center gap-1.5 group/icon">
                        <div className="animate-icon-pulse">
                            <Maximize className="w-4 h-4 text-slate-400 group-hover/icon:text-facil-blue transition-colors" />
                        </div>
                        <span className="font-semibold">{listing.area || '120'} m²</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200" />
                        <span className="text-[11px] text-facil-gray font-bold">Samuel Palmer</span>
                    </div>
                    <span className="text-[11px] text-facil-gray">Há 3 anos</span>
                </div>
            </div>
        </article>
    );
};
