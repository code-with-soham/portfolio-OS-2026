import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRegular, 
  ArrowRightRegular, 
  ArrowClockwiseRegular, 
  HomeRegular,
  MoreVerticalRegular,
  StarRegular,
  PersonRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular
} from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { useProfileStore } from '../../../store/useProfileStore';

export default function BrowserToolbar() {
  const { tabs, activeTabId, navigateTo, theme, toggleTheme } = useBrowserStore();
  const profileImage = useProfileStore(s => s.profileImage);
  const activeTab = tabs.find(t => t.id === activeTabId);
  const [urlInput, setUrlInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [githubProfile, setGithubProfile] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen]);

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    fetch('https://api.github.com/users/code-with-soham')
      .then(res => res.json())
      .then(data => setGithubProfile(data))
      .catch(console.error);
  }, []);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const [isFocused, setIsFocused] = useState(false);

  const predefinedSuggestions = [
    { title: 'Portfolio', url: 'portfolio://about' },
    { title: 'Projects', url: 'portfolio://projects' },
    { title: 'Profile', url: 'portfolio://about' },
    { title: 'Product Based Companies', url: 'https://www.google.com/search?q=Product+Based+Companies' },
    { title: 'Interview Prep', url: 'https://smart-mock-interview-prep.vercel.app/' },
    { title: 'Internship Projects', url: 'portfolio://projects' },
    { title: 'Interview Questions', url: 'https://www.google.com/search?q=Interview+Questions' },
    { title: 'GitHub', url: 'https://github.com/code-with-soham' },
    { title: 'Git Commands', url: 'https://www.google.com/search?q=Git+Commands' },
    { title: 'Git Projects', url: 'portfolio://projects' },
  ];

  const suggestions = predefinedSuggestions.filter(s => 
    s.title.toLowerCase().includes(urlInput.toLowerCase()) && urlInput.length > 0
  );

  return (
    <div className="chrome-toolbar">
      <div className="chrome-toolbar-actions">
        <button className="chrome-toolbar-btn" disabled><ArrowLeftRegular /></button>
        <button className="chrome-toolbar-btn" disabled><ArrowRightRegular /></button>
        <button className="chrome-toolbar-btn" onClick={() => navigateTo(activeTab?.url)}><ArrowClockwiseRegular /></button>
        <button className="chrome-toolbar-btn" onClick={() => navigateTo('chrome://newtab')}><HomeRegular /></button>
      </div>

      <div className="chrome-omnibox-container" style={{ flex: 1, position: 'relative' }}>
        <form className="chrome-omnibox" onSubmit={handleUrlSubmit}>
          <div className="chrome-omnibox-icon">
            {activeTab?.url.startsWith('https') ? '🔒' : activeTab?.url.startsWith('portfolio://') ? '💼' : '🔍'}
          </div>
          <input 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search Google or type a URL"
            spellCheck="false"
          />
          <div className="chrome-omnibox-bookmark"><StarRegular /></div>
        </form>

        {isFocused && suggestions.length > 0 && (
          <div className="chrome-suggestions-dropdown" style={{
            position: 'absolute', top: '100%', left: 0, right: 0, 
            backgroundColor: 'var(--chrome-bg)', border: '1px solid var(--chrome-border)', 
            borderRadius: '0 0 8px 8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000
          }}>
            {suggestions.map((s, idx) => (
              <div 
                key={idx} 
                className="chrome-suggestion-item"
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--chrome-text)' }}
                onClick={() => navigateTo(s.url)}
              >
                <SearchRegular color="var(--chrome-text-secondary)" />
                <span style={{ flex: 1 }}>{s.title}</span>
                <span style={{ fontSize: '12px', color: 'var(--chrome-text-secondary)' }}>{s.url.startsWith('http') ? s.url : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chrome-toolbar-extensions" ref={menuRef}>
        <button className="chrome-toolbar-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
        </button>

        <div 
          className="chrome-toolbar-profile" 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          {githubProfile?.avatar_url ? <img src={githubProfile.avatar_url} alt="Profile" /> : <PersonRegular />}
        </div>
        <button className="chrome-toolbar-btn" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}>
          <MoreVerticalRegular />
        </button>

        {isMenuOpen && (
          <div className="chrome-menu-dropdown" onClick={(e) => e.stopPropagation()}>
            {githubProfile && (
              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={githubProfile.avatar_url} style={{ width: 40, height: 40, borderRadius: '50%' }} alt="Avatar" />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--chrome-text)' }}>{githubProfile.name || 'Soham Kundu'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--chrome-text-secondary)' }}>@{githubProfile.login}</div>
                  <div style={{ fontSize: '11px', color: 'var(--chrome-text-secondary)', marginTop: '2px' }}>
                    {githubProfile.followers} Followers • {githubProfile.public_repos} Repos
                  </div>
                </div>
              </div>
            )}
            <div className="chrome-menu-divider" />
            <div className="chrome-menu-item" onClick={() => navigateTo('chrome://newtab')}>New Tab</div>
            <div className="chrome-menu-divider" />
            <div className="chrome-menu-item" onClick={() => navigateTo('chrome://history')}>History</div>
            <div className="chrome-menu-item" onClick={() => navigateTo('chrome://downloads')}>Downloads</div>
            <div className="chrome-menu-item" onClick={() => navigateTo('chrome://settings')}>Settings</div>
            <div className="chrome-menu-divider" />
            <div className="chrome-menu-item" onClick={() => navigateTo('portfolio://deployment')}>Deployment Dashboard</div>
          </div>
        )}
      </div>
    </div>
  );
}
