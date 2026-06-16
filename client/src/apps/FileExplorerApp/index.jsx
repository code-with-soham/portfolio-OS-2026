// ============================================
// Portfolio OS 2026 — File Explorer App
// ============================================
// Virtual file system browser with breadcrumb navigation,
// sidebar quick access, and file/folder grid.

import { useState, useCallback } from 'react';
import { FILE_SYSTEM, resolveNode } from '../../data/fileSystem';
import { useWindowStore } from '../../store/useWindowStore';
import {
  FolderRegular,
  DocumentRegular,
  DocumentPdfRegular,
  ImageRegular,
  CodeRegular,
  DesktopRegular,
  TrophyRegular,
  RibbonRegular,
  ArrowLeftRegular,
  HomeRegular,
  ChevronRightRegular,
  BoxRegular,
  FolderOpenRegular
} from '@fluentui/react-icons';
import './FileExplorerApp.css';

import driverCIco from '../../assets/icons/system/driver-c.ico';
import driverDIco from '../../assets/icons/system/driver-d.ico';
import folderOpenIco from '../../assets/icons/system/Folder Open.ico';

/**
 * Sidebar quick access items
 */
const QUICK_ACCESS = [
  { name: 'This PC', path: ['This PC'], icon: <DesktopRegular fontSize={16} /> },
  { name: 'Desktop', path: ['Desktop'], icon: <DesktopRegular fontSize={16} /> },
  { name: 'Projects', path: ['Desktop', 'Projects'], icon: <FolderRegular fontSize={16} /> },
  { name: 'Resume', path: ['Desktop', 'Resume'], icon: <DocumentRegular fontSize={16} /> },
  { name: 'Notes', path: ['Desktop', 'Notes'], icon: <DocumentRegular fontSize={16} /> },
  { name: 'Downloads', path: ['Desktop', 'Downloads'], icon: <FolderRegular fontSize={16} /> },
];

const getIconForType = (type, iconId) => {
  if (type === 'folder') return <img src={folderOpenIco} alt="folder" draggable="false" style={{ width: '32px', height: '32px' }} />;
  switch (iconId) {
    case 'document': return <DocumentRegular fontSize={32} />;
    case 'pdf': return <DocumentPdfRegular fontSize={32} color="#e81123" />;
    case 'image': return <ImageRegular fontSize={32} color="#0078d4" />;
    case 'code': return <CodeRegular fontSize={32} />;
    case 'desktop': return <DesktopRegular fontSize={32} />;
    case 'trophy': return <TrophyRegular fontSize={32} color="#ffb900" />;
    case 'award': return <RibbonRegular fontSize={32} color="#ffb900" />;
    case 'package': return <BoxRegular fontSize={32} />;
    default: return <DocumentRegular fontSize={32} />;
  }
};

const DRIVES = [
  { id: 'C', name: 'Local Disk (C:)', icon: driverCIco, total: 356.0, used: 319.5, unit: 'GB' },
  { id: 'D', name: 'Local Disk (D:)', icon: driverDIco, total: 1024.0, used: 512.0, unit: 'GB' },
];

export default function FileExplorerApp({ appId }) {
  // Start with 'This PC' if launched from My PC, else 'Desktop'
  const [currentPath, setCurrentPath] = useState(appId === 'mypc' ? ['This PC'] : ['Desktop']);
  const [selectedItem, setSelectedItem] = useState(null);

  const openWindow = useWindowStore((s) => s.openWindow);

  const isThisPC = currentPath.length === 1 && currentPath[0] === 'This PC';

  // Get the current directory node (unless it's This PC)
  const currentNode = isThisPC ? null : resolveNode(currentPath);
  const items = currentNode?.children || [];

  // Navigate to a folder
  const navigateTo = useCallback((path) => {
    setCurrentPath(path);
    setSelectedItem(null);
  }, []);

  // Go back one level
  const goBack = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
      setSelectedItem(null);
    }
  }, [currentPath]);

  // Handle item click (single = select)
  const handleItemClick = (item) => {
    setSelectedItem(item.name || item.id);
  };

  // Handle item double-click
  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      // Navigate into folder
      navigateTo([...currentPath, item.name]);
    } else if (item.appId) {
      // Open associated app
      openWindow(item.appId);
    }
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (index) => {
    setCurrentPath((prev) => prev.slice(0, index + 1));
    setSelectedItem(null);
  };

  return (
    <div className="explorer-app">
      {/* Navigation Bar */}
      <div className="explorer-nav">
        <button
          className="explorer-nav-btn"
          onClick={goBack}
          disabled={currentPath.length <= 1}
          title="Back"
        >
          <ArrowLeftRegular fontSize={16} />
        </button>
        <button
          className="explorer-nav-btn"
          onClick={() => navigateTo(['This PC'])}
          title="Home"
        >
          <HomeRegular fontSize={16} />
        </button>

        {/* Center: Breadcrumbs & Search */}
        <div className="explorer-nav-center">
          <div className="explorer-breadcrumbs">
            {currentPath.map((part, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {i > 0 && <span className="explorer-breadcrumb-sep"><ChevronRightRegular fontSize={12} /></span>}
                <button
                  className={`explorer-breadcrumb ${
                    i === currentPath.length - 1 ? 'active' : ''
                  }`}
                  onClick={() => handleBreadcrumbClick(i)}
                >
                  {part}
                </button>
              </span>
            ))}
          </div>
          <input 
            type="text" 
            className="explorer-search" 
            placeholder={`Search ${currentPath[currentPath.length - 1] || 'This PC'}`} 
            onChange={(e) => {/* Phase 4: Implementation */}}
          />
        </div>
      </div>

      {/* Body */}
      <div className="explorer-body">
        {/* Sidebar */}
        <div className="explorer-sidebar">
          <h3 className="explorer-sidebar-title">Quick Access</h3>
          {QUICK_ACCESS.map((item) => (
            <button
              key={item.name}
              className={`explorer-sidebar-item ${
                currentPath.join('/') === item.path.join('/') ? 'active' : ''
              }`}
              onClick={() => navigateTo(item.path)}
            >
              <span className="explorer-sidebar-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="explorer-content">
          {isThisPC ? (
            <div className="explorer-this-pc">
              <h4 className="this-pc-group-title">Devices and drives ({DRIVES.length})</h4>
              <div className="this-pc-drives">
                {DRIVES.map(drive => {
                  const percentUsed = (drive.used / drive.total) * 100;
                  const isLowSpace = percentUsed > 90;
                  return (
                    <div
                      key={drive.id}
                      className={`this-pc-drive ${selectedItem === drive.id ? 'selected' : ''}`}
                      onClick={() => handleItemClick(drive)}
                      onDoubleClick={() => navigateTo(['Desktop'])} // Route to desktop for now as simulated C: drive
                    >
                      <div className="drive-icon">
                        <img src={drive.icon} alt={drive.name} style={{ width: '40px', height: '40px' }} />
                      </div>
                      <div className="drive-info">
                        <div className="drive-name">{drive.name}</div>
                        <div className="drive-progress-bg">
                          <div
                            className="drive-progress-fill"
                            style={{ 
                              width: `${percentUsed}%`,
                              backgroundColor: isLowSpace ? '#e81123' : 'var(--color-accent)'
                            }}
                          ></div>
                        </div>
                        <div className="drive-details">
                          {drive.total - drive.used} {drive.unit} free of {drive.total} {drive.unit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : items.length > 0 ? (
            <div className="explorer-grid">
              {items.map((item) => (
                <div
                  key={item.name}
                  className={`explorer-item ${
                    selectedItem === item.name ? 'selected' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <span className="explorer-item-icon">
                    {getIconForType(item.type, item.icon)}
                  </span>
                  <span className="explorer-item-name">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="explorer-empty">
              <span className="explorer-empty-icon"><FolderOpenRegular fontSize={48} /></span>
              <p>This folder is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="explorer-status">
        <span className="explorer-status-text">
          {isThisPC 
            ? `${DRIVES.length} item${DRIVES.length !== 1 ? 's' : ''}` 
            : `${items.length} item${items.length !== 1 ? 's' : ''}`
          }
        </span>
        {selectedItem && !isThisPC && (
          <span className="explorer-status-text">
            {items.find((i) => i.name === selectedItem)?.size || ''}
          </span>
        )}
      </div>
    </div>
  );
}
