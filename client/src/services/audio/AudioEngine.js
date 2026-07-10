/**
 * Portfolio OS - Web Audio API Synthesizer
 * Generates synthetic sounds directly in the browser to avoid external dependencies.
 */

class AudioEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
  }

  init() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.value = 0.5; // Default volume
  }

  setVolume(vol) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  playTone(frequency, type = 'sine', duration = 0.1, vol = 1) {
    if (!this.context) this.init();
    if (this.context.state === 'suspended') this.context.resume();

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    // Envelope
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(vol, this.context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  playNoise(duration = 0.1, vol = 1) {
    if (!this.context) this.init();
    if (this.context.state === 'suspended') this.context.resume();

    const bufferSize = this.context.sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const gainNode = this.context.createGain();
    // Quick fade out
    gainNode.gain.setValueAtTime(vol, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    // Filter to make it sound more like a tap/thud
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    noise.start();
  }
}

export const engine = new AudioEngine();
