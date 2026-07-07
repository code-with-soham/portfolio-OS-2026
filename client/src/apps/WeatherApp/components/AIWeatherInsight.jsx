import React from 'react';
import { GlassPanel } from '../../../components/ui/GlassPanel';
import { SparkleRegular } from '@fluentui/react-icons';
import { motion } from 'framer-motion';

export const AIWeatherInsight = ({ currentWeather, dailyForecast }) => {
  if (!currentWeather || !dailyForecast || dailyForecast.length === 0) return null;

  // Simple heuristic-based AI insight generator (In a real app, this would hit the AI Brain store)
  const generateInsight = () => {
    const isRaining = currentWeather.condition.toLowerCase().includes('rain');
    const isHot = currentWeather.temp > 30;
    const isCold = currentWeather.temp < 10;
    const highTemp = dailyForecast[0].high;

    let text = `Based on today's forecast, it will be mostly ${currentWeather.description.toLowerCase()} with a high of ${highTemp}°. `;
    
    if (isRaining) text += 'Make sure to carry an umbrella and expect potential traffic delays.';
    else if (isHot) text += 'UV Index might be high today, remember to wear sunscreen if you head out.';
    else if (isCold) text += 'Bundle up! It is quite chilly today.';
    else text += 'It looks like a great day for outdoor activities.';

    return text;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <GlassPanel style={{ 
        padding: 'var(--ds-space-lg)', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--ds-space-md)' }}>
          <SparkleRegular fontSize={18} style={{ color: '#fbbf24' }} />
          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', color: '#fbbf24' }}>
            PORTFOLIO AI INSIGHT
          </span>
        </div>
        <p style={{ fontSize: '15px', lineHeight: '1.5', opacity: 0.9 }}>
          {generateInsight()}
        </p>
      </GlassPanel>
    </motion.div>
  );
};
