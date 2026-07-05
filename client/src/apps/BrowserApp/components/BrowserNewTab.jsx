import React, { useState } from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { useGitHubStore } from '../../../store/useGitHubStore';
import { 
  SearchRegular, 
  SparkleRegular, 
  HistoryRegular, 
  WeatherSunnyRegular,
  CodeRegular,
  FolderRegular,
  BriefcaseRegular
} from '@fluentui/react-icons';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function BrowserNewTab() {
  const { navigateTo } = useBrowserStore();
  const { data: githubProfile } = useGitHubStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigateTo(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAISearch = () => {
    if (searchQuery) {
      navigateTo(`ai://${encodeURIComponent(searchQuery)}`);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--ds-bg-primary)', height: '100%', overflowY: 'auto', padding: '64px 24px' }}>
      
      {/* Logo */}
      <div style={{ fontSize: '72px', fontWeight: '500', marginBottom: '32px', fontFamily: '"Product Sans", sans-serif', letterSpacing: '-2px' }}>
        <span style={{ color: '#4285F4' }}>P</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>r</span>
        <span style={{ color: '#4285F4' }}>t</span>
        <span style={{ color: '#34A853' }}>f</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#4285F4' }}>l</span>
        <span style={{ color: '#FBBC05' }}>i</span>
        <span style={{ color: '#34A853' }}>o</span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ width: '600px', maxWidth: '100%', marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <Input 
          name="q" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search the web or ask AI..." 
          autoComplete="off" 
          iconLeft={<SearchRegular />}
          iconRight={<div style={{ cursor: 'pointer', color: 'var(--ds-accent)' }} title="AI Search" onClick={handleAISearch}><SparkleRegular /></div>}
          style={{ flex: 1, borderRadius: '24px', padding: '12px 16px', backgroundColor: 'var(--ds-surface)', boxShadow: 'var(--ds-shadow-sm)', fontSize: '15px' }}
        />
      </form>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
        <Button variant="secondary" onClick={handleSearch}>Google Search</Button>
        <Button variant="primary" onClick={handleAISearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SparkleRegular fontSize={16} /> AI Search
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', width: '100%', maxWidth: '800px' }}>
        
        {/* Quick Actions */}
        <div style={{ backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)', padding: '20px', border: '1px solid var(--ds-border)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--ds-text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><HistoryRegular /> Quick Access</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }} onClick={() => handleShortcut('portfolio://about', true)}><BriefcaseRegular /> About Me</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }} onClick={() => handleShortcut('portfolio://projects', true)}><FolderRegular /> Projects</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }} onClick={() => handleShortcut('https://github.com/code-with-soham')}><CodeRegular /> GitHub</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }} onClick={() => handleShortcut('https://smart-mock-interview-prep.vercel.app/')}><SparkleRegular /> Interview Prep</Button>
          </div>
        </div>

        {/* Continue Working */}
        <div style={{ backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)', padding: '20px', border: '1px solid var(--ds-border)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--ds-text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><HistoryRegular /> Continue Working</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--ds-bg-primary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'} onClick={() => handleShortcut('chrome://settings', true)}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ds-text-primary)' }}>System Settings</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-text-secondary)' }}>chrome://settings</div>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--ds-bg-primary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'} onClick={() => handleShortcut('portfolio://deployment', true)}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ds-text-primary)' }}>Deployment Dashboard</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-text-secondary)' }}>portfolio://deployment</div>
            </div>
          </div>
        </div>

        {/* Widgets / Status */}
        <div style={{ backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)', padding: '20px', border: '1px solid var(--ds-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--ds-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f39c12' }}>
              <WeatherSunnyRegular fontSize={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ds-text-primary)' }}>24°C, Sunny</div>
              <div style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>Kolkata, IN</div>
            </div>
          </div>
          
          <div style={{ height: '1px', backgroundColor: 'var(--ds-border)' }} />

          {githubProfile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={githubProfile.avatar} alt="GH" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ds-text-primary)' }}>{githubProfile.publicRepos} Repositories</div>
                <div style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>GitHub Activity</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
