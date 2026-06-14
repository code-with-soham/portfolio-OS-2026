// ============================================
// Portfolio OS 2026 — Projects Routes
// ============================================
// Defines all routes related to the /projects resource.
//
// MVC Flow: Route → Validator → Controller → Service → Data

const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { validateGetProjects, validateGetProjectById } = require('../validators/projectsValidator');

// GET /api/projects — Retrieve all projects (with optional filters)
router.get('/', validateGetProjects, projectsController.getAllProjects);

// GET /api/projects/:id — Retrieve a single project by ID
router.get('/:id', validateGetProjectById, projectsController.getProjectById);

module.exports = router;
