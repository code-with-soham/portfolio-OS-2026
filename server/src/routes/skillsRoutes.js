// ============================================
// Portfolio OS 2026 — Skills Routes
// ============================================
// Defines all routes related to the /skills resource.
//
// MVC Flow: Route → Validator → Controller → Service → Data

const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');
const { validateGetSkills } = require('../validators/skillsValidator');

// GET /api/skills — Retrieve all skills (with optional category filter)
router.get('/', validateGetSkills, skillsController.getAllSkills);

module.exports = router;
