// ============================================
// Portfolio OS 2026 — Profile Service
// ============================================
// Business logic layer for profile data.
// Services are the ONLY layer that touches data files.
// Controllers call services — never read files directly.
//
// MVC Flow: Route → Controller → Service → Data File

const { readJsonFile } = require('../utils/fileReader');

/**
 * Retrieves the full profile data.
 * Reads from data/profile.json and returns the parsed object.
 *
 * @returns {Promise<Object>} - The profile data object
 * @throws {Error} - If the file is missing or malformed
 */
const getProfile = async () => {
  const profileData = await readJsonFile('profile.json');
  return profileData;
};

module.exports = {
  getProfile,
};
