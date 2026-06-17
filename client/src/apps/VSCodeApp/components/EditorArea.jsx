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

  const renderWelcome = () => (
    <div className="vscode-new-welcome" style={{ padding: '40px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div className="vscode-new-welcome-content" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <div className="vscode-welcome-hero" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', fontWeight: '300', color: '#ffffff' }}>SOHAM KUNDU</h1>
            <p style={{ fontSize: '16px', color: '#858585', margin: 0 }}>Full Stack + AI Developer • Portfolio OS Workspace</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="vscode-btn vscode-btn-primary" onClick={() => handleFileClick('about/README.md')}>View README</button>
            <button className="vscode-btn vscode-btn-secondary" onClick={() => setPanelVisible(true)}>Open Terminal</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Recent Activity / Contribution */}
          <div className="vscode-welcome-card" style={{ backgroundColor: '#252526', border: '1px solid #3c3c3c', borderRadius: '6px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#cccccc', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Contributions</h3>
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
              {Array.from({ length: 140 }).map((_, i) => {
                const levels = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
                const rand = Math.random();
                let color = levels[0];
                if (rand > 0.6) color = levels[1];
                if (rand > 0.8) color = levels[2];
                if (rand > 0.9) color = levels[3];
                if (rand > 0.95) color = levels[4];
                return <div key={i} style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px' }}></div>
              })}
            </div>
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#858585', display: 'flex', justifyContent: 'space-between' }}>
              <span>284 contributions in the last year</span>
              <span style={{ color: '#3794ff', cursor: 'pointer' }} onClick={() => handleFileClick('.github/profile.yml')}>View GitHub Profile</span>
            </div>
          </div>

          {/* Latest Deployment */}
          <div className="vscode-welcome-card" style={{ backgroundColor: '#252526', border: '1px solid #3c3c3c', borderRadius: '6px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#cccccc', textTransform: 'uppercase', letterSpacing: '1px' }}>Latest Deployment</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#89d185', boxShadow: '0 0 8px #89d185' }}></div>
              <span style={{ fontSize: '16px', color: '#ffffff' }}>Portfolio OS 2026</span>
            </div>
            <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#858585' }}>Production environment is actively running. Branch <span style={{color:'#ffffff'}}>main</span> deployed successfully.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #3c3c3c', paddingTop: '15px' }}>
              <span style={{ fontSize: '12px', color: '#cccccc' }}>https://portfolio.sohamkundu.dev</span>
              <span style={{ color: '#3794ff', cursor: 'pointer', fontSize: '12px' }} onClick={() => handleFileClick('system/deployments.log')}>View Logs</span>
            </div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          
          {/* Tech Stack */}
          <div className="vscode-welcome-card" style={{ backgroundColor: '#252526', border: '1px solid #3c3c3c', borderRadius: '6px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#cccccc', textTransform: 'uppercase', letterSpacing: '1px' }}>Tech Stack</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#61dafb' }}>⚛️</span> React / Next.js</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#89d185' }}>🟢</span> Node.js / Express</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#cca700' }}>🐍</span> Python / LangChain</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#3794ff' }}>📘</span> TypeScript</div>
            </div>
          </div>

          {/* Current Focus */}
          <div className="vscode-welcome-card" style={{ backgroundColor: '#252526', border: '1px solid #3c3c3c', borderRadius: '6px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#cccccc', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Focus</h3>
            <div className="vscode-focus-item" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>AI Mock Interview Platform</span>
                <span style={{ color: '#89d185', fontSize: '12px' }}>In Progress</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#3c3c3c', borderRadius: '2px' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#007acc', borderRadius: '2px' }}></div>
              </div>
            </div>
            <div className="vscode-focus-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>Portfolio OS 2026</span>
                <span style={{ color: '#cca700', fontSize: '12px' }}>Review</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#3c3c3c', borderRadius: '2px' }}>
                <div style={{ width: '95%', height: '100%', backgroundColor: '#cca700', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );

  return (
    <div className="vscode-editor-area" style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, width: '100%' }}>
      {/* Main Group */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: splitMode ? '1px solid #252526' : 'none' }} onClick={() => setActiveEditorGroup(1)}>
        {activeFile ? (
          <div className={`vscode-editor-group ${activeEditorGroup === 1 ? 'active-group' : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="vscode-tabs">
              {openFiles.map(path => (
                <div key={path} className={`vscode-tab ${activeFile === path ? 'active' : ''}`} onClick={() => { setActiveEditorGroup(1); setActiveFile(path); }}>
                  <span className="vscode-tab-icon">{getFileIcon(getFileName(path))}</span>
                  {getFileName(path)}
                  <span className="vscode-tab-close" onClick={(e) => closeFile(e, path, 1)}>
                    {dirtyFiles.includes(path) ? <span style={{ fontSize: 10, color: '#ffffff' }}>●</span> : <DismissRegular fontSize={12} />}
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
                {splitOpenFiles.map(path => (
                  <div key={path} className={`vscode-tab ${splitActiveFile === path ? 'active' : ''}`} onClick={() => { setActiveEditorGroup(2); setSplitActiveFile(path); }}>
                    <span className="vscode-tab-icon">{getFileIcon(getFileName(path))}</span>
                    {getFileName(path)}
                    <span className="vscode-tab-close" onClick={(e) => closeFile(e, path, 2)}>
                      {dirtyFiles.includes(path) ? <span style={{ fontSize: 10, color: '#ffffff' }}>●</span> : <DismissRegular fontSize={12} />}
                    </span>
                  </div>
                ))}
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
