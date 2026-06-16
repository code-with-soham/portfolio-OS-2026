import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TerminalCore from '../../components/system/TerminalCore';
import { fileTree } from './data/fileTree';
import { getFolderIcon, getFileIcon } from './config/iconMap';
import ReadmeRenderer from './components/ReadmeRenderer';
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
  DocumentTextRegular,
  TextBulletListSquareRegular,
  DocumentDataRegular,
  WindowConsoleRegular,
  AlertRegular
} from '@fluentui/react-icons';
import './VSCodeApp.css';
import vscodeIco from '../../assets/icons/apps/vscode.svg';

// Mock contents
const fileContents = {
  'about/README.md': `# Soham Kundu\n\nAI/ML Developer • Full Stack Developer\n\n## About Me\nI am a passionate software engineer with experience building full-stack web applications and machine learning models. I created Portfolio OS as a web-based operating system to showcase my projects dynamically.\n\n## Skills\n- **Frontend:** React, JavaScript, Tailwind CSS\n- **Backend:** Node.js, Express, MongoDB\n- **AI/ML:** Python, Scikit-Learn, TensorFlow\n\n## Experience\n- **Frontend Developer Intern** at Expantra Tech Pvt Ltd\n\n## Projects\n- **Portfolio OS**: Web-based Windows 11 clone\n- **AI Mock Interview Platform**: Role-based AI interview generation with WebRTC\n- **Student Placement Predictor**: Random Forest ML model (92% accuracy)\n\n## Certifications\n- AWS Certified Developer\n\n## Resume\n[Download Resume](/resume)\n\n## Contact\nReach out to me at [contact@soham.com](mailto:contact@soham.com)\n\n---\n[GitHub](https://github.com/soham-kundu) | [LinkedIn](https://linkedin.com)`,
  'projects/portfolio.db': `[BINARY DATA]\nSQLite format 3\n\nTables:\n- users\n- projects\n- achievements`,
  'research/research.ipynb': `{\n  "cells": [\n    {\n      "cell_type": "markdown",\n      "metadata": {},\n      "source": ["# AI Research Notebook\\nExploratory Data Analysis for Placement Prediction."]\n    }\n  ]\n}`,
  'achievements/timeline.log': `2026-06-01  Portfolio OS Released\n2026-05-20  VS Code Workspace Added\n2026-04-15  AI Resume Analyzer Completed\n2026-03-10  Job Tracker Released`,
  'skills/skills.yml': `developer:\n  name: Soham Kundu\n\nfrontend:\n  - React\n  - Next.js\n  - Tailwind\n\nbackend:\n  - Node.js\n  - Express\n  - MongoDB\n\nai_ml:\n  - TensorFlow\n  - PyTorch\n  - LangChain`,
  'connect/links.yml': `github: https://github.com/code-with-soham\nlinkedin: https://linkedin.com/in/sohamkundu\nportfolio: https://sohamkundu.dev\nresume: https://sohamkundu.dev/resume`,
  '.github/profile.yml': `name: Soham Kundu\nrole: Full Stack Developer\nlocation: India`,
  '.gitignore': `node_modules\n.DS_Store\ndist\nbuild\n.env`,
  'LICENSE.txt': `MIT License\n\nCopyright (c) 2026 Soham Kundu\n\nPermission is hereby granted, free of charge...`,
  'CHANGELOG.md': `# Changelog\n\n## [1.0.0] - 2026-06-01\n### Added\n- Initial release of Portfolio OS.\n- Fully interactive React desktop.\n- VS Code developer environment.`
};

const COMMANDS = [
  { id: 'about', label: 'Open About', category: 'General' },
  { id: 'projects', label: 'Open Projects', category: 'General' },
  { id: 'resume', label: 'Open Resume', category: 'General' },
  { id: 'theme', label: 'UI: Toggle Theme', category: 'UI' },
  { id: 'terminal', label: 'UI: Toggle Terminal', category: 'UI' },
  { id: 'file-readme', label: 'File: Open README.md', category: 'File' },
  { id: 'file-skills', label: 'File: Open skills.yml', category: 'File' },
  { id: 'focus-explorer', label: 'Window: Focus Explorer', category: 'Window' },
];

export default function VSCodeApp() {
  const [activeFile, setActiveFile] = useState('about/README.md');
  const [openFiles, setOpenFiles] = useState(['about/README.md']);
  const [sidebarView, setSidebarView] = useState('explorer');
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [panelVisible, setPanelVisible] = useState(() => {
    const saved = localStorage.getItem('vscode.panel.visible');
    return saved ? JSON.parse(saved) : false;
  });
  
  useEffect(() => {
    localStorage.setItem('vscode.panel.visible', JSON.stringify(panelVisible));
  }, [panelVisible]);
  
  // Persist panel height
  const [panelHeight, setPanelHeight] = useState(() => {
    const saved = localStorage.getItem('vscode.panel.height');
    return saved ? parseInt(saved, 10) : 250;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activeBottomPanel, setActiveBottomPanel] = useState('TERMINAL');

  const [searchQuery, setSearchQuery] = useState('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  // Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const commandInputRef = useRef(null);
  
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
    if (path === 'about/README.md') {
      setPanelVisible(false);
    }
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

  // Command Palette listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setPanelVisible(prev => !prev);
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandPaletteOpen && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [isCommandPaletteOpen]);

  // Terminal Resizer listener
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging) return;
      // Calculate from bottom
      const newHeight = window.innerHeight - e.clientY - 22; // 22px status bar
      const maxAllowed = window.innerHeight * 0.5;
      const clampedHeight = Math.min(maxAllowed, Math.max(180, newHeight));
      setPanelHeight(clampedHeight);
    };
    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem('vscode.panel.height', panelHeight.toString());
      }
    };
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, panelHeight]);

  const executeCommand = (cmd) => {
    setIsCommandPaletteOpen(false);
    setCommandQuery('');
    
    switch (cmd.id) {
      case 'terminal':
        setPanelVisible(!panelVisible);
        break;
      case 'focus-explorer':
        setSidebarView('explorer');
        break;
      case 'file-readme':
        handleFileClick('about/README.md');
        break;
      case 'file-skills':
        handleFileClick('skills/skills.yml');
        break;
      default:
        console.log('Command not implemented in mock:', cmd.label);
    }
  };

  const filteredCommands = COMMANDS.filter(c => c.label.toLowerCase().includes(commandQuery.toLowerCase()));

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
              {isFolder ? getFolderIcon(node.name, isOpen) : getFileIcon(node.name)}
            </span>
            <span className="vscode-tree-name" style={{ 
              color: node.name === 'README.md' || node.name === 'research.ipynb' ? '#cca700' : 
                     node.name === 'skills.yml' ? '#89d185' : 'inherit'
            }}>{node.name}</span>
            {node.name === 'README.md' && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#cca700', paddingRight: 4 }}>M</span>}
            {node.name === 'skills.yml' && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#89d185', paddingRight: 4 }}>A</span>}
            {node.name === 'research.ipynb' && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#cca700', paddingRight: 4 }}>U</span>}
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
    if (activeFile === 'Welcome') {
      return (
        <div className="vscode-welcome-screen">
          <div className="vscode-welcome-content">
            <div className="vscode-welcome-header">
              <div className="vscode-welcome-logo">
                <img src={vscodeIco} alt="VS Code" width="80" height="80" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="vscode-welcome-title">
                <h1>Welcome</h1>
                <p className="vscode-welcome-subtitle">Portfolio OS Developer Edition</p>
              </div>
            </div>
            
            <div className="vscode-welcome-columns">
              <div className="vscode-welcome-column">
                <h2>Start</h2>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleFileClick('about/README.md'); }}>Open About</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleFileClick('projects/portfolio.db'); }}>Open Projects</a></li>
                  <li><a href="#">Open Resume</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setPanelVisible(true); }}>Open Terminal</a></li>
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
      );
    }

    const content = fileContents[activeFile] || '// Content not found';
    
    if (activeFile === 'about/README.md') {
      return <ReadmeRenderer />;
    }

    if (activeFile.endsWith('.md')) {
      return (
        <div className="vscode-markdown github-style">
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
      {/* Command Palette Overlay */}
      {isCommandPaletteOpen && (
        <div className="vscode-command-palette-overlay" onClick={() => setIsCommandPaletteOpen(false)}>
          <div className="vscode-command-palette" onClick={e => e.stopPropagation()}>
            <input 
              ref={commandInputRef}
              type="text" 
              className="vscode-command-input" 
              placeholder="Type a command or search..."
              value={commandQuery}
              onChange={e => setCommandQuery(e.target.value)}
            />
            <div className="vscode-command-list">
              {filteredCommands.map(cmd => (
                <div key={cmd.id} className="vscode-command-item" onClick={() => executeCommand(cmd)}>
                  <span className="vscode-command-category">{cmd.category}:</span> {cmd.label}
                </div>
              ))}
              {filteredCommands.length === 0 && <div className="vscode-command-empty">No matching commands</div>}
            </div>
          </div>
        </div>
      )}

      {/* Top Menu Bar */}
      <div className="vscode-titlebar">
        <div className="vscode-titlebar-icon">
          <img src={vscodeIco} alt="VS Code" width="16" height="16" onError={(e) => e.target.style.display = 'none'} />
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
          <div className="vscode-command-center" onClick={() => setIsCommandPaletteOpen(true)}>
            <SearchRegular fontSize={14} style={{ marginRight: 6 }} /> SOHAM-KUNDU
          </div>
        </div>
        <div className="vscode-titlebar-controls"></div>
      </div>

      <div className="vscode-main">
        {/* Activity Bar */}
        <div className="vscode-activity-bar">
          <div className="vscode-activity-top">
            <div className={`vscode-activity-icon ${sidebarView === 'explorer' ? 'active' : ''}`} title="Explorer (Ctrl+Shift+E)" onClick={() => setSidebarView('explorer')}><DocumentMultipleRegular /></div>
            <div className={`vscode-activity-icon ${sidebarView === 'search' ? 'active' : ''}`} title="Search (Ctrl+Shift+F)" onClick={() => setSidebarView('search')}><SearchRegular /></div>
            <div className="vscode-activity-icon" title="Source Control (Ctrl+Shift+G)" style={{ position: 'relative' }}>
              <BranchRegular />
              <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#007fd4', color: 'white', fontSize: 9, borderRadius: 10, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
            </div>
            <div className="vscode-activity-icon" title="Run and Debug (Ctrl+Shift+D)"><PlayRegular /></div>
            <div className="vscode-activity-icon" title="Extensions (Ctrl+Shift+X)" style={{ position: 'relative' }}>
              <PuzzlePieceRegular />
              <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#007fd4', color: 'white', fontSize: 9, borderRadius: 10, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</div>
            </div>
          </div>
          <div className="vscode-activity-bottom">
            <div className="vscode-activity-icon" title="Accounts"><PersonRegular /></div>
            <div className="vscode-activity-icon" title="Manage"><SettingsRegular /></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="vscode-sidebar">
          {sidebarView === 'explorer' && (
            <>
              <div className="vscode-sidebar-title" style={{ display: 'flex', alignItems: 'center' }}>
                EXPLORER
                <div className="vscode-section-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 6, opacity: 1 }}>
                  <DocumentAddRegular fontSize={14} title="New File..." />
                  <FolderAddRegular fontSize={14} title="New Folder..." />
                  <ArrowSyncRegular fontSize={14} title="Refresh Explorer" />
                  <DismissRegular fontSize={14} style={{ transform: 'rotate(45deg)' }} title="Collapse Folders in Explorer" />
                </div>
              </div>
              
              <div className="vscode-workspace-badges">
                <div className="vscode-workspace-badge" style={{ fontWeight: 600, color: '#fff', fontSize: 11, marginBottom: 4 }}>SOHAM-KUNDU [Portfolio Workspace]</div>
                <div className="vscode-workspace-badge"><span>🟢</span> GitHub Connected</div>
                <div className="vscode-workspace-badge"><span>⚡</span> React + Node</div>
                <div className="vscode-workspace-badge"><span>🤖</span> AI/ML Projects</div>
              </div>

              <div className="vscode-sidebar-section">
                <div className="vscode-section-header" onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}>
                  {openEditorsExpanded ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
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
                        <span className="vscode-opened-dir">{path.split('/')[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="vscode-sidebar-section">
                <div className="vscode-section-header" onClick={() => setWorkspaceExpanded(!workspaceExpanded)}>
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
            </>
          )}

          {sidebarView === 'search' && (
            <>
              <div className="vscode-sidebar-title">SEARCH</div>
              <div className="vscode-search-panel">
                <input 
                  type="text" 
                  className="vscode-search-input" 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="vscode-search-results">
                  {searchQuery ? (
                    Object.keys(fileContents)
                      .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()) || fileContents[f].toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(f => (
                        <div key={f} className="vscode-search-result-item" onClick={() => handleFileClick(f)}>
                          <div className="vscode-search-result-file">
                            <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon(getFileName(f))}</span>
                            {getFileName(f)}
                            <span style={{ marginLeft: 6, fontSize: 11, color: '#858585' }}>{f.split('/')[0]}</span>
                          </div>
                          <div className="vscode-search-result-preview">
                            {fileContents[f].substring(0, 40).replace(/[^a-zA-Z0-9 ]/g, ' ')}...
                          </div>
                        </div>
                      ))
                  ) : <div style={{ padding: 10, fontSize: 12, color: '#858585' }}>Find in files...</div>}
                </div>
              </div>
            </>
          )}

          {sidebarView === 'git' && (
            <>
              <div className="vscode-sidebar-title">SOURCE CONTROL</div>
              <div className="vscode-sidebar-section">
                <div className="vscode-section-header" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ChevronDownRegular fontSize={12} />
                    <span style={{ fontWeight: 600 }}>CHANGES</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#858585', fontWeight: 'normal' }}>Last commit: 2 mins ago</span>
                </div>
                <div className="vscode-sidebar-list">
                  <div className="vscode-sidebar-list-item" onClick={() => handleFileClick('about/README.md')}>
                    <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon('README.md')}</span> README.md
                    <span className="vscode-badge-m">M</span>
                  </div>
                  <div className="vscode-sidebar-list-item" onClick={() => handleFileClick('skills/skills.yml')}>
                    <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon('skills.yml')}</span> skills.yml
                    <span className="vscode-badge-m">M</span>
                  </div>
                  <div className="vscode-sidebar-list-item" onClick={() => handleFileClick('research/research.ipynb')}>
                    <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon('research.ipynb')}</span> research.ipynb
                    <span className="vscode-badge-a">A</span>
                  </div>
                </div>
              </div>
              <div className="vscode-git-input-container">
                <input type="text" className="vscode-git-input" placeholder="Message (Ctrl+Enter to commit)" />
                <button className="vscode-git-button">✔ Commit</button>
              </div>
            </>
          )}

          {sidebarView === 'extensions' && (
            <>
              <div className="vscode-sidebar-title">EXTENSIONS</div>
              <div className="vscode-search-panel" style={{ paddingBottom: 0 }}>
                <input type="text" className="vscode-search-input" placeholder="Search Extensions in Marketplace" />
              </div>
              <div className="vscode-sidebar-section" style={{ marginTop: 10 }}>
                <div className="vscode-section-header">
                  <ChevronDownRegular fontSize={12} />
                  <span style={{ fontWeight: 600 }}>RECOMMENDED</span>
                </div>
                <div className="vscode-sidebar-list">
                  <div className="vscode-extension-item">
                    <div className="vscode-extension-icon" style={{ backgroundColor: '#007acc' }}><PuzzlePieceRegular color="#fff" /></div>
                    <div className="vscode-extension-details">
                      <span className="vscode-extension-name">Portfolio OS Toolkit</span>
                      <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>Portfolio developer tools</span>
                      <span className="vscode-extension-author">Soham Kundu</span>
                    </div>
                    <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
                  </div>
                </div>
              </div>
              <div className="vscode-sidebar-section" style={{ marginTop: 10 }}>
                <div className="vscode-section-header">
                  <ChevronDownRegular fontSize={12} />
                  <span style={{ fontWeight: 600 }}>POPULAR</span>
                </div>
                <div className="vscode-sidebar-list">
                  <div className="vscode-extension-item">
                    <div className="vscode-extension-icon"><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" width="20" height="20" alt="" /></div>
                    <div className="vscode-extension-details">
                      <span className="vscode-extension-name">GitHub Copilot</span>
                      <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>AI pair programmer</span>
                      <span className="vscode-extension-author">GitHub</span>
                    </div>
                    <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
                  </div>
                  <div className="vscode-extension-item">
                    <div className="vscode-extension-icon" style={{ backgroundColor: '#cb3837' }}><PuzzlePieceRegular color="#fff" /></div>
                    <div className="vscode-extension-details">
                      <span className="vscode-extension-name">Prettier</span>
                      <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>Code formatter</span>
                      <span className="vscode-extension-author">Prettier</span>
                    </div>
                    <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
                  </div>
                  <div className="vscode-extension-item">
                    <div className="vscode-extension-icon" style={{ backgroundColor: '#4b32c3' }}><PuzzlePieceRegular color="#fff" /></div>
                    <div className="vscode-extension-details">
                      <span className="vscode-extension-name">ESLint</span>
                      <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>Linting utility</span>
                      <span className="vscode-extension-author">Microsoft</span>
                    </div>
                    <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
                  </div>
                  <div className="vscode-extension-item">
                    <div className="vscode-extension-icon" style={{ backgroundColor: '#38bdf8' }}><PuzzlePieceRegular color="#fff" /></div>
                    <div className="vscode-extension-details">
                      <span className="vscode-extension-name">Tailwind CSS IntelliSense</span>
                      <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>Advanced Tailwind tools</span>
                      <span className="vscode-extension-author">Tailwind Labs</span>
                    </div>
                    <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
                  </div>
                  <div className="vscode-extension-item">
                    <div className="vscode-extension-icon" style={{ backgroundColor: '#61dafb' }}><PuzzlePieceRegular color="#fff" /></div>
                    <div className="vscode-extension-details">
                      <span className="vscode-extension-name">React Snippets</span>
                      <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>ES7+ React snippets</span>
                      <span className="vscode-extension-author">dsznajder</span>
                    </div>
                    <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Editor Area */}
        <div className="vscode-editor-area">
          {activeFile ? (
            <div className="vscode-editor-group">
              <div className="vscode-tabs">
                {openFiles.map(path => (
                  <div key={path} className={`vscode-tab ${activeFile === path ? 'active' : ''}`} onClick={() => setActiveFile(path)}>
                    <span className="vscode-tab-icon">{getFileIcon(getFileName(path))}</span>
                    {getFileName(path)}
                    <span className="vscode-tab-close" onClick={(e) => closeFile(e, path)}>
                      <DismissRegular fontSize={12} />
                    </span>
                  </div>
                ))}
              </div>
              {activeFile !== 'Welcome' && (
                <div className="vscode-breadcrumbs">
                  <span className="vscode-breadcrumb-item">SOHAM-KUNDU</span>
                  <ChevronRightRegular fontSize={12} className="vscode-breadcrumb-sep" />
                  <span className="vscode-breadcrumb-item">{activeFile.split('/')[0]}</span>
                  <ChevronRightRegular fontSize={12} className="vscode-breadcrumb-sep" />
                  <span className="vscode-breadcrumb-item">
                    <span className="vscode-breadcrumb-icon">{getFileIcon(getFileName(activeFile))}</span> {getFileName(activeFile)}
                  </span>
                </div>
              )}
              <div className="vscode-editor-content" style={activeFile === 'Welcome' ? { padding: 0 } : {}}>
                {renderContent()}
              </div>
            </div>
          ) : (
            <div className="vscode-new-welcome">
              <div className="vscode-new-welcome-content">
                <div className="vscode-new-welcome-header">
                  <h1>SOHAM KUNDU</h1>
                  <p>Full Stack + AI Developer</p>
                </div>
                
                <div className="vscode-new-welcome-section">
                  <h2>Quick Actions</h2>
                  <div className="vscode-new-welcome-grid">
                    <div className="vscode-new-welcome-item" onClick={() => handleFileClick('about/README.md')}>
                      <DocumentTextRegular className="vscode-new-welcome-item-icon" /> Open README
                    </div>
                    <div className="vscode-new-welcome-item" onClick={() => handleFileClick('projects/portfolio.db')}>
                      <DocumentDataRegular className="vscode-new-welcome-item-icon" /> Open Projects
                    </div>
                    <div className="vscode-new-welcome-item">
                      <TextBulletListSquareRegular className="vscode-new-welcome-item-icon" /> Open Resume
                    </div>
                    <div className="vscode-new-welcome-item" onClick={() => setPanelVisible(true)}>
                      <WindowConsoleRegular className="vscode-new-welcome-item-icon" /> Open Terminal
                    </div>
                  </div>
                </div>

                <div className="vscode-new-welcome-section">
                  <h2>Recent Files</h2>
                  <div className="vscode-new-welcome-grid" style={{ flexDirection: 'column', gap: '10px' }}>
                    <div className="vscode-new-welcome-item" onClick={() => handleFileClick('about/README.md')}>
                      <DocumentTextRegular className="vscode-new-welcome-item-icon" /> README.md <span style={{ marginLeft: 8, color: '#858585' }}>about</span>
                    </div>
                    <div className="vscode-new-welcome-item" onClick={() => handleFileClick('skills/skills.yml')}>
                      <DocumentDataRegular className="vscode-new-welcome-item-icon" /> skills.yml <span style={{ marginLeft: 8, color: '#858585' }}>skills</span>
                    </div>
                    <div className="vscode-new-welcome-item" onClick={() => handleFileClick('achievements/timeline.log')}>
                      <TextBulletListSquareRegular className="vscode-new-welcome-item-icon" /> timeline.log <span style={{ marginLeft: 8, color: '#858585' }}>achievements</span>
                    </div>
                  </div>
                </div>

                <div className="vscode-new-welcome-grid" style={{ flexWrap: 'nowrap' }}>
                  <div className="vscode-new-welcome-section" style={{ flex: 1 }}>
                    <h2>Workspace Statistics</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cccccc', fontSize: 13, lineHeight: '22px' }}>
                      <li>Projects: 12</li>
                      <li>Skills: 45</li>
                      <li>Experience: 3 Years</li>
                      <li>Achievements: 6</li>
                    </ul>
                  </div>
                  <div className="vscode-new-welcome-section" style={{ flex: 1 }}>
                    <h2>GitHub Activity</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cccccc', fontSize: 13, lineHeight: '22px' }}>
                      <li>Repositories: 25</li>
                      <li>Stars: 100+</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel */}
          {panelVisible && (
            <>
              <div className="vscode-panel-resizer" onMouseDown={() => setIsDragging(true)}></div>
              <div className="vscode-panel" style={{ height: panelHeight }}>
                <div className="vscode-panel-header">
                  <div className="vscode-panel-tabs">
                    {['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL', 'PORTS'].map(tab => (
                      <div 
                        key={tab} 
                        className={`vscode-panel-tab ${activeBottomPanel === tab ? 'active' : ''}`}
                        onClick={() => setActiveBottomPanel(tab)}
                      >
                        {tab === 'PROBLEMS' ? 'PROBLEMS (0)' : tab}
                      </div>
                    ))}
                  </div>
                  <div className="vscode-panel-actions">
                    <span 
                      style={{ fontSize: '11px', marginRight: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
                      onClick={() => setPanelVisible(false)}
                      title="Hide Panel"
                    >
                      ▼ Hide Panel
                    </span>
                    <DismissRegular fontSize={14} style={{ cursor: 'pointer' }} onClick={() => setPanelVisible(false)} />
                  </div>
                </div>
                <div className="vscode-panel-content">
                  {activeBottomPanel === 'TERMINAL' ? (
                    <TerminalCore hideHeader={true} skipBoot={true} customPrompt="PS C:\Projects\Soham-Kundu>" />
                  ) : activeBottomPanel === 'PROBLEMS' ? (
                    <div style={{ padding: '10px 20px', color: '#cccccc', fontSize: '13px' }}>
                      <p style={{ margin: '0 0 5px', color: '#89d185' }}>Portfolio Build Successful</p>
                      <p style={{ margin: 0, color: '#858585' }}>No errors detected.</p>
                    </div>
                  ) : (
                    <div style={{ padding: '10px 20px', color: '#858585', fontSize: '13px' }}>
                      No output available.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="vscode-status-bar">
        <div className="vscode-status-item" style={{ backgroundColor: '#16825d', padding: '0 10px', marginRight: '5px' }}>
          <BranchRegular fontSize={12} style={{ marginRight: 6 }}/> Portfolio OS
        </div>
        <div className="vscode-status-item"><BranchRegular fontSize={12} style={{ marginRight: 4 }}/> main*</div>
        <div className="vscode-status-item"><ArrowSyncRegular fontSize={12} style={{ marginRight: 4 }}/> 0⚠ 0✖</div>
        
        <div className="vscode-status-right">
          <div className="vscode-status-item">UTF-8</div>
          <div className="vscode-status-item">LF</div>
          <div className="vscode-status-item"><PuzzlePieceRegular fontSize={12} style={{ marginRight: 4 }}/> Prettier</div>
          <div className="vscode-status-item">JavaScript React</div>
          <div className="vscode-status-item">Node 20</div>
          <div className="vscode-status-item">Portfolio OS</div>
          <div className="vscode-status-item" style={{ color: '#cccccc' }}>
            Workspace uptime: {formatUptime(uptime)}
          </div>
          <div className="vscode-status-item" onClick={() => setPanelVisible(!panelVisible)}>
            <WindowConsoleRegular fontSize={14} />
          </div>
          <div className="vscode-status-item" title="Notifications">
            <AlertRegular fontSize={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
