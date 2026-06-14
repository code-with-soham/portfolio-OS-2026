// ============================================
// Portfolio OS 2026 — Achievements Validator
// ============================================
// Validates request parameters for achievements endpoints.

const VALID_CATEGORIES = ['coding', 'award', 'competition', 'publication', 'professional', 'open-source'];

/**
 * Validates GET /api/achievements query parameters.
 */
const validateGetAchievements = (req, res, next) => {
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
  validateGetAchievements,
};
