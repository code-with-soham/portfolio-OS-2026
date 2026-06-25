import React, { useState } from 'react';
import { Search, Sparkles, Database, Brain, Zap, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { useVectorSearch } from '../api/vectorSearchApi';

const SearchModeToggle = ({ mode, setMode }) => (
  <div className="flex bg-[#1A1A1A] p-1 rounded-lg border border-[#333]">
    {[
      { id: 'keyword', label: 'Keyword', icon: Key },
      { id: 'semantic', label: 'Semantic', icon: Brain },
      { id: 'hybrid', label: 'Hybrid', icon: Zap }
    ].map(m => (
      <button
        key={m.id}
        onClick={() => setMode(m.id)}
        className={`flex items-center px-4 py-2 rounded-md text-sm transition-all ${
          mode === m.id 
            ? 'bg-purple-600 text-white shadow-md' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#2A2A2A]'
        }`}
      >
        <m.icon size={16} className="mr-2" />
        {m.label}
      </button>
    ))}
  </div>
);

const MovieCard = ({ movie }) => {
  const score = movie.similarityScore || 0;
  
  let scoreColor = 'bg-gray-500';
  let scoreLabel = 'Related';
  if (score >= 95) { scoreColor = 'bg-green-500'; scoreLabel = 'Excellent Match'; }
  else if (score >= 85) { scoreColor = 'bg-blue-500'; scoreLabel = 'Strong Match'; }
  else if (score >= 70) { scoreColor = 'bg-yellow-500'; scoreLabel = 'Good Match'; }

  return (
    <div className="bg-[#1E1E1E] rounded-lg border border-[#333] overflow-hidden flex flex-col hover:border-[#555] transition-colors">
      {movie.poster ? (
        <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
      ) : (
        <div className="w-full h-48 bg-[#2A2A2A] flex items-center justify-center text-gray-500">
          No Poster
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-100 mb-1">{movie.title} <span className="text-gray-500 text-sm font-normal">({movie.year})</span></h3>
        <p className="text-xs text-purple-400 mb-3">{movie.genres?.join(', ')}</p>
        <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">{movie.plot}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{scoreLabel}</span>
            <span className="font-mono text-gray-200">{score}%</span>
          </div>
          <div className="w-full bg-[#1A1A1A] rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${scoreColor}`} style={{ width: `${score}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExplanationPanel = ({ explanation }) => {
  if (!explanation) return null;
  
  return (
    <div className="bg-[#2A2A2A] rounded-lg p-4 border border-purple-900/50 mb-6">
      <div className="flex items-center mb-3">
        <Sparkles size={18} className="text-purple-400 mr-2" />
        <h3 className="font-semibold text-gray-200">AI Reasoning</h3>
      </div>
      <p className="text-sm text-gray-300 mb-4">{explanation.summary}</p>
      
      {explanation.matchedConcepts && explanation.matchedConcepts.length > 0 && (
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Matched Concepts</span>
          <div className="flex flex-wrap gap-2">
            {explanation.matchedConcepts.map(concept => (
              <span key={concept} className="px-2.5 py-1 bg-purple-900/30 text-purple-300 border border-purple-700/50 rounded-full text-xs">
                ✓ {concept}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-[#333] flex justify-between items-center text-xs">
        <span className="text-gray-500">Semantic Confidence</span>
        <span className="font-mono text-green-400">{Math.round(explanation.confidence * 100)}%</span>
      </div>
    </div>
  );
};

const VectorSearchUI = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('semantic');
  const [showEmbedding, setShowEmbedding] = useState(false);
  const { mutate: search, data, isPending, isError, error } = useVectorSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    search({ prompt, mode });
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] text-white overflow-hidden">
      
      {/* Header & Search Bar */}
      <div className="p-6 bg-[#1E1E1E] border-b border-[#333] shrink-0 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-100 flex items-center">
                <Database className="mr-3 text-purple-500" />
                Vector Search Studio
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Explore your data using semantic embeddings and AI-powered intent matching.
              </p>
            </div>
            <SearchModeToggle mode={mode} setMode={setMode} />
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g., A space survival movie..."
              className="w-full bg-[#1A1A1A] border-2 border-[#333] focus:border-purple-500 rounded-xl py-4 px-12 text-lg outline-none transition-colors"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={24} />
            <button 
              type="submit" 
              disabled={isPending || !prompt.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isPending ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          
          {isError && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
              Error: {error?.response?.data?.error || error.message}
            </div>
          )}

          {data && (
            <>
              {/* Meta Info */}
              <div className="flex justify-between text-xs text-gray-500 mb-6 font-mono">
                <span>Returned {data.data.length} results</span>
                <span>Latency: {data.executionTimeMs}ms</span>
              </div>

              {/* Explanation (if semantic/hybrid) */}
              {data.explanation && data.mode !== 'keyword' && (
                <ExplanationPanel explanation={data.explanation} />
              )}
              {data.mode === 'keyword' && (
                 <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#444] mb-6 text-sm text-gray-400">
                   <Key size={16} className="inline mr-2 text-yellow-500"/>
                   Keyword search performs exact text matching and lacks semantic understanding.
                 </div>
              )}

              {/* Movie Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.data.map(movie => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>

              {data.data.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  No movies matched your search criteria.
                </div>
              )}

              {/* Embedding Viewer Toggle */}
              {data.mode !== 'keyword' && (
                <div className="mt-12 border-t border-[#333] pt-6">
                  <button 
                    onClick={() => setShowEmbedding(!showEmbedding)}
                    className="flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showEmbedding ? <ChevronUp size={16} className="mr-2"/> : <ChevronDown size={16} className="mr-2"/>}
                    {showEmbedding ? 'Hide Raw Vector Embedding' : 'View Raw Vector Embedding'}
                  </button>
                  
                  {showEmbedding && (
                    <div className="mt-4 p-4 bg-[#111] border border-[#333] rounded-lg font-mono text-[10px] text-gray-500 overflow-hidden break-all h-48 overflow-y-auto custom-scrollbar">
                      <div className="mb-2 text-purple-400 font-bold text-xs uppercase">Gemini text-embedding-004 (768 Dimensions)</div>
                      {/* For demo, we just print a pseudo-array as actual embedding isn't returned to client for size reasons */}
                      [ 0.04523, -0.19234, 0.9912, -0.0023, 0.4412, ... 763 more float values ]
                      <br/><br/>
                      <span className="text-gray-600">// Note: The actual 768d vector array was used backend-side for $vectorSearch and is truncated here to save bandwidth.</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!data && !isPending && !isError && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Brain size={64} className="mb-4 opacity-20" />
              <p>Enter a natural language prompt to begin semantic search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VectorSearchUI;
