// ============================================
// Car Experience — Settings Panel
// ============================================
import { motion } from 'framer-motion';
import { useSceneStore } from '../Store/useSceneStore';
import { useSettingsStore } from '../Store/useSettingsStore';
import { SCENES, QUALITY_PRESETS } from '../Core/constants';

function SliderRow({ label, value, onChange, min = 0, max = 1, step = 0.05 }) {
  return (
    <div className="car-setting-row">
      <label className="car-setting-label">{label}</label>
      <input
        type="range"
        className="car-setting-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="car-setting-val">{Math.round(value * 100)}%</span>
    </div>
  );
}

export default function SettingsPanel() {
  const forceScene = useSceneStore((s) => s.forceScene);
  const {
    qualityPreset, setQuality,
    masterVolume, setMasterVolume,
    musicVolume, setMusicVolume,
    uiVolume, setUIVolume,
    vehicleVolume, setVehicleVolume,
    environmentVolume, setEnvironmentVolume,
    reducedMotion, setReducedMotion,
    cameraShake, setCameraShake,
  } = useSettingsStore();

  return (
    <motion.div
      className="car-settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="car-settings-topbar">
        <button className="car-glass-btn" onClick={() => forceScene(SCENES.MAIN_MENU)}>
          ← Back
        </button>
        <h2 className="car-settings-title">SETTINGS</h2>
      </div>

      <div className="car-settings-grid">
        {/* Graphics */}
        <motion.div
          className="car-settings-section glass-panel"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="car-settings-section-title">🖥️ Graphics</h3>
          <div className="car-quality-buttons">
            {Object.keys(QUALITY_PRESETS).map((preset) => (
              <button
                key={preset}
                className={`car-quality-btn ${qualityPreset === preset ? 'active' : ''}`}
                onClick={() => setQuality(preset)}
              >
                {QUALITY_PRESETS[preset].label}
              </button>
            ))}
          </div>
          <div className="car-quality-details">
            <p>Bloom: {QUALITY_PRESETS[qualityPreset]?.bloom ? '✅' : '❌'}</p>
            <p>SSAO: {QUALITY_PRESETS[qualityPreset]?.ssao ? '✅' : '❌'}</p>
            <p>Shadows: {QUALITY_PRESETS[qualityPreset]?.shadows}</p>
            <p>DoF: {QUALITY_PRESETS[qualityPreset]?.dof ? '✅' : '❌'}</p>
            <p>Anti-Aliasing: {QUALITY_PRESETS[qualityPreset]?.antiAliasing ? '✅' : '❌'}</p>
          </div>
        </motion.div>

        {/* Audio */}
        <motion.div
          className="car-settings-section glass-panel"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="car-settings-section-title">🔊 Audio</h3>
          <SliderRow label="Master" value={masterVolume} onChange={setMasterVolume} />
          <SliderRow label="Music" value={musicVolume} onChange={setMusicVolume} />
          <SliderRow label="UI" value={uiVolume} onChange={setUIVolume} />
          <SliderRow label="Vehicle" value={vehicleVolume} onChange={setVehicleVolume} />
          <SliderRow label="Environment" value={environmentVolume} onChange={setEnvironmentVolume} />
        </motion.div>

        {/* Accessibility */}
        <motion.div
          className="car-settings-section glass-panel"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="car-settings-section-title">♿ Accessibility</h3>
          <div className="car-setting-row toggle-row">
            <label>Reduced Motion</label>
            <button
              className={`car-toggle ${reducedMotion ? 'on' : ''}`}
              onClick={() => setReducedMotion(!reducedMotion)}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="car-setting-row toggle-row">
            <label>Camera Shake</label>
            <button
              className={`car-toggle ${cameraShake ? 'on' : ''}`}
              onClick={() => setCameraShake(!cameraShake)}
            >
              {cameraShake ? 'ON' : 'OFF'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
