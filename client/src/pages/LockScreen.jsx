// ============================================
// Portfolio OS 2026 — Lock Screen
// ============================================
// Windows 11-style lock screen with:
// - Full-screen wallpaper background
// - Large time display (12-hour format)
// - Date display
// - "Click anywhere to unlock" hint
// - Swipe-up unlock animation
//
// Click anywhere → slides up to reveal the desktop.

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../store/useDesktopStore';
import { useProfileStore } from '../store/useProfileStore';
import { useWeatherStore } from '../store/useWeatherStore';
import { OS_STATES } from '../constants';
import { WeatherSunnyRegular } from '@fluentui/react-icons';

/**
 * Formats time in 12-hour format: "7:44 PM"
 */
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const mins = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${mins} ${ampm}`;
}

/**
 * Formats date: "Saturday, June 14"
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function LockScreen() {
  const setOsState = useDesktopStore((s) => s.setOsState);
  const lockScreenAvatar = useDesktopStore((s) => s.lockScreenAvatar);
  const lockScreenText = useDesktopStore((s) => s.lockScreenText);

  const { profiles, activeProfileId, switchProfile, addProfile } = useProfileStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather on mount
  useEffect(() => {
    useWeatherStore.getState().fetchWeather();
  }, []);

  // Handle unlock — trigger slide-up animation, then transition
  const handleUnlock = useCallback(() => {
    if (isUnlocking) return;
    if (pin === '1234') {
      setIsUnlocking(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  }, [isUnlocking, pin]);

  return (
    <motion.div
      className="no-select"
      initial={{ opacity: 0 }}
      animate={
        isUnlocking
          ? { y: '-100%', transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
          : { opacity: 1, transition: { duration: 0.6 } }
      }
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      onAnimationComplete={() => {
        if (isUnlocking) {
          setOsState(OS_STATES.DESKTOP);
        }
      }}
      onClick={handleUnlock}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Blurred Background Layer */}
      <div 
        className="wallpaper-default"
        style={{
          position: 'absolute',
          inset: '-20px', // Slightly larger to prevent white/clear edges from blur
          filter: 'blur(16px)',
          zIndex: 0,
        }}
      />
      
      {/* Subtle darkening overlay to make text pop */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 1,
        }}
      />

      {/* Time — large centered clock */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(4rem, 10vw, 7rem)',
            fontWeight: 200,
            color: '#ffffff',
            fontFamily: 'var(--font-family)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {formatTime(currentTime)}
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: 'var(--font-family)',
            textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)',
            marginBottom: '8px'
          }}
        >
          {formatDate(currentTime)}
        </p>
        
        {/* Weather Info */}
        {useWeatherStore.getState().currentWeather && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem', textShadow: '0 1px 10px rgba(0,0,0,0.3)', fontWeight: 400 }}>
            <img 
              src={`https://openweathermap.org/img/wn/${useWeatherStore.getState().currentWeather.icon}.png`} 
              alt="weather" 
              style={{ width: '32px', height: '32px' }} 
            />
            <span>{useWeatherStore.getState().currentWeather.temp}°C</span>
            <span style={{ margin: '0 4px' }}>•</span>
            <span style={{ textTransform: 'capitalize' }}>{useWeatherStore.getState().currentWeather.condition}</span>
            <span style={{ margin: '0 4px' }}>•</span>
            <span>{useWeatherStore.getState().currentWeather.city}</span>
          </div>
        )}
      </motion.div>

      {/* Profile and Login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 3,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {lockScreenAvatar ? (
          <img 
            src={lockScreenAvatar} 
            alt="Avatar" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} 
          />
        ) : (
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), #60cdff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            SK
          </div>
        )}
        <h2 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: 500, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{lockScreenText || 'Soham Kundu'}</h2>
        
        <div style={{ position: 'relative', width: '280px' }}>
          <input 
            type="password" 
            placeholder="PIN" 
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '12px 48px 12px 16px',
              borderRadius: '4px',
              border: `2px solid ${error ? '#e81123' : 'transparent'}`,
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
            onBlur={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUnlock();
            }}
            autoFocus
          />
          <button 
            onClick={handleUnlock}
            aria-label="Unlock"
            style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '20px',
              opacity: 0.8,
              minWidth: '48px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ➔
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Pin- 1234</p>
      </motion.div>

      {/* Profiles List (Bottom Left) */}
      {isUnlocking && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: p.id === activeProfileId ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 16px',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '200px',
                textAlign: 'left'
              }}
            >
              {p.avatar ? (
                <img src={p.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                  {p.name.charAt(0)}
                </div>
              )}
              <span style={{ fontWeight: p.id === activeProfileId ? '600' : '400' }}>{p.name}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const name = prompt("Enter new profile name:");
              if (name) addProfile(name, null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            <span>Add Profile</span>
          </button>
        </motion.div>
      )}

    </motion.div>
  );
}
