import React from 'react';
import { Sparkles, ChevronRight, MessageSquare, Code, Cpu, Database } from 'lucide-react';
import { useMongoStore } from '../hooks/useMongoStore';

const AIPanel = () => {
  const { currentCollection, setSearchQuery } = useMongoStore();

  const handlePromptClick = (prompt) => {
    // In Phase 2, this will send the prompt to Gemini. For now, it populates the search if applicable.
    if (prompt === 'Find Sci-Fi movies' && currentCollection === 'movies') {
      setSearchQuery('{ "genres": "Sci-Fi" }');
    } else if (prompt === 'Movies after 2015' && currentCollection === 'movies') {
      setSearchQuery('{ "year": { "$gt": 2015 } }');
    }
  };

  return (
    <div className="w-80 bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] h-full flex flex-col font-sans">
      
      {/* AI Header */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-center bg-indigo-900 bg-opacity-20">
        <Sparkles size={18} className="text-indigo-400 mr-2" />
        <h3 className="font-semibold text-gray-200">Ask Gemini</h3>
      </div>

      {/* AI Chat/Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        <div className="bg-indigo-900 bg-opacity-10 border border-indigo-500 border-opacity-30 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 leading-relaxed">
            I am your AI Database Assistant. I can help you write queries, generate aggregations, or understand your schema.
          </p>
        </div>

        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Suggested Prompts
        </h4>

        <div className="space-y-2">
          <button 
            onClick={() => handlePromptClick('Find Sci-Fi movies')}
            className="w-full text-left p-3 rounded-md bg-[#1E1E1E] border border-[var(--color-border)] hover:border-indigo-500 hover:bg-indigo-900 hover:bg-opacity-10 transition-colors flex items-start group"
          >
            <Database size={14} className="text-gray-400 mt-0.5 mr-2 group-hover:text-indigo-400" />
            <span className="text-sm text-gray-300 flex-1">Find Sci-Fi movies</span>
            <ChevronRight size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
          </button>
          
          <button 
            onClick={() => handlePromptClick('Movies after 2015')}
            className="w-full text-left p-3 rounded-md bg-[#1E1E1E] border border-[var(--color-border)] hover:border-indigo-500 hover:bg-indigo-900 hover:bg-opacity-10 transition-colors flex items-start group"
          >
            <Database size={14} className="text-gray-400 mt-0.5 mr-2 group-hover:text-indigo-400" />
            <span className="text-sm text-gray-300 flex-1">Movies after 2015</span>
            <ChevronRight size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
          </button>

          <button 
            className="w-full text-left p-3 rounded-md bg-[#1E1E1E] border border-[var(--color-border)] hover:border-indigo-500 hover:bg-indigo-900 hover:bg-opacity-10 transition-colors flex items-start group"
          >
            <Cpu size={14} className="text-gray-400 mt-0.5 mr-2 group-hover:text-indigo-400" />
            <span className="text-sm text-gray-300 flex-1">Explain this schema</span>
            <ChevronRight size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
          </button>

          <button 
            className="w-full text-left p-3 rounded-md bg-[#1E1E1E] border border-[var(--color-border)] hover:border-indigo-500 hover:bg-indigo-900 hover:bg-opacity-10 transition-colors flex items-start group"
          >
            <Code size={14} className="text-gray-400 mt-0.5 mr-2 group-hover:text-indigo-400" />
            <span className="text-sm text-gray-300 flex-1">Generate Aggregation</span>
            <ChevronRight size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[#1A1A1A]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask AI a question..." 
            className="w-full bg-[#2D2D2D] border border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            disabled
          />
          <button className="absolute right-2 top-2 text-gray-400 hover:text-indigo-400" disabled>
            <MessageSquare size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-500 mt-2">
          Gemini AI Integration arriving in Phase 2
        </p>
      </div>

    </div>
  );
};

export default AIPanel;
