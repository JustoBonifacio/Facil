
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string | null
                    email: string
                    phone: string | null
                    role: string
                    is_verified: boolean
                    avatar_url: string | null
                    rating: number
                    review_count: number
                    bio: string | null
                    nif: string | null
                    company_name: string | null
                    address: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    email: string
                    phone?: string | null
                    role?: string
                    is_verified?: boolean
                    avatar_url?: string | null
                    rating?: number
                    review_count?: number
                    bio?: string | null
                    nif?: string | null
                    company_name?: string | null
                    address?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string
                    phone?: string | null
                    role?: string
                    is_verified?: boolean
                    avatar_url?: string | null
                    rating?: number
                    review_count?: number
                    bio?: string | null
                    nif?: string | null
                    company_name?: string | null
                    address?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            listings: {
                Row: {
                    id: string
                    owner_id: string
                    title: string
                    description: string
                    price: number
                    currency: string
                    category: string
                    transaction_type: string
                    status: string
                    images: string[]
                    city: string
                    neighborhood: string
                    latitude: number | null
                    longitude: number | null
                    features: string[]
                    views: number
                    is_featured: boolean
                    area: number | null
                    price_history: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    title: string
                    description: string
                    price: number
                    currency?: string
                    category: string
                    transaction_type: string
                    status?: string
                    images?: string[]
                    city: string
                    neighborhood: string
                    latitude?: number | null
                    longitude?: number | null
                    features?: string[]
                    views?: number
                    is_featured?: boolean
                    area?: number | null
                    price_history?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    title?: string
                    description?: string
                    price?: number
                    currency?: string
                    category?: string
                    transaction_type?: string
                    status?: string
                    images?: string[]
                    city?: string
                    neighborhood?: string
                    latitude?: number | null
                    longitude?: number | null
                    features?: string[]
                    views?: number
                    is_featured?: boolean
                    area?: number | null
                    price_history?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    clientId: string
                    ownerId: string
                    listingId: string
                    date: string
                    status: string
                    notes: string | null
                    createdAt: string
                }
                Insert: {
                    id?: string
                    clientId: string
                    ownerId: string
                    listingId: string
                    date: string
                    status?: string
                    notes?: string | null
                    createdAt?: string
                }
                Update: {
                    id?: string
                    clientId?: string
                    ownerId?: string
                    listingId?: string
                    date?: string
                    status?: string
                    notes?: string | null
                    createdAt?: string
                }
            }
            user_lists: {
                Row: {
                    id: string
                    userId: string
                    name: string
                    description: string | null
                    listings: string[]
                    createdAt: string
                }
                Insert: {
                    id?: string
                    userId: string
                    name: string
                    description?: string | null
                    listings?: string[]
                    createdAt?: string
                }
                Update: {
                    id?: string
                    userId?: string
                    name?: string
                    description?: string | null
                    listings?: string[]
                    createdAt?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    listing_id: string | null
                    sender_id: string
                    receiver_id: string
                    content: string
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    listing_id?: string | null
                    sender_id: string
                    receiver_id: string
                    content: string
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    listing_id?: string | null
                    sender_id?: string
                    receiver_id?: string
                    content?: string
                    is_read?: boolean
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    message: string
                    type: string
                    is_read: boolean
                    link: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message: string
                    type?: string
                    is_read?: boolean
                    link?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string
                    type?: string
                    is_read?: boolean
                    link?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            increment_views: {
                Args: {
                    listing_id: string
                }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
