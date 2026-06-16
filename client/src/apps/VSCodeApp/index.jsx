import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TerminalCore from '../../components/system/TerminalCore';
import { fileTree } from './data/fileTree';
import {
  DocumentMultipleRegular,
  SearchRegular,
  BranchRegular,
  PlayRegular,
  PuzzlePieceRegular,
  PersonRegular,
  SettingsRegular,
  DocumentAddRegular,
  FolderAddRegular,
  ArrowSyncRegular,
  DismissRegular,
  ChevronRightRegular,
  ChevronDownRegular,
  FolderRegular,
  FolderOpenRegular,
  DocumentTextRegular,
  DocumentDataRegular,
  DatabaseRegular,
  BookRegular,
  TextBulletListSquareRegular,
  WindowConsoleRegular,
} from '@fluentui/react-icons';
import './VSCodeApp.css';

// Mock contents
const fileContents = {
  'about/README.md': `# Soham Kundu\n\nFull Stack Developer & Portfolio OS Creator.\n\nWelcome to my interactive workspace!`,
  'projects/portfolio.db': `[BINARY DATA]\nSQLite format 3\n\nTables:\n- users\n- projects\n- achievements`,
  'research/research.ipynb': `{\n  "cells": [\n    {\n      "cell_type": "markdown",\n      "metadata": {},\n      "source": ["# AI Research Notebook"]\n    }\n  ]\n}`,
  'achievements/timeline.log': `2024-01-01 INFO: Started Portfolio OS project\n2025-06-12 SUCCESS: Deployed V1.0\n2026-06-16 DEBUG: Integrating VS Code`,
  'skills/skills.yml': `skills:\n  frontend:\n    - React\n    - JavaScript\n    - CSS\n  backend:\n    - Node.js\n    - Python`,
  'connect/links.yml': `links:\n  github: https://github.com/code-with-soham\n  linkedin: https://linkedin.com/in/sohamkundu`,
  '.github/profile.yml': `name: Soham Kundu\nrole: Full Stack Developer\nlocation: India`,
};

export default function VSCodeApp() {
  // Local state based on Phase VS-1 Architecture
  const [activeFile, setActiveFile] = useState(null); // null shows welcome screen
  const [openFiles, setOpenFiles] = useState([]); // Array of paths
  const [explorerExpanded, setExplorerExpanded] = useState(true);
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [panelHeight, setPanelHeight] = useState(250);
  
  // Track which folders are open
  const [expandedFolders, setExpandedFolders] = useState({
    'SOHAM-KUNDU': true,
    'about': true,
  });

  const getFileName = (path) => path.split('/').pop();
  
  const handleFileClick = (path) => {
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path]);
    }
    setActiveFile(path);
  };

  const closeFile = (e, path) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile === path) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const toggleFolder = (folderName, e) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.md')) return <DocumentTextRegular style={{ color: '#519aba' }} />;
    if (filename.endsWith('.yml')) return <DocumentDataRegular style={{ color: '#cb3837' }} />;
    if (filename.endsWith('.db')) return <DatabaseRegular style={{ color: '#e38c00' }} />;
    if (filename.endsWith('.ipynb')) return <BookRegular style={{ color: '#e38c00' }} />;
    if (filename.endsWith('.log')) return <TextBulletListSquareRegular style={{ color: '#4d5a5e' }} />;
    return <DocumentTextRegular />;
  };

  const renderFileTree = (nodes, padding = 10, parentPath = '') => {
    return nodes.map((node, index) => {
      const isFolder = node.type === 'folder';
      const isOpen = expandedFolders[node.name];
      const isSelected = activeFile === node.path;
      
      return (
        <div key={`${parentPath}-${node.name}`}>
          <div 
            className={`vscode-tree-item ${isSelected ? 'active' : ''}`}
            style={{ paddingLeft: `${padding}px` }}
            onClick={(e) => isFolder ? toggleFolder(node.name, e) : handleFileClick(node.path)}
          >
            <span className="vscode-chevron">
              {isFolder ? (isOpen ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />) : <span style={{ width: 12, display: 'inline-block' }}></span>}
            </span>
            <span className="vscode-tree-icon">
              {isFolder ? (isOpen ? <FolderOpenRegular style={{ color: '#dcb67a' }} /> : <FolderRegular style={{ color: '#dcb67a' }} />) : getFileIcon(node.name)}
            </span>
            <span className="vscode-tree-name">{node.name}</span>
          </div>
          {isFolder && isOpen && node.children && (
            <div className="vscode-tree-children">
              {renderFileTree(node.children, padding + 12, `${parentPath}/${node.name}`)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderContent = () => {
    const content = fileContents[activeFile] || '// Content not found';
    
    if (activeFile.endsWith('.md')) {
      return (
        <div className="vscode-markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }

    let language = 'javascript';
    if (activeFile.endsWith('.yml')) language = 'yaml';
    if (activeFile.endsWith('.json')) language = 'json';
    if (activeFile.endsWith('.log')) language = 'log';

    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent' }}>
        {content}
      </SyntaxHighlighter>
    );
  };

  return (
    <div className="vscode-app">
      {/* Top Menu Bar */}
      <div className="vscode-titlebar">
        <div className="vscode-titlebar-icon">
          <img src="/icons/apps/VSCode.ico" alt="VS Code" width="16" height="16" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <div className="vscode-titlebar-menus">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
        <div className="vscode-titlebar-center">
          <div className="vscode-command-center">SOHAM-KUNDU</div>
        </div>
        <div className="vscode-titlebar-controls"></div>
      </div>

      <div className="vscode-main">
        {/* Activity Bar */}
        <div className="vscode-activity-bar">
          <div className="vscode-activity-top">
            <div className="vscode-activity-icon active"><DocumentMultipleRegular /></div>
            <div className="vscode-activity-icon"><SearchRegular /></div>
            <div className="vscode-activity-icon"><BranchRegular /></div>
            <div className="vscode-activity-icon"><PlayRegular /></div>
            <div className="vscode-activity-icon"><PuzzlePieceRegular /></div>
          </div>
          <div className="vscode-activity-bottom">
            <div className="vscode-activity-icon"><PersonRegular /></div>
            <div className="vscode-activity-icon"><SettingsRegular /></div>
          </div>
        </div>

        {/* Sidebar */}
        {explorerExpanded && (
          <div className="vscode-sidebar">
            <div className="vscode-sidebar-title">EXPLORER</div>
            
            {/* Open Editors Section */}
            <div className="vscode-sidebar-section">
              <div 
                className="vscode-section-header"
                onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}
              >
                {openEditorsExpanded ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
                <span style={{ fontWeight: 600 }}>OPEN EDITORS</span>
              </div>
              {openEditorsExpanded && (
                <div className="vscode-section-content">
                  {openFiles.map(path => (
                    <div 
                      key={path} 
                      className={`vscode-opened-item ${activeFile === path ? 'active' : ''}`}
                      onClick={() => setActiveFile(path)}
                    >
                      <div className="vscode-opened-close" onClick={(e) => closeFile(e, path)}>
                        <DismissRegular fontSize={12} />
                      </div>
                      <span className="vscode-opened-icon">{getFileIcon(getFileName(path))}</span>
                      <span className="vscode-opened-name">{getFileName(path)}</span>
                      <span className="vscode-opened-dir">{path.split('/')[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Workspace Structure */}
            <div className="vscode-sidebar-section">
              <div 
                className="vscode-section-header"
                onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
              >
                {workspaceExpanded ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
                <span style={{ fontWeight: 600 }}>SOHAM-KUNDU</span>
                <div className="vscode-section-actions">
                  <DocumentAddRegular fontSize={14} />
                  <FolderAddRegular fontSize={14} />
                  <ArrowSyncRegular fontSize={14} />
                  <DismissRegular fontSize={14} style={{ transform: 'rotate(45deg)' }} />
                </div>
              </div>
              {workspaceExpanded && (
                <div className="vscode-section-content vscode-filetree-container">
                  {renderFileTree(fileTree[0].children)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="vscode-editor-area">
          {activeFile ? (
            <div className="vscode-editor-group">
              <div className="vscode-tabs">
                {openFiles.map(path => (
                  <div 
                    key={path} 
                    className={`vscode-tab ${activeFile === path ? 'active' : ''}`}
                    onClick={() => setActiveFile(path)}
                  >
                    <span className="vscode-tab-icon">{getFileIcon(getFileName(path))}</span>
                    {getFileName(path)}
                    <span className="vscode-tab-close" onClick={(e) => closeFile(e, path)}>
                      <DismissRegular fontSize={12} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="vscode-breadcrumbs">
                <span className="vscode-breadcrumb-item">SOHAM-KUNDU</span>
                <ChevronRightRegular fontSize={12} className="vscode-breadcrumb-sep" />
                <span className="vscode-breadcrumb-item">{activeFile.split('/')[0]}</span>
                <ChevronRightRegular fontSize={12} className="vscode-breadcrumb-sep" />
                <span className="vscode-breadcrumb-item"><span className="vscode-breadcrumb-icon">{getFileIcon(getFileName(activeFile))}</span> {getFileName(activeFile)}</span>
              </div>
              <div className="vscode-editor-content">
                {renderContent()}
              </div>
            </div>
          ) : (
            <div className="vscode-welcome-screen">
              <div className="vscode-welcome-content">
                <div className="vscode-welcome-header">
                  <div className="vscode-welcome-logo">
                    <img src="/icons/apps/VSCode.ico" alt="VS Code" width="80" height="80" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                  <div className="vscode-welcome-title">
                    <h1>Soham Kundu</h1>
                    <p>Full Stack Developer</p>
                    <p className="vscode-welcome-subtitle">Portfolio OS Developer</p>
                  </div>
                </div>
                
                <div className="vscode-welcome-columns">
                  <div className="vscode-welcome-column">
                    <h2>Start</h2>
                    <ul>
                      <li><a href="#">Open About...</a></li>
                      <li><a href="#">Open Projects...</a></li>
                      <li><a href="#">Open Resume...</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); setPanelVisible(true); }}>Open Terminal...</a></li>
                    </ul>
                  </div>
                  <div className="vscode-welcome-column">
                    <h2>Recent</h2>
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); handleFileClick('about/README.md'); }}><span className="vscode-welcome-recent-icon"><DocumentTextRegular /></span> README.md <span className="vscode-welcome-path">about</span></a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); handleFileClick('achievements/timeline.log'); }}><span className="vscode-welcome-recent-icon"><TextBulletListSquareRegular /></span> timeline.log <span className="vscode-welcome-path">achievements</span></a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); handleFileClick('skills/skills.yml'); }}><span className="vscode-welcome-recent-icon"><DocumentDataRegular /></span> skills.yml <span className="vscode-welcome-path">skills</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel */}
          {panelVisible && (
            <div className="vscode-panel" style={{ height: `${panelHeight}px` }}>
              <div className="vscode-panel-header">
                <div className="vscode-panel-tab active">TERMINAL</div>
                <div className="vscode-panel-tab">OUTPUT</div>
                <div className="vscode-panel-tab">DEBUG CONSOLE</div>
                <div className="vscode-panel-actions">
                  <div className="vscode-panel-action" onClick={() => setPanelVisible(false)}><DismissRegular fontSize={14} /></div>
                </div>
              </div>
              <div className="vscode-panel-content">
                <TerminalCore hideHeader={true} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="vscode-status-bar">
        <div className="vscode-status-item"><BranchRegular fontSize={12} style={{ marginRight: 4 }}/> main*</div>
        <div className="vscode-status-item">✗ 0 ⚠ 0</div>
        
        <div className="vscode-status-right">
          <div className="vscode-status-item" onClick={() => setPanelVisible(!panelVisible)}>
            <WindowConsoleRegular fontSize={14} />
          </div>
          <div className="vscode-status-item">UTF-8</div>
          <div className="vscode-status-item">JavaScript React</div>
          <div className="vscode-status-item"><PuzzlePieceRegular fontSize={12} style={{ marginRight: 4 }}/> Prettier</div>
        </div>
      </div>
    </div>
  );
}
