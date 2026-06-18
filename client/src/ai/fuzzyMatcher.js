import Fuse from 'fuse.js';
import { trainingData } from './trainingData';
import { INTENTS } from './intents';
import { knowledgeBase } from './knowledgeBase';
import { extractEntities } from './entityExtractor';

// Setup Fuse instance for Intent Matching
const intentFuse = new Fuse(trainingData, {
  keys: ['text'],
  includeScore: true,
  threshold: 0.4, // Lower means more strict matching
  ignoreLocation: true
});

/**
 * Perform Fuzzy matching to determine user intent, boosted by entity extraction.
 */
export function determineIntent(text) {
  const result = intentFuse.search(text);
  const entities = extractEntities(text);
  
  // Base confidence and intent
  let matchedIntent = INTENTS.SEARCH;
  let confidence = 0;
  let match = null;

  if (result.length > 0) {
    const bestMatch = result[0];
    confidence = Math.round((1 - bestMatch.score) * 100);
    matchedIntent = bestMatch.item.intent;
    match = bestMatch.item.text;
  }
  
  // Contextual Boosting
  // If we found a specific project entity but confidence is low or intent is SEARCH, 
  // assume they are asking about projects.
  if (entities.projectId && (confidence < 50 || matchedIntent === INTENTS.SEARCH)) {
    matchedIntent = INTENTS.PROJECTS;
    confidence = Math.max(confidence, 70); // Boost to an acceptable threshold
  }
  
  if (entities.category && (confidence < 50 || matchedIntent === INTENTS.SEARCH)) {
    matchedIntent = INTENTS.SKILLS;
    confidence = Math.max(confidence, 70);
  }

  return {
    intent: matchedIntent,
    confidence,
    match,
    entities
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
