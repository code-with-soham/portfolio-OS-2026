const mongoService = require('../services/mongoService');

exports.getStatus = async (req, res) => {
  try {
    const status = await mongoService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get database status', details: error.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const collections = await mongoService.getCollections();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get collections', details: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await mongoService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get database stats', details: error.message });
  }
};

exports.getHealth = async (req, res) => {
  try {
    const health = await mongoService.getHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check database health', details: error.message });
  }
};
