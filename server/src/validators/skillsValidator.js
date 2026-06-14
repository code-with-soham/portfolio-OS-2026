// ============================================
// Portfolio OS 2026 — Skills Validator
// ============================================
// Validates request parameters for skills endpoints.

const VALID_CATEGORIES = ['frontend', 'backend', 'tools & devops', 'ai/ml'];

/**
 * Validates GET /api/skills query parameters.
 */
const validateGetSkills = (req, res, next) => {
  const { category } = req.query;

  if (category && !VALID_CATEGORIES.includes(category.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid category: "${category}". Valid categories: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  next();
};

module.exports = {
  validateGetSkills,
};
