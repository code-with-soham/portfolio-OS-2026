const mongoose = require('mongoose');

class MongoService {
  /**
   * Check if the database is connected
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get the native db object
   */
  getDb() {
    if (!this.isConnected()) throw new Error('Database not connected');
    return mongoose.connection.db;
  }

  /**
   * Get database status and high-level info
   */
  async getStatus() {
    try {
      const db = this.getDb();
      const adminDb = db.admin();
      
      const startTime = Date.now();
      await adminDb.ping();
      const latency = Date.now() - startTime;

      const buildInfo = await adminDb.buildInfo();
      const collections = await db.listCollections().toArray();

      return {
        connected: true,
        cluster: 'Cluster0', // Typically extracted from URI, hardcoded for portfolio
        database: db.databaseName,
        collections: collections.length,
        latency,
        version: buildInfo.version || 'MongoDB Atlas'
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Get list of collections with document counts
   */
  async getCollections() {
    const db = this.getDb();
    const collections = await db.listCollections().toArray();
    
    // Get estimated document count for each collection
    const collectionDetails = await Promise.all(
      collections.map(async (col) => {
        const stats = await db.collection(col.name).estimatedDocumentCount();
        return {
          name: col.name,
          count: stats,
          type: col.type
        };
      })
    );

    return collectionDetails;
  }

  /**
   * Get database statistics
   */
  async getStats() {
    const db = this.getDb();
    return await db.stats();
  }

  /**
   * Basic health check
   */
  async getHealth() {
    return {
      status: this.isConnected() ? 'OK' : 'ERROR',
      readyState: mongoose.connection.readyState
    };
  }

  /**
   * Get documents from a collection with pagination, sorting, and search
   */
  async getDocuments(collectionName, { page = 1, limit = 25, sort = '_id', order = 'asc', search = '' }) {
    const db = this.getDb();
    const collection = db.collection(collectionName);
    
    let query = {};
    if (search) {
      // Basic text search across all string fields is complex without a text index.
      // We will do a generic regex match against a few common fields or use $text if indexed.
      // For a dynamic browser, we can use a $or across common fields or let the user type JSON.
      try {
        if (search.startsWith('{') && search.endsWith('}')) {
          query = JSON.parse(search);
        } else {
          // simple regex on 'title' or 'name' as fallback for sample dataset
          query = {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { name: { $regex: search, $options: 'i' } }
            ]
          };
        }
      } catch (e) {
        // Ignore JSON parse errors for normal text
      }
    }

    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    const cursor = collection.find(query).sort(sortObj).skip(skip).limit(Number(limit));
    const documents = await cursor.toArray();
    const totalCount = await collection.countDocuments(query);

    return {
      documents,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Math.max(1, limit))
    };
  }

  /**
   * Get a single document by ID
   */
  async getDocument(collectionName, id) {
    const db = this.getDb();
    const collection = db.collection(collectionName);
    
    let queryId;
    try {
      queryId = new mongoose.Types.ObjectId(id);
    } catch {
      queryId = id; // Fallback if it's not an ObjectId
    }

    return await collection.findOne({ _id: queryId });
  }

  /**
   * Infer schema from a sample of documents
   */
  async getSchema(collectionName) {
    const db = this.getDb();
    const collection = db.collection(collectionName);
    
    // Sample first 50 documents to infer schema
    const docs = await collection.find({}).limit(50).toArray();
    const schema = {};

    docs.forEach(doc => {
      Object.keys(doc).forEach(key => {
        if (!schema[key]) {
          schema[key] = new Set();
        }
        let type = typeof doc[key];
        if (doc[key] === null) type = 'null';
        else if (Array.isArray(doc[key])) type = 'array';
        else if (doc[key] instanceof Date) type = 'date';
        else if (mongoose.isObjectIdOrHexString(doc[key])) type = 'objectId';
        
        schema[key].add(type);
      });
    });

    // Convert Sets to Arrays for JSON serialization
    const formattedSchema = {};
    Object.keys(schema).forEach(key => {
      formattedSchema[key] = Array.from(schema[key]);
    });

    return formattedSchema;
  }

  /**
   * Get detailed stats for a specific collection
   */
  async getCollectionStats(collectionName) {
    const db = this.getDb();
    const collection = db.collection(collectionName);
    const stats = await collection.stats();
    
    return {
      documents: stats.count,
      storageSize: stats.storageSize,
      indexes: stats.nindexes,
      avgSize: stats.avgObjSize
    };
  }
  /**
   * Get indexes for a specific collection
   */
  async getIndexes(collectionName) {
    const db = this.getDb();
    const collection = db.collection(collectionName);
    const indexes = await collection.indexes();
    
    // Format indexes to match Compass UI expectations (Name, Fields, Unique, Type, Size)
    // Note: To get precise index sizes, we would need to parse stats(), but we'll use a simplified version for this phase
    return indexes.map(idx => ({
      name: idx.name,
      fields: Object.keys(idx.key).join(', '),
      unique: idx.unique || false,
      type: idx.name === '_id_' ? 'regular' : 'custom',
      size: 'N/A' // Requires $indexStats aggregation for exact bytes
    }));
  }
}

module.exports = new MongoService();
