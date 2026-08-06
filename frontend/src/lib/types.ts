export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  primaryImageUrl: string;
  secondaryImageUrl?: string | null;
  images?: string[];
  description: string;
  status: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  colors: string[];
  sizes: string[];
  category: string;
  categorySlug: string;
  tags?: Array<{ name: string; slug: string }>;
  reviews?: Review[];
  related?: Product[];
}

export interface NavItem {
  id: number;
  label: string;
  href: string | null;
  tagSlug: string | null;
  sortOrder: number;
  children: NavItem[];
}

export interface ShopCategory {
  id: number;
  label: string;
  href: string;
  imageUrl: string;
  productCount?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  productCount?: number;
  _count?: { products: number };
}

export interface Review {
  id: number;
  authorName: string;
  authorPhoto?: string | null;
  rating: number;
  comment: string;
  product?: { name: string };
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Coupon {
  code: string;
  discountType: string;
  discountValue: number;
}
