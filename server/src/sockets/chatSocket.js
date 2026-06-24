const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

function registerChatSocket(io) {
  // Socket.IO Auth Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`[Socket.IO] ✅ User connected: ${userId} (${socket.user.name})`);

    // 1. Join Personal Room
    socket.join(userId);

    // 2. Broadcast Online Status
    socket.user.isOnline = true;
    await socket.user.save();
    socket.broadcast.emit('user_online', { userId });

    // 3. Handle 'send_message' directly from socket
    socket.on('send_message', async (data, callback) => {
      try {
        const { conversationId, text, receiverId } = data;

        // Save to MongoDB
        const message = await Message.create({
          conversationId,
          senderId: userId,
          text,
          delivered: true,
          read: false
        });

        // Update Conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastMessageTime: new Date()
        });

        // Emit to Receiver's Personal Room
        if (receiverId) {
          io.to(receiverId).emit('receive_message', message);
        }

        // Emit back to Sender's other tabs if they have multiple open
        socket.to(userId).emit('receive_message', message);

        if (callback) callback({ success: true, message });
      } catch (err) {
        console.error('[Socket.IO] Send message error:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // 4. Handle Disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket.IO] ❌ User disconnected: ${userId}`);
      socket.user.isOnline = false;
      socket.user.lastSeen = new Date();
      await socket.user.save();
      
      socket.broadcast.emit('user_offline', { 
        userId, 
        lastSeen: socket.user.lastSeen 
      });
    });
  });

  console.log('[Socket.IO] 💬 Core chat socket handler registered with Auth');
}

module.exports = { registerChatSocket };
