// src/animations/ButtonMotion.js

export const buttonMotion = {
  hover: {
    y: -2,
    boxShadow: "var(--ds-shadow-glow)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    y: 1,
    scale: 0.96,
    boxShadow: "var(--ds-shadow-sm)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};
