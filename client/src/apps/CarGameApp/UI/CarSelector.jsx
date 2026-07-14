// ============================================
// Car Experience — Car Selection Carousel
// ============================================
import { motion } from 'framer-motion';
import { useVehicleStore } from '../Store/useVehicleStore';
import { useSceneStore } from '../Store/useSceneStore';
import { CARS } from '../Vehicles/carData';
import { SCENES, CAR_CLASSES } from '../Core/constants';
import { audioManager } from '../Audio/audioManager';

export default function CarSelector() {
  const selectedCarId = useVehicleStore((s) => s.selectedCarId);
  const selectCar = useVehicleStore((s) => s.selectCar);
  const forceScene = useSceneStore((s) => s.forceScene);

  const handleSelect = (id) => {
    if (id !== selectedCarId) {
      selectCar(id);
      audioManager.playUISelect();
    }
  };

  const handleConfirm = () => {
    audioManager.playUIPop();
    forceScene(SCENES.GARAGE);
  };

  return (
    <motion.div
      className="car-selector-ui"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="car-selector-header">
        <h2>Select Vehicle</h2>
        <button className="car-glass-btn-primary" onClick={handleConfirm}>
          Confirm Selection
        </button>
      </div>

      <div className="car-carousel">
        {CARS.map((car) => {
          const isSelected = car.id === selectedCarId;
          const classInfo = CAR_CLASSES[car.class] || CAR_CLASSES.B;
          
          return (
            <motion.div
              key={car.id}
              className={`car-card glass-panel ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(car.id)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                borderColor: isSelected ? classInfo.color : 'rgba(255,255,255,0.08)',
                opacity: isSelected ? 1 : 0.6,
              }}
            >
              <div className="car-card-top">
                <span className="car-class-badge-small" style={{ background: classInfo.color }}>
                  {car.class}
                </span>
                <span className="car-card-year">{car.year}</span>
              </div>
              
              <h4 className="car-card-name">{car.name}</h4>
              <p className="car-card-brand">{car.manufacturer}</p>
              
              <div className="car-card-stats-mini">
                <div className="car-card-stat-pill">
                  {car.horsepower} HP
                </div>
                <div className="car-card-stat-pill">
                  {car.driveType}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
