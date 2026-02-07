
import { User, UserRole, Listing, ListingCategory, ListingStatus, TransactionType } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'António Silva',
    email: 'antonio@email.ao',
    role: UserRole.OWNER,
    isVerified: true,
    avatar: 'https://picsum.photos/seed/u1/200',
    rating: 4.8,
    reviewCount: 12,
    joinedAt: '2023-10-15'
  },
  {
    id: 'u2',
    name: 'Maria Santos',
    email: 'maria@email.ao',
    role: UserRole.CLIENT,
    isVerified: false,
    avatar: 'https://picsum.photos/seed/u2/200',
    rating: 5.0,
    reviewCount: 3,
    joinedAt: '2024-01-20'
  },
  {
    id: 'u_admin',
    name: 'Admin Central FACIL',
    email: 'admin@facil.ao',
    role: UserRole.ADMIN,
    isVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Admin+Facil&background=1d4ed8&color=fff',
    rating: 5.0,
    reviewCount: 0,
    joinedAt: '2023-01-01'
  }
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    ownerId: 'u1',
    title: 'Moradia T3 no Talatona',
    description: 'Excelente casa moderna com quintal amplo e piscina em condomínio fechado. Pronta a entrar.',
    price: 450000,
    currency: 'AOA',
    category: ListingCategory.HOUSE,
    transactionType: TransactionType.RENT,
    status: ListingStatus.AVAILABLE,
    images: [
      'https://picsum.photos/seed/house1/800/600',
      'https://picsum.photos/seed/house2/800/600'
    ],
    location: {
      city: 'Luanda',
      neighborhood: 'Talatona',
      coords: [-8.9167, 13.1833]
    },
    views: 1240,
    createdAt: '2024-03-01T10:00:00Z',
    features: ['Piscina', 'Segurança 24h', 'AC', 'Gerador']
  },
  {
    id: 'l2',
    ownerId: 'u1',
    title: 'Toyota Hilux 2022',
    description: 'Viatura em estado imaculável. Manutenção feita na marca. 45.000km rodados.',
    price: 25000000,
    currency: 'AOA',
    category: ListingCategory.CAR,
    transactionType: TransactionType.BUY,
    status: ListingStatus.AVAILABLE,
    images: [
      'https://picsum.photos/seed/car1/800/600',
      'https://picsum.photos/seed/car2/800/600'
    ],
    location: {
      city: 'Luanda',
      neighborhood: 'Viana',
      coords: [-8.9, 13.3]
    },
    views: 3200,
    createdAt: '2024-03-05T14:30:00Z',
    features: ['Ar condicionado', '4x4', 'Diesel', 'Manual']
  },
  {
    id: 'l3',
    ownerId: 'u1',
    title: 'Apartamento T2 - Marginal de Luanda',
    description: 'Vista mar incrível. Mobilado e equipado com electrodomésticos de última geração.',
    price: 1200000,
    currency: 'AOA',
    category: ListingCategory.APARTMENT,
    transactionType: TransactionType.RENT,
    status: ListingStatus.AVAILABLE,
    images: [
      'https://picsum.photos/seed/apt1/800/600',
      'https://picsum.photos/seed/apt2/800/600'
    ],
    location: {
      city: 'Luanda',
      neighborhood: 'Ingombota',
      coords: [-8.81, 13.23]
    },
    views: 850,
    createdAt: '2024-03-10T09:15:00Z',
    features: ['Vista Mar', 'Lugar de Garagem', 'Elevador']
  }
];
