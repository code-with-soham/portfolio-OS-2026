class ContextManager {
  constructor() {
    this.history = [];
    this.lastIntent = null;
    this.lastEntities = null;
  }

  addInteraction(userInput, aiResponse, intent, entities) {
    this.history.push({
      user: userInput,
      ai: aiResponse,
      intent,
      entities,
      timestamp: Date.now()
    });

    // Keep history short
    if (this.history.length > 50) {
      this.history.shift();
    }

    if (intent && intent !== "SEARCH" && intent !== "UNKNOWN") {
      this.lastIntent = intent;
    }
    
    if (entities && Object.keys(entities).length > 0) {
      this.lastEntities = entities;
    }
  }

  getLastIntent() {
    return this.lastIntent;
  }

  getLastEntities() {
    return this.lastEntities;
  }
  
  getHistory() {
    return this.history;
  }

  clear() {
    this.history = [];
    this.lastIntent = null;
    this.lastEntities = null;
  }
}

export const contextManager = new ContextManager();
