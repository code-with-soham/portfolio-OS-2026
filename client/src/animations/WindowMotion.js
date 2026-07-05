// src/animations/WindowMotion.js

export const windowMotion = {
  initial: {
    opacity: 0,
    scale: 0.85,
    filter: 'blur(10px)',
    y: 40
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 30,
      mass: 0.8,
      restDelta: 0.001 // Snap effect at the end
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(5px)',
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  },
  drag: {
    scale: 1.01,
    boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
    cursor: "grabbing",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 35
    }
  }
};
