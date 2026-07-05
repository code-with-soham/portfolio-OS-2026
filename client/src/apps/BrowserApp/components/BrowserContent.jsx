import React, { useRef, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { GlobeRegular, DocumentErrorRegular, SparkleRegular } from '@fluentui/react-icons';
import { EmptyLayout } from '../../../components/ui/Layout';
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

function BrowserSkeleton() {
  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%', backgroundColor: 'var(--ds-bg-primary)' }}>
      {/* Title skeleton */}
      <div style={{ width: '40%', height: '32px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-md)' }} className="skeleton-shimmer" />
      
      {/* Content skeleton blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '90%', height: '16px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-sm)' }} className="skeleton-shimmer" />
        <div style={{ width: '85%', height: '16px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-sm)' }} className="skeleton-shimmer" />
        <div style={{ width: '95%', height: '16px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-sm)' }} className="skeleton-shimmer" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div style={{ height: '120px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)' }} className="skeleton-shimmer" />
        <div style={{ height: '120px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)' }} className="skeleton-shimmer" />
        <div style={{ height: '120px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)' }} className="skeleton-shimmer" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

function renderContent(url, iframeError, setIframeError) {
  // Render New Tab
  if (!url || url === 'chrome://newtab') return <BrowserNewTab />;

  // AI Mode
  if (url.startsWith('ai://')) {
    const query = url.replace('ai://', '');
    return (
      <div style={{ padding: '0 16px', background: 'var(--ds-bg-primary)', color: 'var(--ds-text-primary)', height: '100%', overflow: 'auto' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-md)', marginTop: '24px' }}>
          <span style={{ fontSize: '32px' }}>✨</span> AI Search: {decodeURIComponent(query)}
        </h2>
        <div style={{ marginTop: 'var(--ds-space-xl)', padding: 'var(--ds-space-xl)', background: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-border)', lineHeight: '1.6' }}>
          <p>
            I am Antigravity AI analyzing your request: <strong>"{decodeURIComponent(query)}"</strong>.
          </p>
          <p style={{ marginTop: 'var(--ds-space-md)' }}>
            Based on the portfolio data, here is what I found:
          </p>
          <ul style={{ marginTop: 'var(--ds-space-md)', paddingLeft: 'var(--ds-space-xl)' }}>
            <li>Soham is a Full Stack Developer.</li>
            <li>Key skills include React, Node.js, Next.js.</li>
            <li>Projects: CampusHub, Portfolio OS.</li>
          </ul>
        </div>
      </div>
    );
  }

  // Internal apps
  if (url === 'portfolio://resume') return <ResumeApp id="browser-internal" isMaximized={true} />;
  if (url === 'portfolio://projects') return <ProjectsApp id="browser-internal" isMaximized={true} />;
  if (url === 'portfolio://skills') return <SkillsApp id="browser-internal" isMaximized={true} />;
  if (url === 'portfolio://about') return <AboutApp id="browser-internal" isMaximized={true} />;

  // Lazy components
  if (url === 'chrome://history') return <Suspense fallback={<BrowserSkeleton />}><BrowserHistory /></Suspense>;
  if (url === 'chrome://settings') return <Suspense fallback={<BrowserSkeleton />}><BrowserSettings /></Suspense>;
  if (url === 'chrome://downloads') return <Suspense fallback={<BrowserSkeleton />}><BrowserDownloads /></Suspense>;
  if (url === 'portfolio://deployment') return <Suspense fallback={<BrowserSkeleton />}><BrowserDeploymentDashboard /></Suspense>;

  // External Iframe
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {iframeError && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--ds-bg-primary)', color: 'var(--ds-text-primary)', zIndex: 10
        }}>
          <h2>Refused to connect</h2>
          <p>This website blocks framing. Click the button below to open it in a real tab.</p>
          <button onClick={() => window.open(url, '_blank')} style={{ padding: 'var(--ds-space-sm) var(--ds-space-lg)', marginTop: 'var(--ds-space-md)', cursor: 'pointer' }}>Open in New Tab</button>
        </div>
      )}
      <iframe 
        src={url} 
        style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: 'white' }}
        title="browser-content"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        onError={() => setIframeError(true)}
      />
    </div>
  );
}

export default function BrowserContent() {
  const { tabs, activeTabId } = useBrowserStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  const [iframeError, setIframeError] = useState(false);

  if (!activeTab) return null;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--ds-bg-primary)' }}>
      <AnimatePresence mode="wait">
        {activeTab.isLoading ? (
          <motion.div
            key="loading-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            <BrowserSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key={activeTab.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            {renderContent(activeTab.url, iframeError, setIframeError)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
