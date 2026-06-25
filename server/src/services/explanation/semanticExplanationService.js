const geminiClient = require('../gemini/geminiClient');

class SemanticExplanationService {
  /**
   * Generates a structured explanation for a set of search results.
   */
  async generateExplanation(prompt, results) {
    if (!results || results.length === 0) {
      return {
        summary: "No matches found.",
        matchedConcepts: [],
        confidence: 0
      };
    }

    // Pass the top 3 results to Gemini for explanation
    const contextMovies = results.slice(0, 3).map(m => ({
      title: m.title,
      plot: m.plot,
      genres: m.genres
    }));

    const systemInstruction = `
You are an expert movie analyst.
A user searched for: "${prompt}".
The vector search engine returned the following top movies:
${JSON.stringify(contextMovies, null, 2)}

Provide a structured explanation of WHY these movies matched the user's search conceptually.
You MUST return your answer as a JSON object strictly matching this schema:
{
  "summary": "A 1-2 sentence explanation of the shared semantic themes.",
  "matchedConcepts": ["Concept 1", "Concept 2", "Concept 3"],
  "confidence": number // A float between 0.0 and 1.0 representing how well the results match the prompt
}
`;

    try {
      const explanation = await geminiClient.generateStructuredContent(
        `Explain the semantic link between "${prompt}" and these results.`, 
        systemInstruction
      );
      
      return explanation;
    } catch (err) {
      console.error('Explanation generation failed:', err.message);
      return {
        summary: "Failed to generate AI explanation.",
        matchedConcepts: [],
        confidence: 0
      };
    }
  }
}

module.exports = new SemanticExplanationService();
