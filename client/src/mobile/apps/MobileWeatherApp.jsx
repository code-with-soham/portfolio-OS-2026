import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useMobileStore } from '../store/useMobileStore';
import { 
  ArrowLeftRegular, InfoRegular, WeatherFogRegular, 
  LocationRegular 
} from '@fluentui/react-icons';

export default function MobileWeatherApp() {
  const { currentWeather, hourlyForecast, dailyForecast, loading, fetchWeather } = useWeatherStore();
  const { closeApp } = useMobileStore();

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (loading || !currentWeather) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#121212', color: '#fff' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading Weather...</p>
      </div>
    );
  }

  // Determine dynamic background class based on weather condition
  const condition = currentWeather.condition.toLowerCase();
  let bgGradient = 'linear-gradient(180deg, #4da0b0, #d39d38)';
  if (condition.includes('rain') || condition.includes('drizzle')) bgGradient = 'linear-gradient(180deg, #373b44, #4286f4)';
  else if (condition.includes('cloud')) bgGradient = 'linear-gradient(180deg, #606c88, #3f4c6b)';
  else if (condition.includes('snow')) bgGradient = 'linear-gradient(180deg, #e0eafc, #cfdef3)';
  else if (currentWeather.icon.includes('n')) bgGradient = 'linear-gradient(180deg, #0f2027, #203a43, #2c5364)';

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        height: '100%',
        width: '100%',
        background: bgGradient,
        color: '#fff',
        overflowY: 'auto',
        position: 'relative'
      }}
      className="custom-scrollbar"
    >
      {/* App Bar */}
      <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={closeApp}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeftRegular fontSize={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LocationRegular fontSize={18} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>{currentWeather.city}</span>
        </div>
        <div style={{ width: '40px' }}></div> {/* Spacer */}
      </div>

      {/* Hero */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <img src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`} alt={currentWeather.description} style={{ width: '150px', height: '150px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }} />
        <h1 style={{ fontSize: '84px', margin: '0', fontWeight: 300, textShadow: '0 4px 12px rgba(0,0,0,0.2)', lineHeight: 1 }}>{currentWeather.temp}°</h1>
        <h3 style={{ fontSize: '24px', margin: '10px 0 5px 0', fontWeight: 500 }}>{currentWeather.condition}</h3>
        <p style={{ margin: 0, opacity: 0.9 }}>Feels like {currentWeather.feelsLike}°C • {dailyForecast[0]?.high}° / {dailyForecast[0]?.low}°</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Hourly */}
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>Today</h3>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
            {hourlyForecast.map((hour, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px', gap: '8px' }}>
                <span style={{ fontSize: '14px', opacity: 0.9 }}>{idx === 0 ? 'Now' : formatTime(hour.dt).replace(':00', '')}</span>
                <img src={`https://openweathermap.org/img/wn/${hour.icon}.png`} alt="icon" style={{ width: '40px', height: '40px' }} />
                <span style={{ fontSize: '18px', fontWeight: 600 }}>{hour.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily */}
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>5-Day Forecast</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dailyForecast.map((day, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx !== dailyForecast.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingBottom: idx !== dailyForecast.length - 1 ? '12px' : '0' }}>
                <span style={{ width: '60px', fontWeight: 500 }}>{idx === 0 ? 'Today' : day.day}</span>
                <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="icon" style={{ width: '30px', height: '30px' }} />
                <div style={{ display: 'flex', gap: '16px', fontWeight: 600 }}>
                  <span style={{ opacity: 0.8 }}>{day.low}°</span>
                  <span>{day.high}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}><InfoRegular /> Humidity</div>
            <div style={{ fontSize: '24px', fontWeight: 500 }}>{currentWeather.humidity}%</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}><WeatherFogRegular /> Wind</div>
            <div style={{ fontSize: '24px', fontWeight: 500 }}>{currentWeather.windSpeed} <span style={{ fontSize: '14px' }}>km/h</span></div>
          </div>
        </div>
        
        <div style={{ height: '40px' }}></div> {/* Bottom Padding */}
      </div>
    </motion.div>
  );
}
