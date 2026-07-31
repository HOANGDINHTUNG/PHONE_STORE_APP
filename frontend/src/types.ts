export interface User {
  name: string;
  phone: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price?: string;
  newPrice?: string;
  oldPrice?: string;
  image: string;
  category?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  specs?: Record<string, string>;
  outOfStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  active?: boolean;
  selectedStorage?: string;
  selectedColor?: string;
}
