import { motion } from 'framer-motion';
import ExplorerSidebar from './ExplorerSidebar';
import ExplorerToolbar from './ExplorerToolbar';
import ExplorerContent from './ExplorerContent';
import StatusBar from './StatusBar';
import { useState, useCallback, useEffect } from 'react';
import { useFileSystemStore } from '../../../store/useFileSystemStore';
import { useWindowStore } from '../../../store/useWindowStore';
import '../FileExplorerApp.css'; // Ensure CSS is applied

export default function ExplorerShell({ appId }) {
  const [currentPath, setCurrentPath] = useState(appId === 'mypc' ? ['Portfolio'] : ['Portfolio']);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);

  const { getNode, getRecentFiles, deleteItem, renameItem, moveItem, updateLastOpened } = useFileSystemStore();
  const openWindow = useWindowStore((s) => s.openWindow);

  const isRecent = currentPath.length === 1 && currentPath[0] === 'Recent';

  // Fetch items based on path
  let items = [];
  if (isRecent) {
    items = getRecentFiles();
  } else {
    const currentNode = getNode(currentPath);
    items = currentNode?.children || [];
  }

  // Simulate loading skeleton on navigation
  const navigateTo = useCallback((path) => {
    setIsLoading(true);
    setCurrentPath(path);
    setSelectedItem(null);
    setTimeout(() => setIsLoading(false), 200); // 200ms skeleton transition
  }, []);

  const goBack = useCallback(() => {
    if (currentPath.length > 1) {
      navigateTo(currentPath.slice(0, -1));
    }
  }, [currentPath, navigateTo]);

  const goUp = useCallback(() => {
    if (currentPath.length > 1) {
      navigateTo(currentPath.slice(0, -1));
    }
  }, [currentPath, navigateTo]);

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateTo([...currentPath, item.name]);
    } else {
      const fullPath = isRecent ? item.fullPath : [...currentPath, item.name];
      updateLastOpened(fullPath);
      if (item.appId) {
        openWindow(item.appId, { filePath: fullPath });
      } else if (item.name.match(/\.(png|jpg|jpeg|webp|bmp)$/i)) {
        openWindow('paint', { filePath: fullPath });
      } else if (item.icon === 'markdown' || item.icon === 'json' || item.name.endsWith('.txt')) {
        openWindow('notepad', { filePath: fullPath });
      }
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item.name);
    // Trigger OS level context menu later
  };

  const handleToolbarAction = (action) => {
    if (action === 'delete' && selectedItem) {
      const itemPath = isRecent 
        ? items.find(i => i.name === selectedItem)?.fullPath 
        : [...currentPath, selectedItem];
      deleteItem(itemPath);
      setSelectedItem(null);
    }
    if (action === 'new') {
      // Create new folder via VFS
    }
  };

  // Listen to custom drop event from Grid/List
  useEffect(() => {
    const onDrop = (e) => {
      const { sourcePath, targetName } = e.detail;
      const targetPath = [...currentPath, targetName];
      moveItem(sourcePath, targetPath);
    };
    window.addEventListener('explorer-drop', onDrop);
    return () => window.removeEventListener('explorer-drop', onDrop);
  }, [currentPath, moveItem]);

  return (
    <motion.div 
      className="explorer-shell"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="explorer-shell-header">
        <ExplorerToolbar 
          currentPath={currentPath}
          navigateTo={navigateTo}
          goBack={goBack}
          goUp={goUp}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAction={handleToolbarAction}
        />
      </div>

      <div className="explorer-shell-body">
        <ExplorerSidebar 
          currentPath={currentPath}
          navigateTo={navigateTo}
        />
        <ExplorerContent 
          items={items}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onDoubleClick={handleItemDoubleClick}
          onContextMenu={handleContextMenu}
          isRecent={isRecent}
          viewMode={viewMode}
          isLoading={isLoading}
        />
      </div>

      <div className="explorer-shell-footer">
        <StatusBar 
          totalItems={items.length} 
          selectedCount={selectedItem ? 1 : 0} 
        />
      </div>
    </motion.div>
  );
}
