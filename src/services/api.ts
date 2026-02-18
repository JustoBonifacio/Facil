
import { supabase } from '../lib/supabase';
import { Listing, User, Message, SearchFilters, UserRole, UserList, Review, Appointment, SearchHistory } from '../types';
import { Database } from '../types/database.types';
import { MOCK_LISTINGS, MOCK_USERS } from '../data/mockData';

export const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes('YOUR_SUPABASE') ||
    import.meta.env.VITE_USE_MOCK === 'true';

const SIMULATED_DELAY = 300;

// Helper para delay simulado no mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ PERSISTENCE HELPERS (For Mock Mode) ============
const getPersistedData = <T>(key: string, defaultData: T): T => {
    if (typeof window === 'undefined') return defaultData;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
};

const savePersistedData = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Mock Data from LocalStorage if available
let SYNCED_MOCK_USERS = getPersistedData('facil_mock_users', MOCK_USERS);
let SYNCED_MOCK_LISTINGS = getPersistedData('facil_mock_listings', MOCK_LISTINGS);

const updateMockUserInStorage = (user: User) => {
    SYNCED_MOCK_USERS = SYNCED_MOCK_USERS.map(u => u.id === user.id ? user : u);
    savePersistedData('facil_mock_users', SYNCED_MOCK_USERS);
};

const updateMockListingInStorage = (listing: Listing) => {
    SYNCED_MOCK_LISTINGS = SYNCED_MOCK_LISTINGS.map(l => l.id === listing.id ? listing : l);
    savePersistedData('facil_mock_listings', SYNCED_MOCK_LISTINGS);
};

const addMockListingToStorage = (listing: Listing) => {
    SYNCED_MOCK_LISTINGS = [listing, ...SYNCED_MOCK_LISTINGS];
    savePersistedData('facil_mock_listings', SYNCED_MOCK_LISTINGS);
};

// ============ MAPPERS (Database Row -> App Type) ============
const mapListing = (row: any): Listing => ({
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
    area: row.area,
    priceHistory: row.price_history
});

const mapUser = (row: any): User => ({
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
    nif: row.nif,
    companyName: row.company_name,
    address: row.address
});

// ============ LISTINGS SERVICE ============
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
            return SYNCED_MOCK_LISTINGS.find(l => l.id === id) || null;
        }

        const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
        if (error) return null;
        return mapListing(data);
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
        return mapListing(data);
    },

    async incrementViews(id: string): Promise<void> {
        if (USE_MOCK) return;
        await (supabase.rpc as any)('increment_views', { listing_id: id });
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

        const { data, error } = await (supabase.from('listings') as any).update({
            title: listing.title,
            description: listing.description,
            price: listing.price,
            status: listing.status,
            images: listing.images,
            features: listing.features,
            area: listing.area
        }).eq('id', id).select().single();

        if (error) throw error;
        return mapListing(data);
    }
};

// ============ USERS SERVICE ============
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
        return (data || []).map(mapUser);
    },

    async getById(id: string): Promise<User | null> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return SYNCED_MOCK_USERS.find(u => u.id === id) || null;
        }

        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) return null;
        return mapUser(data);
    },

    async verify(id: string): Promise<void> {
        if (USE_MOCK) return;
        await (supabase.from('profiles') as any).update({ is_verified: true }).eq('id', id);
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
        return mapUser(data);
    }
};

// ============ APPOINTMENTS SERVICE ============
export const appointmentsService = {
    async getByUser(userId: string): Promise<Appointment[]> {
        if (USE_MOCK) return [];
        const { data, error } = await (supabase.from('appointments') as any)
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
        const { data, error } = await (supabase.from('appointments') as any).insert(appointment).select().single();
        if (error || !data) throw error || new Error('Failed to create appointment');
        return data as Appointment;
    }
};

// ============ USER LISTS SERVICE ============
export const userListsService = {
    async getByUser(userId: string): Promise<UserList[]> {
        if (USE_MOCK) return [];
        const { data, error } = await (supabase.from('user_lists') as any).select('*').eq('userId', userId);
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
        const { data, error } = await (supabase.from('user_lists') as any).insert({ userId, name, description }).select().single();
        if (error) throw error;
        return data as UserList;
    },
    async addToList(listId: string, listingId: string): Promise<void> {
        if (USE_MOCK) return;
        const { data: list } = await (supabase.from('user_lists') as any).select('listings').eq('id', listId).single();
        if (!list) return;
        const newListings = [...(list.listings || []), listingId];
        await (supabase.from('user_lists') as any).update({ listings: newListings }).eq('id', listId);
    }
};

// ============ MESSAGES SERVICE ============
export const messagesService = {
    async getByUser(userId: string): Promise<Message[]> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            return [];
        }

        const { data, error } = await (supabase.from('messages') as any)
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error || !data) {
            if (error) console.warn('Supabase error fetching messages:', error);
            return [];
        }

        return (data as any[]).map(row => ({
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

        const { data, error } = await (supabase.from('messages') as any).insert({
            listing_id: message.listingId === '' ? null : message.listingId,
            sender_id: message.senderId,
            receiver_id: message.receiverId,
            content: message.content
        }).select().single();

        if (error || !data) throw error || new Error('Failed to send message');

        const row = data as any;
        return {
            id: row.id,
            listingId: row.listing_id || '',
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            content: row.content,
            timestamp: row.created_at,
            isRead: row.is_read || false
        };
    }
};

// ============ AUTH SERVICE ============
export const authService = {
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        if (USE_MOCK) {
            await delay(SIMULATED_DELAY);
            const user = SYNCED_MOCK_USERS.find(u => u.email === email);
            if (!user) {
                if (email.includes('admin')) {
                    const admin = SYNCED_MOCK_USERS.find(u => u.role === 'ADMIN');
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
            const newUser: User = {
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
            SYNCED_MOCK_USERS.push(newUser);
            savePersistedData('facil_mock_users', SYNCED_MOCK_USERS);
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
            role: data.role as any,
            isVerified: false,
            avatar: '',
            rating: 0,
            reviewCount: 0,
            joinedAt: new Date().toISOString(),
        };
    }
};
