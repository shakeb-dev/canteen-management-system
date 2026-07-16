import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee } from '../types';

interface AuthState {
  user: Employee | null;
  token: string | null;
  role: Employee['role'] | null;
  _hasHydrated: boolean;
  login: (user: Employee, token: string) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      _hasHydrated: false,
      login: (user, token) => set({ user, token, role: user.role }),
      logout: () => {
        set({ user: null, token: null, role: null });
        localStorage.removeItem('auth-storage');
      },
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
