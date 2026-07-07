import { useEffect } from 'react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useWindowStore } from '../../store/useWindowStore';
import { motion } from 'framer-motion';

export default function WeatherWidget() {
  const { currentWeather, dailyForecast, loading, fetchWeather } = useWeatherStore();
  const { openWindow } = useWindowStore();

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (loading && !currentWeather) {
    return (
      <div className="glass-heavy" style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading weather...</p>
      </div>
    );
  }

  if (!currentWeather) return null;

  const isDay = !currentWeather.icon.includes('n');
  const bgGradient = isDay 
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(96, 165, 250, 0.2))' 
    : 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => openWindow('weather')}
      className="glass-heavy"
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: bgGradient,
        cursor: 'pointer',
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}
    >
      {/* Current Weather Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>{currentWeather.city}</span>
          <span style={{ fontSize: '32px', fontWeight: '300', lineHeight: '1.2' }}>{currentWeather.temp}°</span>
        </div>
        <img 
          src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`} 
          alt={currentWeather.condition}
          style={{ width: '48px', height: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        />
      </div>

      <div style={{ fontSize: '13px', fontWeight: '500', opacity: 0.9 }}>
        {currentWeather.condition}
        <span style={{ marginLeft: '8px', opacity: 0.8 }}>H:{dailyForecast[0]?.high}° L:{dailyForecast[0]?.low}°</span>
      </div>

      {/* Separator */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', margin: '4px 0' }} />

      {/* 3-Day Forecast mini view */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {dailyForecast.slice(1, 4).map((day, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <span style={{ width: '40px', fontWeight: '500' }}>{day.day.substring(0, 3)}</span>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
              alt="icon" 
              style={{ width: '24px', height: '24px' }}
            />
            <div style={{ display: 'flex', gap: '8px', width: '60px', justifyContent: 'flex-end' }}>
              <span style={{ opacity: 0.7 }}>{day.low}°</span>
              <span style={{ fontWeight: '500' }}>{day.high}°</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
