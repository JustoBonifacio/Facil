
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Listing, Message, Notification, ListingStatus, SearchFilters, UserRole } from '../types';
import { authService, listingsService, usersService, messagesService } from '../services/api';

// ============ STATE DEFINITION ============
interface AppState {
    user: User | null;
    users: User[]; // Cache of known users
    listings: Listing[];
    messages: Message[];
    notifications: Notification[];
    bannerUrl: string;
    isLoading: boolean;
    error: string | null;
}

const initialState: AppState = {
    user: null,
    users: [],
    listings: [],
    messages: [],
    notifications: [],
    bannerUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop', // Default Luanda Skyline
    isLoading: false,
    error: null,
};

// ============ ACTIONS DEFINITION ============
type Action =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_USERS'; payload: User[] }
    | { type: 'SET_LISTINGS'; payload: Listing[] }
    | { type: 'ADD_LISTING'; payload: Listing }
    | { type: 'UPDATE_LISTING'; payload: Listing }
    | { type: 'DELETE_LISTING'; payload: string }
    | { type: 'SET_MESSAGES'; payload: Message[] }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_NOTIFICATIONS_READ' }
    | { type: 'SET_BANNER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'HYDRATE'; payload: Partial<AppState> };

// ============ REDUCER ============
function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_USERS':
            return { ...state, users: action.payload };
        case 'SET_LISTINGS':
            return { ...state, listings: action.payload };
        case 'ADD_LISTING':
            return { ...state, listings: [action.payload, ...state.listings] };
        case 'UPDATE_LISTING':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload.id ? action.payload : l),
            };
        case 'DELETE_LISTING':
            return {
                ...state,
                listings: state.listings.filter(l => l.id !== action.payload),
            };
        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [action.payload, ...state.notifications] };
        case 'MARK_NOTIFICATIONS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n => ({ ...n, read: true })),
            };
        case 'SET_BANNER':
            return { ...state, bannerUrl: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
                user: state.user && state.user.id === action.payload.id ? action.payload : state.user
            };
        case 'HYDRATE':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

// ============ CONTEXT ============
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    actions: {
        login: (role: UserRole) => Promise<void>;
        logout: () => Promise<void>;
        addListing: (listing: Listing) => Promise<void>;
        updateListing: (listing: Listing) => Promise<void>;
        deleteListing: (id: string) => Promise<void>;
        sendMessage: (listingId: string, receiverId: string, content: string) => Promise<void>;
        verifyUser: (userId: string) => void;
        moderateListing: (listingId: string, status: ListingStatus) => void;
        fetchListings: (filters?: SearchFilters) => Promise<void>;
    };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============ PROVIDER ============
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Initial Data Load
    useEffect(() => {
        const initApp = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // 1. Listings (Static load initially)
                const listings = await listingsService.getAll();
                dispatch({ type: 'SET_LISTINGS', payload: listings });

                // 2. Users (Cache)
                const users = await usersService.getAll();
                dispatch({ type: 'SET_USERS', payload: users });

                // 3. User Session (Local Storage for Mock / Persistance)
                const savedUser = localStorage.getItem('facil_user');
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    dispatch({ type: 'SET_USER', payload: parsedUser });

                    // If user exists, fetch their messages
                    try {
                        const msgs = await messagesService.getByUser(parsedUser.id);
                        dispatch({ type: 'SET_MESSAGES', payload: msgs });
                    } catch (e) { console.error('Error fetching messages', e); }
                }

            } catch (err) {
                console.error('Failed to initialize app', err);
                dispatch({ type: 'SET_ERROR', payload: 'Falha ao carregar dados iniciais' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initApp();
    }, []);

    // Actions Wrapper
    const actions = {
        login: async (role: UserRole) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });

                // Mock logic for compatibility with current UI that sends Role
                let email = '';
                if (role === 'ADMIN') email = 'admin@facil.ao';
                else if (role === 'OWNER') email = 'antonio@email.ao';
                else email = 'maria@email.ao';

                const { user } = await authService.login(email, 'password');

                dispatch({ type: 'SET_USER', payload: user });
                localStorage.setItem('facil_user', JSON.stringify(user));

                // Fetch User Messages
                const msgs = await messagesService.getByUser(user.id);
                dispatch({ type: 'SET_MESSAGES', payload: msgs });

            } catch (error) {
                console.error(error);
                dispatch({ type: 'SET_ERROR', payload: 'Login falhou' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },

        logout: async () => {
            await authService.logout();
            dispatch({ type: 'SET_USER', payload: null });
            localStorage.removeItem('facil_user');
        },

        addListing: async (listing: Listing) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                // Services expects partial, but we have full Listing object from UI form
                // We'll strip what we don't need or let service handle it (service implementation handles inserts)

                const { id, createdAt, views, ...rest } = listing;

                const newListing = await listingsService.create({
                    ownerId: rest.ownerId,
                    title: rest.title,
                    description: rest.description,
                    price: rest.price,
                    currency: 'AOA',
                    category: rest.category,
                    transactionType: rest.transactionType,
                    images: rest.images,
                    location: rest.location,
                    features: rest.features,
                    status: rest.status,
                    isFeatured: rest.isFeatured || false
                });

                dispatch({ type: 'ADD_LISTING', payload: newListing });

                if (state.user) {
                    dispatch({
                        type: 'ADD_NOTIFICATION', payload: {
                            id: Date.now().toString(),
                            userId: state.user.id,
                            title: 'Anúncio Publicado! 🚀',
                            message: `O seu anúncio "${listing.title}" já está visível para todo o país.`,
                            type: 'SUCCESS',
                            read: false,
                            createdAt: new Date().toISOString(),
                        }
                    });
                }
            } catch (error) {
                console.error(error);
                dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar anúncio' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },

        updateListing: async (listing: Listing) => {
            // Placeholder for future implementation
            dispatch({ type: 'UPDATE_LISTING', payload: listing });
        },

        deleteListing: async (id: string) => {
            // Placeholder
            dispatch({ type: 'DELETE_LISTING', payload: id });
        },

        sendMessage: async (listingId: string, receiverId: string, content: string) => {
            if (!state.user) return;

            try {
                const newMessage = await messagesService.send({
                    listingId,
                    senderId: state.user.id,
                    receiverId,
                    content,
                    isRead: false
                });

                dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

                // Mock Auto-reply logic (keep for demo)
                if (receiverId === 'u1') { // Assuming 'u1' is some owner
                    setTimeout(() => {
                        dispatch({
                            type: 'ADD_MESSAGE', payload: {
                                id: (Date.now() + 1).toString(),
                                listingId,
                                senderId: receiverId,
                                receiverId: state.user!.id,
                                content: 'Olá! Recebi a sua mensagem. (Resposta automática de demonstração)',
                                timestamp: new Date().toISOString(),
                                isRead: false
                            }
                        });
                    }, 1000);
                }

            } catch (e) {
                console.error(e);
            }
        },

        verifyUser: (userId: string) => {
            usersService.verify(userId);
            // Optimistic update
            const targetUser = state.users.find(u => u.id === userId);
            if (targetUser) {
                dispatch({ type: 'UPDATE_USER', payload: { ...targetUser, isVerified: true } });
            }
        },

        moderateListing: (listingId: string, status: ListingStatus) => {
            // Optimistic update
            const listing = state.listings.find(l => l.id === listingId);
            if (listing) {
                dispatch({ type: 'UPDATE_LISTING', payload: { ...listing, status } });
            }
        },

        fetchListings: async (filters?: SearchFilters) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const listings = await listingsService.getAll(filters);
                dispatch({ type: 'SET_LISTINGS', payload: listings });
            } catch (e) {
                console.error(e);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    };

    return (
        <AppContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </AppContext.Provider>
    );
}

// ============ HOOK ============
export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
