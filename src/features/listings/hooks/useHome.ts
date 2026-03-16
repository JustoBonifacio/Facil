
import { useNavigate } from 'react-router-dom';
import { useListings } from '../../../contexts/ListingsContext';
import { useListingsFilter } from '../../../hooks';
import { SearchFilters } from '../../../shared/types';

export const useHome = () => {
    const navigate = useNavigate();
    const { bannerUrl } = useListings(); // Agora o bannerUrl está no ListingsContext
    const {
        listings,
        filters,
        updateFilters,
        clearFilters,
    } = useListingsFilter();

    const handleListingClick = (id: string) => {
        navigate(`/listing/${id}`);
    };

    const handleSearch = (searchFilters: SearchFilters) => {
        updateFilters(searchFilters);
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    };

    return {
        bannerUrl,
        listings,
        filters,
        updateFilters,
        clearFilters,
        handleListingClick,
        handleSearch
    };
};
