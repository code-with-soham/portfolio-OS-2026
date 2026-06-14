// ============================================
// Portfolio OS 2026 — Profile Controller
// ============================================
// Thin request handler for profile-related endpoints.
// Controllers parse the request, delegate to a service, and format the response.
// They contain NO business logic — that lives in services.
//
// MVC Flow: Route → Controller → Service → Data File

const profileService = require('../services/profileService');

/**
 * GET /api/profile
 * Returns the full profile data.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile();

    res.status(200).json({
      success: true,
      message: 'Profile data retrieved successfully',
      data: profile,
    });
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
};

module.exports = {
  getProfile,
};
