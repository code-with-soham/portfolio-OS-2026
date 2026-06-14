// ============================================
// Portfolio OS 2026 — Profile Routes
// ============================================
// Defines all routes related to the /profile resource.
// Each route maps an HTTP method + path to a validator and controller.
//
// MVC Flow: Route → Validator → Controller → Service → Data

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { validateGetProfile } = require('../validators/profileValidator');

// GET /api/profile — Retrieve full profile data
// Flow: validateGetProfile (middleware) → profileController.getProfile (handler)
router.get('/', validateGetProfile, profileController.getProfile);

module.exports = router;
