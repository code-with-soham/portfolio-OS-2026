import React from 'react';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import * as FluentIcons from '@fluentui/react-icons';

export const WeatherMetricCard = ({ icon, title, value, unit, description }) => {
  const IconComponent = FluentIcons[icon] || FluentIcons.InfoRegular;

  return (
    <GlassPanel style={{ padding: 'var(--ds-space-md)', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7, marginBottom: 'var(--ds-space-md)' }}>
        <IconComponent fontSize={14} />
        <span style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>{title}</span>
      </div>
      
      <div style={{ fontSize: '28px', fontWeight: '400', marginBottom: 'var(--ds-space-xs)' }}>
        {value}
        {unit && <span style={{ fontSize: '16px', marginLeft: '2px' }}>{unit}</span>}
      </div>
      
      {description && (
        <div style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.4' }}>
          {description}
        </div>
      )}
    </GlassPanel>
  );
};
