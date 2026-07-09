import React, { useState, useEffect } from 'react';
import './ProfileSidebar.css';
import myPhoto from '../../../assets/icons/logos/myPhoto.jpg';

export default function ProfileSidebar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="profile-sidebar">
      <div className="profile-card">
        
        {/* Avatar Section */}
        <div className="profile-avatar-container">
          <img src={myPhoto} alt="Soham Kundu" className="profile-avatar" />
          <div className="profile-status-badge" title="Open to Work">🟢</div>
        </div>

        {/* Profile Info */}
        <h2 className="profile-name">Soham Kundu</h2>
        <div className="profile-username">code-with-soham</div>
        
        <p className="profile-bio">
          🚀 Future Software Engineer | 💻 MERN Stack Developer | 🤖 AI/ML Enthusiast
        </p>

        {/* Meta Info */}
        <div className="profile-meta">
          <div className="meta-item">
            <span>👥</span> 3 Followers • 1 Following
          </div>
          <div className="meta-item">
            <span>📍</span> Jhargram, West Bengal
          </div>
          <div className="meta-item">
            <span>🕒</span> {formatTime(time)} (Local Time)
          </div>
        </div>

        {/* Links */}
        <div className="profile-links">
          <a href="https://soham-kundu-portfolio.vercel.app/" target="_blank" rel="noreferrer" className="profile-link">
            <span>🌐</span> Portfolio
          </a>
          <a href="https://smart-mock-interview-prep.vercel.app/" target="_blank" rel="noreferrer" className="profile-link">
            <span>🎤</span> Mock Interview Platform
          </a>
          <a href="https://campus-hub-mocha.vercel.app/" target="_blank" rel="noreferrer" className="profile-link">
            <span>🎓</span> CampusHub
          </a>
          <a href="https://code-with-soham.github.io/Student-Placement-Predictor/" target="_blank" rel="noreferrer" className="profile-link">
            <span>📈</span> Student Placement Predictor
          </a>
          <a href="https://github.com/code-with-soham" target="_blank" rel="noreferrer" className="profile-link">
            <span>🐙</span> GitHub
          </a>
          <a href="https://linkedin.com/in/soham-kundu-b5a9a0250" target="_blank" rel="noreferrer" className="profile-link">
            <span>💼</span> LinkedIn
          </a>
          <a href="https://instagram.com/soham.kundu.737" target="_blank" rel="noreferrer" className="profile-link">
            <span>📸</span> Instagram
          </a>
        </div>

        {/* Additional Widgets */}
        <div className="profile-widgets">
          
          <div className="widget-section">
            <h3 className="widget-title">Current Status</h3>
            <div className="widget-content">🟢 Open to Internship Opportunities</div>
          </div>

          <div className="widget-section">
            <h3 className="widget-title">Education</h3>
            <div className="widget-content">
              🎓 B.Tech CSE (2027)<br/>
              <span className="text-muted">Brainware University</span>
            </div>
          </div>

          <div className="widget-section">
            <h3 className="widget-title">Current Focus</h3>
            <div className="widget-content">
              <div>⚡ Portfolio OS 2026</div>
              <div>⚡ CampusHub</div>
              <div>⚡ Interview Prep Platform</div>
              <div>⚡ Placement Preparation</div>
            </div>
          </div>

          <div className="widget-section">
            <h3 className="widget-title">Tech Stack</h3>
            <div className="tech-stack-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">MongoDB</span>
              <span className="tech-badge">Express</span>
              <span className="tech-badge">JavaScript</span>
              <span className="tech-badge">Tailwind</span>
              <span className="tech-badge">C++</span>
              <span className="tech-badge">AI/ML</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
