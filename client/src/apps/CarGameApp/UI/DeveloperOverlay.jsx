// ============================================
// Car Experience — Developer Overlay (F3)
// ============================================
import { useSettingsStore } from '../Store/useSettingsStore';
import { useSceneStore } from '../Store/useSceneStore';
import { useCameraStore } from '../Store/useCameraStore';

export default function DeveloperOverlay() {
  const show = useSettingsStore((s) => s.showDeveloperOverlay);
  const quality = useSettingsStore((s) => s.qualityPreset);
  const activeScene = useSceneStore((s) => s.activeScene);
  const cameraShot = useCameraStore((s) => s.activeShot);

  if (!show) return null;

  return (
    <div className="car-dev-custom-stats">
      <div className="car-dev-stat">
        <span>Scene:</span> <span>{activeScene}</span>
      </div>
      <div className="car-dev-stat">
        <span>Camera:</span> <span>{cameraShot}</span>
      </div>
      <div className="car-dev-stat">
        <span>Graphics:</span> <span>{quality}</span>
      </div>
      <div className="car-dev-stat">
        <span>Renderer:</span> <span>React Three Fiber</span>
      </div>
    </div>
  );
}
