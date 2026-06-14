// ============================================
// Portfolio OS 2026 — Timeline Controller
// ============================================
// Request handler for timeline-related endpoints.
//
// MVC Flow: Route → Controller → Service → Data File

const timelineService = require('../services/timelineService');

/**
 * GET /api/timeline
 * Returns all timeline events, sorted by date.
 *
 * Query params:
 *   ?type=education — Filter by event type
 *   ?sort=asc       — Sort order (default: desc)
 */
const getAllTimeline = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      sort: req.query.sort,
    };

    const timeline = await timelineService.getAllTimeline(filters);

    res.status(200).json({
      success: true,
      message: 'Timeline retrieved successfully',
      count: timeline.length,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTimeline,
};
