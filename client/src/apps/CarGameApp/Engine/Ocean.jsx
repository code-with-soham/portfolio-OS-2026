// ============================================
// Car Experience — Ocean Plane
// ============================================
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Ocean() {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame((state, delta) => {
    // Simple animated water normal/offset
    if (matRef.current && matRef.current.normalMap) {
      matRef.current.normalMap.offset.x += delta * 0.05;
      matRef.current.normalMap.offset.y += delta * 0.02;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -5.5, 0]} // Just below terrain
    >
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial
        ref={matRef}
        color="#003366"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={2.0}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}
