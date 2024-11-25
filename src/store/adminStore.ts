import { create } from 'zustand';
import { AdminState } from '../types';

// Set the default admin password
const ADMIN_PASSWORD = 'tee_shine18'; // Using the specified password

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: localStorage.getItem('adminAuth') === 'true',
  isDark: localStorage.getItem('isDark') === 'true' || false,
  login: (password: string) => {
    console.log('Attempting login with:', password); // Debug log
    console.log('Expected password:', ADMIN_PASSWORD); // Debug log
    const isValid = password === ADMIN_PASSWORD;
    if (isValid) {
      set({ isAuthenticated: true });
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  },
  logout: () => {
    set({ isAuthenticated: false });
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