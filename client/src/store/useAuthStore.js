import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('os_user')) || null,
  token: localStorage.getItem('os_token') || null,
  isAuthenticated: !!localStorage.getItem('os_token'),
  
  login: (userData, token) => {
    localStorage.setItem('os_user', JSON.stringify(userData));
    localStorage.setItem('os_token', token);
    set({ user: userData, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('os_user');
    localStorage.removeItem('os_token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
