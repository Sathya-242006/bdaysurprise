/**
 * Fairytale Story Audio Engine for "A Little Birthday World – Vinu".
 * - Respects browser autoplay restrictions (only starts after first user interaction).
 * - Two musical tracks:
 *     1) Peaceful fairytale village music-box/harp lullaby (Scenes 1–3 & 5)
 *     2) Full celebratory "Happy Birthday to You" song (Scene 4 after blowing candles + Scene 6)
 * - Cute cheerful voice saying "Happy Birthday, Vinu!" via Web Speech Synthesis with graceful chime accompaniment.
 * - Interactive SFX: candle blow puff, bouquet bloom chime, tree hide/reveal sparkle, envelope open, countdown ticks, fireworks bursts.
 */

interface NoteEvent {
  freq: number;
  bass?: number;
  startBeat: number;
  duration: number;
}

const N = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  Bb5: 932.33,
  B5: 987.77,
  C6: 1046.5,
};

// Soft fairytale village lullaby in G/C pastoral feel
const FAIRYTALE_MELODY: NoteEvent[] = [
  { freq: N.E5, bass: N.C3, startBeat: 0, duration: 1.4 },
  { freq: N.G5, startBeat: 1.5, duration: 0.7 },
  { freq: N.A5, bass: N.F3, startBeat: 2.25, duration: 1.4 },
  { freq: N.G5, startBeat: 3.75, duration: 0.8 },
  { freq: N.E5, bass: N.C3, startBeat: 4.5, duration: 1.3 },
  { freq: N.D5, bass: N.G3, startBeat: 6.0, duration: 1.8 },

  { freq: N.C5, bass: N.A3, startBeat: 8.0, duration: 1.2 },
  { freq: N.E5, startBeat: 9.25, duration: 0.9 },
  { freq: N.G5, bass: N.F3, startBeat: 10.25, duration: 1.4 },
  { freq: N.F5, startBeat: 11.75, duration: 0.8 },
  { freq: N.E5, bass: N.G3, startBeat: 12.75, duration: 1.1 },
  { freq: N.D5, startBeat: 14.0, duration: 1.0 },
  { freq: N.C5, bass: N.C3, startBeat: 15.0, duration: 2.4 },
];

// Full "Happy Birthday to You" melody in F Major
const HAPPY_BIRTHDAY_MELODY: NoteEvent[] = [
  // Happy birthday to you
  { freq: N.C5, startBeat: 0, duration: 0.72 },
  { freq: N.C5, startBeat: 0.75, duration: 0.25 },
  { freq: N.D5, bass: N.F3, startBeat: 1.0, duration: 0.95 },
  { freq: N.C5, bass: N.A3, startBeat: 2.0, duration: 0.95 },
  { freq: N.F5, bass: N.C4, startBeat: 3.0, duration: 0.95 },
  { freq: N.E5, bass: N.C3, startBeat: 4.0, duration: 1.85 },

  // Happy birthday to you
  { freq: N.C5, startBeat: 6.0, duration: 0.72 },
  { freq: N.C5, startBeat: 6.75, duration: 0.25 },
  { freq: N.D5, bass: N.C3, startBeat: 7.0, duration: 0.95 },
  { freq: N.C5, bass: N.G3, startBeat: 8.0, duration: 0.95 },
  { freq: N.G5, bass: N.Bb3, startBeat: 9.0, duration: 0.95 },
  { freq: N.F5, bass: N.F3, startBeat: 10.0, duration: 1.85 },

  // Happy birthday dear Vinu
  { freq: N.C5, startBeat: 12.0, duration: 0.72 },
  { freq: N.C5, startBeat: 12.75, duration: 0.25 },
  { freq: N.C6, bass: N.F3, startBeat: 13.0, duration: 0.95 },
  { freq: N.A5, bass: N.A3, startBeat: 14.0, duration: 0.95 },
  { freq: N.F5, bass: N.Bb3, startBeat: 15.0, duration: 0.95 },
  { freq: N.E5, bass: N.Bb3, startBeat: 16.0, duration: 0.95 },
  { freq: N.D5, bass: N.G3, startBeat: 17.0, duration: 1.65 },

  // Happy birthday to you
  { freq: N.Bb5, startBeat: 19.0, duration: 0.72 },
  { freq: N.Bb5, startBeat: 19.75, duration: 0.25 },
  { freq: N.A5, bass: N.C3, startBeat: 20.0, duration: 0.95 },
  { freq: N.F5, bass: N.A3, startBeat: 21.0, duration: 0.95 },
  { freq: N.G5, bass: N.C4, startBeat: 22.0, duration: 0.95 },
  { freq: N.F5, bass: N.F3, startBeat: 23.0, duration: 2.5 },
];

type MusicTrack = 'fairytale' | 'birthday';

class StoryAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private track: MusicTrack = 'fairytale';
  private loopTimer: number | null = null;
  private cycleToken = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.72;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.45;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.72;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private playNote(freq: number, startTime: number, duration: number, volume = 0.22) {
    const ctx = this.ctx;
    if (!ctx || !this.musicGain) return;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const env1 = ctx.createGain();
    env1.gain.setValueAtTime(0.0001, startTime);
    env1.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    env1.gain.exponentialRampToValueAtTime(volume * 0.45, startTime + duration * 0.55);
    env1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.36);

    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0.0001, startTime);
    env2.gain.exponentialRampToValueAtTime(volume * 0.14, startTime + 0.015);
    env2.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.min(0.42, duration));

    osc1.connect(env1);
    osc2.connect(env2);
    env1.connect(this.musicGain);
    env2.connect(this.musicGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.42);
    osc2.stop(startTime + duration + 0.25);
  }

  private playBass(freq: number, startTime: number, duration: number) {
    const ctx = this.ctx;
    if (!ctx || !this.musicGain) return;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, startTime);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.exponentialRampToValueAtTime(0.13, startTime + 0.06);
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.5);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.55);
  }

  private scheduleCycle(token: number) {
    if (!this.isPlaying || !this.ctx || token !== this.cycleToken) return;

    const now = this.ctx.currentTime + 0.08;
    const isBirthday = this.track === 'birthday';
    const melody = isBirthday ? HAPPY_BIRTHDAY_MELODY : FAIRYTALE_MELODY;
    const beatSec = isBirthday ? 0.43 : 0.54;
    const totalBeats = isBirthday ? 27.5 : 19.0;

    for (const note of melody) {
      const startTime = now + note.startBeat * beatSec;
      const dur = note.duration * beatSec;
      this.playNote(note.freq, startTime, dur, isBirthday ? 0.25 : 0.19);
      if (note.bass) {
        this.playBass(note.bass, startTime, dur * 1.45);
      }
    }

    this.loopTimer = window.setTimeout(() => {
      this.scheduleCycle(token);
    }, totalBeats * beatSec * 1000);
  }

  public startMusic(track: MusicTrack = 'fairytale'): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    this.isMuted = false;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.72, ctx.currentTime, 0.08);
    }

    if (!this.isPlaying || this.track !== track) {
      this.track = track;
      this.isPlaying = true;
      if (this.loopTimer !== null) {
        window.clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
      this.cycleToken += 1;
      this.scheduleCycle(this.cycleToken);
    }
    return true;
  }

  public playFullBirthdaySong(): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    this.isMuted = false;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.76, ctx.currentTime, 0.08);
    }
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.track = 'birthday';
    this.isPlaying = true;
    this.cycleToken += 1;
    this.scheduleCycle(this.cycleToken);
    return true;
  }

  public switchTrackSoftly(track: MusicTrack) {
    if (!this.isPlaying || this.track === track) return;
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.track = track;
    this.cycleToken += 1;
    this.scheduleCycle(this.cycleToken);
  }

  public toggleMusic(): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    if (!this.isPlaying) {
      this.startMusic(this.track);
      return true;
    }

    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.72, ctx.currentTime, 0.08);
    }
    return !this.isMuted;
  }

  /**
   * Speaks "Happy Birthday, Vinu!" in a cute, bright, clear cheerful voice
   * while gently ducking background music for clarity.
   */
  public speakHappyBirthdayVinu() {
    this.playBouquetBloom();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();

      const utter = new SpeechSynthesisUtterance('Happy Birthday, Vinu!');
      utter.lang = 'en-US';
      utter.pitch = 1.35;
      utter.rate = 0.95;
      utter.volume = 1;

      const voices = synth.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            /samantha|google us english|victoria|zira|karen|fiona|female/i.test(v.name)
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utter.voice = preferred;
      }

      // Gently duck music while voice speaks
      if (this.ctx && this.musicGain && !this.isMuted) {
        this.musicGain.gain.setTargetAtTime(0.16, this.ctx.currentTime, 0.06);
        utter.onend = () => {
          if (this.ctx && this.musicGain) {
            this.musicGain.gain.setTargetAtTime(0.45, this.ctx.currentTime, 0.2);
          }
        };
      }

      synth.speak(utter);
    } catch {
      // Graceful fallback — chime already played and speech bubble is visible
    }
  }

  public playBouquetBloom() {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;
    const now = ctx.currentTime;
    [392.0, 493.88, 587.33, 783.99, 987.77, 1174.66].forEach((freq, i) => {
      const t = now + i * 0.055;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  public playSurpriseReveal() {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
      const t = now + i * 0.07;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  public playCandleBlow() {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const now = ctx.currentTime;
    // Soft realistic wind puff sound
    const dur = 0.55;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = Math.sin((i / len) * Math.PI);
      ch[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(680, now);
    filter.frequency.exponentialRampToValueAtTime(320, now + dur);
    filter.Q.value = 1.2;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.22, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    src.start(now);

    // Sparkle chime as smoke rises
    [880, 1046.5, 1318.5].forEach((freq, i) => {
      const t = now + 0.35 + i * 0.06;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.0001, t);
      sg.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
      sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      osc.connect(sg);
      sg.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  public playEnvelopeOpen() {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.25);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.value = 1.4;

    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.linearRampToValueAtTime(0.08, now + 0.06);
    ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    noise.connect(filter);
    filter.connect(ng);
    ng.connect(this.sfxGain);
    noise.start(now);

    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const t = now + 0.1 + i * 0.08;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  public playCountdownTick(step: number) {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;
    const now = ctx.currentTime;
    const freq = step === 1 ? 880 : step === 2 ? 659.25 : 523.25;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playFireworkBurst(intensity = 0.85) {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;
    const now = ctx.currentTime;
    const duration = 0.55;
    const len = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const decay = Math.pow(1 - i / len, 2.2);
      const sparkle = Math.random() > 0.92 ? 1.5 : 0.7;
      data[i] = (Math.random() * 2 - 1) * decay * sparkle;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1450, now);
    filter.frequency.exponentialRampToValueAtTime(260, now + duration);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.15 * intensity, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    noise.start(now);

    const sparkleFreq = 920 + Math.random() * 880;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(sparkleFreq, now + 0.03);
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.0001, now + 0.03);
    cg.gain.exponentialRampToValueAtTime(0.055 * intensity, now + 0.05);
    cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    osc.connect(cg);
    cg.connect(this.sfxGain);
    osc.start(now + 0.03);
    osc.stop(now + 0.45);
  }

  public dispose() {
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.isPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new StoryAudioEngine();
