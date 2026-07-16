import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  canteenId: string | null;
  addItem: (item: CartItem, canteenId: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      canteenId: null,
      addItem: (item, canteenId) => set((state) => {
        // If adding from a different canteen, clear cart first
        if (state.canteenId && state.canteenId !== canteenId) {
          return { items: [item], canteenId, totalAmount: item.price * item.quantity };
        }
        const newItems = [...state.items, item];
        const total = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        return { items: newItems, canteenId, totalAmount: total };
      }),
      removeItem: (cartItemId) => set((state) => {
        const newItems = state.items.filter(i => i.cartItemId !== cartItemId);
        const total = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        return { items: newItems, canteenId: newItems.length > 0 ? state.canteenId : null, totalAmount: total };
      }),
      updateQuantity: (cartItemId, quantity) => set((state) => {
        const newItems = state.items.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i);
        const total = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        return { items: newItems, totalAmount: total };
      }),
      clearCart: () => set({ items: [], canteenId: null, totalAmount: 0 }),
      totalAmount: 0,
    }),
    {
      name: 'cart-storage',
    }
  )
);
