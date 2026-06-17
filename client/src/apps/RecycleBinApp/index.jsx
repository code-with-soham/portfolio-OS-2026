import { useState, useEffect } from 'react';
import { useFileSystemStore } from '../../store/useFileSystemStore';
import { useWindowStore } from '../../store/useWindowStore';
import {
  FolderOpenRegular,
  DocumentRegular,
  DocumentPdfRegular,
  ImageRegular,
  CodeRegular,
  DesktopRegular,
  TrophyRegular,
  RibbonRegular,
  BoxRegular,
  DeleteRegular,
  ArrowUndoRegular
} from '@fluentui/react-icons';
import '../FileExplorerApp/FileExplorerApp.css'; // Reuse File Explorer styles
import folderOpenIco from '../../assets/icons/system/Folder Open.ico';

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

export default function RecycleBinApp() {
  const { deletedItems, emptyRecycleBin, restoreItem } = useFileSystemStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item.name);
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleRestore = (item) => {
    restoreItem(item.name);
    setContextMenu(null);
  };

  return (
    <div className="explorer-app" onClick={() => setContextMenu(null)}>
      {/* Navigation Bar */}
      <div className="explorer-nav" style={{ padding: '8px 16px', background: 'var(--color-bg-surface)' }}>
        <button 
          className="explorer-nav-btn" 
          style={{ width: 'auto', padding: '4px 12px', display: 'flex', gap: '8px' }}
          onClick={emptyRecycleBin}
          disabled={deletedItems.length === 0}
        >
          <DeleteRegular fontSize={16} /> Empty Recycle Bin
        </button>
      </div>

      <div className="explorer-body">
        {/* Content Grid */}
        <div className="explorer-content" onClick={() => setSelectedItem(null)} style={{ borderTopLeftRadius: 0, padding: '16px' }}>
          {deletedItems.length > 0 ? (
            <div className="explorer-grid">
              {deletedItems.map((item) => (
                <div
                  key={item.name + item.deletedAt}
                  className={`explorer-item ${selectedItem === item.name ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  title={`Original Location: ${item.originalPath.slice(0,-1).join('/')}`}
                >
                  <span className="explorer-item-icon" style={{ opacity: 0.6 }}>
                    {getIconForType(item.type, item.icon)}
                  </span>
                  <span className="explorer-item-name">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="explorer-empty">
              <span className="explorer-empty-icon"><DeleteRegular fontSize={48} /></span>
              <p>The Recycle Bin is empty</p>
            </div>
          )}
        </div>
      </div>

      <div className="explorer-status">
        <span className="explorer-status-text">
          {deletedItems.length} item{deletedItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div 
          className="explorer-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <div className="context-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => handleRestore(contextMenu.item)}>
            <ArrowUndoRegular fontSize={14} /> Restore
          </div>
        </div>
      )}
    </div>
  );
}
