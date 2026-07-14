// ============================================
// Car Experience — Procedural Car Generator
// ============================================
// Generates a stylized 3D car from carData parameters.
// Each car has: body, cabin, wheels, headlights, taillights.
// Colors and proportions vary by bodyStyle.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Wheel component with rotation animation
function Wheel({ position, radius = 0.3, width = 0.2 }) {
  const ref = useRef();

  return (
    <group position={position}>
      {/* Tire */}
      <mesh ref={ref} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, width, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.65, radius * 0.65, width + 0.02, 6]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Rim center */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.15, radius * 0.15, width + 0.04, 12]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

// Headlight emissive sphere
function Headlight({ position, on = true }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={on ? '#ffffcc' : '#333333'}
        emissiveIntensity={on ? 3 : 0}
        roughness={0.1}
        metalness={0.5}
      />
    </mesh>
  );
}

// Taillight emissive
function Taillight({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.15, 0.06, 0.03]} />
      <meshStandardMaterial
        color="#ff0000"
        emissive="#ff2200"
        emissiveIntensity={2}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
}

// Body dimensions by style
const BODY_CONFIGS = {
  supercar: {
    bodyLength: 4.2, bodyWidth: 1.9, bodyHeight: 0.45,
    cabinLength: 1.6, cabinHeight: 0.55, cabinOffset: -0.3,
    wheelbase: 2.8, trackWidth: 1.7, wheelRadius: 0.33,
    hoodSlope: 0.12, rearSlope: 0.2,
  },
  sports: {
    bodyLength: 4.0, bodyWidth: 1.8, bodyHeight: 0.42,
    cabinLength: 1.8, cabinHeight: 0.5, cabinOffset: -0.2,
    wheelbase: 2.5, trackWidth: 1.6, wheelRadius: 0.31,
    hoodSlope: 0.1, rearSlope: 0.15,
  },
  coupe: {
    bodyLength: 4.5, bodyWidth: 1.85, bodyHeight: 0.5,
    cabinLength: 2.0, cabinHeight: 0.55, cabinOffset: -0.15,
    wheelbase: 2.7, trackWidth: 1.65, wheelRadius: 0.32,
    hoodSlope: 0.08, rearSlope: 0.12,
  },
};

export default function ProceduralCar({ carData, enableIdleAnimation = true }) {
  const groupRef = useRef();
  const wheelFLRef = useRef();
  const wheelFRRef = useRef();
  const config = BODY_CONFIGS[carData.bodyStyle] || BODY_CONFIGS.supercar;
  const { primary, accent, metalness, roughness } = carData.color;

  // Idle engine vibration and steering twitch
  useFrame((state, delta) => {
    if (groupRef.current && enableIdleAnimation) {
      const t = state.clock.elapsedTime;
      
      // Engine vibration (high frequency, very low amplitude Y)
      const vibration = Math.sin(t * 25) * 0.001;
      
      // Suspension breathing (low frequency, low amplitude Y)
      const suspension = Math.sin(t * 1.5) * 0.002;
      
      // Slight body roll (X and Z axis rotation)
      const rollX = Math.sin(t * 0.8) * 0.0005;
      const rollZ = Math.cos(t * 1.1) * 0.0005;

      groupRef.current.position.y = (config.wheelRadius + config.bodyHeight / 2 + 0.05) + vibration + suspension;
      groupRef.current.rotation.x = rollX;
      groupRef.current.rotation.z = rollZ;

      // Steering twitch
      if (wheelFLRef.current && wheelFRRef.current) {
        // Slow wander between -0.05 and 0.05 radians
        const steering = Math.sin(t * 0.4) * Math.cos(t * 0.7) * 0.05;
        // The wheels are rotated Math.PI/2 initially, so we apply steering on the Y axis of the parent group
        // The wheel mesh itself is rotated, so we should apply this to the group wrapping it.
      }
    }
  });

  const bodyMaterial = useMemo(() => (
    new THREE.MeshPhysicalMaterial({
      color: primary,
      metalness: metalness,
      roughness: roughness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 2.0,
    })
  ), [primary, metalness, roughness]);

  const glassMaterial = useMemo(() => (
    new THREE.MeshPhysicalMaterial({
      color: '#111122',
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.9,
      transparent: true,
      opacity: 0.3,
      ior: 1.5,
    })
  ), []);

  const {
    bodyLength, bodyWidth, bodyHeight,
    cabinLength, cabinHeight, cabinOffset,
    wheelbase, trackWidth, wheelRadius,
    hoodSlope, rearSlope,
  } = config;

  return (
    <group ref={groupRef} position={[0, wheelRadius + bodyHeight / 2 + 0.05, 0]}>
      {/* Main Body */}
      <mesh castShadow material={bodyMaterial}>
        <boxGeometry args={[bodyWidth, bodyHeight, bodyLength]} />
      </mesh>

      {/* Hood — angled front section */}
      <mesh castShadow material={bodyMaterial} position={[0, bodyHeight * 0.2, bodyLength / 2 - 0.6]} rotation={[hoodSlope, 0, 0]}>
        <boxGeometry args={[bodyWidth - 0.05, bodyHeight * 0.3, 1.2]} />
      </mesh>

      {/* Rear diffuser area */}
      <mesh castShadow position={[0, -bodyHeight * 0.15, -bodyLength / 2 + 0.3]}>
        <boxGeometry args={[bodyWidth - 0.1, bodyHeight * 0.3, 0.6]} />
        <meshStandardMaterial color={accent} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Cabin / Greenhouse */}
      <mesh castShadow material={glassMaterial} position={[0, bodyHeight / 2 + cabinHeight / 2, cabinOffset]}>
        <boxGeometry args={[bodyWidth - 0.3, cabinHeight, cabinLength]} />
      </mesh>

      {/* Spoiler (supercars only) */}
      {carData.bodyStyle === 'supercar' && (
        <group position={[0, bodyHeight / 2 + 0.15, -bodyLength / 2 + 0.15]}>
          <mesh castShadow material={bodyMaterial}>
            <boxGeometry args={[bodyWidth + 0.1, 0.04, 0.25]} />
          </mesh>
          {/* Spoiler supports */}
          <mesh castShadow position={[-0.5, -0.1, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.08]} />
            <meshStandardMaterial color={accent} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[0.5, -0.1, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.08]} />
            <meshStandardMaterial color={accent} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Wheels */}
      <group position={[-trackWidth / 2, -bodyHeight / 2 - 0.05, wheelbase / 2]} ref={wheelFRRef}>
        <Wheel radius={wheelRadius} />
      </group>
      <group position={[trackWidth / 2, -bodyHeight / 2 - 0.05, wheelbase / 2]} ref={wheelFLRef}>
        <Wheel radius={wheelRadius} />
      </group>
      <group position={[-trackWidth / 2, -bodyHeight / 2 - 0.05, -wheelbase / 2]}>
        <Wheel radius={wheelRadius} />
      </group>
      <group position={[trackWidth / 2, -bodyHeight / 2 - 0.05, -wheelbase / 2]}>
        <Wheel radius={wheelRadius} />
      </group>

      {/* Headlights */}
      <Headlight position={[-bodyWidth / 2 + 0.15, 0.05, bodyLength / 2 + 0.01]} />
      <Headlight position={[bodyWidth / 2 - 0.15, 0.05, bodyLength / 2 + 0.01]} />

      {/* Taillights */}
      <Taillight position={[-bodyWidth / 2 + 0.2, 0.08, -bodyLength / 2 - 0.01]} />
      <Taillight position={[bodyWidth / 2 - 0.2, 0.08, -bodyLength / 2 - 0.01]} />
    </group>
  );
}
