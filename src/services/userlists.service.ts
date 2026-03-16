
import { supabase } from '../core/services/supabase';
import { UserList } from '../shared/types';
import { USE_MOCK } from './config';

export const userListsService = {
    async getByUser(userId: string): Promise<UserList[]> {
        if (USE_MOCK) return [];
        const { data, error } = await supabase.from('user_lists').select('*').eq('userId', userId);
        if (error || !data) return [];
        return (data as any[]).map(row => ({
            id: row.id,
            userId: row.userId,
            name: row.name,
            description: row.description || undefined,
            listings: row.listings,
            createdAt: row.createdAt
        }));
    },
    async create(userId: string, name: string, description?: string): Promise<UserList> {
        if (USE_MOCK) throw new Error('Not implemented');
        const { data, error } = await supabase.from('user_lists').insert({ userId, name, description } as any).select().single();
        if (error) throw error;
        return data as UserList;
    },
    async addToList(listId: string, listingId: string): Promise<void> {
        if (USE_MOCK) return;
        const { data: list } = await supabase.from('user_lists').select('listings').eq('id', listId).single();
        if (!list) return;
        const newListings = [...((list as any).listings || []), listingId];
        await supabase.from('user_lists').update({ listings: newListings } as any).eq('id', listId);
    }
};
