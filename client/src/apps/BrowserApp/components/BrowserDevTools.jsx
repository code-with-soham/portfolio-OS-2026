import React, { useState, useRef, useEffect } from 'react';
import { DismissRegular, DeveloperBoardRegular } from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { Button } from '../../../components/ui/Button';
import { EmptyLayout } from '../../../components/ui/Layout';

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--ds-bg-primary)', borderLeft: '1px solid var(--ds-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ds-border)', paddingRight: 'var(--ds-space-sm)', backgroundColor: 'var(--ds-surface)' }}>
        <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {tabs.map(t => (
            <div 
              key={t} 
              style={{
                padding: 'var(--ds-space-sm) var(--ds-space-md)',
                fontSize: 'var(--ds-text-xs)',
                fontWeight: activeTab === t ? '500' : '400',
                color: activeTab === t ? 'var(--ds-accent)' : 'var(--ds-text-secondary)',
                borderBottom: activeTab === t ? '2px solid var(--ds-accent)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color var(--ds-duration-fast), border-bottom var(--ds-duration-fast)'
              }}
              onMouseEnter={(e) => { if (activeTab !== t) e.currentTarget.style.color = 'var(--ds-text-primary)' }}
              onMouseLeave={(e) => { if (activeTab !== t) e.currentTarget.style.color = 'var(--ds-text-secondary)' }}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </div>
          ))}
        </div>
        <div>
          <Button variant="ghost" size="icon" onClick={onClose}><DismissRegular fontSize={14} /></Button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {activeTab === 'Elements' && (
          <div style={{ padding: 'var(--ds-space-md)', height: '100%', overflow: 'auto', fontFamily: 'Consolas, monospace', fontSize: 'var(--ds-text-xs)', color: 'var(--ds-text-primary)' }}>
            <pre style={{ margin: 0 }}><code>
{'<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title>Portfolio OS 2026</title>\n  </head>\n  <body>\n    <div id="root">\n      <!-- App rendered here -->\n    </div>\n  </body>\n</html>'}
            </code></pre>
          </div>
        )}
        {activeTab === 'Console' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 var(--ds-space-sm)' }}>
              {consoleHistory.map((msg, idx) => (
                <div key={idx} style={{
                  padding: 'var(--ds-space-xs) 0',
                  borderBottom: '1px solid var(--ds-border)',
                  fontFamily: 'Consolas, monospace',
                  fontSize: 'var(--ds-text-xs)',
                  color: msg.type === 'error' ? 'var(--ds-error)' : (msg.type === 'input' ? 'var(--ds-text-secondary)' : 'var(--ds-text-primary)'),
                  backgroundColor: msg.type === 'error' ? 'rgba(217, 48, 37, 0.1)' : (msg.type === 'warn' ? 'rgba(249, 171, 0, 0.1)' : 'transparent'),
                }}>
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleConsoleSubmit} style={{ display: 'flex', padding: 'var(--ds-space-sm)', borderTop: '1px solid var(--ds-border)' }}>
              <span style={{ color: 'var(--ds-accent)', marginRight: 'var(--ds-space-sm)' }}>&gt;</span>
              <input 
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Consolas, monospace', fontSize: 'var(--ds-text-xs)', color: 'var(--ds-text-primary)' }}
                spellCheck={false}
              />
            </form>
          </div>
        )}
        {activeTab === 'Network' && (
          <div style={{ padding: 'var(--ds-space-md)', height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 'var(--ds-text-xs)' }}>
              <thead>
                <tr><th style={{ padding: 4, borderBottom: '1px solid var(--ds-border)' }}>Name</th><th style={{ borderBottom: '1px solid var(--ds-border)' }}>Status</th><th style={{ borderBottom: '1px solid var(--ds-border)' }}>Type</th><th style={{ borderBottom: '1px solid var(--ds-border)' }}>Size</th><th style={{ borderBottom: '1px solid var(--ds-border)' }}>Time</th></tr>
              </thead>
              <tbody style={{ color: 'var(--ds-text-secondary)' }}>
                <tr><td style={{ padding: 4 }}>index.html</td><td>200</td><td>document</td><td>1.2 kB</td><td>12 ms</td></tr>
                <tr><td style={{ padding: 4 }}>main.jsx</td><td>200</td><td>script</td><td>4.5 MB</td><td>150 ms</td></tr>
                <tr><td style={{ padding: 4 }}>portfolio-api</td><td>200</td><td>fetch</td><td>245 B</td><td>45 ms</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'Application' && (
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 150, borderRight: '1px solid var(--ds-border)', padding: 'var(--ds-space-md)', fontSize: 'var(--ds-text-xs)' }}>
              <div style={{ fontWeight: 500, marginBottom: 'var(--ds-space-sm)', color: 'var(--ds-text-primary)' }}>Storage</div>
              <div style={{ padding: 'var(--ds-space-xs)', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-sm)', color: 'var(--ds-text-primary)', cursor: 'pointer' }}>Local Storage</div>
              <div style={{ padding: 'var(--ds-space-xs)', color: 'var(--ds-text-secondary)', cursor: 'pointer' }}>Session Storage</div>
              <div style={{ padding: 'var(--ds-space-xs)', color: 'var(--ds-text-secondary)', cursor: 'pointer' }}>IndexedDB</div>
            </div>
            <div style={{ padding: 'var(--ds-space-md)', flex: 1, overflow: 'auto', fontSize: 'var(--ds-text-xs)' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead><tr><th style={{ borderBottom: '1px solid var(--ds-border)', paddingBottom: 4, color: 'var(--ds-text-primary)' }}>Key</th><th style={{ borderBottom: '1px solid var(--ds-border)', color: 'var(--ds-text-primary)' }}>Value</th></tr></thead>
                <tbody style={{ color: 'var(--ds-text-secondary)', fontFamily: 'Consolas, monospace' }}>
                  <tr><td style={{ paddingTop: 8 }}>portfolio-os-state</td><td style={{ paddingTop: 8 }}>{`{"theme":"dark"}`}</td></tr>
                  <tr><td style={{ paddingTop: 4 }}>zustand-store</td><td style={{ paddingTop: 4 }}>[Object object]</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!['Elements', 'Console', 'Network', 'Application'].includes(activeTab) && (
          <EmptyLayout style={{ flexDirection: 'column', gap: 'var(--ds-space-md)' }}>
            <DeveloperBoardRegular fontSize={48} color="var(--ds-text-secondary)" />
            <p style={{ color: 'var(--ds-text-secondary)' }}>{activeTab} panel is not fully mocked.</p>
          </EmptyLayout>
        )}
      </div>
    </div>
  );
}
