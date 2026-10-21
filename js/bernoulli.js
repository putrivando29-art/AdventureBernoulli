/*
 * Logika matematika Adventure Bernoulli.
 * Semua peluang disimpan sebagai bilangan bulat perseratus (0,6 -> 60) supaya
 * perkalian dan penjumlahan dihitung eksak, tanpa galat floating point.
 * Bisa dipakai di browser (window.Bernoulli) maupun di Node (module.exports).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Bernoulli = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SCALE = 100; // p disimpan dalam perseratus
  const SCALE_DIGITS = 2;

  // Data tahap mengikuti contoh lembar catatan (Contoh_Hasil_Adventure_Bernoulli.pdf).
  const DEFAULT_STAGES = [
    {
      id: 1,
      kondisi: "Setara",
      p: 50,
      lokasi: "Hutan Gerbang",
      musuh: "Goblin Penjaga",
      enemy: "goblin",
      theme: "forest",
      gear: [],
      cerita:
        "Petualangan dimulai di Hutan Gerbang. Seorang Goblin Penjaga menghadang jalan. " +
        "Kamu belum membawa perlengkapan apa pun, jadi kekuatan kalian setara.",
    },
    {
      id: 2,
      kondisi: "Dapat senjata",
      p: 60,
      lokasi: "Gua Kristal",
      musuh: "Serigala Bayangan",
      enemy: "wolf",
      theme: "cave",
      gear: ["sword"],
      cerita:
        "Di pintu Gua Kristal kamu menemukan sebuah pedang. Dengan senjata ini " +
        "peluangmu mengalahkan Serigala Bayangan lebih besar.",
    },
    {
      id: 3,
      kondisi: "Senjata + armor",
      p: 70,
      lokasi: "Benteng Reruntuhan",
      musuh: "Ksatria Tengkorak",
      enemy: "skeleton",
      theme: "ruins",
      gear: ["sword", "armor"],
      cerita:
        "Di Benteng Reruntuhan kamu memakai armor tua yang masih kokoh. " +
        "Pedang dan armor membuatmu unggul melawan Ksatria Tengkorak.",
    },
    {
      id: 4,
      kondisi: "Boss lebih kuat",
      p: 50,
      lokasi: "Menara Naga",
      musuh: "Raja Naga",
      enemy: "dragon",
      theme: "tower",
      gear: ["sword", "armor"],
      cerita:
        "Di puncak Menara Naga menunggu sang Boss, Raja Naga. Ia jauh lebih kuat " +
        "dari musuh sebelumnya, sehingga perlengkapanmu hanya membuat peluang kembali setengah-setengah.",
    },
    {
      id: 5,
      kondisi: "Boss mode marah",
      p: 40,
      lokasi: "Singgasana Lava",
      musuh: "Raja Naga (Marah)",
      enemy: "dragon-rage",
      theme: "lava",
      gear: ["sword", "armor"],
      cerita:
        "Raja Naga terbang ke Singgasana Lava dan masuk mode marah. Serangannya " +
        "makin ganas, sehingga peluangmu menang kini lebih kecil daripada peluang kalah.",
    },
  ];

  function clampP(p) {
    const n = Math.round(Number(p));
    if (!Number.isFinite(n)) return null;
    if (n < 1 || n > 99) return null;
    return n;
  }

  /**
   * Mengubah bilangan bulat `num` / 10^digits menjadi string desimal eksak
   * dengan koma sebagai pemisah desimal, tanpa nol di belakang.
   */
  function fmtScaled(num, digits) {
    const neg = num < 0;
    let s = String(Math.abs(num));
    if (digits > 0) {
      s = s.padStart(digits + 1, "0");
      let intPart = s.slice(0, s.length - digits);
      let frac = s.slice(s.length - digits).replace(/0+$/, "");
      s = frac ? intPart + "," + frac : intPart;
    }
    return (neg ? "-" : "") + s;
  }

  const fmtP = (p) => fmtScaled(p, SCALE_DIGITS);
  const complement = (p) => SCALE - p;

  /** Membulatkan num/10^digits ke `places` desimal dan memformatnya. */
  function fmtRounded(num, digits, places) {
    if (digits <= places) return fmtScaled(num, digits);
    const div = 10 ** (digits - places);
    const rounded = Math.round(num / div);
    return fmtScaled(rounded, places);
  }

  const SUP = { 0: "⁰", 1: "¹" };

  /** P(X = x) = p^x (1-p)^(1-x), dikembalikan dalam perseratus. */
  function pmf(p, x) {
    return x === 1 ? p : complement(p);
  }

  /** Teks perhitungan seperti "0,6¹ × 0,4⁰ = 0,6". */
  function pmfText(p, x) {
    return (
      fmtP(p) + SUP[x] + " × " + fmtP(complement(p)) + SUP[1 - x] + " = " + fmtP(pmf(p, x))
    );
  }

  /** Var(X) = p(1-p), skala 10^4. */
  function variance(p) {
    return p * complement(p);
  }

  function varianceText(p) {
    return fmtP(p) + " × " + fmtP(complement(p)) + " = " + fmtScaled(variance(p), 4);
  }

  /**
   * Undian satu percobaan Bernoulli. `u32` adalah bilangan bulat acak 0..2^32-1.
   * U = u32 / 2^32 berdistribusi seragam di [0, 1); menang (X = 1) jika U < p.
   */
  function drawFromU32(p, u32) {
    const u = u32 / 4294967296;
    const x = u32 * SCALE < p * 4294967296 ? 1 : 0;
    return { u, x };
  }

  function randomU32() {
    const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
    if (c && typeof c.getRandomValues === "function") {
      return c.getRandomValues(new Uint32Array(1))[0];
    }
    return Math.floor(Math.random() * 4294967296);
  }

  function trial(p) {
    return drawFromU32(p, randomU32());
  }

  /** U dipotong (bukan dibulatkan) ke 4 desimal agar tampilan tidak menyalahi U < p. */
  function fmtU(u) {
    const t = Math.floor(u * 10000);
    return "0," + String(t).padStart(4, "0");
  }

  /**
   * Distribusi eksak jumlah menang W = X1 + ... + Xn (distribusi Poisson-binomial),
   * dihitung dengan pemrograman dinamis. Hasil: array pembilang dengan penyebut 100^n.
   */
  function sumDistribution(ps) {
    let dist = [1];
    for (const p of ps) {
      const q = complement(p);
      const next = new Array(dist.length + 1).fill(0);
      for (let k = 0; k < dist.length; k++) {
        next[k] += dist[k] * q;
        next[k + 1] += dist[k] * p;
      }
      dist = next;
    }
    return dist;
  }

  /** Ringkasan satu sesi. records: [{p, x}] */
  function analyze(records) {
    const n = records.length;
    const wins = records.reduce((a, r) => a + r.x, 0);
    const factors = records.map((r) => pmf(r.p, r.x));
    const seqNum = factors.reduce((a, f) => a * f, 1); // penyebut 100^n
    const seqDigits = SCALE_DIGITS * n;
    const expectedNum = records.reduce((a, r) => a + r.p, 0); // penyebut 100
    const varNum = records.reduce((a, r) => a + variance(r.p), 0); // penyebut 10^4
    const dist = sumDistribution(records.map((r) => r.p));
    let geq = 0;
    let leq = 0;
    for (let k = 0; k < dist.length; k++) {
      if (k >= wins) geq += dist[k];
      if (k <= wins) leq += dist[k];
    }
    const allSame = records.every((r) => r.p === records[0].p);
    return {
      n,
      wins,
      losses: n - wins,
      factors,
      seqNum,
      seqDigits,
      expectedNum,
      varNum,
      dist,
      distDigits: seqDigits,
      probExact: dist[wins],
      probGeq: geq,
      probLeq: leq,
      allSame,
    };
  }

  /** Persentase dari pembilang/10^digits: teks dan penanda apakah pembulatan terjadi. */
  function percentText(num, digits, places = 2) {
    // persen = num / 10^(digits-2)
    const pd = digits - 2;
    const exact = fmtScaled(num, pd);
    const rounded = fmtRounded(num, pd, places);
    return { text: rounded + "%", exact: exact === rounded };
  }

  return {
    SCALE,
    DEFAULT_STAGES,
    clampP,
    fmtScaled,
    fmtP,
    fmtRounded,
    fmtU,
    complement,
    pmf,
    pmfText,
    variance,
    varianceText,
    drawFromU32,
    randomU32,
    trial,
    sumDistribution,
    analyze,
    percentText,
  };
});
