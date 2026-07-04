import { forwardRef } from 'react';

/**
 * Enterprise UI Component: GlassPanel
 * Specialized container that enforces standard glassmorphism tokens
 */
export const GlassPanel = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  const classNames = [
    'ds-glass-panel',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classNames} {...props}>
      {children}
    </div>
  );
});

GlassPanel.displayName = 'GlassPanel';
