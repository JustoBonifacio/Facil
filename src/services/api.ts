
import { Listing, User, Message, SearchFilters, PaginatedResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const SIMULATED_DELAY = 300;

// Simula delay de rede para ambiente de desenvolvimento
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ LISTINGS SERVICE ============
export const listingsService = {
    async getAll(filters?: SearchFilters): Promise<Listing[]> {
        await delay(SIMULATED_DELAY);
        // Em produção: return fetch(`${API_BASE}/listings?${params}`).then(r => r.json());
        const { MOCK_LISTINGS } = await import('../data/mockData');

        let results = [...MOCK_LISTINGS];

        if (filters?.query) {
            const q = filters.query.toLowerCase();
            results = results.filter(l =>
                l.title.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q) ||
                l.location.city.toLowerCase().includes(q)
            );
        }

        if (filters?.category) {
            results = results.filter(l => l.category === filters.category);
        }

        if (filters?.transactionType) {
            results = results.filter(l => l.transactionType === filters.transactionType);
        }

        if (filters?.minPrice) {
            results = results.filter(l => l.price >= filters.minPrice!);
        }

        if (filters?.maxPrice) {
            results = results.filter(l => l.price <= filters.maxPrice!);
        }

        if (filters?.city) {
            results = results.filter(l => l.location.city === filters.city);
        }

        return results;
    },

    async getById(id: string): Promise<Listing | null> {
        await delay(SIMULATED_DELAY);
        const { MOCK_LISTINGS } = await import('../data/mockData');
        return MOCK_LISTINGS.find(l => l.id === id) || null;
    },

    async create(listing: Omit<Listing, 'id' | 'createdAt' | 'views'>): Promise<Listing> {
        await delay(SIMULATED_DELAY);
        const newListing: Listing = {
            ...listing,
            id: `l_${Date.now()}`,
            createdAt: new Date().toISOString(),
            views: 0,
        };
        return newListing;
    },

    async update(id: string, data: Partial<Listing>): Promise<Listing> {
        await delay(SIMULATED_DELAY);
        const { MOCK_LISTINGS } = await import('../data/mockData');
        const existing = MOCK_LISTINGS.find(l => l.id === id);
        if (!existing) throw new Error('Listing not found');
        return { ...existing, ...data, updatedAt: new Date().toISOString() };
    },

    async delete(id: string): Promise<void> {
        await delay(SIMULATED_DELAY);
        // Em produção: return fetch(`${API_BASE}/listings/${id}`, { method: 'DELETE' });
    },

    async incrementViews(id: string): Promise<void> {
        await delay(100);
        // Em produção: return fetch(`${API_BASE}/listings/${id}/views`, { method: 'POST' });
    },
};

// ============ USERS SERVICE ============
export const usersService = {
    async getAll(): Promise<User[]> {
        await delay(SIMULATED_DELAY);
        const { MOCK_USERS } = await import('../data/mockData');
        return MOCK_USERS;
    },

    async getById(id: string): Promise<User | null> {
        await delay(SIMULATED_DELAY);
        const { MOCK_USERS } = await import('../data/mockData');
        return MOCK_USERS.find(u => u.id === id) || null;
    },

    async verify(id: string): Promise<User> {
        await delay(SIMULATED_DELAY);
        const { MOCK_USERS } = await import('../data/mockData');
        const user = MOCK_USERS.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        return { ...user, isVerified: true };
    },

    async update(id: string, data: Partial<User>): Promise<User> {
        await delay(SIMULATED_DELAY);
        const { MOCK_USERS } = await import('../data/mockData');
        const existing = MOCK_USERS.find(u => u.id === id);
        if (!existing) throw new Error('User not found');
        return { ...existing, ...data };
    },
};

// ============ MESSAGES SERVICE ============
export const messagesService = {
    async getByUser(userId: string): Promise<Message[]> {
        await delay(SIMULATED_DELAY);
        // Em produção: return fetch(`${API_BASE}/messages?userId=${userId}`).then(r => r.json());
        return [];
    },

    async getConversation(userId: string, otherUserId: string, listingId: string): Promise<Message[]> {
        await delay(SIMULATED_DELAY);
        return [];
    },

    async send(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
        await delay(SIMULATED_DELAY);
        return {
            ...message,
            id: `m_${Date.now()}`,
            timestamp: new Date().toISOString(),
        };
    },

    async markAsRead(messageId: string): Promise<void> {
        await delay(100);
    },
};

// ============ AUTH SERVICE ============
export const authService = {
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        await delay(SIMULATED_DELAY);
        const { MOCK_USERS } = await import('../data/mockData');
        const user = MOCK_USERS.find(u => u.email === email);
        if (!user) throw new Error('Invalid credentials');
        return { user, token: `mock_token_${Date.now()}` };
    },

    async logout(): Promise<void> {
        await delay(100);
        localStorage.removeItem('facil_user');
        localStorage.removeItem('facil_token');
    },

    async register(data: { name: string; email: string; password: string; role: string }): Promise<User> {
        await delay(SIMULATED_DELAY);
        return {
            id: `u_${Date.now()}`,
            name: data.name,
            email: data.email,
            role: data.role as any,
            isVerified: false,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1d4ed8&color=fff`,
            rating: 0,
            reviewCount: 0,
            joinedAt: new Date().toISOString(),
        };
    },

    getStoredUser(): User | null {
        const stored = localStorage.getItem('facil_user');
        return stored ? JSON.parse(stored) : null;
    },
};

// ============ ANALYTICS SERVICE ============
export const analyticsService = {
    async trackPageView(page: string): Promise<void> {
        console.log(`[Analytics] Page view: ${page}`);
    },

    async trackEvent(event: string, data?: Record<string, any>): Promise<void> {
        console.log(`[Analytics] Event: ${event}`, data);
    },
};
