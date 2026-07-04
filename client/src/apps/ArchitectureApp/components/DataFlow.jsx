import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayRegular } from '@fluentui/react-icons';
import dataFlowData from '../../../ai/knowledge/architecture/data-flow.json';

function FlowVisualizer({ flow, onComplete }) {
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    let step = 0;
    setActiveStep(0);
    const interval = setInterval(() => {
      step++;
      if (step >= flow.steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1000); // 1s pause before completing
      } else {
        setActiveStep(step);
      }
    }, 1200); // 1.2s per step

    return () => clearInterval(interval);
  }, [flow, onComplete]);

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
        {flow.steps.map((step, i) => {
          const isActive = activeStep === i;
          const isPassed = activeStep > i;

          return (
            <div key={i} style={{ display: 'flex', gap: '24px' }}>
              {/* Timeline Connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isActive ? '#00bfff' : isPassed ? '#4CAF50' : '#333',
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive ? '0 0 16px rgba(0, 191, 255, 0.4)' : 'none'
                  }}
                  style={{ width: '16px', height: '16px', borderRadius: '50%', zIndex: 2 }}
                />
                {i < flow.steps.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: isPassed ? '#4CAF50' : '#222', margin: '4px 0' }} />
                )}
              </div>

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isPassed || isActive ? 1 : 0.3, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  flex: 1, padding: '16px', borderRadius: '12px',
                  background: isActive ? 'rgba(0, 191, 255, 0.08)' : isPassed ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? 'rgba(0, 191, 255, 0.3)' : isPassed ? 'rgba(76, 175, 80, 0.2)' : '#222'}`,
                  marginBottom: i < flow.steps.length - 1 ? '16px' : 0,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.3s ease, background 0.3s ease, border 0.3s ease'
                }}
              >
                <div style={{ fontSize: '11px', color: isActive ? '#00bfff' : isPassed ? '#4CAF50' : '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>
                  Step {i + 1}
                </div>
                <div style={{ fontSize: '14px', color: isActive || isPassed ? '#fff' : '#888', fontWeight: 500 }}>
                  {step}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DataFlow() {
  const [selectedFlow, setSelectedFlow] = useState(dataFlowData.flows[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [runKey, setRunKey] = useState(0); // Used to force re-render/re-run of FlowVisualizer

  const handlePlay = (flow) => {
    setSelectedFlow(flow);
    setIsPlaying(true);
    setRunKey(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left Panel - Flow List */}
      <div style={{ width: '280px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="custom-scrollbar">
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #222' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Data Flow</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>Unidirectional data pipelines</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: '8px' }}>
          {dataFlowData.flows.map(flow => {
            const isSelected = selectedFlow.id === flow.id;
            return (
              <button
                key={flow.id}
                onClick={() => { if (!isPlaying) setSelectedFlow(flow); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '8px', border: 'none', textAlign: 'left',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isSelected ? '#fff' : '#aaa', cursor: isPlaying ? 'default' : 'pointer'
                }}
                onMouseEnter={e => { if (!isSelected && !isPlaying) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '20px' }}>{flow.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{flow.title}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{flow.steps.length} steps</div>
                </div>
                {!isPlaying && isSelected && (
                  <PlayRegular style={{ color: '#00bfff', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); handlePlay(flow); }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Visualization */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{selectedFlow.icon}</span> {selectedFlow.title}
            </h1>
          </div>
          <button
            onClick={() => handlePlay(selectedFlow)}
            disabled={isPlaying}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: isPlaying ? '#222' : 'rgba(0, 191, 255, 0.15)',
              color: isPlaying ? '#666' : '#00bfff',
              border: `1px solid ${isPlaying ? '#333' : 'rgba(0, 191, 255, 0.3)'}`,
              padding: '8px 16px', borderRadius: '8px', cursor: isPlaying ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '13px'
            }}
          >
            <PlayRegular /> {isPlaying ? 'Simulating...' : 'Play Flow'}
          </button>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid #222', fontSize: '13px', color: '#aaa', lineHeight: '1.6', marginBottom: '32px' }}>
          {selectedFlow.id === 'weather' ? 'Fetches live weather data via OpenWeather API, caches it in Zustand, and updates the widget.' :
           selectedFlow.id === 'github' ? 'Fetches GitHub repositories, maps them to UI models, and renders the portfolio list.' :
           selectedFlow.id === 'analytics' ? 'Batches user interactions locally and flushes them to the MongoDB backend via Express.' :
           selectedFlow.id === 'voice' ? 'Captures microphone input, parses intent using local NLP, and executes OS commands.' :
           selectedFlow.id === 'browser' ? 'Validates URLs, updates history stack, and renders remote content inside the iframe sandbox.' :
           selectedFlow.id === 'presentation' ? 'Activates fullscreen mode, mounts JourneyMode, and starts the auto-advance timer.' :
           selectedFlow.id === 'widgets' ? 'Loads widget preferences from localStorage, hydrates the store, and mounts the panel.' :
           'Loads custom context and tailors the OS experience for potential recruiters.'}
        </div>

        {isPlaying ? (
          <FlowVisualizer key={runKey} flow={selectedFlow} onComplete={() => setIsPlaying(false)} />
        ) : (
          <div style={{ padding: '32px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
              {selectedFlow.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', zIndex: 2, background: '#222', border: '2px solid #333' }} />
                    {i < selectedFlow.steps.length - 1 && (
                      <div style={{ width: '2px', flex: 1, background: '#222', margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{
                    flex: 1, padding: '16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid #222',
                    marginBottom: i < selectedFlow.steps.length - 1 ? '16px' : 0
                  }}>
                    <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>
                      Step {i + 1}
                    </div>
                    <div style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>
                      {step}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
