import React from 'react';
import { DismissRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { getFileIcon } from '../config/iconMap';

export default function EditorArea({
  activeFile,
  setActiveFile,
  openFiles,
  closeFile,
  activeEditorGroup,
  setActiveEditorGroup,
  renderContent,
  splitMode,
  splitActiveFile,
  setSplitActiveFile,
  splitOpenFiles,
  handleFileClick,
  setPanelVisible,
  dirtyFiles = []
}) {
  const getFileName = (path) => path.split('/').pop() || path;

  const renderWelcome = () => {
    // Collect recent files from open files, filter out Welcome
    const recentFiles = openFiles.filter(f => f !== 'Welcome');
    if (recentFiles.length === 0) {
      recentFiles.push('about/README.md', 'skills/skills.yml', 'projects/portfolio.db');
    }

    return (
      <div className="vscode-welcome-screen" style={{
        height: '100%',
        backgroundColor: 'var(--vscode-editor-background)',
        color: 'var(--vscode-editor-foreground)',
        padding: '40px 60px',
        overflowY: 'auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '32px', color: 'var(--vscode-editor-foreground)', marginBottom: '5px', fontWeight: '400' }}>Visual Studio Code</h1>
          <h3 style={{ fontSize: '18px', color: 'var(--vscode-descriptionForeground)', marginBottom: '40px', fontWeight: '400' }}>Editing evolved</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div className="vscode-welcome-column">
              <div className="vscode-welcome-section" style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '15px' }}>Start</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="vscode-welcome-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--vscode-textLink-foreground)' }}>
                    <span style={{ fontSize: '16px' }}>📝</span> New File...
                  </div>
                  <div className="vscode-welcome-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--vscode-textLink-foreground)' }}>
                    <span style={{ fontSize: '16px' }}>📂</span> Open File...
                  </div>
                  <div className="vscode-welcome-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--vscode-textLink-foreground)' }}>
                    <span style={{ fontSize: '16px' }}>📁</span> Open Folder...
                  </div>
                  <div className="vscode-welcome-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--vscode-textLink-foreground)' }}>
                    <span style={{ fontSize: '16px' }}>🐙</span> Clone Git Repository...
                  </div>
                </div>
              </div>

              <div className="vscode-welcome-section">
                <h2 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '15px' }}>Recent</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentFiles.slice(0, 5).map(file => (
                    <div 
                      key={file} 
                      onClick={() => handleFileClick(file)}
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--vscode-list-hoverBackground)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                        {getFileIcon(getFileName(file))}
                      </span>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--vscode-textLink-foreground)' }}>{getFileName(file)}</div>
                        <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>{file.split('/')[0]}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '5px', fontSize: '13px', color: 'var(--vscode-textLink-foreground)', cursor: 'pointer' }}>
                    More...
                  </div>
                </div>
              </div>
            </div>

            <div className="vscode-welcome-column">
              <div className="vscode-welcome-section">
                <h2 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '15px' }}>Walkthroughs</h2>
                
                <div className="vscode-walkthrough-card" style={{ backgroundColor: 'var(--vscode-editorWidget-background)', padding: '16px', borderRadius: '6px', border: '1px solid var(--vscode-widget-border)', marginBottom: '16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>🚀</div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600' }}>Get Started with VS Code</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--vscode-descriptionForeground)' }}>Discover the best customizations to make VS Code yours.</p>
                    </div>
                  </div>
                </div>

                <div className="vscode-walkthrough-card" style={{ backgroundColor: 'var(--vscode-editorWidget-background)', padding: '16px', borderRadius: '6px', border: '1px solid var(--vscode-widget-border)', marginBottom: '16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>🐍</div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600' }}>Learn Python Fundamentals</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--vscode-descriptionForeground)' }}>Set up your Python environment and start coding.</p>
                    </div>
                  </div>
                </div>
                
                <div className="vscode-walkthrough-card" style={{ backgroundColor: 'var(--vscode-editorWidget-background)', padding: '16px', borderRadius: '6px', border: '1px solid var(--vscode-widget-border)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>✨</div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600' }}>Explore Portfolio OS</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--vscode-descriptionForeground)' }}>See how this VS Code clone was built with React.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vscode-editor-area" style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, width: '100%' }}>
      {/* Main Group */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: splitMode ? '1px solid #252526' : 'none' }} onClick={() => setActiveEditorGroup(1)}>
        {activeFile ? (
          <div className={`vscode-editor-group ${activeEditorGroup === 1 ? 'active-group' : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="vscode-tabs">
              {openFiles.map(path => {
                const isDirty = dirtyFiles.includes(path);
                const isActive = activeFile === path;
                return (
                  <div key={path} className={`vscode-tab ${isActive ? 'active' : ''} ${isDirty ? 'dirty' : ''}`} onClick={() => { setActiveEditorGroup(1); setActiveFile(path); }}>
                    <span className="vscode-tab-icon">{getFileIcon(getFileName(path))}</span>
                    {getFileName(path)}
                    <span className="vscode-tab-close" onClick={(e) => closeFile(e, path, 1)}>
                      <DismissRegular fontSize={12} className="close-icon" />
                      <span className="dirty-icon" style={{ fontSize: 10, padding: 2 }}>●</span>
                    </span>
                  </div>
                );
              })}
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
            <div className="vscode-editor-content" style={activeFile === 'Welcome' ? { padding: 0, flex: 1 } : { flex: 1 }}>
              {activeFile === 'Welcome' ? renderWelcome() : renderContent(activeFile)}
            </div>
          </div>
        ) : (
          renderWelcome()
        )}
      </div>

      {/* Split Group */}
      {splitMode && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} onClick={() => setActiveEditorGroup(2)}>
          {splitActiveFile ? (
            <div className={`vscode-editor-group ${activeEditorGroup === 2 ? 'active-group' : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="vscode-tabs">
                {splitOpenFiles.map(path => {
                  const isDirty = dirtyFiles.includes(path);
                  const isActive = splitActiveFile === path;
                  return (
                    <div key={path} className={`vscode-tab ${isActive ? 'active' : ''} ${isDirty ? 'dirty' : ''}`} onClick={() => { setActiveEditorGroup(2); setSplitActiveFile(path); }}>
                      <span className="vscode-tab-icon">{getFileIcon(getFileName(path))}</span>
                      {getFileName(path)}
                      <span className="vscode-tab-close" onClick={(e) => closeFile(e, path, 2)}>
                        <DismissRegular fontSize={12} className="close-icon" />
                        <span className="dirty-icon" style={{ fontSize: 10, padding: 2 }}>●</span>
                      </span>
                    </div>
                  );
                })}
              </div>
              {splitActiveFile !== 'Welcome' && (
                <div className="vscode-breadcrumbs">
                  <span className="vscode-breadcrumb-item">SOHAM-KUNDU</span>
                  <ChevronRightRegular fontSize={12} className="vscode-breadcrumb-sep" />
                  <span className="vscode-breadcrumb-item">{splitActiveFile.split('/')[0]}</span>
                  <ChevronRightRegular fontSize={12} className="vscode-breadcrumb-sep" />
                  <span className="vscode-breadcrumb-item">
                    <span className="vscode-breadcrumb-icon">{getFileIcon(getFileName(splitActiveFile))}</span> {getFileName(splitActiveFile)}
                  </span>
                </div>
              )}
              <div className="vscode-editor-content" style={splitActiveFile === 'Welcome' ? { padding: 0, flex: 1 } : { flex: 1 }}>
                {splitActiveFile === 'Welcome' ? renderWelcome() : renderContent(splitActiveFile)}
              </div>
            </div>
          ) : (
            renderWelcome()
          )}
        </div>
      )}
    </div>
  );
}
