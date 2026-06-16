import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TerminalCore from '../../components/system/TerminalCore';
import { fileTree } from './data/fileTree';
import './VSCodeApp.css';

export default function VSCodeApp() {
  const [activeFile, setActiveFile] = useState('README.md');
  const [openFiles, setOpenFiles] = useState(['README.md']);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  // Mock content for files
  const fileContents = {
    'README.md': `# Portfolio OS 2026

Welcome to the source code of my web-based operating system portfolio.

## Features
- Windows 11 inspired UI
- Fully functional terminal
- File system navigation
- Window management

Feel free to explore!`,
    'App.jsx': `import React from 'react';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;`,
    'index.css': `body {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}`,
    'package.json': `{\n  "name": "portfolio-os",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^19.1.0"\n  }\n}`,
    'Button.jsx': `export default function Button({ children }) {\n  return <button>{children}</button>;\n}`,
    'Card.jsx': `export default function Card({ title, content }) {\n  return <div><h2>{title}</h2><p>{content}</p></div>;\n}`
  };

  const handleFileClick = (filename) => {
    if (!openFiles.includes(filename)) {
      setOpenFiles([...openFiles, filename]);
    }
    setActiveFile(filename);
  };

  const closeFile = (e, filename) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f !== filename);
    setOpenFiles(newOpenFiles);
    if (activeFile === filename) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const renderFileTree = (nodes, padding = 10) => {
    return nodes.map((node, index) => (
      <div key={index}>
        <div 
          className={`vscode-file-item ${activeFile === node.name ? 'active' : ''}`}
          style={{ paddingLeft: `${padding}px` }}
          onClick={() => node.type === 'file' ? handleFileClick(node.name) : null}
        >
          {node.type === 'folder' ? (
            <span className="vscode-folder-icon">📁</span>
          ) : (
            <span className="vscode-file-icon">📄</span>
          )}
          {node.name}
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div className="vscode-folder-children">
            {renderFileTree(node.children, padding + 10)}
          </div>
        )}
      </div>
    ));
  };

  const renderContent = () => {
    if (!activeFile) return <div style={{ padding: 20 }}>No file open.</div>;

    const content = fileContents[activeFile] || '// Content not found';
    
    if (activeFile.endsWith('.md')) {
      return (
        <div className="vscode-markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }

    let language = 'javascript';
    if (activeFile.endsWith('.css')) language = 'css';
    if (activeFile.endsWith('.json')) language = 'json';

    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent' }}>
        {content}
      </SyntaxHighlighter>
    );
  };

  return (
    <div className="vscode-app">
      <div className="vscode-main">
        {/* Activity Bar */}
        <div className="vscode-activity-bar">
          <div className="vscode-activity-icon active">📄</div>
          <div className="vscode-activity-icon">🔍</div>
          <div className="vscode-activity-icon">ᛦ</div>
        </div>

        {/* Sidebar */}
        <div className="vscode-sidebar">
          <div className="vscode-sidebar-header">Explorer</div>
          <div className="vscode-explorer">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Editor Area */}
        <div className="vscode-editor-area">
          <div className="vscode-tabs">
            {openFiles.map(file => (
              <div 
                key={file} 
                className={`vscode-tab ${activeFile === file ? 'active' : ''}`}
                onClick={() => setActiveFile(file)}
              >
                📄 {file}
                <span className="vscode-tab-close" onClick={(e) => closeFile(e, file)}>×</span>
              </div>
            ))}
          </div>
          
          <div className="vscode-editor-content">
            {renderContent()}
          </div>

          {/* Terminal Panel */}
          {isTerminalOpen && (
            <div className="vscode-panel">
              <div className="vscode-panel-header">
                <div className="vscode-panel-tab active">TERMINAL</div>
                <div className="vscode-panel-tab">OUTPUT</div>
                <div className="vscode-panel-tab">DEBUG CONSOLE</div>
                <div style={{ marginLeft: 'auto', cursor: 'pointer', padding: '8px', color: '#858585' }} onClick={() => setIsTerminalOpen(false)}>×</div>
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
        <div className="vscode-status-item">main*</div>
        <div className="vscode-status-item">✗ 0 ⚠ 0</div>
        
        <div className="vscode-status-right">
          <div className="vscode-status-item" onClick={() => setIsTerminalOpen(!isTerminalOpen)}>
            {isTerminalOpen ? 'Hide Panel' : 'Show Panel'}
          </div>
          <div className="vscode-status-item">UTF-8</div>
          <div className="vscode-status-item">JavaScript React</div>
        </div>
      </div>
    </div>
  );
}
