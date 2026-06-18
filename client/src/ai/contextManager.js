class ContextManager {
  constructor() {
    this.reset();
  }

  reset() {
    this.context = {
      lastIntent: null,
      lastEntity: null, // Track specific project, skill, category
      conversationHistory: []
    };
  }

  update(intent, entity, message) {
    if (intent) this.context.lastIntent = intent;
    
    // Update entity if explicitly found, or keep the old one contextually
    if (entity && (entity.projectId || entity.category)) {
      this.context.lastEntity = entity;
    }
    
    if (message) {
      this.context.conversationHistory.push(message);
      // Keep last 10 messages for deep context
      if (this.context.conversationHistory.length > 10) {
        this.context.conversationHistory.shift();
      }
    }
  }

  get() {
    return this.context;
  }
}

// Export a singleton instance
export const contextManager = new ContextManager();
