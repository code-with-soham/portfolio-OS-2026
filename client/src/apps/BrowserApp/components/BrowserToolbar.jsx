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
  WeatherSunnyRegular,
  SearchRegular,
  BuildingRegular,
  TrophyRegular,
  FolderRegular,
  CodeRegular,
  LockClosedRegular,
  BriefcaseRegular
} from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useGitHubStore } from '../../../store/useGitHubStore';
import { Avatar } from '../../../components/ui/Avatar';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarDivider } from '../../../components/ui/Toolbar';
import { SearchField } from '../../../components/ui/SearchField';

export default function BrowserToolbar() {
  const { tabs, activeTabId, navigateTo, theme, toggleTheme } = useBrowserStore();
  const profileImage = useProfileStore(s => s.profileImage);
  const activeTab = tabs.find(t => t.id === activeTabId);
  const [urlInput, setUrlInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const { data: githubProfile, fetchData } = useGitHubStore();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const predefinedSuggestions = [
    { title: 'Portfolio About', subtitle: 'portfolio://about', url: 'portfolio://about', icon: <PersonRegular /> },
    { title: 'Projects', subtitle: 'portfolio://projects', url: 'portfolio://projects', icon: <FolderRegular /> },
    { title: 'Interview Prep', subtitle: 'Smart Mock Interview Platform', url: 'https://smart-mock-interview-prep.vercel.app/', icon: <TrophyRegular /> },
    { title: 'GitHub', subtitle: '@code-with-soham', url: 'https://github.com/code-with-soham', icon: <CodeRegular /> },
    { title: 'Product Based Companies', subtitle: 'Search Google', url: 'https://www.google.com/search?q=Product+Based+Companies', icon: <BuildingRegular /> },
  ];

  const suggestions = predefinedSuggestions.filter(s => 
    s.title.toLowerCase().includes(urlInput.toLowerCase()) && urlInput.length > 0
  );

  const getAddressIcon = () => {
    if (activeTab?.url.startsWith('https')) return <LockClosedRegular fontSize={14} />;
    if (activeTab?.url.startsWith('portfolio://')) return <BriefcaseRegular fontSize={14} />;
    return <SearchRegular fontSize={14} />;
  };

  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton icon={<ArrowLeftRegular />} disabled />
        <ToolbarButton icon={<ArrowRightRegular />} disabled />
        <ToolbarButton icon={<ArrowClockwiseRegular />} onClick={() => navigateTo(activeTab?.url)} title="Reload" />
        <ToolbarButton icon={<HomeRegular />} onClick={() => navigateTo('chrome://newtab')} title="Home" />
      </ToolbarGroup>

      <SearchField 
        variant="address"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onSubmit={handleUrlSubmit}
        placeholder="Search Google or type a URL"
        iconLeft={getAddressIcon()}
        iconRight={<StarRegular fontSize={14} />}
        suggestions={suggestions}
        onSelectSuggestion={(s) => navigateTo(s.url)}
      />

      <ToolbarGroup ref={menuRef}>
        <ToolbarButton 
          icon={theme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
          onClick={toggleTheme} 
          title="Toggle Theme"
        />

        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          style={{ cursor: 'pointer', padding: '2px', borderRadius: '50%', margin: '0 4px', display: 'flex', alignItems: 'center', transition: 'background-color 0.15s' }}
          className="ds-transition-hover"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ds-surface)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {githubProfile?.avatar ? <Avatar src={githubProfile.avatar} size="xs" /> : <Avatar fallback={<PersonRegular />} size="xs" />}
        </div>
        
        <ToolbarButton 
          icon={<MoreVerticalRegular />}
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          active={isMenuOpen}
        />

        {isMenuOpen && (
          <div className="ds-glass-3" style={{
            position: 'absolute', top: '40px', right: '8px', 
            borderRadius: 'var(--ds-radius-lg)', 
            padding: '8px 0', 
            minWidth: '260px', zIndex: 1000
          }} onClick={(e) => e.stopPropagation()}>
            {githubProfile && (
              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar src={githubProfile.avatar} size="md" />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--ds-text-primary)' }}>{githubProfile.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>@code-with-soham</div>
                </div>
              </div>
            )}
            <div style={{ height: 1, backgroundColor: 'var(--ds-border)', margin: '8px 0' }} />
            <div className="ds-menu-item" onClick={() => { navigateTo('chrome://newtab'); setIsMenuOpen(false); }}>New Tab</div>
            <div style={{ height: 1, backgroundColor: 'var(--ds-border)', margin: '8px 0' }} />
            <div className="ds-menu-item" onClick={() => { navigateTo('chrome://history'); setIsMenuOpen(false); }}>History</div>
            <div className="ds-menu-item" onClick={() => { navigateTo('chrome://downloads'); setIsMenuOpen(false); }}>Downloads</div>
            <div className="ds-menu-item" onClick={() => { navigateTo('chrome://settings'); setIsMenuOpen(false); }}>Settings</div>
            <div style={{ height: 1, backgroundColor: 'var(--ds-border)', margin: '8px 0' }} />
            <div className="ds-menu-item" onClick={() => { navigateTo('portfolio://deployment'); setIsMenuOpen(false); }}>Deployment Dashboard</div>
          </div>
        )}
      </ToolbarGroup>
    </Toolbar>
  );
}
