import React from 'react';
import { Terminal, Database, Activity, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DeveloperPanel = ({ isOpen, onClose, queryStr, activeCollection }) => {
  if (!isOpen) return null;

  const sampleMongoQuery = queryStr ? `{ $match: ${queryStr} }` : `{ $match: {} }`;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-[#1A1A1A] border-l border-[var(--color-border)] shadow-2xl flex flex-col z-50 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[#212121]">
        <h3 className="font-semibold text-gray-200 flex items-center">
          <Terminal size={16} className="mr-2 text-indigo-400" />
          Developer Telemetry
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-sm space-y-6">
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <Activity size={14} className="mr-1" /> Execution Stats
          </h4>
          <div className="bg-[#212121] rounded border border-[#333] p-3 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Target</span>
              <span className="text-green-400">{activeCollection || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Latency</span>
              <span className="text-blue-400">~145ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cache</span>
              <span className="text-yellow-400">HIT</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <Database size={14} className="mr-1" /> API Endpoint
          </h4>
          <div className="bg-[#212121] rounded border border-[#333] p-3 text-xs font-mono text-blue-300 break-all">
            GET /api/db/collection/{activeCollection || ':id'}?page=1&limit=25
          </div>
        </div>

        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <Code size={14} className="mr-1" /> Executed MongoDB Query
          </h4>
          <div className="bg-[#1E1E1E] rounded border border-[#333] overflow-hidden text-xs">
            <SyntaxHighlighter 
              language="json" 
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: '12px', background: 'transparent' }}
            >
              {sampleMongoQuery}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPanel;
