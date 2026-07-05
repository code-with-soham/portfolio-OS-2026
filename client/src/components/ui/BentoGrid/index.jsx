import React from 'react';
import { motion } from 'framer-motion';

/**
 * BentoGrid OS Primitive
 * A highly reusable CSS grid system for modern dashboard layouts.
 */
export const BentoGrid = ({ children, className = '', style = {}, columns = 'repeat(auto-fit, minmax(280px, 1fr))' }) => {
  return (
    <div
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: columns,
        gap: '24px',
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
};

/**
 * Standard BentoCard
 * Base container for bento items with glassmorphism level 3.
 */
export const BentoCard = ({ children, className = '', style = {}, span = 1, delay = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      onClick={onClick}
      className={`ds-glass-3 ${className}`}
      style={{
        borderRadius: 'var(--ds-radius-lg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        gridColumn: `span ${span}`,
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Hero variant (usually spans full width or large area)
 */
export const BentoHero = ({ title, subtitle, icon, action, background, style = {} }) => {
  return (
    <BentoCard span={2} style={{ background: background || 'var(--ds-bg-primary)', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {icon && (
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--ds-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </div>
          )}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ds-text-primary)' }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '14px', color: 'var(--ds-text-secondary)' }}>{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </BentoCard>
  );
};

/**
 * Widget variant (small square or rectangle)
 */
export const BentoWidget = ({ title, value, icon, trend, trendUp, style = {} }) => {
  return (
    <BentoCard style={{ justifyContent: 'space-between', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: 'var(--ds-text-secondary)', fontWeight: 500 }}>{title}</span>
        {icon && <div style={{ color: 'var(--ds-text-secondary)' }}>{icon}</div>}
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--ds-text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </div>
        {trend && (
          <div style={{ 
            fontSize: '12px', 
            color: trendUp ? 'var(--ds-success)' : 'var(--ds-danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '4px'
          }}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </BentoCard>
  );
};
