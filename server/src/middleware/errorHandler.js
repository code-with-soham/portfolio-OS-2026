// ============================================
// Portfolio OS 2026 — Global Error Handler Middleware
// ============================================
// This middleware catches all unhandled errors thrown in routes or other middleware.
// It formats a consistent error response and prevents the server from crashing.
//
// IMPORTANT: Express error handlers MUST have exactly 4 parameters (err, req, res, next)
// even if `next` is not used — this is how Express identifies it as an error handler.

const errorHandler = (err, req, res, next) => {
  // Log the error stack trace in development for debugging
  console.error('──────────────────────────────────');
  console.error('💥 ERROR:', err.message);
  console.error('──────────────────────────────────');

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Determine the status code
  // If the error has a statusCode property, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // Send a consistent error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
