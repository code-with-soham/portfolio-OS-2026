// ============================================
// Car Experience — Garage / Showroom Environment
// ============================================
// Mercedes-AMG-showroom-inspired space
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, ContactShadows } from '@react-three/drei';
import { useSettingsStore } from '../Store/useSettingsStore';
import { useSceneStore } from '../Store/useSceneStore';
import { LIGHTING_PROFILES } from '../Core/constants';

// Reflective floor
function GarageFloor({ envMapIntensity = 1.5 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#0d0d12"
        metalness={0.95}
        roughness={0.05}
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
}

// Showroom walls — subtle dark enclosure
function GarageWalls() {
  const wallMaterial = useMemo(() => (
    new THREE.MeshStandardMaterial({
      color: '#0a0a10',
      metalness: 0.3,
      roughness: 0.8,
    })
  ), []);

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 6, -15]} material={wallMaterial}>
        <planeGeometry args={[60, 14]} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-15, 6, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[30, 14]} />
      </mesh>
      {/* Right wall */}
      <mesh position={[15, 6, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[30, 14]} />
      </mesh>
    </group>
  );
}

// Animated floating particles (dust motes in showroom lights)
function GarageParticles({ count = 200 }) {
  const quality = useSettingsStore((s) => s.quality);
  if (quality.particles === 'off') return null;

  const particleCount = quality.particles === 'full' ? count : quality.particles === 'reduced' ? count / 2 : count / 4;

  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [particleCount]);

  useFrame((_, delta) => {
    if (mesh.current) {
      const posArray = mesh.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += delta * 0.08;
        if (posArray[i * 3 + 1] > 8) posArray[i * 3 + 1] = 0;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function GarageEnvironment() {
  const quality = useSettingsStore((s) => s.quality);
  const activeProfileName = useSceneStore((s) => s.lightingProfile);
  const profile = LIGHTING_PROFILES[activeProfileName] || LIGHTING_PROFILES.SHOWROOM;
  
  const envRef = useRef();
  
  useFrame((state, delta) => {
    // Slowly rotate environment to create dynamic reflections on the car
    if (envRef.current) {
      envRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={envRef}>
      {/* HDR Environment for reflections */}
      <Environment
        preset="studio"
        resolution={quality.envMapResolution || 256}
        background={false}
      />

      {/* Physical environment */}
      <GarageFloor envMapIntensity={profile.envMapIntensity} />
      <GarageWalls />
      <GarageParticles />

      {/* Contact shadows under the car */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={12}
        blur={2}
        far={4}
        color="#000000"
      />
    </group>
  );
}
