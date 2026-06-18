import { determineIntent } from './fuzzyMatcher';
import { contextManager } from './contextManager';
import { generateResponse } from './responseEngine';
import { INTENTS } from './intents';
import { useAIAnalyticsStore } from '../store/useAIAnalyticsStore';

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
    
    const startTime = Date.now();
    
    // 1. Intent Matching (Fuzzy)
    const intentData = determineIntent(cleanText);
    
    // 2. Get current Context
    const currentContext = this.context.get();
    
    // Confidence System: if confidence is mid-range, we ask for clarification
    let finalIntent = intentData.intent;
    let finalResponseText = '';

    if (intentData.confidence > 40 && intentData.confidence < 65 && intentData.intent !== INTENTS.SEARCH && intentData.intent !== INTENTS.UNKNOWN) {
      // Suggest the intent
      const suggestedStr = intentData.intent.replace(/_/g, ' ').toLowerCase();
      finalResponseText = `I am not entirely sure, did you mean to ask about **${suggestedStr}**?`;
      finalIntent = INTENTS.HELP; // or keep original but change text
    } else {
      // 3. Generate Response
      finalResponseText = generateResponse(intentData, cleanText, currentContext) || "I'm still learning! Could you try asking about my projects, skills, or experience?";
    }
    
    // 4. Update Context & Analytics
    this.context.update(intentData.intent, intentData.entities, { role: 'user', content: cleanText });
    this.context.update(null, null, { role: 'ai', content: finalResponseText });

    const responseTimeMs = Date.now() - startTime;
    useAIAnalyticsStore.getState().trackQuery(finalIntent, cleanText, responseTimeMs);

    // Handle special system commands
    if (finalResponseText === '[SYSTEM_COMMAND: OPEN_APP]') {
       return {
         response: "Opening application...",
         intent: finalIntent,
         systemCommand: 'OPEN_APP',
         confidence: intentData.confidence
       };
    }

    return {
      response: finalResponseText,
      intent: finalIntent,
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
