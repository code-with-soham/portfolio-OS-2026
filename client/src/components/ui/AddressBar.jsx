import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Immutable Standard:
// Height: 38px
// Radius: 999px
// Padding: 0 16px
// Icon: 16px
// Focus: Glow, Scale 1.01

export const AddressBar = ({ 
  value, 
  onChange, 
  onSubmit, 
  iconLeft, 
  iconRight, 
  placeholder,
  suggestions = [],
  onSelectSuggestion,
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

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', margin: '0 8px', ...containerStyle }}>
      <motion.form 
        onSubmit={(e) => {
          e.preventDefault();
          setIsFocused(false);
          onSubmit(e);
        }}
        initial={false}
        animate={{ 
          scale: isFocused ? 1.01 : 1,
          boxShadow: isFocused ? '0 0 0 2px var(--ds-accent)' : '0 0 0 0px transparent',
          backgroundColor: isFocused ? 'var(--ds-bg-primary)' : 'var(--ds-surface)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '38px',
          borderRadius: '999px',
          padding: '0 16px',
          gap: '8px',
          border: isFocused ? '1px solid transparent' : '1px solid var(--ds-border)'
        }}
      >
        {iconLeft && (
          <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-text-secondary)' }}>
            {iconLeft}
          </div>
        )}
        <input 
          id="browser-address-input"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          spellCheck="false"
          autoComplete="off"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--ds-text-primary)',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
        {iconRight && (
          <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-text-secondary)' }}>
            {iconRight}
          </div>
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
                   onSelectSuggestion(s);
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
