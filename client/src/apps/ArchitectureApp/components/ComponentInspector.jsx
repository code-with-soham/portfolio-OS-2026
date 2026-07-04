import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dependenciesData from '../../../ai/knowledge/architecture/dependencies.json';

const CATEGORY_COLORS = {
  app: '#61dafb', store: '#f0db4f', component: '#4CAF50',
  ai: '#e040fb', service: '#ff9800', hook: '#00bcd4',
  widget: '#8bc34a', config: '#9e9e9e', other: '#666'
};

export default function ComponentInspector() {
  const allFiles = useMemo(() => Object.values(dependenciesData), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);

  const searchResults = useMemo(() => {
    if (!searchQuery) return allFiles.filter(f => f.category === 'component' || f.category === 'widget' || f.category === 'app').slice(0, 30);
    return allFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 30);
  }, [searchQuery, allFiles]);

  // Build the import chain for the selected component
  const importChain = useMemo(() => {
    if (!selectedComponent) return [];
    const chain = [];
    const visited = new Set();

    function trace(file, depth) {
      if (depth > 5 || visited.has(file.name)) return;
      visited.add(file.name);

      for (const imp of file.imports) {
        const resolved = allFiles.find(f => imp.includes(f.name));
        if (resolved) {
          chain.push({ from: file.name, to: resolved.name, category: resolved.category, depth });
          trace(resolved, depth + 1);
        }
      }
    }

    trace(selectedComponent, 0);
    return chain;
  }, [selectedComponent, allFiles]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left - Component Search */}
      <div style={{
        width: '280px', borderRight: '1px solid #222',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #222' }}>
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: '#111', border: '1px solid #333',
              borderRadius: '6px', padding: '8px 12px', color: '#fff',
              fontSize: '13px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }} className="custom-scrollbar">
          {searchResults.map(file => {
            const isSelected = selectedComponent?.name === file.name;
            return (
              <button
                key={file.name + file.path}
                onClick={() => setSelectedComponent(file)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                  padding: '8px', borderRadius: '6px', border: 'none', textAlign: 'left',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isSelected ? '#fff' : '#aaa', cursor: 'pointer', fontSize: '12px'
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: CATEGORY_COLORS[file.category] || '#666', flexShrink: 0 }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: '10px', color: '#555' }}>{file.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right - Inspector Panel */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px' }} className="custom-scrollbar">
        {selectedComponent ? (
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CATEGORY_COLORS[selectedComponent.category] || '#888' }} />
                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>{selectedComponent.category}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{selectedComponent.name}</h2>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>{selectedComponent.path || ''}</p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'Lines', value: selectedComponent.lines, color: '#61dafb' },
                { label: 'Functions', value: selectedComponent.functions, color: '#4CAF50' },
                { label: 'Hooks', value: selectedComponent.hooksCount, color: '#00bcd4' },
                { label: 'Used By', value: selectedComponent.usedBy.length, color: '#f0db4f' }
              ].map(s => (
                <div key={s.label} style={{ background: '#111', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Import Chain Visualization */}
            {importChain.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '12px', letterSpacing: '1px' }}>
                  Import Chain
                </div>
                <div style={{ background: '#111', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {importChain.map((link, i) => (
                    <motion.div
                      key={`${link.from}-${link.to}-${i}`}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        paddingLeft: `${link.depth * 20}px`, fontSize: '12px'
                      }}
                    >
                      <span style={{ color: '#555' }}>{'→'}</span>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: CATEGORY_COLORS[link.category] || '#666' }} />
                      <span
                        style={{ color: '#ccc', cursor: 'pointer' }}
                        onClick={() => {
                          const file = allFiles.find(f => f.name === link.to);
                          if (file) setSelectedComponent(file);
                        }}
                      >
                        {link.to}
                      </span>
                      <span style={{ fontSize: '10px', color: '#555' }}>{link.category}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Hooks Used */}
            {selectedComponent.hooks.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                  Hooks Used ({selectedComponent.hooksCount})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedComponent.hooks.map(h => (
                    <span key={h} style={{
                      background: 'rgba(0, 188, 212, 0.1)', border: '1px solid rgba(0, 188, 212, 0.2)',
                      padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#00bcd4',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Used By */}
            {selectedComponent.usedBy.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                  Used By ({selectedComponent.usedBy.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedComponent.usedBy.map(name => (
                    <span
                      key={name}
                      onClick={() => {
                        const file = allFiles.find(f => f.name === name);
                        if (file) setSelectedComponent(file);
                      }}
                      style={{
                        background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)',
                        padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#4CAF50', cursor: 'pointer'
                      }}
                    >{name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Exports */}
            {selectedComponent.exports.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                  Exports ({selectedComponent.exports.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedComponent.exports.map(e => (
                    <span key={e} style={{
                      background: 'rgba(240, 219, 79, 0.1)', border: '1px solid rgba(240, 219, 79, 0.2)',
                      padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#f0db4f',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px' }}>🔍</span>
            <div style={{ fontSize: '18px', color: '#888', fontWeight: 500 }}>Select a component</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Search and select any component to inspect its internals.</div>
          </div>
        )}
      </div>
    </div>
  );
}
