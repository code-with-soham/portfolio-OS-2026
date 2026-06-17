// ============================================
// Portfolio OS 2026 — File Explorer Pro
// ============================================

import { useState, useCallback, useEffect } from 'react';
import { useFileSystemStore } from '../../store/useFileSystemStore';
import { useWindowStore } from '../../store/useWindowStore';
import PropertiesModal from './PropertiesModal';
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
  FolderOpenRegular,
  HistoryRegular
} from '@fluentui/react-icons';
import './FileExplorerApp.css';

import driverCIco from '../../assets/icons/system/driver-c.ico';
import driverDIco from '../../assets/icons/system/driver-d.ico';
import folderOpenIco from '../../assets/icons/system/Folder Open.ico';

const QUICK_ACCESS = [
  { name: 'This PC', path: ['This PC'], icon: <DesktopRegular fontSize={16} /> },
  { name: 'Desktop', path: ['Desktop'], icon: <DesktopRegular fontSize={16} /> },
  { name: 'Recent Files', path: ['Recent Files'], icon: <HistoryRegular fontSize={16} /> },
  { name: 'Projects', path: ['Desktop', 'Projects'], icon: <FolderRegular fontSize={16} /> },
  { name: 'Resume', path: ['Desktop', 'Resume'], icon: <DocumentRegular fontSize={16} /> },
  { name: 'Notes', path: ['Desktop', 'Notes'], icon: <DocumentRegular fontSize={16} /> },
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
  const [currentPath, setCurrentPath] = useState(appId === 'mypc' ? ['This PC'] : ['Desktop']);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [propertiesItem, setPropertiesItem] = useState(null);
  const [renameItemName, setRenameItemName] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const { getNode, getRecentFiles, deleteItem, renameItem, moveItem, updateLastOpened } = useFileSystemStore();
  const openWindow = useWindowStore((s) => s.openWindow);

  const isThisPC = currentPath.length === 1 && currentPath[0] === 'This PC';
  const isRecent = currentPath.length === 1 && currentPath[0] === 'Recent Files';

  // Get current node items
  let items = [];
  if (isRecent) {
    items = getRecentFiles();
  } else if (!isThisPC) {
    const currentNode = getNode(currentPath);
    items = currentNode?.children || [];
  }

  // Hide context menu on global click
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Keyboard shortcuts (Shift+Delete)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedItem) {
        const itemPath = isRecent 
          ? items.find(i => i.name === selectedItem)?.fullPath 
          : [...currentPath, selectedItem];
        if (itemPath && !isThisPC && !isRecent) {
          deleteItem(itemPath, e.shiftKey); // shiftKey = permanent
          setSelectedItem(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, currentPath, isThisPC, isRecent, items, deleteItem]);

  const navigateTo = useCallback((path) => {
    setCurrentPath(path);
    setSelectedItem(null);
    setContextMenu(null);
    setRenameItemName(null);
  }, []);

  const goBack = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
      setSelectedItem(null);
    }
  }, [currentPath]);

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateTo([...currentPath, item.name]);
    } else {
      const fullPath = isRecent ? item.fullPath : [...currentPath, item.name];
      updateLastOpened(fullPath);
      if (item.appId) {
        openWindow(item.appId, { filePath: fullPath });
      } else if (item.icon === 'document' || item.name.endsWith('.txt') || item.name.endsWith('.md')) {
        openWindow('notepad', { filePath: fullPath });
      }
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item.name || item.id);
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const executeContextAction = (action) => {
    if (!contextMenu?.item) return;
    const item = contextMenu.item;
    const itemPath = isRecent ? item.fullPath : [...currentPath, item.name];

    switch (action) {
      case 'open':
        handleItemDoubleClick(item);
        break;
      case 'delete':
        if (!isRecent && !isThisPC) deleteItem(itemPath);
        break;
      case 'rename':
        if (!isRecent && !isThisPC) {
          setRenameItemName(item.name);
          setRenameInput(item.name);
        }
        break;
      case 'properties':
        setPropertiesItem(item);
        break;
    }
    setContextMenu(null);
  };

  const handleRenameSubmit = (e) => {
    if (e.key === 'Enter') {
      if (renameInput.trim() && renameInput !== renameItemName) {
        renameItem([...currentPath, renameItemName], renameInput.trim());
      }
      setRenameItemName(null);
    } else if (e.key === 'Escape') {
      setRenameItemName(null);
    }
  };

  // Drag and Drop support
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      sourcePath: isRecent ? item.fullPath : [...currentPath, item.name],
      name: item.name
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (targetItem.type !== 'folder') return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const targetPath = [...currentPath, targetItem.name];
      moveItem(data.sourcePath, targetPath);
    } catch (err) { }
  };

  const handleDragOver = (e, item) => {
    if (item.type === 'folder') {
      e.preventDefault(); // Allows dropping
    }
  };

  return (
    <div className="explorer-app" onClick={() => setContextMenu(null)}>
      {/* Navigation Bar */}
      <div className="explorer-nav">
        <button className="explorer-nav-btn" onClick={goBack} disabled={currentPath.length <= 1}>
          <ArrowLeftRegular fontSize={16} />
        </button>
        <button className="explorer-nav-btn" onClick={() => navigateTo(['This PC'])}>
          <HomeRegular fontSize={16} />
        </button>

        <div className="explorer-nav-center">
          <div className="explorer-breadcrumbs">
            {currentPath.map((part, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {i > 0 && <span className="explorer-breadcrumb-sep"><ChevronRightRegular fontSize={12} /></span>}
                <button
                  className={`explorer-breadcrumb ${i === currentPath.length - 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
                >
                  {part}
                </button>
              </span>
            ))}
          </div>
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
              className={`explorer-sidebar-item ${currentPath.join('/') === item.path.join('/') ? 'active' : ''}`}
              onClick={() => navigateTo(item.path)}
            >
              <span className="explorer-sidebar-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="explorer-content" onClick={() => setSelectedItem(null)}>
          {isThisPC ? (
            <div className="explorer-this-pc">
              <h4 className="this-pc-group-title">Devices and drives ({DRIVES.length})</h4>
              <div className="this-pc-drives">
                {DRIVES.map(drive => {
                  const percentUsed = (drive.used / drive.total) * 100;
                  return (
                    <div
                      key={drive.id}
                      className={`this-pc-drive ${selectedItem === drive.id ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(drive.id); }}
                      onDoubleClick={() => navigateTo(['Desktop'])}
                      onContextMenu={(e) => handleContextMenu(e, drive)}
                    >
                      <div className="drive-icon"><img src={drive.icon} alt="" style={{ width: 40, height: 40 }} /></div>
                      <div className="drive-info">
                        <div className="drive-name">{drive.name}</div>
                        <div className="drive-progress-bg">
                          <div className="drive-progress-fill" style={{ width: `${percentUsed}%` }}></div>
                        </div>
                        <div className="drive-details">{drive.total - drive.used} {drive.unit} free</div>
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
                  key={item.name + (item.fullPath?.join('/') || '')}
                  className={`explorer-item ${selectedItem === item.name ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  draggable={!isRecent}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDrop={(e) => handleDrop(e, item)}
                  onDragOver={(e) => handleDragOver(e, item)}
                >
                  <span className="explorer-item-icon">
                    {getIconForType(item.type, item.icon)}
                  </span>
                  {renameItemName === item.name ? (
                    <input 
                      type="text" 
                      className="explorer-rename-input"
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      onKeyDown={handleRenameSubmit}
                      onBlur={() => setRenameItemName(null)}
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="explorer-item-name">{item.name}</span>
                  )}
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

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div 
          className="explorer-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => executeContextAction('open')}>Open</div>
          {!isThisPC && !isRecent && (
            <>
              <div className="context-menu-divider" />
              <div className="context-menu-item" onClick={() => executeContextAction('rename')}>Rename</div>
              <div className="context-menu-item" onClick={() => executeContextAction('delete')}>Delete</div>
            </>
          )}
          <div className="context-menu-divider" />
          <div className="context-menu-item" onClick={() => executeContextAction('properties')}>Properties</div>
        </div>
      )}

      {/* Properties Modal */}
      {propertiesItem && (
        <PropertiesModal item={propertiesItem} onClose={() => setPropertiesItem(null)} />
      )}
    </div>
  );
}
