import * as React from 'react';
import { User, Listing, Message, Notification, ListingStatus, SearchFilters, UserRole, Appointment, SearchHistory, UserList, Review, SearchAlert, UserDocument } from '../types';
import { authService, listingsService, usersService, messagesService, userListsService, appointmentsService, USE_MOCK } from '../services/api';
import { supabase } from '../lib/supabase';

// ============ STATE DEFINITION ============
interface AppState {
    user: User | null;
    users: User[]; // Cache of known users
    listings: Listing[];
    messages: Message[];
    notifications: Notification[];
    appointments: Appointment[];
    searchHistory: SearchHistory[];
    userLists: UserList[];
    searchAlerts: SearchAlert[];
    userDocuments: UserDocument[];
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
    appointments: [],
    searchHistory: [],
    userLists: [],
    searchAlerts: [],
    userDocuments: JSON.parse(localStorage.getItem('facil_docs') || '[]').length > 0
        ? JSON.parse(localStorage.getItem('facil_docs')!)
        : [
            { id: 'd1', userId: 'u1', type: 'ID_CARD', url: '#', status: 'VERIFIED', createdAt: new Date().toISOString() },
            { id: 'd2', userId: 'u1', type: 'TAX_ID', url: '#', status: 'VERIFIED', createdAt: new Date().toISOString() },
            { id: 'd3', userId: 'u1', type: 'PROOF_ADDRESS', url: '#', status: 'PENDING', createdAt: new Date().toISOString() },
        ],
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
    | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
    | { type: 'SET_SEARCH_HISTORY'; payload: SearchHistory[] }
    | { type: 'SET_USER_LISTS'; payload: UserList[] }
    | { type: 'SET_SEARCH_ALERTS'; payload: SearchAlert[] }
    | { type: 'ADD_DOCUMENT'; payload: UserDocument }
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
        case 'SET_APPOINTMENTS':
            return { ...state, appointments: action.payload };
        case 'SET_SEARCH_HISTORY':
            return { ...state, searchHistory: action.payload };
        case 'SET_USER_LISTS':
            return { ...state, userLists: action.payload };
        case 'SET_SEARCH_ALERTS':
            return { ...state, searchAlerts: action.payload };
        case 'ADD_DOCUMENT':
            return { ...state, userDocuments: [action.payload, ...state.userDocuments] };
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
        login: (email: string, password: string) => Promise<void>;
        logout: () => Promise<void>;
        register: (name: string, email: string, password: string, role: UserRole, extraData?: any) => Promise<void>;
        addListing: (listing: Listing) => Promise<void>;
        updateListing: (listing: Listing) => Promise<void>;
        deleteListing: (id: string) => Promise<void>;
        sendMessage: (listingId: string, receiverId: string, content: string) => Promise<void>;
        verifyUser: (userId: string) => void;
        moderateListing: (listingId: string, status: ListingStatus) => void;
        fetchListings: (filters?: SearchFilters) => Promise<void>;
        toggleFavorite: (listingId: string) => Promise<void>;
        createList: (name: string, description?: string) => Promise<void>;
        addToList: (listId: string, listingId: string) => Promise<void>;
        scheduleAppointment: (listingId: string, ownerId: string, date: string, notes?: string) => Promise<void>;
        recordSearch: (query: string, filters: SearchFilters) => Promise<void>;
        addDocument: (doc: UserDocument) => void;
        updateAvatar: (url: string) => void;
        markNotificationsRead: () => void;
    };
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

// ============ PROVIDER ============
export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(appReducer, initialState);

    // Initial Data Load
    React.useEffect(() => {
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

                    // Parallel load user data
                    const [msgs, lists, appts] = await Promise.all([
                        messagesService.getByUser(parsedUser.id),
                        userListsService.getByUser(parsedUser.id),
                        appointmentsService.getByUser(parsedUser.id)
                    ]);

                    dispatch({ type: 'SET_MESSAGES', payload: msgs });
                    dispatch({ type: 'SET_USER_LISTS', payload: lists });
                    dispatch({ type: 'SET_APPOINTMENTS', payload: appts });
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
        login: async (email: string, password: string) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });

                const { user } = await authService.login(email, password);

                dispatch({ type: 'SET_USER', payload: user });
                localStorage.setItem('facil_user', JSON.stringify(user));

                // Fetch User Messages
                const msgs = await messagesService.getByUser(user.id);
                dispatch({ type: 'SET_MESSAGES', payload: msgs });

            } catch (error) {
                console.error(error);
                dispatch({ type: 'SET_ERROR', payload: 'Login falhou. Verifique as suas credenciais.' });
                throw error; // Re-throw to handle in AuthPage
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

        register: async (name, email, password, role, extraData) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                await authService.register({
                    name,
                    email,
                    password,
                    role,
                    ...extraData
                });
                dispatch({
                    type: 'ADD_NOTIFICATION', payload: {
                        id: Date.now().toString(),
                        userId: 'system',
                        title: 'Conta Criada!',
                        message: 'Verifique seu email para confirmar a conta (se necessário) ou faça login.',
                        type: 'SUCCESS',
                        read: false,
                        createdAt: new Date().toISOString()
                    }
                });
            } catch (error) {
                console.error(error);
                dispatch({ type: 'SET_ERROR', payload: 'Falha no registo' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },

        updateListing: async (listing: Listing) => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const updatedListing = await listingsService.update(listing.id, listing);
                dispatch({ type: 'UPDATE_LISTING', payload: updatedListing });
                if (state.user) {
                    dispatch({
                        type: 'ADD_NOTIFICATION', payload: {
                            id: Date.now().toString(),
                            userId: state.user.id,
                            title: 'Anúncio Atualizado! ✨',
                            message: `O seu anúncio "${listing.title}" foi atualizado com sucesso.`,
                            type: 'INFO',
                            read: false,
                            createdAt: new Date().toISOString(),
                        }
                    });
                }
            } catch (error) {
                console.error(error);
                dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar anúncio' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
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
        },

        toggleFavorite: async (listingId: string) => {
            if (!state.user) return;
            try {
                const isFavorite = state.user.favorites?.includes(listingId);
                let newFavorites = [...(state.user.favorites || [])];

                if (isFavorite) {
                    newFavorites = newFavorites.filter(id => id !== listingId);
                } else {
                    newFavorites.push(listingId);
                }

                // Update server (profile)
                if (!USE_MOCK) {
                    await (supabase.from('profiles') as any).update({ favorites: newFavorites }).eq('id', state.user.id);
                }

                const updatedUser = { ...state.user, favorites: newFavorites };
                dispatch({ type: 'SET_USER', payload: updatedUser });
                localStorage.setItem('facil_user', JSON.stringify(updatedUser));

            } catch (error) {
                console.error('Favorite toggle failed', error);
            }
        },

        createList: async (name: string, description?: string) => {
            if (!state.user) return;
            try {
                const newList = await userListsService.create(state.user.id, name, description);
                dispatch({ type: 'SET_USER_LISTS', payload: [...state.userLists, newList] });
            } catch (e) { console.error(e); }
        },

        addToList: async (listId: string, listingId: string) => {
            try {
                await userListsService.addToList(listId, listingId);
                const updatedLists = state.userLists.map(l =>
                    l.id === listId ? { ...l, listings: [...l.listings, listingId] } : l
                );
                dispatch({ type: 'SET_USER_LISTS', payload: updatedLists });
            } catch (e) { console.error(e); }
        },

        scheduleAppointment: async (listingId: string, ownerId: string, date: string, notes?: string) => {
            if (!state.user) return;
            try {
                const appt = await appointmentsService.create({
                    clientId: state.user.id,
                    ownerId,
                    listingId,
                    date,
                    status: 'PENDING',
                    notes
                });
                dispatch({ type: 'SET_APPOINTMENTS', payload: [...state.appointments, appt] });
            } catch (e) { console.error(e); }
        },

        recordSearch: async (query: string, filters: SearchFilters) => {
            if (!state.user || USE_MOCK) return;
            // Background save search history
            supabase.from('search_history').insert({
                userId: state.user.id,
                query,
                filters
            } as any).then(() => {
                // Optionally update local history
            });
        },

        addDocument: (doc: UserDocument) => {
            const newDocs = [doc, ...state.userDocuments];
            dispatch({ type: 'ADD_DOCUMENT', payload: doc });
            localStorage.setItem('facil_docs', JSON.stringify(newDocs));
        },
        updateAvatar: async (url: string) => {
            if (!state.user) return;
            try {
                const updatedUser = await usersService.update(state.user.id, { avatar: url });
                dispatch({ type: 'UPDATE_USER', payload: updatedUser });
                localStorage.setItem('facil_user', JSON.stringify(updatedUser));
            } catch (e) {
                console.error('Failed to update avatar', e);
            }
        },
        markNotificationsRead: () => {
            dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
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
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
