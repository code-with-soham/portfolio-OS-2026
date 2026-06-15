// ============================================
// Portfolio OS 2026 — Express Application Setup
// ============================================
// This file configures the Express application with all middleware,
// route registrations, and error handling.
// It does NOT start the server — that's handled by server.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./src/config/config');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Initialize Express application
const app = express();

// ========================
// Middleware Configuration
// ========================

// CORS — Cross-Origin Resource Sharing
// Allows the frontend (running on a different port) to communicate with the backend
const allowedOrigins = [
  'http://localhost:5173',
  'https://portfolio-os-2026.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON Body Parser — Parses incoming JSON request bodies
app.use(express.json({ limit: '10mb' }));

// URL-Encoded Body Parser — Parses URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Morgan HTTP Logger — Logs all HTTP requests to the console
// Uses 'dev' format in development for colorized, concise output
app.use(morgan('dev'));

// Rate Limiter — Prevents API abuse
// 100 requests per 15-minute window per IP address
app.use('/api', apiLimiter);

// ===================
// Health Check Route
// ===================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio OS API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// =====================
// API Route Registration
// =====================
// All API routes are prefixed with /api
// Route aggregation happens in src/routes/index.js

app.use('/api', routes);

// =====================
// 404 — Route Not Found
// =====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ======================
// Global Error Handler
// ======================
// Must be registered LAST — catches all unhandled errors from routes/middleware

app.use(errorHandler);

module.exports = app;
