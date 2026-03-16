
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../shared/types';
import { authService, usersService } from '../services';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    actions: {
        login: (email: string, password: string) => Promise<void>;
        logout: () => Promise<void>;
        register: (name: string, email: string, password: string, role: UserRole, extraData?: any) => Promise<void>;
        updateAvatar: (url: string) => Promise<void>;
        refreshUser: () => Promise<void>;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshUser = useCallback(async () => {
        const savedUser = localStorage.getItem('facil_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                const freshUser = await usersService.getById(parsed.id);
                if (freshUser) {
                    setUser(freshUser);
                    localStorage.setItem('facil_user', JSON.stringify(freshUser));
                } else {
                    setUser(parsed);
                }
            } catch (e) {
                console.error('Failed to refresh user', e);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user } = await authService.login(email, password);
            setUser(user);
            localStorage.setItem('facil_user', JSON.stringify(user));
        } catch (err: any) {
            setError(err.message || 'Login falhou');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        localStorage.removeItem('facil_user');
    };

    const register = async (name: string, email: string, password: string, role: UserRole, extraData?: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.register({ name, email, password, role, ...extraData });
        } catch (err: any) {
            setError(err.message || 'Falha no registro');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAvatar = async (url: string) => {
        if (!user) return;
        try {
            const updated = await usersService.update(user.id, { avatar: url });
            setUser(updated);
            localStorage.setItem('facil_user', JSON.stringify(updated));
        } catch (e) {
            console.error(e);
        }
    };

    const value = {
        user,
        isLoading,
        error,
        actions: { login, logout, register, updateAvatar, refreshUser }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
