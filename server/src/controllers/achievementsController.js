// ============================================
// Portfolio OS 2026 — Achievements Controller
// ============================================
// Request handler for achievements-related endpoints.
//
// MVC Flow: Route → Controller → Service → Data File

const achievementsService = require('../services/achievementsService');

/**
 * GET /api/achievements
 * Returns all achievements, sorted by date.
 *
 * Query params:
 *   ?category=award — Filter by category
 */
const getAllAchievements = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
    };

    const achievements = await achievementsService.getAllAchievements(filters);

    res.status(200).json({
      success: true,
      message: 'Achievements retrieved successfully',
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAchievements,
};
