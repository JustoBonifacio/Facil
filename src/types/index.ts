
export enum UserRole {
    OWNER = 'OWNER',
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN'
}

export enum ListingCategory {
    HOUSE = 'HOUSE',
    APARTMENT = 'APARTMENT',
    LAND = 'LAND',
    SHOP = 'SHOP',
    WAREHOUSE = 'WAREHOUSE',
    CAR = 'CAR'
}

export enum ListingStatus {
    AVAILABLE = 'AVAILABLE',
    RENTED = 'RENTED',
    SOLD = 'SOLD',
    PAUSED = 'PAUSED',
    PENDING_REVIEW = 'PENDING_REVIEW'
}

export enum TransactionType {
    RENT = 'RENT',
    BUY = 'BUY'
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    isVerified: boolean;
    avatar: string;
    rating: number;
    reviewCount: number;
    joinedAt?: string;
    bio?: string;
    nif?: string;
    companyName?: string;
    address?: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    createdAt: string;
    link?: string;
}

export interface Location {
    city: string;
    neighborhood: string;
    coords: [number, number];
    address?: string;
}

export interface Listing {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    price: number;
    currency: 'AOA' | 'USD';
    category: ListingCategory;
    transactionType: TransactionType;
    status: ListingStatus;
    images: string[];
    location: Location;
    views: number;
    createdAt: string;
    updatedAt?: string;
    features: string[];
    isFeatured?: boolean;
}

export interface Message {
    id: string;
    listingId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    isRead?: boolean;
}

export interface Contract {
    id: string;
    listingId: string;
    ownerId: string;
    clientId: string;
    status: 'DRAFT' | 'PENDING' | 'SIGNED' | 'COMPLETED' | 'CANCELLED';
    content: string;
    amount: number;
    currency: 'AOA' | 'USD';
    date: string;
    signedAt?: string;
    terms?: string[];
}

export interface SearchFilters {
    query?: string;
    category?: ListingCategory;
    transactionType?: TransactionType;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    features?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
