import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AmbientBackground.css';

/**
 * Renders immersive Apple Weather style ambient backgrounds.
 * Uses Framer Motion for rain, snow, and dynamic clouds.
 */
export const AmbientBackground = ({ condition, isNight }) => {
  const condStr = condition.toLowerCase();
  
  let type = 'clear';
  if (condStr.includes('rain') || condStr.includes('drizzle')) type = 'rain';
  if (condStr.includes('snow')) type = 'snow';
  if (condStr.includes('cloud')) type = 'clouds';
  if (condStr.includes('thunderstorm') || condStr.includes('storm')) type = 'storm';

  const bgGradient = useMemo(() => {
    if (isNight) {
      if (type === 'clear') return 'linear-gradient(to bottom, #07132a, #1a2a4c)';
      if (type === 'rain' || type === 'storm') return 'linear-gradient(to bottom, #0f172a, #1e293b)';
      return 'linear-gradient(to bottom, #111827, #334155)';
    } else {
      if (type === 'clear') return 'linear-gradient(to bottom, #3b82f6, #60a5fa)'; // Sunny Blue
      if (type === 'rain') return 'linear-gradient(to bottom, #475569, #64748b)'; // Rainy Gray
      if (type === 'storm') return 'linear-gradient(to bottom, #1e293b, #334155)'; // Stormy Dark
      if (type === 'snow') return 'linear-gradient(to bottom, #94a3b8, #cbd5e1)'; // Snowy White/Gray
      return 'linear-gradient(to bottom, #60a5fa, #94a3b8)'; // Cloudy Blue-Gray
    }
  }, [type, isNight]);

  return (
    <div className="ambient-background" style={{ background: bgGradient }}>
      <AnimatePresence>
        {type === 'rain' && <RainEffect key="rain" isStorm={false} />}
        {type === 'storm' && <RainEffect key="storm" isStorm={true} />}
        {type === 'snow' && <SnowEffect key="snow" />}
        {(type === 'clouds' || type === 'clear') && !isNight && <CloudEffect key="clouds" type={type} />}
        {isNight && type === 'clear' && <StarEffect key="stars" />}
      </AnimatePresence>
    </div>
  );
};

const RainEffect = ({ isStorm }) => {
  const drops = Array.from({ length: 40 });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="weather-effect-layer">
      {drops.map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 0.5 + 0.5}s`,
            animationDelay: `${Math.random()}s`
          }}
        />
      ))}
      {isStorm && (
        <motion.div
          className="lightning-flash"
          animate={{
            opacity: [0, 0, 0.8, 0, 0, 0.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            times: [0, 0.8, 0.82, 0.85, 0.9, 0.92, 1]
          }}
        />
      )}
    </motion.div>
  );
};

const SnowEffect = () => {
  const flakes = Array.from({ length: 30 });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="weather-effect-layer">
      {flakes.map((_, i) => (
        <div
          key={i}
          className="snow-flake"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            animationDuration: `${Math.random() * 3 + 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </motion.div>
  );
};

const CloudEffect = ({ type }) => {
  const cloudCount = type === 'clouds' ? 4 : 2;
  const clouds = Array.from({ length: cloudCount });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="weather-effect-layer">
      {clouds.map((_, i) => (
        <motion.div
          key={i}
          className="ambient-cloud"
          style={{
            top: `${Math.random() * 40}%`,
            width: `${Math.random() * 200 + 150}px`,
            height: `${Math.random() * 60 + 40}px`,
            opacity: type === 'clear' ? 0.4 : 0.7
          }}
          animate={{
            x: ['-10vw', '110vw']
          }}
          transition={{
            duration: Math.random() * 60 + 40,
            repeat: Infinity,
            ease: "linear",
            delay: -Math.random() * 40
          }}
        />
      ))}
    </motion.div>
  );
};

const StarEffect = () => {
  const stars = Array.from({ length: 50 });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="weather-effect-layer">
      {stars.map((_, i) => (
        <div
          key={i}
          className="ambient-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </motion.div>
  );
};
