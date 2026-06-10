/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private primaryVolume: GainNode | null = null;
  private masterVolumeValue: number = 0.5;

  private initCtx() {
    if (this.ctx) return;
    try {
      // Create lazy AudioContext
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      this.primaryVolume = this.ctx.createGain();
      this.primaryVolume.gain.value = this.masterVolumeValue;
      this.primaryVolume.connect(this.ctx.destination);
    } catch (e) {
      console.error('Web Audio API not supported', e);
    }
  }

  public setVolume(val: number) {
    this.masterVolumeValue = Math.max(0, Math.min(1, val));
    if (this.primaryVolume && this.ctx) {
      this.primaryVolume.gain.setTargetAtTime(this.masterVolumeValue, this.ctx.currentTime, 0.05);
    }
  }

  private resume() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playJump() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    
    // Core Tone Generator (Triangle wave for smooth low-poly retro jump)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    // Exponential upward pitch sweep
    osc.frequency.exponentialRampToValueAtTime(550, t + 0.15);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    
    osc.connect(gain);
    gain.connect(this.primaryVolume);
    
    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playLand() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Deep, punchy soft landing thump
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);

    osc.connect(gain);
    gain.connect(this.primaryVolume);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playBouncy() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.25);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);

    osc.connect(gain);
    gain.connect(this.primaryVolume);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  public playCrack() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    // Generate white noise for wood break crackle
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.primaryVolume);

    noise.start(t);
    noise.stop(t + 0.1);
  }

  public playBlip() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(1200, t + 0.05);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.primaryVolume);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playScore() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    // A beautiful chord cascading upwards (C major 7 / C9 shiny synth)
    const notes = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5
    notes.forEach((freq, idx) => {
      const start = t + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

      osc.connect(gain);
      gain.connect(this.primaryVolume!);

      osc.start(start);
      osc.stop(start + 0.5);
    });
  }

  public playGameOver() {
    this.resume();
    if (!this.ctx || !this.primaryVolume) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(70, t + 1.2);

    // Deep trembling wobble effect during fall
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(14, t);
    lfoGain.gain.setValueAtTime(45, t);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.primaryVolume);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 1.2);
    osc.stop(t + 1.2);
  }

  public getAnalyserNode(): AnalyserNode | null {
    this.resume();
    if (!this.ctx) return null;
    return this.ctx.createAnalyser ? this.ctx.createAnalyser() : null;
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }
}

export const gameAudio = new AudioEngine();

/**
 * High-quality Text-To-Speech engine using the SpeechSynthesis browser API.
 * Ensures the correct voice speed and volume constraints.
 */
export function speakWord(word: string, rate: number = 1.0, volume: number = 1.0, lang: string = 'en-US') {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any ongoing speech so standard clicks don't lag or pile up
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang;
  utterance.rate = Math.max(0.5, Math.min(2.0, rate));
  utterance.volume = Math.max(0.0, Math.min(1.0, volume));

  // Try to find a premium voice for the target language if available
  const voices = window.speechSynthesis.getVoices();
  const searchLang = lang.toLowerCase();
  const targetVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(searchLang.replace('_', '-').split('-')[0]) && v.name.toLowerCase().includes('google')) 
    || voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(searchLang.replace('_', '-').split('-')[0])) 
    || voices.find(v => v.lang.toLowerCase().startsWith('en'))
    || voices[0];
  
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  window.speechSynthesis.speak(utterance);
}
