
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, UserList, UserDocument, SearchHistory, SearchAlert } from '../shared/types';
import { appointmentsService, userListsService } from '../services';
import { useAuth } from './AuthContext';

interface AccountContextType {
    appointments: Appointment[];
    userLists: UserList[];
    userDocuments: UserDocument[];
    searchHistory: SearchHistory[];
    searchAlerts: SearchAlert[];
    isLoading: boolean;
    actions: {
        createList: (name: string, description?: string) => Promise<void>;
        addToList: (listId: string, listingId: string) => Promise<void>;
        scheduleAppointment: (listingId: string, ownerId: string, date: string, notes?: string) => Promise<void>;
        addDocument: (doc: UserDocument) => void;
        refreshAccountData: () => Promise<void>;
    };
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [userLists, setUserLists] = useState<UserList[]>([]);
    const [userDocuments, setUserDocuments] = useState<UserDocument[]>(
        JSON.parse(localStorage.getItem('facil_docs') || '[]')
    );
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
    const [searchAlerts, setSearchAlerts] = useState<SearchAlert[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshAccountData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const [appts, lists] = await Promise.all([
                appointmentsService.getByUser(user.id),
                userListsService.getByUser(user.id)
            ]);
            setAppointments(appts);
            setUserLists(lists);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshAccountData();
    }, [user?.id]);

    const createList = async (name: string, description?: string) => {
        if (!user) return;
        const newList = await userListsService.create(user.id, name, description);
        setUserLists(prev => [...prev, newList]);
    };

    const addToList = async (listId: string, listingId: string) => {
        await userListsService.addToList(listId, listingId);
        setUserLists(prev => prev.map(l => 
            l.id === listId ? { ...l, listings: [...l.listings, listingId] } : l
        ));
    };

    const scheduleAppointment = async (listingId: string, ownerId: string, date: string, notes?: string) => {
        if (!user) return;
        const appt = await appointmentsService.create({
            clientId: user.id,
            ownerId,
            listingId,
            date,
            status: 'PENDING',
            notes
        });
        setAppointments(prev => [...prev, appt]);
    };

    const addDocument = (doc: UserDocument) => {
        const newDocs = [doc, ...userDocuments];
        setUserDocuments(newDocs);
        localStorage.setItem('facil_docs', JSON.stringify(newDocs));
    };

    const value = {
        appointments,
        userLists,
        userDocuments,
        searchHistory,
        searchAlerts,
        isLoading,
        actions: { createList, addToList, scheduleAppointment, addDocument, refreshAccountData }
    };

    return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) throw new Error('useAccount must be used within AccountProvider');
    return context;
};
