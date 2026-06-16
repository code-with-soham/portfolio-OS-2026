import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useWindowStore } from '../../../store/useWindowStore';
import './ReadmeRenderer.css';

export default function ReadmeRenderer() {
  const openWindow = useWindowStore(s => s.openWindow);

  // Generate a random-ish mock heatmap
  const renderHeatmap = () => {
    const rows = 7;
    const cols = 52;
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        // More activity towards the right (recent)
        const density = Math.random() * (c / cols);
        let level = 0;
        if (density > 0.8) level = 4;
        else if (density > 0.6) level = 3;
        else if (density > 0.4) level = 2;
        else if (density > 0.15) level = 1;
        
        row.push(<div key={`${r}-${c}`} className={`readme-heatmap-cell level-${level}`} />);
      }
      grid.push(<div key={`row-${r}`} className="readme-heatmap-row">{row}</div>);
    }
    return <div className="readme-heatmap">{grid}</div>;
  };

  return (
    <div className="readme-container">
      {/* Section 8: Animated Background */}
      <div className="readme-background" />

      <div className="readme-content">
        {/* Section 1: Hero Header & Section 2: Animated Typing Effect */}
        <div className="readme-hero">
          <h1 className="readme-hero-title">SOHAM KUNDU</h1>
          <div className="readme-hero-subtitle">
            <TypeAnimation
              sequence={[
                'AI/ML Developer',
                2000,
                'Full Stack Developer',
                2000,
                'Open Source Builder',
                2000,
                'Problem Solver',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        </div>

        {/* Section 3: Better Button Row */}
        <div className="readme-actions">
          <a href="https://github.com/code-with-soham" target="_blank" rel="noreferrer" className="readme-action-btn">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="readme-action-btn">LinkedIn</a>
          <span className="readme-action-btn" onClick={() => openWindow('resume')}>Resume</span>
          <span className="readme-action-btn" onClick={() => openWindow('projects')}>Projects</span>
          <span className="readme-action-btn" onClick={() => openWindow('about')}>Contact</span>
        </div>

        {/* Section 5: Statistics Cards */}
        <div className="readme-stats">
          <div className="readme-stat-card">
            <div className="readme-stat-value">12</div>
            <div className="readme-stat-label">Projects</div>
          </div>
          <div className="readme-stat-card">
            <div className="readme-stat-value">3</div>
            <div className="readme-stat-label">Years Experience</div>
          </div>
          <div className="readme-stat-card">
            <div className="readme-stat-value">45+</div>
            <div className="readme-stat-label">Skills</div>
          </div>
          <div className="readme-stat-card">
            <div className="readme-stat-value">20+</div>
            <div className="readme-stat-label">Achievements</div>
          </div>
        </div>

        <p>
          I am a passionate software engineer with experience building full-stack web applications and machine learning models. I created Portfolio OS as a web-based operating system to showcase my projects dynamically.
        </p>

        {/* Section 4: Skill Badges */}
        <h2>Skills & Technologies</h2>
        <div className="readme-skills">
          {['React', 'Next.js', 'Node.js', 'MongoDB', 'Python', 'TensorFlow', 'PyTorch', 'AWS', 'Docker'].map(skill => (
            <div key={skill} className="readme-skill-badge">{skill}</div>
          ))}
        </div>

        {/* Section 7: Timeline Section */}
        <h2>Journey</h2>
        <div className="readme-timeline">
          <div className="readme-timeline-item">
            <div className="readme-timeline-year">2026</div>
            <div className="readme-timeline-desc">Portfolio OS Released</div>
          </div>
          <div className="readme-timeline-item">
            <div className="readme-timeline-year">2025</div>
            <div className="readme-timeline-desc">AI Resume Analyzer & Job Tracker</div>
          </div>
          <div className="readme-timeline-item">
            <div className="readme-timeline-year">2024</div>
            <div className="readme-timeline-desc">Began Full Stack Journey</div>
          </div>
        </div>

        {/* Section 6: GitHub Style Contribution Block */}
        <h2>Contribution Activity</h2>
        {renderHeatmap()}

        {/* Section 10: Personal Branding */}
        <div className="readme-footer">
          <div><span className="readme-footer-indicator" /> Open for Opportunities</div>
          <div>Building AI + Full Stack Applications</div>
          <div>West Bengal, India</div>
        </div>
      </div>
    </div>
  );
}
