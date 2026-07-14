// ============================================
// Car Experience — Root UI Overlay
// ============================================
// Renders the correct HTML/CSS overlay based on active scene.

import { AnimatePresence } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useSceneStore } from '../Store/useSceneStore';
import { SCENES } from '../Core/constants';

import SplashScreen from './SplashScreen';
import LoadingScreen from './LoadingScreen';
import MainMenu from './MainMenu';
import GarageUI from './GarageUI';
import CarSelector from './CarSelector';
import SettingsPanel from './SettingsPanel';
import DeveloperOverlay from './DeveloperOverlay';
import AssetInspector from './AssetInspector';

export default function UIOverlay() {
  const activeScene = useSceneStore((s) => s.activeScene);

  return (
    <div className="car-ui-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <AnimatePresence mode="wait">
        {activeScene === SCENES.SPLASH && <SplashScreen key="splash" />}
        {activeScene === SCENES.LOADING && <LoadingScreen key="loading" />}
        {activeScene === SCENES.MAIN_MENU && <MainMenu key="main_menu" />}
        {activeScene === SCENES.GARAGE && <GarageUI key="garage" />}
        {activeScene === SCENES.CAR_SELECT && <CarSelector key="car_select" />}
        {activeScene === SCENES.SETTINGS && <SettingsPanel key="settings" />}
      </AnimatePresence>
      <DeveloperOverlay />
      <AssetInspector />
    </div>
  );
}
