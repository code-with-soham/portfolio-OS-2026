const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: process.env.DB_NAME || 'sample_mflix'
    });
    console.log(`[MongoDB] ✅ Connected to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] ❌ Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
