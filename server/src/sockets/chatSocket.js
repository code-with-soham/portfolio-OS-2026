// ============================================
// Portfolio OS 2026 — WhatsApp Chat Socket Handler
// ============================================
// Real-time messaging via Socket.IO with AI-simulated contacts.
// Handles: connection, messaging, typing indicators, read receipts,
// online status, and auto-reply bot system.

const AI_REPLY_TEMPLATES = [
  "Hey! How's it going?",
  "That's interesting, tell me more! 😊",
  "Sure, I'll look into it.",
  "Haha, that's funny! 😂",
  "Let me get back to you on that.",
  "Sounds great! 👍",
  "I was just thinking about the same thing!",
  "Can you elaborate a bit more?",
  "Awesome, thanks for sharing!",
  "I'll check and let you know.",
  "Yeah, I agree with you on that.",
  "Let's discuss this in our next meeting.",
  "That sounds like a plan! 🎯",
  "I'm working on something similar actually.",
  "Good point! I hadn't considered that.",
  "Hope you're having a great day! ☀️",
  "I'm a bit busy right now, talk later?",
  "That's really cool! Where did you learn that?",
  "I'll send you the details soon.",
  "Looking forward to it! 🙌",
  "Nice work! Keep it up! 💪",
  "Let me think about it and get back to you.",
  "Haha sure, no problem at all!",
  "Oh wow, I didn't know that! Thanks!",
  "Great idea! Let's make it happen.",
  "Sorry, I missed your earlier message.",
  "Can we schedule a call for tomorrow?",
  "That makes sense. Let's go with that approach.",
  "I just finished the report, will share it shortly.",
  "Happy to help! Let me know if you need anything else.",
];

// Contextual replies based on keywords in the user's message
const CONTEXTUAL_REPLIES = [
  { keywords: ['hello', 'hi', 'hey', 'hola'], replies: [
    "Hey there! 👋 How are you doing?",
    "Hi! What's up? 😊",
    "Hello! Good to hear from you!",
  ]},
  { keywords: ['how are you', 'how r u', 'whats up', 'sup'], replies: [
    "I'm doing great, thanks! How about you?",
    "All good here! Just been busy with work. You?",
    "Pretty good! Just wrapped up a project. 😊",
  ]},
  { keywords: ['project', 'work', 'code', 'coding', 'development'], replies: [
    "Oh nice! What stack are you using?",
    "That sounds exciting! Need any help with it?",
    "Cool! I've been working on something similar too.",
    "How's the progress so far?",
  ]},
  { keywords: ['meeting', 'call', 'schedule'], replies: [
    "Sure! What time works for you?",
    "Let me check my calendar and get back to you.",
    "How about tomorrow at 3 PM?",
  ]},
  { keywords: ['thanks', 'thank you', 'thx'], replies: [
    "You're welcome! 😊",
    "Anytime! Happy to help! 🙌",
    "No problem at all!",
  ]},
  { keywords: ['bye', 'goodbye', 'see you', 'later', 'good night'], replies: [
    "See you later! Take care! 👋",
    "Bye! Have a great day! ☀️",
    "Talk to you soon! 😊",
    "Good night! Sleep well! 🌙",
  ]},
  { keywords: ['portfolio', 'resume', 'job', 'hire'], replies: [
    "Your portfolio looks amazing btw! 🔥",
    "I saw your portfolio OS project — that's really impressive!",
    "Have you applied to any companies recently?",
  ]},
  { keywords: ['react', 'javascript', 'node', 'python'], replies: [
    "Oh nice! That's a great technology choice.",
    "I've been learning that too! Any good resources?",
    "Solid choice! How's the developer experience?",
  ]},
];

/**
 * Map of online contacts — simulates presence.
 * Key: contactId, Value: { online, lastSeen, socketId }
 */
const onlineUsers = new Map();
const chatRooms = new Map(); // roomId -> Set of socketIds

/**
 * Get a contextual or random AI reply based on message content.
 */
function getAIReply(message) {
  const lower = message.toLowerCase();

  for (const ctx of CONTEXTUAL_REPLIES) {
    if (ctx.keywords.some((kw) => lower.includes(kw))) {
      return ctx.replies[Math.floor(Math.random() * ctx.replies.length)];
    }
  }

  return AI_REPLY_TEMPLATES[
    Math.floor(Math.random() * AI_REPLY_TEMPLATES.length)
  ];
}

/**
 * Register all Socket.IO event handlers.
 */
function registerChatSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] ✅ Client connected: ${socket.id}`);

    // ─── User comes online ───
    socket.on('chat:online', (userId) => {
      onlineUsers.set(userId, {
        online: true,
        lastSeen: new Date().toISOString(),
        socketId: socket.id,
      });
      socket.userId = userId;
      io.emit('chat:userStatus', {
        userId,
        online: true,
        lastSeen: new Date().toISOString(),
      });
      console.log(`[Socket.IO] User online: ${userId}`);
    });

    // ─── Join a chat room (1:1 conversation) ───
    socket.on('chat:join', ({ roomId }) => {
      socket.join(roomId);
      if (!chatRooms.has(roomId)) {
        chatRooms.set(roomId, new Set());
      }
      chatRooms.get(roomId).add(socket.id);
      console.log(`[Socket.IO] ${socket.id} joined room: ${roomId}`);
    });

    // ─── Leave a chat room ───
    socket.on('chat:leave', ({ roomId }) => {
      socket.leave(roomId);
      if (chatRooms.has(roomId)) {
        chatRooms.get(roomId).delete(socket.id);
      }
    });

    // ─── Send a message ───
    socket.on('chat:message', (data) => {
      const { roomId, message, sender, contactId, contactName } = data;

      // Broadcast to room (including sender for confirmation)
      io.to(roomId).emit('chat:message', {
        ...message,
        roomId,
        timestamp: new Date().toISOString(),
        status: 'delivered', // ✓✓
      });

      console.log(
        `[Socket.IO] Message in ${roomId}: ${message.text?.substring(0, 50)}...`
      );

      // ─── AI Auto-Reply ───
      // Simulate typing, then send a reply after 1-3 seconds
      const typingDelay = 800 + Math.random() * 1200; // 0.8-2s
      const replyDelay = typingDelay + 1000 + Math.random() * 2000; // +1-3s

      setTimeout(() => {
        io.to(roomId).emit('chat:typing', {
          contactId,
          contactName,
          isTyping: true,
        });
      }, typingDelay);

      setTimeout(() => {
        // Stop typing
        io.to(roomId).emit('chat:typing', {
          contactId,
          contactName,
          isTyping: false,
        });

        // Send AI reply
        const replyText = getAIReply(message.text || '');
        const replyMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: replyText,
          sender: contactId,
          senderName: contactName,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          type: 'text',
        };

        io.to(roomId).emit('chat:message', {
          ...replyMessage,
          roomId,
        });

        console.log(
          `[Socket.IO] AI Reply from ${contactName}: ${replyText.substring(0, 40)}...`
        );
      }, replyDelay);
    });

    // ─── Typing indicator ───
    socket.on('chat:typing', (data) => {
      const { roomId, ...rest } = data;
      socket.to(roomId).emit('chat:typing', rest);
    });

    // ─── Read receipt ───
    socket.on('chat:read', (data) => {
      const { roomId, messageIds } = data;
      io.to(roomId).emit('chat:read', { messageIds });
    });

    // ─── Disconnect ───
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.set(socket.userId, {
          online: false,
          lastSeen: new Date().toISOString(),
          socketId: null,
        });
        io.emit('chat:userStatus', {
          userId: socket.userId,
          online: false,
          lastSeen: new Date().toISOString(),
        });
      }
      console.log(`[Socket.IO] ❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('[Socket.IO] 💬 Chat socket handlers registered');
}

module.exports = { registerChatSocket };
