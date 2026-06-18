import React from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { SearchRegular } from '@fluentui/react-icons';

export default function BrowserNewTab() {
  const { navigateTo } = useBrowserStore();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.q.value;
    if (query) {
      navigateTo(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleShortcut = (url, isInternal = false) => {
    if (isInternal) {
      navigateTo(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="chrome-newtab-container">
      <div className="chrome-newtab-logo">
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </div>

      <form className="chrome-newtab-search" onSubmit={handleSearch}>
        <SearchRegular />
        <input name="q" placeholder="Search Google or type a URL" autoComplete="off" />
        <div className="chrome-newtab-mic" title="Search by voice">🎤</div>
      </form>

      <div className="chrome-newtab-shortcuts">
        <div className="shortcut-item" onClick={() => handleShortcut('https://github.com/code-with-soham')}>
          <div className="shortcut-icon" style={{ background: '#24292e', color: 'white' }}>🐙</div>
          <span>GitHub</span>
        </div>
        <div className="shortcut-item" onClick={() => handleShortcut('https://soham-kundu-portfolio.vercel.app/')}>
          <div className="shortcut-icon" style={{ background: '#0078d4', color: 'white' }}>🌐</div>
          <span>Portfolio</span>
        </div>
        <div className="shortcut-item" onClick={() => handleShortcut('https://www.linkedin.com/in/soham-kundu-b5a9a0250/')}>
          <div className="shortcut-icon" style={{ background: '#0077b5', color: 'white' }}>in</div>
          <span>LinkedIn</span>
        </div>
        <div className="shortcut-item" onClick={() => handleShortcut('https://smart-mock-interview-prep.vercel.app/')}>
          <div className="shortcut-icon" style={{ background: '#8e44ad', color: 'white' }}>💡</div>
          <span>Interview Prep</span>
        </div>
        <div className="shortcut-item" onClick={() => handleShortcut('portfolio://projects', true)}>
          <div className="shortcut-icon" style={{ background: '#27ae60', color: 'white' }}>🎓</div>
          <span>CampusHub</span>
        </div>
        <div className="shortcut-item" onClick={() => handleShortcut('https://leetcode.com')}>
          <div className="shortcut-icon" style={{ background: '#f39c12', color: 'white' }}>💻</div>
          <span>LeetCode</span>
        </div>
        <div className="shortcut-item" onClick={() => handleShortcut('portfolio://resume', true)}>
          <div className="shortcut-icon" style={{ background: '#c0392b', color: 'white' }}>📄</div>
          <span>Resume</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">+</div>
          <span>Add shortcut</span>
        </div>
      </div>
    </div>
  );
}
