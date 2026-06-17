import React from 'react';
import { getFileIcon } from '../config/iconMap';

export default function SearchPanel({ searchQuery, setSearchQuery, fileContents, handleFileClick }) {
  const getFileName = (path) => path.split('/').pop() || path;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vscode-sidebar-title">SEARCH</div>
      <div className="vscode-search-panel">
        <input 
          type="text" 
          className="vscode-search-input" 
          placeholder="Search" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="vscode-search-results" style={{ overflowY: 'auto', flex: 1 }}>
          {searchQuery ? (
            Object.keys(fileContents)
              .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()) || fileContents[f].toLowerCase().includes(searchQuery.toLowerCase()))
              .map(f => (
                <div key={f} className="vscode-search-result-item" onClick={() => handleFileClick(f)}>
                  <div className="vscode-search-result-file">
                    <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon(getFileName(f))}</span>
                    {getFileName(f)}
                    <span style={{ marginLeft: 6, fontSize: 11, color: '#858585' }}>{f.split('/')[0]}</span>
                  </div>
                  <div className="vscode-search-result-preview">
                    {fileContents[f].substring(0, 40).replace(/[^a-zA-Z0-9 ]/g, ' ')}...
                  </div>
                </div>
              ))
          ) : <div style={{ padding: 10, fontSize: 12, color: '#858585' }}>Find in files...</div>}
        </div>
      </div>
    </div>
  );
}
