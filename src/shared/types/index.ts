
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
    favorites?: string[]; // IDs dos anúncios favoritos
    lists?: UserList[];   // Listas personalizadas
    alertSettings?: {
        newListing: boolean;
        priceDrop: boolean;
        expiringSoon: boolean;
    };
    responseTime?: string; // Ex: "Responde em 5 min"
    preferredContact?: 'WHATSAPP' | 'PHONE' | 'EMAIL';
    locationCoords?: [number, number];
    comparisonList?: string[]; // IDs for side-by-side comparison
}

export interface UserList {
    id: string;
    userId: string;
    name: string;
    description?: string;
    listings: string[]; // IDs dos anúncios
    createdAt: string;
}

export interface Favorite {
    id: string;
    userId: string;
    listingId: string;
    createdAt: string;
}

export interface SearchAlert {
    id: string;
    userId: string;
    title: string;
    filters: SearchFilters;
    isActive: boolean;
    lastRunAt?: string;
    createdAt: string;
}

export interface Appointment {
    id: string;
    clientId: string;
    ownerId: string;
    listingId: string;
    date: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    notes?: string;
    createdAt: string;
}

export interface UserDocument {
    id: string;
    userId: string;
    type: 'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS' | 'OTHER';
    url: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    verifiedAt?: string;
    rejectionReason?: string;
    createdAt: string;
}

export interface ViewHistory {
    id: string;
    userId: string;
    listingId: string;
    viewedAt: string;
}

export interface SearchHistory {
    id: string;
    userId: string;
    query: string;
    filters: SearchFilters;
    createdAt: string;
}

export interface PriceTrend {
    city: string;
    neighborhood: string;
    category: ListingCategory;
    averagePrice: number;
    count: number;
    month: string; // 'YYYY-MM'
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
    area?: number; // m2
    priceHistory?: { price: number; date: string }[];
}

export interface Review {
    id: string;
    reviewerId: string; // ID of the user who wrote the review
    reviewedUserId: string; // ID of the user being reviewed (e.g., the listing owner)
    listingId?: string; // Optional: if the review is specific to a listing
    rating: number; // e.g., 1 to 5 stars
    comment: string;
    createdAt: string;
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
    // Novos filtros solicitados
    typology?: string; // T1, T2, T3...
    minArea?: number;
    maxArea?: number;
    condition?: 'NEW' | 'USED' | 'RENOVATED';
    isFurnished?: boolean;
    radius?: number; // Raio em KM para busca por mapa
    brand?: string; // Para carros
    model?: string; // Para carros
    year?: number; // Para carros
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
