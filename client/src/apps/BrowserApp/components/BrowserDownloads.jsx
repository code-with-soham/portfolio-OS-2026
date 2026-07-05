import React, { useState } from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { SearchRegular, DocumentPdfRegular, FolderZipRegular } from '@fluentui/react-icons';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { EmptyLayout } from '../../../components/ui/Layout';

export default function BrowserDownloads() {
  const { downloads, navigateTo } = useBrowserStore();
  const [localDownloads, setLocalDownloads] = useState(downloads);

  const handleDelete = (id) => {
    setLocalDownloads(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div style={{ padding: 'var(--ds-space-2xl) 15%', width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'var(--ds-bg-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ds-space-xl)' }}>
        <h2 style={{ margin: 0, color: 'var(--ds-text-primary)' }}>Downloads</h2>
        <Input 
          placeholder="Search downloads" 
          iconLeft={<SearchRegular />}
          style={{ width: '300px', backgroundColor: 'var(--ds-surface)' }}
        />
      </div>
      <div>
        {localDownloads.map(file => (
          <div key={file.id} style={{ marginBottom: 'var(--ds-space-xl)' }}>
            <div style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', fontWeight: '500', marginBottom: 'var(--ds-space-sm)' }}>
              {new Date(file.date).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', backgroundColor: 'var(--ds-bg-primary)', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-lg)', padding: 'var(--ds-space-lg)', gap: 'var(--ds-space-lg)' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {file.name.endsWith('.pdf') ? <DocumentPdfRegular fontSize={32} color="var(--ds-text-secondary)" /> : <FolderZipRegular fontSize={32} color="var(--ds-text-secondary)" />}
              </div>
              <div style={{ flex: 1 }}>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigateTo(file.url); }}
                  style={{ fontWeight: '500', color: 'var(--ds-accent)', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
                >
                  {file.name}
                </a>
                <div style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-text-secondary)', marginBottom: 'var(--ds-space-md)' }}>
                  {file.url} • {file.size}
                </div>
                <div style={{ display: 'flex', gap: 'var(--ds-space-md)' }}>
                  <Button variant="ghost" size="sm" onClick={() => navigateTo(file.url)}>Open</Button>
                  <Button variant="ghost" size="sm">Show in folder</Button>
                  <Button variant="ghost" size="sm" style={{ color: 'var(--ds-error)' }} onClick={() => handleDelete(file.id)}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {localDownloads.length === 0 && (
          <EmptyLayout style={{ color: 'var(--ds-text-secondary)', marginTop: '40px' }}>
            No downloads found.
          </EmptyLayout>
        )}
      </div>
    </div>
  );
}
