import Fuse from 'fuse.js';
import { trainingData } from './trainingData';
import { INTENTS } from './intents';
import { knowledgeBase } from './knowledgeBase';

// Setup Fuse instance for Intent Matching
const intentFuse = new Fuse(trainingData, {
  keys: ['text'],
  includeScore: true,
  threshold: 0.4, // Lower means more strict matching
  ignoreLocation: true
});

/**
 * Perform Fuzzy matching to determine user intent.
 */
export function determineIntent(text) {
  const result = intentFuse.search(text);
  
  if (result.length > 0) {
    const bestMatch = result[0];
    // Convert score (0 is perfect, 1 is total mismatch) to confidence %
    const confidence = Math.round((1 - bestMatch.score) * 100);
    
    // If confidence is decent, return the matched intent
    if (confidence > 50) {
      return {
        intent: bestMatch.item.intent,
        confidence,
        match: bestMatch.item.text
      };
    }
  }
  
  return {
    intent: INTENTS.SEARCH,
    confidence: 0,
    match: null
  };
}

/**
 * Semantic search across knowledge base.
 */
export function semanticSearch(query) {
  const data = knowledgeBase.getAllData();
  
  // Create a combined array of searchable items
  const searchableItems = [
    ...data.projects.map(p => ({ type: 'project', data: p, text: `${p.title} ${p.description} ${p.techStack.join(' ')}` })),
    ...data.achievements.map(a => ({ type: 'achievement', data: a, text: `${a.title} ${a.description}` })),
    ...data.timeline.map(t => ({ type: 'timeline', data: t, text: `${t.title} ${t.description} ${t.organization}` }))
  ];
  
  const searchFuse = new Fuse(searchableItems, {
    keys: ['text'],
    includeScore: true,
    threshold: 0.5,
    ignoreLocation: true
  });
  
  const results = searchFuse.search(query);
  return results.map(r => r.item);
}
