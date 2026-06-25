import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Download, Sparkles, Database, LayoutTemplate, Layers, Filter } from 'lucide-react';
import { useMongoStore } from '../hooks/useMongoStore';
import { useCollectionStatsData } from '../hooks/useDatabaseQueries';
import QueryBuilder from './Inspectors/QueryBuilder';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const TopNavigation = () => {
  const { currentCollection, searchQuery, setSearchQuery, activeTab, setActiveTab, queryHistory } = useMongoStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);

  const { data: stats, refetch } = useCollectionStatsData(currentCollection);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Sync if external reset happens
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [currentCollection]); // Only on collection change

  const handleApplyQuery = (queryStr) => {
    setLocalSearch(queryStr);
    setSearchQuery(queryStr);
    setShowQueryBuilder(false);
  };

  return (
    <div className="flex flex-col bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
      {/* Top Header Row */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)] bg-[#212121]">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-bold text-gray-200" style={{ minWidth: 'max-content' }}>
            {currentCollection || 'No Collection'}
          </h2>
          
          {/* Search Bar */}
          {currentCollection && (
            <div className="relative flex-1 flex items-center" style={{ maxWidth: '600px' }}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-1.5 border border-gray-600 rounded-md leading-5 bg-[#1E1E1E] text-gray-200 font-mono text-xs placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] sm:text-sm transition-colors"
                placeholder={`Filter ${currentCollection}... (e.g. { "year": 1893 })`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <button 
                onClick={() => setShowQueryBuilder(!showQueryBuilder)}
                className={`absolute right-2 p-1 rounded ${showQueryBuilder ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Visual Query Builder"
              >
                <Filter size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {currentCollection && (
          <div className="flex items-center gap-2 ml-4">
            <button 
              onClick={() => refetch()}
              className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-gray-400 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] text-gray-400 hover:text-white transition-colors"
              title="Export Data"
            >
              <Download size={18} />
            </button>
            <button 
              className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors border border-indigo-500 shadow-sm shadow-indigo-900/50"
              title="AI Search"
            >
              <Sparkles size={16} className="mr-1.5" /> AI Search
            </button>
          </div>
        )}
      </div>

      {showQueryBuilder && (
        <QueryBuilder onApplyQuery={handleApplyQuery} onClose={() => setShowQueryBuilder(false)} />
      )}

      {/* Query History Pills */}
      {currentCollection && queryHistory.length > 0 && (
        <div className="flex items-center px-4 py-2 bg-[#1A1A1A] border-b border-[var(--color-border)] overflow-x-auto custom-scrollbar">
          <span className="text-xs text-gray-500 mr-3 flex-shrink-0">Recent Queries:</span>
          <div className="flex space-x-2">
            {queryHistory.map((historyQuery, idx) => (
              <button 
                key={idx}
                onClick={() => { setLocalSearch(historyQuery); setSearchQuery(historyQuery); }}
                className="px-2 py-1 text-xs font-mono bg-[#2A2D2E] hover:bg-[#333] border border-[#444] rounded text-gray-300 truncate max-w-[200px] transition-colors"
                title={historyQuery}
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Row & Stats */}
      {currentCollection && (
        <div className="flex items-center justify-between px-4 pt-2">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center transition-colors ${activeTab === 'documents' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
            >
              <Database size={14} className="mr-2" /> Documents
            </button>
            <button 
              onClick={() => setActiveTab('aggregation')}
              className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center transition-colors ${activeTab === 'aggregation' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
            >
              <Layers size={14} className="mr-2" /> Aggregation
            </button>
            <button 
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center transition-colors ${activeTab === 'schema' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
            >
              <LayoutTemplate size={14} className="mr-2" /> Schema
            </button>
            <button 
              onClick={() => setActiveTab('indexes')}
              className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center transition-colors ${activeTab === 'indexes' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
            >
              Indexes
            </button>
          </div>
          
          {stats && (
            <div className="flex items-center space-x-4 text-xs text-gray-400 pb-2 font-mono">
              <span>Docs: <strong className="text-gray-200">{stats.documents?.toLocaleString()}</strong></span>
              <span>Storage: <strong className="text-gray-200">{formatBytes(stats.storageSize)}</strong></span>
              <span>Avg Size: <strong className="text-gray-200">{formatBytes(stats.avgSize)}</strong></span>
              <span>Indexes: <strong className="text-gray-200">{stats.indexes}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopNavigation;
