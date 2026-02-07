
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ListingCategory } from '../types';

const CategoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const { category: activeCategory } = useParams<{ category: string }>();
    const { state } = useApp();

    const categories = [
        { id: ListingCategory.HOUSE, label: 'Casas e Vivendas', icon: '🏠', description: 'Moradias, vivendas e casas para compra ou arrendamento' },
        { id: ListingCategory.APARTMENT, label: 'Apartamentos', icon: '🏢', description: 'T0, T1, T2, T3 e mais em prédios residenciais' },
        { id: ListingCategory.LAND, label: 'Terrenos e Quintas', icon: '🏞️', description: 'Terrenos urbanos, rurais e quintas' },
        { id: ListingCategory.CAR, label: 'Viaturas e Motores', icon: '🚗', description: 'Carros, motas, camiões e outros veículos' },
        { id: ListingCategory.SHOP, label: 'Lojas e Comércio', icon: '🏪', description: 'Espaços comerciais e escritórios' },
        { id: ListingCategory.WAREHOUSE, label: 'Armazéns e Estaleiros', icon: '🏭', description: 'Espaços de armazenamento e industriais' },
    ];

    const getCategoryCount = (categoryId: ListingCategory) => {
        return state.listings.filter(l => l.category === categoryId).length;
    };

    const handleCategoryClick = (categoryId: ListingCategory) => {
        navigate(`/?category=${categoryId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-blue-600 mb-8 font-medium flex items-center transition"
            >
                <span className="mr-2">←</span> Voltar ao Início
            </button>

            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Categorias</h1>
                <p className="text-gray-500 text-lg">Explore anúncios por tipo de propriedade ou serviço.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => {
                    const count = getCategoryCount(cat.id);

                    return (
                        <article
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="group cursor-pointer bg-white p-8 rounded-[32px] shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Background Icon */}
                            <div className="absolute -top-4 -right-4 text-[120px] opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none select-none">
                                {cat.icon}
                            </div>

                            <div className="relative z-10">
                                <span className="text-5xl mb-6 block drop-shadow-sm">{cat.icon}</span>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition">
                                    {cat.label}
                                </h2>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {cat.description}
                                </p>
                                <p className="text-gray-400 font-medium text-sm mb-6">
                                    {count} {count === 1 ? 'anúncio disponível' : 'anúncios disponíveis'}
                                </p>

                                <div className="flex items-center text-blue-600 font-bold">
                                    <span>Explorar</span>
                                    <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Stats Section */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-[32px] p-10 text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black mb-2">{state.listings.length}</div>
                        <div className="text-blue-100 text-sm uppercase tracking-wider">Anúncios Ativos</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">{state.users.length}</div>
                        <div className="text-blue-100 text-sm uppercase tracking-wider">Utilizadores</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">18</div>
                        <div className="text-blue-100 text-sm uppercase tracking-wider">Províncias</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">24/7</div>
                        <div className="text-blue-100 text-sm uppercase tracking-wider">Suporte</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
