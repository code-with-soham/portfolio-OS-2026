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

  /**
   * Safely execute a raw MongoDB shell query string
   */
  async executeQuery(queryString) {
    const db = this.getDb();
    
    // 1. Basic format validation using Regex
    // Matches: db.<collection>.<method>(<args>)
    // Improved regex to handle newlines and chained methods (rudimentary support)
    const queryRegex = /^db\.([a-zA-Z0-9_]+)\.(find|aggregate|count|distinct|limit|skip|sort)\(([\s\S]*)\)(?:\.(limit|skip|sort)\(([\s\S]*)\))?(?:\.(limit|skip|sort)\(([\s\S]*)\))?$/;
    
    const match = queryString.trim().match(queryRegex);
    if (!match) {
      throw new Error("Invalid query format. Expected format: db.collection.method({...})");
    }

    const collectionName = match[1];
    const method = match[2];
    const argsStr = match[3];

    // Allowed Collections Whitelist
    const ALLOWED_COLLECTIONS = ['movies', 'embedded_movies', 'users', 'sessions', 'theaters'];
    if (!ALLOWED_COLLECTIONS.includes(collectionName)) {
      throw new Error(`Unauthorized collection: ${collectionName}. Allowed: ${ALLOWED_COLLECTIONS.join(', ')}`);
    }

    // Allowed Methods Whitelist (Read-Only)
    const ALLOWED_METHODS = ['find', 'aggregate', 'count', 'distinct', 'limit', 'skip', 'sort'];
    if (!ALLOWED_METHODS.includes(method)) {
      throw new Error(`Unauthorized method: ${method}. Only read operations are allowed.`);
    }

    // 2. Safe Parsing using VM module
    // We create an isolated sandbox to evaluate the JS object literal arguments safely
    const vm = require('vm');
    let parsedArgs = [];
    
    if (argsStr && argsStr.trim().length > 0) {
      try {
        // We wrap the args in an array so multiple arguments (e.g. find(query, projection)) parse correctly
        const sandbox = {};
        vm.createContext(sandbox);
        // Using "return [...]" isn't direct in vm.runInContext for expressions, 
        // evaluating an array literal evaluates to the array
        const script = new vm.Script(`[${argsStr}]`);
        parsedArgs = script.runInContext(sandbox, { timeout: 100 }); 
      } catch (e) {
        throw new Error(`Failed to parse query arguments: ${e.message}`);
      }
    }

    const collection = db.collection(collectionName);
    
    // 3. Execution
    const startTime = Date.now();
    let result;
    let cursor;

    switch (method) {
      case 'find':
        cursor = collection.find(...parsedArgs);
        break;
      case 'aggregate':
        cursor = collection.aggregate(...parsedArgs);
        break;
      case 'count':
        result = await collection.countDocuments(...parsedArgs);
        break;
      case 'distinct':
        result = await collection.distinct(...parsedArgs);
        break;
      default:
        // Handle standalone limit, skip, sort on a blank find
        cursor = collection.find({});
        cursor = cursor[method](...parsedArgs);
        break;
    }

    // 4. Chain processing (limit, skip, sort)
    // Extract chained methods from match groups 4-5 and 6-7
    const applyChained = (chainedMethod, chainedArgsStr) => {
      if (!chainedMethod) return;
      if (!cursor) throw new Error(`Cannot chain .${chainedMethod}() onto a non-cursor result`);
      
      try {
        const sandbox = {};
        vm.createContext(sandbox);
        const script = new vm.Script(`[${chainedArgsStr}]`);
        const chainedArgs = script.runInContext(sandbox, { timeout: 100 });
        cursor = cursor[chainedMethod](...chainedArgs);
      } catch (e) {
        throw new Error(`Failed to parse arguments for .${chainedMethod}()`);
      }
    };

    applyChained(match[4], match[5]);
    applyChained(match[6], match[7]);

    // 5. Resolution
    if (cursor) {
      // By default, cap massive playground queries to prevent memory crashes
      const limitExceedsMax = cursor.cmd?.limit > 100;
      if (!cursor.cmd?.limit || limitExceedsMax) {
         cursor.limit(limitExceedsMax ? Math.min(cursor.cmd.limit, 100) : 50);
      }
      result = await cursor.toArray();
    }

    const latency = Date.now() - startTime;

    return {
      success: true,
      data: result,
      executionTimeMs: latency,
      rows: Array.isArray(result) ? result.length : 1
    };
  }
}

module.exports = new MongoService();
