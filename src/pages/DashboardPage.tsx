
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ListingCard } from '../components';
import { ListingStatus } from '../types';
import { formatDate } from '../utils/helpers';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useApp();

    if (!state.user) return null;

    const userListings = state.listings.filter(l => l.ownerId === state.user!.id);
    const userMessages = state.messages.filter(m =>
        m.receiverId === state.user!.id || m.senderId === state.user!.id
    );

    const totalViews = userListings.reduce((sum, l) => sum + l.views, 0);

    const stats = [
        { label: 'Anúncios Ativos', value: userListings.filter(l => l.status === ListingStatus.AVAILABLE).length, icon: '📋' },
        { label: 'Visualizações', value: totalViews, icon: '👁' },
        { label: 'Mensagens', value: userMessages.length, icon: '💬' },
        { label: 'Avaliação', value: state.user.rating.toFixed(1), icon: '⭐' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <div className="flex items-center mb-4 md:mb-0">
                    <img
                        src={state.user.avatar}
                        alt={state.user.name}
                        className="h-20 w-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="ml-5">
                        <h1 className="text-3xl font-extrabold text-gray-900">{state.user.name}</h1>
                        <div className="flex items-center mt-1">
                            {state.user.isVerified ? (
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    ✅ Identidade Verificada
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                    ⚠️ Verificação Pendente
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200"
                >
                    + Criar Anúncio
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="text-3xl mb-3">{stat.icon}</div>
                        <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-10">
                <button
                    onClick={() => navigate('/inbox')}
                    className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">💬</span>
                    <span className="font-bold text-gray-700">Mensagens</span>
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">📊</span>
                    <span className="font-bold text-gray-700">Estatísticas</span>
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">⚙️</span>
                    <span className="font-bold text-gray-700">Definições</span>
                </button>
            </div>

            {/* My Listings */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Os Meus Anúncios</h2>
                    <span className="text-gray-500">{userListings.length} anúncios</span>
                </div>

                {userListings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <span className="text-5xl mb-4 block">📦</span>
                        <h3 className="text-xl font-bold text-gray-800">Ainda não tem anúncios</h3>
                        <p className="text-gray-500 mb-6">Crie o seu primeiro anúncio e comece a receber contactos.</p>
                        <button
                            onClick={() => navigate('/create')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                            + Criar Primeiro Anúncio
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userListings.map((listing, index) => (
                            <div
                                key={listing.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ListingCard
                                    listing={listing}
                                    onClick={(id) => navigate(`/listing/${id}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Recent Activity */}
            {userMessages.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividade Recente</h2>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                        {userMessages.slice(0, 5).map((message, index) => {
                            const otherUserId = message.senderId === state.user!.id ? message.receiverId : message.senderId;
                            const otherUser = state.users.find(u => u.id === otherUserId);

                            return (
                                <div
                                    key={message.id}
                                    className="flex items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                                    onClick={() => navigate('/inbox')}
                                >
                                    <img
                                        src={otherUser?.avatar || ''}
                                        alt=""
                                        className="h-12 w-12 rounded-full"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <p className="font-semibold text-gray-900">{otherUser?.name}</p>
                                        <p className="text-gray-500 text-sm line-clamp-1">{message.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{formatDate(message.timestamp, 'relative')}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default DashboardPage;
