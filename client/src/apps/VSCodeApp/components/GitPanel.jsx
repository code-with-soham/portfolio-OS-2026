import React, { useState } from 'react';
import { ChevronDownRegular, ChevronRightRegular, ArrowCircleUpRegular } from '@fluentui/react-icons';
import { getFileIcon } from '../config/iconMap';

export default function GitPanel({ handleFileClick }) {
  const [expanded, setExpanded] = useState({
    staged: true,
    changes: true,
    commits: true,
    branches: true
  });

  const toggle = (sec) => setExpanded(p => ({ ...p, [sec]: !p[sec] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <div className="vscode-sidebar-title">SOURCE CONTROL</div>
      
      {/* Input */}
      <div className="vscode-git-input-container" style={{ padding: '10px' }}>
        <input 
          type="text" 
          className="vscode-git-input" 
          placeholder="Message (Ctrl+Enter to commit)" 
          style={{ width: '100%', padding: '6px', backgroundColor: '#3c3c3c', border: '1px solid #454545', color: '#ccc', outline: 'none' }} 
        />
        <button 
          className="vscode-git-button"
          style={{ width: '100%', padding: '6px', marginTop: '6px', backgroundColor: '#007acc', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          ✔ Commit
        </button>
      </div>

      {/* Staged Changes */}
      <div className="vscode-sidebar-section">
        <div className="vscode-section-header" onClick={() => toggle('staged')} style={{ cursor: 'pointer' }}>
          {expanded.staged ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
          <span style={{ fontWeight: 600 }}>STAGED CHANGES</span>
        </div>
        {expanded.staged && (
          <div className="vscode-sidebar-list">
            <div className="vscode-sidebar-list-item" onClick={() => handleFileClick('about/README.md')}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon('README.md')}</span> README.md
              <span className="vscode-badge-m" style={{ marginLeft: 'auto', paddingRight: '10px' }}>M</span>
            </div>
          </div>
        )}
      </div>

      {/* Changes */}
      <div className="vscode-sidebar-section">
        <div className="vscode-section-header" onClick={() => toggle('changes')} style={{ cursor: 'pointer' }}>
          {expanded.changes ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
          <span style={{ fontWeight: 600 }}>CHANGES</span>
        </div>
        {expanded.changes && (
          <div className="vscode-sidebar-list">
            <div className="vscode-sidebar-list-item" onClick={() => handleFileClick('skills/skills.yml')}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon('skills.yml')}</span> skills.yml
              <span className="vscode-badge-m" style={{ marginLeft: 'auto', paddingRight: '10px' }}>M</span>
            </div>
            <div className="vscode-sidebar-list-item" onClick={() => handleFileClick('research/research.ipynb')}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon('research.ipynb')}</span> research.ipynb
              <span className="vscode-badge-a" style={{ marginLeft: 'auto', paddingRight: '10px' }}>A</span>
            </div>
          </div>
        )}
      </div>

      {/* Commits */}
      <div className="vscode-sidebar-section">
        <div className="vscode-section-header" onClick={() => toggle('commits')} style={{ cursor: 'pointer', justifyContent: 'space-between', paddingRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {expanded.commits ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
            <span style={{ fontWeight: 600 }}>COMMITS</span>
          </div>
          <ArrowCircleUpRegular fontSize={14} style={{ color: '#858585' }} title="Push Commits" />
        </div>
        {expanded.commits && (
          <div className="vscode-sidebar-list" style={{ padding: '5px 10px 5px 24px', fontSize: '13px', color: '#cccccc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
              <span style={{ color: '#cca700' }}>f59da40</span>
              <span style={{ color: '#858585', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Implement VS Code Feature</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
              <span style={{ color: '#cca700' }}>2abf114</span>
              <span style={{ color: '#858585', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Add Recruiter Dashboard</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
              <span style={{ color: '#cca700' }}>9df8122</span>
              <span style={{ color: '#858585', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Fix Window Manager</span>
            </div>
          </div>
        )}
      </div>

      {/* Branches */}
      <div className="vscode-sidebar-section">
        <div className="vscode-section-header" onClick={() => toggle('branches')} style={{ cursor: 'pointer' }}>
          {expanded.branches ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
          <span style={{ fontWeight: 600 }}>BRANCHES</span>
        </div>
        {expanded.branches && (
          <div className="vscode-sidebar-list" style={{ paddingLeft: '10px' }}>
            <div className="vscode-sidebar-list-item" style={{ paddingLeft: '10px' }}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center', color: '#89d185' }}>&#9084;</span> 
              <span style={{ color: '#89d185' }}>main</span>
            </div>
            <div className="vscode-sidebar-list-item" style={{ paddingLeft: '10px' }}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center', color: '#858585' }}>&#9084;</span> 
              feat/vscode-ui
            </div>
            <div className="vscode-sidebar-list-item" style={{ paddingLeft: '10px' }}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center', color: '#858585' }}>&#9084;</span> 
              feat/recruiter-dashboard
            </div>
            <div className="vscode-sidebar-list-item" style={{ paddingLeft: '10px' }}>
              <span style={{ marginRight: 6, display: 'flex', alignItems: 'center', color: '#858585' }}>&#9084;</span> 
              fix/terminal-layout
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
