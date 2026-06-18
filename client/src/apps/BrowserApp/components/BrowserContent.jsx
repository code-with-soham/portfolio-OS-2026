import React, { useRef, useState, lazy, Suspense } from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import BrowserNewTab from './BrowserNewTab';

// Lazy load internal pages for performance
const BrowserSettings = lazy(() => import('./BrowserSettings'));
const BrowserDownloads = lazy(() => import('./BrowserDownloads'));
const BrowserDeploymentDashboard = lazy(() => import('./BrowserDeploymentDashboard'));
const BrowserHistory = lazy(() => import('./BrowserHistory'));

// Internal apps
import ResumeApp from '../../ResumeApp';
import ProjectsApp from '../../ProjectsApp';
import SkillsApp from '../../SkillsApp';
import AboutApp from '../../AboutApp';

export default function BrowserContent() {
  const { tabs, activeTabId } = useBrowserStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  const [iframeError, setIframeError] = useState(false);

  if (!activeTab) return null;

  const url = activeTab.url;

  // Render New Tab
  if (!url || url === 'chrome://newtab') {
    return <BrowserNewTab />;
  }

  // AI Mode
  if (url.startsWith('ai://')) {
    const query = url.replace('ai://', '');
    return (
      <div style={{ padding: '40px', background: 'var(--chrome-bg)', color: 'var(--chrome-text)', height: '100%', overflow: 'auto' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>✨</span> AI Search: {decodeURIComponent(query)}
        </h2>
        <div style={{ marginTop: '24px', padding: '24px', background: 'var(--chrome-surface)', borderRadius: '12px', border: '1px solid var(--chrome-border)', lineHeight: '1.6' }}>
          <p>
            I am Antigravity AI analyzing your request: <strong>"{decodeURIComponent(query)}"</strong>.
          </p>
          <p style={{ marginTop: '12px' }}>
            Based on the portfolio data, here is what I found:
          </p>
          <ul style={{ marginTop: '12px', paddingLeft: '24px' }}>
            <li>Soham is a Full Stack Developer.</li>
            <li>Key skills include React, Node.js, Next.js.</li>
            <li>Projects: CampusHub, Portfolio OS.</li>
          </ul>
          <p style={{ marginTop: '12px', color: '#1a73e8' }}>
            [Live AI Integration with VS-30 AI Brain will be mapped here.]
          </p>
        </div>
      </div>
    );
  }

  // Render History
  if (url === 'chrome://history') {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: 'var(--chrome-text-secondary)' }}>Loading history...</div>}>
        <BrowserHistory />
      </Suspense>
    );
  }

  // Render Settings
  if (url === 'chrome://settings') {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: 'var(--chrome-text-secondary)' }}>Loading settings...</div>}>
        <BrowserSettings />
      </Suspense>
    );
  }

  // Render Downloads
  if (url === 'chrome://downloads') {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: 'var(--chrome-text-secondary)' }}>Loading downloads...</div>}>
        <BrowserDownloads />
      </Suspense>
    );
  }

  // Render Deployment
  if (url === 'portfolio://deployment') {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: 'var(--chrome-text-secondary)' }}>Loading dashboard...</div>}>
        <BrowserDeploymentDashboard />
      </Suspense>
    );
  }

  // Internal apps
  if (url === 'portfolio://resume') return <ResumeApp id="browser-internal" isMaximized={true} />;
  if (url === 'portfolio://projects') return <ProjectsApp id="browser-internal" isMaximized={true} />;
  if (url === 'portfolio://skills') return <SkillsApp id="browser-internal" isMaximized={true} />;
  if (url === 'portfolio://about') return <AboutApp id="browser-internal" isMaximized={true} />;

  // Render Real Web View (iframe)
  return (
    <div className="browser-iframe-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {iframeError && (
        <div className="iframe-error-overlay" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--chrome-bg)', color: 'var(--chrome-text)', zIndex: 10
        }}>
          <h2>Refused to connect</h2>
          <p>This website blocks framing. Click the button below to open it in a real tab.</p>
          <button onClick={() => window.open(url, '_blank')}>Open in New Tab</button>
        </div>
      )}
      <iframe 
        src={url} 
        className="browser-iframe" 
        title="browser-content"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        onError={() => setIframeError(true)}
      />
    </div>
  );
}
