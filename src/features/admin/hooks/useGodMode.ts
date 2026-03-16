
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useListings } from '../../../contexts/ListingsContext';
import { useUsers } from '../../../contexts/UserContext';
import { useMessaging } from '../../../contexts/MessagingContext';

export const useGodMode = () => {
    const { user } = useAuth();
    const { listings, bannerUrl: currentBannerUrl, actions: listingActions } = useListings();
    const { users } = useUsers();
    const { conversations } = useMessaging();
    
    // Contagem total de mensagens (estimativa a partir de conversas)
    const totalMessages = conversations.reduce((acc, conv) => acc + conv.messages.length, 0);

    const [bannerUrl, setBannerUrl] = useState(currentBannerUrl || '');
    const [systemLogs, setSystemLogs] = useState<string[]>([]);

    useEffect(() => {
        const logs = [
            '🟢 FACIL Core Engine v2.0.1 initialized',
            '🔐 Security module: Active',
            '📊 Analytics engine: Connected',
            '🌐 API Gateway: Healthy',
            `👥 Active users: ${users.length}`,
            `📋 Active listings: ${listings.length}`,
            `💬 Total messages: ${totalMessages}`,
        ];
        setSystemLogs(logs);
    }, [users.length, listings.length, totalMessages]);

    const addLog = (message: string) => {
        setSystemLogs(prev => [`${new Date().toLocaleTimeString()} - ${message}`, ...prev.slice(0, 49)]);
    };

    const handleBannerUpdate = () => {
        listingActions.setBanner(bannerUrl);
        addLog(`🖼️ Banner updated: ${bannerUrl.substring(0, 30)}...`);
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
        a.download = `facil_god_logs_${Date.now()}.txt`;
        a.click();
        addLog('📥 Logs exported');
    };

    return {
        state: { user, users, listings, messages: { length: totalMessages } },
        bannerUrl, setBannerUrl,
        systemLogs, addLog,
        handleBannerUpdate,
        handleClearCache,
        handleResetData,
        handleExportLogs
    };
};
