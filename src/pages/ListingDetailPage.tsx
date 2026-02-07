
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { LoadingSpinner } from '../components';
import { TransactionType, Listing, User } from '../types';
import { formatPrice, formatDate } from '../utils/helpers';

const ListingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, actions } = useApp();

    const [listing, setListing] = useState<Listing | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (id) {
            const foundListing = state.listings.find(l => l.id === id);
            if (foundListing) {
                setListing(foundListing);
                const foundOwner = state.users.find(u => u.id === foundListing.ownerId);
                setOwner(foundOwner || null);
            }
        }
    }, [id, state.listings, state.users]);

    const handleContact = () => {
        if (!state.user) {
            navigate('/auth', { state: { from: { pathname: `/listing/${id}` } } });
            return;
        }
        setIsChatOpen(true);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !listing || !owner) return;

        actions.sendMessage(listing.id, owner.id, message);
        setMessage('');
    };

    const handleAction = () => {
        if (!state.user) {
            navigate('/auth', { state: { from: { pathname: `/listing/${id}` } } });
            return;
        }
        // Open contract flow - to be implemented
        alert('Fluxo de contrato será implementado em breve!');
    };

    if (!listing || !owner) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner size="lg" text="A carregar anúncio..." />
            </div>
        );
    }

    const chatMessages = state.messages.filter(m =>
        m.listingId === listing.id &&
        state.user &&
        ((m.senderId === state.user.id && m.receiverId === owner.id) ||
            (m.senderId === owner.id && m.receiverId === state.user.id))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium transition"
            >
                <span className="mr-2">←</span> Voltar
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images and Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Image */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video relative group">
                        <img
                            src={listing.images[activeImageIndex]}
                            alt={listing.title}
                            className="w-full h-full object-contain transition-transform duration-500"
                        />

                        {/* Image Navigation */}
                        {listing.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : listing.images.length - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-white"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setActiveImageIndex(prev => prev < listing.images.length - 1 ? prev + 1 : 0)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-white"
                                >
                                    →
                                </button>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {listing.images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImageIndex(i)}
                                            className={`h-2 w-2 rounded-full transition ${i === activeImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {listing.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {listing.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition ${i === activeImageIndex ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Details Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
                                <div className="flex items-center text-gray-600">
                                    <span className="text-blue-500 mr-2">📍</span>
                                    {listing.location.neighborhood}, {listing.location.city}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-blue-700">
                                    {formatPrice(listing.price, listing.currency)}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    {listing.transactionType === TransactionType.RENT ? 'Por mês' : 'Preço total'}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 py-6 border-y border-gray-100 mb-6">
                            <div>
                                <span className="text-2xl font-bold text-gray-900">{listing.views}</span>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Visualizações</p>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-900">{formatDate(listing.createdAt, 'relative')}</span>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Publicado</p>
                            </div>
                        </div>

                        {/* Description */}
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {listing.description}
                            </p>
                        </section>

                        {/* Features */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {listing.features.map((feature, index) => (
                                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span className="text-blue-500 mr-3">✓</span>
                                        <span className="text-gray-700 font-semibold">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Contactar Proprietário</h3>

                        <div className="flex items-center mb-8">
                            <div className="relative">
                                <img src={owner.avatar} alt={owner.name} className="h-16 w-16 rounded-full border-2 border-blue-100 p-1" />
                                {owner.isVerified && (
                                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1.5 border-2 border-white">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="font-bold text-gray-900 text-lg">{owner.name}</p>
                                <p className="text-gray-500 text-sm">⭐ {owner.rating} ({owner.reviewCount} avaliações)</p>
                                {owner.isVerified && (
                                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-tighter mt-1">
                                        Identidade Verificada
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleContact}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all hover:shadow-blue-200"
                            >
                                💬 Enviar Mensagem
                            </button>
                            <button
                                onClick={handleAction}
                                className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all"
                            >
                                {listing.transactionType === TransactionType.RENT ? '📄 Propor Arrendamento' : '🤝 Propor Compra'}
                            </button>
                        </div>

                        <p className="mt-6 text-xs text-gray-400 text-center">
                            Ao contactar, concorda com os nossos Termos de Serviço.
                        </p>
                    </div>

                    {/* Security Tip */}
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                        <h4 className="text-amber-800 font-bold text-sm mb-2 uppercase tracking-wide flex items-center">
                            <span className="mr-2">⚠️</span> Dica de Segurança
                        </h4>
                        <p className="text-amber-700 text-sm">
                            Nunca envie pagamentos antes de ver o item pessoalmente e assinar o contrato digital na FACIL.
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            {isChatOpen && state.user && (
                <div className="fixed bottom-6 right-6 w-[400px] h-[500px] bg-white rounded-[32px] shadow-2xl flex flex-col z-50 border border-blue-100 overflow-hidden animate-scale-in">
                    <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <img src={owner.avatar} className="h-10 w-10 rounded-full border-2 border-white/20" alt="" />
                            <div className="ml-3">
                                <p className="font-bold text-sm">{owner.name}</p>
                                <p className="text-xs text-blue-100 truncate max-w-[180px]">Re: {listing.title}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full">✕</button>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
                        {chatMessages.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-8">Inicie a conversa...</p>
                        )}
                        {chatMessages.map(m => (
                            <div key={m.id} className={`flex ${m.senderId === state.user!.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.senderId === state.user!.id
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 rounded-bl-none border'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Mensagem..."
                            className="flex-grow bg-gray-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700">
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ListingDetailPage;
