// ============================================
// Portfolio OS 2026 — Timeline Routes
// ============================================
// Defines all routes related to the /timeline resource.
//
// MVC Flow: Route → Validator → Controller → Service → Data

const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');
const { validateGetTimeline } = require('../validators/timelineValidator');

// GET /api/timeline — Retrieve all timeline events (with optional type filter + sort)
router.get('/', validateGetTimeline, timelineController.getAllTimeline);

module.exports = router;
