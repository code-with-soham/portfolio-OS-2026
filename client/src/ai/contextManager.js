class ContextManager {
  constructor() {
    this.reset();
  }

  reset() {
    this.context = {
      lastIntent: null,
      lastEntity: null, // could be a specific project, skill, etc.
      conversationHistory: []
    };
  }

  update(intent, entity, message) {
    if (intent) this.context.lastIntent = intent;
    if (entity) this.context.lastEntity = entity;
    
    if (message) {
      this.context.conversationHistory.push(message);
      // Keep only last 10 messages
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
