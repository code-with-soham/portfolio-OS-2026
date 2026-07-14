// ============================================
// Car Experience — R3F Canvas Wrapper
// ============================================
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useSettingsStore } from '../Store/useSettingsStore';

export default function Canvas3D({ children }) {
  const quality = useSettingsStore((s) => s.quality);

  return (
    <Canvas
      shadows={quality.shadows !== 'off'}
      dpr={[1, quality.antiAliasing ? 2 : 1]}
      gl={{
        antialias: quality.antiAliasing,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ position: [6, 3, 6], fov: 50, near: 0.1, far: 500 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}
