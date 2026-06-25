import React, { useState } from 'react';
import { useMongoStore } from '../hooks/useMongoStore';
import { useCollectionDocuments } from '../hooks/useDatabaseQueries';
import { ArrowLeft, ArrowRight, FileJson, LayoutGrid, List, Code } from 'lucide-react';
import { useWindowStore } from '../../../store/useWindowStore';
import GridView from './Views/GridView';
import TableView from './Views/TableView';
import JsonView from './Views/JsonView';

const PaginationControl = () => {
  const { page, limit, setPage, setLimit } = useMongoStore();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-400">Rows</span>
        <select 
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-[#1E1E1E] border border-gray-600 text-gray-200 rounded px-2 py-1 outline-none focus:border-[var(--color-accent)]"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1 rounded text-gray-400 hover:bg-[#2A2D2E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-gray-300 font-medium px-2">{page}</span>
        <button 
          onClick={() => setPage(page + 1)}
          className="p-1 rounded text-gray-400 hover:bg-[#2A2D2E] hover:text-white"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const DocumentViewer = () => {
  const { currentCollection, searchQuery, page, limit, sort, order, setSort, viewMode, setViewMode } = useMongoStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const [allExpanded, setAllExpanded] = useState(true);

  const { data, isLoading, isError, error } = useCollectionDocuments(currentCollection, {
    page, limit, sort, order, search: searchQuery
  });

  const handleOpenDetails = (doc) => {
    openWindow('mongodocument', { documentData: doc, collection: currentCollection });
  };

  if (!currentCollection) return null;

  const docs = data?.documents || [];
  const totalCount = data?.totalCount || 0;
  
  const startIdx = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, totalCount);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1A1A1A]">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#212121] border-b border-[var(--color-border)] text-xs text-gray-400">
        <div className="flex items-center gap-4">
          
          {/* View Toggles */}
          <div className="flex bg-[#1E1E1E] rounded-md border border-gray-600 overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-white' : 'hover:bg-[#2A2D2E]'}`}
              title="Grid View"
            ><LayoutGrid size={14} /></button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-[var(--color-accent)] text-white' : 'hover:bg-[#2A2D2E]'}`}
              title="Table View"
            ><List size={14} /></button>
            <button 
              onClick={() => setViewMode('json')}
              className={`p-1.5 transition-colors ${viewMode === 'json' ? 'bg-[var(--color-accent)] text-white' : 'hover:bg-[#2A2D2E]'}`}
              title="JSON View"
            ><Code size={14} /></button>
          </div>

          <div className="h-4 w-px bg-gray-600"></div>
          
          {viewMode === 'grid' && (
            <>
              <button onClick={() => setAllExpanded(true)} className="hover:text-white transition-colors">Expand All</button>
              <button onClick={() => setAllExpanded(false)} className="hover:text-white transition-colors">Collapse All</button>
              <div className="h-4 w-px bg-gray-600"></div>
            </>
          )}
          
          {/* Simple Sort Controls */}
          <div className="flex items-center space-x-2">
            <span>Sort By:</span>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value, order)}
              className="bg-[#1E1E1E] border border-gray-600 text-gray-200 rounded px-2 py-0.5 outline-none"
            >
              <option value="_id">_id</option>
              <option value="title">Title / Name</option>
              <option value="year">Year</option>
              <option value="imdb.rating">IMDb</option>
              <option value="released">Released</option>
            </select>
            <select 
              value={order}
              onChange={(e) => setSort(sort, e.target.value)}
              className="bg-[#1E1E1E] border border-gray-600 text-gray-200 rounded px-2 py-0.5 outline-none"
            >
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-300">
            {isLoading ? 'Loading...' : `${startIdx}–${endIdx} of ${totalCount.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative bg-[#1A1A1A]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A] bg-opacity-80 z-20">
            <div className="flex flex-col items-center">
              <div className="loading-spinner w-8 h-8 border-4 border-gray-600 border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 font-medium">Fetching documents...</p>
            </div>
          </div>
        )}
        
        {isError && (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <p>Error loading documents: {error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && docs.length > 0 && (
          <>
            {viewMode === 'grid' && (
              <GridView docs={docs} allExpanded={allExpanded} onOpenDetails={handleOpenDetails} currentCollection={currentCollection} />
            )}
            {viewMode === 'table' && (
              <TableView docs={docs} onOpenDetails={handleOpenDetails} />
            )}
            {viewMode === 'json' && (
              <JsonView docs={docs} />
            )}
          </>
        )}

        {!isLoading && !isError && docs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileJson size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No documents found.</p>
            {searchQuery && <p className="text-sm mt-2">Try adjusting your filter query.</p>}
          </div>
        )}
      </div>

      {/* Bottom Pagination Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#212121] border-t border-[var(--color-border)] text-xs">
        <div className="text-gray-500">
          MongoDB Atlas Cloud Query
        </div>
        <PaginationControl />
      </div>
    </div>
  );
};

export default DocumentViewer;
