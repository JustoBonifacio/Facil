
import React, { useState } from 'react';
import { ListingCategory, TransactionType, SearchFilters } from '../../types';

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

    const categories = [
        { value: ListingCategory.HOUSE, label: 'Casas' },
        { value: ListingCategory.APARTMENT, label: 'Apartamentos' },
        { value: ListingCategory.LAND, label: 'Terrenos' },
        { value: ListingCategory.CAR, label: 'Viaturas' },
        { value: ListingCategory.SHOP, label: 'Lojas' },
        { value: ListingCategory.WAREHOUSE, label: 'Armazéns' },
    ];

    const cities = ['Luanda', 'Benguela', 'Huambo', 'Lubango', 'Cabinda', 'Namibe', 'Soyo'];

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="bg-white p-2 rounded-2xl shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                    {/* Search Input */}
                    <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-100">
                        <span className="text-gray-400 mr-2 text-xl">🔍</span>
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="w-full py-3 outline-none text-gray-700"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle */}
                    {showFilters && (
                        <button
                            type="button"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`px-4 py-3 text-sm font-medium rounded-xl transition ${isFiltersOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-2">⚙️</span>
                            Filtros
                        </button>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-200"
                    >
                        Pesquisar
                    </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && isFiltersOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
                        {/* Category */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Categoria
                            </label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={filters.category || ''}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value as ListingCategory || undefined })}
                            >
                                <option value="">Todas</option>
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Transaction Type */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Tipo
                            </label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={filters.transactionType || ''}
                                onChange={(e) => setFilters({ ...filters, transactionType: e.target.value as TransactionType || undefined })}
                            >
                                <option value="">Todos</option>
                                <option value={TransactionType.RENT}>Arrendar</option>
                                <option value={TransactionType.BUY}>Comprar</option>
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Cidade
                            </label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={filters.city || ''}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                            >
                                <option value="">Todas</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Preço Máximo
                            </label>
                            <input
                                type="number"
                                placeholder="Sem limite"
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={filters.maxPrice || ''}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
