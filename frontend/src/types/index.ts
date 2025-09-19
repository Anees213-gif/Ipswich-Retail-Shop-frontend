// E-commerce types for Ipswich Retail

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  brand?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  stock_count: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  in_stock: boolean;
  discount_percentage: number;
  primary_image?: {
    id: number;
    image: string;
    alt_text: string;
    is_primary: boolean;
    order: number;
  };
  images?: Array<{
    id: number;
    image: string;
    alt_text: string;
    is_primary: boolean;
    order: number;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}

export interface ProductListResponse {
  products: Product[];
  meta: PaginationMeta;
  filters: {
    categories: Category[];
    priceRange: { min: number; max: number };
  };
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  verified: boolean;
  createdAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone?: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  shipping_country: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  notes?: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

// Admin-specific types
export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  avgOrderValue: number;
  errorRate: number;
  ordersLast7Days: { date: string; orders: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager';
  isAuthenticated: boolean;
}