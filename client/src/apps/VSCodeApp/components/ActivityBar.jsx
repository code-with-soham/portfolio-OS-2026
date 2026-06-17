import React from 'react';
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
  return (
    <div className="vscode-activity-bar">
      <div className="vscode-activity-top">
        <div className={`vscode-activity-icon ${sidebarView === 'explorer' ? 'active' : ''}`} title="Explorer (Ctrl+Shift+E)" onClick={() => setSidebarView('explorer')}><DocumentMultipleRegular /></div>
        <div className={`vscode-activity-icon ${sidebarView === 'search' ? 'active' : ''}`} title="Search (Ctrl+Shift+F)" onClick={() => setSidebarView('search')}><SearchRegular /></div>
        <div className={`vscode-activity-icon ${sidebarView === 'copilot' ? 'active' : ''}`} title="GitHub Copilot" onClick={() => setSidebarView('copilot')}><BotRegular /></div>
        <div className={`vscode-activity-icon ${sidebarView === 'git' ? 'active' : ''}`} title="Source Control (Ctrl+Shift+G)" onClick={() => setSidebarView('git')} style={{ position: 'relative' }}>
          <BranchRegular />
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#007fd4', color: 'white', fontSize: 9, borderRadius: 10, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
        </div>
        <div className={`vscode-activity-icon ${sidebarView === 'debug' ? 'active' : ''}`} title="Run and Debug (Ctrl+Shift+D)" onClick={() => setSidebarView('debug')}><PlayRegular /></div>
        <div className={`vscode-activity-icon ${sidebarView === 'extensions' ? 'active' : ''}`} title="Extensions (Ctrl+Shift+X)" onClick={() => setSidebarView('extensions')} style={{ position: 'relative' }}>
          <PuzzlePieceRegular />
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#007fd4', color: 'white', fontSize: 9, borderRadius: 10, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
        </div>
      </div>
      <div className="vscode-activity-bottom">
        <div className={`vscode-activity-icon ${sidebarView === 'accounts' ? 'active' : ''}`} title="Accounts" onClick={() => setSidebarView('accounts')}><PersonRegular /></div>
        <div className={`vscode-activity-icon ${sidebarView === 'settings' ? 'active' : ''}`} title="Manage" onClick={() => setSidebarView('settings')}><SettingsRegular /></div>
      </div>
    </div>
  );
}
