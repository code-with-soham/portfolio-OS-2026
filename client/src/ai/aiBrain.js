import { determineIntent } from './fuzzyMatcher';
import { contextManager } from './contextManager';
import { generateResponse } from './responseEngine';
import { INTENTS } from './intents';

class AIBrain {
  constructor() {
    this.context = contextManager;
  }

  /**
   * Process user input and return a smart response
   */
  processInput(text) {
    if (!text || text.trim() === '') return { response: "Please say something!", intent: INTENTS.UNKNOWN };

    const cleanText = text.trim();
    
    // 1. Intent Matching (Fuzzy)
    const intentData = determineIntent(cleanText);
    
    // 2. Get current Context
    const currentContext = this.context.get();
    
    // 3. Generate Response
    const responseText = generateResponse(intentData, cleanText, currentContext);
    
    // 4. Update Context
    this.context.update(intentData.intent, null, { role: 'user', content: cleanText });
    this.context.update(null, null, { role: 'ai', content: responseText });

    // Handle special system commands
    if (responseText === '[SYSTEM_COMMAND: OPEN_APP]') {
       // Returning a specific flag so the UI can handle app launching
       return {
         response: "Opening application...",
         intent: intentData.intent,
         systemCommand: 'OPEN_APP',
         confidence: intentData.confidence
       };
    }

    return {
      response: responseText,
      intent: intentData.intent,
      confidence: intentData.confidence
    };
  }

  // Stubs for future voice integration
  startListening() {
    console.log('Voice recognition starting... (Phase 4)');
  }

  speak(text) {
    console.log(`Speaking: ${text} (Phase 4)`);
  }
}

export const aiBrain = new AIBrain();
