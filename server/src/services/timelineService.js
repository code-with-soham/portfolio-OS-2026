// ============================================
// Portfolio OS 2026 — Timeline Service
// ============================================
// Business logic layer for timeline data.
// Returns timeline events sorted by date with optional type filtering.
//
// MVC Flow: Route → Controller → Service → Data File

const { readJsonFile } = require('../utils/fileReader');

/**
 * Retrieves all timeline events.
 * Optionally filters by event type and sorts chronologically.
 *
 * @param {Object} filters - Optional query filters
 * @param {string} [filters.type] - Filter by type (e.g., "education", "project", "experience")
 * @param {string} [filters.sort] - Sort order: "asc" or "desc" (default: "desc" — newest first)
 * @returns {Promise<Array>} - Array of timeline event objects
 */
const getAllTimeline = async (filters = {}) => {
  let timeline = await readJsonFile('timeline.json');

  // Apply type filter
  if (filters.type) {
    timeline = timeline.filter(
      (event) => event.type.toLowerCase() === filters.type.toLowerCase()
    );
  }

  // Sort by start date (default: newest first)
  const sortOrder = filters.sort === 'asc' ? 1 : -1;
  timeline.sort((a, b) => {
    return sortOrder * (new Date(b.startDate) - new Date(a.startDate));
  });

  return timeline;
};

module.exports = {
  getAllTimeline,
};
