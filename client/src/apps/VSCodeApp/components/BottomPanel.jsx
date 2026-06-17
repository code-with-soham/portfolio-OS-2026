import React from 'react';
import { DismissRegular } from '@fluentui/react-icons';
import TerminalCore from '../../../components/system/TerminalCore';

export default function BottomPanel({
  panelVisible,
  setPanelVisible,
  panelHeight,
  setPanelHeight,
  setIsDragging,
  activeBottomPanel,
  setActiveBottomPanel,
  handleTerminalCommand,
  handleFileClick,
  terminalExternalCommand,
  setTerminalExternalCommand
}) {
  if (!panelVisible) return null;

  return (
    <>
      <div 
        className="vscode-panel-resizer" 
        onMouseDown={() => setIsDragging(true)}
      ></div>
      <div className="vscode-panel" style={{ height: panelHeight }}>
        <div className="vscode-panel-header">
          <div className="vscode-panel-tabs">
            {['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL', 'PORTS'].map(tab => (
              <div 
                key={tab} 
                className={`vscode-panel-tab ${activeBottomPanel === tab ? 'active' : ''}`}
                onClick={() => setActiveBottomPanel(tab)}
              >
                {tab === 'PROBLEMS' ? 'PROBLEMS (2)' : tab}
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
            <TerminalCore 
              hideHeader={true} 
              skipBoot={true} 
              customPrompt="PS C:\\Projects\\Soham-Kundu>" 
              onCommand={handleTerminalCommand} 
              externalCommand={terminalExternalCommand}
              onExternalCommandExecuted={() => setTerminalExternalCommand(null)}
            />
          ) : activeBottomPanel === 'PROBLEMS' ? (
            <div style={{ padding: '10px 20px', color: '#cccccc', fontSize: '13px', fontFamily: 'Consolas, monospace', height: '100%', overflowY: 'auto' }}>
              <div 
                style={{ marginBottom: '8px', cursor: 'pointer' }} 
                onClick={() => handleFileClick('about/README.md')}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ color: '#cca700' }}>⚠</span> <span style={{ color: '#cca700' }}>Warning</span>: Missing alt text for image. <span style={{ color: '#858585', textDecoration: 'underline' }}>about/README.md [Line 45]</span>
              </div>
              <div 
                style={{ marginBottom: '8px', cursor: 'pointer' }} 
                onClick={() => handleFileClick('skills/skills.yml')}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ color: '#cca700' }}>⚠</span> <span style={{ color: '#cca700' }}>Warning</span>: Unused property 'developer_name'. <span style={{ color: '#858585', textDecoration: 'underline' }}>skills/skills.yml [Line 2]</span>
              </div>
            </div>
          ) : activeBottomPanel === 'OUTPUT' ? (
            <div style={{ padding: '10px 20px', color: '#cccccc', fontSize: '13px', fontFamily: 'Consolas, monospace', height: '100%', overflowY: 'auto' }}>
              [Output channel: Portfolio OS Build]<br/><br/>
              Done in 0.00s.
            </div>
          ) : activeBottomPanel === 'DEBUG CONSOLE' ? (
            <div style={{ padding: '10px 20px', color: '#cccccc', fontSize: '13px', fontFamily: 'Consolas, monospace', height: '100%', overflowY: 'auto' }}>
              Debugger attached.<br/>
              <span style={{ color: '#3794ff' }}>Waiting for connection...</span>
            </div>
          ) : (
            <div style={{ padding: '10px 20px', color: '#858585', fontSize: '13px' }}>
              No ports are currently forwarded.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
