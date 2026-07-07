import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../../store/useWeatherStore';
import { LocationRegular, ArrowClockwiseRegular } from '@fluentui/react-icons';
import { AmbientBackground } from './components/AmbientBackground';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { TenDayForecast } from './components/TenDayForecast';
import { AIWeatherInsight } from './components/AIWeatherInsight';
import { WeatherMetricCard } from './components/WeatherMetricCard';
import './WeatherApp.css';

export default function WeatherApp() {
  const { 
    currentWeather, hourlyForecast, dailyForecast, airQuality, 
    loading, error, fetchWeather, lastUpdated 
  } = useWeatherStore();

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (loading && !currentWeather) {
    return (
      <div className="weather-app-container loading-container" style={{ background: '#0f172a' }}>
        <div className="loading-spinner" style={{ borderTopColor: '#3b82f6' }}></div>
        <p style={{ color: 'white', opacity: 0.7 }}>Loading meteorological data...</p>
      </div>
    );
  }

  if (error && !currentWeather) {
    return (
      <div className="weather-app-container error-container" style={{ background: '#0f172a', color: 'white' }}>
        <p>Error loading weather data: {error}</p>
        <button onClick={() => fetchWeather()} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '16px' }}>Retry</button>
      </div>
    );
  }

  if (!currentWeather) return null;

  const isNight = currentWeather.icon.includes('n');

  return (
    <div className="weather-app-container custom-scrollbar" style={{ position: 'relative', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
      {/* 1. Dynamic Ambient Background layer */}
      <AmbientBackground condition={currentWeather.condition} isNight={isNight} />
      
      {/* 2. Content Layer */}
      <div className="weather-content" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <header className="weather-header" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LocationRegular fontSize={24} />
            <h2 style={{ fontSize: '24px', fontWeight: '500' }}>{currentWeather.city}, {currentWeather.country}</h2>
          </div>
          <div onClick={() => fetchWeather()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8, fontSize: '12px' }} title="Click to refresh">
            <ArrowClockwiseRegular fontSize={14} className={loading ? "spin" : ""} />
            <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div style={{ padding: '0 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Top Hero Row */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0', flexDirection: 'column' }}>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              style={{ fontSize: '96px', fontWeight: '200', lineHeight: '1', margin: 0, letterSpacing: '-2px' }}
            >
              {currentWeather.temp}°
            </motion.h1>
            <h3 style={{ fontSize: '24px', fontWeight: '400', opacity: 0.9, marginTop: '8px' }}>{currentWeather.condition}</h3>
            <div style={{ display: 'flex', gap: '16px', opacity: 0.8, marginTop: '8px', fontSize: '16px' }}>
              <span>H: {dailyForecast[0]?.high}°</span>
              <span>L: {dailyForecast[0]?.low}°</span>
            </div>
          </div>

          {/* AI Insight */}
          <AIWeatherInsight currentWeather={currentWeather} dailyForecast={dailyForecast} />

          {/* Two-Column Main Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
            
            {/* Left Column (Charts & Metrics) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <HourlyForecastChart hourlyData={hourlyForecast} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
                <WeatherMetricCard 
                  icon="InfoRegular" 
                  title="Humidity" 
                  value={currentWeather.humidity} 
                  unit="%" 
                  description={`Dew point is ${currentWeather.temp - 2}°C right now.`} 
                />
                <WeatherMetricCard 
                  icon="WeatherFogRegular" 
                  title="Wind" 
                  value={currentWeather.windSpeed} 
                  unit="km/h" 
                  description="Direction: NE"
                />
                <WeatherMetricCard 
                  icon="WeatherSunnyRegular" 
                  title="UV Index" 
                  value="4" 
                  unit="Mod" 
                  description="Use sun protection until 4 PM." 
                />
                <WeatherMetricCard 
                  icon="EyeRegular" 
                  title="Visibility" 
                  value={currentWeather.visibility} 
                  unit="km" 
                />
                <WeatherMetricCard 
                  icon="WeatherSunnyRegular" 
                  title="Sunrise" 
                  value={new Date(currentWeather.sunrise).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} 
                  description={`Sunset: ${new Date(currentWeather.sunset).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                />
                <WeatherMetricCard 
                  icon="InfoRegular" 
                  title="Air Quality" 
                  value={airQuality ? airQuality.index : 1} 
                  unit="AQI" 
                  description={airQuality ? airQuality.label : 'Good condition.'}
                />
              </div>
            </div>

            {/* Right Column (10-Day Forecast) */}
            <div>
              <TenDayForecast dailyData={dailyForecast} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
