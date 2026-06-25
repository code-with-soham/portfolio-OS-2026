import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const JsonView = ({ docs }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(docs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full bg-[#1E1E1E] rounded border border-[var(--color-border)] group">
      <button 
        onClick={handleCopy} 
        className="absolute top-4 right-4 p-2 bg-[#2D2D2D] text-gray-400 hover:text-white rounded border border-[#444] opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Copy All JSON"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>
      <div className="absolute inset-0 overflow-auto custom-scrollbar p-4">
        <SyntaxHighlighter 
          language="json" 
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}
          wrapLongLines={false}
        >
          {JSON.stringify(docs, null, 2)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default JsonView;
