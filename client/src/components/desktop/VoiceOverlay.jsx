import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceStore } from '../../store/useVoiceStore';
import { voiceController } from '../../ai/voice/voiceController';
import { DismissRegular } from '@fluentui/react-icons';

function LargeWaveform({ isSpeaking, isListening }) {
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
      
      const numBars = 30;
      const barWidth = 6;
      const gap = 8;
      const totalWidth = (numBars * barWidth) + ((numBars - 1) * gap);
      const startX = (width - totalWidth) / 2;

      ctx.fillStyle = isSpeaking ? '#0078d4' : (isListening ? '#00ff88' : '#666');

      for (let i = 0; i < numBars; i++) {
        const x = startX + i * (barWidth + gap);
        let h = 8; 
        if (isSpeaking || isListening) {
          const noise = Math.sin(phase + i * 0.4) * Math.cos(phase * 1.2 + i * 0.15);
          const intensity = isSpeaking ? 1 : 0.6;
          h = 8 + Math.abs(noise) * (height - 16) * intensity;
        }

        const y = centerY - h / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 3);
        ctx.fill();
      }

      phase += 0.1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpeaking, isListening]);

  return <canvas ref={canvasRef} width={600} height={100} style={{ width: '100%', maxWidth: '600px', height: '100px' }} />;
}

export default function VoiceOverlay() {
  const { isOverlayOpen, transcript, confidence, isSpeaking, isListening } = useVoiceStore();

  if (!isOverlayOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9950,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'var(--font-family)',
        }}
      >
        <button
          onClick={() => voiceController.stopActiveListening()}
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <DismissRegular fontSize={32} />
        </button>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '20px' }}>
          What can I help with?
        </h1>

        <LargeWaveform isSpeaking={isSpeaking} isListening={isListening} />

        <div style={{ minHeight: '80px', marginTop: '40px', textAlign: 'center', maxWidth: '800px' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 500, margin: 0 }}>
            {transcript || 'Listening...'}
          </p>
          {confidence > 0 && transcript && (
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              Confidence: {confidence}%
            </p>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: '80px', textAlign: 'center', opacity: 0.7 }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Try saying:</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="suggestion-pill">• Open Projects</span>
            <span className="suggestion-pill">• Show Resume</span>
            <span className="suggestion-pill">• Explain Architecture</span>
            <span className="suggestion-pill">• Show Best Project</span>
            <span className="suggestion-pill">• Take Me Through Your Work</span>
            <span className="suggestion-pill">• Interview Me</span>
          </div>
        </div>

        <style>{`
          .suggestion-pill {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 1rem;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
