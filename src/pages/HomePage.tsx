
import React from 'react';
import { useHome } from '../features/listings/hooks/useHome';
import { ListingCard, SearchBar } from '../components';
import { ArrowRight, Star, ShieldCheck, Globe, Trophy, Search } from 'lucide-react';

const HomePage: React.FC = () => {
    const {
        bannerUrl,
        listings,
        clearFilters,
        handleListingClick,
        handleSearch
    } = useHome();

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
                        alt="Luxurious Property"
                        className="w-full h-full object-cover brightness-[0.7] transform scale-110 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                </div>

                <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                        <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Premier Marketplace Angola</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight leading-[1.05] max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        Encontre o seu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Lugar de Elite</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl drop-shadow-lg font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        A plataforma n.º 1 em Angola para arrendamento e venda de imóveis de luxo, veículos e oportunidades comerciais exclusivas.
                    </p>

                    <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-1000 delay-700">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-80 scale-90 md:scale-100">
                        <div className="flex items-center gap-3 text-white group cursor-default">
                            <div className="animate-icon-pulse">
                                <ShieldCheck className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-left"><p className="text-sm font-black leading-none uppercase">100% SEGURO</p><p className="text-[10px] font-bold opacity-70 mt-1 uppercase">SISTEMA AUDITADO</p></div>
                        </div>
                        <div className="flex items-center gap-3 text-white group cursor-default">
                            <div className="animate-icon-bounce">
                                <Globe className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div className="text-left"><p className="text-sm font-black leading-none uppercase">PARA ANGOLA</p><p className="text-[10px] font-bold opacity-70 mt-1 uppercase">EM TODAS PROVÍNCIAS</p></div>
                        </div>
                        <div className="flex items-center gap-3 text-white group cursor-default">
                            <div className="animate-icon-spin">
                                <Trophy className="w-8 h-8 text-amber-400" />
                            </div>
                            <div className="text-left"><p className="text-sm font-black leading-none uppercase">LÍDER NACIONAL</p><p className="text-[10px] font-bold opacity-70 mt-1 uppercase">REAL ESTATE 2026</p></div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/50 animate-bounce">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] rotate-90 origin-left ml-4">Deslize</span>
                </div>
            </section>

            {/* Featured Listings Section */}
            <section id="results-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1.5 w-12 bg-facil-blue rounded-full"></div>
                            <span className="text-xs font-black text-facil-blue uppercase tracking-widest">Destaques da Semana</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                            Descobertas Exclusivas
                        </h2>
                    </div>
                    <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-facil-blue transition-all group">
                        Ver todo o inventário <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {listings.slice(0, 6).map((listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            onClick={handleListingClick}
                        />
                    ))}
                </div>

                {listings.length === 0 && (
                    <div className="text-center py-32 bg-slate-50 rounded-2xl border-4 border-dashed border-slate-100 mt-20">
                        <Search className="w-16 h-16 text-slate-200 mx-auto mb-8 animate-icon-bounce" />
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Nenhum resultado de elite encontrado</h3>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-lg">
                            Tente ajustar os seus filtros ou explore todas as categorias disponíveis.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-facil-dark text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-facil-blue shadow-2xl transition-all"
                        >
                            Limpar Filtros & Ver Tudo
                        </button>
                    </div>
                )}
            </section>

            {/* Residential / Category Visual Grid Section */}
            <section className="bg-[#f8fafc] py-32 border-y border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Title Section */}
                        <div className="lg:w-1/3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 block">Especialistas em</span>
                            <h2 className="text-5xl font-black text-gray-900 mb-8 tracking-tight leading-none">Residencial & <br />Corporativo</h2>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-12">
                                Curadoria de espaços seleccionados manualmente para garantir que o seu investimento em Angola seja seguro e prestigioso.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-50 group hover:shadow-xl transition-all">
                                    <div className="h-12 w-12 bg-facil-blue/10 text-facil-blue rounded-xl flex items-center justify-center font-black animate-icon-pulse">01</div>
                                    <p className="font-black text-xs uppercase tracking-widest text-slate-700">Inspecção Certificada</p>
                                </div>
                                <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-50 group hover:shadow-xl transition-all">
                                    <div className="h-12 w-12 bg-facil-blue/10 text-facil-blue rounded-xl flex items-center justify-center font-black animate-icon-bounce">02</div>
                                    <p className="font-black text-xs uppercase tracking-widest text-slate-700">Documentação Segura</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Category Grid */}
                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CategoryCard
                                title="Studio & Loft"
                                count={7}
                                image="https://images.unsplash.com/photo-1536376074432-8d63d592bfde?auto=format&fit=crop&w=800&q=80"
                            />
                            <CategoryCard
                                title="Vivendas de Luxo"
                                count={12}
                                image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                                rowSpan={2}
                            />
                            <CategoryCard
                                title="Apartamentos"
                                count={23}
                                image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                            />
                            <CategoryCard
                                title="Condomínios"
                                count={15}
                                image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const CategoryCard = ({ title, count, image, rowSpan = 1 }: { title: string, count: number, image: string, rowSpan?: number }) => (
    <div
        className={`relative overflow-hidden group cursor-pointer rounded-xl lg:rounded-2xl shadow-2xl transition-all duration-700 hover:-translate-y-2 ${rowSpan > 1 ? 'md:row-span-2 min-h-[500px]' : 'h-[280px]'}`}
    >
        <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white right-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{count} Unidades Disponíveis</span>
            <h3 className="text-3xl font-black mt-3 tracking-tight">{title}</h3>
            <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="h-px w-8 bg-facil-blue"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-facil-blue">Explorar Categoria</span>
            </div>
        </div>
    </div>
);

export default HomePage;
