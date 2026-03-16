
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, SearchFilters, ListingStatus } from '../shared/types';
import { listingsService } from '../services';

interface ListingsContextType {
    listings: Listing[];
    isLoading: boolean;
    filters: SearchFilters;
    bannerUrl: string;
    actions: {
        setFilters: (filters: SearchFilters) => void;
        refreshListings: () => Promise<void>;
        addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'views'>) => Promise<Listing>;
        updateListing: (id: string, listing: Partial<Listing>) => Promise<Listing>;
        moderateListing: (id: string, status: ListingStatus) => Promise<void>;
        setBanner: (url: string) => void;
    };
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop');

    const refreshListings = async () => {
        setIsLoading(true);
        try {
            const data = await listingsService.getAll(filters);
            setListings(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshListings();
    }, [JSON.stringify(filters)]);

    const addListing = async (data: Omit<Listing, 'id' | 'createdAt' | 'views'>) => {
        const newListing = await listingsService.create(data);
        setListings(prev => [newListing, ...prev]);
        return newListing;
    };

    const updateListing = async (id: string, data: Partial<Listing>) => {
        const updated = await listingsService.update(id, data);
        setListings(prev => prev.map(l => l.id === id ? updated : l));
        return updated;
    };

    const moderateListing = async (id: string, status: ListingStatus) => {
        await listingsService.update(id, { status });
        setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    const value = {
        listings,
        isLoading,
        filters,
        bannerUrl,
        actions: { setFilters, refreshListings, addListing, updateListing, moderateListing, setBanner: setBannerUrl }
    };

    return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
};

export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) throw new Error('useListings must be used within ListingsProvider');
    return context;
};
