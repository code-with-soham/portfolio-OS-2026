// ============================================
// Car Experience — Scene Manager
// ============================================
// Controls which 3D scene content is rendered based on active scene.
// Does NOT handle transitions (that's TransitionManager).

import ProceduralCar from '../Engine/ProceduralCar';
import GarageEnvironment from '../Engine/GarageEnvironment';
import CoastalMap from '../Engine/CoastalMap';
import LightingRig from '../Engine/LightingRig';
import PostProcessingPipeline from '../Engine/PostProcessing';
import CameraDirector from './CameraDirector';
import { useSceneStore } from '../Store/useSceneStore';
import { useVehicleStore } from '../Store/useVehicleStore';
import { useSettingsStore } from '../Store/useSettingsStore';
import { CARS, getCarById } from '../Vehicles/carData';
import { SCENES } from './constants';
import { Perf } from 'r3f-perf';

export default function SceneManager() {
  const activeScene = useSceneStore((s) => s.activeScene);
  const selectedCarId = useVehicleStore((s) => s.selectedCarId);
  const selectedCar = getCarById(selectedCarId) || CARS[0];
  const showPerf = useSettingsStore((s) => s.showDeveloperOverlay);

  // Scenes that show the garage environment
  const showGarage = [
    SCENES.MAIN_MENU,
    SCENES.GARAGE,
    SCENES.CAR_SELECT,
    SCENES.SETTINGS,
  ].includes(activeScene);

  // Scenes that show a car
  const showCar = [
    SCENES.MAIN_MENU,
    SCENES.GARAGE,
    SCENES.CAR_SELECT,
  ].includes(activeScene);

  const showWorld = activeScene === SCENES.FREE_ROAM;

  return (
    <>
      {showPerf && <Perf position="top-left" style={{ zIndex: 9999 }} />}
      <CameraDirector />
      
      {/* Dynamic Lighting is handled by the maps themselves or LightingRig for Garage */}
      {showGarage && <LightingRig />}
      {showGarage && <GarageEnvironment />}
      
      {/* The Driving Sandbox World */}
      {showWorld && <CoastalMap />}
      
      {showCar && <ProceduralCar carData={selectedCar} enableIdleAnimation />}
      <PostProcessingPipeline />
    </>
  );
}
