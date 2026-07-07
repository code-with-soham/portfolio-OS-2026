import { motion } from 'framer-motion';
import FileIcon from './FileIcon';

export default function ExplorerList({ 
  items, 
  selectedItem, 
  setSelectedItem, 
  onDoubleClick, 
  onContextMenu,
  isRecent 
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="explorer-list-view">
      <div className="explorer-list-header">
        <div className="list-col name">Name</div>
        <div className="list-col date">Date modified</div>
        <div className="list-col type">Type</div>
        <div className="list-col size">Size</div>
      </div>
      
      <motion.div 
        className="explorer-list-body"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {items.map((item) => (
          <motion.div
            variants={itemAnim}
            key={item.name}
            className={`explorer-list-row ${selectedItem === item.name ? 'selected' : ''}`}
            onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
            onDoubleClick={() => onDoubleClick(item)}
            onContextMenu={(e) => onContextMenu(e, item)}
          >
            <div className="list-col name">
              <FileIcon type={item.type} iconType={item.icon} size={20} />
              <span>{item.name}</span>
            </div>
            <div className="list-col date">{item.modified || '--'}</div>
            <div className="list-col type">{item.type === 'folder' ? 'File folder' : `${item.icon?.toUpperCase() || 'File'}`}</div>
            <div className="list-col size">{item.size || '--'}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
