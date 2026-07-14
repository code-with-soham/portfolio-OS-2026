// ============================================
// Car Experience — Audio Manager
// ============================================
// Simple audio manager using Web Audio API for Phase 1.
// We'll use synth tones for UI feedback to avoid external asset dependencies.
import { useSettingsStore } from '../Store/useSettingsStore';

import { useSettingsStore } from '../Store/useSettingsStore';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.uiGain = null;
    this.engineGain = null;
    this.envGain = null;
    
    // Ongoing synth references
    this.engineOsc = null;
    this.envNoise = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.uiGain = this.ctx.createGain();
      this.engineGain = this.ctx.createGain();
      this.envGain = this.ctx.createGain();
      
      this.uiGain.connect(this.masterGain);
      this.engineGain.connect(this.masterGain);
      this.envGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      
      useSettingsStore.subscribe((state) => {
        if (this.masterGain) {
          this.masterGain.gain.value = state.masterVolume;
          this.uiGain.gain.value = state.uiVolume;
          this.engineGain.gain.value = state.vehicleVolume;
          this.envGain.gain.value = state.environmentVolume;
        }
      });
      
      const state = useSettingsStore.getState();
      this.masterGain.gain.value = state.masterVolume;
      this.uiGain.gain.value = state.uiVolume;
      this.engineGain.gain.value = state.vehicleVolume;
      this.envGain.gain.value = state.environmentVolume;
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  playUIPop() {
    this.ensureContext();
    if (this.uiGain.gain.value <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.uiGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playUISelect() {
    this.ensureContext();
    if (this.uiGain.gain.value <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.uiGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playEngineStart() {
    this.ensureContext();
    if (this.engineGain.gain.value <= 0) return;

    // A low frequency sawtooth for engine rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    
    // Rev up
    osc.frequency.setValueAtTime(30, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 1.5); // Settle to idle

    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.5);
    filter.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 1.5); // Idle volume

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.engineGain);

    osc.start();
    
    // Save reference if we want to keep it idling, but for now we'll just stop it after 5 seconds to simulate an intro
    osc.stop(this.ctx.currentTime + 5.0);
  }

  playEnvironmentAmbience() {
    this.ensureContext();
    if (this.envGain.gain.value <= 0) return;

    // Generate white noise for HVAC/Garage ambience
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Muffled HVAC sound

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 2.0); // Fade in

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.envGain);

    noise.start();
    this.envNoise = { source: noise, gain: gain };
  }
}

export const audioManager = new AudioManager();
