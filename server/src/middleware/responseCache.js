// ============================================
// Portfolio OS 2026 — Response Cache Middleware
// ============================================
// Simple in-memory cache for GET responses.
// Since portfolio data is mostly static (JSON files), caching
// avoids repeated file reads for the same data.
//
// How it works:
//   1. On a GET request, check if a cached response exists for the URL
//   2. If found and not expired, return the cached response immediately
//   3. If not found, intercept res.json(), cache the result, and send it
//
// Cache is automatically cleared after a configurable TTL (time to live).
// This is a development-friendly cache — no Redis/external dependencies.

/**
 * In-memory cache store
 * Structure: { [url]: { data, timestamp } }
 */
const cache = new Map();

/**
 * Default cache TTL: 5 minutes (in milliseconds)
 * Portfolio data rarely changes during a session, so 5 minutes is safe.
 */
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Creates a caching middleware for GET requests.
 *
 * @param {number} [ttl=DEFAULT_TTL] - Cache time-to-live in milliseconds
 * @returns {Function} Express middleware function
 *
 * Usage:
 *   router.get('/', responseCache(), controller.handler);
 *   router.get('/', responseCache(60000), controller.handler);  // 1 min TTL
 */
const responseCache = (ttl = DEFAULT_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Build a cache key from the full URL (includes query params)
    const cacheKey = req.originalUrl;

    // Check if we have a valid cached response
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < ttl) {
      // Cache hit — return cached data with a header indicating it came from cache
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-TTL', `${Math.round((ttl - (Date.now() - cached.timestamp)) / 1000)}s`);
      return res.status(cached.statusCode).json(cached.data);
    }

    // Cache miss — intercept res.json() to capture and cache the response
    res.set('X-Cache', 'MISS');

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Only cache successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, {
          data,
          statusCode: res.statusCode,
          timestamp: Date.now(),
        });
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clears the entire cache.
 * Useful for cache invalidation when data changes.
 */
const clearCache = () => {
  cache.clear();
};

/**
 * Returns the current cache size (number of cached entries).
 */
const getCacheSize = () => {
  return cache.size;
};

module.exports = {
  responseCache,
  clearCache,
  getCacheSize,
};
