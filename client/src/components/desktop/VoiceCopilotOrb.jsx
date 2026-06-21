import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import { voiceController } from '../../ai/voice/voiceController';
import { MicRegular } from '@fluentui/react-icons';

function WaveformCanvas({ isSpeaking, isListening }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      const numBars = 12;
      const barWidth = 4;
      const gap = 4;
      const totalWidth = (numBars * barWidth) + ((numBars - 1) * gap);
      const startX = (width - totalWidth) / 2;

      ctx.fillStyle = isSpeaking ? '#0078d4' : (isListening ? '#00ff88' : '#666');

      for (let i = 0; i < numBars; i++) {
        const x = startX + i * (barWidth + gap);
        // Base height
        let h = 4; 
        if (isSpeaking || isListening) {
          // Animated height
          const noise = Math.sin(phase + i * 0.5) * Math.cos(phase * 1.5 + i * 0.2);
          const intensity = isSpeaking ? 1 : 0.4;
          h = 4 + Math.abs(noise) * (height - 8) * intensity;
        }

        const y = centerY - h / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 2);
        ctx.fill();
      }

      phase += 0.15;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpeaking, isListening]);

  return <canvas ref={canvasRef} width={100} height={40} style={{ width: '50px', height: '20px' }} />;
}

export default function VoiceCopilotOrb() {
  const { isOrbOpen, isListening, isSpeaking } = useVoiceStore();

  useEffect(() => {
    // Init voice controller on mount to set up wake word listener if alwaysListening is true
    voiceController.init();
  }, []);

  if (!isOrbOpen) return null;

  let stateIcon = <MicRegular fontSize={24} color="#0078d4" />;
  let stateText = 'Idle';
  let pulse = false;

  if (isSpeaking) {
    stateIcon = <WaveformCanvas isSpeaking={true} isListening={false} />;
    stateText = 'Speaking...';
  } else if (isListening) {
    stateIcon = <WaveformCanvas isSpeaking={false} isListening={true} />;
    stateText = 'Listening...';
    pulse = true;
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={() => voiceController.toggleListening()}
        style={{
          position: 'fixed',
          bottom: 'max(80px, calc(var(--taskbar-height) + 20px))',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--mica-base)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border)',
          boxShadow: pulse ? '0 0 15px rgba(0, 255, 136, 0.4)' : 'var(--shadow-window)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9900, // Above windows, below system overlays
          transition: 'all 0.3s ease',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Voice Copilot (${stateText})`}
      >
        {pulse && (
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(0, 255, 136, 0.3)',
              zIndex: -1
            }}
          />
        )}
        {stateIcon}
      </motion.button>
    </AnimatePresence>
  );
}
