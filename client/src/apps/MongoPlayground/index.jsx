import React, { useState } from 'react';
import { Database, Zap, Book } from 'lucide-react';
import { useCollections } from '../MongoDBExplorer/hooks/useDatabaseQueries';
import PlaygroundEditor from './components/PlaygroundEditor';
import OutputViewer from './components/OutputViewer';
import { useExecuteQuery } from './api/databasePlaygroundApi';
import ErrorBoundary from '../MongoDBExplorer/components/ErrorBoundary';

const MongoPlaygroundApp = () => {
  const { data: collections = [], isLoading: isLoadingCollections } = useCollections();
  const [code, setCode] = useState('db.movies.find({\n  year: { $gt: 2015 }\n}).limit(5)');
  
  const { mutate: executeQuery, data: result, isPending, isError, error } = useExecuteQuery();

  const handleExecute = () => {
    if (!code.trim()) return;
    executeQuery(code);
  };

  const insertSnippet = (snippet) => {
    setCode(snippet);
  };

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col bg-[#1A1A1A] text-gray-200 overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="h-10 bg-[#2D2D2D] border-b border-[#333] flex items-center px-4 flex-shrink-0">
          <Zap size={16} className="text-yellow-500 mr-2" />
          <span className="font-semibold text-sm">Mongo Playground</span>
          <div className="ml-auto text-xs text-gray-500 font-mono">
            Connected to Cluster0
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Collections */}
          <div className="w-64 bg-[#212121] border-r border-[#333] flex flex-col h-full">
            <div className="p-3 border-b border-[#333] text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
              <Database size={14} className="mr-2" /> Collections
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
              {isLoadingCollections ? (
                <div className="px-4 py-2 text-xs text-gray-500">Loading...</div>
              ) : (
                collections.map(col => (
                  <div 
                    key={col.name}
                    className="px-4 py-1.5 text-sm hover:bg-[#2A2A2A] cursor-pointer group flex justify-between items-center transition-colors"
                    onClick={() => insertSnippet(`db.${col.name}.find({})`)}
                  >
                    <span className="text-gray-300 group-hover:text-white truncate">{col.name}</span>
                    <span className="text-xs text-gray-600 group-hover:text-gray-400">{col.count}</span>
                  </div>
                ))
              )}
            </div>
            
            {/* Snippets Area */}
            <div className="p-3 border-t border-b border-[#333] text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center mt-auto">
              <Book size={14} className="mr-2" /> Snippets
            </div>
            <div className="py-2 text-xs">
              <div 
                className="px-4 py-1.5 hover:bg-[#2A2A2A] cursor-pointer text-blue-400 truncate"
                onClick={() => insertSnippet(`db.movies.aggregate([\n  { $match: { year: { $gte: 2000 } } },\n  { $group: { _id: "$genres", count: { $sum: 1 } } },\n  { $sort: { count: -1 } }\n])`)}
              >
                Aggregation Example
              </div>
              <div 
                className="px-4 py-1.5 hover:bg-[#2A2A2A] cursor-pointer text-purple-400 truncate"
                onClick={() => insertSnippet(`db.users.countDocuments({ "preferences.theme": "dark" })`)}
              >
                Count Documents
              </div>
            </div>
          </div>

          {/* Main Area (Split View) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
            {/* Top Half: Editor */}
            <div className="h-1/2 flex flex-col border-b-4 border-[#111]">
              <PlaygroundEditor 
                code={code} 
                setCode={setCode} 
                onExecute={handleExecute} 
                isLoading={isPending} 
              />
            </div>
            
            {/* Bottom Half: Output */}
            <div className="h-1/2 flex flex-col">
              <OutputViewer 
                result={result} 
                isError={isError} 
                error={error} 
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MongoPlaygroundApp;
