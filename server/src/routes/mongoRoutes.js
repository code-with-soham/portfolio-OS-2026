const express = require('express');
const router = express.Router();
const mongoController = require('../controllers/mongoController');

router.get('/status', mongoController.getStatus);
router.get('/collections', mongoController.getCollections);
router.get('/stats', mongoController.getStats);
router.get('/health', mongoController.getHealth);

router.get('/collection/:collection', mongoController.getCollectionDocuments);
router.get('/document/:collection/:id', mongoController.getDocument);
router.get('/schema/:collection', mongoController.getSchema);
router.get('/stats/:collection', mongoController.getCollectionStats);
router.get('/indexes/:collection', mongoController.getIndexes);

module.exports = router;
