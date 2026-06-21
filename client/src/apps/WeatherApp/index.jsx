import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../../store/useWeatherStore';
import { 
  WeatherSunnyRegular, WeatherMoonRegular, WeatherRainShowersDayRegular, 
  WeatherSnowRegular, WeatherCloudyRegular,
  LocationRegular, WeatherFogRegular,
  EyeRegular, ArrowClockwiseRegular, InfoRegular
} from '@fluentui/react-icons';
import './WeatherApp.css';

export default function WeatherApp() {
  const { 
    currentWeather, hourlyForecast, dailyForecast, airQuality, 
    loading, error, fetchWeather, lastUpdated 
  } = useWeatherStore();

  useEffect(() => {
    fetchWeather(); // Fetch weather on mount
  }, [fetchWeather]);

  if (loading && !currentWeather) {
    return (
      <div className="weather-app-container loading-container">
        <div className="loading-spinner"></div>
        <p>Fetching satellite data...</p>
      </div>
    );
  }

  if (error && !currentWeather) {
    return (
      <div className="weather-app-container error-container">
        <p>Error loading weather data: {error}</p>
        <button onClick={() => fetchWeather()}>Retry</button>
      </div>
    );
  }

  if (!currentWeather) return null;

  // Determine dynamic background class based on weather condition
  const condition = currentWeather.condition.toLowerCase();
  let bgClass = 'bg-clear-day';
  if (condition.includes('rain') || condition.includes('drizzle')) bgClass = 'bg-rainy';
  else if (condition.includes('cloud')) bgClass = 'bg-cloudy';
  else if (condition.includes('snow')) bgClass = 'bg-snowy';
  else if (condition.includes('thunderstorm')) bgClass = 'bg-stormy';
  else if (currentWeather.icon.includes('n')) bgClass = 'bg-clear-night';

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className={`weather-app-container ${bgClass} custom-scrollbar`}>
      {/* Dynamic Background Overlays (CSS handled) */}
      <div className="weather-bg-overlay"></div>
      
      <div className="weather-content">
        {/* Top Header */}
        <header className="weather-header">
          <div className="location">
            <LocationRegular fontSize={20} />
            <h2>{currentWeather.city}, {currentWeather.country}</h2>
          </div>
          <div className="last-updated" onClick={() => fetchWeather()} title="Click to refresh">
            <ArrowClockwiseRegular fontSize={14} className={loading ? "spin" : ""} />
            <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="weather-grid">
          {/* Main Hero Section */}
          <section className="weather-hero glass-panel">
            <div className="temp-main">
              <img src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`} alt={currentWeather.description} className="hero-icon" />
              <h1>{currentWeather.temp}°</h1>
            </div>
            <div className="temp-desc">
              <h3>{currentWeather.condition}</h3>
              <p>Feels like {currentWeather.feelsLike}°C</p>
              <p className="capitalize">{currentWeather.description}</p>
            </div>
          </section>

          {/* Hourly Forecast */}
          <section className="weather-hourly glass-panel">
            <h3>Today</h3>
            <div className="hourly-scroll custom-scrollbar">
              {hourlyForecast.map((hour, idx) => (
                <div key={idx} className="hourly-item">
                  <span className="time">{idx === 0 ? 'Now' : formatTime(hour.dt).replace(':00', '')}</span>
                  <img src={`https://openweathermap.org/img/wn/${hour.icon}.png`} alt="icon" />
                  <span className="temp">{hour.temp}°</span>
                  {hour.rainChance > 0 && <span className="rain"><InfoRegular fontSize={10}/> {hour.rainChance}%</span>}
                </div>
              ))}
            </div>
          </section>

          {/* 5-Day Forecast */}
          <section className="weather-daily glass-panel">
            <h3>5-Day Forecast</h3>
            <div className="daily-list">
              {dailyForecast.map((day, idx) => (
                <div key={idx} className="daily-item">
                  <span className="day">{idx === 0 ? 'Today' : day.day}</span>
                  <div className="icon-group">
                    <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="icon" />
                    {day.rainChance > 0 && <span className="rain">{day.rainChance}%</span>}
                  </div>
                    <div className="temp-bar-container">
                      <span className="low">{day.low}°</span>
                      <div className="temp-bar">
                        <div className="temp-bar-fill" style={{ width: `${Math.min(100, (day.high - day.low) * 5)}%`, marginLeft: `${Math.max(0, day.low)}%` }}></div>
                      </div>
                      <span className="high">{day.high}°</span>
                    </div>
                </div>
              ))}
            </div>
          </section>

          {/* Details Grid */}
          <section className="weather-details">
            <div className="detail-card glass-panel">
              <div className="detail-header"><InfoRegular /> Humidity</div>
              <div className="detail-value">{currentWeather.humidity}%</div>
              <div className="detail-desc">Dew point is {currentWeather.temp - 2}°C right now.</div>
            </div>
            <div className="detail-card glass-panel">
              <div className="detail-header"><WeatherFogRegular /> Wind</div>
              <div className="detail-value">{currentWeather.windSpeed} <span className="unit">km/h</span></div>
            </div>
            <div className="detail-card glass-panel">
              <div className="detail-header"><InfoRegular /> Pressure</div>
              <div className="detail-value">{currentWeather.pressure} <span className="unit">hPa</span></div>
            </div>
            <div className="detail-card glass-panel">
              <div className="detail-header"><EyeRegular /> Visibility</div>
              <div className="detail-value">{currentWeather.visibility} <span className="unit">km</span></div>
            </div>
            <div className="detail-card glass-panel">
              <div className="detail-header"><WeatherSunnyRegular /> UV Index</div>
              <div className="detail-value">Moderate</div>
              <div className="detail-desc">Use sun protection until 4 PM.</div>
            </div>
            <div className="detail-card glass-panel">
              <div className="detail-header"><InfoRegular /> Air Quality</div>
              <div className="detail-value">{airQuality ? airQuality.label : 'Good'}</div>
              <div className="detail-desc">AQI: {airQuality ? airQuality.index : 1} - Perfect for outdoor activities.</div>
            </div>
            
            {/* Sunrise / Sunset */}
            <div className="detail-card glass-panel astro-card full-width">
              <div className="detail-header"><WeatherSunnyRegular /> Sunrise & Sunset</div>
              <div className="astro-info">
                <div>
                  <span className="label">Sunrise</span>
                  <span className="time">{formatTime(currentWeather.sunrise)}</span>
                </div>
                <div>
                  <span className="label">Sunset</span>
                  <span className="time">{formatTime(currentWeather.sunset)}</span>
                </div>
              </div>
            </div>

            {/* Simulated Radar */}
            <div className="detail-card glass-panel radar-card">
              <div className="detail-header">Weather Radar (Simulated)</div>
              <div className="radar-mockup">
                <div className="radar-sweep"></div>
                <div className="radar-cloud" style={{ top: '20%', left: '30%', opacity: currentWeather.condition.includes('Cloud') ? 0.8 : 0.2 }}></div>
                <div className="radar-rain" style={{ top: '40%', left: '50%', opacity: currentWeather.condition.includes('Rain') ? 0.9 : 0 }}></div>
              </div>
            </div>
          </section>

          {/* AI Insights */}
          <section className="weather-ai-insight glass-panel">
            <div className="ai-header">
              <span className="ai-badge">AI INSIGHT</span>
            </div>
            <p className="ai-text">
              Based on today's forecast, it will be mostly {currentWeather.description} with a high of {dailyForecast[0]?.high}°. 
              {currentWeather.condition.includes('Rain') ? ' Make sure to carry an umbrella!' : ' Great day for outdoor activities!'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
