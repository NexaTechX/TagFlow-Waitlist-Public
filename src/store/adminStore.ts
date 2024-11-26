import { create } from 'zustand';
import { AdminState } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  isDark: localStorage.getItem('isDark') === 'true' || false,
  login: async (password: string) => {
    try {
      const isValid = password === ADMIN_PASSWORD;
      if (!isValid) {
        return false;
      }

      // Create admin session
      await setDoc(doc(db, 'admin_sessions', 'current'), {
        authenticated: true,
        timestamp: new Date().toISOString()
      });
      
      // Update local state
      set({ isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ isAuthenticated: false });
      return false;
    }
  },
  logout: async () => {
    try {
      await setDoc(doc(db, 'admin_sessions', 'current'), {
        authenticated: false,
        timestamp: new Date().toISOString()
      });
      set({ isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    localStorage.setItem('isDark', String(newIsDark));
    return { isDark: newIsDark };
  })
}));

// Initialize auth state
async function initializeAuthState() {
  try {
    const sessionDoc = await getDoc(doc(db, 'admin_sessions', 'current'));
    const isAuthenticated = sessionDoc.exists() && sessionDoc.data()?.authenticated === true;
    useAdminStore.setState({ isAuthenticated });
  } catch (error) {
    console.error('Error checking auth state:', error);
    useAdminStore.setState({ isAuthenticated: false });
  }
}

initializeAuthState();