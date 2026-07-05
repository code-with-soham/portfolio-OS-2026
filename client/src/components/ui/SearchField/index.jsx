import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OS Primitive: SearchField
 * Variants: 'address', 'search', 'command', 'ai', 'minimal'
 */
export const SearchField = ({ 
  value, 
  onChange, 
  onSubmit, 
  iconLeft, 
  iconRight, 
  placeholder,
  suggestions = [],
  onSelectSuggestion,
  variant = 'search',
  containerStyle = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Variant styling
  const variantStyles = {
    address: { height: '32px', borderRadius: '999px', padding: '0 12px' },
    search: { height: '36px', borderRadius: '18px', padding: '0 16px' },
    command: { height: '48px', borderRadius: '12px', padding: '0 16px', fontSize: '16px' },
    ai: { height: '48px', borderRadius: '24px', padding: '0 20px', border: '1px solid var(--ds-accent)' },
    minimal: { height: '32px', borderRadius: '6px', padding: '0 8px', backgroundColor: 'transparent' }
  };
  const currentStyle = variantStyles[variant] || variantStyles.search;

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', margin: variant === 'address' ? '0' : '0 8px', ...containerStyle }}>
      <motion.form 
        onSubmit={(e) => {
          e.preventDefault();
          setIsFocused(false);
          if(onSubmit) onSubmit(e);
        }}
        initial={false}
        animate={{ 
          scale: isFocused ? 1.01 : 1,
          boxShadow: isFocused ? '0 0 0 2px rgba(66, 133, 244, 0.4)' : '0 0 0 0px transparent', // Chrome-like blue ring
          backgroundColor: isFocused ? 'var(--ds-bg-primary)' : 'var(--ds-surface)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: isFocused ? '1px solid var(--ds-accent)' : '1px solid var(--ds-border)',
          ...currentStyle
        }}
        className="ds-glass-2"
      >
        {iconLeft && (
          <motion.div 
            animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? 'var(--ds-accent)' : 'var(--ds-text-secondary)' }}
            transition={{ duration: 0.18 }} // 180ms
            style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {iconLeft}
          </motion.div>
        )}
        
        <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {!isFocused && !value && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ position: 'absolute', pointerEvents: 'none', color: 'var(--ds-text-secondary)', fontSize: currentStyle.fontSize || '14px', whiteSpace: 'nowrap' }}
              >
                {placeholder}
              </motion.div>
            )}
          </AnimatePresence>
          <input 
            id="os-search-input"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            spellCheck="false"
            autoComplete="off"
            style={{
              flex: 1,
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--ds-text-primary)',
              fontSize: currentStyle.fontSize || '14px',
              fontFamily: 'inherit',
              position: 'relative',
              zIndex: 1, // Above placeholder
              textShadow: isFocused ? '0 0 8px rgba(255,255,255,0.1)' : 'none' // Caret/text glow effect
            }}
          />
        </div>

        {iconRight && (
          <motion.div 
            animate={{ opacity: isFocused ? 1 : 0.7 }}
            style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-text-secondary)' }}
          >
            {iconRight}
          </motion.div>
        )}
      </motion.form>
      
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, 
              backgroundColor: 'var(--ds-bg-primary)', border: '1px solid var(--ds-border)', 
              borderRadius: 'var(--ds-radius-lg)', boxShadow: 'var(--ds-shadow-lg)', zIndex: 1000,
              marginTop: '8px', overflow: 'hidden'
            }}
          >
            {suggestions.map((s, idx) => (
              <div 
                key={idx} 
                style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--ds-text-primary)', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ds-surface)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click fires
                onClick={() => {
                   setIsFocused(false);
                   if (onSelectSuggestion) onSelectSuggestion(s);
                }}
              >
                <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-text-secondary)' }}>
                  {s.icon}
                </div>
                <span style={{ flex: 1, fontSize: '14px' }}>{s.title}</span>
                <span style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>{s.subtitle}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
