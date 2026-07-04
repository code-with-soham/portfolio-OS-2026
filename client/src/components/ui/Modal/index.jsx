import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayMotion } from '../../../animations/OverlayMotion';
import { dialogMotion } from '../../../animations/DialogMotion';
import './Modal.css';

/**
 * Enterprise UI Component: Modal
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
  hideClose = false
}) => {

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ds-overlay-container" style={{ position: 'relative', zIndex: 9999 }}>
          <motion.div
            className="ds-overlay"
            initial={overlayMotion.initial}
            animate={overlayMotion.animate}
            exit={overlayMotion.exit}
            transition={overlayMotion.transition}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className={`ds-modal ${className}`}
              initial={dialogMotion.initial}
              animate={dialogMotion.animate}
              exit={dialogMotion.exit}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || !hideClose) && (
                <div className="ds-modal-header">
                  {title && <h2 className="ds-modal-title">{title}</h2>}
                  {!hideClose && (
                    <button className="ds-modal-close ds-focusable" onClick={onClose} aria-label="Close modal">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              <div className="ds-modal-content ds-scrollbar">
                {children}
              </div>

              {footer && (
                <div className="ds-modal-footer">
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
