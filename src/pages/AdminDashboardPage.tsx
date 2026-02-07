
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ListingStatus } from '../types';
import { formatDate } from '../utils/helpers';

const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useApp();
    const [activeTab, setActiveTab] = useState<'users' | 'listings'>('users');

    if (!state.user || state.user.role !== 'ADMIN') {
        return null;
    }

    const pendingUsers = state.users.filter(u => !u.isVerified && u.role !== 'ADMIN');
    const pendingListings = state.listings.filter(l => l.status === ListingStatus.PENDING_REVIEW);

    const stats = [
        { label: 'Total Utilizadores', value: state.users.length, icon: '👥', color: 'blue' },
        { label: 'Verificações Pendentes', value: pendingUsers.length, icon: '⏳', color: 'amber' },
        { label: 'Total Anúncios', value: state.listings.length, icon: '📋', color: 'emerald' },
        { label: 'Em Revisão', value: pendingListings.length, icon: '🔍', color: 'purple' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Painel Administrativo</h1>
                    <p className="text-gray-500">Bem-vindo, {state.user.name}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/god-mode')}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition flex items-center gap-2"
                >
                    ⚡ God Mode
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`p-6 rounded-3xl border shadow-sm bg-white hover:shadow-md transition`}
                    >
                        <div className="text-3xl mb-3">{stat.icon}</div>
                        <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === 'users'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Verificação de Utilizadores
                    {pendingUsers.length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {pendingUsers.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === 'listings'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Moderação de Anúncios
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b font-bold text-xs uppercase tracking-wider text-gray-500">
                        <div>Utilizador</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Data de Registo</div>
                        <div className="text-right">Ações</div>
                    </div>

                    {state.users.filter(u => u.role !== 'ADMIN').map((user) => (
                        <div
                            key={user.id}
                            className="grid grid-cols-5 gap-4 p-4 border-b border-gray-50 items-center hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center">
                                <img src={user.avatar} alt="" className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-bold text-gray-900">{user.name}</p>
                                    {user.isVerified && (
                                        <span className="text-[10px] text-blue-600 font-bold">✅ Verificado</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-gray-600 text-sm">{user.email}</div>
                            <div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'OWNER' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="text-gray-500 text-sm">
                                {user.joinedAt ? formatDate(user.joinedAt, 'short') : 'N/A'}
                            </div>
                            <div className="text-right">
                                {!user.isVerified ? (
                                    <button
                                        onClick={() => actions.verifyUser(user.id)}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition"
                                    >
                                        ✓ Verificar
                                    </button>
                                ) : (
                                    <span className="text-gray-400 text-sm">Verificado</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b font-bold text-xs uppercase tracking-wider text-gray-500">
                        <div>Anúncio</div>
                        <div>Proprietário</div>
                        <div>Categoria</div>
                        <div>Status</div>
                        <div className="text-right">Ações</div>
                    </div>

                    {state.listings.map((listing) => {
                        const owner = state.users.find(u => u.id === listing.ownerId);

                        return (
                            <div
                                key={listing.id}
                                className="grid grid-cols-5 gap-4 p-4 border-b border-gray-50 items-center hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center">
                                    <img src={listing.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover mr-3" />
                                    <p className="font-bold text-gray-900 line-clamp-1">{listing.title}</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <img src={owner?.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                                    {owner?.name}
                                </div>
                                <div>
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase text-gray-600">
                                        {listing.category}
                                    </span>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${listing.status === ListingStatus.AVAILABLE
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : listing.status === ListingStatus.PENDING_REVIEW
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {listing.status}
                                    </span>
                                </div>
                                <div className="text-right space-x-2">
                                    <button
                                        onClick={() => navigate(`/listing/${listing.id}`)}
                                        className="text-blue-600 text-sm font-medium hover:underline"
                                    >
                                        Ver
                                    </button>
                                    {listing.status === ListingStatus.PENDING_REVIEW && (
                                        <>
                                            <button
                                                onClick={() => actions.moderateListing(listing.id, ListingStatus.AVAILABLE)}
                                                className="text-emerald-600 text-sm font-medium hover:underline"
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                onClick={() => actions.moderateListing(listing.id, ListingStatus.PAUSED)}
                                                className="text-red-600 text-sm font-medium hover:underline"
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
