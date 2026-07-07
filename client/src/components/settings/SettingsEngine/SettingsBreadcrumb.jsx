import React from 'react';
import { ChevronRightRegular } from '@fluentui/react-icons';

export const SettingsBreadcrumb = ({ path }) => {
  if (!path || path.length === 0) return null;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      marginBottom: 'var(--ds-space-2xl)',
      color: 'var(--ds-text-secondary)',
      fontSize: 'var(--ds-text-sm)',
      fontWeight: '500'
    }}>
      <span style={{ color: 'var(--ds-text-primary)' }}>Settings</span>
      
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRightRegular fontSize={14} />
          <span style={{ 
            color: index === path.length - 1 ? 'var(--ds-text-primary)' : 'var(--ds-text-secondary)'
          }}>
            {segment}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
