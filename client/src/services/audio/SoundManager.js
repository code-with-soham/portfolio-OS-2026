import { engine } from './AudioEngine';
// Future: import { useSystemAudioStore } from '../../store/useSystemAudioStore';

class SoundManager {
  constructor() {
    this.muted = false;
  }

  setGlobalVolume(volume) {
    engine.setVolume(volume);
  }

  toggleMute() {
    this.muted = !this.muted;
  }

  play(soundId) {
    if (this.muted) return;

    switch (soundId) {
      // Chess Sounds
      case 'chess.move':
        engine.playNoise(0.05, 0.5); // Thud sound
        break;
      case 'chess.capture':
        engine.playNoise(0.1, 0.8);
        setTimeout(() => engine.playNoise(0.05, 0.4), 30); // Double thud
        break;
      case 'chess.castle':
        engine.playNoise(0.08, 0.6);
        setTimeout(() => engine.playNoise(0.08, 0.5), 100);
        break;
      case 'chess.check':
        engine.playTone(300, 'square', 0.2, 0.4); // Low alert
        break;
      case 'chess.promotion':
        engine.playTone(600, 'sine', 0.1, 0.3);
        setTimeout(() => engine.playTone(800, 'sine', 0.2, 0.3), 100);
        break;
      case 'chess.gameover':
        engine.playTone(400, 'triangle', 0.3, 0.5);
        setTimeout(() => engine.playTone(300, 'triangle', 0.4, 0.5), 300);
        break;

      // UI Sounds
      case 'ui.click':
        engine.playTone(1200, 'sine', 0.05, 0.1);
        break;
      case 'ui.hover':
        engine.playTone(800, 'sine', 0.02, 0.05);
        break;
        
      default:
        console.warn(`Sound ${soundId} not found`);
    }
  }
}

export const soundManager = new SoundManager();

export const playSound = (id) => {
  soundManager.play(id);
};
