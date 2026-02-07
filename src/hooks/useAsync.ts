
import { useState, useCallback } from 'react';

interface UseAsyncState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

export function useAsync<T, Args extends any[]>(
    asyncFunction: (...args: Args) => Promise<T>
) {
    const [state, setState] = useState<UseAsyncState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: Args): Promise<T | null> => {
            setState({ data: null, isLoading: true, error: null });
            try {
                const result = await asyncFunction(...args);
                setState({ data: result, isLoading: false, error: null });
                return result;
            } catch (error) {
                setState({ data: null, isLoading: false, error: error as Error });
                return null;
            }
        },
        [asyncFunction]
    );

    return { ...state, execute };
}
