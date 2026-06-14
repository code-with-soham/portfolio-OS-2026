// ============================================
// Portfolio OS 2026 — Projects Validator
// ============================================
// Validates request parameters for project endpoints.
// Runs as middleware BEFORE the controller.

const VALID_CATEGORIES = ['full stack', 'frontend', 'backend', 'ai/ml', 'mobile', 'devops'];
const VALID_STATUSES = ['completed', 'in progress', 'planned'];

/**
 * Validates GET /api/projects query parameters.
 * Ensures category, status, and featured are valid values if provided.
 */
const validateGetProjects = (req, res, next) => {
  const { category, status, featured } = req.query;

  // Validate category if provided
  if (category && !VALID_CATEGORIES.includes(category.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid category: "${category}". Valid categories: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  // Validate status if provided
  if (status && !VALID_STATUSES.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid status: "${status}". Valid statuses: ${VALID_STATUSES.join(', ')}`,
    });
  }

  // Validate featured if provided
  if (featured !== undefined && featured !== 'true' && featured !== 'false') {
    return res.status(400).json({
      success: false,
      message: 'Invalid featured value. Must be "true" or "false".',
    });
  }

  next();
};

/**
 * Validates GET /api/projects/:id parameter.
 * Ensures the ID follows the expected format.
 */
const validateGetProjectById = (req, res, next) => {
  const { id } = req.params;

  // Check that ID is a non-empty string
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project ID. Must be a non-empty string.',
    });
  }

  next();
};

module.exports = {
  validateGetProjects,
  validateGetProjectById,
};
