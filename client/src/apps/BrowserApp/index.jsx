import React, { useEffect, useState } from 'react';
import BrowserTabs from './components/BrowserTabs';
import BrowserToolbar from './components/BrowserToolbar';
import BrowserBookmarksBar from './components/BrowserBookmarksBar';
import BrowserContent from './components/BrowserContent';
import BrowserDevTools from './components/BrowserDevTools';
import { useBrowserStore } from '../../store/useBrowserStore';
import { useWindowStore } from '../../store/useWindowStore';
import { AppShell, AppBody, SplitView, SplitPane, InspectorPanel, StatusBar } from '../../components/ui/Layout';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

export default function BrowserApp({ id, dragControls, onClose, onMinimize, onMaximize, isMaximized }) {
  const [showDevTools, setShowDevTools] = useState(false);
  const { addTab, closeTab, activeTabId, tabs, setActiveTab, theme } = useBrowserStore();
  const activeWindowId = useWindowStore(s => s.activeWindowId);
  const isFocused = activeWindowId === id;
  const activeTab = tabs.find(t => t.id === activeTabId);

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

      // Ctrl + L (Address) or Ctrl + K (Search)
      if (e.ctrlKey && (e.key === 'l' || e.key === 'k')) {
        e.preventDefault();
        const addressInput = document.getElementById('browser-address-input');
        if (addressInput) {
          addressInput.focus();
          addressInput.select();
        }
      }

      // F5 (Reload)
      if (e.key === 'F5') {
        e.preventDefault();
        // Since we don't have a real reload yet, we can simulate by forcing a re-render or navigating to same URL
        if (activeTab) {
          const currentUrl = activeTab.url;
          // A tiny hack to force reload in our mock setup
          useBrowserStore.getState().navigateTo(currentUrl + '#reload');
          setTimeout(() => useBrowserStore.getState().navigateTo(currentUrl), 10);
        }
      }

      // Alt + Left (Back) / Alt + Right (Forward)
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        // Logic for back (mocked)
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        // Logic for forward (mocked)
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
    <AppShell className={`theme-${theme}`} style={{ background: 'var(--ds-bg-primary)' }}>
      <div style={{ background: 'var(--ds-panel)', display: 'flex', flexDirection: 'column' }}>
        <BrowserTabs 
          dragControls={dragControls}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          isMaximized={isMaximized}
        />
        <BrowserToolbar />
        <BrowserBookmarksBar />
        <ProgressBar isLoading={activeTab?.isLoading} />
      </div>
      
      <AppBody>
        <SplitView>
          <SplitPane>
            <BrowserContent />
          </SplitPane>
          {showDevTools && (
            <InspectorPanel style={{ width: 400 }}>
              <BrowserDevTools onClose={() => setShowDevTools(false)} />
            </InspectorPanel>
          )}
        </SplitView>
      </AppBody>

      <StatusBar style={{ position: 'absolute', bottom: 16, right: 16, border: 'none', background: 'transparent', height: 'auto', padding: 0 }}>
        <Badge variant="success" style={{ boxShadow: 'var(--ds-shadow-md)', background: 'var(--ds-surface)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--ds-success)' }} />
          Online
        </Badge>
      </StatusBar>
    </AppShell>
  );
}
