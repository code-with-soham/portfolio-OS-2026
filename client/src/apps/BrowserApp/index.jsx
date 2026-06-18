import React, { useEffect, useState } from 'react';
import './BrowserApp.css';
import BrowserTabs from './components/BrowserTabs';
import BrowserToolbar from './components/BrowserToolbar';
import BrowserBookmarksBar from './components/BrowserBookmarksBar';
import BrowserContent from './components/BrowserContent';
import BrowserDevTools from './components/BrowserDevTools';
import { useBrowserStore } from '../../store/useBrowserStore';
import { useWindowStore } from '../../store/useWindowStore';

export default function BrowserApp({ id, dragControls, onClose, onMinimize, onMaximize, isMaximized }) {
  const [showDevTools, setShowDevTools] = useState(false);
  const { addTab, closeTab, activeTabId, tabs, setActiveTab, theme } = useBrowserStore();
  const activeWindowId = useWindowStore(s => s.activeWindowId);
  const isFocused = activeWindowId === id;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFocused) return;

      // Ctrl + T (New Tab)
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        addTab();
      }

      // Ctrl + W (Close Tab)
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        closeTab(activeTabId);
      }

      // Ctrl + Tab (Switch Tab)
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = tabs.findIndex(t => t.id === activeTabId);
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
      }

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        setShowDevTools(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, activeTabId, tabs, addTab, closeTab, setActiveTab]);

  return (
    <div className={`chrome-browser-app theme-${theme}`}>
      <div className="chrome-header">
        <BrowserTabs 
          dragControls={dragControls}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          isMaximized={isMaximized}
        />
        <BrowserToolbar />
        <BrowserBookmarksBar />
      </div>
      
      <div className="chrome-main">
        <div className="chrome-content-area">
          <BrowserContent />
        </div>
        
        {showDevTools && (
          <div className="chrome-devtools-area">
            <BrowserDevTools onClose={() => setShowDevTools(false)} />
          </div>
        )}
      </div>

      <div className="chrome-status-indicator" style={{
        position: 'absolute', bottom: 16, right: 16, 
        backgroundColor: 'var(--chrome-surface)', border: '1px solid var(--chrome-border)',
        padding: '4px 12px', borderRadius: '100px', fontSize: '12px', color: 'var(--chrome-text)',
        display: 'flex', alignItems: 'center', gap: '6px', zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34A853' }} />
        Online
      </div>
    </div>
  );
}
