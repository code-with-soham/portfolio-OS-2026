import React from 'react';
import './MongoDBExplorer.css';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import DocumentViewer from './components/DocumentViewer';
import StatusBar from './components/StatusBar';
import WelcomeScreen from './components/WelcomeScreen';
import AIPanel from './components/AIPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { useMongoStore } from './hooks/useMongoStore';

const MongoDBExplorerApp = () => {
  const { currentCollection } = useMongoStore();

  return (
    <ErrorBoundary>
      <div className="mongodb-explorer-app h-full flex flex-col bg-[#1A1A1A] text-gray-200 overflow-hidden font-sans">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Panel */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-primary)]">
          {currentCollection ? (
            <>
              <TopNavigation />
              <DocumentViewer />
            </>
          ) : (
            <WelcomeScreen />
          )}
        </div>

        {/* AI Panel */}
        <AIPanel />
      </div>
      
      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
    </ErrorBoundary>
  );
};

export default MongoDBExplorerApp;
