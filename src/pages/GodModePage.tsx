
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGodMode } from '../features/admin/hooks/useGodMode';
import {
    Zap, Terminal, ShieldAlert,
    RefreshCw, Download, Trash2,
    Layout, Database, Activity,
    Globe, Server, ChevronLeft
} from 'lucide-react';

const GodModePage: React.FC = () => {
    const navigate = useNavigate();
    const {
        state, bannerUrl, setBannerUrl,
        systemLogs, addLog, handleBannerUpdate,
        handleClearCache, handleResetData, handleExportLogs
    } = useGodMode();

    if (!state.user || state.user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-[#050508] text-[#00ff9d] font-mono selection:bg-[#00ff9d] selection:text-black">
            {/* Top Command Bar Bar */}
            <div className="border-b border-[#00ff9d]/20 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#00ff9d]/20 blur-xl group-hover:bg-[#00ff9d]/40 transition-all"></div>
                            <div className="relative flex items-center gap-3 bg-black border border-[#00ff9d]/50 px-4 py-2 rounded-lg">
                                <Zap className="w-5 h-5 animate-pulse fill-current" />
                                <span className="font-black text-sm tracking-[0.3em]">FACIL://GOD_MODE_v2</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]/50">
                                <Server className="w-3 h-3" /> NODE: LUA-01
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]/50">
                                <Globe className="w-3 h-3" /> LATENCY: 12ms
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar ao Painel
                    </button>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Console Log Log */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-black/80 rounded-3xl border border-[#00ff9d]/30 overflow-hidden shadow-2xl shadow-[#00ff9d]/5">
                        <div className="bg-[#00ff9d]/10 p-5 flex justify-between items-center border-b border-[#00ff9d]/20 px-8">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Live Kernel Feed</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleExportLogs} className="p-2 hover:bg-[#00ff9d]/20 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                                <button onClick={() => addLog('💓 Heartbeat check: UP')} className="p-2 hover:bg-[#00ff9d]/20 rounded-lg transition-colors"><Activity className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="p-8 h-[500px] overflow-y-auto space-y-2 text-xs leading-relaxed custom-scrollbar">
                            {systemLogs.map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <span className="text-[#00ff9d]/30 font-black">{new Date().toLocaleTimeString()}</span>
                                    <span className="text-[#00ff9d]/50">[{i.toString().padStart(3, '0')}]</span>
                                    <span className="text-white group-hover:text-[#00ff9d] transition-colors">{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Control Grid Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center uppercase tracking-widest text-[10px] font-black">
                        <div className="bg-blue-600/10 border border-blue-600/30 p-8 rounded-3xl hover:bg-blue-600/20 transition-all cursor-crosshair">
                            <p className="text-blue-400 mb-2">Total Listings</p>
                            <p className="text-4xl text-white">{state.listings.length}</p>
                        </div>
                        <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 p-8 rounded-3xl hover:bg-[#00ff9d]/20 transition-all cursor-crosshair">
                            <p className="text-[#00ff9d] mb-2">Total Users</p>
                            <p className="text-4xl text-white">{state.users.length}</p>
                        </div>
                        <div className="bg-purple-600/10 border border-purple-600/30 p-8 rounded-3xl hover:bg-purple-600/20 transition-all cursor-crosshair">
                            <p className="text-purple-400 mb-2">Total Messages</p>
                            <p className="text-4xl text-white">{state.messages.length}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Sidebar */}
                <div className="space-y-8">
                    {/* Visual Overrides Overrides */}
                    <div className="bg-black border border-[#00ff9d]/30 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Layout className="w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Visual Overrides</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[8px] font-black opacity-50 mb-3">GLOBAL HERO BANNER URL</label>
                                <input
                                    type="text"
                                    value={bannerUrl}
                                    onChange={(e) => setBannerUrl(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#00ff9d]/20 rounded-xl p-4 text-xs text-white outline-none focus:border-[#00ff9d] transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                onClick={handleBannerUpdate}
                                className="w-full bg-[#00ff9d] text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,157,0.5)] transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Commit Changes
                            </button>
                            <div className="aspect-video rounded-xl overflow-hidden border border-[#00ff9d]/20 bg-[#0a0a0f] flex items-center justify-center relative">
                                {bannerUrl ? (
                                    <img src={bannerUrl} className="w-full h-full object-cover opacity-50" />
                                ) : (
                                    <span className="text-[10px] font-black opacity-20">No Preview</span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Database Ops Ops */}
                    <div className="bg-red-950/20 border border-red-500/30 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8 text-red-500">
                            <ShieldAlert className="w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Critical Ops</h3>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={handleClearCache}
                                className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Purge Cache
                            </button>
                            <button
                                onClick={handleResetData}
                                className="w-full bg-red-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:border-red-500 border border-transparent transition-all flex items-center justify-center gap-2"
                            >
                                <Database className="w-4 h-4" /> Wipe Database
                            </button>
                        </div>
                    </div>

                    {/* Developer Info Info */}
                    <div className="p-8 text-center opacity-30">
                        <div className="h-px bg-[#00ff9d]/20 mb-8"></div>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em]">Facil Core Engine v2.0.1</p>
                        <p className="text-[8px] font-medium mt-2">© 2025 ALL RIGHTS RESERVED BY ZINU</p>
                    </div>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 255, 157, 0.05); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 157, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 157, 0.4); }
            `}</style>
        </div>
    );
};

export default GodModePage;
