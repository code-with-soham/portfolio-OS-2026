import { INTENTS } from '../training/intents';
import { RECRUITER_ANSWERS } from '../training/recruiterQuestions';

import projectsData from '../knowledge/projects.json';
import skillsData from '../knowledge/skills.json';
import profileData from '../knowledge/profile.json';
import achievementsData from '../knowledge/achievements.json';
import timelineData from '../knowledge/timeline.json';

// Simple search fallback function
function fuzzySearchKnowledge(query) {
  const lowercaseQuery = query.toLowerCase();
  
  // Search projects
  for (const p of projectsData) {
    if (p.title.toLowerCase().includes(lowercaseQuery) || p.description.toLowerCase().includes(lowercaseQuery)) {
      return `I found a relevant project: **${p.title}** - ${p.description}`;
    }
  }
  
  // Search achievements
  for (const a of achievementsData) {
    if (a.title.toLowerCase().includes(lowercaseQuery)) {
      return `I found this achievement: **${a.title}** - ${a.description}`;
    }
  }

  return null;
}

export function generateResponse(intent, entities, contextManager) {
  const lastIntent = contextManager.getLastIntent();
  const lastEntities = contextManager.getLastEntities();
  
  // Resolve context (e.g., if user says "which one is best?" and we know we are talking about projects)
  if (entities.modifier === 'best') {
    if (intent === INTENTS.SEARCH && lastIntent === INTENTS.PROJECTS) {
      intent = INTENTS.PROJECTS; // Inherit intent
    }
  }

  switch (intent) {
    case INTENTS.PROJECTS:
      if (entities.compare) {
        // Expert Mode
        const [p1, p2] = entities.compare;
        const proj1 = projectsData.find(p => p.title.toLowerCase() === p1.toLowerCase());
        const proj2 = projectsData.find(p => p.title.toLowerCase() === p2.toLowerCase());
        
        if (proj1 && proj2) {
          return `**${proj1.title}**:
${proj1.highlights.map(h => `• ${h}`).join('\n')}

**${proj2.title}**:
${proj2.highlights.map(h => `• ${h}`).join('\n')}

For recruiters, ${proj1.title} demonstrates ${proj1.category} architecture, while ${proj2.title} demonstrates ${proj2.category}.`;
        }
      }

      if (entities.modifier === 'best') {
        const best = projectsData.find(p => p.id === 'proj-001'); // Portfolio OS
        return `**${best.title}** is my strongest project.\n\nWhy?\n${best.highlights.map(h => `• ${h}`).join('\n')}\n• Custom AI Brain\n• State persistence\n• Multi-user support`;
      }

      if (entities.tech) {
        const filtered = projectsData.filter(p => p.techStack.some(t => t.toLowerCase() === entities.tech.toLowerCase()) || p.category.toLowerCase().includes(entities.tech.toLowerCase()));
        if (filtered.length > 0) {
          return `Here are my **${entities.tech}** projects:\n\n${filtered.map(p => `- **${p.title}**: ${p.description}`).join('\n')}`;
        }
      }
      
      const featured = projectsData.filter(p => p.featured);
      return `I have built several applications. Some of my proudest work includes:\n\n${featured.map(p => `- **${p.title}**: ${p.description}`).join('\n')}\n\nAsk me about a specific project!`;

    case INTENTS.SKILLS:
      if (entities.tech) {
        return `Yes, I am highly proficient in **${entities.tech}**. I have used it to build multiple projects.`;
      }
      return `My technical stack is divided into several areas:\n\n` + 
        skillsData.categories.map(c => `**${c.name}**: ${c.skills.map(s => s.name).join(', ')}`).join('\n\n');

    case INTENTS.ACHIEVEMENTS:
      if (entities.category) {
        const filtered = achievementsData.filter(a => a.category === entities.category);
        if (filtered.length > 0) {
          return `Here are my ${entities.category} achievements:\n\n${filtered.map(a => `- **${a.title}**: ${a.description}`).join('\n')}`;
        }
      }
      return `I'm always pushing myself to learn and achieve more. Recently, I've accomplished:\n\n${achievementsData.slice(0, 4).map(a => `- **${a.title}**: ${a.description}`).join('\n')}`;

    case INTENTS.ABOUT:
      return `Hi, I'm **${profileData.name}**! 👋\n\n${profileData.bio}\n\nI am currently based in ${profileData.location.city}, ${profileData.location.country}.`;

    case INTENTS.RESUME:
      return `You can view and download my official resume by opening the **Resume** app on the desktop.`;

    case INTENTS.CONTACT:
      return `I'm actively looking for new opportunities! You can reach me via email at **${profileData.email}** or connect with me on LinkedIn at ${profileData.social.linkedin}.`;

    case INTENTS.EXPERIENCE:
      const exps = timelineData.filter(t => t.type === 'experience');
      if (exps.length > 0) {
        return `Most recently, I worked as a **${exps[0].title}** at ${exps[0].organization}.\n\n${exps[0].description}`;
      }
      return "I have various project experiences. You can check out my Resume app!";

    case INTENTS.EDUCATION:
      const edu = timelineData.find(t => t.type === 'education');
      if (edu) {
        return `I am pursuing a **${edu.title}** at ${edu.organization}. ${edu.description}`;
      }
      return "You can see my educational background in the Resume app.";

    // Recruiter Questions
    case INTENTS.RECRUITER_Q_STRENGTHS: return RECRUITER_ANSWERS.STRENGTHS;
    case INTENTS.RECRUITER_Q_WEAKNESSES: return RECRUITER_ANSWERS.WEAKNESSES;
    case INTENTS.RECRUITER_Q_HIRE: return RECRUITER_ANSWERS.WHY_HIRE_ME;
    case INTENTS.RECRUITER_Q_GOALS: return RECRUITER_ANSWERS.CAREER_GOALS;
    case INTENTS.RECRUITER_Q_CHALLENGE: return RECRUITER_ANSWERS.HARDEST_CHALLENGE;
    case INTENTS.EXPERT_COMPARE:
      if (entities.compare) {
        const [p1, p2] = entities.compare;
        const proj1 = projectsData.find(p => p.title.toLowerCase().includes(p1.toLowerCase()));
        const proj2 = projectsData.find(p => p.title.toLowerCase().includes(p2.toLowerCase()));
        if (proj1 && proj2) {
          return `**${proj1.title}**:\n${proj1.highlights.map(h => `• ${h}`).join('\n')}\n\n**${proj2.title}**:\n${proj2.highlights.map(h => `• ${h}`).join('\n')}\n\nFor recruiters, ${proj1.title} demonstrates ${proj1.category} architecture, while ${proj2.title} demonstrates ${proj2.category}.`;
        }
      }
      return "I can compare any two projects if you give me their names! E.g. 'Compare campusHub and Interview Prep'";

    case INTENTS.OPEN_APP:
    case INTENTS.LOCK_SCREEN:
    case INTENTS.SHUTDOWN:
    case INTENTS.RESTART:
    case INTENTS.PLAY_MUSIC:
      // Action executor handles the actual opening, we just return a placeholder or we already returned it.
      // aiBrain will handle returning the ActionExecutor's response.
      return null;

    case INTENTS.SEARCH:
    default:
      // Try fuzzy search on query from history
      const query = contextManager.getHistory()[contextManager.getHistory().length - 1]?.user;
      if (query) {
        const res = fuzzySearchKnowledge(query);
        if (res) return res;
      }
      return "I'm still learning! Could you try asking about my projects, skills, or experience?";
  }
}
