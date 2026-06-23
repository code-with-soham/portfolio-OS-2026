const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/generate
router.post('/generate', aiController.handleGeminiRequest);

module.exports = router;
