import React from 'react';
import { SplitView, SplitPane, Sidebar } from '../../../components/ui/Layout';
import { Card } from '../../../components/ui/Card';
import { Toggle } from '../../../components/ui/Toggle';
import { Select } from '../../../components/ui/Select';

export default function BrowserSettings() {
  const menuItems = [
    { id: 'you', label: 'You and Google' },
    { id: 'autofill', label: 'Autofill and passwords' },
    { id: 'privacy', label: 'Privacy and security' },
    { id: 'performance', label: 'Performance' },
    { id: 'appearance', label: 'Appearance', active: true },
    { id: 'search', label: 'Search engine' },
    { id: 'default', label: 'Default browser' },
    { id: 'downloads', label: 'Downloads' },
  ];

  return (
    <SplitView style={{ backgroundColor: 'var(--ds-bg-primary)', height: '100%' }}>
      <Sidebar width={280} style={{ padding: 'var(--ds-space-lg) 0', borderRight: '1px solid var(--ds-border)' }}>
        <h3 style={{ padding: '0 var(--ds-space-xl)', marginBottom: 'var(--ds-space-md)', fontSize: 'var(--ds-text-lg)', fontWeight: '600' }}>Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {menuItems.map(item => (
            <div 
              key={item.id} 
              style={{
                padding: 'var(--ds-space-md) var(--ds-space-xl)',
                cursor: 'pointer',
                backgroundColor: item.active ? 'var(--ds-surface-hover)' : 'transparent',
                color: item.active ? 'var(--ds-accent)' : 'var(--ds-text-primary)',
                fontWeight: item.active ? '500' : '400',
                transition: 'background-color var(--ds-duration-fast)'
              }}
              onMouseEnter={(e) => !item.active && (e.currentTarget.style.backgroundColor = 'var(--ds-surface)')}
              onMouseLeave={(e) => !item.active && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item.label}
            </div>
          ))}
        </div>
      </Sidebar>
      <SplitPane style={{ padding: 'var(--ds-space-2xl)', overflowY: 'auto' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: '600', marginBottom: 'var(--ds-space-md)' }}>Appearance</h2>
          <Card style={{ marginBottom: 'var(--ds-space-xl)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--ds-space-lg)', borderBottom: '1px solid var(--ds-border)' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Theme</div>
                <div style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)' }}>Portfolio Chrome Dark Mode</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--ds-space-lg)' }}>
              <div style={{ fontWeight: '500' }}>Show bookmarks bar</div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </Card>

          <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: '600', marginBottom: 'var(--ds-space-md)' }}>Search engine</h2>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--ds-space-lg)' }}>
              <div style={{ fontWeight: '500' }}>Search engine used in the address bar</div>
              <Select defaultValue="portfolio" style={{ width: '200px' }}>
                <option value="google">Google</option>
                <option value="portfolio">Portfolio AI</option>
                <option value="bing">Bing</option>
              </Select>
            </div>
          </Card>
          
        </div>
      </SplitPane>
    </SplitView>
  );
}
