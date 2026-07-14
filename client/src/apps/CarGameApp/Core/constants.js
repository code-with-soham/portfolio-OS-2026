// ============================================
// Car Experience — Scene IDs & Quality Presets
// ============================================

export const SCENES = {
  SPLASH: 'splash',
  LOADING: 'loading',
  MAIN_MENU: 'main_menu',
  GARAGE: 'garage',
  CAR_SELECT: 'car_select',
  FREE_ROAM: 'free_roam',
  RACE_LOADING: 'race_loading',
  GAMEPLAY: 'gameplay',
  PAUSE: 'pause',
  RESULTS: 'results',
  SETTINGS: 'settings',
};

export const CAMERA_MODES = {
  ORBIT: 'orbit',
  FOLLOW: 'follow',
  CINEMATIC: 'cinematic',
  COCKPIT: 'cockpit',
  HOOD: 'hood',
  BUMPER: 'bumper',
  DRONE: 'drone',
  FLYTHROUGH: 'flythrough',
  FOCUS: 'focus',
};

export const CAMERA_SHOTS = {
  HERO: { position: [6, 2, 6], target: [0, 0.8, 0], fov: 45 },
  FRONT_QUARTER: { position: [-4, 1.5, 5], target: [0, 0.6, 1], fov: 50 },
  REAR_QUARTER: { position: [5, 2, -4], target: [0, 0.8, -1], fov: 45 },
  SIDE_PROFILE: { position: [7, 1.2, 0], target: [0, 0.5, 0], fov: 40 },
  WHEEL: { position: [-2, 0.5, 3], target: [-0.8, 0.3, 1.4], fov: 35 },
  TOP: { position: [0, 8, 0.1], target: [0, 0, 0], fov: 50 },
};

export const LIGHTING_PROFILES = {
  SHOWROOM: {
    ambient: 0.15,
    keyLight: { intensity: 1.8, color: '#fff5e6' },
    fillLight: { intensity: 0.6, color: '#b0c4de' },
    rimLight: { intensity: 1.2, color: '#e0e8ff' },
    spotlights: true,
    fog: { color: '#0a0a0f', near: 15, far: 45 },
    envMapIntensity: 1.5,
  },
  DARK_STUDIO: {
    ambient: 0.05,
    keyLight: { intensity: 1.0, color: '#ffffff' },
    fillLight: { intensity: 0.2, color: '#4444ff' },
    rimLight: { intensity: 2.0, color: '#ff4444' },
    spotlights: false,
    fog: { color: '#000000', near: 5, far: 20 },
    envMapIntensity: 0.5,
  },
  DAY_COAST: {
    ambient: 0.4,
    keyLight: { intensity: 2.5, color: '#fffaed' },
    fillLight: { intensity: 0.8, color: '#aaccff' },
    rimLight: { intensity: 0.5, color: '#ffffff' },
    spotlights: false,
    fog: { color: '#88aadd', near: 100, far: 800 },
    envMapIntensity: 1.2,
  },
  SUNSET_COAST: {
    ambient: 0.3,
    keyLight: { intensity: 2.0, color: '#ffaa55' },
    fillLight: { intensity: 0.5, color: '#556688' },
    rimLight: { intensity: 1.0, color: '#ff66aa' },
    spotlights: false,
    fog: { color: '#cc6644', near: 50, far: 600 },
    envMapIntensity: 1.5,
  },
  NIGHT_DRIVE: {
    ambient: 0.05,
    keyLight: { intensity: 0.2, color: '#aaaaff' }, // Moonlight
    fillLight: { intensity: 0.05, color: '#444488' },
    rimLight: { intensity: 0.5, color: '#2222ff' },
    spotlights: false,
    fog: { color: '#050510', near: 20, far: 300 },
    envMapIntensity: 0.4,
  }
};

export const INTRO_TIMELINE = [
  { time: 0, action: 'LOGO_FADE_IN' },
  { time: 1.2, action: 'LOGO_FADE_OUT' },
  { time: 1.8, action: 'HEADLIGHTS_CLICK' },
  { time: 2.0, action: 'ENGINE_START' },
  { time: 2.1, action: 'LIGHTS_ON' },
  { time: 2.6, action: 'CAMERA_SWEEP' },
  { time: 4.8, action: 'UI_FADE_IN' },
  { time: 5.2, action: 'INTRO_COMPLETE' },
];

export const QUALITY_PRESETS = {
  ULTRA: {
    label: 'Ultra',
    bloom: true,
    ssao: true,
    shadows: 'high',
    reflections: 'ssr',
    dof: true,
    particles: 'full',
    antiAliasing: true,
    motionBlur: true,
    envMapResolution: 512,
    shadowMapSize: 2048,
  },
  HIGH: {
    label: 'High',
    bloom: true,
    ssao: true,
    shadows: 'medium',
    reflections: 'envmap',
    dof: true,
    particles: 'reduced',
    antiAliasing: true,
    motionBlur: false,
    envMapResolution: 256,
    shadowMapSize: 1024,
  },
  MEDIUM: {
    label: 'Medium',
    bloom: true,
    ssao: false,
    shadows: 'low',
    reflections: 'envmap',
    dof: false,
    particles: 'minimal',
    antiAliasing: false,
    motionBlur: false,
    envMapResolution: 128,
    shadowMapSize: 512,
  },
  LOW: {
    label: 'Low',
    bloom: false,
    ssao: false,
    shadows: 'off',
    reflections: 'off',
    dof: false,
    particles: 'off',
    antiAliasing: false,
    motionBlur: false,
    envMapResolution: 64,
    shadowMapSize: 256,
  },
};

export const TRANSITION_DURATION = 800; // ms
export const SPLASH_DURATION = 2500;
export const LOADING_MIN_DURATION = 3000;

export const AUDIO_CHANNELS = {
  MUSIC: 'music',
  UI: 'ui',
  VEHICLE: 'vehicle',
  ENVIRONMENT: 'environment',
  EFFECTS: 'effects',
};

export const CAR_CLASSES = {
  D: { label: 'Street', color: '#6b7280' },
  C: { label: 'Sport', color: '#3b82f6' },
  B: { label: 'Super', color: '#f59e0b' },
  A: { label: 'Hyper', color: '#ef4444' },
  S: { label: 'Ultimate', color: '#a855f7' },
};
