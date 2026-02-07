
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Listing, Message, Notification, UserRole, ListingStatus } from '../types';
import { MOCK_USERS, MOCK_LISTINGS } from '../data/mockData';

// ============ STATE TYPES ============
interface AppState {
    user: User | null;
    users: User[];
    listings: Listing[];
    messages: Message[];
    notifications: Notification[];
    bannerUrl: string;
    isLoading: boolean;
    error: string | null;
}

// ============ ACTION TYPES ============
type AppAction =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_USERS'; payload: User[] }
    | { type: 'SET_LISTINGS'; payload: Listing[] }
    | { type: 'ADD_LISTING'; payload: Listing }
    | { type: 'UPDATE_LISTING'; payload: Listing }
    | { type: 'DELETE_LISTING'; payload: string }
    | { type: 'SET_MESSAGES'; payload: Message[] }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'SET_BANNER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'HYDRATE'; payload: Partial<AppState> };

// ============ INITIAL STATE ============
const initialState: AppState = {
    user: null,
    users: MOCK_USERS,
    listings: MOCK_LISTINGS,
    messages: [],
    notifications: [],
    bannerUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1920',
    isLoading: false,
    error: null,
};

// ============ REDUCER ============
function appReducer(state: AppState, action: AppAction): AppState {
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
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                ),
            };
        case 'UPDATE_USER':
            const updatedUsers = state.users.map(u => u.id === action.payload.id ? action.payload : u);
            const updatedCurrentUser = state.user?.id === action.payload.id ? action.payload : state.user;
            return { ...state, users: updatedUsers, user: updatedCurrentUser };
        case 'SET_BANNER':
            return { ...state, bannerUrl: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'HYDRATE':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

// ============ CONTEXT ============
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    actions: {
        login: (role: UserRole) => void;
        logout: () => void;
        addListing: (listing: Listing) => void;
        updateListing: (listing: Listing) => void;
        deleteListing: (id: string) => void;
        sendMessage: (listingId: string, receiverId: string, content: string) => void;
        verifyUser: (userId: string) => void;
        moderateListing: (listingId: string, status: ListingStatus) => void;
    };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============ PROVIDER ============
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('facil_user');
        const savedMessages = localStorage.getItem('facil_messages');
        const savedBanner = localStorage.getItem('facil_banner');

        const hydration: Partial<AppState> = {};

        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            const syncedUser = state.users.find(u => u.id === parsedUser.id) || parsedUser;
            hydration.user = syncedUser;
        }
        if (savedMessages) {
            hydration.messages = JSON.parse(savedMessages);
        }
        if (savedBanner) {
            hydration.bannerUrl = savedBanner;
        }

        if (Object.keys(hydration).length > 0) {
            dispatch({ type: 'HYDRATE', payload: hydration });
        }
    }, []);

    // Persist messages to localStorage
    useEffect(() => {
        localStorage.setItem('facil_messages', JSON.stringify(state.messages));
    }, [state.messages]);

    // Persist banner to localStorage
    useEffect(() => {
        localStorage.setItem('facil_banner', state.bannerUrl);
    }, [state.bannerUrl]);

    // ============ ACTIONS ============
    const actions = {
        login: (role: UserRole) => {
            let selectedUser: User | undefined;
            if (role === UserRole.ADMIN) {
                selectedUser = state.users.find(u => u.role === UserRole.ADMIN);
            } else if (role === UserRole.OWNER) {
                selectedUser = state.users[0];
            } else {
                selectedUser = state.users[1];
            }

            if (selectedUser) {
                dispatch({ type: 'SET_USER', payload: selectedUser });
                localStorage.setItem('facil_user', JSON.stringify(selectedUser));
            }
        },

        logout: () => {
            dispatch({ type: 'SET_USER', payload: null });
            localStorage.removeItem('facil_user');
        },

        addListing: (listing: Listing) => {
            dispatch({ type: 'ADD_LISTING', payload: listing });

            if (state.user) {
                const notification: Notification = {
                    id: Date.now().toString(),
                    userId: state.user.id,
                    title: 'Anúncio Publicado! 🚀',
                    message: `O seu anúncio "${listing.title}" já está visível para todo o país.`,
                    type: 'SUCCESS',
                    read: false,
                    createdAt: new Date().toISOString(),
                };
                dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
            }
        },

        updateListing: (listing: Listing) => {
            dispatch({ type: 'UPDATE_LISTING', payload: listing });
        },

        deleteListing: (id: string) => {
            dispatch({ type: 'DELETE_LISTING', payload: id });
        },

        sendMessage: (listingId: string, receiverId: string, content: string) => {
            if (!state.user) return;

            const newMessage: Message = {
                id: Date.now().toString(),
                listingId,
                senderId: state.user.id,
                receiverId,
                content,
                timestamp: new Date().toISOString(),
            };
            dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

            // Auto-reply simulation
            if (receiverId === 'u1') {
                setTimeout(() => {
                    const reply: Message = {
                        id: (Date.now() + 1).toString(),
                        listingId,
                        senderId: 'u1',
                        receiverId: state.user!.id,
                        content: 'Olá! Recebi a sua mensagem sobre este item. Quando gostaria de agendar uma visita?',
                        timestamp: new Date().toISOString(),
                    };
                    dispatch({ type: 'ADD_MESSAGE', payload: reply });
                }, 1500);
            }
        },

        verifyUser: (userId: string) => {
            const targetUser = state.users.find(u => u.id === userId);
            if (targetUser) {
                dispatch({ type: 'UPDATE_USER', payload: { ...targetUser, isVerified: true } });

                const notification: Notification = {
                    id: Date.now().toString(),
                    userId,
                    title: 'Identidade Verificada! ✅',
                    message: 'A sua conta foi validada com sucesso pela nossa equipa administrativa.',
                    type: 'SUCCESS',
                    read: false,
                    createdAt: new Date().toISOString(),
                };
                dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
            }
        },

        moderateListing: (listingId: string, status: ListingStatus) => {
            const listing = state.listings.find(l => l.id === listingId);
            if (listing) {
                dispatch({ type: 'UPDATE_LISTING', payload: { ...listing, status } });
            }
        },
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

export function useUser() {
    const { state } = useApp();
    return state.user;
}

export function useListings() {
    const { state } = useApp();
    return state.listings;
}
