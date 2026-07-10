import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Editor from '@monaco-editor/react';
import TerminalCore from '../../components/system/TerminalCore';
import { fileTree } from './data/fileTree';
import { getFolderIcon, getFileIcon } from './config/iconMap';
import { useDataStore } from '../../store/useDataStore';
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
import useWorkbench from './hooks/useWorkbench';
import { usePresentationStore } from '../../store/usePresentationStore';
import './styles/tokens.css';
import './VSCodeApp.css';
import vscodeIco from '../../assets/icons/apps/vscode.svg';

export default function VSCodeApp({ project, initialFile }) {
  const wb = useWorkbench({ project, initialFile });
  const getFileContent = useDataStore(s => s.getFile);

  // ─── Monaco Theme Setup ───
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark', inherit: true,
      rules: [
        { background: '282a36' },
        { token: 'comment', foreground: '6272a4' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'keyword', foreground: 'ff79c6' }
      ],
      colors: { 'editor.background': '#282a36' }
    });
    monaco.editor.defineTheme('one-dark', {
      base: 'vs-dark', inherit: true,
      rules: [
        { background: '282c34' },
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'string', foreground: '98c379' },
        { token: 'keyword', foreground: 'c678dd' }
      ],
      colors: { 'editor.background': '#282c34' }
    });
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark', inherit: true,
      rules: [
        { background: '272822' },
        { token: 'comment', foreground: '75715e' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'keyword', foreground: 'f92672' }
      ],
      colors: { 'editor.background': '#272822' }
    });
    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark', inherit: true,
      rules: [
        { background: '24292e' },
        { token: 'comment', foreground: '6a737d' },
        { token: 'string', foreground: '9ecbff' },
        { token: 'keyword', foreground: 'f97583' }
      ],
      colors: { 'editor.background': '#24292e' }
    });
  };

  const renderContent = (fileToRender) => {
    if (fileToRender === 'Welcome') return null; // Welcome is handled by EditorArea

    const content = getFileContent(fileToRender);
    let finalContent = content;

    if (fileToRender === '.github/profile.json' && wb.githubData) finalContent = wb.githubData;
    if (fileToRender === 'system/time.sys') {
      finalContent = `[SYSTEM TIME LOG]\n\nCurrent Time:\n${wb.currentTime}\n\n>> This file is continuously updated by a background process.`;
    }

    // README with Profile Sidebar
    if (fileToRender === 'about/README.md') {
      return (
        <div style={{ display: 'flex', flexWrap: 'nowrap', width: '100%', height: '100%', backgroundColor: '#0d1117', color: '#c9d1d9', overflowX: 'hidden' }}>
          <div style={{ flex: 1, minWidth: '0', overflowY: 'auto' }}>
            <ReadmeRenderer />
          </div>
          <ProfileSidebar />
        </div>
      );
    }

    // PDF Mock
    if (fileToRender === 'resume.pdf') {
      return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#525659', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '80%', height: '90%', backgroundColor: 'white', color: 'black', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', overflow: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Soham Kundu</h1>
            <p><strong>Email:</strong> contact@soham.com | <strong>Location:</strong> India</p>
            <h3 style={{ marginTop: '30px' }}>Experience</h3>
            <ul><li><strong>Frontend Developer Intern</strong> - Expantra Tech Pvt Ltd</li></ul>
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

    // DB Viewer
    if (fileToRender.endsWith('.db')) return <MockDBViewer />;

    // Deployments
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
                <div><div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Deployment</div><div style={{ fontSize: '14px', color: '#fff' }}><a href="https://soham-kundu-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none' }}>soham-kundu-portfolio.vercel.app</a></div></div>
                <div><div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Domains</div><div style={{ fontSize: '14px', color: '#fff' }}>1 domain</div></div>
                <div><div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Status</div><div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#fff' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#50e3c2', borderRadius: '50%', boxShadow: '0 0 8px #50e3c2' }}></div>Ready</div></div>
                <div><div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Created</div><div style={{ fontSize: '14px', color: '#fff' }}>1m ago by <a href="https://github.com/code-with-soham" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Soham Kundu</a></div></div>
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
                <span style={{ color: '#fff', fontSize: '14px' }}>soham-kundu-portfolio.vercel.app</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Branch: main • Commit: 2abf114</span>
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

    // Timeline/Log
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

    // Markdown
    if (fileToRender.endsWith('.md')) {
      if (fileToRender === 'about/README.md') {
        return <ReadmeRenderer />;
      }
      return (
        <div className="vscode-markdown github-style" style={{ padding: '20px', backgroundColor: '#0d1117', color: '#c9d1d9', overflowY: 'auto', height: '100%' }}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{finalContent}</ReactMarkdown>
        </div>
      );
    }

    // Monaco Editor for all other files
    let language = 'javascript';
    if (fileToRender.endsWith('.yml') || fileToRender.endsWith('.yaml')) language = 'yaml';
    if (fileToRender.endsWith('.json')) language = 'json';
    if (fileToRender.endsWith('.log') || fileToRender.endsWith('.sys')) language = 'plaintext';
    if (fileToRender.endsWith('.db')) language = 'sql';
    if (fileToRender.endsWith('.html')) language = 'html';
    if (fileToRender.endsWith('.css')) language = 'css';

    return (
      <Editor
        beforeMount={handleEditorWillMount}
        height="100%"
        theme={wb.monacoTheme}
        language={language}
        value={finalContent}
        onChange={(val) => wb.handleEditorChange(val, fileToRender)}
        options={{
          minimap: { enabled: true, showSlider: 'always', renderCharacters: false },
          fontSize: 14,
          fontFamily: 'var(--vscode-editor-font-family)',
          wordWrap: 'on',
          readOnly: fileToRender.endsWith('.db') || fileToRender.endsWith('.log') || fileToRender === 'system/time.sys',
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 16 },
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          guides: { indentation: true, bracketPairs: true },
          stickyScroll: { enabled: true },
        }}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote, () => {
            wb.setPanelVisible(prev => !prev);
          });
        }}
      />
    );
  };

  // ─── Render ───
  return (
    <div className="vscode-app">
      {/* Command Palette Overlay */}
      {wb.isCommandPaletteOpen && (
        <div className="vscode-command-palette-overlay" onClick={() => wb.setIsCommandPaletteOpen(false)}>
          <div className="vscode-command-palette" onClick={e => e.stopPropagation()}>
            <input
              ref={wb.commandInputRef}
              type="text"
              className="vscode-command-input"
              placeholder="Type a command or search..."
              value={wb.commandQuery}
              onChange={e => wb.setCommandQuery(e.target.value)}
            />
            <div className="vscode-command-list">
              {wb.isCommandMode ? (
                <>
                  {wb.filteredCommands.map((cmd, index) => (
                    <div key={cmd.id} className={`vscode-command-item ${wb.commandSelectedIndex === index ? 'selected' : ''}`} onClick={() => wb.handlePaletteSelect(cmd, true)}>
                      <span className="vscode-command-category">{cmd.category}:</span> {cmd.label}
                    </div>
                  ))}
                  {wb.filteredCommands.length === 0 && <div className="vscode-command-empty">No matching commands</div>}
                </>
              ) : (
                <>
                  {wb.filteredFiles.map((file, index) => (
                    <div key={file} className={`vscode-command-item ${wb.commandSelectedIndex === index ? 'selected' : ''}`} onClick={() => wb.handlePaletteSelect(file, false)}>
                      <span className="vscode-command-category" style={{ marginRight: 6, display: 'inline-flex', alignItems: 'center' }}>{getFileIcon(wb.getFileName(file))}</span> {file}
                    </div>
                  ))}
                  {wb.filteredFiles.length === 0 && <div className="vscode-command-empty">No matching files</div>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workbench Layout */}
      <div className="vscode-layout" style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', overflow: 'hidden' }}>
        <ActivityBar sidebarView={wb.sidebarView} setSidebarView={wb.setSidebarView} />

        {wb.sidebarVisible && (
          <Sidebar
            sidebarView={wb.sidebarView}
            setSidebarView={wb.setSidebarView}
            activeFile={wb.activeFile}
            handleFileClick={wb.handleFileClick}
            handleContextMenu={wb.handleContextMenu}
            openFiles={wb.openFiles}
            closeFile={wb.closeFile}
            setActiveFile={wb.setActiveFile}
            searchQuery={wb.searchQuery}
            setSearchQuery={wb.setSearchQuery}
            fileContents={wb.fileContents}
            dirtyFiles={wb.dirtyFiles}
          />
        )}

        <div className="vscode-content-column" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' }}>
          <TopMenu onMenuAction={wb.handleMenuAction} />

          <EditorArea
            activeFile={wb.activeFile}
            setActiveFile={wb.setActiveFile}
            openFiles={wb.openFiles}
            closeFile={wb.closeFile}
            activeEditorGroup={wb.activeEditorGroup}
            setActiveEditorGroup={wb.setActiveEditorGroup}
            renderContent={renderContent}
            splitMode={wb.splitMode}
            splitActiveFile={wb.splitActiveFile}
            setSplitActiveFile={wb.setSplitActiveFile}
            splitOpenFiles={wb.splitOpenFiles}
            handleFileClick={wb.handleFileClick}
            setPanelVisible={wb.setPanelVisible}
            dirtyFiles={wb.dirtyFiles}
          />

          <BottomPanel
            panelVisible={wb.panelVisible}
            setPanelVisible={wb.setPanelVisible}
            panelHeight={wb.panelHeight}
            setPanelHeight={wb.setPanelHeight}
            setIsDragging={wb.setIsDragging}
            activeBottomPanel={wb.activeBottomPanel}
            setActiveBottomPanel={wb.setActiveBottomPanel}
            handleTerminalCommand={wb.handleTerminalCommand}
            terminalExternalCommand={wb.terminalExternalCommand}
            setTerminalExternalCommand={wb.setTerminalExternalCommand}
            handleFileClick={wb.handleFileClick}
          />

          <StatusBar
            activeFile={wb.activeFile}
            splitActiveFile={wb.splitActiveFile}
            splitMode={wb.splitMode}
            uptimeFormatted={wb.formatUptime(wb.uptime)}
          />
        </div>
      </div>

      {/* Recruiter Dashboard */}
      {wb.recruiterViewOpen && <RecruiterDashboard onClose={() => wb.setRecruiterViewOpen(false)} />}

      {/* Context Menu */}
      {wb.contextMenu.visible && (
        <div
          className="vscode-context-menu"
          style={{ top: wb.contextMenu.y, left: wb.contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="vscode-context-menu-item" onClick={() => wb.handleFileClick(wb.contextMenu.file)}>Open</div>
          <div className="vscode-context-menu-item" onClick={() => wb.handleFileClick(wb.contextMenu.file, 2)}>Open to Side</div>
          <div className="vscode-context-menu-divider"></div>
          <div className="vscode-context-menu-item">Reveal in Explorer</div>
          <div className="vscode-context-menu-item" onClick={() => { navigator.clipboard.writeText(wb.contextMenu.file); wb.addNotification('Path copied!'); }}>Copy Path</div>
          <div className="vscode-context-menu-divider"></div>
          <div className="vscode-context-menu-item">Rename...</div>
          <div className="vscode-context-menu-item">Delete</div>
        </div>
      )}

      {/* Notifications */}
      <div className="vscode-notifications">
        {wb.notifications.map(n => (
          <div key={n.id} className="vscode-toast">
            <div className="vscode-toast-icon">✓</div>
            <div className="vscode-toast-msg">{n.msg}</div>
          </div>
        ))}
      </div>

      {/* Close Confirm Modal */}
      {wb.closeConfirm.visible && (
        <div className="vscode-modal-overlay">
          <div className="vscode-modal">
            <div className="vscode-modal-title">Do you want to save the changes you made to {wb.getFileName(wb.closeConfirm.file)}?</div>
            <div className="vscode-modal-subtitle">Your changes will be lost if you don't save them.</div>
            <div className="vscode-modal-actions">
              <button className="vscode-btn vscode-btn-primary" onClick={() => {
                wb.setDirtyFiles(prev => prev.filter(f => f !== wb.closeConfirm.file));
                wb.executeCloseFile(wb.closeConfirm.file, wb.closeConfirm.group);
                wb.setCloseConfirm({ visible: false, file: null, group: 1 });
                wb.addNotification('Saved ' + wb.getFileName(wb.closeConfirm.file));
              }}>Save</button>
              <button className="vscode-btn vscode-btn-secondary" onClick={() => {
                wb.executeCloseFile(wb.closeConfirm.file, wb.closeConfirm.group);
                wb.setCloseConfirm({ visible: false, file: null, group: 1 });
              }}>Don't Save</button>
              <button className="vscode-btn vscode-btn-secondary" onClick={() => {
                wb.setCloseConfirm({ visible: false, file: null, group: 1 });
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
