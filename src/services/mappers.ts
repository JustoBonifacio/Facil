
import { Listing, User, Message } from '../shared/types';
import { Database } from '../shared/types/database.types';

type ListingRow = Database['public']['Tables']['listings']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type MessageRow = Database['public']['Tables']['messages']['Row'];

export const mapListing = (row: ListingRow): Listing => ({
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: (row.currency as 'AOA' | 'USD') || 'AOA',
    category: row.category as any,
    transactionType: row.transaction_type as any,
    status: row.status as any,
    images: row.images || [],
    location: {
        city: row.city,
        neighborhood: row.neighborhood,
        coords: [row.latitude || 0, row.longitude || 0],
    },
    views: row.views || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    features: row.features || [],
    isFeatured: row.is_featured,
    area: row.area || undefined,
    priceHistory: row.price_history as any
});

export const mapUser = (row: ProfileRow): User => ({
    id: row.id,
    name: row.name || 'Utilizador',
    email: row.email,
    phone: row.phone || undefined,
    role: (row.role as any) || 'CLIENT',
    isVerified: row.is_verified,
    avatar: row.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=1d4ed8&color=fff`,
    rating: row.rating,
    reviewCount: row.review_count,
    joinedAt: row.created_at,
    bio: row.bio || undefined,
    nif: row.nif || undefined,
    companyName: row.company_name || undefined,
    address: row.address || undefined
});

export const mapMessage = (row: MessageRow): Message => ({
    id: row.id,
    listingId: row.listing_id || '',
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    timestamp: row.created_at,
    isRead: row.is_read
});
