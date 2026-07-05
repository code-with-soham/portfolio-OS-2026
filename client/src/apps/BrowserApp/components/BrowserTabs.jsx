import React from 'react';
import { AddRegular } from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { TabBar, TabItem } from '../../../components/ui/TabBar';
import { ToolbarButton } from '../../../components/ui/Toolbar';

export default function BrowserTabs() {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useBrowserStore();

  return (
    <TabBar>
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
      
      <div style={{ marginLeft: '4px', marginBottom: '4px' }}>
        <ToolbarButton 
          icon={<AddRegular fontSize={14} />} 
          onClick={() => addTab()} 
          title="New Tab"
        />
      </div>
    </TabBar>
  );
}
