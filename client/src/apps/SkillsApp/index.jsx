// ============================================
// Portfolio OS 2026 — Skills App
// ============================================
// Displays skills grouped by category with circular progress rings.
// Fetches from /api/skills.

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { skillService } from '../../services/skillService';
import AppShell from '../../components/app/AppShell';
import './SkillsApp.css';

/**
 * Circular progress ring SVG component
 */
function SkillRing({ proficiency, level }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const mounted = useRef(false);

  useEffect(() => {
    // Animate from 0 to proficiency on mount
    const timer = setTimeout(() => {
      mounted.current = true;
      const progress = ((100 - proficiency) / 100) * circumference;
      setOffset(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [proficiency, circumference]);

  const levelClass = level?.toLowerCase() || 'beginner';

  return (
    <div className="skill-ring-container">
      <svg className="skill-ring" viewBox="0 0 64 64">
        <circle
          className="skill-ring-bg"
          cx="32"
          cy="32"
          r={radius}
        />
        <circle
          className={`skill-ring-progress ${levelClass}`}
          cx="32"
          cy="32"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="skill-percentage">{proficiency}%</span>
    </div>
  );
}

/**
 * Individual skill card
 */
function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <div className="skill-tooltip">
        {skill.name} — {skill.level} — {skill.yearsUsed} yr{skill.yearsUsed !== 1 ? 's' : ''}
      </div>
      <SkillRing proficiency={skill.proficiency} level={skill.level} />
      <span className="skill-name">{skill.name}</span>
      <span className="skill-level">{skill.level}</span>
    </div>
  );
}

export default function SkillsApp() {
  const [activeTab, setActiveTab] = useState('All');

  const {
    data: skillsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['skills'],
    queryFn: skillService.getSkills,
    staleTime: 5 * 60 * 1000,
  });

  const categories = skillsData?.categories || [];
  const tabNames = ['All', ...categories.map((c) => c.name)];

  const displayedCategories =
    activeTab === 'All'
      ? categories
      : categories.filter((c) => c.name === activeTab);

  return (
    <AppShell isLoading={isLoading} error={error} onRetry={refetch}>
      <div className="skills-app">
        {/* Category Tabs */}
        <div className="skills-tabs">
          {tabNames.map((tab) => (
            <button
              key={tab}
              className={`skills-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Skill Categories */}
        {displayedCategories.map((cat) => (
          <div key={cat.name} className="skills-category">
            <h2 className="skills-category-header">
              <span className="skills-category-icon">{cat.icon}</span>
              {cat.name}
            </h2>
            <div className="skills-grid">
              {cat.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
