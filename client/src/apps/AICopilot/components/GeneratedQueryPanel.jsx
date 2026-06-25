import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, ExternalLink, Code2 } from 'lucide-react';
import { useCopilotStore } from '../hooks/useCopilotStore';
import { useExecutePlan } from '../api/databaseCopilotApi';

const GeneratedQueryPanel = ({ setExecutionResult, setExecutionError }) => {
  const { activePlan, isAwaitingApproval, approvePlan } = useCopilotStore();
  const { mutate: executePlan, isPending } = useExecutePlan();

  if (!activePlan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1E1E1E] border-r border-b border-[#333] text-gray-500 font-mono text-sm">
        <Code2 size={32} className="mb-4 opacity-30" />
        <p>Awaiting query generation...</p>
      </div>
    );
  }

  // Format the code nicely
  let codeSnippet = '';
  if (activePlan.operation === 'aggregate') {
    codeSnippet = `db.${activePlan.collection}.aggregate(${JSON.stringify(activePlan.pipeline, null, 2)})`;
  } else if (activePlan.operation === 'find') {
    codeSnippet = `db.${activePlan.collection}.find(\n  ${JSON.stringify(activePlan.filter || {}, null, 2)}`;
    if (activePlan.projection && Object.keys(activePlan.projection).length > 0) {
      codeSnippet += `,\n  ${JSON.stringify(activePlan.projection, null, 2)}`;
    }
    codeSnippet += `\n)`;
    if (activePlan.sort && Object.keys(activePlan.sort).length > 0) {
      codeSnippet += `.sort(${JSON.stringify(activePlan.sort, null, 2)})`;
    }
    if (activePlan.limit) {
      codeSnippet += `.limit(${activePlan.limit})`;
    }
  } else if (activePlan.operation === 'count') {
    codeSnippet = `db.${activePlan.collection}.countDocuments(${JSON.stringify(activePlan.filter || {}, null, 2)})`;
  }

  const handleExecute = () => {
    approvePlan();
    executePlan(activePlan, {
      onSuccess: (data) => {
        setExecutionResult(data);
        setExecutionError(null);
      },
      onError: (err) => {
        setExecutionResult(null);
        setExecutionError(err);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1E1E1E] border-r border-b border-[#333]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#333]">
        <div className="flex items-center space-x-3 text-xs font-mono text-gray-400">
          <span className="text-purple-400 font-semibold">Generated Query</span>
          <span className="px-2 py-0.5 bg-[#1A1A1A] border border-[#444] rounded">
            Target: {activePlan.collection}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="flex items-center px-3 py-1 bg-[#3A3A3A] hover:bg-[#444] text-white rounded text-xs transition-colors"
            onClick={() => {/* Trigger open in playground */}}
          >
            <ExternalLink size={12} className="mr-1.5" /> Open in Playground
          </button>
          
          {isAwaitingApproval && (
            <button 
              onClick={handleExecute}
              disabled={isPending}
              className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
            >
              {isPending ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  Executing...
                </>
              ) : (
                <>
                  <Play size={12} className="mr-1.5 fill-current" /> Approve & Execute
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={codeSnippet}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            wordWrap: "on"
          }}
        />
      </div>
    </div>
  );
};

export default GeneratedQueryPanel;
