// src/animations/DialogMotion.js

export const dialogMotion = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

export const drawerMotion = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};
