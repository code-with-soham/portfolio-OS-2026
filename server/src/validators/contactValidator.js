// ============================================
// Portfolio OS 2026 — Contact Validator
// ============================================
// Validates the contact form submission body.
// This is the strictest validator since it processes user input.

/**
 * Validates POST /api/contact request body.
 * Ensures all required fields are present and properly formatted.
 */
const validateContactForm = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be under 100 characters' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Subject validation
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    errors.push({ field: 'subject', message: 'Subject is required' });
  } else if (subject.trim().length < 3) {
    errors.push({ field: 'subject', message: 'Subject must be at least 3 characters' });
  } else if (subject.trim().length > 200) {
    errors.push({ field: 'subject', message: 'Subject must be under 200 characters' });
  }

  // Message validation
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
  } else if (message.trim().length > 5000) {
    errors.push({ field: 'message', message: 'Message must be under 5000 characters' });
  }

  // If there are validation errors, return a 400 response
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize the input — trim whitespace
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.subject = subject.trim();
  req.body.message = message.trim();

  next();
};

module.exports = {
  validateContactForm,
};
