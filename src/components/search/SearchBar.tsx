
import React, { useState } from 'react';
import { ListingCategory, TransactionType, SearchFilters } from '../../shared/types';
import { Search, ChevronDown, MapPin, Home, DollarSign, Ruler } from 'lucide-react';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [activeTab, setActiveTab] = useState<'all' | TransactionType>('all');
    const [filters, setFilters] = useState<SearchFilters>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            ...filters,
            transactionType: activeTab === 'all' ? undefined : activeTab
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            {/* Tabs */}
            <div className="flex justify-center mb-0">
                <div className="bg-white/95 backdrop-blur-md rounded-t-xl overflow-hidden flex shadow-lg border border-b-0 border-slate-200/50">
                    <TabButton
                        active={activeTab === 'all'}
                        onClick={() => setActiveTab('all')}
                    >
                        Todos
                    </TabButton>
                    <TabButton
                        active={activeTab === TransactionType.RENT}
                        onClick={() => setActiveTab(TransactionType.RENT)}
                    >
                        Para Alugar
                    </TabButton>
                    <TabButton
                        active={activeTab === TransactionType.BUY}
                        onClick={() => setActiveTab(TransactionType.BUY)}
                    >
                        Para Comprar
                    </TabButton>
                </div>
            </div>

            {/* Main Bar */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl lg:rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center gap-4 border border-slate-100"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow w-full">
                    <SearchField
                        label="O que procura?"
                        icon={<Home className="w-4 h-4" />}
                    >
                        <select
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
                            value={filters.category || ''}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value as any || undefined })}
                        >
                            <option value="">Tipo de Imóvel</option>
                            <option value={ListingCategory.HOUSE}>Vivenda</option>
                            <option value={ListingCategory.APARTMENT}>Apartamento</option>
                            <option value={ListingCategory.LAND}>Terreno</option>
                        </select>
                    </SearchField>

                    <SearchField
                        label="Localização"
                        icon={<MapPin className="w-4 h-4" />}
                    >
                        <select
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
                            value={filters.city || ''}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                        >
                            <option value="">Todas as Cidades</option>
                            <option value="Luanda">Luanda</option>
                            <option value="Benguela">Benguela</option>
                            <option value="Lubango">Lubango</option>
                        </select>
                    </SearchField>

                    <SearchField
                        label="Área Mínima"
                        icon={<Ruler className="w-4 h-4" />}
                    >
                        <select
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="">Quartos</option>
                            <option value="1">1 Quarto</option>
                            <option value="2">2 Quartos</option>
                            <option value="3">3+ Quartos</option>
                        </select>
                    </SearchField>

                    <SearchField
                        label="Seu Orçamento"
                        icon={<DollarSign className="w-4 h-4" />}
                    >
                        <input
                            type="number"
                            placeholder="Preço Máximo"
                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300"
                            value={filters.maxPrice || ''}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                        />
                    </SearchField>
                </div>

                <button
                    type="submit"
                    className="w-full lg:w-auto bg-facil-blue text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1"
                >
                    <Search className="w-4 h-4" />
                    Pesquisar
                </button>
            </form>
        </div>
    );
};

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-8 py-4 text-[13px] font-bold transition-all relative ${active ? 'bg-facil-blue text-white' : 'text-facil-dark hover:bg-slate-50'}`}
    >
        {children}
        {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />}
    </button>
);

const SearchField = ({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-100 last:border-0 pr-4 group">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-facil-blue transition-colors">
            {label}
        </label>
        <div className="flex items-center gap-2 relative">
            <div className="text-slate-300 group-hover:text-facil-blue transition-colors animate-icon-bounce">
                {icon}
            </div>
            {children}
            <ChevronDown className="w-3 h-3 text-slate-300 absolute right-0 pointer-events-none" />
        </div>
    </div>
);
