import { usePaintStore } from '../store/usePaintStore';
import { AddRegular, DeleteRegular, EyeRegular, EyeOffRegular, ArrowUpRegular, ArrowDownRegular } from '@fluentui/react-icons';

export default function PaintLayersPanel() {
  const { layers, setLayers, activeLayerId, setActiveLayerId } = usePaintStore();

  const addLayer = () => {
    const newId = `layer-${Date.now()}`;
    setLayers([
      { id: newId, name: `Layer ${layers.length + 1}`, visible: true, opacity: 1, isLocked: false },
      ...layers
    ]);
    setActiveLayerId(newId);
  };

  const deleteLayer = (id) => {
    if (layers.length <= 1) return; // Must have at least 1 layer
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayerId === id) {
      setActiveLayerId(newLayers[0].id);
    }
  };

  const toggleVisibility = (id) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const moveLayer = (index, direction) => {
    if (direction === -1 && index === 0) return; // already at top
    if (direction === 1 && index === layers.length - 1) return; // already at bottom

    const newLayers = [...layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[index + direction];
    newLayers[index + direction] = temp;
    setLayers(newLayers);
  };

  return (
    <div className="paint-layers-panel">
      <div className="paint-layers-header">
        <span style={{ fontSize: '12px', fontWeight: '600' }}>Layers</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="paint-layer-btn" onClick={addLayer} title="New Layer"><AddRegular fontSize={14} /></button>
        </div>
      </div>
      
      <div className="paint-layers-list">
        {layers.map((layer, index) => (
          <div 
            key={layer.id} 
            className={`paint-layer-item ${activeLayerId === layer.id ? 'active' : ''}`}
            onClick={() => setActiveLayerId(layer.id)}
          >
            <button 
              className="paint-layer-icon-btn" 
              onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}
            >
              {layer.visible ? <EyeRegular fontSize={14} /> : <EyeOffRegular fontSize={14} color="var(--color-text-secondary)" />}
            </button>
            
            <span className="paint-layer-name">{layer.name}</span>
            
            <div className="paint-layer-actions">
              <button className="paint-layer-icon-btn" onClick={(e) => { e.stopPropagation(); moveLayer(index, -1); }}><ArrowUpRegular fontSize={12} /></button>
              <button className="paint-layer-icon-btn" onClick={(e) => { e.stopPropagation(); moveLayer(index, 1); }}><ArrowDownRegular fontSize={12} /></button>
              <button className="paint-layer-icon-btn" onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} disabled={layers.length <= 1}><DeleteRegular fontSize={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
