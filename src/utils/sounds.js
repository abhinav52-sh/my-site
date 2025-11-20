// Simple system sounds using Web Audio API
class SystemSounds {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  click() {
    this.playTone(800, 0.05, 'square');
  }

  windowOpen() {
    this.playTone(440, 0.1, 'sine');
    setTimeout(() => this.playTone(554, 0.1, 'sine'), 50);
  }

  windowClose() {
    this.playTone(554, 0.1, 'sine');
    setTimeout(() => this.playTone(440, 0.1, 'sine'), 50);
  }

  error() {
    this.playTone(200, 0.2, 'sawtooth');
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const systemSounds = new SystemSounds();
