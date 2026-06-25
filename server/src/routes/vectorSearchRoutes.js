const express = require('express');
const router = express.Router();
const vectorSearchController = require('../controllers/vectorSearchController');
const { aiLimiter } = require('../middleware/rateLimiter');

// POST /api/vector-search/query - Search the database using keywords or semantics
router.post('/query', aiLimiter, vectorSearchController.queryMovies);

// POST /api/vector-search/embed-pipeline - Trigger the embedding pipeline manually
router.post('/embed-pipeline', vectorSearchController.runPipeline);

module.exports = router;
