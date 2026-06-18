import { INTENTS } from './intents';
import { knowledgeBase } from './knowledgeBase';
import { semanticSearch } from './fuzzyMatcher';

export function generateResponse(intentData, text, context) {
  const { intent, confidence } = intentData;
  const data = knowledgeBase.getAllData();

  // If we have a follow up question (e.g. "which one is best?")
  if (intent === INTENTS.SEARCH && context.lastIntent === INTENTS.PROJECTS) {
    if (text.toLowerCase().includes('best') || text.toLowerCase().includes('strongest') || text.toLowerCase().includes('top')) {
      const bestProject = data.projects.find(p => p.id === 'proj-001'); // Hardcoded logic for demo, ideally we search for 'featured' or 'strongest'
      return `Based on my capabilities, my strongest project is **${bestProject.title}**.

Reason:
- Most advanced architecture
- Complete OS simulation in browser
- ${bestProject.techStack.join(', ')} stack`;
    }
  }
  
  if (intent === INTENTS.SEARCH && context.lastIntent === INTENTS.SKILLS) {
    if (text.toLowerCase().includes('best') || text.toLowerCase().includes('strongest') || text.toLowerCase().includes('top')) {
      return `My strongest skills are:
- VS Code - 90%
- JavaScript - 80%
- Tailwind CSS - 80%
- React - 78%`;
    }
  }

  switch (intent) {
    case INTENTS.ABOUT:
      return `${data.profile.bio}\n\nI am currently based in ${data.profile.location.city}, ${data.profile.location.country}.`;

    case INTENTS.PROJECTS:
      const projectsCount = data.projects.length;
      return `I have ${projectsCount} projects in my portfolio. 
Some featured ones include:
- **${data.projects[0].title}**: ${data.projects[0].description}
- **${data.projects[1].title}**: ${data.projects[1].description}

Type the name of a project to learn more!`;

    case INTENTS.SKILLS:
      const frontend = data.skills.categories.find(c => c.name === 'Frontend');
      const backend = data.skills.categories.find(c => c.name === 'Backend');
      return `My technical stack includes:
**Frontend**: ${frontend.skills.map(s => s.name).join(', ')}
**Backend**: ${backend.skills.map(s => s.name).join(', ')}
**Tools**: VS Code, Git, Postman`;

    case INTENTS.RESUME:
      return `You can view and download my resume by opening the **Resume** app on the desktop.`;

    case INTENTS.ACHIEVEMENTS:
      return `Here are some of my recent achievements:
- ${data.achievements[0].title}
- ${data.achievements[1].title}
- ${data.achievements[3].title}`;

    case INTENTS.CONTACT:
      return `You can reach me via email at **${data.profile.email}** or connect with me on LinkedIn.`;

    case INTENTS.EDUCATION:
      const edu = data.timeline.filter(t => t.type === 'education');
      return `I am currently pursuing a **${edu[0].title}** at ${edu[0].organization}. Prior to this, I completed my ${edu[1].title} at ${edu[1].organization}.`;

    case INTENTS.EXPERIENCE:
      const exp = data.timeline.find(t => t.type === 'experience');
      return `My recent experience includes working as a **${exp.title}** at ${exp.organization}.`;

    case INTENTS.TIMELINE:
      return `I have a diverse timeline of education, projects, and professional experience. Check out the About Me app to see my full journey!`;

    case INTENTS.OPEN_APP:
      return `[SYSTEM_COMMAND: OPEN_APP]`; // Handled by the AI Assistant component directly

    case INTENTS.HELP:
      return `I am the Portfolio AI Brain. I can help you with:
- "Tell me about Soham"
- "Show me your projects"
- "What are your skills?"
- "Download resume"
- "What is your best project?"`;

    case INTENTS.SEARCH:
    default:
      // Perform semantic search
      const results = semanticSearch(text);
      if (results.length > 0) {
        const top = results[0];
        if (top.type === 'project') {
          return `I found a project matching your query:
**${top.data.title}**: ${top.data.description}`;
        } else if (top.type === 'achievement') {
          return `I found an achievement:
**${top.data.title}**: ${top.data.description}`;
        } else if (top.type === 'timeline') {
          return `I found an entry in my timeline:
**${top.data.title}** at ${top.data.organization}.`;
        }
      }

      return `I'm not exactly sure what you mean by "${text}". Try asking about my projects, skills, or experience!`;
  }
}
