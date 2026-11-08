// lib/audio-engine.ts

export class AudioEngine {
  private ctx: AudioContext | null = null;
  
  // Pentatonic Scale (C Major Pentatonic: C4, D4, E4, G4, A4)
  private scale = [261.63, 293.66, 329.63, 392.00, 440.00];

  constructor() {
    if (typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playTone(index: number, type: OscillatorType = 'sine', duration: number = 0.2) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(this.scale[index % this.scale.length], this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}
