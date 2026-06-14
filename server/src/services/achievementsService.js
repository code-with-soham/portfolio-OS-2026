// ============================================
// Portfolio OS 2026 — Achievements Service
// ============================================
// Business logic layer for achievements data.
// Returns achievements with optional category filtering.
//
// MVC Flow: Route → Controller → Service → Data File

const { readJsonFile } = require('../utils/fileReader');

/**
 * Retrieves all achievements.
 * Optionally filters by category.
 *
 * @param {Object} filters - Optional query filters
 * @param {string} [filters.category] - Filter by category (e.g., "award", "competition", "coding")
 * @returns {Promise<Array>} - Array of achievement objects
 */
const getAllAchievements = async (filters = {}) => {
  let achievements = await readJsonFile('achievements.json');

  // Apply category filter
  if (filters.category) {
    achievements = achievements.filter(
      (a) => a.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Sort by date (newest first)
  achievements.sort((a, b) => new Date(b.date) - new Date(a.date));

  return achievements;
};

module.exports = {
  getAllAchievements,
};
