import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dependenciesData from '../../../ai/knowledge/architecture/dependencies.json';

const CATEGORY_COLORS = {
  app: '#61dafb', store: '#f0db4f', component: '#4CAF50',
  ai: '#e040fb', service: '#ff9800', hook: '#00bcd4',
  widget: '#8bc34a', config: '#9e9e9e', other: '#666'
};

export default function DependencyGraph() {
  const allFiles = useMemo(() => Object.values(dependenciesData), []);
  const importantFiles = useMemo(() =>
    allFiles.filter(f => f.usedBy.length > 0 || f.category === 'store' || f.category === 'hook')
      .sort((a, b) => b.usedBy.length - a.usedBy.length),
    [allFiles]
  );

  const [selectedFile, setSelectedFile] = useState(null);

  // Build dependency tree for selected file
  const depTree = useMemo(() => {
    if (!selectedFile) return null;
    const deps = selectedFile.imports
      .map(imp => {
        // Try to resolve the import to a known file
        const matching = allFiles.find(f => imp.includes(f.name) || imp.endsWith(f.name));
        return matching || { name: imp.split('/').pop(), category: 'external', lines: 0, usedBy: [] };
      });
    return deps;
  }, [selectedFile, allFiles]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left — Entity Selector */}
      <div style={{
        width: '260px', borderRight: '1px solid #222', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto'
      }} className="custom-scrollbar">
        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, padding: '0 8px', marginBottom: '8px', letterSpacing: '1px' }}>
          Select Entity
        </div>

        {/* Category filter chips */}
        {Object.entries(CATEGORY_COLORS).filter(([cat]) => importantFiles.some(f => f.category === cat)).map(([cat, color]) => (
          <div key={cat} style={{ fontSize: '10px', textTransform: 'uppercase', color: '#555', fontWeight: 600, padding: '8px 8px 4px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
            {cat}s
          </div>
        ))}

        {importantFiles.slice(0, 50).map(file => {
          const isSelected = selectedFile?.name === file.name;
          return (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: '6px', border: 'none', textAlign: 'left',
                background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: isSelected ? '#fff' : '#aaa', cursor: 'pointer', fontSize: '12px'
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: CATEGORY_COLORS[file.category] || '#666', flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
              <span style={{ fontSize: '10px', color: '#555' }}>{file.usedBy.length}</span>
            </button>
          );
        })}
      </div>

      {/* Right — Graph View */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px' }} className="custom-scrollbar">
        {selectedFile ? (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>

            {/* Center Node */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  display: 'inline-block', padding: '16px 32px', borderRadius: '12px',
                  background: 'rgba(0, 191, 255, 0.1)', border: '2px solid #00bfff',
                  boxShadow: '0 0 30px rgba(0, 191, 255, 0.2)'
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{selectedFile.name}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  {selectedFile.category} · {selectedFile.lines} lines · {selectedFile.functions} functions
                </div>
              </motion.div>
            </div>

            {/* Two columns: Dependencies | Used By */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

              {/* Dependencies (imports) */}
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '12px', letterSpacing: '1px' }}>
                  Dependencies ({depTree?.length || 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {depTree?.map((dep, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 12px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid #222'
                      }}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: CATEGORY_COLORS[dep.category] || '#666' }} />
                      <span style={{ fontSize: '13px', color: '#ccc' }}>{dep.name}</span>
                      <span style={{ fontSize: '10px', color: '#555', marginLeft: 'auto' }}>{dep.category}</span>
                    </motion.div>
                  ))}
                  {(!depTree || depTree.length === 0) && (
                    <div style={{ fontSize: '12px', color: '#555', padding: '12px', textAlign: 'center' }}>No local dependencies</div>
                  )}
                </div>
              </div>

              {/* Used By */}
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '12px', letterSpacing: '1px' }}>
                  Used By ({selectedFile.usedBy.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedFile.usedBy.map((consumer, i) => (
                    <motion.div
                      key={consumer}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        const file = allFiles.find(f => f.name === consumer);
                        if (file) setSelectedFile(file);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 12px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid #222',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }} />
                      <span style={{ fontSize: '13px', color: '#ccc' }}>{consumer}</span>
                    </motion.div>
                  ))}
                  {selectedFile.usedBy.length === 0 && (
                    <div style={{ fontSize: '12px', color: '#555', padding: '12px', textAlign: 'center' }}>No consumers found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Hooks & Exports */}
            {(selectedFile.hooks.length > 0 || selectedFile.exports.length > 0) && (
              <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {selectedFile.hooks.length > 0 && (
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                      Hooks ({selectedFile.hooksCount})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedFile.hooks.map(h => (
                        <span key={h} style={{ background: '#111', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#00bcd4', fontFamily: 'JetBrains Mono, monospace' }}>{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedFile.exports.length > 0 && (
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                      Exports ({selectedFile.exports.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedFile.exports.map(e => (
                        <span key={e} style={{ background: '#111', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#f0db4f', fontFamily: 'JetBrains Mono, monospace' }}>{e}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px' }}>🔗</span>
            <div style={{ fontSize: '18px', color: '#888', fontWeight: 500 }}>Select an entity</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Choose a store, app, or component to visualize its dependency graph.</div>
          </div>
        )}
      </div>
    </div>
  );
}
