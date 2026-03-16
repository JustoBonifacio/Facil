
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SETUP: '/setup',
  LISTING_DETAIL: '/listing/:id',
  CATEGORIES: '/categories',
  CATEGORIES_FILTER: '/categories/:category',
  CREATE_LISTING: '/create',
  DASHBOARD: '/dashboard',
  INBOX: '/inbox',
  ADMIN_DASHBOARD: '/admin',
  GOD_MODE: '/admin/god-mode',
  MAP_SEARCH: '/map-search',
};

export const getListingPath = (id: string) => `/listing/${id}`;
export const getCategoryPath = (category: string) => `/categories/${category}`;
