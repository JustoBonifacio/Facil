
import { supabase } from '../lib/supabase';
import { Listing, User, Message, SearchFilters, UserRole } from '../types';
import { Database } from '../types/database.types';
import { MOCK_LISTINGS, MOCK_USERS } from '../data/mockData';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes('YOUR_SUPABASE') ||
    import.meta.env.VITE_USE_MOCK === 'true';

const SIMULATED_DELAY = 300;

// Helper para delay simulado no mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ MAPPERS (Database Row -> App Type) ============
const mapListing = (row: Database['public']['Tables']['listings']['Row']): Listing => ({
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: (row.currency as 'AOA' | 'USD') || 'AOA',
    category: row.category as any,
    transactionType: row.transaction_type as any,
    status: row.status as any,
    images: row.images || [],
    location: {
        city: row.city,
        neighborhood: row.neighborhood,
        coords: [row.latitude || 0, row.longitude || 0],
    },
    views: row.views || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    features: row.features || [],
    isFeatured: row.is_featured || false,
});

const mapUser = (row: Database['public']['Tables']['profiles']['Row']): User => ({
    id: row.id,
    name: row.name || 'Utilizador',
    email: row.email,
    phone: row.phone || undefined,
    role: (row.role as any) || 'CLIENT',
    isVerified: row.is_verified || false,
    avatar: row.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=1d4ed8&color=fff`,
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    joinedAt: row.created_at,
    bio: row.bio || undefined,
});

// ============ LISTINGS SERVICE ============
export const listingsService = {
    async getAll(filters?: SearchFilters): Promise<Listing[]> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            let results = [...MOCK_LISTINGS];

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

        // REAL SUPABASE IMPLEMENTATION
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
        return (data || []).map(mapListing);
    },

    async getById(id: string): Promise<Listing | null> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return MOCK_LISTINGS.find(l => l.id === id) || null;
        }

        const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
        if (error) return null;
        return mapListing(data);
    },

    async create(listing: Omit<Listing, 'id' | 'createdAt' | 'views'>): Promise<Listing> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return {
                ...listing,
                id: `l_${Date.now()}`,
                createdAt: new Date().toISOString(),
                views: 0,
            } as Listing;
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
            is_featured: listing.isFeatured
        } as any).select().single();

        if (error) throw error;
        return mapListing(data);
    },

    async incrementViews(id: string): Promise<void> {
        if (USE_MOCK) return;
        await supabase.rpc('increment_views' as any, { listing_id: id });
    }
};

// ============ USERS SERVICE ============
export const usersService = {
    async getAll(): Promise<User[]> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return MOCK_USERS;
        }

        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.warn('Supabase error fetching users:', error);
            return [];
        }
        return (data || []).map(mapUser);
    },

    async getById(id: string): Promise<User | null> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return MOCK_USERS.find(u => u.id === id) || null;
        }

        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) return null;
        return mapUser(data);
    },

    async verify(id: string): Promise<void> {
        if (USE_MOCK) return;
        await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
    }
};

// ============ MESSAGES SERVICE ============
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

        if (error) {
            console.warn('Supabase error fetching messages:', error);
            return [];
        }

        return (data || []).map(row => ({
            id: row.id,
            listingId: row.listing_id || '',
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            content: row.content,
            timestamp: row.created_at,
            isRead: row.is_read || false
        }));
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
        } as any).select().single();

        if (error) throw error;

        return {
            id: data.id,
            listingId: data.listing_id || '',
            senderId: data.sender_id,
            receiverId: data.receiver_id,
            content: data.content,
            timestamp: data.created_at,
            isRead: data.is_read || false
        };
    }
};

// ============ AUTH SERVICE ============
export const authService = {
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const user = MOCK_USERS.find(u => u.email === email);
            if (!user) {
                // Fallback user if not in mock data list (for demo flexibility)
                if (email.includes('admin')) {
                    const admin = MOCK_USERS.find(u => u.role === 'ADMIN');
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
        role: string;
        phone?: string;
        nif?: string;
        companyName?: string;
        address?: string;
    }): Promise<User> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return {
                id: `u_${Date.now()}`,
                name: data.name,
                email: data.email,
                role: data.role as any,
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
                    company_name: data.companyName, // Snake case for DB trigger
                    address: data.address
                }
            }
        });

        if (error) throw error;

        return {
            id: authData.user?.id || '',
            name: data.name,
            email: data.email,
            role: data.role as any,
            isVerified: false,
            avatar: '',
            rating: 0,
            reviewCount: 0,
            joinedAt: new Date().toISOString(),
        };
    }
};
