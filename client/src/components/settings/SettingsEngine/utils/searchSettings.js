/**
 * Native Search Scoring Algorithm for Settings
 * Evaluates a query against an array of setting objects.
 * 
 * @param {Array} settingsArray - Flat array of setting objects
 * @param {string} query - The search query
 * @returns {Array} - Sorted array of matching settings with _score property
 */
export function scoreSettings(settingsArray, query) {
  if (!query || query.trim() === '') return settingsArray;
  
  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\s+/);
  
  return settingsArray
    .map(setting => {
      let score = 0;
      
      const title = (setting.title || '').toLowerCase();
      const desc = (setting.description || '').toLowerCase();
      const cat = (setting.category || '').toLowerCase();
      const section = (setting.section || '').toLowerCase();
      
      // Exact Title Match
      if (title === lowerQuery) {
        score += 100;
      }
      
      // Title Contains or Starts With Match
      if (title.includes(lowerQuery)) {
        score += 50;
      } else if (title.split(' ').some(word => word.startsWith(lowerQuery))) {
        score += 30;
      }

      // Keyword Match (highest relevance if keyword specifically added)
      if (setting.searchKeywords && Array.isArray(setting.searchKeywords)) {
        if (setting.searchKeywords.some(kw => kw.toLowerCase() === lowerQuery)) {
          score += 60;
        } else if (setting.searchKeywords.some(kw => kw.toLowerCase().includes(lowerQuery))) {
          score += 20;
        }
      }

      // Description Match
      if (desc.includes(lowerQuery)) score += 10;
      
      // Category / Section Match
      if (cat.includes(lowerQuery) || section.includes(lowerQuery)) score += 5;
      
      // Multi-word fuzzy match (if they typed "dark theme", match if both words are in title/desc)
      if (queryWords.length > 1) {
        const matchesAllWords = queryWords.every(word => 
          title.includes(word) || desc.includes(word) || cat.includes(word)
        );
        if (matchesAllWords) score += 40;
      }

      return { ...setting, _score: score };
    })
    .filter(item => item._score > 0)
    .sort((a, b) => b._score - a._score);
}
