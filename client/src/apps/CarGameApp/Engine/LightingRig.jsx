// ============================================
// Car Experience — Professional Lighting Rig
// ============================================
// Key Light, Fill Light, Rim Light, Floor Spots, Fog
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSettingsStore } from '../Store/useSettingsStore';
import { useSceneStore } from '../Store/useSceneStore';
import { LIGHTING_PROFILES } from '../Core/constants';

export default function LightingRig() {
  const quality = useSettingsStore((s) => s.quality);
  const shadowSize = quality.shadowMapSize || 1024;
  const castShadows = quality.shadows !== 'off';
  
  const activeProfileName = useSceneStore((s) => s.lightingProfile);
  const profile = LIGHTING_PROFILES[activeProfileName] || LIGHTING_PROFILES.SHOWROOM;

  const spot1Ref = useRef();
  const spot2Ref = useRef();
  const spot3Ref = useRef();

  useFrame((state) => {
    // Subtle breathing animation for spotlights
    const t = state.clock.elapsedTime;
    if (spot1Ref.current) spot1Ref.current.intensity = 2.5 + Math.sin(t * 1.5) * 0.2;
    if (spot2Ref.current) spot2Ref.current.intensity = 1.0 + Math.sin(t * 1.2 + 1) * 0.15;
    if (spot3Ref.current) spot3Ref.current.intensity = 1.0 + Math.sin(t * 1.4 + 2) * 0.15;
  });

  return (
    <>
      <ambientLight intensity={profile.ambient} color="#8090b0" />

      <directionalLight
        position={[8, 12, 5]}
        intensity={profile.keyLight.intensity}
        color={profile.keyLight.color}
        castShadow={castShadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      <directionalLight
        position={[-6, 8, -3]}
        intensity={profile.fillLight.intensity}
        color={profile.fillLight.color}
      />

      <directionalLight
        position={[0, 5, -8]}
        intensity={profile.rimLight.intensity}
        color={profile.rimLight.color}
      />

      {profile.spotlights && (
        <>
          <spotLight
            ref={spot1Ref}
            position={[0, 8, 0]}
            angle={0.5}
            penumbra={0.8}
            color="#ffffff"
            castShadow={castShadows}
            shadow-mapSize-width={shadowSize}
            shadow-mapSize-height={shadowSize}
            target-position={[0, 0, 0]}
          />
          <spotLight
            ref={spot2Ref}
            position={[-5, 6, 2]}
            angle={0.4}
            penumbra={1}
            color="#4488ff"
          />
          <spotLight
            ref={spot3Ref}
            position={[5, 6, -2]}
            angle={0.4}
            penumbra={1}
            color="#ff6644"
          />
        </>
      )}

      {profile.fog && (
        <fog attach="fog" args={[profile.fog.color, profile.fog.near, profile.fog.far]} />
      )}
    </>
  );
}
