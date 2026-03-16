
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../contexts/ListingsContext';
import { ListingCategory } from '../shared/types';
import { ArrowLeft, Home, Building2, Map as MapIcon, Car, ShoppingBag, Box, TrendingUp, Users, Globe, Shield } from 'lucide-react';

const CategoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const { listings } = useListings();

    const categories = [
        { id: ListingCategory.HOUSE, label: 'Casas e Vivendas', icon: <Home className="w-10 h-10" />, description: 'Residências de luxo e moradias familiares em Angola.', color: 'bg-blue-500' },
        { id: ListingCategory.APARTMENT, label: 'Apartamentos', icon: <Building2 className="w-10 h-10" />, description: 'T0 a T5 em localizações privilegiadas de Luanda.', color: 'bg-indigo-500' },
        { id: ListingCategory.LAND, label: 'Terrenos e Quintas', icon: <MapIcon className="w-10 h-10" />, description: 'Lotes para construção e espaços rurais vastos.', color: 'bg-emerald-500' },
        { id: ListingCategory.CAR, label: 'Viaturas e Motores', icon: <Car className="w-10 h-10" />, description: 'Automóveis novos e usados com garantia de qualidade.', color: 'bg-amber-500' },
        { id: ListingCategory.SHOP, label: 'Lojas e Comércio', icon: <ShoppingBag className="w-10 h-10" />, description: 'Espaços comerciais estratégicos para o seu negócio.', color: 'bg-rose-500' },
        { id: ListingCategory.WAREHOUSE, label: 'Armazéns e Especulações', icon: <Box className="w-10 h-10" />, description: 'Espaços logísticos e industriais de grande escala.', color: 'bg-slate-700' },
    ];

    const getCategoryCount = (categoryId: ListingCategory) => {
        return listings.filter(l => l.category === categoryId).length;
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center text-gray-400 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] mb-12 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar ao Início
                </button>

                <div className="mb-16">
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Directório de Categorias</h1>
                    <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">Navegue pelo nosso ecossistema imobiliário e comercial. Encontre exactamente o que procura em qualquer ponto de Angola.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat) => {
                        const count = getCategoryCount(cat.id);
                        return (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/?category=${cat.id}`)}
                                className="group cursor-pointer bg-white p-10 rounded-xl shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className={`h-16 w-16 ${cat.color} text-white rounded-xl flex items-center justify-center p-4 shadow-2xl group-hover:scale-110 transition duration-500 mb-8 animate-icon-pulse`}>
                                    {cat.icon}
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-facil-blue transition tracking-tight">
                                    {cat.label}
                                </h2>
                                <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                    {cat.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-[10px] font-black text-facil-blue bg-blue-50 px-4 py-2 rounded-lg uppercase tracking-widest">
                                        {count} Anúncios
                                    </span>
                                    <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-facil-blue group-hover:text-white group-hover:border-facil-blue transition-all">
                                        →
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Performance Stats */}
                <div className="mt-24 px-10 py-16 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="h-16 w-16 bg-blue-50 text-facil-blue rounded-xl flex items-center justify-center mx-auto animate-icon-pulse">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">{listings.length * 42}k</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Pesquisas Mensais</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto animate-icon-bounce">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">{listings.length * 3}k</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Utilizadores Ativos</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto animate-icon-spin">
                                <Globe className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">18</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Províncias de Angola</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto animate-icon-pulse">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">100%</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Transações Seguras</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
