
import React from 'react';
import { ListingCategory } from './types';

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  [ListingCategory.HOUSE]: 'Casas',
  [ListingCategory.APARTMENT]: 'Apartamentos',
  [ListingCategory.LAND]: 'Terrenos',
  [ListingCategory.SHOP]: 'Lojas',
  [ListingCategory.WAREHOUSE]: 'Armazéns',
  [ListingCategory.CAR]: 'Carros'
};

export const CATEGORY_ICONS: Record<ListingCategory, React.ReactNode> = {
  [ListingCategory.HOUSE]: <i className="fa-solid fa-house"></i>,
  [ListingCategory.APARTMENT]: <i className="fa-solid fa-building"></i>,
  [ListingCategory.LAND]: <i className="fa-solid fa-map"></i>,
  [ListingCategory.SHOP]: <i className="fa-solid fa-shop"></i>,
  [ListingCategory.WAREHOUSE]: <i className="fa-solid fa-warehouse"></i>,
  [ListingCategory.CAR]: <i className="fa-solid fa-car"></i>
};

export const CITIES = ['Luanda', 'Benguela', 'Huambo', 'Lubango', 'Cabinda', 'Namibe', 'Soyo'];

export const CURRENCY = 'Kz';
