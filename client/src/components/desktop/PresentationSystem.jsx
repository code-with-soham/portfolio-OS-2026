import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, MODE_F9_PRESENTATION, MODE_F10_DEMO, MODE_NONE } from '../../store/usePresentationStore';
import { BotRegular, DismissRegular, ArrowDownloadRegular, PlayRegular, MailRegular, LinkRegular } from '@fluentui/react-icons';
import { useWindowStore } from '../../store/useWindowStore';
import { usePresentationController } from '../../hooks/usePresentationController';

export default function PresentationSystem() {
  const { activeMode, currentStep, totalSteps, overlayText, isHealthScoreVisible } = usePresentationStore();
  const { killSequence } = usePresentationController();

  if (activeMode === MODE_NONE) return null;

  return (
    <>
      {activeMode === MODE_F9_PRESENTATION && (
        <F9PresentationOverlay 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          text={overlayText} 
          onExit={killSequence}
        />
      )}
      
      {activeMode === MODE_F10_DEMO && (
        <F10DemoCopilot 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          text={overlayText} 
          isHealthScoreVisible={isHealthScoreVisible}
          onExit={killSequence}
        />
      )}

      {/* Dim backdrop layer below the overlays but above desktop apps (z-index managed in CSS or inline) */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          zIndex: 9990
        }}
      />
    </>
  );
}

// F9 Presentation Overlay
function F9PresentationOverlay({ currentStep, totalSteps, text, onExit }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      style={{
        position: 'fixed',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20, 20, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--color-accent)',
        borderRadius: '16px',
        padding: '24px 32px',
        color: '#fff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px var(--color-accent-dim)',
        minWidth: '400px',
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
        Presentation Mode • {currentStep} / {totalSteps}
      </div>
      
      <div style={{ fontSize: '20px', fontWeight: 500, whiteSpace: 'pre-line', lineHeight: 1.5 }}>
        {text}
      </div>

      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '12px', right: '12px',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          padding: '4px'
        }}
      >
        <DismissRegular fontSize={20} />
      </button>
    </motion.div>
  );
}

// F10 Demo Copilot
function F10DemoCopilot({ currentStep, totalSteps, text, isHealthScoreVisible, onExit }) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        background: 'rgba(15, 15, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--color-border)',
        borderTop: '3px solid var(--color-accent)',
        borderRadius: '16px',
        width: '350px',
        color: '#fff',
        zIndex: 9999,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <BotRegular color="var(--color-accent)" fontSize={20} />
          Portfolio Copilot
        </div>
        <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <DismissRegular fontSize={16} />
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          <span>Demo Progress</span>
          <span>{progress}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--color-bg-elevated)', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', background: 'var(--color-accent)' }}
          />
        </div>

        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px', fontWeight: 500 }}>
          Stage: {currentStep}/{totalSteps}
        </div>

        <TypewriterText text={text} key={text} />

        {isHealthScoreVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ marginTop: '24px', padding: '16px', background: 'var(--color-bg-elevated)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(80, 227, 194, 0.3)' }}
          >
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Portfolio Health Score</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent)', margin: '8px 0' }}>92 <span style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>/ 100</span></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
              <ActionButton icon={<ArrowDownloadRegular />} label="Resume" onClick={() => useWindowStore.getState().openWindow('resume')} />
              <ActionButton icon={<LinkRegular />} label="GitHub" onClick={() => window.open('https://github.com/code-with-soham', '_blank')} />
              <ActionButton icon={<LinkRegular />} label="LinkedIn" onClick={() => {}} />
              <ActionButton icon={<MailRegular />} label="Contact" onClick={() => useWindowStore.getState().openWindow('mail')} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        padding: '8px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)',
        borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '12px', cursor: 'pointer'
      }}
    >
      {icon} {label}
    </button>
  );
}

function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <div style={{ 
      fontSize: '15px', 
      lineHeight: 1.6, 
      color: 'var(--color-text-primary)',
      minHeight: '80px',
      whiteSpace: 'pre-line'
    }}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ display: 'inline-block', width: '8px', height: '15px', background: 'var(--color-accent)', marginLeft: '4px', verticalAlign: 'middle' }}
      />
    </div>
  );
}
