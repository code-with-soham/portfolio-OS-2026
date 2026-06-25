const crypto = require('crypto');
const mongoService = require('../mongoService');
const geminiClient = require('../gemini/geminiClient');

class VectorSearchService {
  /**
   * Helper to hash the prompt for semantic caching
   */
  _hashPrompt(prompt) {
    return crypto.createHash('sha256').update(prompt.trim().toLowerCase()).digest('hex');
  }

  /**
   * Performs the multi-mode search with Semantic Caching.
   */
  async search(prompt, mode = 'semantic', limit = 10) {
    const db = mongoService.getDb();
    if (!db) throw new Error('Database not connected');

    const targetCollection = db.collection('gemini_embedded_movies');
    let results = [];
    const startTime = Date.now();

    if (mode === 'keyword') {
      // Basic text search. Assumes a text index exists on title/plot, or we can use Atlas Search.
      // We will use $search if configured, or fallback to $regex for portfolio demo.
      // Atlas Search is best, but regex is guaranteed to work without index config for quick demo.
      results = await targetCollection.find({
        $or: [
          { title: { $regex: prompt, $options: 'i' } },
          { plot: { $regex: prompt, $options: 'i' } }
        ]
      }).limit(limit).toArray();

      // Normalize scores for UI (Keyword doesn't have a real percentage score without Atlas Search)
      results = results.map(r => ({ ...r, score: 0.75 })); // Mock 75% for basic match

    } else if (mode === 'semantic' || mode === 'hybrid') {
      // 1. Semantic Cache Lookup
      const cacheCollection = db.collection('prompt_embeddings');
      const hash = this._hashPrompt(prompt);
      let embedding;

      const cached = await cacheCollection.findOne({ hash });
      if (cached) {
        embedding = cached.embedding;
      } else {
        // 2. Generate new embedding
        embedding = await geminiClient.generateEmbedding(prompt);
        
        // 3. Store in cache
        await cacheCollection.insertOne({
          prompt: prompt.trim(),
          hash,
          embedding,
          createdAt: new Date()
        });
      }

      // 4. Perform Vector Search
      // NOTE: User MUST have a vector index created on `gemini_embedded_movies.embedding`.
      const pipeline = [
        {
          $vectorSearch: {
            index: 'vector_index', // This must match the index name in Atlas
            path: 'embedding',
            queryVector: embedding,
            numCandidates: limit * 10,
            limit: limit
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            plot: 1,
            genres: 1,
            year: 1,
            imdb: 1,
            poster: 1,
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ];

      try {
        results = await targetCollection.aggregate(pipeline).toArray();
      } catch (err) {
        console.warn('Vector search failed (likely missing index). Proceeding with empty results.', err.message);
        results = []; // Safe fallback for demo if index isn't ready
      }

      if (mode === 'hybrid') {
        // For hybrid, we would ideally use Atlas Search combined score, 
        // but for this demo, we can just fetch keyword and merge/boost.
        const keywordResults = await targetCollection.find({
          $or: [
            { title: { $regex: prompt, $options: 'i' } },
            { plot: { $regex: prompt, $options: 'i' } }
          ]
        }).limit(5).toArray();

        // Merge arrays uniquely
        const merged = [...results];
        for (const kw of keywordResults) {
          if (!merged.find(m => m._id.toString() === kw._id.toString())) {
            merged.push({ ...kw, score: 0.8 }); // Boosted keyword score
          }
        }
        results = merged.sort((a, b) => b.score - a.score).slice(0, limit);
      }
    }

    const latency = Date.now() - startTime;

    return {
      success: true,
      data: results.map(r => ({
        ...r,
        // Normalize 0-1 float to 0-100 percentage string for UI
        similarityScore: r.score ? Math.round(r.score * 100) : null
      })),
      executionTimeMs: latency,
      mode
    };
  }
}

module.exports = new VectorSearchService();
