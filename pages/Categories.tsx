
import React from 'react';
import { Listing, ListingCategory } from '../types';

interface CategoriesProps {
    listings: Listing[];
    onCategoryClick: (cat: ListingCategory) => void;
    onBack: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ listings, onCategoryClick, onBack }) => {
    const categories = [
        { id: ListingCategory.HOUSE, label: 'Casas e Vivendas', icon: '🏠', count: listings.filter(l => l.category === ListingCategory.HOUSE).length },
        { id: ListingCategory.APARTMENT, label: 'Apartamentos', icon: '🏢', count: listings.filter(l => l.category === ListingCategory.APARTMENT).length },
        { id: ListingCategory.LAND, label: 'Terrenos e Quintas', icon: '🏞️', count: listings.filter(l => l.category === ListingCategory.LAND).length },
        { id: ListingCategory.CAR, label: 'Viaturas e Motores', icon: '🚗', count: listings.filter(l => l.category === ListingCategory.CAR).length },
        { id: ListingCategory.SHOP, label: 'Lojas e Comércio', icon: '🏪', count: listings.filter(l => l.category === ListingCategory.SHOP).length },
        { id: ListingCategory.WAREHOUSE, label: 'Armazéns e Estaleiros', icon: '🏭', count: listings.filter(l => l.category === ListingCategory.WAREHOUSE).length },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-8 font-medium flex items-center">
                <span className="mr-2">←</span> Voltar ao Início
            </button>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Categorias</h1>
            <p className="text-gray-500 mb-12">Explore anúncios por tipo de propriedade ou serviço.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => onCategoryClick(cat.id)}
                        className="group cursor-pointer bg-white p-10 rounded-[32px] shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 text-gray-50 group-hover:text-blue-50 transition-colors pointer-events-none">
                            <span className="text-9xl font-black">{cat.icon}</span>
                        </div>

                        <div className="relative z-10">
                            <span className="text-5xl mb-6 block drop-shadow-sm">{cat.icon}</span>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition">{cat.label}</h2>
                            <p className="text-gray-400 font-medium">{cat.count} anúncios disponíveis</p>

                            <div className="mt-8 flex items-center text-blue-600 font-bold">
                                <span>Explorar</span>
                                <span className="ml-2 group-hover:translate-x-2 transition">→</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
