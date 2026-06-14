// ============================================
// Portfolio OS 2026 — Skills Service
// ============================================
// Business logic layer for skills data.
// Returns skills organized by category with optional filtering.
//
// MVC Flow: Route → Controller → Service → Data File

const { readJsonFile } = require('../utils/fileReader');

/**
 * Retrieves all skills data.
 * Optionally filters by category name.
 *
 * @param {Object} filters - Optional query filters
 * @param {string} [filters.category] - Filter by category name (e.g., "Frontend", "Backend")
 * @returns {Promise<Object>} - The skills data object with categories array
 */
const getAllSkills = async (filters = {}) => {
  const skillsData = await readJsonFile('skills.json');

  // If a category filter is provided, return only that category
  if (filters.category) {
    const filtered = skillsData.categories.filter(
      (cat) => cat.name.toLowerCase() === filters.category.toLowerCase()
    );

    if (filtered.length === 0) {
      const error = new Error(`Skill category not found: ${filters.category}`);
      error.statusCode = 404;
      throw error;
    }

    return { categories: filtered };
  }

  return skillsData;
};

module.exports = {
  getAllSkills,
};
