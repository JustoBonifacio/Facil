
export const ROUTES = {
    HOME: '/',
    AUTH: '/auth',
    LISTING_DETAIL: '/listing/:id',
    CATEGORIES: '/categories',
    CATEGORY: '/categories/:category',
    CREATE_LISTING: '/create',
    DASHBOARD: '/dashboard',
    INBOX: '/inbox',
    ADMIN: '/admin',
    GOD_MODE: '/admin/god-mode',
} as const;

export const CITIES = [
    'Luanda',
    'Benguela',
    'Huambo',
    'Lubango',
    'Cabinda',
    'Namibe',
    'Soyo',
    'Malanje',
    'Uíge',
    'Lunda Norte',
] as const;

export const CURRENCY_SYMBOL = 'Kz';
export const DEFAULT_CURRENCY = 'AOA';

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
} as const;

export const VALIDATION = {
    TITLE_MIN_LENGTH: 10,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 2000,
    MIN_PRICE: 1000,
    MAX_IMAGES: 10,
} as const;

export const STORAGE_KEYS = {
    USER: 'facil_user',
    TOKEN: 'facil_token',
    MESSAGES: 'facil_messages',
    BANNER: 'facil_banner',
    THEME: 'facil_theme',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        BASE: '/users',
        VERIFY: '/users/:id/verify',
        PROFILE: '/users/:id/profile',
    },
    LISTINGS: {
        BASE: '/listings',
        FEATURED: '/listings/featured',
        SEARCH: '/listings/search',
        BY_USER: '/users/:id/listings',
    },
    MESSAGES: {
        BASE: '/messages',
        CONVERSATION: '/messages/conversation/:id',
    },
} as const;
