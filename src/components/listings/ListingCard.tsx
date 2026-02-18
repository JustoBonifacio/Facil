
import React from 'react';
import { Listing, TransactionType } from '../../types';
import { Eye, Heart, MapPin, Star, ArrowRight } from 'lucide-react';

interface ListingCardProps {
    listing: Listing;
    onClick: (id: string) => void;
    variant?: 'default' | 'compact' | 'featured';
    key?: string | number;
}

export const ListingCard: React.FC<ListingCardProps> = ({
    listing,
    onClick,
    variant = 'default'
}) => {
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('pt-AO', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price) + ' ' + currency;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-AO', {
            day: 'numeric',
            month: 'short',
        });
    };

    if (variant === 'compact') {
        return (
            <div
                onClick={() => onClick(listing.id)}
                className="flex items-center p-4 bg-white rounded-xl hover:bg-gray-50 cursor-pointer transition border border-gray-100"
            >
                <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-16 w-20 object-cover rounded-lg mr-4"
                    loading="lazy"
                />
                <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{listing.title}</h3>
                    <p className="text-sm text-gray-500">{listing.location.neighborhood}, {listing.location.city}</p>
                </div>
                <div className="text-right ml-4">
                    <p className="font-bold text-blue-700">{formatPrice(listing.price, listing.currency)}</p>
                </div>
            </div>
        );
    }

    return (
        <article
            onClick={() => onClick(listing.id)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes: ${listing.title}`}
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    loading="lazy"
                />

                {/* Transaction Type Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md ${listing.transactionType === TransactionType.RENT
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}>
                        {listing.transactionType === TransactionType.RENT ? 'Arrendar' : 'Comprar'}
                    </span>
                </div>

                {/* Views Badge */}
                <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {listing.views}
                    </span>
                </div>

                {/* Featured Badge */}
                {listing.isFeatured && (
                    <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-yellow-900" /> Destaque
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
                        {listing.title}
                    </h3>
                    <span className="text-blue-700 font-extrabold text-lg whitespace-nowrap ml-4">
                        {formatPrice(listing.price, listing.currency)}
                    </span>
                </div>

                <div className="flex items-center text-gray-400 text-xs mb-4">
                    <MapPin className="w-3 h-3 mr-1.5 text-blue-500" />
                    {listing.location.neighborhood}, {listing.location.city}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {listing.features.slice(0, 3).map((feature, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold"
                        >
                            {feature}
                        </span>
                    ))}
                    {listing.features.length > 3 && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] rounded font-bold">
                            +{listing.features.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        {formatDate(listing.createdAt)}
                    </span>
                    <span className="text-blue-600 font-bold text-sm group-hover:underline flex items-center gap-1">
                        Ver Detalhes <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </article>
    );
};
