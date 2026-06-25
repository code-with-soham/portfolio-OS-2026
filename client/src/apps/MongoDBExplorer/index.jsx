import React, { useState, useEffect } from 'react';
import './MongoDBExplorer.css';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import DocumentViewer from './components/DocumentViewer';
import StatusBar from './components/StatusBar';
import DatabaseDashboard from './components/DatabaseDashboard';
import AIPanel from './components/AIPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { useMongoStore } from './hooks/useMongoStore';

import SchemaExplorer from './components/Inspectors/SchemaExplorer';
import IndexExplorer from './components/Inspectors/IndexExplorer';
import DeveloperPanel from './components/DeveloperPanel';

const MongoDBExplorerApp = () => {
  const { currentCollection, activeTab, searchQuery } = useMongoStore();
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Shift + C to toggle Developer Panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setShowDevPanel(prev => !prev);
      }
      
      // Ctrl/Cmd + F could focus search, but let's just log or trigger something simple for now
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        // Just a placeholder since the input is in TopNavigation and we'd need a ref
        // We'll leave the native browser find or we could use event dispatching
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'documents':
        return <DocumentViewer />;
      case 'schema':
        return <SchemaExplorer currentCollection={currentCollection} />;
      case 'indexes':
        return <IndexExplorer currentCollection={currentCollection} />;
      case 'aggregation':
        return (
          <div className="flex-1 flex items-center justify-center bg-[#1A1A1A] text-gray-500">
            <p>Aggregation Builder (Phase 4 AI Copilot) - Coming Soon</p>
          </div>
        );
      default:
        return <DocumentViewer />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="mongodb-explorer-app h-full flex flex-col bg-[#1A1A1A] text-gray-200 overflow-hidden font-sans relative">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Panel */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-primary)]">
          {currentCollection ? (
            <>
              <TopNavigation />
              {renderActiveTab()}
            </>
          ) : (
            <DatabaseDashboard />
          )}
        </div>

        {/* AI Panel */}
        <AIPanel />
        
        {/* Developer Telemetry Panel Overlay */}
        <DeveloperPanel 
          isOpen={showDevPanel} 
          onClose={() => setShowDevPanel(false)} 
          queryStr={searchQuery}
          activeCollection={currentCollection}
        />
      </div>
      
      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
    </ErrorBoundary>
  );
};

export default MongoDBExplorerApp;
