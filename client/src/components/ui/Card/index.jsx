import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cardMotion } from '../../../animations/CardMotion';
import './Card.css';

/**
 * Enterprise UI Component: Card
 * Supports: Glass variant, Interactive states, Headers, Footers
 */
export const Card = forwardRef(({
  children,
  glass = false,
  interactive = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  
  const classNames = [
    'ds-card',
    glass ? 'ds-glass' : '',
    interactive ? 'ds-card-interactive ds-focusable' : '',
    className
  ].filter(Boolean).join(' ');

  const MotionTag = interactive ? motion.button : motion.div;

  return (
    <MotionTag
      ref={ref}
      className={classNames}
      onClick={onClick}
      initial={cardMotion.initial}
      animate={cardMotion.animate}
      whileHover={interactive ? cardMotion.hover : {}}
      whileTap={interactive ? cardMotion.tap : {}}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </MotionTag>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ title, description, children, className = '' }) => (
  <div className={`ds-card-header ${className}`}>
    <div>
      {title && <h3 className="ds-card-title">{title}</h3>}
      {description && <div className="ds-card-description">{description}</div>}
    </div>
    {children && <div>{children}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`ds-card-content ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`ds-card-footer ${className}`}>
    {children}
  </div>
);
