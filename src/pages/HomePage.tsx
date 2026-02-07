
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useListingsFilter } from '../hooks';
import { ListingCard, SearchBar } from '../components';
import { ListingCategory, SearchFilters } from '../types';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useApp();
    const {
        listings,
        filters,
        setQuery,
        setCategory,
        clearFilters,
        filteredCount,
        totalCount
    } = useListingsFilter();

    const handleListingClick = (id: string) => {
        navigate(`/listing/${id}`);
    };

    const handleSearch = (searchFilters: SearchFilters) => {
        if (searchFilters.query) setQuery(searchFilters.query);
        if (searchFilters.category) setCategory(searchFilters.category);
    };

    const handleCategoryClick = (category: ListingCategory) => {
        setCategory(category);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

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
            <section className="relative h-[500px] overflow-hidden">
                <img
                    src={state.bannerUrl}
                    alt="FACIL Angola - Marketplace"
                    className="w-full h-full object-cover brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white text-center mb-6 drop-shadow-lg animate-fade-in">
                        Encontre o seu lugar em Angola
                    </h1>
                    <p className="text-xl text-white/90 text-center mb-8 max-w-2xl drop-shadow-md animate-fade-in delay-100">
                        A plataforma mais segura para comprar, alugar e vender imóveis e viaturas com verificação de identidade.
                    </p>

                    <div className="w-full max-w-3xl animate-slide-up delay-200">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Categories Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias Populares</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200 border-2 ${filters.category === cat.id
                                        ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                                        : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-3xl mb-3">{cat.icon}</span>
                                <span className="font-semibold text-gray-800">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Active Filters */}
                {filters.category && (
                    <div className="mb-6 flex items-center gap-2">
                        <span className="text-sm text-gray-500">Filtros ativos:</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                            {categories.find(c => c.id === filters.category)?.label}
                            <button
                                onClick={clearFilters}
                                className="ml-2 hover:text-blue-900"
                            >
                                ✕
                            </button>
                        </span>
                        <span className="text-sm text-gray-400">
                            ({filteredCount} de {totalCount} resultados)
                        </span>
                    </div>
                )}

                {/* Listings Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {filters.category ? 'Resultados' : 'Anúncios Recentes'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((listing, index) => (
                            <div
                                key={listing.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ListingCard
                                    listing={listing}
                                    onClick={handleListingClick}
                                />
                            </div>
                        ))}
                    </div>

                    {listings.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <span className="text-5xl mb-4 block">🔍</span>
                            <h3 className="text-xl font-bold text-gray-800">Nenhum resultado encontrado</h3>
                            <p className="text-gray-500 mb-6">Tente ajustar a sua pesquisa ou os filtros.</p>
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
