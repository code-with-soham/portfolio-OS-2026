import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Editor from '@monaco-editor/react';
import TerminalCore from '../../components/system/TerminalCore';
import { fileTree } from './data/fileTree';
import { getFolderIcon, getFileIcon } from './config/iconMap';
import ReadmeRenderer from './components/ReadmeRenderer';
import RecruiterDashboard from './components/RecruiterDashboard';
import MockDBViewer from './components/MockDBViewer';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import TopMenu from './components/TopMenu';
import EditorArea from './components/EditorArea';
import BottomPanel from './components/BottomPanel';
import StatusBar from './components/StatusBar';
import ProfileSidebar from './components/ProfileSidebar';
import { SearchRegular } from '@fluentui/react-icons';
import './VSCodeApp.css';
import vscodeIco from '../../assets/icons/apps/vscode.svg';

// Mock contents
const fileContents = {
  'about/README.md': `![MasterHead](https://www.pramukhdigital.com/wp-content/uploads/2018/07/New-PNC-Animated-Banners.gif)
<h1 align="center">Hello World!, I'm Soham👋, a Indian Web Developer : </h1>
<h4 align="center"> 
                  
  - 🛜 currently working on my own webpage

  - 👨🏼‍🎓 studying computer science at Brainware University

  - 👨🏼‍💻 Currently, I am upgrading my skills.
    
</h4>
<img align="right" alt="Coding" width="400" src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif">

<p align="left"> <img src="https://komarev.com/ghpvc/?username=code-with-soham&label=Profile%20views&color=0e75b6&style=flat" alt="code-with-soham" /> </p>

<p align="left"> <a href="https://twitter.com/sohamkundu84" target="blank"><img src="https://img.shields.io/twitter/follow/sohamkundu84?logo=twitter&style=for-the-badge" alt="sohamkundu84" /></a> </p>

- 🌱 I’m currently learning **React , Javascript**

- 💬 Ask me about **MERN , React**

- 📫 How to reach me **sohamkundu84@gmail.com**

- ⚡ Fun fact **I an funny**

<h3 align="left">Connect with me:</h3>
<p align="left">
<a href="https://twitter.com/sohamkundu84" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="sohamkundu84" height="30" width="40" /></a>
<a href="https://linkedin.com/in/https://www.linkedin.com/in/soham-kundu-b5a9a0250/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="https://www.linkedin.com/in/soham-kundu-b5a9a0250/" height="30" width="40" /></a>
<a href="https://fb.com/https://www.facebook.com/soham.kundu.737" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/facebook.svg" alt="https://www.facebook.com/soham.kundu.737" height="30" width="40" /></a>
</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://aws.amazon.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="aws" width="40" height="40"/> </a> <a href="https://www.cprogramming.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg" alt="c" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://www.figma.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/figma/figma-icon.svg" alt="figma" width="40" height="40"/> </a> <a href="https://flutter.dev" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg" alt="flutter" width="40" height="40"/> </a> <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" alt="nextjs" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.photoshop.com/en" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/photoshop/photoshop-line.svg" alt="photoshop" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://www.python.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://redux.js.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/> </a> <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a> </p>

<p><img align="left" src="https://github-readme-stats.vercel.app/api/top-langs?username=code-with-soham&show_icons=true&locale=en&layout=compact" alt="code-with-soham" /></p>

<p>&nbsp;<img align="center" src="https://github-readme-stats.vercel.app/api?username=code-with-soham&show_icons=true&locale=en" alt="code-with-soham" /></p>

<p><img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=code-with-soham&" alt="code-with-soham" /></p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tobiasmeyhoefer/tobiasmeyhoefer/output/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tobiasmeyhoefer/tobiasmeyhoefer/output/github-snake.svg" />
  <img alt="github-snake" src="https://raw.githubusercontent.com/tobiasmeyhoefer/tobiasmeyhoefer/output/github-snake.svg" />
</picture>

`,
  'projects/portfolio.db': `[BINARY DATA]\nSQLite format 3\n\nTables:\n- users\n- projects\n- achievements`,
  'research/research.ipynb': `{\n  "cells": [\n    {\n      "cell_type": "markdown",\n      "metadata": {},\n      "source": ["# AI Research Notebook\\nExploratory Data Analysis for Placement Prediction."]\n    }\n  ]\n}`,
  'achievements/timeline.log': `2026-06-01  Portfolio OS Released\n2026-05-20  VS Code Workspace Added\n2026-04-15  AI Resume Analyzer Completed\n2026-03-10  Job Tracker Released`,
  'skills/skills.yml': `developer:\n  name: Soham Kundu\n\nfrontend:\n  - React\n  - Next.js\n  - Tailwind\n\nbackend:\n  - Node.js\n  - Express\n  - MongoDB\n\nai_ml:\n  - TensorFlow\n  - PyTorch\n  - LangChain`,
  'connect/links.yml': `github: https://github.com/code-with-soham\nlinkedin: https://linkedin.com/in/sohamkundu\nportfolio: https://sohamkundu.dev\nresume: https://sohamkundu.dev/resume`,
  '.github/profile.json': `{\n  "loading": "Fetching GitHub Data..."\n}`,
  '.gitignore': `node_modules\n.DS_Store\ndist\nbuild\n.env`,
  'LICENSE.txt': `MIT License\n\nCopyright (c) 2026 Soham Kundu\n\nPermission is hereby granted, free of charge...`,
  'CHANGELOG.md': `# Changelog\n\n## [1.0.0] - 2026-06-01\n### Added\n- Initial release of Portfolio OS.\n- Fully interactive React desktop.\n- VS Code developer environment.`,
  'system/deployments.log': `Deployments View`,
  'system/time.sys': `[SYS CLOCK STARTING]`,
  'src/Desktop.jsx': `import React from 'react';\nimport WindowManager from './WindowManager';\n\nexport default function Desktop() {\n  return (\n    <div className="desktop-environment">\n      <WindowManager />\n    </div>\n  );\n}`,
  'src/Taskbar.jsx': `import React from 'react';\n\nexport default function Taskbar() {\n  return (\n    <div className="windows-taskbar">\n      <div className="start-button">Start</div>\n      <div className="taskbar-apps">...</div>\n    </div>\n  );\n}`,
  'src/VSCodeApp.jsx': `import React from 'react';\nimport Editor from '@monaco-editor/react';\n\nexport default function VSCodeApp() {\n  return <div className="vscode-clone">...</div>;\n}`,
  'src/Architecture.md': `# Portfolio OS Architecture\n\n\`\`\`mermaid\ngraph TD;\n    A[Desktop.jsx] --> B[WindowManager];\n    A --> C[Taskbar];\n    B --> D[VSCodeApp];\n    B --> E[Terminal];\n    D --> F[Monaco Editor];\n\`\`\`\n\n> This OS runs purely in the browser using React!`,
  'resume.pdf': `PDF_VIEWER`
};

const COMMANDS = [
  { id: 'about', label: 'Open About', category: 'General' },
  { id: 'projects', label: 'Open Projects', category: 'General' },
  { id: 'resume', label: 'Open Resume', category: 'General' },
  { id: 'github', label: 'Open GitHub Profile', category: 'General' },
  { id: 'linkedin', label: 'Open LinkedIn', category: 'General' },
  { id: 'skills', label: 'Open Skills', category: 'General' },
  { id: 'achievements', label: 'Open Achievements', category: 'General' },
  { id: 'theme', label: 'UI: Toggle Theme', category: 'UI' },
  { id: 'terminal', label: 'UI: Toggle Terminal', category: 'UI' },
  { id: 'file-readme', label: 'File: Open README.md', category: 'File' },
  { id: 'file-skills', label: 'File: Open skills.yml', category: 'File' },
  { id: 'focus-explorer', label: 'Window: Focus Explorer', category: 'Window' },
  { id: 'theme-dracula', label: 'Theme: Dracula', category: 'Theme' },
  { id: 'theme-onedark', label: 'Theme: One Dark Pro', category: 'Theme' },
  { id: 'theme-monokai', label: 'Theme: Monokai', category: 'Theme' },
  { id: 'theme-github', label: 'Theme: Github Dark', category: 'Theme' },
  { id: 'theme-vsdark', label: 'Theme: Dark+', category: 'Theme' },
];

export default function VSCodeApp({ project }) {
  const [activeFile, setActiveFile] = useState(() => localStorage.getItem('vscode.activeFile') || 'about/README.md');
  const [openFiles, setOpenFiles] = useState(() => {
    const saved = localStorage.getItem('vscode.openFiles');
    return saved ? JSON.parse(saved) : ['about/README.md'];
  });
  const [splitMode, setSplitMode] = useState(() => localStorage.getItem('vscode.splitMode') === 'true');
  const [splitActiveFile, setSplitActiveFile] = useState(() => localStorage.getItem('vscode.splitActiveFile') || null);
  const [splitOpenFiles, setSplitOpenFiles] = useState(() => {
    const saved = localStorage.getItem('vscode.splitOpenFiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeEditorGroup, setActiveEditorGroup] = useState(1);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });

  useEffect(() => { localStorage.setItem('vscode.activeFile', activeFile || ''); }, [activeFile]);
  useEffect(() => { localStorage.setItem('vscode.openFiles', JSON.stringify(openFiles)); }, [openFiles]);
  useEffect(() => { localStorage.setItem('vscode.splitMode', splitMode); }, [splitMode]);
  useEffect(() => { localStorage.setItem('vscode.splitActiveFile', splitActiveFile || ''); }, [splitActiveFile]);
  useEffect(() => { localStorage.setItem('vscode.splitOpenFiles', JSON.stringify(splitOpenFiles)); }, [splitOpenFiles]);

  // Context Menu Global Listener
  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false, x: 0, y: 0, file: null });
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Handle incoming project props
  useEffect(() => {
    if (project) {
      if (!openFiles.includes('projects/portfolio.db')) {
        setOpenFiles(prev => [...prev, 'projects/portfolio.db']);
      }
      setActiveFile('projects/portfolio.db');
    }
  }, [project]);

  const handleContextMenu = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file: path });
  };

  const [sidebarView, setSidebarView] = useState('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [recruiterViewOpen, setRecruiterViewOpen] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [monacoTheme, setMonacoTheme] = useState('vs-dark');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [dirtyFiles, setDirtyFiles] = useState([]);
  const [closeConfirm, setCloseConfirm] = useState({ visible: false, file: null, group: 1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeFile === '.github/profile.json' && !githubData) {
      const cached = localStorage.getItem('vscode.github_json_cache');
      const cachedTime = localStorage.getItem('vscode.github_json_timestamp');
      if (cached && cachedTime && (Date.now() - parseInt(cachedTime)) < 24 * 60 * 60 * 1000) {
        setGithubData(cached);
        return;
      }

      Promise.all([
        fetch('https://api.github.com/users/code-with-soham').then(res => res.json()),
        fetch('https://api.github.com/users/code-with-soham/repos?per_page=100').then(res => res.json())
      ])
        .then(([user, repos]) => {
          const stars = Array.isArray(repos) ? repos.reduce((acc, repo) => acc + repo.stargazers_count, 0) : 0;
          const data = {
            followers: user.followers || 0,
            following: user.following || 0,
            repos: user.public_repos || 0,
            stars: stars
          };
          const jsonStr = JSON.stringify(data, null, 2);
          setGithubData(jsonStr);
          localStorage.setItem('vscode.github_json_cache', jsonStr);
          localStorage.setItem('vscode.github_json_timestamp', Date.now().toString());
        })
        .catch(() => setGithubData('{\n  "error": "Failed to fetch GitHub profile"\n}'));
    }
  }, [activeFile, githubData]);

  const addNotification = (msg) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };
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
  const [terminalExternalCommand, setTerminalExternalCommand] = useState(null);

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

  const handleFileClick = (path, forceGroup = null) => {
    const targetGroup = forceGroup || activeEditorGroup;
    if (targetGroup === 1) {
      if (!openFiles.includes(path)) {
        setOpenFiles([...openFiles, path]);
      }
      setActiveFile(path);
    } else {
      if (!splitOpenFiles.includes(path)) {
        setSplitOpenFiles([...splitOpenFiles, path]);
      }
      setSplitActiveFile(path);
      setSplitMode(true);
    }
    if (path === 'about/README.md') {
      setPanelVisible(false);
    }
  };

  const handleEditorChange = (value, path) => {
    if (!dirtyFiles.includes(path)) {
      setDirtyFiles(prev => [...prev, path]);
    }
  };

  const executeCloseFile = (path, group) => {
    if (group === 1) {
      const newOpenFiles = openFiles.filter(f => f !== path);
      setOpenFiles(newOpenFiles);
      if (activeFile === path) {
        setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
      }
    } else {
      const newOpenFiles = splitOpenFiles.filter(f => f !== path);
      setSplitOpenFiles(newOpenFiles);
      if (splitActiveFile === path) {
        setSplitActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
      }
      if (newOpenFiles.length === 0) {
        setSplitMode(false);
      }
    }
    setDirtyFiles(prev => prev.filter(f => f !== path));
  };

  const closeFile = (e, path, group = 1) => {
    if (e) e.stopPropagation();
    if (dirtyFiles.includes(path)) {
      setCloseConfirm({ visible: true, file: path, group });
    } else {
      executeCloseFile(path, group);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.type === 'click') {
        addNotification('Multi-cursor enabled');
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        addNotification('Selected next occurrence');
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const active = activeEditorGroup === 1 ? activeFile : splitActiveFile;
        if (active && dirtyFiles.includes(active)) {
          setDirtyFiles(prev => prev.filter(f => f !== active));
          addNotification('Saved ' + getFileName(active));
        }
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setCommandQuery(e.shiftKey ? '>' : '');
        setIsCommandPaletteOpen(true);
      }
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        const active = activeEditorGroup === 1 ? activeFile : splitActiveFile;
        if (active) closeFile(null, active, activeEditorGroup);
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setSidebarVisible(prev => !prev);
      }
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setPanelVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const handleMouseDown = (e) => {
      if (e.altKey) addNotification('Multi-cursor enabled');
    };
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [activeFile, splitActiveFile, activeEditorGroup, dirtyFiles]);



  const handleTerminalCommand = (cmd, addOutput, clearOutput) => {
    const trimmed = cmd.trim();
    const command = trimmed.toLowerCase();
    if (trimmed === 'npm run build') {
      addOutput && addOutput('vite v6.4.3 building...');
      setTimeout(() => addOutput && addOutput('✓ transforming modules'), 600);
      setTimeout(() => addOutput && addOutput('✓ generating chunks'), 1200);
      setTimeout(() => addOutput && addOutput('✓ rendering assets'), 1800);
      setTimeout(() => {
        if (addOutput) {
          addOutput('');
          addOutput('Build successful', '#89d185');
        }
        addNotification('✓ Build Successful');
      }, 2400);
      return true; // handled
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
      const file = trimmed.substring(5).trim();
      handleFileClick(file);
      return true;
    }

    // Old terminal commands support
    if (command === 'projects') {
      handleFileClick('projects/portfolio.db');
      addNotification('Opened portfolio.db');
      return true;
    }
    if (command === 'resume') {
      addNotification('Opening resume viewer...');
      return true;
    }
    if (command === 'skills') {
      handleFileClick('skills/skills.yml');
      addNotification('Opened skills.yml');
      return true;
    }

    return false;
  };

  const handleMenuAction = (actionId) => {
    if (actionId === 'run-project' || actionId === 'build-project') {
      setPanelVisible(true);
      setActiveBottomPanel('TERMINAL');
      setTerminalExternalCommand('npm run build');
    } else if (actionId === 'deploy-project') {
      setPanelVisible(true);
      setActiveBottomPanel('TERMINAL');
      setTerminalExternalCommand('deploy');
    }
  };


  const toggleFolder = (folderName, e) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  // Command Palette listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        setPanelVisible(prev => !prev);
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        setCommandQuery('>');
      } else if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        setCommandQuery('');
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
      case 'about':
        handleFileClick('about/README.md');
        break;
      case 'file-skills':
      case 'skills':
        handleFileClick('skills/skills.yml');
        break;
      case 'projects':
        handleFileClick('projects/portfolio.db');
        break;
      case 'achievements':
        handleFileClick('achievements/timeline.log');
        break;
      case 'resume':
      case 'github':
      case 'linkedin':
        addNotification(`External link for ${cmd.label} would open here.`);
        break;
      case 'theme-dracula':
        setMonacoTheme('dracula');
        addNotification('Theme changed to Dracula');
        break;
      case 'theme-onedark':
        setMonacoTheme('one-dark');
        addNotification('Theme changed to One Dark Pro');
        break;
      case 'theme-monokai':
        setMonacoTheme('monokai');
        addNotification('Theme changed to Monokai');
        break;
      case 'theme-github':
        setMonacoTheme('github-dark');
        addNotification('Theme changed to Github Dark');
        break;
      case 'theme-vsdark':
        setMonacoTheme('vs-dark');
        addNotification('Theme changed to Dark+');
        break;
      default:
        console.log('Command not implemented in mock:', cmd.label);
    }
  };

  const handleEditorWillMount = (monaco) => {
    // Define custom themes
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '282a36' },
        { token: 'comment', foreground: '6272a4' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'keyword', foreground: 'ff79c6' }
      ],
      colors: { 'editor.background': '#282a36' }
    });

    monaco.editor.defineTheme('one-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '282c34' },
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'string', foreground: '98c379' },
        { token: 'keyword', foreground: 'c678dd' }
      ],
      colors: { 'editor.background': '#282c34' }
    });

    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '272822' },
        { token: 'comment', foreground: '75715e' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'keyword', foreground: 'f92672' }
      ],
      colors: { 'editor.background': '#272822' }
    });

    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '24292e' },
        { token: 'comment', foreground: '6a737d' },
        { token: 'string', foreground: '9ecbff' },
        { token: 'keyword', foreground: 'f97583' }
      ],
      colors: { 'editor.background': '#24292e' }
    });
  };

  const isCommandMode = commandQuery.startsWith('>');
  const searchStr = isCommandMode ? commandQuery.substring(1).trim().toLowerCase() : commandQuery.toLowerCase();

  const filteredCommands = isCommandMode
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(searchStr))
    : [];

  const filteredFiles = !isCommandMode
    ? Object.keys(fileContents).filter(f => f.toLowerCase().includes(searchStr))
    : [];

  const handlePaletteSelect = (item, isCmd) => {
    setIsCommandPaletteOpen(false);
    setCommandQuery('');
    if (isCmd) {
      executeCommand(item);
    } else {
      handleFileClick(item);
    }
  };



  const renderContent = (fileToRender) => {
    if (fileToRender === 'Welcome') {
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

    const content = fileContents[fileToRender] || '// Content not found';
    let finalContent = content;

    if (fileToRender === '.github/profile.json' && githubData) {
      finalContent = githubData;
    }
    if (fileToRender === 'system/time.sys') {
      finalContent = `[SYSTEM TIME LOG]\n\nCurrent Time:\n${currentTime}\n\n>> This file is continuously updated by a background process.`;
    }

    if (fileToRender === 'about/README.md') {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', overflowY: 'auto', backgroundColor: '#0d1117', color: '#c9d1d9' }}>
          <div className="vscode-markdown github-style" style={{ flex: 1, minWidth: '350px', padding: '20px' }}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{finalContent}</ReactMarkdown>
          </div>
          <ProfileSidebar />
        </div>
      );
    }

    if (fileToRender === 'resume.pdf') {
      return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#525659', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '80%', height: '90%', backgroundColor: 'white', color: 'black', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', overflow: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Soham Kundu</h1>
            <p><strong>Email:</strong> contact@soham.com | <strong>Location:</strong> India</p>
            <h3 style={{ marginTop: '30px' }}>Experience</h3>
            <ul>
              <li><strong>Frontend Developer Intern</strong> - Expantra Tech Pvt Ltd</li>
            </ul>
            <h3 style={{ marginTop: '20px' }}>Projects</h3>
            <ul>
              <li><strong>Portfolio OS</strong>: A web-based Windows 11 clone</li>
              <li><strong>AI Mock Interview Platform</strong>: Role-based AI interviews</li>
              <li><strong>Placement Predictor</strong>: Random Forest ML model</li>
            </ul>
            <p style={{ marginTop: '40px', color: '#666', fontStyle: 'italic', fontSize: '12px', textAlign: 'center' }}>[Embedded PDF Mock]</p>
          </div>
        </div>
      );
    }

    if (fileToRender.endsWith('.db')) {
      return <MockDBViewer />;
    }

    if (fileToRender === 'system/deployments.log') {
      return (
        <div style={{ padding: '30px', color: '#cccccc', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#ffffff', fontWeight: '400', fontSize: '24px', marginBottom: '24px' }}>Deployments</h2>

          <div style={{ backgroundColor: '#000000', border: '1px solid #333', borderRadius: '8px', padding: '0', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500' }}>Portfolio OS</span>
                  <span style={{ padding: '4px 8px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', fontSize: '12px', color: '#888' }}>Production</span>
                </div>
                <span style={{ color: '#0070f3', fontSize: '14px', cursor: 'pointer' }}>View build logs →</span>
              </div>

              <div style={{ display: 'flex', gap: '40px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Deployment</div>
                  <div style={{ fontSize: '14px', color: '#fff' }}>
                    <a href="https://soham-kundu-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none' }}>
                      soham-kundu-portfolio.vercel.app
                    </a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Domains</div>
                  <div style={{ fontSize: '14px', color: '#fff' }}>1 domain</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#fff' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#50e3c2', borderRadius: '50%', boxShadow: '0 0 8px #50e3c2' }}></div>
                    Ready
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Created</div>
                  <div style={{ fontSize: '14px', color: '#fff' }}>1m ago by <a href="https://github.com/code-with-soham" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Soham Kundu</a></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 20px', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', backgroundColor: '#1a1a1a', padding: '4px 8px', borderRadius: '4px', border: '1px solid #333' }}>main</div>
              <div style={{ color: '#888', fontSize: '14px' }}>Deployed <span style={{ color: '#fff' }}>f59da40</span> - "Implement VS Code Feature"</div>
              <div style={{ marginLeft: 'auto', color: '#888', fontSize: '12px' }}>14s duration</div>
            </div>
          </div>

          <h3 style={{ color: '#ffffff', fontWeight: '500', fontSize: '16px', marginBottom: '16px' }}>Deployment History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>
                  <a href="https://soham-kundu-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>soham-kundu-portfolio.vercel.app</a>
                </span>
                <span style={{ color: '#888', fontSize: '12px' }}>Branch: <a href="https://github.com/code-with-soham" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'underline' }}>main</a> • Commit: 2abf114</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#50e3c2', fontSize: '13px' }}>● Ready</span>
                <span style={{ color: '#888', fontSize: '12px' }}>2d ago</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>portfolio-os-preview.vercel.app</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Branch: feat/vscode-ui • Commit: 9df8122</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#50e3c2', fontSize: '13px' }}>● Ready</span>
                <span style={{ color: '#888', fontSize: '12px' }}>5d ago</span>
              </div>
            </div>
          </div>

        </div>
      );
    }

    if (fileToRender.endsWith('.log')) {
      return (
        <div className="vscode-timeline-viewer">
          <h3 className="vscode-timeline-title">Build & Event Timeline</h3>
          <div className="vscode-timeline-list">
            <div className="vscode-timeline-item"><span className="time">2026-06-01</span> <span className="event" style={{ color: '#89d185' }}>Portfolio OS Released to Production 🚀</span></div>
            <div className="vscode-timeline-item"><span className="time">2026-05-20</span> <span className="event">VS Code Workspace Integrated</span></div>
            <div className="vscode-timeline-item"><span className="time">2026-04-15</span> <span className="event">AI Resume Analyzer Built</span></div>
            <div className="vscode-timeline-item"><span className="time">2026-03-10</span> <span className="event">Initial System Architecture Drafted</span></div>
          </div>
        </div>
      );
    }

    if (fileToRender.endsWith('.md')) {
      return (
        <div className="vscode-markdown github-style" style={{ padding: '20px', backgroundColor: '#0d1117', color: '#c9d1d9', overflowY: 'auto', height: '100%' }}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{finalContent}</ReactMarkdown>
        </div>
      );
    }

    let language = 'javascript';
    if (fileToRender.endsWith('.yml') || fileToRender.endsWith('.yaml')) language = 'yaml';
    if (fileToRender.endsWith('.json')) language = 'json';
    if (fileToRender.endsWith('.log') || fileToRender.endsWith('.sys')) language = 'plaintext';
    if (fileToRender.endsWith('.db')) language = 'sql';
    if (fileToRender.endsWith('.html')) language = 'html';
    if (activeFile.endsWith('.css')) language = 'css';

    return (
      <Editor
        beforeMount={handleEditorWillMount}
        height="100%"
        theme={monacoTheme}
        language={language}
        value={finalContent}
        onChange={(val) => handleEditorChange(val, fileToRender)}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          readOnly: fileToRender.endsWith('.db') || fileToRender.endsWith('.log') || fileToRender === 'system/time.sys',
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 16 }
        }}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote, () => {
            setPanelVisible(prev => !prev);
          });
        }}
      />
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
              {isCommandMode ? (
                <>
                  {filteredCommands.map(cmd => (
                    <div key={cmd.id} className="vscode-command-item" onClick={() => handlePaletteSelect(cmd, true)}>
                      <span className="vscode-command-category">{cmd.category}:</span> {cmd.label}
                    </div>
                  ))}
                  {filteredCommands.length === 0 && <div className="vscode-command-empty">No matching commands</div>}
                </>
              ) : (
                <>
                  {filteredFiles.map(file => (
                    <div key={file} className="vscode-command-item" onClick={() => handlePaletteSelect(file, false)}>
                      <span className="vscode-command-category" style={{ marginRight: 6, display: 'inline-flex', alignItems: 'center' }}>{getFileIcon(getFileName(file))}</span> {file}
                    </div>
                  ))}
                  {filteredFiles.length === 0 && <div className="vscode-command-empty">No matching files</div>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Layout Structure */}
      <div className="vscode-layout" style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', overflow: 'hidden' }}>
        <ActivityBar sidebarView={sidebarView} setSidebarView={setSidebarView} />

        <Sidebar
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          activeFile={activeFile}
          handleFileClick={handleFileClick}
          handleContextMenu={(e, path) => {
            e.preventDefault();
            setContextMenu({ visible: true, x: e.clientX, y: e.clientY, path });
          }}
          openFiles={openFiles}
          closeFile={closeFile}
          setActiveFile={setActiveFile}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fileContents={fileContents}
          dirtyFiles={dirtyFiles}
        />

        <div className="vscode-content-column" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' }}>
          <TopMenu onMenuAction={handleMenuAction} />

          <EditorArea
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            openFiles={openFiles}
            closeFile={closeFile}
            activeEditorGroup={activeEditorGroup}
            setActiveEditorGroup={setActiveEditorGroup}
            renderContent={renderContent}
            splitMode={splitMode}
            splitActiveFile={splitActiveFile}
            setSplitActiveFile={setSplitActiveFile}
            splitOpenFiles={splitOpenFiles}
            handleFileClick={handleFileClick}
            setPanelVisible={setPanelVisible}
            dirtyFiles={dirtyFiles}
          />

          <BottomPanel
            panelVisible={panelVisible}
            setPanelVisible={setPanelVisible}
            panelHeight={panelHeight}
            setPanelHeight={setPanelHeight}
            setIsDragging={setIsDragging}
            activeBottomPanel={activeBottomPanel}
            setActiveBottomPanel={setActiveBottomPanel}
            handleTerminalCommand={handleTerminalCommand}
            terminalExternalCommand={terminalExternalCommand}
            setTerminalExternalCommand={setTerminalExternalCommand}
            handleFileClick={handleFileClick}
          />

          <StatusBar
            activeFile={activeFile}
            splitActiveFile={splitActiveFile}
            splitMode={splitMode}
            uptimeFormatted={formatUptime(uptime)}
          />
        </div>
      </div>

      {/* Recruiter Dashboard */}
      {recruiterViewOpen && <RecruiterDashboard onClose={() => setRecruiterViewOpen(false)} />}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="vscode-context-menu"
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 100000, background: '#252526', border: '1px solid #454545', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', padding: '4px 0', minWidth: '160px', color: '#cccccc', fontSize: '13px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="vscode-context-menu-item" onClick={() => handleContextAction('open')}>Open</div>
          <div className="vscode-context-menu-item" onClick={() => handleContextAction('open-side')}>Open to Side</div>
          <div style={{ height: '1px', background: '#454545', margin: '4px 0' }}></div>
          <div className="vscode-context-menu-item" onClick={() => handleContextAction('reveal')}>Reveal in Explorer</div>
          <div className="vscode-context-menu-item" onClick={() => handleContextAction('copy-path')}>Copy Path</div>
          <div style={{ height: '1px', background: '#454545', margin: '4px 0' }}></div>
          <div className="vscode-context-menu-item" onClick={() => handleContextAction('rename')}>Rename...</div>
          <div className="vscode-context-menu-item" onClick={() => handleContextAction('delete')}>Delete</div>
        </div>
      )}

      {/* Notifications */}
      <div className="vscode-notifications">
        {notifications.map(n => (
          <div key={n.id} className="vscode-toast">
            <div className="vscode-toast-icon">✓</div>
            <div className="vscode-toast-msg">{n.msg}</div>
          </div>
        ))}
      </div>

      {/* Close Confirm Modal */}
      {closeConfirm.visible && (
        <div className="vscode-modal-overlay">
          <div className="vscode-modal">
            <div className="vscode-modal-title">Do you want to save the changes you made to {getFileName(closeConfirm.file)}?</div>
            <div className="vscode-modal-subtitle">Your changes will be lost if you don't save them.</div>
            <div className="vscode-modal-actions">
              <button className="vscode-btn vscode-btn-primary" onClick={() => {
                setDirtyFiles(prev => prev.filter(f => f !== closeConfirm.file));
                executeCloseFile(closeConfirm.file, closeConfirm.group);
                setCloseConfirm({ visible: false, file: null, group: 1 });
                addNotification('Saved ' + getFileName(closeConfirm.file));
              }}>Save</button>
              <button className="vscode-btn vscode-btn-secondary" onClick={() => {
                executeCloseFile(closeConfirm.file, closeConfirm.group);
                setCloseConfirm({ visible: false, file: null, group: 1 });
              }}>Don't Save</button>
              <button className="vscode-btn vscode-btn-secondary" onClick={() => {
                setCloseConfirm({ visible: false, file: null, group: 1 });
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
