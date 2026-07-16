import { create } from 'zustand';
import type { Counter } from '../types';

interface CounterState {
  counters: Counter[];
  addCounter: (counter: Omit<Counter, 'id'>) => void;
  updateCounter: (id: string, counter: Partial<Counter>) => void;
  deleteCounter: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const mockCounters: Counter[] = [
  { id: 'cnt-1', name: 'Main Food Counter', location: 'Ground Floor, North Hall', managerId: 'cnt-1', isActive: true, openTime: '08:00', closeTime: '20:00' },
  { id: 'cnt-2', name: 'Beverage & Snacks Point', location: 'Ground Floor, East Wing', managerId: 'cnt-2', isActive: true, openTime: '09:00', closeTime: '18:00' },
  { id: 'cnt-3', name: 'Executive Dining Counter', location: '1st Floor, Admin Block', managerId: 'cnt-2', isActive: true, openTime: '11:00', closeTime: '15:00' },
];

export const useCounterStore = create<CounterState>((set) => ({
  counters: [...mockCounters],
  addCounter: (counter) => set((state) => ({
    counters: [...state.counters, { ...counter, id: String(Date.now()) }]
  })),
  updateCounter: (id, counterData) => set((state) => ({
    counters: state.counters.map((c) => c.id === id ? { ...c, ...counterData } : c)
  })),
  deleteCounter: (id) => set((state) => ({
    counters: state.counters.filter((c) => c.id !== id)
  })),
  toggleStatus: (id) => set((state) => ({
    counters: state.counters.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c)
  })),
}));
