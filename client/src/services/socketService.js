// ============================================
// Portfolio OS 2026 — Socket.IO Client Service
// ============================================
// Singleton Socket.IO client that connects to the backend
// and wires events to the WhatsApp Zustand store.

import { io } from 'socket.io-client';
import { useWhatsAppStore } from '../store/useWhatsAppStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;
let isConnected = false;

/**
 * Initialize the Socket.IO connection and wire event listeners.
 */
export function connectSocket() {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  socket.on('connect', () => {
    isConnected = true;
    console.log('[Socket.IO Client] ✅ Connected:', socket.id);
    // Go online
    socket.emit('chat:online', 'soham');
  });

  socket.on('disconnect', (reason) => {
    isConnected = false;
    console.log('[Socket.IO Client] ❌ Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket.IO Client] Connection error:', err.message);
  });

  // ─── Chat Events ───

  // Receive messages
  socket.on('chat:message', (data) => {
    const store = useWhatsAppStore.getState();
    const { roomId, sender, ...message } = data;

    // Don't double-add our own messages (they were already added optimistically)
    if (sender === 'me' || sender === 'soham') {
      // But DO update status to 'delivered'
      const contactId = roomId?.replace('room_soham_', '').replace('room_', '').replace('_soham', '');
      if (contactId) {
        store.markAsRead(contactId, [message.id]);
      }
      return;
    }

    // This is a message from a contact (AI reply)
    const contactId = sender;
    store.receiveMessage(contactId, { ...message, sender: contactId });
  });

  // Typing indicators
  socket.on('chat:typing', (data) => {
    const store = useWhatsAppStore.getState();
    store.setTyping(data.contactId, data.isTyping);
  });

  // Read receipts
  socket.on('chat:read', (data) => {
    // Could update message status to 'read' here
  });

  // User status updates
  socket.on('chat:userStatus', (data) => {
    const store = useWhatsAppStore.getState();
    store.updateContactStatus(data.userId, data.online, data.lastSeen);
  });

  return socket;
}

/**
 * Disconnect the socket.
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
}

/**
 * Get the current socket instance.
 */
export function getSocket() {
  return socket;
}

/**
 * Join a chat room for a specific contact.
 */
export function joinRoom(contactId) {
  if (!socket?.connected) return;
  const roomId = `room_soham_${contactId}`;
  socket.emit('chat:join', { roomId });
  return roomId;
}

/**
 * Leave a chat room.
 */
export function leaveRoom(contactId) {
  if (!socket?.connected) return;
  const roomId = `room_soham_${contactId}`;
  socket.emit('chat:leave', { roomId });
}

/**
 * Send a message through Socket.IO.
 */
export function emitMessage(contactId, contactName, message) {
  if (!socket?.connected) return;
  const roomId = `room_soham_${contactId}`;
  socket.emit('chat:message', {
    roomId,
    message,
    sender: 'soham',
    contactId,
    contactName,
  });
}

/**
 * Emit typing indicator.
 */
export function emitTyping(contactId, isTyping) {
  if (!socket?.connected) return;
  const roomId = `room_soham_${contactId}`;
  socket.emit('chat:typing', {
    roomId,
    contactId: 'soham',
    contactName: 'Soham Kundu',
    isTyping,
  });
}

/**
 * Check if socket is connected.
 */
export function isSocketConnected() {
  return isConnected && socket?.connected;
}
