const express = require('express');
const router = express.Router();
const mongoAiController = require('../controllers/mongoAiController');
const { aiLimiter } = require('../middleware/rateLimiter');

// POST /api/db-ai/generate - Generates execution plan from prompt
router.post('/generate', aiLimiter, mongoAiController.generateQuery);

// POST /api/db-ai/execute - Executes an approved execution plan
router.post('/execute', mongoAiController.executeAiQuery);

module.exports = router;
