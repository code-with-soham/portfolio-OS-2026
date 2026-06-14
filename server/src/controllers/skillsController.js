// ============================================
// Portfolio OS 2026 — Skills Controller
// ============================================
// Request handler for skills-related endpoints.
//
// MVC Flow: Route → Controller → Service → Data File

const skillsService = require('../services/skillsService');

/**
 * GET /api/skills
 * Returns all skills organized by category.
 *
 * Query params:
 *   ?category=Frontend — Filter by category name
 */
const getAllSkills = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
    };

    const skills = await skillsService.getAllSkills(filters);

    res.status(200).json({
      success: true,
      message: 'Skills retrieved successfully',
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkills,
};
