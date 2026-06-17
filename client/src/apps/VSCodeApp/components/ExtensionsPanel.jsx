import React from 'react';
import { ChevronDownRegular, PuzzlePieceRegular } from '@fluentui/react-icons';

export default function ExtensionsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vscode-sidebar-title">EXTENSIONS</div>
      <div className="vscode-search-panel" style={{ paddingBottom: 0 }}>
        <input type="text" className="vscode-search-input" placeholder="Search Extensions in Marketplace" />
      </div>
      <div className="vscode-sidebar-section" style={{ marginTop: 10, overflowY: 'auto', flex: 1 }}>
        <div className="vscode-section-header">
          <ChevronDownRegular fontSize={12} />
          <span style={{ fontWeight: 600 }}>RECOMMENDED</span>
        </div>
        <div className="vscode-sidebar-list">
          <div className="vscode-extension-item">
            <div className="vscode-extension-icon" style={{ backgroundColor: '#007acc' }}><PuzzlePieceRegular color="#fff" /></div>
            <div className="vscode-extension-details">
              <span className="vscode-extension-name">Portfolio OS Toolkit</span>
              <span style={{ fontSize: 11, color: '#858585', margin: '2px 0' }}>Portfolio developer tools</span>
              <span className="vscode-extension-author">Soham Kundu</span>
            </div>
            <span className="vscode-extension-badge" style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#007acc', color: '#fff', borderRadius: 2 }}>Installed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
