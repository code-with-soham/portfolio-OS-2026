import React, { useState } from 'react';
import { LayoutGrid, List, Code, FileJson, Clock, ListOrdered, CheckCircle2, AlertCircle } from 'lucide-react';
import TableView from '../../MongoDBExplorer/components/Views/TableView';
import JsonView from '../../MongoDBExplorer/components/Views/JsonView';

const OutputViewer = ({ result, isError, error }) => {
  const [viewMode, setViewMode] = useState('json');

  if (isError) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#1E1E1E] p-4 text-red-400 font-mono text-sm overflow-auto">
        <div className="flex items-center mb-2">
          <AlertCircle size={16} className="mr-2" />
          <span className="font-semibold">Query Error</span>
        </div>
        <div className="bg-[#2a1a1a] p-3 rounded border border-red-900/50">
          {error?.response?.data?.error || error?.message || 'Unknown execution error'}
          {error?.response?.data?.details && (
            <div className="mt-2 text-red-300 text-xs">
              Details: {error.response.data.details}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#1E1E1E] p-4 text-gray-500 font-mono text-sm items-center justify-center">
        <FileJson size={48} className="mb-4 opacity-20" />
        <p>No results yet. Press Run to execute the query.</p>
      </div>
    );
  }

  const { data, executionTimeMs, rows, success } = result;
  
  // Format data as array even if it's a single object/number for views to handle
  const normalizedData = Array.isArray(data) ? data : (data !== undefined && data !== null ? [data] : []);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1A1A1A]">
      {/* Output Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#333] text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-green-400 font-semibold">
            <CheckCircle2 size={14} className="mr-1" /> Success
          </div>
          <div className="h-4 w-px bg-gray-600"></div>
          <div className="flex items-center text-gray-400">
            <Clock size={14} className="mr-1 text-blue-400" /> {executionTimeMs}ms
          </div>
          <div className="flex items-center text-gray-400">
            <ListOrdered size={14} className="mr-1 text-purple-400" /> {rows} rows
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex bg-[#1E1E1E] rounded-md border border-gray-600 overflow-hidden">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-[var(--color-accent)] text-white' : 'text-gray-400 hover:bg-[#2A2D2E]'}`}
            title="Table View"
          ><List size={14} /></button>
          <button 
            onClick={() => setViewMode('json')}
            className={`p-1.5 transition-colors ${viewMode === 'json' ? 'bg-[var(--color-accent)] text-white' : 'text-gray-400 hover:bg-[#2A2D2E]'}`}
            title="JSON View"
          ><Code size={14} /></button>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-hidden relative bg-[#1E1E1E]">
        {normalizedData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">
            Output is empty.
          </div>
        ) : (
          <>
            {viewMode === 'table' && <TableView docs={normalizedData} onOpenDetails={() => {}} />}
            {viewMode === 'json' && <JsonView docs={data} />}
          </>
        )}
      </div>
    </div>
  );
};

export default OutputViewer;
