// ============================================
// Portfolio OS 2026 — Server Entry Point
// ============================================
// This file starts the Express server with Socket.IO support.
// Uses http.createServer() so Socket.IO can attach to the same port.

require('dotenv').config();
const http = require('http');
const app = require('./app');
const config = require('./src/config/config');
const { Server } = require('socket.io');
const { registerChatSocket } = require('./src/sockets/chatSocket');
const { setupRedisAdapter } = require('./src/sockets/redisAdapter');

const PORT = config.port;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://portfolio-os-2026.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Attempt Redis adapter setup (falls back gracefully)
setupRedisAdapter(io).catch(() => {});

// Register chat socket handlers
registerChatSocket(io);

// Start the server
server.listen(PORT, () => {
  console.log('\n========================================');
  console.log('   🖥️  Portfolio OS 2026 — Backend');
  console.log('========================================');
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   URL         : http://localhost:${PORT}`);
  console.log(`   Health      : http://localhost:${PORT}/api/health`);
  console.log(`   Socket.IO   : ws://localhost:${PORT}`);
  console.log('========================================\n');
});
