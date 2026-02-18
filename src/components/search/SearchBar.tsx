
import React, { useState } from 'react';
import { ListingCategory, TransactionType, SearchFilters } from '../../types';
import {
    Search, Settings, Home, Globe, ShoppingBag,
    Car, Sofa, Armchair, ChevronDown, Check
} from 'lucide-react';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
    placeholder?: string;
    showFilters?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'O que procura? (ex: Apartamento T2, Toyota Hilux...)',
    showFilters = true
}) => {
    const [query, setQuery] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ ...filters, query });
    };

    const handleQuickCategory = (category: ListingCategory) => {
        const newFilters = { ...filters, category: filters.category === category ? undefined : category };
        setFilters(newFilters);
        onSearch({ ...newFilters, query });
    };

    const categories = [
        { value: ListingCategory.HOUSE, label: 'Casas', icon: <Home className="w-6 h-6" /> },
        { value: ListingCategory.LAND, label: 'Terrenos', icon: <Globe className="w-6 h-6" /> },
        { value: ListingCategory.SHOP, label: 'Comercial', icon: <ShoppingBag className="w-6 h-6" /> },
        { value: ListingCategory.CAR, label: 'Carros', icon: <Car className="w-6 h-6" /> },
    ];

    const cities = ['Luanda', 'Benguela', 'Huambo', 'Lubango', 'Cabinda', 'Namibe', 'Soyo'];
    const typologies = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];

    return (
        <div className="w-full">
            {/* Quick Category Icons */}
            <div className="flex justify-center gap-4 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleQuickCategory(cat.value)}
                        className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all duration-300 min-w-[110px] border-2 ${filters.category === cat.value
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
                            : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-100'
                            }`}
                    >
                        {cat.icon}
                        <span className={`text-xs font-black uppercase tracking-widest ${filters.category === cat.value ? 'opacity-100' : 'opacity-60'}`}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-3 rounded-[2rem] shadow-2xl border border-gray-100 relative z-10">
                <div className="flex flex-col md:flex-row gap-2">
                    {/* Search Input */}
                    <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-100">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="w-full py-4 outline-none text-gray-700 font-medium placeholder:text-gray-300"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle */}
                    {showFilters && (
                        <button
                            type="button"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`px-6 py-4 text-sm font-black rounded-2xl transition-all flex items-center ${isFiltersOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Settings className="w-5 h-5 mr-2.5" />
                            FILTROS
                        </button>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition duration-300 shadow-xl shadow-blue-200 active:scale-95"
                    >
                        PESQUISAR
                    </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && isFiltersOpen && (
                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-fade-in">
                        {/* Typology */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Tipologia
                            </label>
                            <div className="flex flex-wrap gap-1">
                                {typologies.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFilters({ ...filters, typology: filters.typology === t ? undefined : t })}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${filters.typology === t ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-100 text-gray-500 hover:border-blue-200'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location/City */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Localização
                            </label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20"
                                value={filters.city || ''}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                            >
                                <option value="">Qualquer Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Condition */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Estado do Imóvel
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                                {(['NEW', 'USED', 'RENOVATED'] as const).map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFilters({ ...filters, condition: filters.condition === c ? undefined : c })}
                                        className={`py-2 rounded-lg text-[10px] font-black transition ${filters.condition === c ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            }`}
                                    >
                                        {c === 'NEW' ? 'NOVO' : c === 'USED' ? 'USADO' : 'OBRAS'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Furniture */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Mobiliário
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFilters({ ...filters, isFurnished: filters.isFurnished === true ? undefined : true })}
                                    className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${filters.isFurnished === true ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    <Sofa className="w-4 h-4" /> Mobilado
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilters({ ...filters, isFurnished: filters.isFurnished === false ? undefined : false })}
                                    className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 ${filters.isFurnished === false ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    <Armchair className="w-4 h-4" /> S/ Mobília
                                </button>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Preço Máximo (AOA)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Kz</span>
                                <input
                                    type="number"
                                    placeholder="Sem limite"
                                    className="w-full p-3 pl-12 bg-gray-50 rounded-xl border-0 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

