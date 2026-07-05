import React from 'react';
import { AddRegular } from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { TabBar, TabItem } from '../../../components/ui/TabBar';
import { ToolbarButton } from '../../../components/ui/Toolbar';

export default function BrowserTabs({ dragControls, onClose, onMinimize, onMaximize, isMaximized }) {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useBrowserStore();

  const handlePointerDown = (e) => {
    // Only start dragging if not clicking a tab or button
    if (e.target.closest('.browser-tab') || e.target.closest('button') || e.target.closest('.tab-close-btn')) {
      return;
    }
    if (dragControls && !isMaximized) {
      dragControls.start(e);
    }
  };

  return (
    <TabBar onPointerDown={handlePointerDown} onDoubleClick={() => onMaximize && onMaximize()}>
      {tabs.map(tab => (
        <div key={tab.id} className="browser-tab">
          <TabItem 
            active={tab.id === activeTabId}
            icon={tab.icon}
            title={tab.title}
            onClick={() => setActiveTab(tab.id)}
            onClose={() => closeTab(tab.id)}
          />
        </div>
      ))}
      
      <div style={{ marginLeft: '4px', marginBottom: '2px' }}>
        <ToolbarButton 
          icon={<AddRegular fontSize={16} />} 
          onClick={() => addTab()} 
          title="New Tab"
        />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', height: '100%', alignSelf: 'flex-start', marginTop: '-4px', marginRight: '-8px' }}>
        <button
          onPointerDown={(e) => { e.stopPropagation(); onMinimize && onMinimize(e); }}
          className="window-control-btn"
          title="Minimize"
          style={{ width: '46px', height: '32px', background: 'transparent', border: 'none', color: 'var(--ds-text-primary)' }}
        >
          ─
        </button>
        <button
          onPointerDown={(e) => { e.stopPropagation(); onMaximize && onMaximize(e); }}
          className="window-control-btn"
          title="Maximize"
          style={{ width: '46px', height: '32px', background: 'transparent', border: 'none', color: 'var(--ds-text-primary)' }}
        >
          {isMaximized ? '❐' : '□'}
        </button>
        <button
          onPointerDown={(e) => { e.stopPropagation(); onClose && onClose(e); }}
          className="window-control-btn close"
          title="Close"
          style={{ width: '46px', height: '32px', background: 'transparent', border: 'none', color: 'var(--ds-text-primary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#e81123'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ds-text-primary)'; }}
        >
          ✕
        </button>
      </div>
    </TabBar>
  );
}
