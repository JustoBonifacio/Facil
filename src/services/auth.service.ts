
import { supabase } from './supabase';
import { User, UserRole } from '../shared/types';
import { USE_MOCK, SIMULATED_DELAY, delay } from './config';
import { SYNCED_MOCK_USERS, addMockUserToStorage } from './mock.state';
import { usersService } from './users.service';

export const authService = {
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const user = SYNCED_MOCK_USERS.find(u => u.email === email);
            if (!user) {
                if (email.includes('admin')) {
                    const admin = SYNCED_MOCK_USERS.find(u => u.role === UserRole.ADMIN);
                    if (admin) return { user: admin, token: 'mock_token' };
                }
                throw new Error('Invalid credentials');
            }
            return { user, token: `mock_token_${Date.now()}` };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.user) {
            const profile = await usersService.getById(data.user.id);
            if (profile) return { user: profile, token: data.session?.access_token || '' };
        }

        throw new Error('Login failed: Profile not found');
    },

    async logout(): Promise<void> {
        if (USE_MOCK) {
            localStorage.removeItem('facil_user');
            return;
        }
        await supabase.auth.signOut();
    },

    async register(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        phone?: string;
        nif?: string;
        companyName?: string;
        address?: string;
    }): Promise<User> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const newUser: User = {
                id: `u_${Date.now()}`,
                name: data.name,
                email: data.email,
                role: data.role,
                phone: data.phone,
                nif: data.nif,
                companyName: data.companyName,
                address: data.address,
                isVerified: false,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1d4ed8&color=fff`,
                rating: 0,
                reviewCount: 0,
                joinedAt: new Date().toISOString(),
            };
            addMockUserToStorage(newUser);
            return newUser;
        }

        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: data.name,
                    role: data.role,
                    phone: data.phone,
                    nif: data.nif,
                    company_name: data.companyName,
                    address: data.address
                }
            }
        });

        if (error) throw error;

        return {
            id: authData.user?.id || '',
            name: data.name,
            email: data.email,
            role: data.role,
            isVerified: false,
            avatar: '',
            rating: 0,
            reviewCount: 0,
            joinedAt: new Date().toISOString(),
        };
    }
};
