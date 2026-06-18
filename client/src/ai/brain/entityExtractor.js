export function extractEntities(text) {
  const normalized = text.toLowerCase();
  let entities = {};

  // Find technologies
  const techKeywords = [
    "mern", "ai", "react", "node", "python", "machine learning", 
    "frontend", "backend", "full stack", "javascript", "typescript"
  ];
  for (const tech of techKeywords) {
    if (normalized.includes(tech)) {
      entities.tech = tech === "full stack" ? "Full Stack" :
                      tech === "machine learning" ? "Machine Learning" :
                      tech === "mern" ? "MERN" :
                      tech.charAt(0).toUpperCase() + tech.slice(1);
    }
  }

  // Find project names
  const projectKeywords = ["portfolio os", "campushub", "interview prep", "sliding puzzle", "placement predictor"];
  for (const proj of projectKeywords) {
    if (normalized.includes(proj)) {
      entities.project = proj === "portfolio os" ? "portfolio-OS-2026" :
                         proj === "campushub" ? "campusHub" :
                         proj === "interview prep" ? "Interview-Prep" :
                         proj === "placement predictor" ? "Student-Placement-Predictor" :
                         "sliding-puzzle";
    }
  }

  // Find categories
  const categoryKeywords = ["hackathon", "professional", "certification", "project"];
  for (const cat of categoryKeywords) {
    if (normalized.includes(cat)) {
      entities.category = cat;
    }
  }

  // Expert Mode Compare targets
  if (normalized.includes("compare")) {
    if (normalized.includes("campushub") && (normalized.includes("interview") || normalized.includes("prep"))) {
      entities.compare = ["campusHub", "Interview-Prep"];
    }
  }
  
  // Best or Top
  if (normalized.includes("best") || normalized.includes("top") || normalized.includes("strongest")) {
    entities.modifier = "best";
  }

  // Positional matching (first, second, third, etc.)
  const positionals = {
    "first": 0, "1st": 0, "one": 0,
    "second": 1, "2nd": 1, "two": 1,
    "third": 2, "3rd": 2, "three": 2,
    "last": -1
  };
  
  for (const [key, val] of Object.entries(positionals)) {
    // Basic regex to ensure it's a whole word or at end of phrase
    if (new RegExp(`\\b${key}\\b`).test(normalized)) {
      entities.positional = val;
    }
  }

  return entities;
}
