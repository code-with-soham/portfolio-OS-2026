import React from 'react';
import { Card } from '../../ui/Card';

/**
 * SettingsCard groups multiple SettingRows together.
 * Chrome style: A single card with rounded corners, items divided by borders.
 */
export const SettingsCard = ({ children, title }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-md)' }}>
      {title && (
        <h3 style={{ 
          fontSize: 'var(--ds-text-md)', 
          fontWeight: '500', 
          color: 'var(--ds-text-primary)',
          paddingLeft: 'var(--ds-space-sm)'
        }}>
          {title}
        </h3>
      )}
      
      <Card style={{ 
        padding: 0, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--ds-shadow-sm)'
      }}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          return (
            <React.Fragment key={index}>
              {child}
              {index < React.Children.count(children) - 1 && (
                <div style={{ height: '1px', backgroundColor: 'var(--ds-border)', width: '100%' }} />
              )}
            </React.Fragment>
          );
        })}
      </Card>
    </div>
  );
};
