import { useState, useEffect } from 'react';
import LayerNode from './components/LayerNode';
import DetailsPanel from './components/DetailsPanel';
import architectureData from '../../ai/knowledge/architecture.json';
import { PlayRegular, StopRegular } from '@fluentui/react-icons';

export default function ArchitectureApp() {
  const [activeLayerId, setActiveLayerId] = useState(architectureData.layers[0].id);
  const [isJourneyMode, setIsJourneyMode] = useState(false);

  const activeLayer = architectureData.layers.find(l => l.id === activeLayerId);

  // Journey Mode Logic
  useEffect(() => {
    if (!isJourneyMode) return;
    
    let currentIndex = architectureData.layers.findIndex(l => l.id === activeLayerId);
    
    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1);
      
      if (currentIndex >= architectureData.layers.length) {
        setIsJourneyMode(false); // Stop automatically when we hit the end
      } else {
        setActiveLayerId(architectureData.layers[currentIndex].id);
      }
    }, 4500); // 4.5 seconds per layer
    
    return () => clearInterval(timer);
  }, [isJourneyMode, activeLayerId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--mica-base)', overflow: 'hidden' }}>
      {/* Top Bar / Actions */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Architecture Explorer</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Visualize the 7-layer technology stack behind Portfolio OS 2026.</p>
        </div>
        
        <button
          onClick={() => {
            if (!isJourneyMode) {
              setActiveLayerId(architectureData.layers[0].id); // reset to top on start
            }
            setIsJourneyMode(!isJourneyMode);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '24px',
            background: isJourneyMode ? 'var(--color-bg-elevated)' : 'var(--color-accent)',
            color: isJourneyMode ? 'var(--color-accent)' : '#000',
            border: isJourneyMode ? '1px solid var(--color-accent)' : 'none',
            fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px'
          }}
        >
          {isJourneyMode ? <><StopRegular fontSize={20} /> Stop Journey</> : <><PlayRegular fontSize={20} /> Explain Architecture</>}
        </button>
      </div>

      {/* Main Split Content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        
        {/* Left: Stack Visualizer */}
        <div className="custom-scrollbar" style={{ width: '380px', minWidth: '380px', padding: '32px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {architectureData.layers.map((layer, index) => (
            <LayerNode 
              key={layer.id} 
              layer={layer} 
              index={index}
              isActive={activeLayerId === layer.id} 
              onClick={() => {
                setIsJourneyMode(false);
                setActiveLayerId(layer.id);
              }} 
            />
          ))}
        </div>

        {/* Right: Details Panel */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg-surface)' }}>
          <DetailsPanel activeLayer={activeLayer} />
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div style={{ padding: '16px 32px', background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <span><strong style={{ color: 'var(--color-text-primary)' }}>40+</strong> Applications & Components</span>
          <span><strong style={{ color: 'var(--color-text-primary)' }}>20+</strong> Zustand Stores</span>
          <span><strong style={{ color: 'var(--color-text-primary)' }}>100+</strong> React Components</span>
          <span><strong style={{ color: 'var(--color-text-primary)' }}>30+</strong> Keyboard Shortcuts</span>
        </div>
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
          <span>Desktop + Mobile + PWA + AI Brain Integrated</span>
        </div>
      </div>
    </div>
  );
}
