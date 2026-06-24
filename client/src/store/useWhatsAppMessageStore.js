import { create } from 'zustand';
import api from '../services/api';

export const useWhatsAppMessageStore = create((set, get) => ({
  messagesByChat: {}, // { conversationId: [messages...] }
  loading: false,

  fetchMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const res = await api.get(`/messages/${conversationId}`);
      set((state) => ({
        messagesByChat: {
          ...state.messagesByChat,
          [conversationId]: res.data.messages
        },
        loading: false
      }));
    } catch (err) {
      console.error('Failed to fetch messages', err);
      set({ loading: false });
    }
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const existing = state.messagesByChat[conversationId] || [];
      // Prevent duplicates
      if (existing.some(m => m._id === message._id)) return state;
      
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [conversationId]: [...existing, message]
        }
      };
    });
  }
}));
