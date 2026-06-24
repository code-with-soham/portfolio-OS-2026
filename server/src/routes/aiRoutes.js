const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

const { aiLimiter } = require('../middleware/rateLimiter');

// POST /api/ai/generate
router.post('/generate', aiLimiter, aiController.handleGeminiRequest);

module.exports = router;
