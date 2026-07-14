// ============================================
// Car Experience — Root Entry
// ============================================

import { useEffect, useState } from 'react';
import AppShell from '../../components/app/AppShell';
import { useEffect, useState } from 'react';
import AppShell from '../../components/app/AppShell';
import Canvas3D from './Engine/Canvas3D';
import SceneManager from './Core/SceneManager';
import TransitionManager from './Core/TransitionManager';
import ExperienceDirector from './Core/ExperienceDirector';
import WorldDirector from './Core/WorldDirector';
import InputManager from './Core/InputManager';
import UIOverlay from './UI/UIOverlay';
import './CarGameApp.css';
import { audioManager } from './Audio/audioManager';

export default function CarGameApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleFirstClick = () => {
      audioManager.init();
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, []);

  if (!mounted) return null;

  return (
    <AppShell hideTitleBar={true}>
      <div className="car-game-root">
        {/* Global Managers */}
        <ExperienceDirector />
        <WorldDirector />
        <InputManager />

        {/* 3D Scene Layer */}
        <div className="car-canvas-container">
          <Canvas3D>
            <SceneManager />
          </Canvas3D>
        </div>

        {/* CSS/HTML UI Layer */}
        <UIOverlay />

        {/* Scene Transition Overlays */}
        <TransitionManager />
      </div>
    </AppShell>
  );
}
