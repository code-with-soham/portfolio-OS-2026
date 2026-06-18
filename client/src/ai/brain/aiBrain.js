import { detectIntent } from './intentEngine';
import { extractEntities } from './entityExtractor';
import { contextManager } from './contextManager';
import { executeAction } from './actionExecutor';
import { generateResponse } from './responseGenerator';
import { INTENTS } from '../training/intents';
import { useAIAnalyticsStore } from '../../store/useAIAnalyticsStore';

class AIBrain {
  constructor() {
    this.context = contextManager;
  }

  processInput(text) {
    if (!text || text.trim() === '') return { response: "Please say something!", intent: INTENTS.UNKNOWN };

    const cleanText = text.trim();
    const startTime = Date.now();
    
    // 1. Intent Matching (Fuzzy)
    const intentData = detectIntent(cleanText);
    
    // 2. Entity Extraction
    const entities = extractEntities(cleanText);

    // Confidence System: if confidence is mid-range, we ask for clarification
    let finalIntent = intentData.intent;
    let finalResponseText = '';
    let systemActionOutput = null;

    if (intentData.confidence > 40 && intentData.confidence < 65 && intentData.intent !== INTENTS.SEARCH && intentData.intent !== INTENTS.UNKNOWN) {
      const suggestedStr = intentData.intent.replace(/_/g, ' ').toLowerCase();
      finalResponseText = `I am not entirely sure, did you mean to ask about **${suggestedStr}**?`;
      finalIntent = INTENTS.SEARCH; 
    } else {
      // 3. Update Context BEFORE generation, so responseGenerator can use last known good state
      this.context.addInteraction(cleanText, null, finalIntent, entities);

      // 4. Action Execution
      systemActionOutput = executeAction(finalIntent, entities, intentData);

      if (systemActionOutput) {
        // If an OS action was taken, return that as the response
        finalResponseText = systemActionOutput;
      } else {
        // 5. Generate Text Response
        finalResponseText = generateResponse(finalIntent, entities, this.context) || "I'm still learning! Could you try asking about my projects, skills, or experience?";
      }
    }
    
    // Update the AI response in context
    const history = this.context.getHistory();
    if (history.length > 0) {
      history[history.length - 1].ai = finalResponseText;
    }

    const responseTimeMs = Date.now() - startTime;
    useAIAnalyticsStore.getState().trackQuery(finalIntent, cleanText, responseTimeMs);

    return {
      response: finalResponseText,
      intent: finalIntent,
      confidence: intentData.confidence,
      systemCommand: systemActionOutput ? finalIntent : null
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
