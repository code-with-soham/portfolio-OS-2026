import { create } from 'zustand';
import api from '../services/api';

export const useWhatsAppChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  loading: false,
  error: null,

  fetchChats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/chats');
      set({ chats: res.data.conversations, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch chats', loading: false });
    }
  },

  createChat: async (phone) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/chats', { phone });
      const newChat = res.data.conversation;
      
      const currentChats = get().chats;
      const exists = currentChats.find(c => c._id === newChat._id);
      
      if (!exists) {
        set({ chats: [newChat, ...currentChats], activeChatId: newChat._id, loading: false });
      } else {
        set({ activeChatId: newChat._id, loading: false });
      }
      return newChat;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create chat', loading: false });
      return null;
    }
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });
  },

  updateChatLastMessage: (conversationId, message) => {
    const { chats } = get();
    const updatedChats = chats.map(chat => {
      if (chat._id === conversationId) {
        return { ...chat, lastMessage: message, lastMessageTime: message.createdAt };
      }
      return chat;
    });
    // Sort to bring latest to top
    updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    set({ chats: updatedChats });
  }
}));
