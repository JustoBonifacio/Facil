
import React from 'react';
import { Listing, User, TransactionType } from '../types';

interface ListingDetailProps {
    listing: Listing;
    owner: User;
    currentUser: User | null;
    onBack: () => void;
    onContact: () => void;
    onAction: () => void;
}

const ListingDetail: React.FC<ListingDetailProps> = ({
    listing,
    owner,
    currentUser,
    onBack,
    onContact,
    onAction
}) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium">
                <span className="mr-2">←</span> Voltar para a pesquisa
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images and Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video relative">
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-contain"
                        />
                        {listing.images.length > 1 && (
                            <div className="absolute bottom-6 right-6 flex gap-2">
                                {listing.images.map((_, i) => (
                                    <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`}></div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-extrabold text-gray-900">{listing.title}</h1>
                            <div className="text-right">
                                <p className="text-3xl font-black text-blue-700">
                                    {listing.price.toLocaleString()} {listing.currency}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    {listing.transactionType === TransactionType.RENT ? 'Por mês' : 'Preço total'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-8 border-b pb-6">
                            <span className="mr-4 flex items-center">
                                <span className="text-blue-500 mr-2 text-xl">📍</span> {listing.location.neighborhood}, {listing.location.city}
                            </span>
                            <span className="flex items-center text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                ID: {listing.id}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {listing.description}
                                </p>
                            </section>

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
                </div>

                {/* Right Column: Sidebar / Contact */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Contactar Proprietário</h3>

                        <div className="flex items-center mb-8">
                            <div className="relative">
                                <img src={owner.avatar} alt={owner.name} className="h-16 w-16 rounded-full border-2 border-blue-100 p-1" />
                                {owner.isVerified && (
                                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 9a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm1-4a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="font-bold text-gray-900 text-lg">{owner.name}</p>
                                <p className="text-gray-500 text-sm">Rating: {owner.rating} ★ ({owner.reviewCount} reviews)</p>
                                {owner.isVerified && <p className="text-blue-600 text-[10px] font-bold uppercase tracking-tighter mt-1">Identidade Verificada</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={onContact}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all hover:shadow-blue-200"
                            >
                                Enviar Mensagem
                            </button>
                            <button
                                onClick={onAction}
                                className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all"
                            >
                                {listing.transactionType === TransactionType.RENT ? 'Propor Arrendamento' : 'Propor Compra'}
                            </button>
                        </div>

                        <p className="mt-6 text-xs text-gray-400 text-center font-medium">
                            Ao contactar, concorda com os nossos Termos de Serviço e Política de Segurança.
                        </p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                        <h4 className="text-orange-800 font-bold text-sm mb-2 uppercase tracking-wide">Dica de Segurança</h4>
                        <p className="text-orange-700 text-sm">Nunca envie pagamentos antes de ver o item pessoalmente e assinar o contrato digital na FACIL.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
