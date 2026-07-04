import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderRegular, DocumentRegular, ChevronRightRegular, ChevronDownRegular } from '@fluentui/react-icons';
import projectData from '../../../ai/knowledge/architecture/project-structure.json';

const TreeItem = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isFolder = node.type === 'folder';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div 
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '6px', 
          padding: '4px 8px', paddingLeft: `${level * 16 + 8}px`,
          cursor: isFolder ? 'pointer' : 'default',
          color: isFolder ? '#ccc' : '#888',
          background: 'transparent',
          borderRadius: '4px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ width: '16px', display: 'flex', alignItems: 'center' }}>
          {isFolder ? (isOpen ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />) : null}
        </span>
        {isFolder ? <FolderRegular style={{ color: '#dcb67a' }} /> : <DocumentRegular />}
        <span style={{ fontSize: '14px', userSelect: 'none' }}>{node.name}</span>
        {node.description && <span style={{ marginLeft: '12px', fontSize: '12px', color: '#555' }}>// {node.description}</span>}
      </div>

      <AnimatePresence>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {node.children.map((child, idx) => (
              <TreeItem key={idx} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProjectTree() {
  return (
    <div style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>Project Structure</h2>
        <p style={{ color: '#888', margin: 0 }}>VS Code style directory explorer.</p>
      </div>

      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px 0', fontFamily: 'monospace' }}>
        <TreeItem node={projectData} />
      </div>
    </div>
  );
}
