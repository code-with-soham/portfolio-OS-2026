import React, { useState, useEffect } from 'react';
import {
  DocumentMultipleRegular,
  SearchRegular,
  BranchRegular,
  PlayRegular,
  PuzzlePieceRegular,
  PersonRegular,
  SettingsRegular,
  BotRegular
} from '@fluentui/react-icons';

export default function ActivityBar({ sidebarView, setSidebarView }) {
  const [pulsing, setPulsing] = useState(true);

  // Pulse badge on first render to draw attention
  useEffect(() => {
    const timer = setTimeout(() => setPulsing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const topItems = [
    { id: 'explorer', icon: <DocumentMultipleRegular />, label: 'Explorer (Ctrl+Shift+E)' },
    { id: 'search', icon: <SearchRegular />, label: 'Search (Ctrl+Shift+F)' },
    { id: 'copilot', icon: <BotRegular />, label: 'GitHub Copilot' },
    { id: 'git', icon: <BranchRegular />, label: 'Source Control (Ctrl+Shift+G)', badge: 3 },
    { id: 'debug', icon: <PlayRegular />, label: 'Run and Debug (Ctrl+Shift+D)' },
    { id: 'extensions', icon: <PuzzlePieceRegular />, label: 'Extensions (Ctrl+Shift+X)', badge: 1 },
  ];

  const bottomItems = [
    { id: 'accounts', icon: <PersonRegular />, label: 'Accounts' },
    { id: 'settings', icon: <SettingsRegular />, label: 'Manage' },
  ];

  const renderItem = (item) => (
    <div 
      key={item.id}
      className={`vscode-activity-icon ${sidebarView === item.id ? 'active' : ''}`}
      data-tooltip={item.label}
      onClick={() => setSidebarView(item.id)}
    >
      {item.icon}
      {item.badge && (
        <div className={`vscode-activity-badge ${pulsing ? 'pulse-anim' : ''}`}>
          {item.badge}
        </div>
      )}
    </div>
  );

  return (
    <div className="vscode-activity-bar">
      <div className="vscode-activity-top">
        {topItems.map(renderItem)}
      </div>
      <div className="vscode-activity-bottom">
        {bottomItems.map(renderItem)}
      </div>
    </div>
  );
}
