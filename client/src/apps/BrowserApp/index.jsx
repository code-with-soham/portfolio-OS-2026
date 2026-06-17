import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRegular, 
  ArrowRightRegular, 
  ArrowClockwiseRegular, 
  HomeRegular, 
  AddRegular, 
  DismissRegular,
  MoreVerticalRegular,
  CheckmarkRegular,
  SearchRegular,
  HistoryRegular
} from '@fluentui/react-icons';
import './BrowserApp.css';

// Internal apps for browser:// routing
import ResumeApp from '../ResumeApp';
import ProjectsApp from '../ProjectsApp';
import SkillsApp from '../SkillsApp';
import AboutApp from '../AboutApp';

const THEMES = [
  { id: 'edge-dark', label: 'Edge Dark' },
  { id: 'chrome-dark', label: 'Chrome Dark' },
  { id: 'arc', label: 'Arc Browser' },
  { id: 'portfolio', label: 'Portfolio Browser' }
];

const QUICK_LINKS = [
  { label: 'GitHub', icon: '🐙', url: 'https://github.com' },
  { label: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com' },
  { label: 'Portfolio', icon: '🌐', url: 'browser://about' },
  { label: 'CampusHub', icon: '🎓', url: 'browser://projects' },
  { label: 'LeetCode', icon: '💻', url: 'https://leetcode.com' },
];

export default function BrowserApp() {
  const [tabs, setTabs] = useState([
    { id: '1', title: 'New Tab', url: '', icon: '🌎' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [urlInput, setUrlInput] = useState('');
  const [theme, setTheme] = useState('edge-dark');
  const [showThemes, setShowThemes] = useState(false);
  const [history, setHistory] = useState([]);
  
  const iframeRef = useRef(null);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('browser_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, tabs]);

  const addToHistory = (url, title) => {
    if (!url || url.startsWith('browser://newtab')) return;
    
    const newEntry = { url, title, timestamp: Date.now() };
    setHistory(prev => {
      const filtered = prev.filter(h => h.url !== url);
      const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50
      localStorage.setItem('browser_history', JSON.stringify(updated));
      return updated;
    });
  };

  const navigateTo = (url) => {
    if (!url) return;
    
    // Add protocol if missing
    let finalUrl = url;
    if (!finalUrl.startsWith('http') && !finalUrl.startsWith('browser://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const title = finalUrl.startsWith('browser://') 
      ? finalUrl.replace('browser://', 'Portfolio : ') 
      : finalUrl;

    setTabs(prev => prev.map(t => 
      t.id === activeTabId 
        ? { ...t, url: finalUrl, title } 
        : t
    ));
    
    addToHistory(finalUrl, title);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const addTab = () => {
    const newId = Date.now().toString();
    setTabs(prev => [...prev, { id: newId, title: 'New Tab', url: '', icon: '🌎' }]);
    setActiveTabId(newId);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (filtered.length === 0) {
        // Create a new tab if all are closed
        const newId = Date.now().toString();
        setActiveTabId(newId);
        return [{ id: newId, title: 'New Tab', url: '', icon: '🌎' }];
      }
      if (id === activeTabId) {
        // Switch to the last tab
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  };

  const goHome = () => navigateTo('browser://newtab');

  const renderContent = () => {
    if (!activeTab) return null;

    if (!activeTab.url || activeTab.url === 'browser://newtab') {
      return (
        <div className="browser-new-tab">
          <div className="browser-logo">
            <SearchRegular fontSize={32} /> Portfolio Browser
          </div>
          
          <div className="browser-search-mock">
            <SearchRegular style={{ marginRight: '12px' }} />
            Search the web or type a URL
          </div>

          <div className="browser-quick-links">
            {QUICK_LINKS.map(link => (
              <div 
                key={link.label} 
                className="quick-link-item"
                onClick={() => navigateTo(link.url)}
              >
                <div className="quick-link-icon">{link.icon}</div>
                <div className="quick-link-label">{link.label}</div>
              </div>
            ))}
          </div>

          {history.length > 0 && (
            <div className="browser-history-section">
              <div className="browser-history-title">Recent Pages</div>
              <div className="browser-history-list">
                {history.slice(0, 5).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="browser-history-item"
                    onClick={() => navigateTo(item.url)}
                  >
                    <HistoryRegular className="browser-history-icon" />
                    <div className="browser-history-details">
                      <div className="browser-tab-title">{item.title}</div>
                      <div className="browser-history-url">{item.url}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab.url.startsWith('browser://')) {
      const page = activeTab.url.replace('browser://', '');
      return (
        <div className="browser-internal-app">
          {page === 'resume' && <ResumeApp />}
          {page === 'projects' && <ProjectsApp />}
          {page === 'skills' && <SkillsApp />}
          {page === 'about' && <AboutApp />}
          {!['resume', 'projects', 'skills', 'about'].includes(page) && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Page Not Found</h2>
              <p>The internal page <strong>{page}</strong> does not exist.</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <iframe 
        ref={iframeRef}
        src={activeTab.url} 
        className="browser-iframe" 
        title="browser-content"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    );
  };

  return (
    <div className={`browser-app theme-${theme}`} onClick={() => setShowThemes(false)}>
      <div className="browser-header">
        <div className="browser-tabs">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`browser-tab ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <div className="browser-tab-icon">{tab.icon}</div>
              <div className="browser-tab-title">{tab.title}</div>
              <div 
                className="browser-tab-close"
                onClick={(e) => closeTab(e, tab.id)}
              >
                <DismissRegular fontSize={12} />
              </div>
            </div>
          ))}
          <div className="browser-new-tab-btn" onClick={addTab}>
            <AddRegular fontSize={16} />
          </div>
        </div>

        <div className="browser-toolbar">
          <button className="browser-nav-btn" disabled>
            <ArrowLeftRegular />
          </button>
          <button className="browser-nav-btn" disabled>
            <ArrowRightRegular />
          </button>
          <button className="browser-nav-btn" onClick={() => navigateTo(activeTab?.url)}>
            <ArrowClockwiseRegular />
          </button>
          <button className="browser-nav-btn" onClick={goHome}>
            <HomeRegular />
          </button>

          <form className="browser-url-container" onSubmit={handleUrlSubmit}>
            <SearchRegular className="browser-url-icon" />
            <input 
              className="browser-url-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter web address"
            />
          </form>

          <button 
            className="browser-settings-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowThemes(!showThemes);
            }}
          >
            <MoreVerticalRegular />
          </button>
        </div>
      </div>

      {showThemes && (
        <div className="browser-theme-selector" onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '4px 8px', fontSize: '12px', color: '#888' }}>Themes</div>
          {THEMES.map(t => (
            <div 
              key={t.id}
              className={`browser-theme-option ${theme === t.id ? 'active' : ''}`}
              onClick={() => {
                setTheme(t.id);
                setShowThemes(false);
              }}
            >
              {theme === t.id ? <CheckmarkRegular /> : <div style={{width: 16}}/>}
              {t.label}
            </div>
          ))}
        </div>
      )}

      <div className="browser-content">
        {renderContent()}
      </div>
    </div>
  );
}
