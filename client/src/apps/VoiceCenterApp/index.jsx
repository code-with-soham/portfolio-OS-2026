import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import { MicRegular, DeleteRegular, SettingsRegular } from '@fluentui/react-icons';
import './VoiceCenterApp.css';

export default function VoiceCenterApp() {
  const { history, clearHistory, voiceEnabled, alwaysListening } = useVoiceStore();

  return (
    <div className="voice-center-app" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MicRegular color="var(--color-accent)" /> Voice Center History
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            A log of all interactions with the VS-36 AI Voice Copilot.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={clearHistory} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DeleteRegular /> Clear History
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {history.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
            <MicRegular fontSize={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p>No voice interactions yet.</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Press Ctrl + Shift + V or say "Hey Portfolio" to start.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="history-entry"
                style={{
                  background: 'var(--color-bg-surface)',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <span>{entry.time}</span>
                  <span>Confidence: {entry.confidence}%</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>User: "{entry.command}"</p>
                <div style={{ background: 'var(--color-bg-surface-hover)', padding: '12px', borderRadius: '6px' }}>
                  <p style={{ margin: 0, color: 'var(--color-accent)' }}>AI: {entry.response}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
