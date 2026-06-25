import React, { useState } from 'react';
import { Database, FileJson, Activity, Code, Clock, Star, Film, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MongoDocumentApp = ({ documentData = {}, collection }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(documentData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderOverview = () => {
    if (collection === 'movies' || collection === 'embedded_movies') {
      const { title, poster, plot, fullplot, cast, directors, imdb, tomatoes, runtime, released, genres, year } = documentData;
      
      return (
        <div className="flex gap-6 h-full overflow-y-auto p-2 custom-scrollbar">
          <div className="w-1/3 min-w-[200px] max-w-[300px]">
            {poster ? (
              <img src={poster} alt={title} className="w-full rounded-md shadow-lg border border-[#333]" />
            ) : (
              <div className="w-full aspect-[2/3] bg-[#2A2A2A] rounded-md flex flex-col items-center justify-center text-gray-500 border border-[#333]">
                <Film size={48} className="mb-2 opacity-50" />
                <span>No Poster</span>
              </div>
            )}
            
            <div className="mt-4 space-y-3">
              <div className="bg-[#212121] p-3 rounded-md border border-[#333]">
                <div className="text-xs text-gray-400 mb-1 flex items-center"><Star size={12} className="mr-1 text-yellow-500" /> IMDb</div>
                <div className="font-semibold text-gray-200">{imdb?.rating || 'N/A'} <span className="text-xs text-gray-500 font-normal">({imdb?.votes || 0} votes)</span></div>
              </div>
              
              <div className="bg-[#212121] p-3 rounded-md border border-[#333]">
                <div className="text-xs text-gray-400 mb-1 flex items-center"><Clock size={12} className="mr-1 text-blue-400" /> Runtime</div>
                <div className="font-semibold text-gray-200">{runtime ? `${runtime} min` : 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-gray-300 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{title || 'Untitled'} <span className="text-gray-500 font-normal">({year || 'N/A'})</span></h1>
              <div className="flex gap-2 flex-wrap">
                {genres?.map((g, i) => <span key={i} className="px-2 py-1 bg-[#2A2A2A] rounded text-xs border border-[#444] text-gray-300">{g}</span>)}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Plot</h3>
              <p className="text-sm leading-relaxed">{fullplot || plot || 'No plot available.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Directors</h3>
                <p className="text-sm">{directors?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Cast</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {cast?.map((c, i) => <li key={i}>{c}</li>) || <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default overview for other collections
    return (
      <div className="h-full overflow-y-auto p-4 custom-scrollbar text-gray-300 text-sm flex flex-col items-center justify-center">
        <Database size={64} className="mb-4 text-gray-600" />
        <p className="text-lg text-gray-400 mb-2">No specialized visualizer available for `{collection}`.</p>
        <button onClick={() => setActiveTab('json')} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-md hover:bg-green-600 transition-colors">
          View as JSON
        </button>
      </div>
    );
  };

  const renderJson = () => (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[#1E1E1E] p-4 text-sm font-mono rounded border border-[#333] relative group">
      <button 
        onClick={handleCopy} 
        className="absolute top-4 right-4 p-2 bg-[#2D2D2D] text-gray-400 hover:text-white rounded border border-[#444] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>
      <SyntaxHighlighter 
        language="json" 
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
      >
        {JSON.stringify(documentData, null, 2)}
      </SyntaxHighlighter>
    </div>
  );

  const renderStats = () => {
    const sizeBytes = new Blob([JSON.stringify(documentData)]).size;
    const keysCount = Object.keys(documentData).length;
    
    return (
      <div className="p-6 text-gray-300 space-y-6 h-full overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-[#333] pb-2">Document Statistics</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#212121] p-4 rounded-md border border-[#333]">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Estimated Size</div>
            <div className="text-2xl font-mono text-gray-200">{sizeBytes} Bytes</div>
          </div>
          <div className="bg-[#212121] p-4 rounded-md border border-[#333]">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Top-Level Keys</div>
            <div className="text-2xl font-mono text-gray-200">{keysCount} Fields</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1A1A1A] font-sans text-[var(--color-text-primary)]">
      {/* Header / Tabs */}
      <div className="flex border-b border-[var(--color-border)] bg-[#212121]">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[#2A2A2A]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2A2A2A]'}`}
        >
          <Database size={16} className="mr-2" /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('json')}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'json' ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[#2A2A2A]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2A2A2A]'}`}
        >
          <FileJson size={16} className="mr-2" /> JSON Document
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'stats' ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[#2A2A2A]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2A2A2A]'}`}
        >
          <Activity size={16} className="mr-2" /> Statistics
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 min-h-0">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'json' && renderJson()}
        {activeTab === 'stats' && renderStats()}
      </div>
    </div>
  );
};

export default MongoDocumentApp;
