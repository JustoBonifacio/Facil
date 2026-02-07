
import React from 'react';
import { User, Listing } from '../types';

interface GodModeProps {
    users: User[];
    listings: Listing[];
    bannerUrl: string;
    onUpdateBanner: (url: string) => void;
    onUpdateUsers: (users: User[]) => void;
    onUpdateListings: (listings: Listing[]) => void;
    onBack: () => void;
}

const GodMode: React.FC<GodModeProps> = ({
    users,
    listings,
    bannerUrl,
    onUpdateBanner,
    onUpdateUsers,
    onUpdateListings,
    onBack
}) => {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-10 font-mono">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-blue-500 mb-2">GOD MODE</h1>
                        <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold">Absolute System Control</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="border-2 border-white/20 px-8 py-3 rounded-full hover:bg-white/10 transition font-bold"
                    >
                        TERMINATE SESSION
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Banner Control */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-4">VISUAL_ENGINE</h2>
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Hero Banner URL</label>
                            <input
                                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs focus:border-blue-500 outline-none mb-6"
                                value={bannerUrl}
                                onChange={e => onUpdateBanner(e.target.value)}
                            />
                            <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                                <img src={bannerUrl} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                            </div>
                        </div>
                    </div>

                    {/* Database Control */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-4">CORE_DATABASE</h2>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                <div className="text-4xl font-black mb-2">{users.length}</div>
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8">Registered Users</div>
                                <button className="w-full py-4 border border-blue-500/30 text-blue-500 text-xs font-bold hover:bg-blue-500/10 rounded-xl transition">
                                    EXPORT_USER_METADATA.JSON
                                </button>
                            </div>

                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                <div className="text-4xl font-black mb-2">{listings.length}</div>
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8">Active Listings</div>
                                <button className="w-full py-4 border border-blue-500/30 text-blue-500 text-xs font-bold hover:bg-blue-500/10 rounded-xl transition">
                                    REINDEX_SEARCH_ENGINE
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">System Logs</h3>
                            <div className="space-y-3 text-[10px]">
                                <div className="flex gap-4">
                                    <span className="text-blue-500">[20:45:12]</span>
                                    <span className="text-white/60">KERNEL initialized successfully</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-blue-500">[20:45:15]</span>
                                    <span className="text-white/60">Connection established to LUA-DB-01</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-orange-500">[20:46:01]</span>
                                    <span className="text-white/60">High traffic detected on 'Home' cluster</span>
                                </div>
                                <div className="flex gap-4 text-green-500">
                                    <span className="">[20:47:33]</span>
                                    <span className="font-bold">ADMIN_GOD_MODE accessed by user u_admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GodMode;
