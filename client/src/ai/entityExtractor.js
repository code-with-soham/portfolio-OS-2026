const projectAliases = {
  "proj-001": ["portfolio os", "portfolio-os", "windows 11", "portfolio", "operating system"],
  "proj-002": ["campushub", "campus hub", "event platform", "booking platform", "event management"],
  "proj-003": ["interview-prep", "interview app", "interview prep", "mock interview", "ai interview", "smart mock"],
  "proj-004": ["student-placement-predictor", "placement predictor", "machine learning project", "student placement"],
  "proj-005": ["soham-portfolio-2026", "soham portfolio", "old portfolio", "previous portfolio", "portfolio 2026"],
  "proj-006": ["sliding-puzzle", "sliding puzzle", "puzzle game", "game"],
  "proj-007": ["supportgpt", "support gpt", "support assistant", "intelligent website"],
  "proj-008": ["3d web", "3d website", "3d experience", "webgl"]
};

const categoryAliases = {
  "frontend": ["frontend", "front end", "front-end", "ui", "user interface"],
  "backend": ["backend", "back end", "back-end", "server", "api", "database"],
  "full stack": ["full stack", "fullstack", "full-stack"],
  "machine learning": ["machine learning", "ml", "ai model", "ai"]
};

/**
 * Extracts recognized entities from user text to improve contextual matching.
 */
export function extractEntities(text) {
  const lowerText = text.toLowerCase();
  let extractedProject = null;
  let extractedCategory = null;

  // Extract Project
  for (const [id, aliases] of Object.entries(projectAliases)) {
    if (aliases.some(alias => lowerText.includes(alias))) {
      extractedProject = id;
      break;
    }
  }

  // Extract Category
  for (const [cat, aliases] of Object.entries(categoryAliases)) {
    if (aliases.some(alias => lowerText.includes(alias))) {
      extractedCategory = cat;
      break;
    }
  }

  return {
    projectId: extractedProject,
    category: extractedCategory
  };
}
