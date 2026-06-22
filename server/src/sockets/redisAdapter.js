// ============================================
// Portfolio OS 2026 — Redis Adapter for Socket.IO
// ============================================
// Provides horizontal scaling via Redis Pub/Sub.
// Falls back gracefully to in-memory when Redis is unavailable.

const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('ioredis');

/**
 * Attempt to attach the Redis adapter to a Socket.IO server.
 * If Redis is not available, logs a warning and continues with
 * the default in-memory adapter (fine for single-server / dev).
 */
async function setupRedisAdapter(io) {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    const pubClient = new createClient(redisUrl);
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => {
      console.warn('[Redis] Pub client error:', err.message);
    });
    subClient.on('error', (err) => {
      console.warn('[Redis] Sub client error:', err.message);
    });

    // ioredis auto-connects, but we wait for 'ready'
    await Promise.race([
      Promise.all([
        new Promise((resolve, reject) => {
          pubClient.on('ready', resolve);
          pubClient.on('error', reject);
        }),
        new Promise((resolve, reject) => {
          subClient.on('ready', resolve);
          subClient.on('error', reject);
        }),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis connection timeout')), 3000)
      ),
    ]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log('[Redis] ✅ Adapter attached — horizontal scaling enabled');
    return true;
  } catch (err) {
    console.warn(
      `[Redis] ⚠️  Could not connect (${err.message}). Using in-memory adapter.`
    );
    return false;
  }
}

module.exports = { setupRedisAdapter };
