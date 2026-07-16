import { create } from 'zustand';
import type { FoodItem } from '../types';

const mockMenu: FoodItem[] = [
  // Breakfast Products
  { id: '1', name: 'Masala Omelette', price: 50, category: 'breakfast', canteenId: 'banswara-main', isFoodOfTheDay: true, isEnabled: true, unitName: 'Plate', shortCode: 'MO-01' },
  { id: '2', name: 'Poha Special', price: 30, category: 'breakfast', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Plate', shortCode: 'PO-02' },
  { id: '3', name: 'Idli Sambar', price: 45, category: 'breakfast', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Pair', shortCode: 'ID-03' },
  { id: '4', name: 'Veg Sandwich', price: 35, category: 'breakfast', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Full', shortCode: 'VS-04' },
  
  // Lunch Products
  { id: '5', name: 'Rajma Chawal', price: 90, category: 'lunch', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Full', shortCode: 'RC-03' },
  { id: '6', name: 'Paneer Butter Masala', price: 130, category: 'lunch', canteenId: 'banswara-main', isFoodOfTheDay: true, isEnabled: true, unitName: 'Portion', shortCode: 'PBM-04' },
  { id: '7', name: 'Dal Tadka Combo', price: 80, category: 'lunch', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Full', shortCode: 'DT-05' },
  { id: '8', name: 'Chicken Thali', price: 180, category: 'lunch', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Thali', shortCode: 'CT-08' },
  { id: '9', name: 'Mix Veg Curry', price: 75, category: 'lunch', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Portion', shortCode: 'MVC-09' },

  // Snacks & Tea
  { id: '10', name: 'Grilled Sandwich', price: 60, category: 'snacks', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Pair', shortCode: 'GS-10' },
  { id: '11', name: 'Samosa Chat', price: 40, category: 'snacks', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Plate', shortCode: 'SC-11' },
  { id: '12', name: 'Masala Chai', price: 15, category: 'tea', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Cup', shortCode: 'MC-12' },
  { id: '13', name: 'Cold Coffee Luxe', price: 55, category: 'tea', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Glass', shortCode: 'CC-13' },
  { id: '14', name: 'Vada Pav', price: 25, category: 'snacks', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Piece', shortCode: 'VP-14' },

  // Dinner Products
  { id: '15', name: 'Chicken Biryani', price: 160, category: 'dinner', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Plate', shortCode: 'CB-15' },
  { id: '16', name: 'Veg Pulao', price: 110, category: 'dinner', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Full', shortCode: 'VP-16' },
  { id: '17', name: 'Butter Naan (2pcs)', price: 40, category: 'dinner', canteenId: 'banswara-main', isFoodOfTheDay: false, isEnabled: true, unitName: 'Portion', shortCode: 'BN-17' },
];


interface MenuState {
  items: FoodItem[];
  addItem: (item: Omit<FoodItem, 'id'>) => void;
  updateItem: (id: string, data: Partial<FoodItem>) => void;
  deleteItem: (id: string) => void;
  toggleEnabled: (id: string) => void;
  toggleFoodOfDay: (id: string) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [...mockMenu],
  addItem: (item) =>
    set((s) => ({ items: [...s.items, { ...item, id: String(Date.now()) }] })),
  updateItem: (id, data) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)) })),
  deleteItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  toggleEnabled: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, isEnabled: !i.isEnabled } : i)),
    })),
  toggleFoodOfDay: (id) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id ? { ...i, isFoodOfTheDay: !i.isFoodOfTheDay } : { ...i, isFoodOfTheDay: false }
      ),
    })),
}));
