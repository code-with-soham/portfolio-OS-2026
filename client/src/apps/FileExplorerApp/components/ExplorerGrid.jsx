import { motion } from 'framer-motion';
import FileIcon from './FileIcon';

export default function ExplorerGrid({ 
  items, 
  selectedItem, 
  setSelectedItem, 
  onDoubleClick, 
  onContextMenu,
  isRecent 
}) {
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      sourcePath: item.fullPath, // Supplied by shell
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
      // Shell will capture this bubble or we pass a handler
      // We emit a custom event or call a prop (handled in shell)
      const dropEvent = new CustomEvent('explorer-drop', { detail: { sourcePath: data.sourcePath, targetName: targetItem.name } });
      window.dispatchEvent(dropEvent);
    } catch (err) { }
  };

  const handleDragOver = (e, item) => {
    if (item.type === 'folder') {
      e.preventDefault(); // Allows dropping
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      className="explorer-grid-view"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((item) => (
        <motion.div
          variants={itemAnim}
          key={item.name}
          className={`explorer-item-card ${selectedItem === item.name ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
          onDoubleClick={() => onDoubleClick(item)}
          onContextMenu={(e) => onContextMenu(e, item)}
          draggable={!isRecent}
          onDragStart={(e) => handleDragStart(e, item)}
          onDrop={(e) => handleDrop(e, item)}
          onDragOver={(e) => handleDragOver(e, item)}
        >
          <div className="item-card-icon">
            <FileIcon type={item.type} iconType={item.icon} size={48} />
          </div>
          <div className="item-card-details">
            <span className="item-card-name">{item.name}</span>
            {item.rating && <span className="item-card-rating">{item.rating}</span>}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
