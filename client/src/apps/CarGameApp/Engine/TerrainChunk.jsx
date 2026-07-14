// ============================================
// Car Experience — Modular Terrain Chunk
// ============================================
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSettingsStore } from '../Store/useSettingsStore';

export default function TerrainChunk({ position, size = 1000 }) {
  const quality = useSettingsStore(s => s.quality);
  
  // Create a bumpy terrain plane
  const geometry = useMemo(() => {
    // High quality = more segments
    const segments = quality.shadowMapSize > 1024 ? 128 : 64;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Simple displacement using noise simulation
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Keep center somewhat flat for the road
      const distFromCenter = Math.sqrt(x*x + y*y);
      if (distFromCenter > 50) {
        // Hilly outside
        const height = (Math.sin(x * 0.05) * Math.cos(y * 0.05)) * (distFromCenter * 0.05);
        pos.setZ(i, Math.max(0, height));
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [size, quality]);

  return (
    <mesh 
      geometry={geometry} 
      position={position} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <meshStandardMaterial 
        color="#2d4c1e" // Deep green
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}
