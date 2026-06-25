import React from 'react';
import { useMongoStore } from '../hooks/useMongoStore';

const getDocumentCount = (colName) => {
  switch (colName) {
    case 'movies': return '21,349 Documents';
    case 'embedded_movies': return '3,521 Documents';
    case 'theaters': return '1,624 Documents';
    case 'users': return '185 Documents';
    case 'sessions': return '1 Document';
    default: return '0 Documents';
  }
};

const StatusBar = () => {
  const { currentDatabase, currentCollection, isConnected } = useMongoStore();

  return (
    <div className="h-8 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center px-4 text-[11px] font-sans text-gray-400 select-none">
      <div className="flex items-center space-x-3">
        {/* Connection Status */}
        <div className="flex items-center space-x-1.5 text-gray-300 font-medium">
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

        <div className="w-px h-3 bg-gray-600"></div>

        {/* Cluster */}
        <span>Cluster0</span>
        
        <div className="w-px h-3 bg-gray-600"></div>

        {/* Database */}
        <span>{currentDatabase}</span>

        {currentCollection && (
          <>
            <div className="w-px h-3 bg-gray-600"></div>
            <span className="text-[var(--color-accent)] font-medium">{currentCollection}</span>
            <div className="w-px h-3 bg-gray-600"></div>
            <span>{getDocumentCount(currentCollection)}</span>
          </>
        )}

      </div>
      
      <div className="flex-1"></div>

      <div className="flex items-center space-x-3">
        <span>Latency 18ms</span>
      </div>
    </div>
  );
};

export default StatusBar;
