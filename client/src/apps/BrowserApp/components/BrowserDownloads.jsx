import React, { useState } from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { SearchRegular, DocumentPdfRegular, FolderZipRegular } from '@fluentui/react-icons';

export default function BrowserDownloads() {
  const { downloads, navigateTo } = useBrowserStore();
  const [localDownloads, setLocalDownloads] = useState(downloads);

  const handleDelete = (id) => {
    setLocalDownloads(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="chrome-internal-page downloads-page" style={{ padding: '24px 15%', width: '100%', overflow: 'auto' }}>
      <div className="downloads-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--chrome-text)' }}>Downloads</h2>
        <div className="downloads-search" style={{ display: 'flex', background: 'var(--chrome-bg)', border: '1px solid var(--chrome-border)', borderRadius: '8px', padding: '8px 16px', gap: '8px' }}>
          <SearchRegular color="var(--chrome-text-secondary)" />
          <input placeholder="Search downloads" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--chrome-text)' }} />
        </div>
      </div>
      <div className="downloads-content">
        {localDownloads.map(file => (
          <div key={file.id} className="download-item" style={{ marginBottom: '24px' }}>
            <div className="download-date" style={{ fontSize: '14px', color: 'var(--chrome-text-secondary)', fontWeight: 500, marginBottom: '8px' }}>
              {new Date(file.date).toLocaleDateString()}
            </div>
            <div className="download-card" style={{ display: 'flex', background: 'var(--chrome-bg)', border: '1px solid var(--chrome-border)', borderRadius: '8px', padding: '16px', gap: '16px' }}>
              <div className="download-icon" style={{ width: '48px', height: '48px', background: 'var(--chrome-surface)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {file.name.endsWith('.pdf') ? <DocumentPdfRegular fontSize={32} /> : <FolderZipRegular fontSize={32} />}
              </div>
              <div className="download-details" style={{ flex: 1 }}>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigateTo(file.url); }}
                  className="download-name" 
                  style={{ fontWeight: 500, color: '#1a73e8', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
                >
                  {file.name}
                </a>
                <div className="download-meta" style={{ fontSize: '13px', color: 'var(--chrome-text-secondary)', marginBottom: '12px' }}>
                  {file.url} • {file.size}
                </div>
                <div className="download-actions" style={{ display: 'flex', gap: '16px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0 }} onClick={() => navigateTo(file.url)}>Open</button>
                  <button style={{ background: 'transparent', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0 }}>Show in folder</button>
                  <button style={{ background: 'transparent', border: 'none', color: '#d93025', cursor: 'pointer', padding: 0 }} onClick={() => handleDelete(file.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {localDownloads.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--chrome-text-secondary)', marginTop: '40px' }}>
            No downloads found.
          </div>
        )}
      </div>
    </div>
  );
}
