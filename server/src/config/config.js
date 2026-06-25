// ============================================
// Portfolio OS 2026 — Application Configuration
// ============================================
// Centralized configuration module.
// All environment variables are accessed through this file.
// No other file should read process.env directly.

const config = {
  // Server port — defaults to 5000 if not specified
  port: process.env.PORT || 5000,

  // Node environment — development, production, or test
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS origin — which frontend URL is allowed to call this API
  corsOrigin: [
    'http://localhost:5173',
    'https://portfolio-os-2026-chn9ztp2s-soham-kundus-projects.vercel.app',
    'https://portfolio-os-2026.vercel.app'
  ],

  // Contact email — where contact form messages are delivered
  contactEmail: process.env.CONTACT_EMAIL || 'sohamkundu84@gmail.com',

  // SMTP configuration for Nodemailer (optional)
  // If not configured, contact messages are logged to the console
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

  // MongoDB Connection String
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-os',

  // JWT Secret
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey_portfolio_os',
};

module.exports = config;
