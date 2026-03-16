
import { useCallback, useMemo } from 'react';
import { useListings } from '../contexts/ListingsContext';
import { SearchFilters, ListingCategory } from '../shared/types';

export function useListingsFilter() {
    const { listings, filters, actions, isLoading } = useListings();

    const setQuery = useCallback((query: string) => {
        actions.setFilters({ ...filters, query });
    }, [actions, filters]);

    const updateFilters = useCallback((newFilters: SearchFilters) => {
        actions.setFilters({ ...filters, ...newFilters });
    }, [actions, filters]);

    const setCategory = useCallback((category: ListingCategory | undefined) => {
        actions.setFilters({ ...filters, category });
    }, [actions, filters]);

    const clearFilters = useCallback(() => {
        actions.setFilters({});
    }, [actions]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        Object.values(filters).forEach(val => {
            if (val !== undefined && val !== '') count++;
        });
        return count;
    }, [filters]);

    return {
        listings,
        filters,
        isLoading,
        setQuery,
        setCategory,
        updateFilters,
        clearFilters,
        activeFiltersCount,
        totalCount: listings.length, // Isto pode precisar de ajuste se for necessário o total real sem filtros
        filteredCount: listings.length,
    };
}
