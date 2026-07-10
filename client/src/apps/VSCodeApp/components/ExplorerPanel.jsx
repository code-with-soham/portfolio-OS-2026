import React, { useState } from 'react';
import {
  ChevronDownRegular,
  ChevronRightRegular,
  DocumentAddRegular,
  FolderAddRegular,
  ArrowSyncRegular,
  DismissRegular
} from '@fluentui/react-icons';
import { fileTree } from '../data/fileTree';
import { getFolderIcon, getFileIcon } from '../config/iconMap';

export default function ExplorerPanel({
  activeFile,
  handleFileClick,
  handleContextMenu,
  openFiles,
  closeFile,
  setActiveFile,
  dirtyFiles = []
}) {
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({
    'SOHAM-KUNDU': true,
    'about': true,
    'src': false
  });

  const toggleFolder = (folderName, e) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const getGitDecoration = (fileName) => {
    if (fileName === 'README.md') return { color: 'var(--vscode-gitDecoration-modifiedResourceForeground)', letter: 'M' };
    if (fileName === 'profile.yml') return { color: 'var(--vscode-gitDecoration-addedResourceForeground)', letter: 'A' };
    if (fileName === 'skills.yml') return { color: 'var(--vscode-gitDecoration-untrackedResourceForeground)', letter: 'U' };
    if (fileName === 'research.ipynb') return { color: 'var(--vscode-gitDecoration-modifiedResourceForeground)', letter: 'M' };
    return null;
  };

  const renderFileTree = (nodes, padding = 10, parentPath = '') => {
    return nodes.map((node) => {
      const isFolder = node.type === 'folder';
      const isOpen = expandedFolders[node.name];
      const isSelected = activeFile === node.path;
      const gitInfo = getGitDecoration(node.name);
      
      return (
        <div key={`${parentPath}-${node.name}`}>
          <div 
            className={`vscode-tree-item ${isSelected ? 'active' : ''}`}
            style={{ paddingLeft: `${padding}px` }}
            onClick={(e) => isFolder ? toggleFolder(node.name, e) : handleFileClick(node.path)}
            onContextMenu={(e) => !isFolder ? handleContextMenu(e, node.path) : null}
          >
            <span className={`vscode-chevron ${isFolder && isOpen ? 'expanded' : ''}`}>
              {isFolder ? <ChevronRightRegular fontSize={12} /> : <span style={{ width: 12, display: 'inline-block' }}></span>}
            </span>
            <span className="vscode-tree-icon">
              {isFolder ? getFolderIcon(node.name, isOpen) : getFileIcon(node.name)}
            </span>
            <span className="vscode-tree-name" style={{ color: gitInfo ? gitInfo.color : 'inherit' }}>
              {node.name}
            </span>
            
            {/* Right side icons & git status */}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              {!isFolder && dirtyFiles.includes(node.path) && (
                <span style={{ fontSize: 10, color: 'var(--vscode-editor-foreground)', marginRight: 4 }}>●</span>
              )}
              {gitInfo && (
                <span style={{ fontSize: 10, color: gitInfo.color, fontWeight: 'bold' }}>{gitInfo.letter}</span>
              )}
            </div>
          </div>
          {isFolder && isOpen && node.children && (
            <div className="vscode-tree-children" style={{ marginLeft: `${padding + 6}px` }}>
              {renderFileTree(node.children, padding + 12, `${parentPath}/${node.name}`)}
            </div>
          )}
        </div>
      );
    });
  };

  const getFileName = (path) => path.split('/').pop() || path;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vscode-sidebar-title" style={{ display: 'flex', alignItems: 'center' }}>
        EXPLORER
        <div className="vscode-section-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 6, opacity: 1 }}>
          <DocumentAddRegular fontSize={14} title="New File..." />
          <FolderAddRegular fontSize={14} title="New Folder..." />
          <ArrowSyncRegular fontSize={14} title="Refresh Explorer" />
          <DismissRegular fontSize={14} style={{ transform: 'rotate(45deg)' }} title="Collapse Folders in Explorer" />
        </div>
      </div>
      
      <div style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
        <div className="vscode-sidebar-section">
          <div className="vscode-section-header" onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}>
            <span className={`vscode-chevron ${openEditorsExpanded ? 'expanded' : ''}`} style={{ marginRight: 4, width: 12, height: 12, display: 'inline-flex', alignItems: 'center', transition: 'transform 0.15s ease' }}>
              <ChevronRightRegular fontSize={12} />
            </span>
            <span style={{ fontWeight: 600 }}>OPEN EDITORS</span>
          </div>
          {openEditorsExpanded && (
            <div className="vscode-section-content">
              {openFiles.map(path => (
                <div key={path} className={`vscode-opened-item ${activeFile === path ? 'active' : ''}`} onClick={() => setActiveFile(path)}>
                  <div className="vscode-opened-close" onClick={(e) => closeFile(e, path)}>
                    <DismissRegular fontSize={12} />
                  </div>
                  <span className="vscode-opened-icon">{getFileIcon(getFileName(path))}</span>
                  <span className="vscode-opened-name">{getFileName(path)}</span>
                  {dirtyFiles.includes(path) && <span style={{ marginLeft: '6px', fontSize: 10, color: 'var(--vscode-editor-foreground)' }}>●</span>}
                  <span className="vscode-opened-dir">{path.split('/')[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="vscode-sidebar-section">
          <div className="vscode-section-header" onClick={() => setWorkspaceExpanded(!workspaceExpanded)}>
            <span className={`vscode-chevron ${workspaceExpanded ? 'expanded' : ''}`} style={{ marginRight: 4, width: 12, height: 12, display: 'inline-flex', alignItems: 'center', transition: 'transform 0.15s ease' }}>
              <ChevronRightRegular fontSize={12} />
            </span>
            <span style={{ fontWeight: 600 }}>SOHAM-KUNDU</span>
            <div className="vscode-section-actions">
              <DocumentAddRegular fontSize={14} />
              <FolderAddRegular fontSize={14} />
              <ArrowSyncRegular fontSize={14} />
              <DismissRegular fontSize={14} style={{ transform: 'rotate(45deg)' }} />
            </div>
          </div>
          {workspaceExpanded && (
            <div className="vscode-section-content vscode-filetree-container" style={{ paddingBottom: '20px' }}>
              {renderFileTree(fileTree[0].children)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
