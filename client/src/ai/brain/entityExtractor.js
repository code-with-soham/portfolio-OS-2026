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

  return entities;
}
