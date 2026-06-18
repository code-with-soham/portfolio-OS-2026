import { INTENTS } from './intents';
import { knowledgeBase } from './knowledgeBase';
import { knowledgeGraph } from './knowledgeGraph';
import { semanticSearch } from './fuzzyMatcher';
import { RECRUITER_ANSWERS } from './recruiterQuestions';

export function generateResponse(intentData, text, context) {
  const { intent, confidence, entities } = intentData;
  const data = knowledgeBase.getAllData();

  // 1. Resolve Contextual Entities (Pronouns)
  let activeProjectId = entities?.projectId || null;
  let activeCategory = entities?.category || null;

  // Pronoun resolution: "which one is hardest?", "what technologies did you use for it?"
  const lowerText = text.toLowerCase();
  const hasPronoun = lowerText.includes(' it') || lowerText.includes(' they') || lowerText.includes(' this');
  
  if (!activeProjectId && hasPronoun && context.lastEntity?.projectId) {
    activeProjectId = context.lastEntity.projectId;
  }
  if (!activeCategory && hasPronoun && context.lastEntity?.category) {
    activeCategory = context.lastEntity.category;
  }

  // 2. Skill Recommendation Engine
  if (intent === INTENTS.SKILL_RECOMMENDATION) {
    if (activeCategory) {
      const catData = data.skills.categories.find(c => c.name.toLowerCase() === activeCategory);
      if (catData) {
        const sorted = [...catData.skills].sort((a, b) => b.proficiency - a.proficiency);
        return `My strongest ${activeCategory} skills are:\n${sorted.slice(0, 3).map(s => `- **${s.name}** (${s.proficiency}%)`).join('\n')}\n\nI highly value writing clean, scalable code using these technologies.`;
      }
    } else {
      // General strongest skill
      const allSkills = data.skills.categories.flatMap(c => c.skills);
      const topSkills = allSkills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 3);
      return `Based on my proficiency, my absolute strongest skills are:\n${topSkills.map(s => `- **${s.name}**`).join('\n')}\n\nI use these daily to build robust, modern web applications.`;
    }
  }

  // 3. Follow-up / Specific Project Queries
  if (intent === INTENTS.SPECIFIC_PROJECT_TECH) {
    if (activeProjectId) {
      const project = knowledgeBase.getProjectById(activeProjectId);
      if (project) {
        return `For **${project.title}**, I utilized a modern tech stack consisting of: ${project.techStack.join(', ')}.\n\nThis stack was chosen specifically to handle the project's unique requirements efficiently.`;
      }
    }
    return "Which project are you referring to? (e.g. Portfolio OS, campusHub)";
  }

  // 4. Handle Core Intents with Personality Layer
  switch (intent) {
    case INTENTS.PORTFOLIO_OS:
      return `**Portfolio OS 2026** is my flagship project and a testament to my front-end engineering capabilities.\n\nIt is a Windows 11-inspired operating system simulation built natively in the browser using React, Vite, Framer Motion, and Zustand for complex state management.\n\nIt features a fully functional desktop environment, window manager, file system, and custom-built applications. I built this to demonstrate my ability to handle complex UI architecture and deliver a deeply engaging user experience.`;

    case INTENTS.ABOUT:
      return `Hi, I'm Soham Kundu! 👋\n\n${data.profile.bio}\n\nI am currently based in ${data.profile.location.city}, ${data.profile.location.country}. I specialize in building highly interactive and scalable digital experiences.`;

    case INTENTS.PROJECTS:
      if (activeProjectId) {
        const p = knowledgeBase.getProjectById(activeProjectId);
        return `Let me tell you about **${p.title}**.\n\n${p.longDescription || p.description}\n\n*Highlights:* \n${p.highlights.map(h => `- ${h}`).join('\n')}\n\nYou can ask me about the technologies used in this project!`;
      }
      
      const featured = data.projects.filter(p => p.featured);
      return `I have built several full-stack and frontend applications. Some of my proudest work includes:\n\n${featured.map(p => `- **${p.title}**: ${p.description}`).join('\n')}\n\nFeel free to ask me about a specific project like *campusHub* or *Portfolio OS*.`;

    case INTENTS.SKILLS:
      const frontend = data.skills.categories.find(c => c.name === 'Frontend');
      const backend = data.skills.categories.find(c => c.name === 'Backend');
      return `I am a Full-Stack developer with a strong focus on the JavaScript ecosystem.\n\n**Frontend**: ${frontend.skills.map(s => s.name).join(', ')}\n**Backend**: ${backend.skills.map(s => s.name).join(', ')}\n\nWant to know my strongest skill? Just ask!`;

    // Recruiter Questions
    case INTENTS.RECRUITER_Q_STRENGTHS: return RECRUITER_ANSWERS.STRENGTHS;
    case INTENTS.RECRUITER_Q_WEAKNESSES: return RECRUITER_ANSWERS.WEAKNESSES;
    case INTENTS.RECRUITER_Q_HIRE: return RECRUITER_ANSWERS.WHY_HIRE_ME;
    case INTENTS.RECRUITER_Q_GOALS: return RECRUITER_ANSWERS.CAREER_GOALS;
    case INTENTS.RECRUITER_Q_CHALLENGE: return RECRUITER_ANSWERS.HARDEST_CHALLENGE;

    case INTENTS.RESUME:
      return `I've put a lot of effort into my professional journey. You can view and download my official resume by opening the **Resume** app on the desktop.`;

    case INTENTS.ACHIEVEMENTS:
      return `I'm always pushing myself to learn and achieve more. Recently, I've accomplished:\n\n${data.achievements.map(a => `- **${a.title}**: ${a.description}`).join('\n')}`;

    case INTENTS.CONTACT:
      return `I'm actively looking for new opportunities! You can reach me via email at **${data.profile.email}** or connect with me on LinkedIn.`;

    case INTENTS.EDUCATION:
      const edu = data.timeline.filter(t => t.type === 'education');
      return `I am currently pursuing a **${edu[0].title}** at ${edu[0].organization}, maintaining a strong academic record while actively building real-world projects.`;

    case INTENTS.EXPERIENCE:
      const exp = data.timeline.find(t => t.type === 'experience');
      return `Most recently, I worked as a **${exp.title}** at ${exp.organization}.\n\n${exp.description}`;

    case INTENTS.OPEN_APP:
      return `[SYSTEM_COMMAND: OPEN_APP]`;

    case INTENTS.HELP:
      return `I am the Portfolio AI Expert Brain. Try asking me:\n- "What is Portfolio OS?"\n- "Why should we hire you?"\n- "What are your strengths?"\n- "Tell me about campusHub"\n- "What backend technologies do you know?"`;

    case INTENTS.SEARCH:
    default:
      // Semantic Search Fallback
      const results = semanticSearch(text);
      if (results.length > 0) {
        const top = results[0];
        if (top.type === 'project') {
          return `I couldn't find a direct answer, but this project seems relevant:\n\n**${top.data.title}**: ${top.data.description}`;
        } else if (top.type === 'achievement') {
          return `I found a relevant achievement:\n\n**${top.data.title}**: ${top.data.description}`;
        }
      }

      return null; // Will be handled by confidence system in aiBrain
  }
}
