import React, { useState, useRef, useEffect } from 'react';
import { DismissRegular, DeveloperBoardRegular } from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';

export default function BrowserDevTools({ onClose }) {
  const [activeTab, setActiveTab] = useState('Console');
  const tabs = ['Elements', 'Console', 'Sources', 'Network', 'Performance', 'Application'];
  const { navigateTo } = useBrowserStore();
  
  const [consoleHistory, setConsoleHistory] = useState([
    { type: 'log', text: 'Portfolio OS Boot Sequence Initiated...' },
    { type: 'log', text: 'Loading Desktop Environment...' },
    { type: 'warn', text: 'DevTools detected: Recruiter mode active.' },
    { type: 'info', text: 'Try running: portfolio.projects(), portfolio.skills(), portfolio.resume()' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleHistory]);

  const handleConsoleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newHistory = [...consoleHistory, { type: 'input', text: `> ${inputValue}` }];
    
    let command = inputValue.trim();
    if (command === 'portfolio.projects()') {
      newHistory.push({ type: 'log', text: 'Navigating to Projects App...' });
      navigateTo('portfolio://projects');
    } else if (command === 'portfolio.skills()') {
      newHistory.push({ type: 'log', text: 'Navigating to Skills App...' });
      navigateTo('portfolio://skills');
    } else if (command === 'portfolio.about()') {
      newHistory.push({ type: 'log', text: 'Navigating to About App...' });
      navigateTo('portfolio://about');
    } else if (command === 'portfolio.resume()') {
      newHistory.push({ type: 'log', text: 'Navigating to Resume App...' });
      navigateTo('portfolio://resume');
    } else if (command === 'clear()') {
      setConsoleHistory([]);
      setInputValue('');
      return;
    } else {
      newHistory.push({ type: 'error', text: `Uncaught ReferenceError: ${command} is not defined` });
    }

    setConsoleHistory(newHistory);
    setInputValue('');
  };

  return (
    <div className="chrome-devtools">
      <div className="devtools-header">
        <div className="devtools-tabs">
          {tabs.map(t => (
            <div 
              key={t} 
              className={`devtools-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="devtools-actions">
          <button onClick={onClose}><DismissRegular /></button>
        </div>
      </div>
      <div className="devtools-content">
        {activeTab === 'Elements' && (
          <div className="devtools-panel elements-panel">
            <pre><code>
{'<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title>Portfolio OS 2026</title>\n  </head>\n  <body>\n    <div id="root">\n      <!-- App rendered here -->\n    </div>\n  </body>\n</html>'}
            </code></pre>
          </div>
        )}
        {activeTab === 'Console' && (
          <div className="devtools-panel console-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 0' }}>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 8px' }}>
              {consoleHistory.map((msg, idx) => (
                <div key={idx} className={`console-msg ${msg.type}`} style={{
                  padding: '4px 0', borderBottom: '1px solid var(--chrome-border)',
                  color: msg.type === 'error' ? '#d93025' : (msg.type === 'input' ? '#5f6368' : 'inherit'),
                  backgroundColor: msg.type === 'error' ? '#fce8e6' : (msg.type === 'warn' ? '#fffbe5' : 'transparent'),
                }}>
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleConsoleSubmit} style={{ display: 'flex', padding: '8px', borderTop: '1px solid var(--chrome-border)' }}>
              <span style={{ color: '#1a73e8', marginRight: '8px' }}>&gt;</span>
              <input 
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Consolas, monospace', fontSize: '12px', color: 'var(--chrome-text)' }}
                spellCheck={false}
              />
            </form>
          </div>
        )}
        {activeTab === 'Network' && (
          <div className="devtools-panel network-panel">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th style={{ padding: 4 }}>Name</th><th>Status</th><th>Type</th><th>Size</th><th>Time</th></tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: 4 }}>index.html</td><td>200</td><td>document</td><td>1.2 kB</td><td>12 ms</td></tr>
                <tr><td style={{ padding: 4 }}>main.jsx</td><td>200</td><td>script</td><td>4.5 MB</td><td>150 ms</td></tr>
                <tr><td style={{ padding: 4 }}>portfolio-api</td><td>200</td><td>fetch</td><td>245 B</td><td>45 ms</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'Application' && (
          <div className="devtools-panel application-panel" style={{ display: 'flex' }}>
            <div className="app-sidebar" style={{ width: 150, borderRight: '1px solid var(--chrome-border)', paddingRight: 8 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Storage</div>
              <div className="app-sidebar-item" style={{ padding: '4px 8px', background: 'var(--chrome-surface)' }}>Local Storage</div>
              <div className="app-sidebar-item" style={{ padding: '4px 8px' }}>Session Storage</div>
              <div className="app-sidebar-item" style={{ padding: '4px 8px' }}>IndexedDB</div>
            </div>
            <div className="app-content" style={{ padding: '0 16px', flex: 1 }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead><tr><th style={{ borderBottom: '1px solid var(--chrome-border)', paddingBottom: 4 }}>Key</th><th style={{ borderBottom: '1px solid var(--chrome-border)' }}>Value</th></tr></thead>
                <tbody>
                  <tr><td style={{ paddingTop: 4 }}>portfolio-os-state</td><td style={{ paddingTop: 4 }}>{`{"theme":"chrome-dark"}`}</td></tr>
                  <tr><td style={{ paddingTop: 4 }}>zustand-store</td><td style={{ paddingTop: 4 }}>[Object object]</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!['Elements', 'Console', 'Network', 'Application'].includes(activeTab) && (
          <div className="devtools-panel empty-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <DeveloperBoardRegular fontSize={48} color="var(--chrome-text-secondary)" />
            <p style={{ color: 'var(--chrome-text-secondary)' }}>{activeTab} panel is not fully mocked.</p>
          </div>
        )}
      </div>
    </div>
  );
}
