import { useState, useEffect } from 'react';
import { 
  WeatherSunnyRegular, 
  WeatherMoonRegular, 
  WeatherCloudyRegular, 
  WeatherRainRegular, 
  WeatherSnowRegular, 
  WeatherThunderstormRegular,
  WeatherFogRegular
} from '@fluentui/react-icons';

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState({
    city: 'Kolkata',
    temp: '--',
    condition: 'Loading...',
    isDay: 1,
    weatherCode: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const lat = 22.5726;
        const lon = 88.3639;
        const city = 'Kolkata';

        // Fetch weather for Kolkata directly
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          const current = wData.current_weather;
          
          if (isMounted) {
            setWeatherData({
              city,
              temp: Math.round(current.temperature),
              condition: getWeatherCondition(current.weathercode),
              isDay: current.is_day,
              weatherCode: current.weathercode,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        if (isMounted) {
          setWeatherData(prev => ({ ...prev, condition: 'Unavailable' }));
        }
      }
    };

    fetchWeather();
    
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getWeatherCondition = (code) => {
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Cloudy';
    if (code === 45 || code === 48) return 'Fog';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain';
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'Snow';
    if (code >= 95 && code <= 99) return 'Storm';
    return 'Unknown';
  };

  const getWeatherIcon = () => {
    const { weatherCode, isDay } = weatherData;
    const size = { fontSize: '3rem', color: '#FFD700' }; // default sunny
    
    if (weatherCode === 0) {
      return isDay ? <WeatherSunnyRegular style={size} /> : <WeatherMoonRegular style={{...size, color: '#E0E0E0'}} />;
    }
    if (weatherCode >= 1 && weatherCode <= 3) {
      return <WeatherCloudyRegular style={{...size, color: '#A0A0A0'}} />;
    }
    if (weatherCode === 45 || weatherCode === 48) {
      return <WeatherFogRegular style={{...size, color: '#A0A0A0'}} />;
    }
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return <WeatherRainRegular style={{...size, color: '#4A90E2'}} />;
    }
    if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
      return <WeatherSnowRegular style={{...size, color: '#E0E0E0'}} />;
    }
    if (weatherCode >= 95 && weatherCode <= 99) {
      return <WeatherThunderstormRegular style={{...size, color: '#6A4A82'}} />;
    }
    // Default fallback
    return isDay ? <WeatherSunnyRegular style={size} /> : <WeatherMoonRegular style={{...size, color: '#E0E0E0'}} />;
  };

  return (
    <div
      className="glass-heavy"
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(0, 191, 255, 0.05))',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{weatherData.city}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{weatherData.temp}°</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{weatherData.condition}</span>
        </div>
      </div>
      <div>
        {getWeatherIcon()}
      </div>
    </div>
  );
}
