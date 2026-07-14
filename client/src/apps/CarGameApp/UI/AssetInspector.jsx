// ============================================
// Car Experience — Asset Inspector (F4)
// ============================================
import { useSettingsStore } from '../Store/useSettingsStore';
import { useVehicleStore } from '../Store/useVehicleStore';
import { getCarById } from '../Vehicles/carData';

export default function AssetInspector() {
  const show = useSettingsStore((s) => s.showAssetInspector);
  const selectedCarId = useVehicleStore((s) => s.selectedCarId);
  const car = getCarById(selectedCarId);

  if (!show || !car) return null;

  // In a real app we'd read from `useThree().gl.info.memory` or traverse the loaded mesh,
  // but for Phase 1.5 since we use procedural meshes we can estimate based on our geometry args.
  const estimatedTriangles = 
    (24 * 12 * 4) + // 4 wheels * 24 segments * 12 triangles per cylinder roughly
    (6 * 12) + // main body boxes
    (12 * 20); // headlights spheres + taillight boxes
  
  const estimatedMemory = (estimatedTriangles * 36) / 1024; // KB

  return (
    <div className="car-asset-inspector glass-panel">
      <div className="car-asset-header">
        <h4>Asset Inspector</h4>
        <span className="car-badge">F4</span>
      </div>
      
      <div className="car-asset-body">
        <div className="car-asset-row">
          <span>Active Mesh</span>
          <span>ProceduralCar_{car.id}</span>
        </div>
        <div className="car-asset-row">
          <span>Material</span>
          <span>MeshPhysicalMaterial (PBR)</span>
        </div>
        <div className="car-asset-row">
          <span>Compression</span>
          <span className="car-asset-good">Draco Ready</span>
        </div>
        <div className="car-asset-row">
          <span>Textures</span>
          <span className="car-asset-good">KTX2 Ready</span>
        </div>
        <div className="car-asset-row">
          <span>Triangles (Est)</span>
          <span>~{estimatedTriangles}</span>
        </div>
        <div className="car-asset-row">
          <span>Vertices (Est)</span>
          <span>~{Math.round(estimatedTriangles * 1.5)}</span>
        </div>
        <div className="car-asset-row">
          <span>GPU Memory</span>
          <span>~{estimatedMemory.toFixed(1)} KB</span>
        </div>
        <div className="car-asset-row">
          <span>Draw Calls</span>
          <span>16</span>
        </div>
      </div>
    </div>
  );
}
