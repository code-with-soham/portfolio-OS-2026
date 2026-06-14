// ============================================
// Portfolio OS 2026 — Server Entry Point
// ============================================
// This file starts the Express server.
// Separated from app.js so the app can be imported independently for testing.

require('dotenv').config();
const app = require('./app');
const config = require('./src/config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('   🖥️  Portfolio OS 2026 — Backend');
  console.log('========================================');
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   URL         : http://localhost:${PORT}`);
  console.log(`   Health      : http://localhost:${PORT}/api/health`);
  console.log('========================================\n');
});
