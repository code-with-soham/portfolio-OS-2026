import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useWhatsAppAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (phone, pin) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', { phone, pin });
          const { user, token } = res.data;
          
          // Set token in default headers for future API requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({ user, token, isAuthenticated: true, loading: false });
          return true;
        } catch (err) {
          set({ 
            error: err.response?.data?.message || 'Login failed', 
            loading: false 
          });
          return false;
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false });
      },

      hydrateAuth: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    }),
    {
      name: 'whatsapp-auth-storage',
    }
  )
);
