import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useWhatsAppAuthStore } from './useWhatsAppAuthStore';
import { useWhatsAppMessageStore } from './useWhatsAppMessageStore';
import { useWhatsAppChatStore } from './useWhatsAppChatStore';

export const useWhatsAppSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const { token } = useWhatsAppAuthStore.getState();
    if (!token) return;

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('WhatsApp Socket connected');
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('WhatsApp Socket disconnected');
      set({ isConnected: false });
    });

    newSocket.on('receive_message', (message) => {
      // Add message to message store
      useWhatsAppMessageStore.getState().addMessage(message.conversationId, message);
      // Update chat's last message
      useWhatsAppChatStore.getState().updateChatLastMessage(message.conversationId, message);
    });

    newSocket.on('user_online', ({ userId }) => {
      // We can update contact status here
      console.log('User online:', userId);
    });

    newSocket.on('user_offline', ({ userId, lastSeen }) => {
      console.log('User offline:', userId, lastSeen);
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (conversationId, text, receiverId) => {
    const { socket } = get();
    return new Promise((resolve, reject) => {
      if (!socket || !socket.connected) {
        return reject(new Error('Socket not connected'));
      }
      socket.emit('send_message', { conversationId, text, receiverId }, (res) => {
        if (res.success) resolve(res.message);
        else reject(new Error(res.error));
      });
    });
  }
}));
