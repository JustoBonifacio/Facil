
import { MOCK_LISTINGS, MOCK_USERS } from '../data/mockData';
import { getPersistedData, savePersistedData } from './config';
import { User, Listing } from '../shared/types';

export let SYNCED_MOCK_USERS = getPersistedData<User[]>('facil_mock_users', MOCK_USERS);
export let SYNCED_MOCK_LISTINGS = getPersistedData<Listing[]>('facil_mock_listings', MOCK_LISTINGS);

export const updateMockUserInStorage = (user: User) => {
    SYNCED_MOCK_USERS = SYNCED_MOCK_USERS.map(u => u.id === user.id ? user : u);
    savePersistedData('facil_mock_users', SYNCED_MOCK_USERS);
};

export const updateMockListingInStorage = (listing: Listing) => {
    SYNCED_MOCK_LISTINGS = SYNCED_MOCK_LISTINGS.map(l => l.id === listing.id ? listing : l);
    savePersistedData('facil_mock_listings', SYNCED_MOCK_LISTINGS);
};

export const addMockListingToStorage = (listing: Listing) => {
    SYNCED_MOCK_LISTINGS = [listing, ...SYNCED_MOCK_LISTINGS];
    savePersistedData('facil_mock_listings', SYNCED_MOCK_LISTINGS);
};

export const addMockUserToStorage = (user: User) => {
    SYNCED_MOCK_USERS = [...SYNCED_MOCK_USERS, user];
    savePersistedData('facil_mock_users', SYNCED_MOCK_USERS);
};
