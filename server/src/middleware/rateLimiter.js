// ============================================
// Portfolio OS 2026 — Rate Limiter Middleware
// ============================================
// Protects the API from abuse by limiting the number of requests
// a client can make within a time window.
//
// Uses express-rate-limit for a clean, proven implementation.
// Different limits for different endpoint types:
//   - General API: 100 req/15 min (relaxed for portfolio browsing)
//   - Contact form: 5 req/15 min (strict to prevent spam)

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter.
 * Applies to all /api routes.
 * 100 requests per 15-minute window per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes',
  },
});

/**
 * Strict rate limiter for the contact form.
 * 5 requests per 15-minute window per IP.
 * Prevents contact form spam.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact submissions. Please try again later.',
    retryAfter: '15 minutes',
  },
});

module.exports = {
  apiLimiter,
  contactLimiter,
};
