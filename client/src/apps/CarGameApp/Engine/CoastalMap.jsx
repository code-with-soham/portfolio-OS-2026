// ============================================
// Car Experience — Coastal Map (World Sandbox)
// ============================================
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import { useWorldStore } from '../Store/useWorldStore';
import { useSettingsStore } from '../Store/useSettingsStore';
import RoadNetwork from './RoadNetwork';
import Ocean from './Ocean';
import FoliageInstanced from './FoliageInstanced';
import TerrainChunk from './TerrainChunk';

export default function CoastalMap() {
  const timeOfDay = useWorldStore((s) => s.timeOfDay);
  const quality = useSettingsStore((s) => s.quality);
  
  const getSunPosition = () => {
    switch (timeOfDay) {
      case 'dawn': return [10, 2, -10];
      case 'day': return [0, 20, 0];
      case 'sunset': return [-10, 1, 10];
      case 'night': return [0, -10, 0];
      default: return [0, 20, 0];
    }
  };

  return (
    <group name="coastal-map">
      {/* Sky & Atmosphere */}
      {timeOfDay !== 'night' && (
        <Sky sunPosition={getSunPosition()} turbidity={0.3} rayleigh={1.2} mieCoefficient={0.005} mieDirectionalG={0.7} />
      )}
      
      {/* Dynamic HDR based on time */}
      <Environment preset={timeOfDay === 'night' ? 'night' : (timeOfDay === 'sunset' ? 'sunset' : 'park')} resolution={quality.envMapResolution} background={timeOfDay === 'night'} />
      
      {/* World Layers */}
      <Ocean />
      
      {/* Procedural Modular Terrain */}
      <TerrainChunk position={[0, -5, 0]} size={1000} />
      
      {/* Modular Spline Road */}
      <RoadNetwork />
      
      {/* Instanced Props */}
      <FoliageInstanced />
    </group>
  );
}
