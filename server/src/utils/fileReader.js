// ============================================
// Portfolio OS 2026 — JSON File Reader Utility
// ============================================
// Generic utility to read and parse JSON data files.
// Used by all service modules to load data from the /data directory.
//
// Why a dedicated reader?
// 1. Centralizes file reading logic — DRY principle
// 2. Provides consistent error handling for missing/corrupt files
// 3. Easy to swap with a real database later without changing services

const fs = require('fs');
const path = require('path');

/**
 * Reads and parses a JSON file from the data directory.
 *
 * @param {string} filename - The name of the JSON file (e.g., 'profile.json')
 * @returns {Promise<Object>} - Parsed JSON data
 * @throws {Error} - If the file doesn't exist or contains invalid JSON
 */
const readJsonFile = (filename) => {
  return new Promise((resolve, reject) => {
    // Construct the absolute path to the data file
    const filePath = path.join(__dirname, '..', 'data', filename);

    // Check if the file exists before attempting to read
    if (!fs.existsSync(filePath)) {
      const error = new Error(`Data file not found: ${filename}`);
      error.statusCode = 404;
      return reject(error);
    }

    // Read the file asynchronously
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        const error = new Error(`Failed to read data file: ${filename}`);
        error.statusCode = 500;
        return reject(error);
      }

      try {
        // Parse the JSON content
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      } catch (parseError) {
        const error = new Error(`Invalid JSON in data file: ${filename}`);
        error.statusCode = 500;
        reject(error);
      }
    });
  });
};

module.exports = { readJsonFile };
