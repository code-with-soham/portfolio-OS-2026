// ============================================
// Car Experience — Road Network (Coastal Highway)
// ============================================
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSettingsStore } from '../Store/useSettingsStore';

export default function RoadNetwork() {
  const quality = useSettingsStore(s => s.quality);

  const { roadGeo, roadMat } = useMemo(() => {
    // 1. Define a CatmullRom spline loop for the road
    // A simple coastal loop: straight, hairpin, curve along coast, tunnel, return
    const points = [
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(20, 2, -30),
      new THREE.Vector3(50, 5, -50),
      new THREE.Vector3(100, 10, -30),
      new THREE.Vector3(120, 15, 0),
      new THREE.Vector3(100, 10, 30),
      new THREE.Vector3(50, 5, 50),
    ];
    
    const curve = new THREE.CatmullRomCurve3(points, true); // true = closed loop
    
    // 2. Define the cross-section (shape) of the road
    const roadWidth = 8;
    const shape = new THREE.Shape();
    shape.moveTo(-roadWidth / 2, 0);
    shape.lineTo(roadWidth / 2, 0);
    shape.lineTo(roadWidth / 2, -0.2); // thickness
    shape.lineTo(-roadWidth / 2, -0.2);
    shape.lineTo(-roadWidth / 2, 0);
    
    // 3. Extrude the shape along the curve
    const extrudeSettings = {
      steps: 200, // Resolution of the road along the curve
      bevelEnabled: false,
      extrudePath: curve
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Calculate UVs manually so asphalt texture can tile properly if we add one later
    
    const material = new THREE.MeshStandardMaterial({
      color: '#333338',
      roughness: 0.8,
      metalness: 0.1,
    });
    
    return { roadGeo: geometry, roadMat: material };
  }, []);

  return (
    <group position={[0, -4.9, 0]}>
      {/* The Road */}
      <mesh geometry={roadGeo} material={roadMat} receiveShadow castShadow />
      
      {/* In the future, we will place RoadSegment components here for collision, guardrails, checkpoints, etc. */}
    </group>
  );
}
