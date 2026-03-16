
import { supabase } from './supabase';
import { Message } from '../shared/types';
import { USE_MOCK, SIMULATED_DELAY, delay } from './config';
import { mapMessage } from './mappers';

export const messagesService = {
    async getByUser(userId: string): Promise<Message[]> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return [];
        }

        const { data, error } = await supabase.from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error || !data) {
            if (error) console.warn('Supabase error fetching messages:', error);
            return [];
        }

        return (data as any[]).map(row => mapMessage(row as any));
    },

    async send(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return {
                ...message,
                id: `m_${Date.now()}`,
                timestamp: new Date().toISOString(),
            } as Message;
        }

        const { data, error } = await supabase.from('messages').insert({
            listing_id: message.listingId === '' ? null : message.listingId,
            sender_id: message.senderId,
            receiver_id: message.receiverId,
            content: message.content
        }).select().single();

        if (error || !data) throw error || new Error('Failed to send message');

        return mapMessage(data as any);
    }
};
