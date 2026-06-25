const vectorSearchService = require('../services/vector/vectorSearchService');
const semanticExplanationService = require('../services/explanation/semanticExplanationService');
const geminiEmbeddingService = require('../services/embedding/geminiEmbeddingService');

exports.queryMovies = async (req, res) => {
  try {
    const { prompt, mode } = req.body; // mode: 'keyword', 'semantic', 'hybrid'

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 1. Perform Search
    const searchResult = await vectorSearchService.search(prompt, mode || 'semantic', 12);

    // 2. Generate AI Explanation
    let explanation = null;
    if (searchResult.data.length > 0 && mode !== 'keyword') {
      explanation = await semanticExplanationService.generateExplanation(prompt, searchResult.data);
    } else if (mode === 'keyword') {
       explanation = {
         summary: "Keyword search matches exact text fields without semantic understanding.",
         matchedConcepts: [],
         confidence: 1.0
       };
    }

    // 3. Return Combined Payload
    res.json({
      ...searchResult,
      explanation
    });

  } catch (error) {
    console.error('Vector Search Error:', error);
    res.status(500).json({ error: 'Failed to execute vector search', details: error.message });
  }
};

exports.runPipeline = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const result = await geminiEmbeddingService.runEmbeddingPipeline(limit);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Embedding Pipeline Error:', error);
    res.status(500).json({ error: 'Failed to run embedding pipeline', details: error.message });
  }
};
