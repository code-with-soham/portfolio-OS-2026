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
}

module.exports = new MongoService();
