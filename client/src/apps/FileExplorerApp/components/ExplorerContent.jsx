import { FolderOpenRegular } from '@fluentui/react-icons';
import ExplorerGrid from './ExplorerGrid';
import ExplorerList from './ExplorerList';
import PreviewPane from './PreviewPane';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ExplorerContent({ 
  items, 
  selectedItem, 
  setSelectedItem, 
  onDoubleClick, 
  onContextMenu,
  isRecent,
  viewMode,
  isLoading
}) {
  const selectedNode = items.find(i => i.name === selectedItem);

  if (isLoading) {
    return (
      <div className="explorer-content-area">
        <div className="skeleton-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-icon" />
              <div className="skeleton-text" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="explorer-content-area empty-state">
        <FolderOpenRegular fontSize={64} color="var(--color-text-tertiary)" />
        <p>This folder is empty</p>
        <span className="empty-sub">Create Folder or Upload File</span>
      </div>
    );
  }

  return (
    <div className="explorer-content-area">
      <div className="explorer-files-container" onClick={() => setSelectedItem(null)}>
        {viewMode === 'grid' ? (
          <ExplorerGrid 
            items={items}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
            isRecent={isRecent}
          />
        ) : (
          <ExplorerList 
            items={items}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
            isRecent={isRecent}
          />
        )}
      </div>
      
      {/* Dynamic Preview Pane */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            className="explorer-preview-container"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PreviewPane item={selectedNode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
