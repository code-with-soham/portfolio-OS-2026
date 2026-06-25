require('dotenv').config();
const { MongoClient } = require('mongodb');

// Fix MONGODB_URI vs MONGO_URI fallback
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'sample_mflix';

async function truncateCollection(db, collectionName, limit) {
  try {
    const collection = db.collection(collectionName);
    
    // Check if collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      console.log(`[SKIP] Collection '${collectionName}' does not exist.`);
      return;
    }

    const total = await collection.countDocuments();
    if (total <= limit) {
      console.log(`[SKIP] Collection '${collectionName}' has ${total} documents (Limit: ${limit}). No truncation needed.`);
      return;
    }

    console.log(`[PROCESS] Truncating '${collectionName}' from ${total} to ${limit} documents...`);

    // Find the IDs of the documents we want to keep
    const docsToKeep = await collection.find({}).sort({ _id: 1 }).limit(limit).project({ _id: 1 }).toArray();
    const keepIds = docsToKeep.map(d => d._id);

    // Delete everything else
    const result = await collection.deleteMany({ _id: { $nin: keepIds } });
    
    console.log(`[SUCCESS] Deleted ${result.deletedCount} documents from '${collectionName}'.`);

  } catch (error) {
    console.error(`[ERROR] Failed to truncate '${collectionName}':`, error.message);
  }
}

async function run() {
  if (!uri) {
    console.error('[ERROR] MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`[MongoDB] Connected successfully to server. Database: ${dbName}`);
    const db = client.db(dbName);

    await truncateCollection(db, 'movies', 1000);
    await truncateCollection(db, 'theaters', 500);
    await truncateCollection(db, 'comments', 500);
    await truncateCollection(db, 'gemini_embedded_movies', 500);
    await truncateCollection(db, 'embedded_movies', 500); // Sometimes it's this
    await truncateCollection(db, 'embedded movies', 500); // the screenshot showed exactly "embedded movies"
    
    console.log('✅ Database truncation complete.');

  } catch (err) {
    console.error('[FATAL]', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

run();
