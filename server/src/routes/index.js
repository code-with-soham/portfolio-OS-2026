// ============================================
// Portfolio OS 2026 — Route Aggregator
// ============================================
// This file aggregates all resource-specific route files into a single router.
// The main app.js imports this file and mounts it on /api.
//
// To add a new resource:
// 1. Create a route file in this directory (e.g., newRoutes.js)
// 2. Import it here
// 3. Mount it with router.use('/resource-name', resourceRoutes)
//
// All routes registered here will be prefixed with /api (set in app.js)

const express = require('express');
const router = express.Router();

// Import resource route files
const profileRoutes = require('./profileRoutes');
const projectsRoutes = require('./projectsRoutes');
const skillsRoutes = require('./skillsRoutes');
const timelineRoutes = require('./timelineRoutes');
const achievementsRoutes = require('./achievementsRoutes');
const contactRoutes = require('./contactRoutes');

// Import middleware
const { responseCache } = require('../middleware/responseCache');
const { contactLimiter } = require('../middleware/rateLimiter');

// ========================
// Mount routes
// ========================

// GET /api/profile → Profile data
router.use('/profile', responseCache(), profileRoutes);

// GET /api/projects → All projects (with filtering)
// GET /api/projects/:id → Single project by ID
router.use('/projects', responseCache(), projectsRoutes);

// GET /api/skills → All skills (with category filter)
router.use('/skills', responseCache(), skillsRoutes);

// GET /api/timeline → Timeline events (with type filter + sort)
router.use('/timeline', responseCache(), timelineRoutes);

// GET /api/achievements → All achievements (with category filter)
router.use('/achievements', responseCache(), achievementsRoutes);

// POST /api/contact → Contact form submission (strict rate limit, no caching)
router.use('/contact', contactLimiter, contactRoutes);

module.exports = router;
