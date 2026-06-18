import Fuse from 'fuse.js';
import { INTENTS } from '../training/intents';
import { SYNONYMS } from '../training/synonyms';

const trainingData = [
  ...SYNONYMS.projects.map(s => ({ text: s, intent: INTENTS.PROJECTS })),
  ...SYNONYMS.resume.map(s => ({ text: s, intent: INTENTS.RESUME })),
  ...SYNONYMS.skills.map(s => ({ text: s, intent: INTENTS.SKILLS })),
  ...SYNONYMS.achievements.map(s => ({ text: s, intent: INTENTS.ACHIEVEMENTS })),
  ...SYNONYMS.about.map(s => ({ text: s, intent: INTENTS.ABOUT })),
  ...SYNONYMS.contact.map(s => ({ text: s, intent: INTENTS.CONTACT })),
  ...SYNONYMS.experience.map(s => ({ text: s, intent: INTENTS.EXPERIENCE })),
  ...SYNONYMS.education.map(s => ({ text: s, intent: INTENTS.EDUCATION })),
  
  // App opening
  ...SYNONYMS.music.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'music' })),
  ...SYNONYMS.browser.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'browser' })),
  ...SYNONYMS.vscode.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'vscode' })),
  ...SYNONYMS.settings.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'settings' })),
  ...SYNONYMS.terminal.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'terminal' })),
  ...SYNONYMS.paint.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'paint' })),
  ...SYNONYMS.calculator.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'calculator' })),
  ...SYNONYMS.notepad.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'notepad' })),
  ...SYNONYMS.mail.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'mail' })),
  ...SYNONYMS.projects.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'projects' })),
  ...SYNONYMS.resume.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'resume' })),
  ...SYNONYMS.achievements.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'achievements' })),
  ...SYNONYMS.skills.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'skills' })),
  ...SYNONYMS.about.map(s => ({ text: `open ${s}`, intent: INTENTS.OPEN_APP, app: 'profile' })),

  // Workflows
  ...SYNONYMS.prepareRecruiter.map(s => ({ text: s, intent: INTENTS.PREPARE_RECRUITER })),
  ...SYNONYMS.showStrongest.map(s => ({ text: s, intent: INTENTS.SHOW_STRONGEST_WORK })),

  // System commands
  { text: "lock screen", intent: INTENTS.LOCK_SCREEN },
  { text: "lock", intent: INTENTS.LOCK_SCREEN },
  { text: "shutdown", intent: INTENTS.SHUTDOWN },
  { text: "restart", intent: INTENTS.RESTART },
  { text: "play music", intent: INTENTS.PLAY_MUSIC },

  // Expert Mode
  { text: "compare", intent: INTENTS.EXPERT_COMPARE },
  { text: "difference between", intent: INTENTS.EXPERT_COMPARE },

  // Recruiter Questions
  { text: "what are your strengths", intent: INTENTS.RECRUITER_Q_STRENGTHS },
  { text: "what is your strength", intent: INTENTS.RECRUITER_Q_STRENGTHS },
  { text: "what are your weaknesses", intent: INTENTS.RECRUITER_Q_WEAKNESSES },
  { text: "what is your weakness", intent: INTENTS.RECRUITER_Q_WEAKNESSES },
  { text: "why should we hire you", intent: INTENTS.RECRUITER_Q_HIRE },
  { text: "what are your career goals", intent: INTENTS.RECRUITER_Q_GOALS },
  { text: "where do you see yourself in 5 years", intent: INTENTS.RECRUITER_Q_GOALS },
  { text: "hardest challenge", intent: INTENTS.RECRUITER_Q_CHALLENGE },
  { text: "hardest technical challenge", intent: INTENTS.RECRUITER_Q_CHALLENGE },
  
  // Implicit context questions
  { text: "which one is the best", intent: INTENTS.SEARCH },
  { text: "what is your best project", intent: INTENTS.PROJECTS }
];

const fuseOptions = {
  includeScore: true,
  threshold: 0.4, // lower is stricter
  keys: ['text']
};

const fuse = new Fuse(trainingData, fuseOptions);

export function detectIntent(text) {
  const normalized = text.toLowerCase().trim();
  
  const results = fuse.search(normalized);
  
  if (results.length > 0) {
    const bestMatch = results[0];
    const score = bestMatch.score; // 0 is perfect match
    
    if (score < 0.4) {
      return {
        intent: bestMatch.item.intent,
        app: bestMatch.item.app, // If it's OPEN_APP
        confidence: (1 - score) * 100
      };
    }
  }

  // Fallback matching for basic "open xyz"
  if (normalized.startsWith('open ')) {
    const target = normalized.replace('open ', '').trim();
    // Try to resolve app synonym
    for (const [app, synonyms] of Object.entries(SYNONYMS)) {
      if (synonyms.includes(target)) {
        return { intent: INTENTS.OPEN_APP, app, confidence: 90 };
      }
    }
    return { intent: INTENTS.OPEN_APP, app: target, confidence: 80 };
  }

  return {
    intent: INTENTS.SEARCH,
    confidence: 100
  };
}
