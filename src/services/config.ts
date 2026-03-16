
export const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes('YOUR_SUPABASE') ||
    import.meta.env.VITE_USE_MOCK === 'true';

export const SIMULATED_DELAY = 300;

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPersistedData = <T>(key: string, defaultData: T): T => {
    if (typeof window === 'undefined') return defaultData;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
};

export const savePersistedData = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
};
