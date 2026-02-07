
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const GodModePage: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const [bannerUrl, setBannerUrl] = useState(state.bannerUrl);
    const [systemLogs, setSystemLogs] = useState<string[]>([]);

    useEffect(() => {
        // Simulated system logs
        const logs = [
            '🟢 FACIL Core Engine v2.0.1 initialized',
            '🔐 Security module: Active',
            '📊 Analytics engine: Connected',
            '🌐 API Gateway: Healthy',
            `👥 Active users: ${state.users.length}`,
            `📋 Active listings: ${state.listings.length}`,
            `💬 Total messages: ${state.messages.length}`,
        ];
        setSystemLogs(logs);
    }, [state.users.length, state.listings.length, state.messages.length]);

    const handleBannerUpdate = () => {
        dispatch({ type: 'SET_BANNER', payload: bannerUrl });
        addLog(`🖼️ Banner updated: ${bannerUrl.substring(0, 50)}...`);
    };

    const addLog = (message: string) => {
        setSystemLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    };

    const handleClearCache = () => {
        localStorage.clear();
        addLog('🗑️ Local storage cleared');
    };

    const handleResetData = () => {
        addLog('⚠️ Data reset initiated (simulation only)');
    };

    const handleExportLogs = () => {
        const logsText = systemLogs.join('\n');
        const blob = new Blob([logsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facil_logs_${Date.now()}.txt`;
        a.click();
        addLog('📥 Logs exported');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">
            {/* Header */}
            <header className="border-b border-cyan-900/30 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            FACIL://GOD_MODE
                        </span>
                        <span className="ml-3 px-2 py-0.5 bg-red-600/20 text-red-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-red-600/30">
                            Admin Only
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                    >
                        ← Exit God Mode
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Status */}
                <div className="lg:col-span-2 bg-[#12121a] rounded-2xl border border-cyan-900/30 p-6">
                    <h2 className="text-cyan-400 text-lg font-bold mb-4 flex items-center">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                        System Console
                    </h2>
                    <div className="bg-black/50 rounded-xl p-4 h-80 overflow-y-auto text-xs font-mono space-y-1">
                        {systemLogs.map((log, i) => (
                            <div key={i} className="text-gray-300">
                                <span className="text-cyan-600">[{i.toString().padStart(3, '0')}]</span> {log}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => addLog('💓 System heartbeat: OK')}
                            className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition border border-emerald-600/30"
                        >
                            Heartbeat Check
                        </button>
                        <button
                            onClick={handleExportLogs}
                            className="px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-600/30 transition border border-cyan-600/30"
                        >
                            Export Logs
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <div className="bg-[#12121a] rounded-2xl border border-cyan-900/30 p-6">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Users</span>
                                <span className="text-2xl font-bold text-cyan-400">{state.users.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Listings</span>
                                <span className="text-2xl font-bold text-emerald-400">{state.listings.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Messages</span>
                                <span className="text-2xl font-bold text-purple-400">{state.messages.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Verified Users</span>
                                <span className="text-2xl font-bold text-amber-400">
                                    {state.users.filter(u => u.isVerified).length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Control */}
                <div className="bg-[#12121a] rounded-2xl border border-cyan-900/30 p-6">
                    <h3 className="text-cyan-400 text-sm font-bold mb-4">Banner Control</h3>
                    <input
                        type="text"
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        className="w-full p-3 bg-black/50 rounded-xl text-xs text-gray-300 border border-cyan-900/30 outline-none focus:border-cyan-500"
                        placeholder="Banner URL..."
                    />
                    <button
                        onClick={handleBannerUpdate}
                        className="w-full mt-3 py-3 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-500 transition"
                    >
                        Update Banner
                    </button>
                    <div className="mt-4 rounded-xl overflow-hidden border border-cyan-900/30">
                        <img src={bannerUrl} alt="Preview" className="w-full h-32 object-cover" />
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="lg:col-span-2 bg-[#12121a] rounded-2xl border border-red-900/30 p-6">
                    <h3 className="text-red-400 text-sm font-bold mb-4 flex items-center">
                        ⚠️ Danger Zone
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleClearCache}
                            className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-xl text-amber-400 text-sm font-bold hover:bg-amber-600/20 transition"
                        >
                            🗑️ Clear Local Cache
                        </button>
                        <button
                            onClick={handleResetData}
                            className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl text-red-400 text-sm font-bold hover:bg-red-600/20 transition"
                        >
                            ⚠️ Reset All Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-cyan-900/30 p-4 mt-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-600">
                    <span>FACIL Engine v2.0.1</span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        All systems operational
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default GodModePage;
