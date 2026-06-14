// ============================================
// Portfolio OS 2026 — Projects Service
// ============================================
// Business logic layer for projects data.
// Supports fetching all projects (with optional filtering)
// and fetching a single project by ID.
//
// MVC Flow: Route → Controller → Service → Data File

const { readJsonFile } = require('../utils/fileReader');

/**
 * Retrieves all projects, with optional filtering.
 *
 * @param {Object} filters - Optional query filters
 * @param {string} [filters.category] - Filter by category (e.g., "Full Stack", "AI/ML")
 * @param {string} [filters.status] - Filter by status (e.g., "Completed", "In Progress")
 * @param {boolean} [filters.featured] - Filter featured projects only
 * @returns {Promise<Array>} - Array of project objects
 */
const getAllProjects = async (filters = {}) => {
  let projects = await readJsonFile('projects.json');

  // Apply category filter
  if (filters.category) {
    projects = projects.filter(
      (p) => p.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Apply status filter
  if (filters.status) {
    projects = projects.filter(
      (p) => p.status.toLowerCase() === filters.status.toLowerCase()
    );
  }

  // Apply featured filter
  if (filters.featured !== undefined) {
    const isFeatured = filters.featured === 'true' || filters.featured === true;
    projects = projects.filter((p) => p.featured === isFeatured);
  }

  return projects;
};

/**
 * Retrieves a single project by its ID.
 *
 * @param {string} id - The project ID (e.g., "proj-001")
 * @returns {Promise<Object>} - The project object
 * @throws {Error} - If the project is not found (404)
 */
const getProjectById = async (id) => {
  const projects = await readJsonFile('projects.json');
  const project = projects.find((p) => p.id === id);

  if (!project) {
    const error = new Error(`Project not found: ${id}`);
    error.statusCode = 404;
    throw error;
  }

  return project;
};

module.exports = {
  getAllProjects,
  getProjectById,
};
