// src/animations/WindowMotion.js

export const windowMotion = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  drag: {
    scale: 1.01,
    boxShadow: "var(--ds-shadow-xl)",
    cursor: "grabbing"
  }
};
