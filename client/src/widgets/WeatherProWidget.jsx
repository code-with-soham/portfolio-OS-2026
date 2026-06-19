import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { 
  WeatherSunnyRegular, 
  WeatherMoonRegular, 
  WeatherCloudyRegular, 
  WeatherRainRegular, 
  WeatherSnowRegular, 
  WeatherThunderstormRegular,
  WeatherFogRegular,
  DropRegular,
  LocationRegular
} from '@fluentui/react-icons';

export default function WeatherProWidget() {
  const { accentColor } = useThemeStore();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/weather?city=Kolkata');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (isMounted) {
          setWeatherData(data);
          setError(false);
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        if (isMounted) setError(true);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 minutes
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getBackgroundGradient = () => {
    if (!weatherData) return 'rgba(20, 20, 20, 0.65)';
    const condition = weatherData.condition.toLowerCase();
    const isNight = weatherData.icon.includes('n');

    if (isNight) return 'linear-gradient(135deg, rgba(10, 15, 40, 0.8), rgba(20, 20, 20, 0.9))'; // Night
    if (condition.includes('rain') || condition.includes('drizzle')) return 'linear-gradient(135deg, rgba(30, 60, 114, 0.8), rgba(42, 82, 152, 0.9))'; // Rain
    if (condition.includes('thunderstorm')) return 'linear-gradient(135deg, rgba(50, 20, 80, 0.8), rgba(20, 20, 20, 0.9))'; // Storm
    if (condition.includes('clear')) return 'linear-gradient(135deg, rgba(255, 140, 0, 0.7), rgba(255, 69, 0, 0.8))'; // Sunny
    return 'linear-gradient(135deg, rgba(90, 100, 110, 0.8), rgba(40, 50, 60, 0.9))'; // Cloudy/Default
  };

  const getWeatherIcon = (condition, iconCode, sizeStyle) => {
    const isNight = iconCode.includes('n');
    const cond = condition.toLowerCase();

    if (cond.includes('clear')) return isNight ? <WeatherMoonRegular style={sizeStyle} /> : <WeatherSunnyRegular style={sizeStyle} />;
    if (cond.includes('cloud')) return <WeatherCloudyRegular style={sizeStyle} />;
    if (cond.includes('rain') || cond.includes('drizzle')) return <WeatherRainRegular style={sizeStyle} />;
    if (cond.includes('snow')) return <WeatherSnowRegular style={sizeStyle} />;
    if (cond.includes('thunderstorm')) return <WeatherThunderstormRegular style={sizeStyle} />;
    if (cond.includes('mist') || cond.includes('fog')) return <WeatherFogRegular style={sizeStyle} />;
    return isNight ? <WeatherMoonRegular style={sizeStyle} /> : <WeatherSunnyRegular style={sizeStyle} />;
  };

  const getRelativeTime = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 60000); // in minutes
    if (diff < 1) return 'just now';
    if (diff === 1) return '1 minute ago';
    if (diff < 60) return `${diff} minutes ago`;
    return 'a while ago';
  };

  const handleOpenApp = () => {
    console.log("Opening full weather app...");
  };

  if (!weatherData) {
    return (
      <div className="widget-card weather-pro-widget" style={{ width: '340px', padding: '20px', background: 'rgba(20, 20, 20, 0.65)', borderRadius: '20px', color: '#fff' }}>
        Loading Weather...
      </div>
    );
  }

  return (
    <motion.div 
      className="widget-card weather-pro-widget"
      whileHover={{ scale: 1.02 }}
      onClick={handleOpenApp}
      style={{
        background: getBackgroundGradient(),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '340px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>
            <LocationRegular /> {weatherData.city}, {weatherData.country}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '42px', fontWeight: 'bold' }}>{weatherData.temperature}°C</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '-4px' }}>
            {weatherData.condition}
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            Feels Like {weatherData.feelsLike}°C
          </span>
        </div>
        <div style={{ padding: '8px' }}>
          {getWeatherIcon(weatherData.condition, weatherData.icon, { fontSize: '56px' })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DropRegular fontSize="20px" color={accentColor} />
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Humidity</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{weatherData.humidity}%</div>
          </div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <WeatherFogRegular fontSize="20px" color={accentColor} />
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Wind</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{weatherData.wind} km/h</div>
          </div>
        </div>
      </div>

      {weatherData.forecast && weatherData.forecast.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 4px 4px 4px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {weatherData.forecast.map((day, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{day.day}</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{day.temp}°</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
          Updated {getRelativeTime(weatherData.updatedAt)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }} 
          />
          Portfolio OS Online
        </div>
      </div>
    </motion.div>
  );
}
