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

// Whitelist of allowed collections
const ALLOWED_COLLECTIONS = ['movies', 'embedded_movies', 'users', 'sessions', 'theaters'];

const validateCollection = (collectionName) => {
  if (!ALLOWED_COLLECTIONS.includes(collectionName)) {
    throw new Error(`Invalid collection: ${collectionName}. Allowed: ${ALLOWED_COLLECTIONS.join(', ')}`);
  }
};

exports.getCollectionDocuments = async (req, res) => {
  try {
    const { collection } = req.params;
    validateCollection(collection);
    
    const { page, limit, sort, order, search } = req.query;
    const data = await mongoService.getDocuments(collection, { page, limit, sort, order, search });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get documents', details: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { collection, id } = req.params;
    validateCollection(collection);
    
    const document = await mongoService.getDocument(collection, id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get document', details: error.message });
  }
};

exports.getSchema = async (req, res) => {
  try {
    const { collection } = req.params;
    validateCollection(collection);
    
    const schema = await mongoService.getSchema(collection);
    res.json(schema);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get schema', details: error.message });
  }
};

exports.getCollectionStats = async (req, res) => {
  try {
    const { collection } = req.params;
    validateCollection(collection);
    
    const stats = await mongoService.getCollectionStats(collection);
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get collection stats', details: error.message });
  }
};

exports.getIndexes = async (req, res) => {
  try {
    const { collection } = req.params;
    validateCollection(collection);
    
    const indexes = await mongoService.getIndexes(collection);
    res.json(indexes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get indexes', details: error.message });
  }
};
