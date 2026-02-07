
import React, { useState } from 'react';
import { Listing, ListingCategory, TransactionType } from '../types';

interface HomeProps {
    listings: Listing[];
    bannerUrl: string;
    onListingClick: (id: string) => void;
    onSearch: (filters: any) => void;
    onCategoryClick: (cat: ListingCategory) => void;
}

const Home: React.FC<HomeProps> = ({
    listings,
    bannerUrl,
    onListingClick,
    onSearch,
    onCategoryClick
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState<ListingCategory | 'ALL'>('ALL');

    const filteredListings = listings.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.location.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'ALL' || l.category === category;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: ListingCategory.HOUSE, label: 'Casas', icon: '🏠' },
        { id: ListingCategory.APARTMENT, label: 'Apartamentos', icon: '🏢' },
        { id: ListingCategory.LAND, label: 'Terrenos', icon: '🏞️' },
        { id: ListingCategory.CAR, label: 'Viaturas', icon: '🚗' },
        { id: ListingCategory.SHOP, label: 'Lojas', icon: '🏪' },
        { id: ListingCategory.WAREHOUSE, label: 'Armazéns', icon: '🏭' },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden">
                <img
                    src={bannerUrl}
                    alt="Banner"
                    className="w-full h-full object-cover brightness-[0.7]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 drop-shadow-lg">
                        Encontre o seu lugar em Angola
                    </h1>
                    <p className="text-xl text-white text-center mb-8 max-w-2xl drop-shadow-md">
                        A plataforma mais segura para comprar, alugar e vender imóveis e viaturas com verificação de identidade.
                    </p>

                    <div className="bg-white p-2 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row gap-2">
                        <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r">
                            <span className="text-gray-400 mr-2">🔍</span>
                            <input
                                type="text"
                                placeholder="O que procura? (ex: Apartamento T2, Toyota Hilux...)"
                                className="w-full py-3 outline-none text-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-300">
                            Pesquisar
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Categories Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias Populares</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setCategory(cat.id);
                                    onCategoryClick(cat.id);
                                }}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition border-2 ${category === cat.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                            >
                                <span className="text-3xl mb-3">{cat.icon}</span>
                                <span className="font-semibold text-gray-800">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listings Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Resultados Recentes</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCategory('ALL')}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${category === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Tudo
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredListings.map((listing) => (
                            <div
                                key={listing.id}
                                onClick={() => onListingClick(listing.id)}
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${listing.transactionType === TransactionType.RENT ? 'bg-orange-500' : 'bg-green-500'}`}>
                                            {listing.transactionType === TransactionType.RENT ? 'Rent' : 'Buy'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{listing.title}</h3>
                                        <span className="text-blue-700 font-extrabold text-lg">
                                            {listing.price.toLocaleString()} {listing.currency}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <span className="mr-1">📍</span>
                                        {listing.location.neighborhood}, {listing.location.city}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {listing.features.slice(0, 3).map((f, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold">{f}</span>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Publicado em {new Date(listing.createdAt).toLocaleDateString()}</span>
                                        <button className="text-blue-600 font-bold text-sm hover:underline">Ver Detalhes</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredListings.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <span className="text-5xl mb-4 block">🔍</span>
                            <h3 className="text-xl font-bold text-gray-800">Nenhum resultado encontrado</h3>
                            <p className="text-gray-500">Tente ajustar a sua pesquisa ou os filtros.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
