import React, { useState, useEffect, useRef } from 'react';
import {
  DocumentMultipleRegular,
  SearchRegular,
  BranchRegular,
  PlayRegular,
  PuzzlePieceRegular,
  SettingsRegular,
  BotRegular,
  CheckmarkRegular
} from '@fluentui/react-icons';
import myPhoto from '../../../assets/icons/logos/myPhoto.jpg';
import { useDesktopStore } from '../../../store/useDesktopStore';
import { useWindowStore } from '../../../store/useWindowStore';
import { useNotificationStore } from '../../../store/useNotificationStore';

export default function ActivityBar({ sidebarView, setSidebarView }) {
  const [pulsing, setPulsing] = useState(true);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  const accountMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);

  const toggleCommandPalette = useDesktopStore(s => s.toggleCommandPalette);
  const openWindow = useWindowStore(s => s.openWindow);
  const addNotification = useNotificationStore(s => s.addNotification);

  // Pulse badge on first render to draw attention
  useEffect(() => {
    const timer = setTimeout(() => setPulsing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    if (showAccountMenu || showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu, showSettingsMenu]);

  const topItems = [
    { id: 'explorer', icon: <DocumentMultipleRegular />, label: 'Explorer (Ctrl+Shift+E)' },
    { id: 'search', icon: <SearchRegular />, label: 'Search (Ctrl+Shift+F)' },
    { id: 'copilot', icon: <BotRegular />, label: 'GitHub Copilot' },
    { id: 'git', icon: <BranchRegular />, label: 'Source Control (Ctrl+Shift+G)', badge: 3 },
    { id: 'debug', icon: <PlayRegular />, label: 'Run and Debug (Ctrl+Shift+D)' },
    { id: 'extensions', icon: <PuzzlePieceRegular />, label: 'Extensions (Ctrl+Shift+X)', badge: 1 },
  ];

  const bottomItems = [
    { id: 'accounts', icon: <img src={myPhoto} alt="Account" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />, label: 'Accounts' },
    { id: 'settings', icon: <SettingsRegular />, label: 'Manage' },
  ];

  const handleItemClick = (item) => {
    if (item.id === 'accounts') {
      setShowAccountMenu(!showAccountMenu);
      setShowSettingsMenu(false);
    } else if (item.id === 'settings') {
      setShowSettingsMenu(!showSettingsMenu);
      setShowAccountMenu(false);
    } else {
      setSidebarView(item.id);
      setShowAccountMenu(false);
      setShowSettingsMenu(false);
    }
  };

  const menuStyle = {
    position: 'absolute',
    bottom: '0',
    left: '100%',
    marginLeft: '15px',
    backgroundColor: '#252526',
    border: '1px solid #454545',
    borderRadius: '5px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
    width: '280px',
    zIndex: 1000,
    cursor: 'default',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column'
  };

  const menuItemStyle = {
    padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '13px', cursor: 'pointer'
  };

  const renderItem = (item) => (
    <div 
      key={item.id}
      className={`vscode-activity-icon ${(sidebarView === item.id && item.id !== 'accounts' && item.id !== 'settings') ? 'active' : ''}`}
      data-tooltip={item.label}
      onClick={() => handleItemClick(item)}
      style={{ position: 'relative' }}
    >
      {item.icon}
      {item.badge && (
        <div className={`vscode-activity-badge ${pulsing ? 'pulse-anim' : ''}`}>
          {item.badge}
        </div>
      )}
      
      {/* Account Menu */}
      {item.id === 'accounts' && showAccountMenu && (
        <div ref={accountMenuRef} style={menuStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #333' }}>
            <img src={myPhoto} alt="Soham" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>Soham Kundu (GitHub)</span>
              <span style={{ color: '#ccc', fontSize: '12px' }}>code-with-soham</span>
            </div>
          </div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
            <div className="account-menu-item" style={menuItemStyle}><CheckmarkRegular style={{ width: 16 }} /> Settings Sync is On</div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowAccountMenu(false); addNotification('Export Profile', 'Your VS Code profile has been exported successfully.', 'system'); }}><div style={{ width: 16 }}></div> Export Profile...</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowAccountMenu(false); addNotification('Extensions', 'You currently have no untrusted workspace extensions.', 'system'); }}><div style={{ width: 16 }}></div> Manage Trusted Extensions</div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowAccountMenu(false); addNotification('Settings Sync', 'Settings sync has been paused.', 'system'); }}><div style={{ width: 16 }}></div> Turn Off Settings Sync...</div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowAccountMenu(false); addNotification('GitHub Sync', 'You have been signed out of GitHub.', 'system'); }}><div style={{ width: 16 }}></div> Sign Out</div>
          </div>
        </div>
      )}

      {/* Settings Menu */}
      {item.id === 'settings' && showSettingsMenu && (
        <div ref={settingsMenuRef} style={menuStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); toggleCommandPalette(); }}>
              <div style={{ width: 16 }}></div> Command Palette...
              <span style={{ marginLeft: 'auto', color: '#888', fontSize: '12px' }}>Ctrl+Shift+P</span>
            </div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); openWindow('settings'); }}>
              <div style={{ width: 16 }}></div> Settings
              <span style={{ marginLeft: 'auto', color: '#888', fontSize: '12px' }}>Ctrl+,</span>
            </div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); handleItemClick({ id: 'extensions' }); }}>
              <div style={{ width: 16 }}></div> Extensions
              <span style={{ marginLeft: 'auto', color: '#888', fontSize: '12px' }}>Ctrl+Shift+X</span>
            </div>
          </div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); addNotification('Keyboard Shortcuts', 'Press Ctrl+K Ctrl+S to edit shortcuts (Mocked for OS).', 'system'); }}><div style={{ width: 16 }}></div> Keyboard Shortcuts</div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); addNotification('User Snippets', 'User snippets are synced via Portfolio OS backend.', 'system'); }}><div style={{ width: 16 }}></div> User Snippets</div>
          </div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); addNotification('Color Theme', 'Portfolio OS enforces the signature dark theme globally.', 'system'); }}><div style={{ width: 16 }}></div> Color Theme</div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); addNotification('Icon Theme', 'Material Icon Theme is currently active.', 'system'); }}><div style={{ width: 16 }}></div> File Icon Theme</div>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); addNotification('Product Icon Theme', 'Default Product Icons are active.', 'system'); }}><div style={{ width: 16 }}></div> Product Icon Theme</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div className="account-menu-item" style={menuItemStyle} onClick={() => { setShowSettingsMenu(false); addNotification('VS Code Updates', 'You are running the latest version of VS Code.', 'system'); }}><div style={{ width: 16 }}></div> Check for Updates...</div>
          </div>
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
