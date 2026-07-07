import { motion } from 'framer-motion';
import {
  AddRegular,
  CutRegular,
  CopyRegular,
  ClipboardPasteRegular,
  RenameRegular,
  ShareRegular,
  DeleteRegular,
  ArrowSortRegular,
  GridRegular,
  ListRegular,
  SearchRegular,
  ArrowLeftRegular,
  ArrowUpRegular,
  ArrowClockwiseRegular
} from '@fluentui/react-icons';
import ExplorerBreadcrumb from './ExplorerBreadcrumb';
import { useState } from 'react';

export default function ExplorerToolbar({ 
  currentPath, 
  navigateTo, 
  goBack, 
  goUp, 
  viewMode, 
  setViewMode, 
  onAction 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="explorer-toolbar-container"
    >
      {/* Top row: Core actions */}
      <div className="explorer-toolbar-actions">
        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => onAction('new')} title="New">
            <AddRegular /> <span className="btn-label">New</span>
          </button>
        </div>
        
        <div className="toolbar-divider" />
        
        <div className="toolbar-group">
          <button className="toolbar-btn icon-only" title="Cut"><CutRegular /></button>
          <button className="toolbar-btn icon-only" title="Copy"><CopyRegular /></button>
          <button className="toolbar-btn icon-only" title="Paste"><ClipboardPasteRegular /></button>
          <button className="toolbar-btn icon-only" onClick={() => onAction('rename')} title="Rename"><RenameRegular /></button>
          <button className="toolbar-btn icon-only" title="Share"><ShareRegular /></button>
          <button className="toolbar-btn icon-only" onClick={() => onAction('delete')} title="Delete"><DeleteRegular color="#e81123" /></button>
        </div>

        <div className="toolbar-divider" />
        
        <div className="toolbar-group">
          <button className="toolbar-btn" title="Sort">
            <ArrowSortRegular /> <span className="btn-label">Sort</span>
          </button>
          <button className="toolbar-btn" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} title="View">
            {viewMode === 'grid' ? <GridRegular /> : <ListRegular />} <span className="btn-label">View</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Navigation and Search */}
      <div className="explorer-toolbar-nav">
        <div className="nav-controls">
          <button className="nav-btn" onClick={goBack} disabled={currentPath.length <= 1}>
            <ArrowLeftRegular />
          </button>
          <button className="nav-btn" onClick={goUp} disabled={currentPath.length <= 1}>
            <ArrowUpRegular />
          </button>
          <button className="nav-btn" onClick={() => {}}>
            <ArrowClockwiseRegular />
          </button>
        </div>
        
        <div className="breadcrumb-wrapper">
          <ExplorerBreadcrumb currentPath={currentPath} navigateTo={navigateTo} />
        </div>
        
        <div className="search-wrapper">
          <SearchRegular className="search-icon" />
          <input 
            type="text" 
            placeholder={`Search ${currentPath[currentPath.length - 1]}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
    </motion.div>
  );
}
