export interface User {
  id?: number | string;
  name: string;
  phone: string;
  email: string;
  token?: string;
  role?: string;
  permissions?: string[];
  adminPortal?: boolean;
  customerCode?: string;
  avatarUrl?: string;
}

export interface ProductVariantUI {
  id: string;
  sku: string;
  name: string;
  color?: string;
  storageGb?: number;
  ramGb?: number;
  price?: string;
  newPrice?: string;
  oldPrice?: string;
  image: string;
  stock?: number;
  availableQuantity?: number;
  warehouseStocks?: Array<{
    warehouseId: string;
    warehouseName: string;
    availableQuantity: number;
  }>;
}

export interface Product {
  id: number | string;
  name: string;
  brand?: string;
  category?: string;
  badge?: string;
  badgeType?: string;
  image: string;
  price?: string;
  newPrice?: string;
  oldPrice?: string;
  gift?: string;
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  specs?: Record<string, string>;
  outOfStock?: boolean;
  slug?: string;
  description?: string;
  stock?: number;
  variants?: ProductVariantUI[];
}

export interface Category {
  id: number | string;
  name: string;
  iconName?: string;
  slug: string;
  description?: string;
}

export interface Brand {
  id: number | string;
  name: string;
  logo?: string;
  slug?: string;
}

export interface CartItem extends Product {
  quantity: number;
  active?: boolean;
  selectedStorage?: string;
  selectedColor?: string;
}
