
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useListingsFilter } from '../hooks';
import { ListingCard, SearchBar } from '../components';
import { SearchFilters } from '../types';
import { Map as MapIcon, Info, Search as SearchIcon } from 'lucide-react';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useApp();
    const {
        listings,
        filters,
        updateFilters,
        clearFilters,
        filteredCount,
        totalCount
    } = useListingsFilter();

    const handleListingClick = (id: string) => {
        navigate(`/listing/${id}`);
    };

    const handleSearch = (searchFilters: SearchFilters) => {
        updateFilters(searchFilters);
        // Smooth scroll to results
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section with Glassmorphism Search */}
            <section className="relative h-[650px] overflow-hidden flex items-center justify-center">
                <img
                    src={state.bannerUrl}
                    alt="FACIL Angola - Marketplace"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.6] scale-105 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-white" />

                <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-fade-in shadow-xl">
                        O Marketplace de Angola
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white text-center mb-8 drop-shadow-2xl animate-fade-in leading-tight">
                        Seu novo capítulo <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">começa aqui.</span>
                    </h1>

                    <div className="w-full animate-slide-up delay-200">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className="mt-10 flex gap-8 text-white/80 font-bold animate-fade-in delay-500">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-white">10k+</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Anúncios</span>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-white">5k+</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Vendas</span>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-white">100%</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Seguro</span>
                        </div>
                    </div>
                </div>
            </section>

            <div id="results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                {/* Active Filters Bar */}
                {Object.keys(filters).length > 0 && (
                    <div className="mb-12 bg-blue-50/50 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-100/50">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-black text-blue-900/40 uppercase tracking-widest mr-2">Filtros:</span>
                            {Object.entries(filters).map(([key, val]) => val && (
                                <span key={key} className="px-4 py-2 bg-white text-blue-700 rounded-2xl text-xs font-black shadow-sm flex items-center border border-blue-100">
                                    {key === 'category' ? val.toString().toLowerCase() : val.toString()}
                                    <button
                                        onClick={() => updateFilters({ [key]: undefined })}
                                        className="ml-3 text-blue-300 hover:text-blue-900 transition"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-blue-600">{filteredCount}</span> de {totalCount} imóveis
                            </span>
                            <button
                                onClick={clearFilters}
                                className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition underline underline-offset-4"
                            >
                                Limpar Tudo
                            </button>
                        </div>
                    </div>
                )}

                {/* Listings Section */}
                <section>
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                {Object.keys(filters).length > 0 ? 'Encontramos isto para si' : 'Explorar o Mercado'}
                            </h2>
                            <p className="text-gray-500 font-medium mt-2">Escolha entre os melhores anúncios verificados em Angola.</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <button
                                onClick={() => navigate('/map-search')}
                                className="p-4 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-black hover:bg-blue-600 hover:text-white transition shadow-lg flex items-center gap-2"
                            >
                                <MapIcon className="w-5 h-5" /> Ver no Mapa
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {listings.map((listing, index) => (
                            <div
                                key={listing.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <ListingCard
                                    listing={listing}
                                    onClick={handleListingClick}
                                />
                            </div>
                        ))}
                    </div>

                    {listings.length === 0 && (
                        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200 mt-12">
                            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-3xl font-black text-gray-800 mb-4">Nenhum resultado</h3>
                            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium text-lg">Não encontramos anúncios com esses critérios. Tente uma busca mais ampla.</p>
                            <button
                                onClick={clearFilters}
                                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl"
                            >
                                Ver todos os anúncios
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;

