// ============================================
// Car Experience — Main Menu
// ============================================
// Premium glass-panel menu over the 3D showroom scene.

import { motion } from 'framer-motion';
import { useSceneStore } from '../Store/useSceneStore';
import { useVehicleStore } from '../Store/useVehicleStore';
import { getCarById } from '../Vehicles/carData';
import { SCENES } from '../Core/constants';

export default function MainMenu() {
  const forceScene = useSceneStore((s) => s.forceScene);
  const selectedCarId = useVehicleStore((s) => s.selectedCarId);
  const car = getCarById(selectedCarId);

  const menuItems = [
    { label: 'GARAGE', icon: '🏠', scene: SCENES.GARAGE },
    { label: 'FREE DRIVE', icon: '🛣️', scene: null, disabled: true },
    { label: 'EVENTS', icon: '🏁', scene: null, disabled: true },
    { label: 'PHOTO MODE', icon: '📸', scene: null, disabled: true },
    { label: 'SETTINGS', icon: '⚙️', scene: SCENES.SETTINGS },
  ];

  return (
    <motion.div
      className="car-main-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Car name hero */}
      <motion.div
        className="car-menu-hero"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="car-menu-car-name">{car?.name || 'Select a Car'}</h1>
        <p className="car-menu-car-sub">{car?.manufacturer} · {car?.engine}</p>
      </motion.div>

      {/* Menu buttons */}
      <motion.nav
        className="car-menu-nav"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
      >
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            className={`car-menu-btn ${item.disabled ? 'disabled' : ''}`}
            onClick={() => !item.disabled && item.scene && forceScene(item.scene)}
            whileHover={!item.disabled ? { x: 12, scale: 1.02 } : {}}
            whileTap={!item.disabled ? { scale: 0.98 } : {}}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
          >
            <span className="car-menu-btn-icon">{item.icon}</span>
            <span className="car-menu-btn-label">{item.label}</span>
            {item.disabled && <span className="car-menu-btn-soon">SOON</span>}
          </motion.button>
        ))}
      </motion.nav>

      {/* Bottom branding */}
      <motion.div
        className="car-menu-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        VELOCITY · Portfolio OS 2026
      </motion.div>
    </motion.div>
  );
}
