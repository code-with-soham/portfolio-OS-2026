// ============================================
// Car Experience — Post-Processing Pipeline
// ============================================
// Quality-aware: adjusts effects based on settings store.
import { EffectComposer, Bloom, SSAO, DepthOfField, Vignette } from '@react-three/postprocessing';
import { useSettingsStore } from '../Store/useSettingsStore';

export default function PostProcessingPipeline() {
  const quality = useSettingsStore((s) => s.quality);

  // Don't render anything on LOW
  if (!quality.bloom && !quality.ssao && !quality.dof) return null;

  return (
    <EffectComposer multisampling={quality.antiAliasing ? 4 : 0}>
      {quality.bloom && (
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      )}
      {quality.ssao && (
        <SSAO
          samples={16}
          radius={0.15}
          intensity={20}
          luminanceInfluence={0.5}
        />
      )}
      {quality.dof && (
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.05}
          bokehScale={3}
        />
      )}
      <Vignette offset={0.3} darkness={0.6} />
    </EffectComposer>
  );
}
