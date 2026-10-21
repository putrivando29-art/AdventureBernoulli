/*
 * Logika peluang Adventure Bernoulli.
 * Peluang p selalu diterima dalam perseratus (60 berarti 0,6). Perhitungan dilakukan
 * dengan bilangan bulat lalu dibagi satu kali, sehingga pmf(1, 60) === 0.6 dan
 * variance(60) === 0.24 persis, tanpa galat floating point yang menumpuk.
 * Data tahap TIDAK ada di sini; data tahap ada di js/config.js.
 * Bisa dipakai di browser (window.Bernoulli) maupun di Node (module.exports).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Bernoulli = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SCALE = 100;
  const TWO_32 = 4294967296;

  /** Validasi p perseratus: bilangan bulat dengan 0 < p < 100. */
  function isValidP(p) {
    return Number.isInteger(p) && p > 0 && p < SCALE;
  }

  function assertP(p) {
    if (!isValidP(p)) throw new RangeError("p harus bilangan bulat perseratus dengan 0 < p < 100, diterima: " + p);
  }

  function assertX(x) {
    if (x !== 0 && x !== 1) throw new RangeError("x harus 0 atau 1, diterima: " + x);
  }

  /** 1 - p dalam perseratus. */
  function complement(p) {
    assertP(p);
    return SCALE - p;
  }

  /**
   * Undian dari bilangan bulat acak 32 bit. U = u32 / 2^32 seragam di [0, 1).
   * X = 1 jika U < p, selain itu X = 0. Perbandingan dilakukan dengan bilangan bulat.
   */
  function rollFromU32(p, u32) {
    assertP(p);
    return { U: u32 / TWO_32, X: u32 * SCALE < p * TWO_32 ? 1 : 0 };
  }

  function randomU32() {
    const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
    if (!c || typeof c.getRandomValues !== "function") {
      throw new Error("crypto.getRandomValues tidak tersedia di browser ini");
    }
    return c.getRandomValues(new Uint32Array(1))[0];
  }

  /** Serangan Penentu: tepat satu undian Bernoulli dengan peluang menang p. */
  function decisiveRoll(p) {
    assertP(p);
    return rollFromU32(p, randomU32());
  }

  /** P(X = x) = p^x (1 - p)^(1 - x). */
  function pmf(x, p) {
    assertX(x);
    assertP(p);
    return (x === 1 ? p : SCALE - p) / SCALE;
  }

  /** E(X) = p. */
  function mean(p) {
    assertP(p);
    return p / SCALE;
  }

  /** Var(X) = p(1 - p). */
  function variance(p) {
    assertP(p);
    return (p * (SCALE - p)) / (SCALE * SCALE);
  }

  function gcd(a, b) {
    while (b) [a, b] = [b, a % b];
    return a;
  }

  /** Pecahan paling sederhana dari p perseratus, misalnya 60 -> "3/5". */
  function fraction(p) {
    assertP(p);
    const g = gcd(p, SCALE);
    return p / g + "/" + SCALE / g;
  }

  /**
   * Bilangan bulat num / 10^digits dibulatkan (setengah ke atas) menjadi tepat
   * `places` angka desimal, dengan koma sebagai pemisah desimal.
   */
  function fmtFixed(num, digits, places) {
    let n = num;
    if (digits > places) n = Math.round(num / 10 ** (digits - places));
    else if (digits < places) n = num * 10 ** (places - digits);
    let s = String(Math.abs(n));
    if (places > 0) {
      s = s.padStart(places + 1, "0");
      s = s.slice(0, s.length - places) + "," + s.slice(s.length - places);
    }
    return (n < 0 ? "-" : "") + s;
  }

  /** Format p perseratus dengan 1 desimal: 60 -> "0,6". */
  const fmtP = (p) => fmtFixed(p, 2, 1);
  /** Format p perseratus sebagai persen: 60 -> "60%". */
  const fmtPercent = (p) => p + "%";
  /** Var(X) dengan 2 desimal, dihitung eksak: 60 -> "0,24". */
  const fmtVar = (p) => fmtFixed(p * (SCALE - p), 4, 2);
  /** P(X = x) dengan 2 desimal: (1, 60) -> "0,60". */
  const fmtPmf = (x, p) => fmtFixed(x === 1 ? p : SCALE - p, 2, 2);

  /** U dipotong (bukan dibulatkan) ke 4 desimal agar tampilan tidak menyalahi U < p. */
  function fmtU(u) {
    return "0," + String(Math.floor(u * 10000)).padStart(4, "0");
  }

  /**
   * Ringkasan sesi. records: [{ p, x }] dengan x = 1, 0, atau null (tidak dimainkan).
   * Tahap tidak dimainkan tidak ikut dihitung sama sekali.
   */
  function summarize(records) {
    const played = records.filter((r) => r.x === 0 || r.x === 1);
    played.forEach((r) => assertP(r.p));
    const wins = played.filter((r) => r.x === 1).length;
    const res = {
      total: records.length,
      played: played.length,
      notPlayed: records.length - played.length,
      wins,
      losses: played.length - wins,
      seqNum: null,
      seqDigits: null,
      sequenceProbability: null,
      expectedNum: null,
      expectedWins: null,
    };
    if (played.length === 0) return res;
    res.seqNum = played.reduce((acc, r) => acc * (r.x === 1 ? r.p : SCALE - r.p), 1); // penyebut 100^n
    res.seqDigits = 2 * played.length;
    res.sequenceProbability = res.seqNum / 10 ** res.seqDigits;
    res.expectedNum = played.reduce((acc, r) => acc + r.p, 0); // penyebut 100
    res.expectedWins = res.expectedNum / SCALE;
    return res;
  }

  /** Peluang urutan: 4 desimal dan persen 2 desimal, misalnya "0,0420" dan "4,20%". */
  function fmtSequence(summary) {
    if (summary.seqNum === null) return null;
    return {
      decimal: fmtFixed(summary.seqNum, summary.seqDigits, 4),
      percent: fmtFixed(summary.seqNum, summary.seqDigits - 2, 2) + "%",
    };
  }

  return {
    SCALE,
    isValidP,
    complement,
    rollFromU32,
    decisiveRoll,
    pmf,
    mean,
    variance,
    fraction,
    fmtFixed,
    fmtP,
    fmtPercent,
    fmtVar,
    fmtPmf,
    fmtU,
    summarize,
    fmtSequence,
  };
});
