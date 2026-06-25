import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';
import { useCopilotStore } from '../hooks/useCopilotStore';
import { useGeneratePlan } from '../api/databaseCopilotApi';
import { useDatabaseSchema } from '../../MongoDBExplorer/hooks/useDatabaseQueries';

const SUGGESTIONS = [
  "Top 20 Comedy movies",
  "Highest rated Christopher Nolan movies",
  "Count Horror movies",
  "Movies longer than 2 hours",
  "Top Directors",
  "Average Runtime",
  "Oscar winners"
];

const CopilotConversation = () => {
  const { conversation, addMessage, setActivePlan } = useCopilotStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const { mutate: generatePlan, isPending } = useGeneratePlan();
  
  // We can fetch schema context for a default collection, or all of them. 
  // For safety and performance, we'll pass an empty object or a summarized schema if needed.
  // We'll leave it empty for now and let the backend infer or handle it.
  const schemaContext = {};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isPending]);

  const handleSubmit = (text) => {
    if (!text.trim() || isPending) return;

    // Add User Message
    addMessage({ role: 'user', content: text });
    setInput('');

    // Call API
    generatePlan({ prompt: text, schemaContext }, {
      onSuccess: (plan) => {
        if (plan.intent === 'error') {
          addMessage({ role: 'ai', content: plan.explanation || "I couldn't understand that request." });
        } else {
          setActivePlan(plan);
          addMessage({ 
            role: 'ai', 
            content: `I've prepared an execution plan for this request. Please review and approve it.`,
            planSummary: {
              intent: plan.intent,
              collection: plan.collection,
              cost: plan.estimatedCost || 'Unknown'
            }
          });
        }
      },
      onError: (error) => {
        addMessage({ role: 'ai', content: `Error: ${error.message}` });
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] border-r border-[#333]">
      <div className="p-4 border-b border-[#333] bg-[#212121] flex items-center shrink-0">
        <Bot size={20} className="text-purple-400 mr-2" />
        <h2 className="font-semibold text-gray-200">AI Copilot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <Sparkles size={48} className="mb-4 text-purple-500 opacity-50" />
            <p className="mb-6 max-w-xs">I'm your MongoDB Copilot. Ask me to generate queries, build aggregations, or analyze your data.</p>
            
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button 
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="px-3 py-1.5 bg-[#2A2A2A] hover:bg-[#333] rounded-full text-xs transition-colors flex items-center border border-[#444]"
                >
                  <Lightbulb size={12} className="mr-1.5 text-yellow-500" /> {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-[#2A2A2A] text-gray-200 rounded-tl-none border border-[#333]'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.planSummary && (
                  <div className="mt-2 p-2 bg-[#1A1A1A] rounded border border-purple-900/50 font-mono text-xs text-gray-400">
                    <span className="text-purple-400">Intent:</span> {msg.planSummary.intent}<br/>
                    <span className="text-blue-400">Target:</span> {msg.planSummary.collection}<br/>
                    <span className="text-yellow-400">Cost:</span> {msg.planSummary.cost}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-[#2A2A2A] p-3 rounded-lg rounded-tl-none border border-[#333] flex space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#212121] border-t border-[#333] shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }}
          className="flex items-center bg-[#1A1A1A] rounded-md border border-[#444] overflow-hidden focus-within:border-purple-500 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot..."
            className="flex-1 bg-transparent p-3 text-sm text-white outline-none"
            disabled={isPending}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isPending}
            className="p-3 text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CopilotConversation;
