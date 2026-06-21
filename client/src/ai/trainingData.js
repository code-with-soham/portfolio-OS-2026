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
  { text: "start", intent: INTENTS.OPEN_APP },
  
  // ================= VS-30.5 INTENTS ================= //

  // PORTFOLIO OS (Self Awareness)
  { text: "what is portfolio os", intent: INTENTS.PORTFOLIO_OS },
  { text: "how did you build this", intent: INTENTS.PORTFOLIO_OS },
  { text: "tell me about this website", intent: INTENTS.PORTFOLIO_OS },
  { text: "what is this app", intent: INTENTS.PORTFOLIO_OS },
  { text: "explain portfolio os", intent: INTENTS.PORTFOLIO_OS },
  
  // RECRUITER QUESTIONS
  { text: "what are your strengths", intent: INTENTS.RECRUITER_Q_STRENGTHS },
  { text: "strengths", intent: INTENTS.RECRUITER_Q_STRENGTHS },
  { text: "what are you good at", intent: INTENTS.RECRUITER_Q_STRENGTHS },
  
  { text: "what are your weaknesses", intent: INTENTS.RECRUITER_Q_WEAKNESSES },
  { text: "weakness", intent: INTENTS.RECRUITER_Q_WEAKNESSES },
  
  { text: "why should we hire you", intent: INTENTS.RECRUITER_Q_HIRE },
  { text: "why hire you", intent: INTENTS.RECRUITER_Q_HIRE },
  
  { text: "what are your career goals", intent: INTENTS.RECRUITER_Q_GOALS },
  { text: "where do you see yourself in 5 years", intent: INTENTS.RECRUITER_Q_GOALS },
  { text: "career goals", intent: INTENTS.RECRUITER_Q_GOALS },
  
  { text: "what is the hardest challenge you faced", intent: INTENTS.RECRUITER_Q_CHALLENGE },
  { text: "biggest challenge", intent: INTENTS.RECRUITER_Q_CHALLENGE },
  { text: "hardest bug", intent: INTENTS.RECRUITER_Q_CHALLENGE },

  // SPECIFIC TECH/SKILL QUERIES
  { text: "what technologies did you use", intent: INTENTS.SPECIFIC_PROJECT_TECH },
  { text: "tech stack for", intent: INTENTS.SPECIFIC_PROJECT_TECH },
  { text: "which project uses", intent: INTENTS.SPECIFIC_PROJECT_TECH },

  { text: "what is your strongest frontend skill", intent: INTENTS.SKILL_RECOMMENDATION },
  { text: "strongest skill", intent: INTENTS.SKILL_RECOMMENDATION },
  { text: "best skill", intent: INTENTS.SKILL_RECOMMENDATION },
  { text: "what backend technologies do you know", intent: INTENTS.SKILL_RECOMMENDATION },

  // WEATHER INTENT
  { text: "will it rain today", intent: INTENTS.WEATHER_QUERY },
  { text: "weather tomorrow", intent: INTENTS.WEATHER_QUERY },
  { text: "should i carry an umbrella", intent: INTENTS.WEATHER_QUERY },
  { text: "best time to go outside", intent: INTENTS.WEATHER_QUERY },
  { text: "what is the weather like", intent: INTENTS.WEATHER_QUERY },
  { text: "weather forecast", intent: INTENTS.WEATHER_QUERY }
];
