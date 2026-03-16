
import { supabase } from './supabase';
import { User } from '../shared/types';
import { USE_MOCK, SIMULATED_DELAY, delay, savePersistedData } from './config';
import { SYNCED_MOCK_USERS } from './mock.state';
import { mapUser } from './mappers';

export const usersService = {
    async getAll(): Promise<User[]> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return SYNCED_MOCK_USERS;
        }

        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.warn('Supabase error fetching users:', error);
            return [];
        }
        return (data || []).map(row => mapUser(row as any));
    },

    async getById(id: string): Promise<User | null> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return SYNCED_MOCK_USERS.find(u => u.id === id) || null;
        }

        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) return null;
        return mapUser(data as any);
    },

    async verify(id: string): Promise<void> {
        if (USE_MOCK) return;
        await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
    },

    async update(id: string, user: Partial<User>): Promise<User> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const index = SYNCED_MOCK_USERS.findIndex(u => u.id === id);
            if (index !== -1) {
                SYNCED_MOCK_USERS[index] = { ...SYNCED_MOCK_USERS[index], ...user };
                savePersistedData('facil_mock_users', SYNCED_MOCK_USERS);
                return SYNCED_MOCK_USERS[index];
            }
            throw new Error('User not found');
        }

        const { data, error } = await (supabase.from('profiles') as any).update({
            name: user.name,
            phone: user.phone,
            avatar_url: user.avatar,
            bio: user.bio,
            address: user.address
        }).eq('id', id).select().single();

        if (error) throw error;
        return mapUser(data as any);
    }
};
