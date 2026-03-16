
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useListings } from '../../../contexts/ListingsContext';
import { useUsers } from '../../../contexts/UserContext';
import { ListingStatus } from '../../../shared/types';

export const useAdminDashboard = () => {
    const { user } = useAuth();
    const { listings, actions: listingActions } = useListings();
    const { users, actions: userActions } = useUsers();
    const [activeTab, setActiveTab] = useState<'users' | 'listings'>('users');

    const pendingUsers = users.filter(u => !u.isVerified && u.role !== 'ADMIN');
    const pendingListings = listings.filter(l => l.status === ListingStatus.PENDING_REVIEW);

    const stats = [
        { label: 'Total Utilizadores', value: users.length, icon: 'Users', color: 'blue' },
        { label: 'Verificações Pendentes', value: pendingUsers.length, icon: 'Clock', color: 'amber' },
        { label: 'Total Anúncios', value: listings.length, icon: 'Clipboard', color: 'emerald' },
        { label: 'Em Revisão', value: pendingListings.length, icon: 'Search', color: 'indigo' },
    ];

    return {
        state: { users, listings },
        actions: {
            verifyUser: userActions.verifyUser,
            moderateListing: listingActions.moderateListing
        },
        activeTab,
        setActiveTab,
        pendingUsers,
        pendingListings,
        stats,
        user
    };
};
