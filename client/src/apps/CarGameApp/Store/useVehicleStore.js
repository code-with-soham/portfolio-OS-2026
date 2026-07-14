// ============================================
// Car Experience — Vehicle Store
// ============================================
import { create } from 'zustand';
import { CARS } from '../Vehicles/carData';

export const useVehicleStore = create((set, get) => ({
  // Selection
  selectedCarId: CARS[0].id,
  ownedCarIds: CARS.map(c => c.id), // All unlocked for Phase 1
  discoveredCars: new Set([CARS[0]?.id]),

  // Runtime state (updated during gameplay)
  speed: 0,          // km/h
  rpm: 0,            // 0-9000
  gear: 1,           // 1-7
  throttle: 0,       // 0-1
  brake: 0,          // 0-1
  steerAngle: 0,     // -1 to 1
  nitro: 100,        // 0-100
  driftScore: 0,

  // Actions
  selectCar: (id) => {
    const { discoveredCars } = get();
    if (!discoveredCars.has(id)) {
      const nextDiscovered = new Set(discoveredCars);
      nextDiscovered.add(id);
      
      // OS Integration: Dispatch global achievement event
      window.dispatchEvent(new CustomEvent('portfolio:achievement:unlocked', {
        detail: {
          app: 'velocity_racing',
          title: 'Car Discovered',
          carId: id
        }
      }));
      
      set({ selectedCarId: id, discoveredCars: nextDiscovered });
    } else {
      set({ selectedCarId: id });
    }
  },
  setSpeed: (speed) => set({ speed }),
  setRPM: (rpm) => set({ rpm }),
  setGear: (gear) => set({ gear }),
  setThrottle: (throttle) => set({ throttle }),
  setBrake: (brake) => set({ brake }),
  setSteerAngle: (steerAngle) => set({ steerAngle }),
  resetRuntime: () => set({ speed: 0, rpm: 0, gear: 1, throttle: 0, brake: 0, steerAngle: 0, nitro: 100, driftScore: 0 }),
}));
