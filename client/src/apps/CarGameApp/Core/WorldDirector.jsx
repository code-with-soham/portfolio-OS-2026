// ============================================
// Car Experience — World Director
// ============================================
// Orchestrates environmental changes, lighting profiles based on time of day,
// and ambient audio crossfading based on regions.
import { useEffect } from 'react';
import { useWorldStore } from '../Store/useWorldStore';
import { useSceneStore } from '../Store/useSceneStore';
import { SCENES, LIGHTING_PROFILES } from '../Core/constants';
import { audioManager } from '../Audio/audioManager';

export default function WorldDirector() {
  const activeScene = useSceneStore((s) => s.activeScene);
  const timeOfDay = useWorldStore((s) => s.timeOfDay);
  const weather = useWorldStore((s) => s.weather);
  const activeRegion = useWorldStore((s) => s.activeRegion);
  const setLightingProfile = useSceneStore((s) => s.setLightingProfile);

  // Manage lighting based on world state when in FREE_ROAM
  useEffect(() => {
    if (activeScene === SCENES.FREE_ROAM) {
      if (timeOfDay === 'sunset') {
        setLightingProfile('SUNSET_COAST');
      } else if (timeOfDay === 'night') {
        setLightingProfile('NIGHT_DRIVE');
      } else {
        setLightingProfile('DAY_COAST');
      }
    }
  }, [activeScene, timeOfDay, weather, setLightingProfile]);

  // Manage ambient audio based on region
  useEffect(() => {
    if (activeScene === SCENES.FREE_ROAM) {
      if (activeRegion === 'coast') {
        audioManager.playEnvironmentAmbience('ocean');
      } else if (activeRegion === 'forest') {
        audioManager.playEnvironmentAmbience('forest');
      } else if (activeRegion === 'mountain') {
        audioManager.playEnvironmentAmbience('wind');
      }
    }
  }, [activeScene, activeRegion]);

  return null;
}
