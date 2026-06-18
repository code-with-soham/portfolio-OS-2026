import profile from './data/profile.json';
import projects from './data/projects.json';
import skills from './data/skills.json';
import achievements from './data/achievements.json';
import timeline from './data/timeline.json';

export const portfolioData = {
  profile,
  projects,
  skills,
  achievements,
  timeline
};

/**
 * Knowledge Base providing centralized access to all portfolio data.
 */
export const knowledgeBase = {
  getProfile: () => portfolioData.profile,
  getProjects: () => portfolioData.projects,
  getProjectById: (id) => portfolioData.projects.find(p => p.id === id),
  getSkills: () => portfolioData.skills,
  getAchievements: () => portfolioData.achievements,
  getTimeline: () => portfolioData.timeline,
  getAllData: () => portfolioData
};
