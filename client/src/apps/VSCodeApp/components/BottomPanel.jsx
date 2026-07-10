import React, { useState } from 'react';
import { DismissRegular, AddRegular, DeleteRegular } from '@fluentui/react-icons';
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
  const [terminals, setTerminals] = useState([{ id: 1, name: 'bash' }]);
  const [activeTerminalId, setActiveTerminalId] = useState(1);
  const [nextTerminalId, setNextTerminalId] = useState(2);

  const handleAddTerminal = () => {
    const newId = nextTerminalId;
    setTerminals(prev => [...prev, { id: newId, name: 'bash' }]);
    setActiveTerminalId(newId);
    setNextTerminalId(prev => prev + 1);
  };

  const handleRemoveTerminal = (e, id) => {
    e.stopPropagation();
    setTerminals(prev => {
      const newTerms = prev.filter(t => t.id !== id);
      if (newTerms.length === 0) {
        // If all closed, create a fresh one
        setActiveTerminalId(nextTerminalId);
        setNextTerminalId(n => n + 1);
        return [{ id: nextTerminalId, name: 'bash' }];
      }
      if (activeTerminalId === id) {
        setActiveTerminalId(newTerms[newTerms.length - 1].id);
      }
      return newTerms;
    });
  };

  return (
    <div style={{ display: panelVisible ? 'flex' : 'none', flexDirection: 'column' }}>
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
            <div style={{ display: 'flex', height: '100%', width: '100%' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                {terminals.map(term => (
                  <div key={term.id} style={{ display: term.id === activeTerminalId ? 'block' : 'none', height: '100%' }}>
                    <TerminalCore 
                      hideHeader={true} 
                      skipBoot={true} 
                      customPrompt="PS C:\\Projects\\Soham-Kundu>" 
                      onCommand={handleTerminalCommand} 
                      externalCommand={term.id === activeTerminalId ? terminalExternalCommand : null}
                      onExternalCommandExecuted={() => setTerminalExternalCommand(null)}
                    />
                  </div>
                ))}
              </div>
              <div style={{ width: '150px', borderLeft: '1px solid var(--vscode-panel-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--vscode-panel-border)' }}>
                  <AddRegular fontSize={14} style={{ cursor: 'pointer', color: 'var(--vscode-icon-foreground)' }} onClick={handleAddTerminal} title="New Terminal" />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {terminals.map(term => (
                    <div 
                      key={term.id} 
                      onClick={() => setActiveTerminalId(term.id)}
                      style={{ 
                        padding: '4px 8px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: term.id === activeTerminalId ? 'var(--vscode-list-activeSelectionBackground)' : 'transparent',
                        color: term.id === activeTerminalId ? 'var(--vscode-list-activeSelectionForeground)' : 'var(--vscode-descriptionForeground)',
                        fontSize: '12px'
                      }}
                    >
                      <span>{term.name}</span>
                      <DismissRegular 
                        fontSize={12} 
                        style={{ cursor: 'pointer', opacity: term.id === activeTerminalId ? 1 : 0.5 }} 
                        onClick={(e) => handleRemoveTerminal(e, term.id)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
    </div>
  );
}
