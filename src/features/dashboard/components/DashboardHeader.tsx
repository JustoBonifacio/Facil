
import React from 'react';
import { Plus, ShieldCheck, Home, Settings } from 'lucide-react';
import { User } from '../../../shared/types';

interface DashboardHeaderProps {
    user: User;
    stats: { label: string; value: string | number; icon: React.ReactNode }[];
    onAvatarClick: () => void;
    onCreateListing: () => void;
    onGodMode: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    user,
    stats,
    onAvatarClick,
    onCreateListing,
    onGodMode
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 bg-gradient-to-r from-facil-blue to-indigo-700 p-8 rounded-xl text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                <Home className="w-48 h-48 -mr-16 -mt-16 rotate-12" />
            </div>

            <div className="flex items-center relative z-10">
                <div className="relative group cursor-pointer" onClick={onAvatarClick}>
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-24 w-24 rounded-full border-4 border-white/30 shadow-2xl object-cover transition-all group-hover:brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-8 h-8 text-white" />
                    </div>
                    {user.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white" title="Perfil Verificado">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    )}
                </div>
                <div className="ml-6">
                    <h1 className="text-4xl font-black">{user.name}</h1>
                    <p className="text-blue-100 opacity-80 mt-1 font-medium">{user.role === 'OWNER' ? 'Proprietário Premium' : 'Cliente Verificado'}</p>
                    <div className="flex items-center mt-3 gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
                            {user.isVerified ? '✓ Documentação Validada' : '⚠ Verificação em curso'}
                        </span>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        {stats.map(stat => (
                            <div key={stat.label} className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 group hover:bg-white/20 transition-all">
                                <span className="text-[10px] font-black uppercase opacity-60 block tracking-widest">{stat.label}</span>
                                <span className="text-lg font-black">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 md:mt-0 flex gap-3 relative z-10">
                {user.role !== 'CLIENT' && (
                    <button
                        onClick={onCreateListing}
                        className="bg-white text-facil-blue px-8 py-4 rounded-xl font-black hover:bg-slate-50 transition shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Criar Anúncio
                    </button>
                )}
                <button
                    onClick={onGodMode}
                    className="bg-black/20 hover:bg-black/30 text-white p-4 rounded-xl backdrop-blur-sm transition-all hover:rotate-90"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
