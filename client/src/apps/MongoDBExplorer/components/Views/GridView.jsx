import React, { useState } from 'react';
import { Copy, Trash2, Edit2, ChevronDown, ChevronRight, FileJson, Check, ExternalLink, Film } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DocumentCard = ({ doc, index, allExpanded, onOpenDetails, isMovie }) => {
  const [localExpanded, setLocalExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setLocalExpanded(allExpanded);
  }, [allExpanded]);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const docId = doc._id || `Document ${index + 1}`;

  return (
    <div 
      className="border border-[var(--color-border)] rounded-md mb-4 bg-[#1E1E1E] overflow-hidden shadow-sm cursor-pointer hover:border-gray-500 transition-colors"
      onClick={() => onOpenDetails(doc)}
    >
      <div className="flex items-center justify-between p-2 bg-[#2D2D2D] border-b border-[var(--color-border)] group">
        <div className="flex items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); setLocalExpanded(!localExpanded); }} 
            className="mr-2 text-gray-400 hover:text-gray-200"
          >
            {localExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <span className="text-xs font-mono text-gray-400">
            {typeof docId === 'object' && docId !== null ? `ObjectId("${docId.toString()}")` : docId.toString()}
          </span>
          
          {isMovie && doc.title && (
             <span className="ml-3 text-xs text-gray-300 font-medium truncate max-w-[200px]">
               {doc.title}
             </span>
          )}
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onOpenDetails(doc); }} className="text-gray-400 hover:text-indigo-400 p-1" title="Open Details"><ExternalLink size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-400 hover:text-blue-400 p-1" title="Edit Document"><Edit2 size={14} /></button>
          <button onClick={handleCopy} className="text-gray-400 hover:text-green-400 p-1" title="Copy JSON">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-400 hover:text-red-400 p-1" title="Delete Document"><Trash2 size={14} /></button>
        </div>
      </div>
      
      {localExpanded && (
        <div className="flex bg-[#1E1E1E]">
          {isMovie && doc.poster && (
            <div className="p-4 pr-0 hidden sm:block flex-shrink-0">
              <img src={doc.poster} alt={doc.title} className="w-24 h-36 object-cover rounded shadow-md border border-[#333]" />
            </div>
          )}
          <div className="p-4 overflow-x-auto text-sm font-mono custom-scrollbar flex-1">
            <SyntaxHighlighter 
              language="json" 
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}
              wrapLongLines={false}
            >
              {JSON.stringify(doc, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

const GridView = ({ docs, allExpanded, onOpenDetails, currentCollection }) => {
  const isMovie = currentCollection === 'movies' || currentCollection === 'embedded_movies';
  
  return (
    <>
      {docs.map((doc, idx) => (
        <DocumentCard 
          key={doc._id || idx} 
          doc={doc} 
          index={idx} 
          allExpanded={allExpanded} 
          onOpenDetails={onOpenDetails} 
          isMovie={isMovie}
        />
      ))}
    </>
  );
};

export default GridView;
