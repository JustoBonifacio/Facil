
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Listing, SearchFilters, ListingCategory, TransactionType } from '../types';
import { useApp } from '../contexts/AppContext';

export function useListingsFilter() {
    const { state } = useApp();
    const [filters, setFilters] = useState<SearchFilters>({});
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(filters.query || '');
        }, 300);
        return () => clearTimeout(timer);
    }, [filters.query]);

    const filteredListings = useMemo(() => {
        let results = [...state.listings];

        if (debouncedQuery) {
            const q = debouncedQuery.toLowerCase();
            results = results.filter(l =>
                l.title.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q) ||
                l.location.city.toLowerCase().includes(q) ||
                l.location.neighborhood.toLowerCase().includes(q)
            );
        }

        if (filters.category) {
            results = results.filter(l => l.category === filters.category);
        }

        if (filters.transactionType) {
            results = results.filter(l => l.transactionType === filters.transactionType);
        }

        if (filters.minPrice !== undefined) {
            results = results.filter(l => l.price >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
            results = results.filter(l => l.price <= filters.maxPrice!);
        }

        if (filters.city) {
            results = results.filter(l => l.location.city === filters.city);
        }

        return results;
    }, [state.listings, debouncedQuery, filters.category, filters.transactionType, filters.minPrice, filters.maxPrice, filters.city]);

    const setQuery = useCallback((query: string) => {
        setFilters(prev => ({ ...prev, query }));
    }, []);

    const setCategory = useCallback((category: ListingCategory | undefined) => {
        setFilters(prev => ({ ...prev, category }));
    }, []);

    const setTransactionType = useCallback((transactionType: TransactionType | undefined) => {
        setFilters(prev => ({ ...prev, transactionType }));
    }, []);

    const setPriceRange = useCallback((min?: number, max?: number) => {
        setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
    }, []);

    const setCity = useCallback((city: string | undefined) => {
        setFilters(prev => ({ ...prev, city }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.query) count++;
        if (filters.category) count++;
        if (filters.transactionType) count++;
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
        if (filters.city) count++;
        return count;
    }, [filters]);

    return {
        listings: filteredListings,
        filters,
        setQuery,
        setCategory,
        setTransactionType,
        setPriceRange,
        setCity,
        clearFilters,
        activeFiltersCount,
        totalCount: state.listings.length,
        filteredCount: filteredListings.length,
    };
}
