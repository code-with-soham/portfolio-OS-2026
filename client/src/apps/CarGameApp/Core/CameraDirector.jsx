// ============================================
// Car Experience — Camera Director
// ============================================
// Unified camera system for all scenes.
// Handles: orbit, focus, zoom, fly-through, cinematic transitions.

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useCameraStore } from '../Store/useCameraStore';
import { useSceneStore } from '../Store/useSceneStore';
import { SCENES, CAMERA_MODES } from '../Core/constants';
import * as THREE from 'three';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useCameraStore } from '../Store/useCameraStore';
import { useSceneStore } from '../Store/useSceneStore';
import { SCENES, CAMERA_MODES, CAMERA_SHOTS } from '../Core/constants';
import * as THREE from 'three';

const DEFAULT_SHOT = CAMERA_SHOTS.HERO;

export default function CameraDirector() {
  const { camera } = useThree();
  const mode = useCameraStore((s) => s.mode);
  const activeShot = useCameraStore((s) => s.activeShot);
  const orbitSpeed = useCameraStore((s) => s.orbitSpeed);
  const activeScene = useSceneStore((s) => s.activeScene);

  const targetRef = useRef(new THREE.Vector3(...DEFAULT_SHOT.target));
  const posRef = useRef(new THREE.Vector3(...DEFAULT_SHOT.position));
  const angleRef = useRef(0);
  
  // For spherical interpolation (SLERP)
  const currentQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());
  const lookAtMatrix = useRef(new THREE.Matrix4());
  
  useEffect(() => {
    // When shot changes, update the target refs
    const config = CAMERA_SHOTS[activeShot] || DEFAULT_SHOT;
    // We don't instantly jump; we let useFrame lerp there
  }, [activeShot]);

  useFrame((state, delta) => {
    // Phase 2.1: Free Roam Cinematic Flythrough
    if (activeScene === SCENES.FREE_ROAM) {
      const t = state.clock.elapsedTime;
      // Large slow orbit around the bridge/mountain area for proof of concept
      const r = 150;
      posRef.current.lerp(new THREE.Vector3(Math.cos(t * 0.05) * r, 40, Math.sin(t * 0.05) * r), delta * 2);
      targetRef.current.lerp(new THREE.Vector3(50, 10, -30), delta * 2);
    } else {
      // Phase 1.5: Showroom logic
      const config = CAMERA_SHOTS[activeShot] || DEFAULT_SHOT;
      targetRef.current.lerp(new THREE.Vector3(...config.target), delta * 4);

      if (mode === CAMERA_MODES.ORBIT) {
        angleRef.current += delta * orbitSpeed;
        const radius = Math.sqrt(config.position[0] ** 2 + config.position[2] ** 2);
        const desiredX = Math.sin(angleRef.current) * radius;
        const desiredZ = Math.cos(angleRef.current) * radius;
        const desiredY = config.position[1];

        posRef.current.lerp(new THREE.Vector3(desiredX, desiredY, desiredZ), delta * 2);
      } else if (mode === CAMERA_MODES.FOCUS) {
        posRef.current.lerp(new THREE.Vector3(...config.position), delta * 3);
      }
    }

    // Apply position
    camera.position.copy(posRef.current);

    // SLERP Rotation
    lookAtMatrix.current.lookAt(camera.position, targetRef.current, camera.up);
    targetQuat.current.setFromRotationMatrix(lookAtMatrix.current);
    
    currentQuat.current.copy(camera.quaternion);
    currentQuat.current.slerp(targetQuat.current, delta * 5);
    
    camera.quaternion.copy(currentQuat.current);
    
    // Smoothly interpolate FOV
    const targetFov = activeScene === SCENES.FREE_ROAM ? 60 : (CAMERA_SHOTS[activeShot]?.fov || DEFAULT_SHOT.fov);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 3);
    camera.updateProjectionMatrix();
  });

  return null;
}
