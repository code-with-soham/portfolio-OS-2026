import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayRegular, DismissRegular } from '@fluentui/react-icons';
import simulationsData from '../../../ai/knowledge/architecture/simulations.json';

const STATUS_COLORS = {
  waiting: '#333',
  active: 'var(--color-accent, #00bfff)',
  passed: '#4CAF50'
};

function SimNode({ node, status, index }) {
  const isActive = status === 'active';
  const isPassed = status === 'passed';

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '16px 20px', borderRadius: '12px',
        background: isActive ? 'rgba(0, 191, 255, 0.08)' : isPassed ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? 'rgba(0, 191, 255, 0.3)' : isPassed ? 'rgba(76, 175, 80, 0.2)' : '#222'}`,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Status Dot */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.4, 1] : 1,
          boxShadow: isActive ? '0 0 16px rgba(0, 191, 255, 0.6)' : 'none'
        }}
        transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
        style={{
          width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
          background: STATUS_COLORS[status]
        }}
      />

      {/* Icon */}
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{node.icon}</span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: isActive || isPassed ? '#fff' : '#aaa' }}>
          {node.label}
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {node.description}
        </div>
      </div>

      {/* Duration */}
      <div style={{ fontSize: '11px', color: isPassed ? '#4CAF50' : '#555', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
        {isPassed ? `${node.duration}ms` : isActive ? 'Running...' : `~${node.duration}ms`}
      </div>
    </motion.div>
  );
}

function StatusLog({ logs }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logRef}
      style={{
        background: '#0d0d0d', border: '1px solid #222', borderRadius: '8px',
        padding: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
        height: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px'
      }}
      className="custom-scrollbar"
    >
      {logs.length === 0 && <span style={{ color: '#444' }}>// Waiting for simulation to start...</span>}
      {logs.map((log, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ color: log.type === 'success' ? '#4CAF50' : log.type === 'active' ? '#00bfff' : '#888' }}
        >
          <span style={{ color: '#555' }}>[{log.time}]</span>{' '}
          <span style={{ color: log.type === 'success' ? '#4CAF50' : '#00bfff' }}>{log.label}</span>{' '}
          <span style={{ color: '#666' }}>— {log.message}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function SimulationMode() {
  const [selectedSim, setSelectedSim] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState([]);
  const [totalTime, setTotalTime] = useState(0);

  const simulations = simulationsData.simulations;

  const startSimulation = (sim) => {
    setSelectedSim(sim);
    setActiveStep(0);
    setIsPlaying(true);
    setLogs([]);
    setTotalTime(0);

    let step = 0;
    let elapsed = 0;

    const runStep = () => {
      if (step >= sim.nodes.length) {
        setIsPlaying(false);
        setLogs(prev => [...prev, {
          time: `${elapsed}ms`,
          label: '✅ COMPLETE',
          message: `Simulation finished in ${elapsed}ms`,
          type: 'success'
        }]);
        return;
      }

      const node = sim.nodes[step];
      setActiveStep(step);
      elapsed += node.duration;
      setTotalTime(elapsed);

      setLogs(prev => [...prev, {
        time: `${elapsed}ms`,
        label: node.label,
        message: node.description,
        type: 'active'
      }]);

      step++;
      setTimeout(runStep, node.duration);
    };

    runStep();
  };

  const getNodeStatus = (index) => {
    if (index < activeStep) return 'passed';
    if (index === activeStep) return 'active';
    return 'waiting';
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left Panel — Simulation Library */}
      <div style={{
        width: '280px', borderRight: '1px solid #222', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto'
      }} className="custom-scrollbar">
        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, padding: '0 8px', marginBottom: '8px', letterSpacing: '1px' }}>
          Simulation Library
        </div>
        {simulations.map(sim => {
          const isSelected = selectedSim?.id === sim.id;
          return (
            <button
              key={sim.id}
              onClick={() => { if (!isPlaying) { setSelectedSim(sim); setActiveStep(-1); setLogs([]); } }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '8px', border: 'none', textAlign: 'left',
                background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: isSelected ? '#fff' : '#aaa', cursor: isPlaying ? 'default' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { if (!isSelected && !isPlaying) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '22px' }}>{sim.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{sim.title}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{sim.nodes.length} steps</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Panel — Execution View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {selectedSim ? (
          <>
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #222',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{selectedSim.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{selectedSim.title}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888' }}>{selectedSim.description}</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {totalTime > 0 && (
                  <span style={{ fontSize: '12px', color: '#4CAF50', fontFamily: 'JetBrains Mono, monospace' }}>
                    {totalTime}ms total
                  </span>
                )}
                <button
                  onClick={() => startSimulation(selectedSim)}
                  disabled={isPlaying}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: isPlaying ? '#222' : 'var(--color-accent, #00bfff)',
                    color: isPlaying ? '#666' : '#000', border: 'none',
                    padding: '10px 20px', borderRadius: '8px',
                    cursor: isPlaying ? 'default' : 'pointer', fontWeight: 600, fontSize: '13px'
                  }}
                >
                  <PlayRegular /> {isPlaying ? 'Running...' : 'Run Simulation'}
                </button>
              </div>
            </div>

            {/* Execution Pipeline */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="custom-scrollbar">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '700px', margin: '0 auto' }}>
                {selectedSim.nodes.map((node, i) => (
                  <div key={node.id}>
                    <SimNode node={node} status={getNodeStatus(i)} index={i} />
                    {/* Edge connector */}
                    {i < selectedSim.nodes.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px', position: 'relative' }}>
                        <div style={{ width: '2px', height: '100%', background: activeStep > i ? '#4CAF50' : '#222' }} />
                        {activeStep === i && (
                          <motion.div
                            animate={{ top: ['0%', '100%'], opacity: [1, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                            style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', background: '#00bfff' }}
                          />
                        )}
                        {selectedSim.edges[i] && (
                          <span style={{ position: 'absolute', left: '52%', fontSize: '10px', color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>
                            {selectedSim.edges[i].label}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Status Log */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #222' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>
                Execution Log
              </div>
              <StatusLog logs={logs} />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px' }}>🎬</span>
            <div style={{ fontSize: '18px', color: '#888', fontWeight: 500 }}>Select a simulation</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Choose from the library to see how Portfolio OS executes actions.</div>
          </div>
        )}
      </div>
    </div>
  );
}
