
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
  PAUSED = 'PAUSED'
}

export enum TransactionType {
  RENT = 'RENT',
  BUY = 'BUY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar: string;
  rating: number;
  reviewCount: number;
  joinedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  currency: 'AOA';
  category: ListingCategory;
  transactionType: TransactionType;
  status: ListingStatus;
  images: string[];
  location: {
    city: string;
    neighborhood: string;
    coords: [number, number];
  };
  views: number;
  createdAt: string;
  features: string[];
}

export interface Message {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Contract {
  id: string;
  listingId: string;
  ownerId: string;
  clientId: string;
  status: 'DRAFT' | 'SIGNED' | 'COMPLETED';
  content: string;
  amount: number;
  date: string;
}
