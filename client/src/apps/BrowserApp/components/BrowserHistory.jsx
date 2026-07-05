import React, { useState } from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { SearchRegular, HistoryRegular, DeleteRegular, MoreVerticalRegular } from '@fluentui/react-icons';
import { SplitView, SplitPane, Sidebar, EmptyLayout } from '../../../components/ui/Layout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function BrowserHistory() {
  const { history, clearHistory, navigateTo } = useBrowserStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <SplitView style={{ backgroundColor: 'var(--ds-bg-primary)', height: '100%' }}>
      <Sidebar width={280} style={{ padding: 'var(--ds-space-lg) 0', borderRight: '1px solid var(--ds-border)' }}>
        <h3 style={{ padding: '0 var(--ds-space-xl)', marginBottom: 'var(--ds-space-md)', fontSize: 'var(--ds-text-lg)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HistoryRegular /> History
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ padding: 'var(--ds-space-md) var(--ds-space-xl)', backgroundColor: 'var(--ds-surface-hover)', color: 'var(--ds-accent)', fontWeight: '500', cursor: 'pointer' }}>Chrome history</div>
          <div style={{ padding: 'var(--ds-space-md) var(--ds-space-xl)', color: 'var(--ds-text-primary)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ds-surface)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Tabs from other devices</div>
          
          <div 
            onClick={clearHistory}
            style={{ marginTop: '24px', padding: 'var(--ds-space-md) var(--ds-space-xl)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ds-text-secondary)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ds-surface)'} 
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <DeleteRegular /> Clear browsing data
          </div>
        </div>
      </Sidebar>

      <SplitPane style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: 'var(--ds-space-xl)', borderBottom: '1px solid var(--ds-border)', display: 'flex', justifyContent: 'center' }}>
          <Input 
            placeholder="Search history" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            iconLeft={<SearchRegular />}
            style={{ width: '100%', maxWidth: '600px', borderRadius: '100px', backgroundColor: 'var(--ds-surface)' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--ds-space-xl)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {Object.entries(groupedHistory).length === 0 ? (
              <EmptyLayout style={{ color: 'var(--ds-text-secondary)' }}>Your browsing history appears here</EmptyLayout>
            ) : (
              Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} style={{ marginBottom: 'var(--ds-space-2xl)' }}>
                  <div style={{ fontSize: 'var(--ds-text-sm)', fontWeight: '500', color: 'var(--ds-text-secondary)', marginBottom: 'var(--ds-space-md)' }}>{date}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)', padding: 'var(--ds-space-xs)', border: '1px solid var(--ds-border)' }}>
                    {items.map((item, idx) => {
                      const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <div 
                          key={idx} 
                          onClick={() => navigateTo(item.url)}
                          style={{ 
                            display: 'flex', alignItems: 'center', padding: 'var(--ds-space-sm) var(--ds-space-md)', 
                            gap: 'var(--ds-space-md)', cursor: 'pointer', borderRadius: 'var(--ds-radius-md)',
                            transition: 'background-color var(--ds-duration-fast)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ds-surface-hover)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ width: '60px', color: 'var(--ds-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>{time}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', backgroundColor: 'var(--ds-bg-primary)', borderRadius: '4px' }}>
                            {item.url.startsWith('https://') ? '🔒' : '🌐'}
                          </div>
                          <div style={{ flex: 1, display: 'flex', gap: 'var(--ds-space-sm)', overflow: 'hidden' }}>
                            <span style={{ fontWeight: '500', color: 'var(--ds-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.title}</span>
                            <span style={{ color: 'var(--ds-text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.url}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreVerticalRegular />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SplitPane>
    </SplitView>
  );
}
