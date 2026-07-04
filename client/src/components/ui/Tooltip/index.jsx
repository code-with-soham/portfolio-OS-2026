import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tooltipMotion } from '../../../animations/TooltipMotion';
import './Tooltip.css';

/**
 * Enterprise UI Component: Tooltip
 */
export const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  return (
    <div 
      className="ds-tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            className={`ds-tooltip ds-tooltip-${position} ${className}`}
            initial={tooltipMotion.initial}
            animate={tooltipMotion.animate}
            exit={tooltipMotion.exit}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
