import { useState, useEffect, useRef, useCallback } from 'react';
import { useGitHubStore } from '../../../store/useGitHubStore';
import { fileContents } from '../constants/fileContents';
import { COMMANDS } from '../constants/commands';

/**
 * useWorkbench — Central state management for the VS Code app.
 * Handles all editor state, persistence, and workbench behavior.
 */
export default function useWorkbench({ project, initialFile }) {
  // ─── Editor State ───
  const [activeFile, setActiveFile] = useState(() => localStorage.getItem('vscode.activeFile') || 'Welcome');
  const [openFiles, setOpenFiles] = useState(() => {
    const saved = localStorage.getItem('vscode.openFiles');
    return saved ? JSON.parse(saved) : ['Welcome'];
  });
  const [splitMode, setSplitMode] = useState(() => localStorage.getItem('vscode.splitMode') === 'true');
  const [splitActiveFile, setSplitActiveFile] = useState(() => localStorage.getItem('vscode.splitActiveFile') || null);
  const [splitOpenFiles, setSplitOpenFiles] = useState(() => {
    const saved = localStorage.getItem('vscode.splitOpenFiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeEditorGroup, setActiveEditorGroup] = useState(1);
  const [dirtyFiles, setDirtyFiles] = useState([]);

  // ─── UI State ───
  const [sidebarView, setSidebarView] = useState('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(() => {
    const saved = localStorage.getItem('vscode.panel.visible');
    return saved ? JSON.parse(saved) : false;
  });
  const [panelHeight, setPanelHeight] = useState(() => {
    const saved = localStorage.getItem('vscode.panel.height');
    return saved ? parseInt(saved, 10) : 250;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activeBottomPanel, setActiveBottomPanel] = useState('TERMINAL');

  // ─── Theme ───
  const [monacoTheme, setMonacoTheme] = useState(() => localStorage.getItem('vscode.theme') || 'vs-dark');

  // ─── Terminal ───
  const [terminalExternalCommand, setTerminalExternalCommand] = useState(null);

  // ─── Context Menu ───
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });

  // ─── Notifications ───
  const [notifications, setNotifications] = useState([]);

  // ─── Command Palette ───
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [commandSelectedIndex, setCommandSelectedIndex] = useState(0);
  const commandInputRef = useRef(null);

  // ─── Search ───
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Explorer ───
  const [expandedFolders, setExpandedFolders] = useState(() => {
    const saved = localStorage.getItem('vscode.expandedFolders');
    return saved ? JSON.parse(saved) : { 'SOHAM-KUNDU': true, 'about': true };
  });

  // ─── Recruiter ───
  const [recruiterViewOpen, setRecruiterViewOpen] = useState(false);

  // ─── Close Confirm ───
  const [closeConfirm, setCloseConfirm] = useState({ visible: false, file: null, group: 1 });

  // ─── GitHub Data ───
  const [githubData, setGithubData] = useState(null);
  const { data: storeGithubData, fetchData: fetchGlobalGithubData } = useGitHubStore();

  // ─── Clock / Uptime ───
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [uptime, setUptime] = useState(0);

  // ─── Persistence Effects ───
  useEffect(() => { localStorage.setItem('vscode.activeFile', activeFile || ''); }, [activeFile]);
  useEffect(() => { localStorage.setItem('vscode.openFiles', JSON.stringify(openFiles)); }, [openFiles]);
  useEffect(() => { localStorage.setItem('vscode.splitMode', splitMode); }, [splitMode]);
  useEffect(() => { localStorage.setItem('vscode.splitActiveFile', splitActiveFile || ''); }, [splitActiveFile]);
  useEffect(() => { localStorage.setItem('vscode.splitOpenFiles', JSON.stringify(splitOpenFiles)); }, [splitOpenFiles]);
  useEffect(() => { localStorage.setItem('vscode.panel.visible', JSON.stringify(panelVisible)); }, [panelVisible]);
  useEffect(() => { localStorage.setItem('vscode.theme', monacoTheme); }, [monacoTheme]);
  useEffect(() => { localStorage.setItem('vscode.expandedFolders', JSON.stringify(expandedFolders)); }, [expandedFolders]);

  // ─── Timers ───
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  // ─── GitHub Data Fetching ───
  useEffect(() => {
    if (activeFile === '.github/profile.json') {
      if (!storeGithubData) {
        fetchGlobalGithubData();
      } else {
        setGithubData(JSON.stringify({
          followers: storeGithubData.followers || 0,
          following: storeGithubData.following || 0,
          repos: storeGithubData.publicRepos || 0,
        }, null, 2));
      }
    }
  }, [activeFile, storeGithubData, fetchGlobalGithubData]);

  // ─── Incoming Props ───
  useEffect(() => {
    if (project) {
      if (!openFiles.includes('projects/portfolio.db')) {
        setOpenFiles(prev => [...prev, 'projects/portfolio.db']);
      }
      setActiveFile('projects/portfolio.db');
    }
    if (initialFile) {
      setOpenFiles(prev => prev.includes(initialFile) ? prev : [...prev, initialFile]);
      setActiveFile(initialFile);
    }
  }, [project, initialFile]);

  // ─── Context Menu Global Close ───
  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false, x: 0, y: 0, file: null });
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // ─── Panel Drag Resizer ───
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const newHeight = window.innerHeight - e.clientY - 22;
      const maxAllowed = window.innerHeight * 0.5;
      setPanelHeight(Math.min(maxAllowed, Math.max(180, newHeight)));
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

  // ─── Helpers ───
  const getFileName = (path) => path.split('/').pop();

  const addNotification = useCallback((msg) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // ─── File Operations ───
  const handleFileClick = useCallback((path, forceGroup = null) => {
    const targetGroup = forceGroup || activeEditorGroup;
    if (targetGroup === 1) {
      setOpenFiles(prev => prev.includes(path) ? prev : [...prev, path]);
      setActiveFile(path);
    } else {
      setSplitOpenFiles(prev => prev.includes(path) ? prev : [...prev, path]);
      setSplitActiveFile(path);
      setSplitMode(true);
    }
    if (path === 'about/README.md') {
      setPanelVisible(false);
    }
  }, [activeEditorGroup]);

  const handleEditorChange = useCallback((value, path) => {
    setDirtyFiles(prev => prev.includes(path) ? prev : [...prev, path]);
  }, []);

  const executeCloseFile = useCallback((path, group) => {
    if (group === 1) {
      setOpenFiles(prev => {
        const newFiles = prev.filter(f => f !== path);
        if (activeFile === path) {
          setActiveFile(newFiles.length > 0 ? newFiles[newFiles.length - 1] : null);
        }
        return newFiles;
      });
    } else {
      setSplitOpenFiles(prev => {
        const newFiles = prev.filter(f => f !== path);
        if (splitActiveFile === path) {
          setSplitActiveFile(newFiles.length > 0 ? newFiles[newFiles.length - 1] : null);
        }
        if (newFiles.length === 0) setSplitMode(false);
        return newFiles;
      });
    }
    setDirtyFiles(prev => prev.filter(f => f !== path));
  }, [activeFile, splitActiveFile]);

  const closeFile = useCallback((e, path, group = 1) => {
    if (e) e.stopPropagation();
    if (dirtyFiles.includes(path)) {
      setCloseConfirm({ visible: true, file: path, group });
    } else {
      executeCloseFile(path, group);
    }
  }, [dirtyFiles, executeCloseFile]);

  // ─── Explorer ───
  const toggleFolder = useCallback((folderName, e) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  }, []);

  // ─── Context Menu ───
  const handleContextMenu = useCallback((e, path) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file: path });
  }, []);

  // ─── Terminal Commands ───
  const handleTerminalCommand = useCallback((cmd, addOutput, clearOutput) => {
    const trimmed = cmd.trim();
    const command = trimmed.toLowerCase();
    if (trimmed === 'npm run build') {
      addOutput && addOutput('vite v6.4.3 building...');
      setTimeout(() => addOutput && addOutput('✓ transforming modules'), 600);
      setTimeout(() => addOutput && addOutput('✓ generating chunks'), 1200);
      setTimeout(() => addOutput && addOutput('✓ rendering assets'), 1800);
      setTimeout(() => {
        if (addOutput) { addOutput(''); addOutput('Build successful', '#89d185'); }
        addNotification('✓ Build Successful');
      }, 2400);
      return true;
    }
    if (trimmed === 'deploy') {
      addOutput && addOutput('Initiating deployment...');
      setTimeout(() => {
        handleFileClick('system/deployments.log');
        addNotification('Opening deployments panel...');
      }, 500);
      return true;
    }
    if (trimmed.startsWith('code ')) {
      handleFileClick(trimmed.substring(5).trim());
      return true;
    }
    if (command === 'projects') { handleFileClick('projects/portfolio.db'); addNotification('Opened portfolio.db'); return true; }
    if (command === 'resume') { addNotification('Opening resume viewer...'); return true; }
    if (command === 'skills') { handleFileClick('skills/skills.yml'); addNotification('Opened skills.yml'); return true; }
    return false;
  }, [addNotification, handleFileClick]);

  // ─── Menu Actions ───
  const handleMenuAction = useCallback((actionId) => {
    if (actionId === 'run-project' || actionId === 'build-project') {
      setPanelVisible(true);
      setActiveBottomPanel('TERMINAL');
      setTerminalExternalCommand('npm run build');
    } else if (actionId === 'deploy-project') {
      setPanelVisible(true);
      setActiveBottomPanel('TERMINAL');
      setTerminalExternalCommand('deploy');
    }
  }, []);

  // ─── Command Palette ───
  const executeCommand = useCallback((cmd) => {
    setIsCommandPaletteOpen(false);
    setCommandQuery('');
    switch (cmd.id) {
      case 'terminal': setPanelVisible(p => !p); break;
      case 'focus-explorer': setSidebarView('explorer'); break;
      case 'file-readme': case 'about': handleFileClick('about/README.md'); break;
      case 'file-skills': case 'skills': handleFileClick('skills/skills.yml'); break;
      case 'projects': handleFileClick('projects/portfolio.db'); break;
      case 'achievements': handleFileClick('achievements/timeline.log'); break;
      case 'resume': case 'github': case 'linkedin':
        addNotification(`External link for ${cmd.label} would open here.`);
        break;
      case 'theme-dracula': setMonacoTheme('dracula'); addNotification('Theme changed to Dracula'); break;
      case 'theme-onedark': setMonacoTheme('one-dark'); addNotification('Theme changed to One Dark Pro'); break;
      case 'theme-monokai': setMonacoTheme('monokai'); addNotification('Theme changed to Monokai'); break;
      case 'theme-github': setMonacoTheme('github-dark'); addNotification('Theme changed to Github Dark'); break;
      case 'theme-vsdark': setMonacoTheme('vs-dark'); addNotification('Theme changed to Dark+'); break;
      default: break;
    }
  }, [addNotification, handleFileClick]);

  const handlePaletteSelect = useCallback((item, isCmd) => {
    setIsCommandPaletteOpen(false);
    setCommandQuery('');
    if (isCmd) executeCommand(item);
    else handleFileClick(item);
  }, [executeCommand, handleFileClick]);

  // ─── Keyboard Shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command Palette Navigation
      if (isCommandPaletteOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCommandSelectedIndex(prev => prev + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCommandSelectedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const list = isCommandMode ? filteredCommands : filteredFiles;
          const item = list[commandSelectedIndex] || list[0];
          if (item) {
            handlePaletteSelect(item, isCommandMode);
          }
        }
      }
      // Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const active = activeEditorGroup === 1 ? activeFile : splitActiveFile;
        if (active && dirtyFiles.includes(active)) {
          setDirtyFiles(prev => prev.filter(f => f !== active));
          addNotification('Saved ' + getFileName(active));
        }
      }
      // Command Palette
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        setCommandQuery('>');
      } else if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        setCommandQuery('');
      }
      // Close Tab
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        const active = activeEditorGroup === 1 ? activeFile : splitActiveFile;
        if (active) closeFile(null, active, activeEditorGroup);
      }
      // Toggle Sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setSidebarVisible(prev => !prev);
      }
      // Toggle Terminal
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        setPanelVisible(prev => !prev);
      }
      // Escape
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, splitActiveFile, activeEditorGroup, dirtyFiles, addNotification, closeFile]);

  // ─── Command Palette Focus ───
  useEffect(() => {
    if (isCommandPaletteOpen && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [isCommandPaletteOpen]);

  // ─── Derived Data ───
  const isCommandMode = commandQuery.startsWith('>');
  const searchStr = isCommandMode ? commandQuery.substring(1).trim().toLowerCase() : commandQuery.toLowerCase();
  const filteredCommands = isCommandMode ? COMMANDS.filter(c => c.label.toLowerCase().includes(searchStr)) : [];
  const filteredFiles = !isCommandMode ? Object.keys(fileContents).filter(f => f.toLowerCase().includes(searchStr)) : [];

  // Reset selection index when query changes
  useEffect(() => {
    setCommandSelectedIndex(0);
  }, [commandQuery]);

  // Constrain selection index
  useEffect(() => {
    const max = isCommandMode ? filteredCommands.length - 1 : filteredFiles.length - 1;
    if (commandSelectedIndex > max && max >= 0) {
      setCommandSelectedIndex(max);
    }
  }, [commandSelectedIndex, filteredCommands.length, filteredFiles.length, isCommandMode]);

  return {
    // Editor
    activeFile, setActiveFile,
    openFiles, setOpenFiles,
    splitMode, setSplitMode,
    splitActiveFile, setSplitActiveFile,
    splitOpenFiles, setSplitOpenFiles,
    activeEditorGroup, setActiveEditorGroup,
    dirtyFiles, setDirtyFiles,
    handleFileClick, handleEditorChange,
    closeFile, executeCloseFile,
    closeConfirm, setCloseConfirm,

    // UI
    sidebarView, setSidebarView,
    sidebarVisible, setSidebarVisible,
    panelVisible, setPanelVisible,
    panelHeight, setPanelHeight,
    isDragging, setIsDragging,
    activeBottomPanel, setActiveBottomPanel,

    // Theme
    monacoTheme, setMonacoTheme,

    // Terminal
    terminalExternalCommand, setTerminalExternalCommand,
    handleTerminalCommand,

    // Context Menu
    contextMenu, setContextMenu,
    handleContextMenu,

    // Notifications
    notifications, addNotification,

    // Command Palette
    isCommandPaletteOpen, setIsCommandPaletteOpen,
    commandQuery, setCommandQuery,
    commandSelectedIndex, setCommandSelectedIndex,
    commandInputRef,
    executeCommand, handlePaletteSelect,
    filteredCommands, filteredFiles,
    isCommandMode,

    // Search
    searchQuery, setSearchQuery,

    // Explorer
    expandedFolders, setExpandedFolders, toggleFolder,

    // Recruiter
    recruiterViewOpen, setRecruiterViewOpen,

    // GitHub
    githubData,

    // Clock
    currentTime,
    uptime, formatUptime,

    // Menu
    handleMenuAction,

    // Utils
    getFileName,
    fileContents,
  };
}
