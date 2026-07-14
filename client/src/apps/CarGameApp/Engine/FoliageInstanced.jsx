// ============================================
// Car Experience — Instanced Foliage (Trees/Rocks)
// ============================================
import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useSettingsStore } from '../Store/useSettingsStore';

export default function FoliageInstanced() {
  const quality = useSettingsStore(s => s.qualityPreset);
  const meshRef = useRef();

  // Number of trees based on quality
  const count = useMemo(() => {
    switch(quality) {
      case 'ULTRA': return 2000;
      case 'HIGH': return 1000;
      case 'MEDIUM': return 500;
      case 'LOW': return 100;
      default: return 500;
    }
  }, [quality]);

  const { geometry, material } = useMemo(() => {
    // Simple low-poly tree representation (cone for pine tree)
    const geo = new THREE.ConeGeometry(2, 8, 5);
    const mat = new THREE.MeshStandardMaterial({
      color: '#1e4012', // Dark pine green
      roughness: 0.9,
      metalness: 0.0
    });
    return { geometry: geo, material: mat };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    
    // Scatter trees outside the road radius (road is approx r=50 to 120 based on RoadNetwork points)
    // We'll scatter them from radius 150 to 400
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 150 + Math.random() * 250;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Height based on distance to simulate hills (matching TerrainChunk logic)
      const height = Math.max(0, (Math.sin(x * 0.05) * Math.cos(z * 0.05)) * (radius * 0.05));
      const y = -5 + height + 4; // terrain base + terrain height + half tree height
      
      dummy.position.set(x, y, z);
      dummy.rotation.y = Math.random() * Math.PI;
      // Random scaling for variety
      const scale = 0.5 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
}
