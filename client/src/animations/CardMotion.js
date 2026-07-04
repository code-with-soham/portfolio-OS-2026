// src/animations/CardMotion.js

export const cardMotion = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  hover: {
    y: -4,
    boxShadow: "var(--ds-shadow-lg)",
    borderColor: "var(--ds-border-hover)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    y: 0,
    scale: 0.98,
    boxShadow: "var(--ds-shadow-md)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};
