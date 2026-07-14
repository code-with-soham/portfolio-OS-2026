// ============================================
// Car Experience — Transition Manager
// ============================================
// Animated transitions between scenes — no page flashes.
// Uses Framer Motion for fade/zoom/blur overlays.

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import { useSceneStore } from '../Store/useSceneStore';
import { TRANSITION_DURATION } from './constants';

const TRANSITION_VARIANTS = {
  fade: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
  },
  zoom: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 1.1 },
    exit: { opacity: 1, scale: 1 },
  },
  blur: {
    initial: { opacity: 1, filter: 'blur(0px)' },
    animate: { opacity: 0, filter: 'blur(0px)' },
    exit: { opacity: 1, filter: 'blur(20px)' },
  },
};

export default function TransitionManager() {
  const isTransitioning = useSceneStore((s) => s.isTransitioning);
  const transitionType = useSceneStore((s) => s.transitionType);
  const completeTransition = useSceneStore((s) => s.completeTransition);
  const previousScene = useSceneStore((s) => s.previousScene);

  // Get the scene we're transitioning TO
  // We stored it in previousScene as the "from" and need to read the pending target
  const pendingScene = useSceneStore.getState().activeScene;

  const handleTransitionComplete = useCallback(() => {
    if (isTransitioning) {
      // The setScene stores the target in a way we can complete
      // We need to read what scene was requested
    }
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <motion.div
      className="car-transition-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: TRANSITION_DURATION / 1000, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        // After fade-to-black, complete the scene change
        // Then fade back out
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1000,
        background: '#000000',
        pointerEvents: 'none',
      }}
    />
  );
}
