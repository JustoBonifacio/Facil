
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import { ListingStatus } from '../shared/types';
import { formatDate } from '../shared/utils/helpers';
import {
    Users, Clock, Clipboard, Search,
    Zap, Check, X, ShieldCheck,
    ChevronRight, ArrowUpRight, Filter,
    Eye
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        state, actions, activeTab, setActiveTab,
        pendingUsers, pendingListings, stats, user
    } = useAdminDashboard();

    if (!user || user.role !== 'ADMIN') return null;

    const iconMap: Record<string, React.ReactNode> = {
        Users: <Users className="w-8 h-8" />,
        Clock: <Clock className="w-8 h-8" />,
        Clipboard: <Clipboard className="w-8 h-8" />,
        Search: <Search className="w-8 h-8" />,
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-24">
            {/* Header Area Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-1.5 w-8 bg-blue-600 rounded-full"></span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Gestão Central do Ecossistema</p>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">Cerebro Admin</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/god-mode')}
                            className="bg-black text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            <Zap className="w-5 h-5 group-hover:fill-current transition-all" /> God Mode
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                {iconMap[stat.icon]}
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-400 group-hover:scale-110 transition-transform`}>
                                    {iconMap[stat.icon]}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest gap-2">
                                <ArrowUpRight className="w-3 h-3" /> Ver Detalhes
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area Area */}
                <div className="bg-white rounded-[4rem] shadow-sm border border-gray-100 overflow-hidden relative">
                    {/* Secondary Navigation Navigation */}
                    <div className="flex items-center border-b border-gray-50 p-8 md:px-12 gap-10">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`relative py-6 font-black text-xs uppercase tracking-[0.2em] transition-all group ${activeTab === 'users' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            Verificação de Utilizadores
                            {pendingUsers.length > 0 && (
                                <span className="absolute -top-1 -right-4 h-5 w-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                    {pendingUsers.length}
                                </span>
                            )}
                            {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-full shadow-lg"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`relative py-6 font-black text-xs uppercase tracking-[0.2em] transition-all group ${activeTab === 'listings' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            Controlo de Anúncios
                            {activeTab === 'listings' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-full shadow-lg"></div>}
                        </button>
                        <div className="ml-auto hidden md:flex items-center gap-4">
                            <div className="flex items-center px-6 py-3 bg-gray-50 rounded-2xl gap-3 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                                <Filter className="w-4 h-4" /> Filtros Activos
                            </div>
                        </div>
                    </div>

                    {/* Content Table Table */}
                    <div className="p-8 md:p-12">
                        {activeTab === 'users' ? (
                            <div className="space-y-4">
                                {state.users.filter(u => u.role !== 'ADMIN').map((u) => (
                                    <div key={u.id} className="group p-6 rounded-3xl border border-gray-50 hover:bg-gray-50/50 hover:border-blue-100 flex items-center justify-between transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img src={u.avatar} className="h-16 w-16 rounded-2xl border-4 border-white shadow-lg object-cover" alt="" />
                                                {u.isVerified && (
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-sm">
                                                        <ShieldCheck className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-gray-900">{u.name}</p>
                                                <p className="text-xs font-bold text-gray-400">{u.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="hidden lg:block text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nível de Acesso</p>
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${u.role === 'OWNER' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {u.role === 'OWNER' ? 'PROPRIETÁRIO' : 'CLIENTE'}
                                                </span>
                                            </div>

                                            <div className="hidden xl:block text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entrou em</p>
                                                <p className="text-sm font-black text-gray-800">{formatDate(u.joinedAt || new Date().toISOString(), 'short')}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {!u.isVerified ? (
                                                    <button
                                                        onClick={() => actions.verifyUser(u.id)}
                                                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-50 hover:bg-emerald-700 transition"
                                                    >
                                                        <Check className="w-4 h-4" /> Aprovar
                                                    </button>
                                                ) : (
                                                    <button className="flex items-center gap-2 bg-gray-100 text-gray-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                                                        Verificado
                                                    </button>
                                                )}
                                                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-600 transition shadow-sm">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {state.listings.map((listing) => {
                                    const owner = state.users.find(u => u.id === listing.ownerId);
                                    return (
                                        <div key={listing.id} className="group p-6 rounded-3xl border border-gray-50 hover:bg-gray-100/50 hover:border-blue-100 flex items-center justify-between transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <img src={listing.images[0]} className="h-20 w-32 rounded-2xl object-cover shadow-lg" alt="" />
                                                <div>
                                                    <p className="text-lg font-black text-gray-900 line-clamp-1">{listing.title}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <img src={owner?.avatar} className="h-5 w-5 rounded-full object-cover" alt="" />
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicado por {owner?.name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-12">
                                                <div className="hidden lg:block text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Actual</p>
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${listing.status === ListingStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600' :
                                                            listing.status === ListingStatus.PENDING_REVIEW ? 'bg-amber-50 text-amber-600' :
                                                                'bg-gray-100 text-gray-400'
                                                        }`}>
                                                        {listing.status === ListingStatus.AVAILABLE ? 'PUBLICADO' :
                                                            listing.status === ListingStatus.PENDING_REVIEW ? 'EM REVISÃO' : listing.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => navigate(`/listing/${listing.id}`)}
                                                        className="p-4 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-blue-600 transition"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    {listing.status === ListingStatus.PENDING_REVIEW && (
                                                        <>
                                                            <button
                                                                onClick={() => actions.moderateListing(listing.id, ListingStatus.AVAILABLE)}
                                                                className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition"
                                                            >
                                                                Liberar
                                                            </button>
                                                            <button
                                                                onClick={() => actions.moderateListing(listing.id, ListingStatus.PAUSED)}
                                                                className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition"
                                                            >
                                                                Pausar
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
