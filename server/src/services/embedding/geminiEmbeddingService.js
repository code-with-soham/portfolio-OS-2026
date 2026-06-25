const geminiClient = require('../gemini/geminiClient');
const mongoService = require('../mongoService');

class GeminiEmbeddingService {
  /**
   * Processes movies from the source collection, generates embeddings, 
   * and stores them in the target collection.
   */
  async runEmbeddingPipeline(limit = 100) {
    const db = mongoService.getDb();
    if (!db) throw new Error("Database not connected");

    const sourceCollection = db.collection('movies');
    const targetCollection = db.collection('gemini_embedded_movies');

    // Find movies that have plots and haven't been embedded yet (for idempotency)
    // For simplicity, we just grab some top movies with plots
    const movies = await sourceCollection
      .find({ plot: { $exists: true, $ne: "" } })
      .limit(limit)
      .toArray();

    const results = {
      processed: 0,
      errors: 0,
      skipped: 0
    };

    for (const movie of movies) {
      try {
        // Check if already embedded
        const existing = await targetCollection.findOne({ movieId: movie._id });
        if (existing) {
          results.skipped++;
          continue;
        }

        // Generate embedding for the plot
        const embedding = await geminiClient.generateEmbedding(movie.plot);

        // Store the new structured document
        await targetCollection.insertOne({
          movieId: movie._id,
          title: movie.title,
          plot: movie.plot,
          genres: movie.genres || [],
          year: movie.year,
          imdb: movie.imdb,
          poster: movie.poster,
          
          // Vector Search Payload
          embedding: embedding,
          
          // Metadata
          embeddingModel: "gemini-embedding-2",
          embeddedAt: new Date(),
          embeddingVersion: 1
        });

        results.processed++;
        
        // Rate limiting precaution (Google allows 1500 RPM for Flash/Pro, but embedding might be lower)
        await new Promise(r => setTimeout(r, 500)); 
      } catch (err) {
        console.error(`Failed to embed movie ${movie.title}:`, err.message);
        results.errors++;
      }
    }

    return results;
  }
}

module.exports = new GeminiEmbeddingService();
