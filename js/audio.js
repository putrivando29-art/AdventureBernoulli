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
  revive: () => play((t) => {
    tone("sine", 300, 1200, t, 1.4, 0.2);
    tone("triangle", 450, 1800, t + 0.1, 1.3, 0.12);
    whoosh(t, 800, 4000, 1.4, 0.08, 2);
  }),
};
