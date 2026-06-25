import React from 'react';
import { Search, RefreshCw, Download, Sparkles, Database, LayoutTemplate, Layers } from 'lucide-react';
import { useMongoStore } from '../hooks/useMongoStore';

const TopNavigation = () => {
  const { currentCollection, searchQuery, setSearchQuery, refreshData } = useMongoStore();

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
            <div className="relative flex-1" style={{ maxWidth: '500px' }}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-600 rounded-md leading-5 bg-[#1E1E1E] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] sm:text-sm transition-colors"
                placeholder={`Filter ${currentCollection}... (e.g. { "year": 1893 })`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {currentCollection && (
          <div className="flex items-center gap-2 ml-4">
            <button 
              onClick={refreshData}
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

      {/* Tabs Row */}
      {currentCollection && (
        <div className="flex items-center px-4 pt-2 space-x-1">
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-[var(--color-accent)] text-[var(--color-accent)] flex items-center">
            <Database size={14} className="mr-2" />
            Documents
          </button>
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600 flex items-center transition-colors">
            <Layers size={14} className="mr-2" />
            Aggregation
          </button>
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600 flex items-center transition-colors">
            <LayoutTemplate size={14} className="mr-2" />
            Schema
          </button>
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors">
            Indexes
          </button>
        </div>
      )}
    </div>
  );
};

export default TopNavigation;
