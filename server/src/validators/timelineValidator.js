// ============================================
// Portfolio OS 2026 — Timeline Validator
// ============================================
// Validates request parameters for timeline endpoints.

const VALID_TYPES = ['education', 'project', 'experience'];
const VALID_SORT = ['asc', 'desc'];

/**
 * Validates GET /api/timeline query parameters.
 */
const validateGetTimeline = (req, res, next) => {
  const { type, sort } = req.query;

  if (type && !VALID_TYPES.includes(type.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid type: "${type}". Valid types: ${VALID_TYPES.join(', ')}`,
    });
  }

  if (sort && !VALID_SORT.includes(sort.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid sort: "${sort}". Valid values: ${VALID_SORT.join(', ')}`,
    });
  }

  next();
};

module.exports = {
  validateGetTimeline,
};
