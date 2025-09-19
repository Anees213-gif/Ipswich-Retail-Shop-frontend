// API utilities with mock fallback for development
import type { Product, ProductListResponse, Category, Review, Order, ApiResponse, ApiError, DashboardStats, PaginationMeta } from '@/types';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USE_MOCK_DATA = false; // Always use real API

// CSRF token management
let csrfToken: string | null = null;

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 299.99,
    originalPrice: 399.99,
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockCount: 25,
    featured: true,
    specifications: {
      'Battery Life': '30 hours',
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Weight': '250g'
    },
    tags: ['wireless', 'noise-cancelling', 'premium']
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-t-shirt',
    description: 'Comfortable organic cotton t-shirt in various colors. Sustainably sourced and ethically made.',
    price: 39.99,
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    category: 'Apparel',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    stockCount: 50,
    featured: true,
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold'
    },
    tags: ['organic', 'sustainable', 'casual']
  },
  {
    id: '3',
    name: 'JavaScript: The Definitive Guide',
    slug: 'javascript-definitive-guide',
    description: 'The comprehensive guide to JavaScript programming. Perfect for developers of all levels.',
    price: 59.99,
    images: ['/api/placeholder/400/400'],
    category: 'Books',
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    stockCount: 15,
    featured: true,
    specifications: {
      'Pages': '1,096',
      'Publisher': 'O\'Reilly Media',
      'Edition': '7th',
      'Language': 'English'
    },
    tags: ['programming', 'javascript', 'technical']
  },
  {
    id: '4',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and long battery life.',
    price: 199.99,
    originalPrice: 249.99,
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    stockCount: 30,
    featured: false,
    specifications: {
      'Battery Life': '7 days',
      'Display': '1.4" AMOLED',
      'Water Resistance': '5ATM',
      'Connectivity': 'Bluetooth 5.0, WiFi'
    },
    tags: ['fitness', 'smartwatch', 'health']
  },
  {
    id: '5',
    name: 'Minimalist Leather Wallet',
    slug: 'minimalist-leather-wallet',
    description: 'Sleek minimalist wallet crafted from premium leather. Holds up to 8 cards.',
    price: 79.99,
    images: ['/api/placeholder/400/400'],
    category: 'Accessories',
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    stockCount: 20,
    featured: false,
    specifications: {
      'Material': 'Full-grain leather',
      'Capacity': '8 cards, cash',
      'Dimensions': '4" x 3" x 0.5"',
      'Color': 'Black, Brown'
    },
    tags: ['leather', 'minimalist', 'wallet']
  },
  {
    id: '6',
    name: 'Ceramic Coffee Mug Set',
    slug: 'ceramic-coffee-mug-set',
    description: 'Beautiful set of 4 ceramic coffee mugs. Perfect for your morning routine.',
    price: 49.99,
    images: ['/api/placeholder/400/400'],
    category: 'Home & Garden',
    rating: 4.4,
    reviewCount: 92,
    inStock: true,
    stockCount: 40,
    featured: true,
    specifications: {
      'Material': 'Ceramic',
      'Capacity': '12 oz each',
      'Set Size': '4 mugs',
      'Dishwasher Safe': 'Yes'
    },
    tags: ['ceramic', 'coffee', 'kitchen']
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', productCount: 15 },
  { id: '2', name: 'Apparel', slug: 'apparel', productCount: 23 },
  { id: '3', name: 'Books', slug: 'books', productCount: 8 },
  { id: '4', name: 'Accessories', slug: 'accessories', productCount: 12 },
  { id: '5', name: 'Home & Garden', slug: 'home-garden', productCount: 18 }
];

// Mock admin data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { product: mockProducts[0], quantity: 1 },
      { product: mockProducts[1], quantity: 2 }
    ],
    subtotal: 379.97,
    shipping: 0,
    tax: 30.40,
    total: 410.37,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      address1: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'US'
    },
    status: 'shipped',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    items: [{ product: mockProducts[2], quantity: 1 }],
    subtotal: 59.99,
    shipping: 9.99,
    tax: 4.80,
    total: 74.78,
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0456',
      address1: '456 Oak Ave',
      city: 'Cambridge',
      state: 'MA',
      zipCode: '02139',
      country: 'US'
    },
    status: 'pending',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: 'ORD-003',
    items: [
      { product: mockProducts[3], quantity: 1 },
      { product: mockProducts[4], quantity: 1 }
    ],
    subtotal: 279.98,
    shipping: 0,
    tax: 22.40,
    total: 302.38,
    shippingAddress: {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.j@example.com',
      phone: '+1-555-0789',
      address1: '789 Pine St',
      city: 'Somerville',
      state: 'MA',
      zipCode: '02144',
      country: 'US'
    },
    status: 'confirmed',
    createdAt: '2024-01-13T09:20:00Z'
  },
  {
    id: 'ORD-004',
    items: [{ product: mockProducts[5], quantity: 4 }],
    subtotal: 199.96,
    shipping: 0,
    tax: 16.00,
    total: 215.96,
    shippingAddress: {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@example.com',
      phone: '+1-555-0321',
      address1: '321 Elm St',
      city: 'Newton',
      state: 'MA',
      zipCode: '02458',
      country: 'US'
    },
    status: 'delivered',
    createdAt: '2024-01-12T14:10:00Z'
  },
  {
    id: 'ORD-005',
    items: [{ product: mockProducts[0], quantity: 1 }],
    subtotal: 299.99,
    shipping: 0,
    tax: 24.00,
    total: 323.99,
    shippingAddress: {
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      phone: '+1-555-0654',
      address1: '654 Maple Dr',
      city: 'Brookline',
      state: 'MA',
      zipCode: '02446',
      country: 'US'
    },
    status: 'cancelled',
    createdAt: '2024-01-11T11:30:00Z'
  }
];


// API client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getCsrfToken(): Promise<string> {
    if (csrfToken) {
      return csrfToken;
    }

    try {
      const response = await fetch(`${this.baseURL}/admin/auth/csrf/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.csrfToken;
        return csrfToken;
      }
    } catch (error) {
      // CSRF token fetch failed, continue without it
    }
    
    return '';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (USE_MOCK_DATA) {
      return this.mockRequest<T>(endpoint, options);
    }

    try {
      // Get CSRF token for non-GET requests
      let headers: Record<string, string> = {
        ...options?.headers,
      };

      // Only set Content-Type for JSON requests, not for FormData
      if (!(options?.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      if (options?.method && options.method !== 'GET') {
        const token = await this.getCsrfToken();
        if (token) {
          headers['X-CSRFToken'] = token;
        }
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers,
        credentials: 'include', // Include cookies for session authentication
        ...options,
      });

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  private async mockRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const url = new URL(endpoint, 'http://localhost');
    const params = url.searchParams;

    // Mock API responses
    if (endpoint.startsWith('/products')) {
      if (endpoint.includes('/products/') && !endpoint.includes('?')) {
        // Single product by slug
        const slug = endpoint.split('/products/')[1];
        const product = mockProducts.find(p => p.slug === slug);
        if (!product) {
          throw { message: 'Product not found', status: 404 } as ApiError;
        }
        return { data: product, success: true } as any;
      } else {
        // Product listing
        let filteredProducts = [...mockProducts];
        
        const category = params.get('category');
        const search = params.get('search');
        const featured = params.get('featured');
        const sortBy = params.get('sortBy') || 'newest';
        const page = parseInt(params.get('page') || '1');
        const pageSize = parseInt(params.get('page_size') || '12');

        if (featured === 'true') {
          filteredProducts = filteredProducts.filter(p => p.featured);
        }

        if (category) {
          filteredProducts = filteredProducts.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
          );
        }

        if (search) {
          const searchLower = search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        // Sort products
        switch (sortBy) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedProducts = filteredProducts.slice(start, end);

        const response: ProductListResponse = {
          products: paginatedProducts,
          meta: {
            page,
            pageSize,
            totalItems: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / pageSize),
            hasNext: end < filteredProducts.length,
            hasPrevious: page > 1,
          },
          filters: {
            categories: mockCategories,
            priceRange: {
              min: Math.min(...mockProducts.map(p => p.price)),
              max: Math.max(...mockProducts.map(p => p.price)),
            },
          },
        };

        return { data: response, success: true } as any;
      }
    }

    if (endpoint === '/categories') {
      return { data: mockCategories, success: true } as any;
    }

    if (endpoint.startsWith('/admin/dashboard')) {
      const stats: DashboardStats = {
        ordersToday: 12,
        revenueToday: 2847.50,
        avgOrderValue: 237.29,
        errorRate: 0.5,
        ordersLast7Days: [
          { date: '2024-01-09', orders: 8 },
          { date: '2024-01-10', orders: 12 },
          { date: '2024-01-11', orders: 15 },
          { date: '2024-01-12', orders: 9 },
          { date: '2024-01-13', orders: 14 },
          { date: '2024-01-14', orders: 11 },
          { date: '2024-01-15', orders: 12 }
        ]
      };
      return { data: stats, success: true } as any;
    }

    if (endpoint.startsWith('/admin/orders')) {
      let filteredOrders = [...mockOrders];
      
      const status = params.get('status');
      const search = params.get('search');
      const sortBy = params.get('sortBy') || 'createdAt';
      const sortOrder = params.get('sortOrder') || 'desc';
      
      if (status && status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.id.toLowerCase().includes(searchLower) ||
          order.shippingAddress.email.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort orders
      filteredOrders.sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
      
      const page = parseInt(params.get('page') || '1');
      const pageSize = parseInt(params.get('pageSize') || '10');
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedOrders = filteredOrders.slice(start, end);
      
      return { 
        data: {
          orders: paginatedOrders,
          meta: {
            page,
            pageSize,
            totalItems: filteredOrders.length,
            totalPages: Math.ceil(filteredOrders.length / pageSize),
            hasNext: end < filteredOrders.length,
            hasPrevious: page > 1,
          }
        }, 
        success: true 
      } as any;
    }

    if (endpoint.startsWith('/admin/orders/') && options?.method === 'PATCH') {
      const orderId = endpoint.split('/admin/orders/')[1];
      const updateData = JSON.parse(options.body as string);
      
      const orderIndex = mockOrders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updateData };
        return { data: mockOrders[orderIndex], success: true } as any;
      }
      throw { message: 'Order not found', status: 404 } as ApiError;
    }

    if (endpoint.startsWith('/admin/products')) {
      if (options?.method === 'POST') {
        const newProduct = JSON.parse(options.body as string);
        const product: Product = {
          id: Math.random().toString(36).substr(2, 9),
          slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-'),
          images: ['/api/placeholder/400/400'],
          rating: 0,
          reviewCount: 0,
          featured: false,
          ...newProduct
        };
        mockProducts.push(product);
        return { data: product, success: true } as any;
      }
      
      // List products for admin
      let filteredProducts = [...mockProducts];
      
      const category = params.get('category');
      const search = params.get('search');
      const inStock = params.get('inStock');
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (inStock === 'true') {
        filteredProducts = filteredProducts.filter(p => p.inStock);
      } else if (inStock === 'false') {
        filteredProducts = filteredProducts.filter(p => !p.inStock);
      }
      
      const page = parseInt(params.get('page') || '1');
      const pageSize = parseInt(params.get('pageSize') || '10');
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedProducts = filteredProducts.slice(start, end);
      
      return { 
        data: {
          products: paginatedProducts,
          meta: {
            page,
            pageSize,
            totalItems: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / pageSize),
            hasNext: end < filteredProducts.length,
            hasPrevious: page > 1,
          }
        }, 
        success: true 
      } as any;
    }

    if (endpoint.startsWith('/admin/products/') && options?.method === 'PATCH') {
      const productId = endpoint.split('/admin/products/')[1];
      const updateData = JSON.parse(options.body as string);
      
      const productIndex = mockProducts.findIndex(product => product.id === productId);
      if (productIndex !== -1) {
        mockProducts[productIndex] = { ...mockProducts[productIndex], ...updateData };
        return { data: mockProducts[productIndex], success: true } as any;
      }
      throw { message: 'Product not found', status: 404 } as ApiError;
    }

    throw { message: 'Mock endpoint not implemented', status: 404 } as ApiError;
  }

  // Public API methods
  async getProducts(filters?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    sortBy?: string;
  }): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.pageSize) params.set('page_size', filters.pageSize.toString());
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.featured) params.set('featured', 'true');
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Product[];
    }>(endpoint);
    
    // Convert Django REST Framework pagination format to frontend format
    return {
      products: response.results,
      meta: {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 12,
        totalItems: response.count,
        totalPages: Math.ceil(response.count / (filters?.pageSize || 12)),
        hasNext: !!response.next,
        hasPrevious: !!response.previous,
      },
      filters: {
        categories: [], // Will be populated separately
        priceRange: { min: 0, max: 1000 }, // Will be calculated separately
      }
    };
  }

  async getProduct(slug: string): Promise<Product> {
    const response = await this.request<Product>(`/products/${slug}`);
    return response;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.request<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Category[];
    }>('/categories');
    return response.results;
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await this.request<ApiResponse<Order>>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  }

  // Admin API methods
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>('/admin/dashboard/stats/');
    return response;
  }

  async getOrders(filters?: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ orders: Order[]; meta: PaginationMeta }> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const endpoint = `/admin/orders/${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{ orders: Order[]; meta: PaginationMeta }>(endpoint);
    return response;
  }

  async updateOrder(orderId: string, updateData: Partial<Order>): Promise<Order> {
    const response = await this.request<Order>(`/admin/orders/${orderId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return response;
  }

  async getAdminProducts(filters?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    inStock?: boolean;
  }): Promise<{ products: Product[]; meta: PaginationMeta }> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.inStock !== undefined) params.set('inStock', filters.inStock.toString());

    const queryString = params.toString();
    const endpoint = `/admin/products/${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{ products: Product[]; meta: PaginationMeta }>(endpoint);
    return response;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await this.request<Product>('/admin/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response;
  }

  // Image upload methods
  async uploadProductImage(productId: number, imageFile: File, altText?: string, isPrimary?: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (altText) formData.append('alt_text', altText);
    if (isPrimary) formData.append('is_primary', isPrimary.toString());

    const response = await this.request<any>(`/admin/products/${productId}/images/`, {
      method: 'POST',
      body: formData,
    });
    return response;
  }

  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    await this.request(`/admin/products/${productId}/images/${imageId}/`, {
      method: 'DELETE',
    });
  }

  async setPrimaryImage(productId: number, imageId: number): Promise<void> {
    await this.request(`/admin/products/${productId}/images/${imageId}/set-primary/`, {
      method: 'PUT',
    });
  }

  async reorderProductImages(productId: number, imageOrders: Array<{id: number, order: number}>): Promise<void> {
    await this.request(`/admin/products/${productId}/images/reorder/`, {
      method: 'PUT',
      body: JSON.stringify({ image_orders: imageOrders }),
    });
  }

  async updateProduct(productId: string, updateData: Partial<Product>): Promise<Product> {
    const response = await this.request<Product>(`/admin/products/${productId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return response;
  }

  // Authentication methods
  async adminLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<{ message: string; user: any }>('/admin/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  }

  async adminLogout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<{ message: string }>('/admin/auth/logout/', {
        method: 'POST',
      });
      // Clear CSRF token on logout
      csrfToken = null;
      return { success: true, message: response.message };
    } catch (error) {
      // Clear CSRF token even if logout fails
      csrfToken = null;
      return { success: false, message: 'Logout failed' };
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.request<any>('/admin/auth/user/');
      return response;
    } catch (error) {
      return null;
    }
  }

  // Customer management methods
  async getAdminCustomers(filters?: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
  }): Promise<{ customers: any[]; meta: PaginationMeta }> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/admin/customers/${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{ customers: any[]; meta: PaginationMeta }>(endpoint);
    return response;
  }

  async getCustomerStats(): Promise<any> {
    const response = await this.request<any>('/admin/customers/stats/');
    return response;
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export utility function for checking if we're using mock data
export const isUsingMockData = () => USE_MOCK_DATA;