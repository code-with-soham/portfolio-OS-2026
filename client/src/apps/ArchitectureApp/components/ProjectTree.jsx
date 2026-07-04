import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderRegular, DocumentRegular, ChevronRightRegular, ChevronDownRegular, CodeRegular } from '@fluentui/react-icons';
import projectData from '../../../ai/knowledge/architecture/project-structure.json';
import dependenciesData from '../../../ai/knowledge/architecture/dependencies.json';

const TreeItem = ({ node, level = 0, onSelectFile, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isFolder = node.type === 'folder';
  
  // Try to match the tree node with a dependency file entry
  const fileKey = useMemo(() => {
    if (isFolder) return null;
    const allKeys = Object.keys(dependenciesData);
    // Find a key that ends with the filename
    return allKeys.find(k => k.endsWith(node.name) || k.endsWith(node.name + '.js') || k.endsWith(node.name + '.jsx'));
  }, [isFolder, node.name]);

  const isSelected = fileKey && selectedFile === fileKey;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div 
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else if (fileKey) onSelectFile(fileKey);
        }}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '6px', 
          padding: '6px 8px', paddingLeft: `${level * 16 + 8}px`,
          cursor: 'pointer',
          color: isSelected ? '#fff' : isFolder ? '#ccc' : '#888',
          background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
          borderRadius: '4px'
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ width: '16px', display: 'flex', alignItems: 'center' }}>
          {isFolder ? (isOpen ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />) : null}
        </span>
        {isFolder ? <FolderRegular style={{ color: '#dcb67a' }} /> : <DocumentRegular />}
        <span style={{ fontSize: '13px', userSelect: 'none' }}>{node.name}</span>
        {isFolder && node.description && <span style={{ marginLeft: '12px', fontSize: '11px', color: '#555' }}>// {node.description}</span>}
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
              <TreeItem key={idx} node={child} level={level + 1} onSelectFile={onSelectFile} selectedFile={selectedFile} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProjectTree() {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fileData = selectedFile ? dependenciesData[selectedFile] : null;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left Pane - Tree */}
      <div style={{ 
        width: '320px', borderRight: '1px solid #222', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden' 
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #222' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Project Tree</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>IntelliJ-style architecture explorer</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', fontFamily: 'monospace' }} className="custom-scrollbar">
          <TreeItem node={projectData} onSelectFile={setSelectedFile} selectedFile={selectedFile} />
        </div>
      </div>

      {/* Right Pane - Details */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
        {fileData ? (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    {fileData.category}
                  </div>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{fileData.name}</h1>
                </div>
                <button 
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(0, 191, 255, 0.1)', color: '#00bfff',
                    border: '1px solid rgba(0, 191, 255, 0.2)', padding: '8px 16px',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                  }}
                >
                  <CodeRegular /> Open in VS Code
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                {fileData.path}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #222', margin: 0 }} />

            {/* Purpose */}
            <div>
              <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>Purpose</div>
              <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
                {fileData.category === 'store' ? 'Global state manager handling specific OS domain logic.' : 
                 fileData.category === 'app' ? 'Windowed application component.' : 
                 fileData.category === 'component' ? 'Reusable UI or layout component.' : 
                 'Utility module providing core OS functionality.'}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Lines', value: fileData.lines },
                { label: 'Functions', value: fileData.functions },
                { label: 'Hooks', value: fileData.hooksCount },
                { label: 'Consumers', value: fileData.usedBy.length }
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Used By & Imports Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              {/* Used By */}
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', letterSpacing: '1px' }}>
                  Used By ({fileData.usedBy.length})
                </div>
                {fileData.usedBy.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {fileData.usedBy.map((dep, i) => (
                      <motion.div 
                        key={dep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ fontSize: '12px', color: '#4CAF50', padding: '8px 12px', background: 'rgba(76, 175, 80, 0.05)', border: '1px solid rgba(76, 175, 80, 0.1)', borderRadius: '6px' }}
                      >
                        {dep}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#555', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>No internal consumers</div>
                )}
              </div>

              {/* Imports */}
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', letterSpacing: '1px' }}>
                  Imports ({fileData.imports.length})
                </div>
                {fileData.imports.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {fileData.imports.map((imp, i) => (
                      <motion.div 
                        key={imp + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ fontSize: '12px', color: '#ccc', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '6px' }}
                      >
                        {imp.split('/').pop()}
                        <span style={{ color: '#555', marginLeft: '8px', fontSize: '10px' }}>{imp}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#555', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>No internal imports</div>
                )}
              </div>
            </div>

            {/* Exports */}
            {fileData.exports.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', letterSpacing: '1px' }}>
                  Exports ({fileData.exports.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {fileData.exports.map((e, i) => (
                    <motion.div 
                      key={e + i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      style={{ fontSize: '12px', color: '#f0db4f', padding: '6px 12px', background: 'rgba(240, 219, 79, 0.05)', border: '1px solid rgba(240, 219, 79, 0.2)', borderRadius: '6px', fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {e}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
            <FolderRegular style={{ fontSize: '48px', color: '#333' }} />
            <div style={{ fontSize: '18px', color: '#666', fontWeight: 500 }}>Select a file from the tree</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Explore file metadata, dependencies, and consumers.</div>
          </div>
        )}
      </div>

    </div>
  );
}
