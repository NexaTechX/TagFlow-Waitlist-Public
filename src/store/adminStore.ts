import { create } from 'zustand';
import { AdminState } from '../types';

// In production, this would be handled securely via environment variables
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tee_shine18';

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: localStorage.getItem('adminAuth') === 'true',
  isDark: localStorage.getItem('isDark') === 'true' || false,
  login: (password: string) => {
    const isValid = password === ADMIN_PASSWORD;
    if (isValid) {
      set({ isAuthenticated: true });
      // Store auth state in localStorage to persist across page refreshes
      localStorage.setItem('adminAuth', 'true');
    }
    return isValid;
  },
  logout: () => {
    set({ isAuthenticated: false });
    // Clear auth state from localStorage on logout
    localStorage.removeItem('adminAuth');
  },
  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem('isDark', String(newIsDark));
      return { isDark: newIsDark };
    });
  },
}));