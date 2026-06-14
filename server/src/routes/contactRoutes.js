// ============================================
// Portfolio OS 2026 — Contact Routes
// ============================================
// Defines routes for the contact form endpoint.
// This is the only POST route in the API.
//
// MVC Flow: Route → Validator → Controller → Service → Nodemailer

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContactForm } = require('../validators/contactValidator');

// POST /api/contact — Submit a contact form message
router.post('/', validateContactForm, contactController.sendMessage);

module.exports = router;
