
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../shared/types';
import { usersService } from '../services';
import { useAuth } from './AuthContext';

interface UserContextType {
    users: User[];
    isLoading: boolean;
    actions: {
        refreshUsers: () => Promise<void>;
        verifyUser: (userId: string) => Promise<void>;
        getUserById: (id: string) => User | undefined;
    };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshUsers = async () => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            const allUsers = await usersService.getAll();
            setUsers(allUsers);
        } catch (e) {
            console.error('Failed to fetch users', e);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyUser = async (userId: string) => {
        if (currentUser?.role !== 'ADMIN') return;
        await usersService.verify(userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: true } : u));
    };

    const getUserById = (id: string) => users.find(u => u.id === id);

    useEffect(() => {
        if (currentUser?.role === 'ADMIN') {
            refreshUsers();
        }
    }, [currentUser?.role]);

    const value = {
        users,
        isLoading,
        actions: { refreshUsers, verifyUser, getUserById }
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUsers must be used within UserProvider');
    return context;
};
