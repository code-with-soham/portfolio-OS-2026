// ============================================
// Portfolio OS 2026 — Achievements Routes
// ============================================
// Defines all routes related to the /achievements resource.
//
// MVC Flow: Route → Validator → Controller → Service → Data

const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievementsController');
const { validateGetAchievements } = require('../validators/achievementsValidator');

// GET /api/achievements — Retrieve all achievements (with optional category filter)
router.get('/', validateGetAchievements, achievementsController.getAllAchievements);

module.exports = router;
