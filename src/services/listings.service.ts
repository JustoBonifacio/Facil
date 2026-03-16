
import { supabase } from './supabase';
import { Listing, SearchFilters } from '../shared/types';
import { USE_MOCK, SIMULATED_DELAY, delay, savePersistedData } from './config';
import { SYNCED_MOCK_LISTINGS, addMockListingToStorage } from './mock.state';
import { mapListing } from './mappers';

export const listingsService = {
    async getAll(filters?: SearchFilters): Promise<Listing[]> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            let results = [...SYNCED_MOCK_LISTINGS];

            if (filters?.query) {
                const q = filters.query.toLowerCase();
                results = results.filter(l =>
                    l.title.toLowerCase().includes(q) ||
                    l.description.toLowerCase().includes(q) ||
                    l.location.city.toLowerCase().includes(q)
                );
            }
            if (filters?.category) results = results.filter(l => l.category === filters.category);
            if (filters?.city) results = results.filter(l => l.location.city === filters.city);
            if (filters?.transactionType) results = results.filter(l => l.transactionType === filters.transactionType);

            return results;
        }

        let query = supabase.from('listings').select('*').eq('status', 'AVAILABLE');

        if (filters?.category) query = query.eq('category', filters.category);
        if (filters?.transactionType) query = query.eq('transaction_type', filters.transactionType);
        if (filters?.city) query = query.eq('city', filters.city);
        if (filters?.minPrice) query = query.gte('price', filters.minPrice);
        if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);

        if (filters?.query) {
            query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.warn('Supabase error:', error);
            return [];
        }
        return (data || []).map(row => mapListing(row as any));
    },

    async getById(id: string): Promise<Listing | null> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return SYNCED_MOCK_LISTINGS.find(l => l.id === id) || null;
        }

        const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
        if (error) return null;
        return mapListing(data as any);
    },

    async create(listing: Omit<Listing, 'id' | 'createdAt' | 'views'>): Promise<Listing> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const newListing = {
                ...listing,
                id: `l_${Date.now()}`,
                createdAt: new Date().toISOString(),
                views: 0,
            } as Listing;
            addMockListingToStorage(newListing);
            return newListing;
        }

        const { data, error } = await supabase.from('listings').insert({
            owner_id: listing.ownerId,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            currency: listing.currency,
            category: listing.category,
            transaction_type: listing.transactionType,
            images: listing.images,
            city: listing.location.city,
            neighborhood: listing.location.neighborhood,
            latitude: listing.location.coords[0],
            longitude: listing.location.coords[1],
            features: listing.features,
            status: listing.status,
            is_featured: listing.isFeatured,
            area: listing.area
        } as any).select().single();

        if (error) throw error;
        return mapListing(data as any);
    },

    async incrementViews(id: string): Promise<void> {
        if (USE_MOCK) return;
        await supabase.rpc('increment_views', { listing_id: id });
    },

    async update(id: string, listing: Partial<Listing>): Promise<Listing> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const index = SYNCED_MOCK_LISTINGS.findIndex(l => l.id === id);
            if (index !== -1) {
                SYNCED_MOCK_LISTINGS[index] = { ...SYNCED_MOCK_LISTINGS[index], ...listing };
                savePersistedData('facil_mock_listings', SYNCED_MOCK_LISTINGS);
                return SYNCED_MOCK_LISTINGS[index];
            }
            throw new Error('Listing not found');
        }

        const { data, error } = await supabase.from('listings').update({
            title: listing.title,
            description: listing.description,
            price: listing.price,
            status: listing.status,
            images: listing.images,
            features: listing.features,
            area: listing.area
        }).eq('id', id).select().single();

        if (error) throw error;
        return mapListing(data as any);
    }
};
