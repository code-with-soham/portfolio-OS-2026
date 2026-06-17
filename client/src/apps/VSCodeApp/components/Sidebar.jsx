import React from 'react';
import ExplorerPanel from './ExplorerPanel';
import SearchPanel from './SearchPanel';
import GitPanel from './GitPanel';
import ExtensionsPanel from './ExtensionsPanel';
import CopilotPanel from './CopilotPanel';

export default function Sidebar({
  sidebarView,
  setSidebarView,
  activeFile,
  handleFileClick,
  handleContextMenu,
  openFiles,
  closeFile,
  setActiveFile,
  searchQuery,
  setSearchQuery,
  fileContents,
  dirtyFiles
}) {
  if (!sidebarView) return null;

  return (
    <div className="vscode-sidebar">
      {sidebarView === 'explorer' && (
        <ExplorerPanel 
          activeFile={activeFile}
          handleFileClick={handleFileClick}
          handleContextMenu={handleContextMenu}
          openFiles={openFiles}
          closeFile={closeFile}
          setActiveFile={setActiveFile}
          dirtyFiles={dirtyFiles || []}
        />
      )}
      {sidebarView === 'search' && (
        <SearchPanel 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fileContents={fileContents}
          handleFileClick={handleFileClick}
        />
      )}
      {sidebarView === 'git' && (
        <GitPanel handleFileClick={handleFileClick} />
      )}
      {sidebarView === 'extensions' && (
        <ExtensionsPanel />
      )}
      {sidebarView === 'copilot' && (
        <CopilotPanel onClose={() => setSidebarView('explorer')} />
      )}
      {/* Fallback for unhandled views */}
      {['debug', 'accounts', 'settings'].includes(sidebarView) && (
        <div style={{ padding: 10, color: '#858585' }}>{sidebarView.toUpperCase()} PANEL (In Development)</div>
      )}
    </div>
  );
}
