import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { useMusicStore } from '../../store/useMusicStore';
import { SparkleRegular, SendRegular, BotRegular, DocumentRegular, AppFolderRegular, GlobeRegular, PlayRegular } from '@fluentui/react-icons';
import { aiBrain } from '../../ai/brain/aiBrain';

export default function UniversalSpotlight() {
  const { isUniversalSpotlightOpen, closeUniversalSpotlight, toggleAIAssistant } = useDesktopStore();
  const { openWindow } = useWindowStore();
  const { togglePlayPause } = useMusicStore();
  
  const [query, setQuery] = useState('');
  const [actionHint, setActionHint] = useState('');
  const [icon, setIcon] = useState(<SparkleRegular />);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isUniversalSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActionHint('');
    }
  }, [isUniversalSpotlightOpen]);

  // Natural language parsing as user types
  useEffect(() => {
    const q = query.toLowerCase();
    
    if (q.includes('resume') && (q.includes('open') || q.includes('show'))) {
      setActionHint('Press Enter to open Resume');
      setIcon(<DocumentRegular color="#0078d4" />);
    } else if ((q.includes('project') || q.includes('work')) && (q.includes('open') || q.includes('show'))) {
      setActionHint('Press Enter to open Projects');
      setIcon(<AppFolderRegular color="#0078d4" />);
    } else if (q.includes('play') || q.includes('music') || q.includes('song')) {
      setActionHint('Press Enter to toggle Music');
      setIcon(<PlayRegular color="#107c10" />);
    } else if (q.includes('browser') || q.includes('web') || q.includes('internet')) {
      setActionHint('Press Enter to open Browser');
      setIcon(<GlobeRegular color="#0078d4" />);
    } else if (q.includes('hire') || q.includes('recruiter')) {
      setActionHint('Press Enter to open Recruiter Mode');
      setIcon(<AppFolderRegular color="#d13438" />);
    } else if (q.trim().length > 2) {
      setActionHint('Press Enter to ask AI Brain');
      setIcon(<BotRegular color="var(--color-accent)" />);
    } else {
      setActionHint('');
      setIcon(<SparkleRegular color="var(--color-text-secondary)" />);
    }
  }, [query]);

  const handleAction = () => {
    const q = query.toLowerCase();
    closeUniversalSpotlight();

    if (q.includes('resume') && (q.includes('open') || q.includes('show'))) {
      openWindow('resume');
    } else if ((q.includes('project') || q.includes('work')) && (q.includes('open') || q.includes('show'))) {
      openWindow('projects');
    } else if (q.includes('play') || q.includes('music') || q.includes('song')) {
      togglePlayPause();
    } else if (q.includes('browser') || q.includes('web') || q.includes('internet')) {
      openWindow('browser');
    } else if (q.includes('hire') || q.includes('recruiter')) {
      openWindow('recruiter');
    } else if (q.trim().length > 2) {
      // Open AI Assistant (we could ideally prefill it, but toggling is fine for now)
      toggleAIAssistant();
    }
  };

  return (
    <AnimatePresence>
      {isUniversalSpotlightOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeUniversalSpotlight}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -40, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: -20, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '25%',
              left: '50%',
              width: 'min(650px, 90vw)',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '24px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'var(--color-bg-elevated)', borderRadius: '8px' }}>
                {icon}
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') closeUniversalSpotlight();
                  if (e.key === 'Enter') handleAction();
                }}
                placeholder="What do you want to do? (e.g. 'open resume')"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '24px',
                  fontWeight: 500
                }}
              />
              <button 
                onClick={handleAction}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: query.trim() ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                  cursor: query.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '50%',
                  transition: 'background 0.2s'
                }}
              >
                <SendRegular fontSize={24} />
              </button>
            </div>
            
            <AnimatePresence>
              {actionHint && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '12px 24px', background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '2px 6px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>↵</div>
                    {actionHint}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
