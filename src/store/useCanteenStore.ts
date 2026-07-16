import { create } from 'zustand';
import type { Canteen } from '../types';

interface CanteenState {
  canteens: Canteen[];
  addCanteen: (canteen: Omit<Canteen, 'id'>) => void;
  updateCanteen: (id: string, canteen: Partial<Canteen>) => void;
  deleteCanteen: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const mockCanteens: Canteen[] = [
  { 
    id: 'banswara-main', 
    name: 'Banswara Syntex Canteen', 
    managerId: 'supervisor', 
    isActive: true, 
    location: 'Main Factory Complex, Banswara' 
  },
];

export const useCanteenStore = create<CanteenState>((set) => ({
  canteens: [...mockCanteens],
  addCanteen: (canteen) => set((state) => ({
    canteens: [...state.canteens, { ...canteen, id: String(Date.now()) }]
  })),
  updateCanteen: (id, canteenData) => set((state) => ({
    canteens: state.canteens.map((c) => c.id === id ? { ...c, ...canteenData } : c)
  })),
  deleteCanteen: (id) => set((state) => ({
    canteens: state.canteens.filter((c) => c.id !== id)
  })),
  toggleStatus: (id) => set((state) => ({
    canteens: state.canteens.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c)
  })),
}));
