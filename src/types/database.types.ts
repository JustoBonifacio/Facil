
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
                    role: 'OWNER' | 'CLIENT' | 'ADMIN'
                    is_verified: boolean
                    avatar_url: string | null
                    rating: number
                    review_count: number
                    bio: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    email: string
                    phone?: string | null
                    role?: 'OWNER' | 'CLIENT' | 'ADMIN'
                    is_verified?: boolean
                    avatar_url?: string | null
                    rating?: number
                    review_count?: number
                    bio?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string
                    phone?: string | null
                    role?: 'OWNER' | 'CLIENT' | 'ADMIN'
                    is_verified?: boolean
                    avatar_url?: string | null
                    rating?: number
                    review_count?: number
                    bio?: string | null
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
                    category: 'HOUSE' | 'APARTMENT' | 'LAND' | 'SHOP' | 'WAREHOUSE' | 'CAR'
                    transaction_type: 'RENT' | 'BUY'
                    status: 'AVAILABLE' | 'RENTED' | 'SOLD' | 'PAUSED' | 'PENDING_REVIEW'
                    images: string[]
                    city: string
                    neighborhood: string
                    latitude: number | null
                    longitude: number | null
                    features: string[]
                    views: number
                    is_featured: boolean
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
                    category: 'HOUSE' | 'APARTMENT' | 'LAND' | 'SHOP' | 'WAREHOUSE' | 'CAR'
                    transaction_type: 'RENT' | 'BUY'
                    status?: 'AVAILABLE' | 'RENTED' | 'SOLD' | 'PAUSED' | 'PENDING_REVIEW'
                    images?: string[]
                    city: string
                    neighborhood: string
                    latitude?: number | null
                    longitude?: number | null
                    features?: string[]
                    views?: number
                    is_featured?: boolean
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
                    category?: 'HOUSE' | 'APARTMENT' | 'LAND' | 'SHOP' | 'WAREHOUSE' | 'CAR'
                    transaction_type?: 'RENT' | 'BUY'
                    status?: 'AVAILABLE' | 'RENTED' | 'SOLD' | 'PAUSED' | 'PENDING_REVIEW'
                    images?: string[]
                    city?: string
                    neighborhood?: string
                    latitude?: number | null
                    longitude?: number | null
                    features?: string[]
                    views?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
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
                    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
                    is_read: boolean
                    link: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message: string
                    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
                    is_read?: boolean
                    link?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string
                    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
                    is_read?: boolean
                    link?: string | null
                    created_at?: string
                }
            }
        }
    }
}
