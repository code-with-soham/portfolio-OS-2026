import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import systemMapData from '../../../ai/knowledge/architecture/system-map.json';

const CATEGORY_COLORS = {};
systemMapData.categories.forEach(c => { CATEGORY_COLORS[c.id] = c.color; });

function layoutNodes(nodes) {
  // Auto-layout: arrange nodes by category in clusters
  const categories = {};
  nodes.forEach(n => {
    if (!categories[n.category]) categories[n.category] = [];
    categories[n.category].push(n);
  });

  const catKeys = Object.keys(categories);
  const positioned = {};
  const centerX = 600, centerY = 400;
  const catRadius = 300;

  catKeys.forEach((cat, catIdx) => {
    const angle = (catIdx / catKeys.length) * 2 * Math.PI - Math.PI / 2;
    const clusterCx = centerX + Math.cos(angle) * catRadius;
    const clusterCy = centerY + Math.sin(angle) * catRadius;
    const items = categories[cat];
    const itemRadius = Math.min(120, items.length * 15);

    items.forEach((node, i) => {
      const itemAngle = (i / items.length) * 2 * Math.PI;
      positioned[node.id] = {
        ...node,
        x: clusterCx + Math.cos(itemAngle) * itemRadius,
        y: clusterCy + Math.sin(itemAngle) * itemRadius
      };
    });
  });

  return positioned;
}

export default function SystemMap() {
  const containerRef = useRef(null);
  const [nodePositions, setNodePositions] = useState(() => layoutNodes(systemMapData.nodes));
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 0.7 });
  const [draggingNode, setDraggingNode] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  const edges = systemMapData.edges;

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target === containerRef.current || e.target.tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  }, [viewport]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setViewport(v => ({ ...v, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
    }
    if (draggingNode) {
      const scale = viewport.scale;
      setNodePositions(prev => ({
        ...prev,
        [draggingNode.id]: {
          ...prev[draggingNode.id],
          x: prev[draggingNode.id].x + e.movementX / scale,
          y: prev[draggingNode.id].y + e.movementY / scale
        }
      }));
    }
  }, [isPanning, panStart, draggingNode, viewport.scale]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingNode(null);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport(v => ({ ...v, scale: Math.max(0.2, Math.min(3, v.scale * delta)) }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [handleWheel]);

  // Find connections for selected node
  const selectedConnections = selectedNode ? {
    dependsOn: edges.filter(e => e.source === selectedNode.id).map(e => nodePositions[e.target]?.label).filter(Boolean),
    usedBy: edges.filter(e => e.target === selectedNode.id).map(e => nodePositions[e.source]?.label).filter(Boolean)
  } : null;

  const allPositioned = Object.values(nodePositions);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1, position: 'relative', overflow: 'hidden',
          cursor: isPanning ? 'grabbing' : draggingNode ? 'grabbing' : 'grab',
          background: '#060606'
        }}
      >
        {/* Grid Background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
          backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          pointerEvents: 'none'
        }} />

        {/* SVG Layer for Edges */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}>
            {edges.map((edge, i) => {
              const source = nodePositions[edge.source];
              const target = nodePositions[edge.target];
              if (!source || !target) return null;

              const isHighlighted = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

              return (
                <line
                  key={i}
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke={isHighlighted ? '#00bfff' : '#222'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  opacity={selectedNode ? (isHighlighted ? 0.8 : 0.1) : 0.3}
                  strokeDasharray={isHighlighted ? 'none' : '4 4'}
                />
              );
            })}
          </g>
        </svg>

        {/* Nodes */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`, transformOrigin: '0 0' }}>
            {allPositioned.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isConnected = selectedNode && (
                edges.some(e => (e.source === selectedNode.id && e.target === node.id) || (e.target === selectedNode.id && e.source === node.id))
              );
              const dimmed = selectedNode && !isSelected && !isConnected;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => { e.stopPropagation(); setDraggingNode(node); }}
                  onClick={(e) => { e.stopPropagation(); setSelectedNode(isSelected ? null : node); }}
                  style={{
                    position: 'absolute',
                    left: node.x - 40, top: node.y - 20,
                    width: '80px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(0, 191, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isSelected ? '#00bfff' : CATEGORY_COLORS[node.category] || '#333'}`,
                    boxShadow: isSelected ? `0 0 20px rgba(0, 191, 255, 0.3)` : 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                    opacity: dimmed ? 0.15 : 1,
                    transition: 'opacity 0.3s, box-shadow 0.3s',
                    userSelect: 'none'
                  }}
                >
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: CATEGORY_COLORS[node.category] || '#888',
                    margin: '0 auto 4px auto'
                  }} />
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#ccc', lineHeight: '1.3', wordBreak: 'break-word' }}>
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viewport Info */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          fontSize: '10px', color: '#444', fontFamily: 'JetBrains Mono, monospace',
          display: 'flex', gap: '16px'
        }}>
          <span>Zoom: {Math.round(viewport.scale * 100)}%</span>
          <span>Nodes: {allPositioned.length}</span>
          <span>Edges: {edges.length}</span>
        </div>

        {/* Category Legend */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          padding: '12px', borderRadius: '8px', border: '1px solid #222'
        }}>
          <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px', letterSpacing: '1px' }}>Legend</div>
          {systemMapData.categories.filter(c => c.count > 0).map(cat => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#aaa' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
              <span>{cat.label}</span>
              <span style={{ color: '#555', marginLeft: 'auto' }}>{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              borderLeft: '1px solid #222', background: '#0a0a0a',
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: CATEGORY_COLORS[selectedNode.category] || '#888' }} />
                    <span style={{ fontSize: '10px', color: CATEGORY_COLORS[selectedNode.category] || '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>
                      {selectedNode.category}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{selectedNode.label}</h3>
                </div>
                <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' }}>
                  <DismissRegular />
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { label: 'Lines', value: selectedNode.lines || '—' },
                  { label: 'Functions', value: selectedNode.functions || '—' },
                  { label: 'Hooks', value: selectedNode.hooks || '—' },
                  { label: 'Path', value: selectedNode.path?.split('/').pop() || '—' }
                ].map(s => (
                  <div key={s.label} style={{ background: '#111', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Depends On */}
              {selectedConnections?.dependsOn.length > 0 && (
                <div>
                  <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                    Depends On ({selectedConnections.dependsOn.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedConnections.dependsOn.map(dep => (
                      <div key={dep} style={{ fontSize: '12px', color: '#aaa', padding: '6px 8px', background: '#111', borderRadius: '4px' }}>
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Used By */}
              {selectedConnections?.usedBy.length > 0 && (
                <div>
                  <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                    Used By ({selectedConnections.usedBy.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedConnections.usedBy.map(dep => (
                      <div key={dep} style={{ fontSize: '12px', color: '#aaa', padding: '6px 8px', background: '#111', borderRadius: '4px' }}>
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
