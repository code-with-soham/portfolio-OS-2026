const express = require('express');
const router = express.Router();
const { getHelpCommands } = require('../controllers/terminalController');

// @route   GET /api/terminal/help
// @desc    Get terminal help commands
// @access  Public
router.get('/help', getHelpCommands);

module.exports = router;
