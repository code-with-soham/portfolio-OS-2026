// ============================================
// Car Experience — Garage UI (Stats + Controls)
// ============================================
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSceneStore } from '../Store/useSceneStore';
import { useVehicleStore } from '../Store/useVehicleStore';
import { getCarById } from '../Vehicles/carData';
import { SCENES, CAR_CLASSES } from '../Core/constants';

function AnimatedCounter({ value, max, unit = '', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      delay: delay,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      }
    });
    return () => controls.stop();
  }, [value, delay]);

  const pct = Math.min((value / max) * 100, 100);
  
  return (
    <div className="car-stat-row">
      <div className="car-stat-header">
        <span className="car-stat-value">{displayValue}{unit}</span>
      </div>
      <div className="car-stat-bar-track">
        <motion.div
          className="car-stat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  );
}

function StatBar({ label, value, max, unit = '', delay = 0 }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '6px' }}>{label}</div>
      <AnimatedCounter value={value} max={max} unit={unit} delay={delay} />
    </div>
  );
}

export default function GarageUI() {
  const forceScene = useSceneStore((s) => s.forceScene);
  const selectedCarId = useVehicleStore((s) => s.selectedCarId);
  const car = getCarById(selectedCarId);
  
  // Re-trigger animations when car changes by changing key
  const animationKey = car ? car.id : 'none';

  if (!car) return null;

  const classInfo = CAR_CLASSES[car.class] || CAR_CLASSES.B;

  return (
    <motion.div
      className="car-garage-ui"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      key={`ui-${animationKey}`}
    >
      {/* Top Bar */}
      <div className="car-garage-topbar">
        <button className="car-glass-btn" onClick={() => forceScene(SCENES.MAIN_MENU)}>
          ← Back
        </button>
        <button className="car-glass-btn primary" onClick={() => forceScene(SCENES.FREE_ROAM)} style={{ margin: '0 16px', background: 'rgba(74, 222, 128, 0.2)', borderColor: '#4ade80' }}>
          Drive (Sandbox)
        </button>
        <button className="car-glass-btn" onClick={() => forceScene(SCENES.CAR_SELECT)}>
          Change Car →
        </button>
      </div>

      {/* Car Info Panel — bottom left */}
      <motion.div
        className="car-garage-info glass-panel"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      >
        <div className="car-garage-name-row">
          <h2 className="car-garage-name">{car.name}</h2>
          <span className="car-class-badge" style={{ background: classInfo.color }}>
            {car.class} · {classInfo.label}
          </span>
        </div>

        <p className="car-garage-meta">
          {car.manufacturer} · {car.country} · {car.year}
        </p>

        <p className="car-garage-desc">{car.description}</p>

        <div className="car-garage-stars">
          {'★'.repeat(car.stars)}{'☆'.repeat(5 - car.stars)}
        </div>

        <div className="car-garage-specs">
          <div className="car-spec-item">
            <span className="car-spec-val">{car.engine}</span>
            <span className="car-spec-key">Engine</span>
          </div>
          <div className="car-spec-item">
            <span className="car-spec-val">{car.transmission}</span>
            <span className="car-spec-key">Transmission</span>
          </div>
          <div className="car-spec-item">
            <span className="car-spec-val">{car.driveType}</span>
            <span className="car-spec-key">Drive</span>
          </div>
          <div className="car-spec-item">
            <span className="car-spec-val">{car.turbo ? 'Twin Turbo' : 'NA'}</span>
            <span className="car-spec-key">Induction</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Panel — bottom right */}
      <motion.div
        className="car-garage-stats glass-panel"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
      >
        <h3 className="car-stats-title">Performance</h3>
        {/* Staggered delay for each counter */}
        <StatBar label="Horsepower" value={car.horsepower} max={900} unit=" HP" delay={0.4} />
        <StatBar label="Torque" value={car.torque} max={1000} unit=" Nm" delay={0.5} />
        <StatBar label="Top Speed" value={car.topSpeed} max={400} unit=" km/h" delay={0.6} />
        <StatBar label="0-100 km/h" value={(5 - car.acceleration) * 25} max={100} unit={` (${car.acceleration}s)`} delay={0.7} />
        <StatBar label="Handling" value={car.handling * 10} max={100} delay={0.8} />
      </motion.div>
    </motion.div>
  );
}
