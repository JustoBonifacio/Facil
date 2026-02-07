
import React from 'react';
import { User, Listing, ListingStatus } from '../types';

interface AdminDashboardProps {
    users: User[];
    listings: Listing[];
    onVerifyUser: (userId: string) => void;
    onUpdateUser: (user: User) => void;
    onModerateListing: (id: string, status: ListingStatus) => void;
    onUpdateListing: (listing: Listing) => void;
    onDeleteListing: (id: string) => void;
    onNavigateToListing: (id: string) => void;
    onEnterGodMode: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    users,
    listings,
    onVerifyUser,
    onModerateListing,
    onNavigateToListing,
    onEnterGodMode
}) => {
    const pendingUsers = users.filter(u => !u.isVerified && u.role !== 'ADMIN');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Gestão Administrativa</h1>
                    <p className="text-gray-500">Monitorização de segurança e moderação de conteúdos.</p>
                </div>
                <button
                    onClick={onEnterGodMode}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center shadow-lg"
                >
                    <span className="mr-2">⚡</span> GOD MODE
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Verification Queue */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Fila de Verificação de ID</h2>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{pendingUsers.length} Pendentes</span>
                    </div>
                    <div className="divide-y">
                        {pendingUsers.map(user => (
                            <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center">
                                    <img src={user.avatar} className="h-12 w-12 rounded-full mr-4" alt="" />
                                    <div>
                                        <p className="font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onVerifyUser(user.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                                >
                                    Validar Documentos
                                </button>
                            </div>
                        ))}
                        {pendingUsers.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">Nenhum utilizador a aguardar verificação.</div>
                        )}
                    </div>
                </div>

                {/* Moderation Queue */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Denúncias e Moderação</h2>
                    </div>
                    <div className="divide-y">
                        {listings.slice(0, 5).map(listing => (
                            <div key={listing.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center">
                                    <div className="h-12 w-16 bg-gray-100 rounded mr-4 overflow-hidden">
                                        <img src={listing.images[0]} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{listing.title}</p>
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Estado: {listing.status}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onNavigateToListing(listing.id)}
                                        className="p-2 text-gray-400 hover:text-blue-600 border border-gray-100 rounded-lg"
                                    >
                                        👁️
                                    </button>
                                    <button
                                        onClick={() => onModerateListing(listing.id, ListingStatus.PAUSED)}
                                        className="p-2 text-orange-400 hover:text-orange-600 border border-gray-100 rounded-lg"
                                    >
                                        ⏸️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
