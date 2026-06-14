// ============================================
// Portfolio OS 2026 — Projects Controller
// ============================================
// Request handlers for project-related endpoints.
// Controllers parse the request, delegate to services, and format responses.
//
// MVC Flow: Route → Controller → Service → Data File

const projectsService = require('../services/projectsService');

/**
 * GET /api/projects
 * Returns all projects with optional filtering.
 *
 * Query params:
 *   ?category=Full+Stack — Filter by category
 *   ?status=Completed    — Filter by status
 *   ?featured=true       — Filter featured projects only
 */
const getAllProjects = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
      featured: req.query.featured,
    };

    const projects = await projectsService.getAllProjects(filters);

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id
 * Returns a single project by its ID.
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await projectsService.getProjectById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
};
