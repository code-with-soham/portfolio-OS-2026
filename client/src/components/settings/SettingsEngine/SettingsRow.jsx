import React from 'react';
import { SettingsControl } from './SettingsControl';
import * as FluentIcons from '@fluentui/react-icons';
import { motion } from 'framer-motion';

/**
 * Renders a single row in a Settings Card.
 */
export const SettingsRow = ({ setting, value, onChange, disabled }) => {
  // Dynamically resolve Fluent UI icon from string name
  const IconComponent = setting.icon ? FluentIcons[setting.icon] : null;

  return (
    <motion.div 
      className="ds-transition-hover"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: 'var(--ds-space-lg) var(--ds-space-xl)',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        position: 'relative'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ds-surface)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-lg)', flex: 1 }}>
        {/* Optional Icon */}
        {IconComponent && (
          <div style={{ 
            width: '32px', height: '32px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--ds-surface)',
            borderRadius: 'var(--ds-radius-md)',
            color: 'var(--ds-text-secondary)',
            flexShrink: 0
          }}>
            <IconComponent fontSize={18} />
          </div>
        )}
        
        {/* Title, Description & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-sm)' }}>
            <span style={{ fontWeight: '500', color: 'var(--ds-text-primary)' }}>{setting.title}</span>
            
            {/* Badges */}
            {setting.requiresRestart && (
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--ds-warning-alpha)', color: 'var(--ds-warning)' }}>Restart</span>
            )}
            {setting.experimental && (
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--ds-danger-alpha)', color: 'var(--ds-danger)' }}>Experimental</span>
            )}
            {setting.enterprise && (
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--ds-accent-alpha)', color: 'var(--ds-accent)' }}>Enterprise</span>
            )}
          </div>
          
          {setting.description && (
            <span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', lineHeight: 1.4 }}>
              {setting.description}
            </span>
          )}
        </div>
      </div>

      {/* Control mapped based on schema type */}
      <div style={{ flexShrink: 0, marginLeft: 'var(--ds-space-xl)' }}>
        <SettingsControl 
          setting={setting} 
          value={value} 
          onChange={onChange}
        />
      </div>
    </motion.div>
  );
};
