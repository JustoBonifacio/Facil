
import React from 'react';
import { useListingDetail } from '../features/listings/hooks/useListingDetail';
import { LoadingSpinner, ChatSystem, ContractFlow } from '../components';
import { TransactionType } from '../shared/types';
import { formatPrice, formatDate } from '../shared/utils/helpers';
import {
    ArrowLeft, Heart, MapPin, Check,
    ShieldCheck, MessageSquare, FileText,
    AlertTriangle, ChevronLeft, ChevronRight,
    Star, Calendar, Ruler, BadgeCheck, Share2,
    MoreHorizontal, Printer, Eye
} from 'lucide-react';

const ListingDetailPage: React.FC = () => {
    const {
        listing, owner, activeImageIndex, setActiveImageIndex,
        isChatOpen, setIsChatOpen, isContractOpen, setIsContractOpen,
        handleContact, handleAction,
        chatMessages, state, actions, navigate
    } = useListingDetail();

    if (!listing || !owner) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner size="lg" text="A carregar anúncio de luxo..." />
            </div>
        );
    }

    const isFavorite = state.user?.favorites?.includes(listing.id);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Top Navigation Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-gray-500 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar à Pesquisa
                </button>
                <div className="flex gap-4">
                    <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-gray-400 hover:text-blue-600">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-gray-400 hover:text-blue-600">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-gray-400 hover:text-blue-600">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Premium Gallery Structure */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
                    <div className="lg:col-span-3 h-full relative group overflow-hidden rounded-xl shadow-2xl">
                        <img
                            src={listing.images[activeImageIndex]}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <button
                            onClick={() => actions.toggleFavorite(listing.id)}
                            className={`absolute top-8 right-8 p-5 rounded-xl shadow-2xl backdrop-blur-md transition-all z-20 hover:scale-110 active:scale-90 ${isFavorite
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/20 text-white hover:bg-white hover:text-rose-500 border border-white/30'
                                }`}
                        >
                            <Heart className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        <div className="absolute bottom-8 left-8 flex gap-2">
                            <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                                {listing.transactionType === TransactionType.RENT ? 'Arrendamento' : 'Venda'}
                            </div>
                            {listing.status === 'AVAILABLE' && (
                                <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                                    Disponível Agora
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:grid grid-rows-3 gap-4 h-full">
                        {listing.images.slice(1, 4).map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImageIndex(state.listings.find(l => l.id === listing.id)?.images.indexOf(img) || 0)}
                                className="h-full w-full overflow-hidden rounded-xl cursor-pointer group shadow-lg"
                            >
                                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            </div>
                        ))}
                        {listing.images.length > 4 && (
                            <button className="absolute bottom-0 right-0 m-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black shadow-xl">
                                +{listing.images.length - 4} Fotos
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Primary Information */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-facil-blue font-black text-xs uppercase tracking-[0.3em] mb-4 block">Imobiliária Premium - Angola</span>
                                <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">{listing.title}</h1>
                                <div className="flex items-center text-slate-500 font-bold text-lg mb-8">
                                    <MapPin className="w-6 h-6 text-facil-blue mr-2" />
                                    {listing.location.neighborhood}, {listing.location.city}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Valor do Imóvel</p>
                                        <p className="text-3xl font-black text-facil-blue">{formatPrice(listing.price, listing.currency)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Área Total</p>
                                        <div className="flex items-center gap-2">
                                            <div className="animate-icon-pulse">
                                                <Ruler className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-xl font-black text-slate-900">{listing.area || 'N/A'} m²</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Publicado a</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                            <p className="text-xl font-black text-slate-900">{formatDate(listing.createdAt, 'relative')}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Visitas</p>
                                        <div className="flex items-center gap-2">
                                            <div className="animate-icon-pulse">
                                                <Eye className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-xl font-black text-slate-900">{listing.views * 32}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-12 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                <span className="h-2 w-10 bg-facil-blue rounded-full"></span>
                                Descrição do Imóvel
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium whitespace-pre-line">
                                {listing.description}
                            </p>
                        </section>

                        <section className="bg-white p-12 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                                <span className="h-2 w-10 bg-emerald-500 rounded-full"></span>
                                Comodidades Exclusivas
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {listing.features.map((feature, index) => (
                                    <div key={index} className="flex items-center p-6 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-facil-blue transition-all duration-500">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-facil-blue mr-4 group-hover:rotate-12 transition-transform">
                                            <Check className="w-5 h-5 stroke-[4px]" />
                                        </div>
                                        <span className="text-slate-800 font-black text-sm group-hover:text-white transition-colors uppercase tracking-widest">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Sidebar */}
                    <div className="space-y-8">
                        {/* Owner Card Card */}
                        <div className="bg-white p-10 rounded-xl shadow-2xl border border-slate-50 sticky top-24">
                            <div className="relative mb-10 text-center">
                                <div className="inline-block relative">
                                    <img
                                        src={owner.avatar}
                                        alt={owner.name}
                                        className="h-24 w-24 rounded-xl border-4 border-white shadow-2xl object-cover p-1"
                                    />
                                    {owner.isVerified && (
                                        <span className="absolute -bottom-2 -right-2 bg-facil-blue text-white rounded-lg p-2 border-4 border-white shadow-xl animate-bounce">
                                            <BadgeCheck className="w-5 h-5" />
                                        </span>
                                    )}
                                </div>
                                <h3 className="mt-6 text-2xl font-black text-slate-900">{owner.name}</h3>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(owner.rating) ? 'fill-current' : ''}`} />)}
                                    </div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{owner.reviewCount} Reviews</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleContact}
                                    className="w-full bg-facil-blue text-white font-black py-6 rounded-xl shadow-2xl shadow-facil-blue/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1 animate-icon-bounce"
                                >
                                    <MessageSquare className="w-6 h-6" /> Negociar Direto
                                </button>
                                <button
                                    onClick={handleAction}
                                    className="w-full bg-slate-900 text-white font-black py-6 rounded-xl shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1 animate-icon-pulse"
                                >
                                    <FileText className="w-6 h-6" />
                                    {listing.transactionType === TransactionType.RENT ? 'Arrendar Agora' : 'Comprar Imóvel'}
                                </button>
                            </div>

                            <div className="mt-10 pt-10 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-gray-500 group cursor-help">
                                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                    <div>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Proteção FACIL</p>
                                        <p className="text-[10px] font-bold text-gray-400">Contrato digital e fundo de garantia ativo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Alert Alert */}
                        <div className="bg-amber-50 p-10 rounded-xl border border-amber-100 space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <AlertTriangle className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-3 text-amber-800">
                                <div className="animate-icon-bounce">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Dica de Segurança</h4>
                            </div>
                            <p className="text-amber-700 text-sm font-medium leading-relaxed">
                                A nossa equipa nunca solicita pagamentos via WhatsApp para visitas. Utilize sempre o Dashboard para garantir a sua segurança.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contract Modal */}
            {isContractOpen && state.user && listing && owner && (
                <ContractFlow
                    listing={listing}
                    client={state.user}
                    onComplete={() => {
                        setIsContractOpen(false);
                    }}
                    onCancel={() => setIsContractOpen(false)}
                />
            )}

            {/* Chat Modal */}
            {isChatOpen && state.user && listing && owner && (
                <ChatSystem
                    currentUser={state.user}
                    listing={listing}
                    owner={owner}
                    messages={chatMessages}
                    onSendMessage={(lId, rId, content) => actions.sendMessage(lId, rId, content)}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </div>
    );
};

export default ListingDetailPage;
