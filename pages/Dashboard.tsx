
import React from 'react';
import { User, Listing } from '../types';

interface DashboardProps {
    user: User;
    listings: Listing[];
    onListingAction: (id: string, action: string) => void;
    onUpdateListing: (listing: Listing) => void;
    onNavigateToListing: (id: string) => void;
    onNavigateMessages: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    user,
    listings,
    onListingAction,
    onUpdateListing,
    onNavigateToListing,
    onNavigateMessages
}) => {
    const userListings = listings.filter(l => l.ownerId === user.id);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">O Meu Painel</h1>
                    <p className="text-gray-500 mt-1">Bem-vindo, {user.name}. Gerencie os seus anúncios e mensagens.</p>
                </div>
                <button
                    onClick={() => { }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition"
                >
                    + Novo Anúncio
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 italic">
                        <div className="flex items-center space-x-4 mb-4">
                            <img src={user.avatar} className="h-16 w-16 rounded-full border-2 border-blue-500" alt="" />
                            <div>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs text-blue-600 font-bold uppercase">{user.role}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Rating</span>
                                <span className="font-bold text-blue-700">{user.rating} ★</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm font-medium">Anúncios Ativos</span>
                                <span className="font-bold text-blue-700">{userListings.length}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onNavigateMessages}
                        className="w-full flex items-center justify-between p-6 bg-blue-600 text-white rounded-3xl shadow-xl hover:bg-blue-700 transition group"
                    >
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">✉️</span>
                            <span className="font-bold">Ver Mensagens</span>
                        </div>
                        <span className="group-hover:translate-x-1 transition">→</span>
                    </button>
                </div>

                {/* Listings Table */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Os Meus Anúncios</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Anúncio</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Visualizações</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {userListings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img src={listing.images[0]} className="h-12 w-16 object-cover rounded-lg mr-4" alt="" />
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{listing.title}</p>
                                                        <p className="text-xs text-gray-400">{listing.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {listing.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {listing.price.toLocaleString()} AOA
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {listing.views}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button onClick={() => onNavigateToListing(listing.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">🔍</button>
                                                    <button onClick={() => onListingAction(listing.id, 'delete')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {userListings.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-gray-400 italic">Ainda não publicou nenhum anúncio.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
