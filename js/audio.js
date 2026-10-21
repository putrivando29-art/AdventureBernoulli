// Efek suara sintetis dengan Web Audio API (tanpa file audio).
// AudioContext dibuat/di-resume hanya setelah klik pemain (tombol Mulai).

let ctx = null;
let master = null;
let noiseBuf = null;
let muted = false;

export function initAudio() {
  try {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  } catch (e) {
    ctx = null; // browser tanpa Web Audio: game tetap jalan tanpa suara
  }
}

export function setMuted(m) {
  muted = m;
  if (master) master.gain.value = m ? 0 : 0.55;
}

export const isMuted = () => muted;

function noise() {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  return src;
}

function envGain(t, attack, decay, peak) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(master);
  return g;
}

function tone(type, f0, f1, t, dur, peak) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  o.connect(envGain(t, 0.01, dur, peak));
  o.start(t);
  o.stop(t + dur + 0.05);
}

function whoosh(t, f0, f1, dur, peak, q = 1.2) {
  const n = noise();
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = q;
  bp.frequency.setValueAtTime(f0, t);
  bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
  n.connect(bp).connect(envGain(t, 0.01, dur, peak));
  n.start(t);
  n.stop(t + dur + 0.05);
}

const play = (fn) => {
  if (!ctx || muted) return;
  try {
    fn(ctx.currentTime);
  } catch (e) {
    /* abaikan */
  }
};

export const sfx = {
  slash: () => play((t) => whoosh(t, 2600, 700, 0.16, 0.35)),
  hit: () => play((t) => {
    tone("sine", 160, 55, t, 0.16, 0.5);
    whoosh(t, 1800, 900, 0.06, 0.3, 0.8);
  }),
  step: () => play((t) => {
    tone("sine", 70, 38, t, 0.22, 0.45);
    whoosh(t, 300, 120, 0.15, 0.2, 0.6);
  }),
  win: () => play((t) => [523, 659, 784, 1046].forEach((f, i) => tone("triangle", f, f, t + i * 0.12, 0.3, 0.3))),
  lose: () => play((t) => [392, 330, 262, 196].forEach((f, i) => tone("sawtooth", f, f * 0.97, t + i * 0.16, 0.32, 0.16))),
  roar: () => play((t) => {
    tone("sawtooth", 110, 55, t, 1.1, 0.22);
    tone("square", 82, 41, t + 0.05, 1.0, 0.12);
    whoosh(t, 400, 120, 1.1, 0.25, 0.7);
  }),
  fireball: () => play((t) => whoosh(t, 400, 2400, 0.45, 0.35, 0.9)),
  boom: () => play((t) => {
    tone("sine", 90, 30, t, 0.6, 0.6);
    whoosh(t, 1200, 150, 0.6, 0.45, 0.5);
  }),
  thunder: () => play((t) => {
    whoosh(t, 3000, 200, 0.9, 0.55, 0.4);
    tone("sawtooth", 60, 30, t, 0.8, 0.25);
  }),
  potion: () => play((t) => [660, 880, 1175].forEach((f, i) => tone("sine", f, f * 1.2, t + i * 0.07, 0.18, 0.25))),
  clang: () => play((t) => {
    tone("square", 1400, 900, t, 0.12, 0.12);
    tone("triangle", 2600, 2000, t, 0.25, 0.1);
  }),
  revive: () => play((t) => {
    tone("sine", 300, 1200, t, 1.4, 0.2);
    tone("triangle", 450, 1800, t + 0.1, 1.3, 0.12);
    whoosh(t, 800, 4000, 1.4, 0.08, 2);
  }),
};

// ---------- musik latar sintetis (komposisi sendiri, tanpa file) ----------
// mood: "calm" (dengung + pad akor pelan + derak obor), "battle" (tambah drum dan bass),
// "decisive" (detak jantung + nada tegang), "off".
const CHORDS = [
  [110, 130.81, 164.81], // Am
  [87.31, 130.81, 174.61], // F
  [98, 146.83, 196], // G
  [82.41, 123.47, 164.81], // Em
];
let music = null;

function startMusic() {
  if (!ctx || music) return;
  const bus = ctx.createGain();
  bus.gain.value = 0;
  bus.connect(master);
  // dengung rendah dengan filter yang bernapas
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 320;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.11;
  lp.connect(droneGain).connect(bus);
  [55, 55.35, 82.4].forEach((f) => {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.connect(lp);
    o.start();
  });
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 140;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start();
  music = { bus, mood: "off", nextBeat: 0, beat: 0, nextChord: 0, chord: 0, nextCrackle: 0, nextHeart: 0 };
  setInterval(schedule, 50);
}

function pad(freqs, t, dur) {
  freqs.forEach((f) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = f * 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.035, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(music.bus);
    o.start(t);
    o.stop(t + dur + 0.1);
  });
}

function drum(t, f0, f1, dur, peak) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(music.bus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function hat(t, peak) {
  const n = noise();
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 6000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  n.connect(hp).connect(g).connect(music.bus);
  n.start(t);
  n.stop(t + 0.08);
}

function schedule() {
  if (!music || !ctx) return;
  const now = ctx.currentTime;
  const ahead = now + 0.2;
  const m = music;
  if (m.mood === "off") return;
  // pad akor setiap 8 detik
  while (m.nextChord < ahead) {
    if (m.nextChord < now) m.nextChord = now;
    pad(CHORDS[m.chord % CHORDS.length], m.nextChord, 8.5);
    m.chord++;
    m.nextChord += 8;
  }
  // derak obor acak
  while (m.nextCrackle < ahead) {
    if (m.nextCrackle < now) m.nextCrackle = now;
    hat(m.nextCrackle, 0.02 + Math.random() * 0.03);
    m.nextCrackle += 0.15 + Math.random() * 0.9;
  }
  if (m.mood === "battle") {
    const step = 60 / 100 / 2; // 100 BPM, per seperdelapan
    while (m.nextBeat < ahead) {
      if (m.nextBeat < now) m.nextBeat = now;
      const b = m.beat % 8;
      if (b === 0 || b === 4) drum(m.nextBeat, 130, 42, 0.32, 0.5);
      if (b === 3 || b === 7) drum(m.nextBeat, 220, 110, 0.18, 0.18);
      hat(m.nextBeat, b % 2 ? 0.03 : 0.05);
      if (b === 0) {
        const root = CHORDS[(m.chord + CHORDS.length - 1) % CHORDS.length][0];
        drum(m.nextBeat, root, root * 0.98, 0.5, 0.12);
      }
      m.beat++;
      m.nextBeat += step;
    }
  } else if (m.mood === "decisive") {
    while (m.nextHeart < ahead) {
      if (m.nextHeart < now) m.nextHeart = now;
      drum(m.nextHeart, 90, 40, 0.18, 0.55);
      drum(m.nextHeart + 0.22, 80, 38, 0.2, 0.4);
      m.nextHeart += 0.95;
    }
  }
}

export function setMood(mood) {
  if (!ctx) return;
  startMusic();
  if (!music) return;
  music.mood = mood;
  const t = ctx.currentTime;
  music.bus.gain.cancelScheduledValues(t);
  music.bus.gain.setTargetAtTime(mood === "off" ? 0 : mood === "battle" ? 0.9 : 0.75, t, 0.6);
}
