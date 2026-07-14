// ============================================
// Car Experience — Loading Screen
// ============================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneStore } from '../Store/useSceneStore';
import { SCENES, LOADING_MIN_DURATION } from '../Core/constants';

const TIPS = [
  'Use WASD or Arrow Keys to drive',
  'Press C to switch camera modes',
  'Right-click to look around',
  'Visit the Garage to customize your car',
  'Try different weather conditions',
  'Built with React Three Fiber & Rapier Physics',
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const forceScene = useSceneStore((s) => s.forceScene);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / LOADING_MIN_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => forceScene(SCENES.MAIN_MENU), 400);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [forceScene]);

  return (
    <motion.div
      className="car-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="car-loading-content">
        <div className="car-loading-bar-track">
          <motion.div
            className="car-loading-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="car-loading-info">
          <span className="car-loading-pct">{Math.round(progress)}%</span>
          <span className="car-loading-tip">{tip}</span>
        </div>
      </div>
    </motion.div>
  );
}
