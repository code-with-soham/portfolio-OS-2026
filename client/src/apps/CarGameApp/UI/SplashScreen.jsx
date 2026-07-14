// ============================================
// Car Experience — Splash Screen
// ============================================
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSceneStore } from '../Store/useSceneStore';
import { SCENES, SPLASH_DURATION } from '../Core/constants';

export default function SplashScreen() {
  const forceScene = useSceneStore((s) => s.forceScene);

  useEffect(() => {
    const timer = setTimeout(() => {
      forceScene(SCENES.LOADING);
    }, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [forceScene]);

  return (
    <motion.div
      className="car-splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="car-splash-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
      >
        <div className="car-splash-logo">🏎️</div>
        <h1 className="car-splash-title">VELOCITY</h1>
        <p className="car-splash-subtitle">A Premium Racing Experience</p>
      </motion.div>
      <motion.div
        className="car-splash-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span>Portfolio OS 2026</span>
      </motion.div>
    </motion.div>
  );
}
