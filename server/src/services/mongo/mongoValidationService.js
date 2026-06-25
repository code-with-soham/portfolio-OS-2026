class MongoValidationService {
  constructor() {
    this.ALLOWED_COLLECTIONS = ['movies', 'embedded_movies', 'users', 'sessions', 'theaters'];
    this.ALLOWED_OPERATIONS = ['find', 'aggregate', 'count'];
    this.FORBIDDEN_STAGES = ['$out', '$merge', '$currentOp', 'eval', '$where'];
  }

  validatePlan(executionPlan) {
    const warnings = [];

    if (!executionPlan.collection || !this.ALLOWED_COLLECTIONS.includes(executionPlan.collection)) {
      throw new Error(`Invalid or unauthorized collection: ${executionPlan.collection}`);
    }

    if (!executionPlan.operation || !this.ALLOWED_OPERATIONS.includes(executionPlan.operation)) {
      throw new Error(`Invalid or unauthorized operation: ${executionPlan.operation}`);
    }

    // Validate Pipeline
    if (executionPlan.operation === 'aggregate' && Array.isArray(executionPlan.pipeline)) {
      executionPlan.pipeline.forEach(stage => {
        const stageName = Object.keys(stage)[0];
        if (this.FORBIDDEN_STAGES.includes(stageName)) {
          throw new Error(`Forbidden aggregation stage detected: ${stageName}`);
        }
      });

      if (executionPlan.pipeline.length > 5) {
        warnings.push("Complex pipeline detected (>5 stages). Performance may be impacted.");
      }
    }

    // Validate Filter
    if (executionPlan.filter) {
      const filterStr = JSON.stringify(executionPlan.filter);
      if (filterStr.includes('$where') || filterStr.includes('eval')) {
        throw new Error("Forbidden operators detected in filter.");
      }
    }

    // Complexity Estimation
    let estimatedCost = "Low";
    if (executionPlan.operation === 'aggregate') {
      estimatedCost = executionPlan.pipeline.length > 3 ? "High" : "Medium";
    }

    return {
      isValid: true,
      warnings,
      estimatedCost
    };
  }
}

module.exports = new MongoValidationService();
