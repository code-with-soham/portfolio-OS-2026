import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayMotion } from '../../../animations/OverlayMotion';
import { drawerMotion } from '../../../animations/DialogMotion';
import './Drawer.css';

/**
 * Enterprise UI Component: Drawer
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  className = '',
  hideClose = false
}) => {

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const motionVariants = drawerMotion[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ds-overlay-container" style={{ position: 'relative', zIndex: 9999 }}>
          <motion.div
            className="ds-overlay"
            style={{ padding: 0 }}
            initial={overlayMotion.initial}
            animate={overlayMotion.animate}
            exit={overlayMotion.exit}
            transition={overlayMotion.transition}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className={`ds-drawer ds-drawer-${side} ${className}`}
              initial={motionVariants.initial}
              animate={motionVariants.animate}
              exit={motionVariants.exit}
              transition={motionVariants.transition}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || !hideClose) && (
                <div className="ds-modal-header">
                  {title && <h2 className="ds-modal-title">{title}</h2>}
                  {!hideClose && (
                    <button className="ds-modal-close ds-focusable" onClick={onClose} aria-label="Close drawer">
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
