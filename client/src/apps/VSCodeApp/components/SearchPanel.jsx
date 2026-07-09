import React, { useMemo } from 'react';
import { getFileIcon } from '../config/iconMap';
import { ChevronRightRegular, ChevronDownRegular } from '@fluentui/react-icons';

export default function SearchPanel({ searchQuery, setSearchQuery, fileContents, handleFileClick }) {
  const getFileName = (path) => path.split('/').pop() || path;

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];

    Object.entries(fileContents).forEach(([path, content]) => {
      const fileNameMatch = path.toLowerCase().includes(query);
      const lines = content.split('\n');
      const matchingLines = [];
      
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query)) {
          matchingLines.push({ lineNum: index + 1, text: line.trim() });
        }
      });

      if (fileNameMatch || matchingLines.length > 0) {
        results.push({
          path,
          fileNameMatch,
          matchingLines
        });
      }
    });

    return results;
  }, [searchQuery, fileContents]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vscode-sidebar-title">SEARCH</div>
      <div className="vscode-search-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '10px 0' }}>
        <div style={{ padding: '0 10px', marginBottom: '10px' }}>
          <input 
            type="text" 
            className="vscode-search-input" 
            placeholder="Search" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'var(--vscode-input-background)', 
              color: 'var(--vscode-input-foreground)', 
              border: '1px solid var(--vscode-input-border)', 
              padding: '4px 6px',
              outline: 'none'
            }}
          />
        </div>
        <div className="vscode-search-results" style={{ overflowY: 'auto', flex: 1 }}>
          {searchQuery ? (
            searchResults.length > 0 ? (
              searchResults.map(result => (
                <div key={result.path} className="vscode-search-result-group">
                  <div 
                    className="vscode-search-result-file" 
                    onClick={() => handleFileClick(result.path)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '4px 10px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: 'var(--vscode-list-activeSelectionForeground)'
                    }}
                  >
                    <ChevronDownRegular fontSize={12} style={{ marginRight: '4px' }} />
                    <span style={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>{getFileIcon(getFileName(result.path))}</span>
                    {getFileName(result.path)}
                    <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--vscode-descriptionForeground)' }}>{result.path.split('/')[0]}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 10 }}>
                      {result.matchingLines.length}
                    </span>
                  </div>
                  {result.matchingLines.map((match, i) => (
                    <div 
                      key={`${result.path}-${match.lineNum}-${i}`} 
                      className="vscode-search-result-match"
                      onClick={() => handleFileClick(result.path)}
                      style={{ 
                        padding: '2px 10px 2px 34px', 
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'var(--vscode-descriptionForeground)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={match.text}
                    >
                      {match.text}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div style={{ padding: '0 10px', fontSize: 12, color: 'var(--vscode-descriptionForeground)' }}>No results found.</div>
            )
          ) : (
            <div style={{ padding: '0 10px', fontSize: 12, color: 'var(--vscode-descriptionForeground)' }}>Find in files...</div>
          )}
        </div>
      </div>
    </div>
  );
}
