import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useWindowStore } from '../../../store/useWindowStore';
import './ReadmeRenderer.css';

export default function ReadmeRenderer({ onOpenRecruiterView }) {
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
          <div className="readme-hero-badge-row">
            <span className="readme-badge-location">📍 West Bengal, India</span>
            <span className="readme-badge-open"><span className="readme-footer-indicator" /> Open to Work</span>
          </div>
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
          <a href="https://www.linkedin.com/in/soham-kundu-b5a9a0250/" target="_blank" rel="noreferrer" className="readme-action-btn">LinkedIn</a>
          <span className="readme-action-btn" onClick={() => openWindow('resume')}>Resume</span>
          <span className="readme-action-btn" onClick={() => openWindow('projects')}>Projects</span>
          <span className="readme-action-btn" onClick={() => openWindow('about')}>Contact</span>
          {onOpenRecruiterView && (
            <span className="readme-action-btn" onClick={onOpenRecruiterView} style={{ background: 'rgba(218, 165, 32, 0.2)', borderColor: 'rgba(218, 165, 32, 0.4)', color: '#ffd700' }}>⭐ Recruiter View</span>
          )}
        </div>

        {/* Section 5: Statistics Cards */}
        <div className="readme-stats">
          <div className="readme-stat-card">
            <div className="readme-stat-value">6</div>
            <div className="readme-stat-label">Projects</div>
          </div>
          <div className="readme-stat-card">
            <div className="readme-stat-value">1</div>
            <div className="readme-stat-label">Years Experience</div>
          </div>
          <div className="readme-stat-card">
            <div className="readme-stat-value">10+</div>
            <div className="readme-stat-label">Skills</div>
          </div>
          <div className="readme-stat-card">
            <div className="readme-stat-value">5+</div>
            <div className="readme-stat-label">Achievements</div>
          </div>
        </div>

        <div className="readme-recruiter-section">
          <hr className="readme-divider" style={{ border: 'none', borderTop: '1px dashed rgba(88,166,255,0.2)', margin: '30px 0' }} />
          <h3 style={{ color: '#58a6ff', marginBottom: '15px' }}>🚀 Current Focus</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#c9d1d9', marginBottom: '30px' }}>
            <li>Building Portfolio OS</li>
            <li>AI Resume Analyzer</li>
            <li>Agentic AI Systems</li>
          </ul>

          <hr className="readme-divider" style={{ border: 'none', borderTop: '1px dashed rgba(88,166,255,0.2)', margin: '30px 0' }} />
          <h3 style={{ color: '#58a6ff', marginBottom: '15px' }}>📈 Tech Stack</h3>
          <div className="readme-skills">
            {['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'TensorFlow', 'LangChain'].map(skill => (
              <div key={skill} className="readme-skill-badge">{skill}</div>
            ))}
          </div>
          <hr className="readme-divider" style={{ border: 'none', borderTop: '1px dashed rgba(88,166,255,0.2)', margin: '30px 0' }} />
        </div>

        {/* Section 6: Project Showcase Cards */}
        <h2>Featured Projects</h2>
        <div className="readme-projects">
          <div className="readme-project-card glass-card">
            <h3>Portfolio OS</h3>
            <p>A web-based Windows 11 clone and VS Code developer workspace built with React.</p>
            <div className="readme-project-tags">
              <span>React</span><span>Zustand</span><span>Vite</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>GitHub</a>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>Live Demo</a>
            </div>
          </div>
          <div className="readme-project-card glass-card">
            <h3>AI Resume Analyzer</h3>
            <p>An intelligent tool that parses and evaluates resumes against job descriptions.</p>
            <div className="readme-project-tags">
              <span>Next.js</span><span>Python</span><span>OpenAI</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>GitHub</a>
            </div>
          </div>
          <div className="readme-project-card glass-card">
            <h3>Job Tracker</h3>
            <p>A platform to organize job applications and track interview progress.</p>
            <div className="readme-project-tags">
              <span>Node.js</span><span>MongoDB</span><span>Express</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>GitHub</a>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>Live Demo</a>
            </div>
          </div>
          <div className="readme-project-card glass-card">
            <h3>DSA Platform</h3>
            <p>Competitive programming environment with real-time code execution and test cases.</p>
            <div className="readme-project-tags">
              <span>React</span><span>Judge0</span><span>Tailwind</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>GitHub</a>
            </div>
          </div>
          <div className="readme-project-card glass-card">
            <h3>Research Assistant</h3>
            <p>AI-powered document QA tool using RAG architecture for analyzing research papers.</p>
            <div className="readme-project-tags">
              <span>Python</span><span>LangChain</span><span>Pinecone</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <a href="#" style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(88,166,255,0.1)', color: '#58a6ff', textDecoration: 'none', border: '1px solid rgba(88,166,255,0.2)' }}>GitHub</a>
            </div>
          </div>
        </div>

        {/* Section 7: Timeline Section */}
        <h2>Experience Journey</h2>
        <div className="readme-timeline">
          <div className="readme-timeline-item glass-card">
            <div className="readme-timeline-year">2026</div>
            <div className="readme-timeline-desc"><strong>Portfolio OS Released</strong><br />Built an interactive desktop environment and IDE within the browser.</div>
          </div>
          <div className="readme-timeline-item glass-card">
            <div className="readme-timeline-year">2025</div>
            <div className="readme-timeline-desc"><strong>AI Resume Analyzer & Job Tracker</strong><br />Developed full-stack platforms leveraging AI and modern web frameworks.</div>
          </div>
          <div className="readme-timeline-item glass-card">
            <div className="readme-timeline-year">2024</div>
            <div className="readme-timeline-desc"><strong>Began Full Stack Journey</strong><br />Mastered the MERN stack and built foundational web applications.</div>
          </div>
        </div>

        {/* Section 5: GitHub Style Contribution Block */}
        <h2>Contribution Activity</h2>
        {renderHeatmap()}

        {/* Section 10: Personal Branding Footer */}
        <div className="readme-footer">
          <div>Building Premium Web Experiences</div>
        </div>
      </div>
    </div>
  );
}
