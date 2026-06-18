import { INTENTS } from './intents';

/**
 * Dataset for training the Fuzzy Matcher.
 * Maps potential user questions/keywords to the appropriate Intent.
 */
export const trainingData = [
  // ABOUT INTENT
  { text: "Who are you?", intent: INTENTS.ABOUT },
  { text: "Tell me about yourself", intent: INTENTS.ABOUT },
  { text: "Introduce yourself", intent: INTENTS.ABOUT },
  { text: "What do you do?", intent: INTENTS.ABOUT },
  { text: "bio", intent: INTENTS.ABOUT },
  { text: "about soham", intent: INTENTS.ABOUT },
  { text: "tell me about soham", intent: INTENTS.ABOUT },

  // PROJECTS INTENT
  { text: "What projects have you built?", intent: INTENTS.PROJECTS },
  { text: "show work", intent: INTENTS.PROJECTS },
  { text: "portfolio work", intent: INTENTS.PROJECTS },
  { text: "projects", intent: INTENTS.PROJECTS },
  { text: "prjct", intent: INTENTS.PROJECTS },
  { text: "projcts", intent: INTENTS.PROJECTS },
  { text: "show me your projects", intent: INTENTS.PROJECTS },
  { text: "what have you built", intent: INTENTS.PROJECTS },

  // SKILLS INTENT
  { text: "What technologies do you know?", intent: INTENTS.SKILLS },
  { text: "skill", intent: INTENTS.SKILLS },
  { text: "skills", intent: INTENTS.SKILLS },
  { text: "tech stack", intent: INTENTS.SKILLS },
  { text: "technology", intent: INTENTS.SKILLS },
  { text: "abilities", intent: INTENTS.SKILLS },
  { text: "what are you good at", intent: INTENTS.SKILLS },
  { text: "what languages do you know", intent: INTENTS.SKILLS },

  // RESUME INTENT
  { text: "resume", intent: INTENTS.RESUME },
  { text: "cv", intent: INTENTS.RESUME },
  { text: "curriculum vitae", intent: INTENTS.RESUME },
  { text: "my profile", intent: INTENTS.RESUME },
  { text: "download resume", intent: INTENTS.RESUME },

  // ACHIEVEMENTS INTENT
  { text: "achievements", intent: INTENTS.ACHIEVEMENTS },
  { text: "awards", intent: INTENTS.ACHIEVEMENTS },
  { text: "certifications", intent: INTENTS.ACHIEVEMENTS },
  { text: "what have you achieved", intent: INTENTS.ACHIEVEMENTS },

  // CONTACT INTENT
  { text: "contact", intent: INTENTS.CONTACT },
  { text: "how to reach you", intent: INTENTS.CONTACT },
  { text: "email", intent: INTENTS.CONTACT },
  { text: "hire", intent: INTENTS.CONTACT },
  { text: "phone number", intent: INTENTS.CONTACT },
  { text: "github", intent: INTENTS.CONTACT },
  { text: "linkedin", intent: INTENTS.CONTACT },

  // EDUCATION INTENT
  { text: "show education", intent: INTENTS.EDUCATION },
  { text: "education", intent: INTENTS.EDUCATION },
  { text: "degree", intent: INTENTS.EDUCATION },
  { text: "college", intent: INTENTS.EDUCATION },
  { text: "university", intent: INTENTS.EDUCATION },

  // EXPERIENCE INTENT
  { text: "What internship experience do you have?", intent: INTENTS.EXPERIENCE },
  { text: "experience", intent: INTENTS.EXPERIENCE },
  { text: "internship", intent: INTENTS.EXPERIENCE },
  { text: "work experience", intent: INTENTS.EXPERIENCE },

  // TIMELINE INTENT
  { text: "timeline", intent: INTENTS.TIMELINE },
  { text: "journey", intent: INTENTS.TIMELINE },
  { text: "history", intent: INTENTS.TIMELINE },

  // HELP INTENT
  { text: "help", intent: INTENTS.HELP },
  { text: "what can you do", intent: INTENTS.HELP },
  { text: "features", intent: INTENTS.HELP },
  { text: "commands", intent: INTENTS.HELP },

  // OPEN_APP INTENT
  { text: "open", intent: INTENTS.OPEN_APP },
  { text: "launch", intent: INTENTS.OPEN_APP },
  { text: "start", intent: INTENTS.OPEN_APP }
];
