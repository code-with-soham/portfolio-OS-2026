import React from 'react';
import { DismissRegular } from '@fluentui/react-icons';
import './RecruiterDashboard.css';

export default function RecruiterDashboard({ onClose }) {
  return (
    <div className="recruiter-dashboard-overlay">
      <div className="recruiter-dashboard-modal">
        <div className="recruiter-dashboard-header">
          <h2>Recruiter View ⭐</h2>
          <button className="recruiter-close-btn" onClick={onClose}>
            <DismissRegular fontSize={20} />
          </button>
        </div>
        <div className="recruiter-dashboard-content">
          <div className="rd-section">
            <h3>Quick Highlights</h3>
            <ul className="rd-highlights">
              <li>Full-stack capabilities with React, Node.js, Next.js, and MongoDB.</li>
              <li>AI/ML expertise with Python, TensorFlow, and LangChain.</li>
              <li>Experience building responsive, complex web applications like Portfolio OS.</li>
            </ul>
          </div>
          <div className="rd-grid">
            <div className="rd-card">
              <h4>Experience</h4>
              <p>Frontend Developer Intern<br/><span>Expantra Tech Pvt Ltd • 2024</span></p>
            </div>
            <div className="rd-card">
              <h4>Top Skills</h4>
              <p>React, Next.js, Node.js, Python, AWS</p>
            </div>
            <div className="rd-card">
              <h4>Education</h4>
              <p>B.Tech in Computer Science<br/><span>2022 - 2026</span></p>
            </div>
          </div>
          <div className="rd-actions">
            <a href="/resume" target="_blank" className="rd-btn primary">Download Resume</a>
            <a href="mailto:contact@soham.com" className="rd-btn">Contact Me</a>
          </div>
        </div>
      </div>
    </div>
  );
}
