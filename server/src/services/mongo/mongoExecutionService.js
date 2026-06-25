const mongoService = require('../../services/mongoService'); // Reuse the connection

class MongoExecutionService {
  /**
   * Execute a structured query object directly
   * @param {Object} executionPlan - The parsed execution plan from the AI
   */
  async executeStructuredPlan(executionPlan) {
    const db = mongoService.getDb();
    const { collection: collectionName, operation, pipeline, filter, projection, sort, limit, skip } = executionPlan;

    if (!collectionName || !operation) {
      throw new Error("Missing collection or operation in execution plan");
    }

    const collection = db.collection(collectionName);
    const startTime = Date.now();
    let result;
    let cursor;

    try {
      switch (operation) {
        case 'aggregate':
          cursor = collection.aggregate(pipeline || []);
          break;
        case 'find':
          cursor = collection.find(filter || {}, { projection: projection || {} });
          if (sort && Object.keys(sort).length > 0) cursor = cursor.sort(sort);
          if (skip) cursor = cursor.skip(skip);
          if (limit) cursor = cursor.limit(Math.min(limit, 100)); // Hard cap for safety
          break;
        case 'count':
          result = await collection.countDocuments(filter || {});
          break;
        case 'distinct':
          // For distinct, pipeline array first element is often used as the field in AI schemas,
          // but let's assume filter has the field name or it's passed differently.
          // Fallback to aggregate for complex distincts
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      if (cursor) {
        // Enforce max limits
        if (!limit || limit > 100) {
           cursor.limit(limit ? Math.min(limit, 100) : 50);
        }
        result = await cursor.toArray();
      }
    } catch (error) {
      throw new Error(`Execution failed: ${error.message}`);
    }

    const latency = Date.now() - startTime;

    return {
      success: true,
      data: result,
      executionTimeMs: latency,
      rows: Array.isArray(result) ? result.length : 1,
      plan: executionPlan
    };
  }
}

module.exports = new MongoExecutionService();
