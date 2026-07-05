import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Immutable Standard: Top Loader 2px Height
export const ProgressBar = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Stall at 90% until loaded
          return prev + Math.random() * 15;
        });
      }, 300);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '2px', backgroundColor: 'transparent', zIndex: 1000 }}>
      <AnimatePresence>
        {(isLoading || progress === 100) && (
          <motion.div
            initial={{ opacity: 1, width: '0%' }}
            animate={{ width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (progress === 100) {
                // Wait briefly before hiding
                setTimeout(() => setProgress(0), 200);
              }
            }}
            style={{
              height: '100%',
              backgroundColor: 'var(--ds-accent)', // Blue loader like Chrome
              boxShadow: '0 0 4px var(--ds-accent)'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
