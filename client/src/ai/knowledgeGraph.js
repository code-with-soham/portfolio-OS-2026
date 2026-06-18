import projectsData from './data/projects.json';
import skillsData from './data/skills.json';

/**
 * The Knowledge Graph establishes relationships between entities (projects, skills, categories).
 */
class KnowledgeGraph {
  constructor() {
    this.graph = {
      projects: {},
      technologies: {},
      categories: {}
    };
    this.buildGraph();
  }

  buildGraph() {
    // Index projects
    projectsData.forEach(project => {
      const id = project.id.toLowerCase();
      this.graph.projects[id] = {
        title: project.title,
        category: project.category.toLowerCase(),
        techStack: project.techStack.map(t => t.toLowerCase()),
        ref: project
      };

      // Add to category index
      const cat = project.category.toLowerCase();
      if (!this.graph.categories[cat]) this.graph.categories[cat] = [];
      this.graph.categories[cat].push(id);

      // Add to technology index
      project.techStack.forEach(tech => {
        const t = tech.toLowerCase();
        if (!this.graph.technologies[t]) this.graph.technologies[t] = [];
        this.graph.technologies[t].push(id);
      });
    });
  }

  getProjectsByTechnology(tech) {
    const t = tech.toLowerCase();
    const projectIds = this.graph.technologies[t] || [];
    return projectIds.map(id => this.graph.projects[id].ref);
  }

  getProjectsByCategory(category) {
    const c = category.toLowerCase();
    const projectIds = this.graph.categories[c] || [];
    return projectIds.map(id => this.graph.projects[id].ref);
  }

  getTechnologiesForProject(projectId) {
    const p = this.graph.projects[projectId.toLowerCase()];
    return p ? p.techStack : [];
  }
}

export const knowledgeGraph = new KnowledgeGraph();
