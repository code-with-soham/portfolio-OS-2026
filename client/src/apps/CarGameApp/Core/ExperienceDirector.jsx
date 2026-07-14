// ============================================
// Car Experience — Experience Director
// ============================================
// Orchestrates timelines, scene changes, audio cues, and lighting profiles.
import { useEffect, useRef } from 'react';
import { useSceneStore } from '../Store/useSceneStore';
import { useCameraStore } from '../Store/useCameraStore';
import { SCENES, INTRO_TIMELINE, CAMERA_MODES, CAMERA_SHOTS } from '../Core/constants';
import { audioManager } from '../Audio/audioManager';

export default function ExperienceDirector() {
  const activeScene = useSceneStore((s) => s.activeScene);
  const introComplete = useSceneStore((s) => s.introComplete);
  const forceScene = useSceneStore((s) => s.forceScene);
  const setIntroComplete = useSceneStore((s) => s.setIntroComplete);
  const setIntroAction = useSceneStore((s) => s.setIntroAction);
  const setLightingProfile = useSceneStore((s) => s.setLightingProfile);
  
  const setCameraMode = useCameraStore((s) => s.setMode);
  const setCameraShot = useCameraStore((s) => s.setShot);

  const introTimeoutsRef = useRef([]);

  // Run intro sequence when the scene is SPLASH and intro is not complete
  useEffect(() => {
    if (activeScene === SCENES.SPLASH && !introComplete) {
      // Setup initial state for intro
      setLightingProfile('DARK_STUDIO');
      setCameraMode(CAMERA_MODES.FOCUS);
      setCameraShot('HERO');

      const startTime = Date.now();

      INTRO_TIMELINE.forEach((event) => {
        const timeout = setTimeout(() => {
          setIntroAction(event.action);

          // Handle specific events
          switch (event.action) {
            case 'HEADLIGHTS_CLICK':
              audioManager.playUIPop(); // Synth click
              break;
            case 'ENGINE_START':
              audioManager.playEngineStart(); // Synth rumble
              break;
            case 'LIGHTS_ON':
              setLightingProfile('SHOWROOM');
              break;
            case 'CAMERA_SWEEP':
              setCameraMode(CAMERA_MODES.ORBIT);
              audioManager.playEnvironmentAmbience();
              break;
            case 'INTRO_COMPLETE':
              setIntroComplete(true);
              forceScene(SCENES.MAIN_MENU);
              break;
            default:
              break;
          }
        }, event.time * 1000);

        introTimeoutsRef.current.push(timeout);
      });
    }

    return () => {
      // Cleanup timeouts if unmounted
      introTimeoutsRef.current.forEach(clearTimeout);
    };
  }, [activeScene, introComplete, forceScene, setIntroAction, setIntroComplete, setLightingProfile, setCameraMode, setCameraShot]);

  // Handle scene-specific orchestration (post-intro)
  useEffect(() => {
    if (!introComplete) return;

    if (activeScene === SCENES.GARAGE || activeScene === SCENES.MAIN_MENU) {
      setLightingProfile('SHOWROOM');
      setCameraMode(CAMERA_MODES.ORBIT);
    } else if (activeScene === SCENES.CAR_SELECT) {
      setLightingProfile('SHOWROOM');
      setCameraMode(CAMERA_MODES.FOCUS);
      setCameraShot('FRONT_QUARTER');
    }
  }, [activeScene, introComplete, setLightingProfile, setCameraMode, setCameraShot]);

  return null; // This component handles logic, no rendering
}
