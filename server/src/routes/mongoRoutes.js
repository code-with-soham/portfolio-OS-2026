const express = require('express');
const router = express.Router();
const mongoController = require('../controllers/mongoController');

router.get('/status', mongoController.getStatus);
router.get('/collections', mongoController.getCollections);
router.get('/stats', mongoController.getStats);
router.get('/health', mongoController.getHealth);

module.exports = router;
