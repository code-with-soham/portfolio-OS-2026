// ============================================
// Portfolio OS 2026 — Projects App
// ============================================
// Displays all projects with search, filter, and rich cards.
// Fetches from /api/projects.

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { useDebounce } from '../../hooks/useDebounce';
import { useUIStore } from '../../store/useUIStore';
import AppShell from '../../components/app/AppShell';
import './ProjectsApp.css';

const CATEGORIES = ['All', 'Full Stack', 'AI/ML', 'Frontend'];

export default function ProjectsApp() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const debouncedSearch = useDebounce(search, 300);

  const { setInputFocused } = useUIStore();

  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
    staleTime: 5 * 60 * 1000,
  });

  // Filter projects
  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const matchesSearch =
        !debouncedSearch ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.techStack.some((t) =>
          t.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

      const matchesCategory =
        category === 'All' || p.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, debouncedSearch, category]);

  return (
    <AppShell isLoading={isLoading} error={error} onRetry={refetch}>
      <div className="projects-app">
        {/* Search & Filter */}
        <div className="projects-filter-bar">
          <div className="projects-search">
            <svg
              className="projects-search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="projects-search-input"
              type="text"
              placeholder="Search projects, technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </div>
          <div className="projects-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`projects-chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards */}
        {filtered.length > 0 ? (
          <div className="projects-grid">
            {filtered.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <h3 className="project-card-title">{project.title}</h3>
                  <div className="project-card-badges">
                    {project.featured && (
                      <span className="project-badge featured">⭐ Featured</span>
                    )}
                    <span
                      className={`project-badge ${
                        project.status === 'In Progress'
                          ? 'in-progress'
                          : 'completed'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="project-card-desc">{project.description}</p>

                <div className="project-tech-tags">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="project-tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                {project.highlights && (
                  <ul className="project-highlights">
                    {project.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}

                <div className="project-card-actions">
                  {project.liveUrl && (
                    <a
                      className="project-action-btn"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      className="project-action-btn"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📂 GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="projects-empty">
            <div className="projects-empty-icon">🔍</div>
            <p>No projects match your search.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
