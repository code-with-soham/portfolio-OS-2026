import React from 'react';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { CalendarRegular } from '@fluentui/react-icons';
import { motion } from 'framer-motion';

export const TenDayForecast = ({ dailyData }) => {
  if (!dailyData || dailyData.length === 0) return null;

  // Find absolute min/max across all days for the gradient bar
  const allLows = dailyData.map(d => d.low);
  const allHighs = dailyData.map(d => d.high);
  const minTemp = Math.min(...allLows);
  const maxTemp = Math.max(...allHighs);
  const range = maxTemp - minTemp;

  return (
    <GlassPanel style={{ padding: 'var(--ds-space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--ds-space-lg)', color: 'white', opacity: 0.8 }}>
        <CalendarRegular fontSize={16} />
        <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase' }}>5-Day Forecast</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-md)' }}>
        {dailyData.map((day, idx) => {
          // Calculate percentages for the gradient bar
          const leftPercent = ((day.low - minTemp) / range) * 100;
          const widthPercent = ((day.high - day.low) / range) * 100;

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: idx < dailyData.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                color: 'white'
              }}
            >
              <div style={{ width: '60px', fontWeight: idx === 0 ? '600' : '400' }}>
                {idx === 0 ? 'Today' : day.day}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', width: '40px', justifyContent: 'center' }}>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                  alt="icon" 
                  style={{ width: '32px', height: '32px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px', paddingLeft: '16px' }}>
                <span style={{ width: '24px', textAlign: 'right', opacity: 0.7, fontSize: '14px' }}>
                  {day.low}°
                </span>
                
                {/* Visual Temperature Bar */}
                <div style={{ 
                  flex: 1, 
                  height: '6px', 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  borderRadius: '3px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    height: '100%',
                    borderRadius: '3px',
                    background: 'linear-gradient(90deg, rgba(135,206,235,1) 0%, rgba(255,165,0,1) 100%)'
                  }} />
                </div>
                
                <span style={{ width: '24px', fontWeight: '500', fontSize: '14px' }}>
                  {day.high}°
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
};
