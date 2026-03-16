
import { supabase } from '../core/services/supabase';
import { Appointment } from '../shared/types';
import { USE_MOCK } from './config';

export const appointmentsService = {
    async getByUser(userId: string): Promise<Appointment[]> {
        if (USE_MOCK) return [];
        const { data, error } = await supabase.from('appointments')
            .select('*')
            .or(`clientId.eq.${userId},ownerId.eq.${userId}`);

        if (error || !data) return [];

        return (data as any[]).map(row => ({
            id: row.id,
            clientId: row.clientId,
            ownerId: row.ownerId,
            listingId: row.listingId,
            date: row.date,
            status: row.status as any,
            notes: row.notes || undefined,
            createdAt: row.createdAt
        }));
    },
    async create(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
        if (USE_MOCK) throw new Error('Not implemented');
        const { data, error } = await supabase.from('appointments').insert(appointment as any).select().single();
        if (error || !data) throw error || new Error('Failed to create appointment');
        return data as Appointment;
    }
};
