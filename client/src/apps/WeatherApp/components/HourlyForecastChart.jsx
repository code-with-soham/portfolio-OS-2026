import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { InfoRegular } from '@fluentui/react-icons';

export const HourlyForecastChart = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  // Format data for Recharts
  const data = hourlyData.slice(0, 12).map((hour, idx) => ({
    time: idx === 0 ? 'Now' : new Date(hour.dt).toLocaleTimeString([], { hour: 'numeric' }),
    temp: Math.round(hour.temp),
    rain: hour.rainChance || 0,
    icon: hour.icon
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{payload[0].payload.time}</div>
          <div>Temp: {payload[0].value}°C</div>
          {payload[0].payload.rain > 0 && <div>Rain: {payload[0].payload.rain}%</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassPanel style={{ padding: 'var(--ds-space-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--ds-space-lg)', color: 'white', opacity: 0.8 }}>
        <InfoRegular fontSize={16} />
        <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase' }}>Hourly Forecast</span>
      </div>
      
      <div style={{ width: '100%', height: '140px', overflowX: 'auto', overflowY: 'hidden' }}>
        <AreaChart width={600} height={140} data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
            dy={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="#fff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#tempGradient)" 
          />
        </AreaChart>
      </div>
    </GlassPanel>
  );
};
