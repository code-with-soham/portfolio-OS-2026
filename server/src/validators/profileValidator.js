// ============================================
// Portfolio OS 2026 — Profile Validator
// ============================================
// Validates request parameters for profile-related endpoints.
// Runs as middleware BEFORE the controller — rejects bad requests early
// with clean 400 errors instead of letting them reach business logic.
//
// For Phase 1, the profile endpoint is a simple GET with no params,
// so this validator serves as a structural placeholder and demonstrates
// the validation pattern for future endpoints (POST /api/contact, etc.)

/**
 * Validates GET /api/profile request.
 * Currently a pass-through since GET /profile requires no input.
 * This structure is ready for query param validation (e.g., ?fields=name,bio)
 */
const validateGetProfile = (req, res, next) => {
  // Example: validate optional query params in the future
  // const allowedFields = ['name', 'title', 'bio', 'email', 'social'];
  // const requestedFields = req.query.fields?.split(',') || [];
  // const invalidFields = requestedFields.filter(f => !allowedFields.includes(f));
  //
  // if (invalidFields.length > 0) {
  //   return res.status(400).json({
  //     success: false,
  //     message: `Invalid fields: ${invalidFields.join(', ')}`,
  //   });
  // }

  next();
};

/**
 * Generic validation helper — validates that required fields exist in request body.
 * Useful for POST/PUT endpoints in future phases.
 *
 * @param {string[]} requiredFields - Array of field names that must be present
 * @returns {Function} Express middleware function
 */
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: missing required fields',
        errors: missingFields.map(field => ({
          field,
          message: `${field} is required`,
        })),
      });
    }

    next();
  };
};

module.exports = {
  validateGetProfile,
  validateRequiredFields,
};
