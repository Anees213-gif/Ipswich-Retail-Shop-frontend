// Zustand cart store with localStorage persistence
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product } from '@/types';

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          let newItems: CartItem[];
          if (existingItem) {
            // Update quantity of existing item
            newItems = state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            newItems = [...state.items, { product, quantity }];
          }

          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter(item => item.product.id !== productId);
          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const newItems = state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );
          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },

      getItem: (productId: string) => {
        return get().items.find(item => item.product.id === productId);
      },

      getTotalPrice: () => get().total,

      getTotalItems: () => get().itemCount,
    }),
    {
      name: 'ipswich-retail-cart',
      version: 1,
    }
  )
);