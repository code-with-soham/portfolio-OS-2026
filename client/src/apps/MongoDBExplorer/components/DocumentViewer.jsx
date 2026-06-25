import React, { useState } from 'react';
import { useMongoStore } from '../hooks/useMongoStore';
import { Copy, Trash2, Edit2, ChevronDown, ChevronRight, FileJson, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DocumentCard = ({ doc, index, allExpanded }) => {
  const [localExpanded, setLocalExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  // Sync with global expand/collapse
  React.useEffect(() => {
    setLocalExpanded(allExpanded);
  }, [allExpanded]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-[var(--color-border)] rounded-md mb-4 bg-[#1E1E1E] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-2 bg-[#2D2D2D] border-b border-[var(--color-border)] group">
        <div className="flex items-center">
          <button onClick={() => setLocalExpanded(!localExpanded)} className="mr-2 text-gray-400 hover:text-gray-200">
            {localExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="text-xs font-mono text-gray-400">
            {doc._id?.$oid ? `ObjectId("${doc._id.$oid}")` : `Document ${index + 1}`}
          </span>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-gray-400 hover:text-blue-400 p-1" title="Edit Document"><Edit2 size={14} /></button>
          <button onClick={handleCopy} className="text-gray-400 hover:text-green-400 p-1" title="Copy JSON">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button className="text-gray-400 hover:text-red-400 p-1" title="Delete Document"><Trash2 size={14} /></button>
        </div>
      </div>
      
      {localExpanded && (
        <div className="p-4 overflow-x-auto text-sm font-mono custom-scrollbar">
          <SyntaxHighlighter 
            language="json" 
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}
            wrapLongLines={false}
          >
            {JSON.stringify(doc, null, 2)}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

const DocumentViewer = () => {
  const { documents, searchQuery, currentCollection } = useMongoStore();
  const [allExpanded, setAllExpanded] = useState(true);

  // Simple client-side search mock
  const filteredDocs = React.useMemo(() => {
    if (!searchQuery) return documents;
    try {
      const query = searchQuery.toLowerCase();
      return documents.filter(doc => JSON.stringify(doc).toLowerCase().includes(query));
    } catch (e) {
      return documents;
    }
  }, [documents, searchQuery]);

  if (!currentCollection) return null; // Handled by WelcomeScreen

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1A1A1A]">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#212121] border-b border-[var(--color-border)] text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <button onClick={() => setAllExpanded(true)} className="hover:text-white transition-colors">Expand All</button>
          <button onClick={() => setAllExpanded(false)} className="hover:text-white transition-colors">Collapse All</button>
          <button className="flex items-center hover:text-white transition-colors">
            <FileJson size={14} className="mr-1" /> Pretty Print
          </button>
        </div>
        <div>
          <span className="font-medium text-gray-300">
            {filteredDocs.length > 0 ? `1–${filteredDocs.length} of 21,349` : '0 Documents'}
          </span>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc, idx) => (
            <DocumentCard key={doc._id?.$oid || idx} doc={doc} index={idx} allExpanded={allExpanded} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No documents found matching your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
