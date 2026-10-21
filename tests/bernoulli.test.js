const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const B = require("../js/bernoulli.js");

// js/config.js adalah ES module. File yang sama dibaca lalu di-import sebagai modul data: URL,
// sehingga tes memakai data tahap yang persis sama dengan game.
const configSrc = fs.readFileSync(path.join(__dirname, "..", "js", "config.js"), "utf8");
const loadConfig = () => import("data:text/javascript," + encodeURIComponent(configSrc)).then((m) => m.CONFIG);

test("config: 5 tahap dengan p sesuai spesifikasi", async () => {
  const CONFIG = await loadConfig();
  assert.deepEqual(CONFIG.stages.map((s) => s.p), [50, 60, 70, 50, 40]);
  assert.deepEqual(CONFIG.stages.map((s) => s.id), [1, 2, 3, 4, 5]);
  CONFIG.stages.forEach((s) => assert.ok(B.isValidP(s.p), `p tahap ${s.id} valid`));
  assert.ok(Number.isInteger(CONFIG.bossHitsToThreshold) && CONFIG.bossHitsToThreshold > 0);
});

test("config: data tahap tidak bisa diubah saat game berjalan", async () => {
  const CONFIG = await loadConfig();
  assert.throws(() => {
    "use strict";
    CONFIG.stages[0].p = 99;
  }, TypeError);
  assert.equal(CONFIG.stages[0].p, 50);
});

test("pmf, mean, variance", () => {
  assert.equal(B.pmf(1, 60), 0.6);
  assert.equal(B.pmf(0, 60), 0.4);
  assert.equal(B.mean(60), 0.6);
  assert.equal(B.variance(60), 0.24);
  assert.equal(B.variance(50), 0.25);
  assert.equal(B.variance(70), 0.21);
  assert.equal(B.variance(40), 0.24);
  assert.equal(B.pmf(0, 70), 0.3);
  assert.throws(() => B.pmf(2, 60), RangeError);
});

test("validasi: p = 0 dan p = 100 ditolak", () => {
  assert.equal(B.isValidP(0), false);
  assert.equal(B.isValidP(100), false);
  assert.equal(B.isValidP(-5), false);
  assert.equal(B.isValidP(60.5), false);
  assert.equal(B.isValidP("60"), false);
  assert.equal(B.isValidP(60), true);
  assert.throws(() => B.decisiveRoll(0), RangeError);
  assert.throws(() => B.decisiveRoll(100), RangeError);
  assert.throws(() => B.mean(0), RangeError);
});

test("pecahan peluang", () => {
  assert.equal(B.fraction(40), "2/5");
  assert.equal(B.fraction(50), "1/2");
  assert.equal(B.fraction(60), "3/5");
  assert.equal(B.fraction(70), "7/10");
});

test("format angka berkoma", () => {
  assert.equal(B.fmtP(60), "0,6");
  assert.equal(B.fmtP(B.complement(60)), "0,4");
  assert.equal(B.fmtVar(60), "0,24");
  assert.equal(B.fmtVar(50), "0,25");
  assert.equal(B.fmtPmf(1, 60), "0,60");
  assert.equal(B.fmtPmf(0, 70), "0,30");
  assert.equal(B.fmtPercent(40), "40%");
  assert.equal(B.fmtFixed(125, 3, 2), "0,13");
});

test("decisiveRoll: batas U < p tepat dan hanya dua hasil", () => {
  const T = 4294967296;
  assert.deepEqual(B.rollFromU32(50, 0), { U: 0, X: 1 });
  assert.equal(B.rollFromU32(50, T / 2 - 1).X, 1);
  assert.equal(B.rollFromU32(50, T / 2).X, 0);
  assert.equal(B.rollFromU32(99, T - 1).X, 0);
  assert.equal(B.fmtU(B.rollFromU32(60, Math.floor(0.59999 * T)).U), "0,5999");
  for (let i = 0; i < 1000; i++) {
    const r = B.decisiveRoll(60);
    assert.ok(r.U >= 0 && r.U < 1);
    assert.ok(r.X === 0 || r.X === 1);
    assert.equal(r.X, r.U < 0.6 ? 1 : 0);
  }
});

test("decisiveRoll: 10.000 undian p = 60 memberi frekuensi 0,58 sampai 0,62", () => {
  let w = 0;
  for (let i = 0; i < 10000; i++) w += B.decisiveRoll(60).X;
  const f = w / 10000;
  assert.ok(f >= 0.58 && f <= 0.62, "frekuensi " + f);
});

test("rekap: 5 tahap dimainkan (M M M K M)", () => {
  const ps = [50, 60, 70, 50, 40];
  const xs = [1, 1, 1, 0, 1];
  const s = B.summarize(ps.map((p, i) => ({ p, x: xs[i] })));
  assert.equal(s.played, 5);
  assert.equal(s.wins, 4);
  assert.equal(s.losses, 1);
  assert.deepEqual(B.fmtSequence(s), { decimal: "0,0420", percent: "4,20%" });
  assert.equal(s.expectedWins, 2.7);
});

test("rekap: tahap tidak dimainkan tidak dihitung", () => {
  const recs = [
    { p: 50, x: 0 },
    { p: 60, x: 1 },
    { p: 70, x: null },
    { p: 50, x: null },
    { p: 40, x: null },
  ];
  const s = B.summarize(recs);
  assert.equal(s.played, 2);
  assert.equal(s.notPlayed, 3);
  assert.equal(s.losses, 1);
  assert.deepEqual(B.fmtSequence(s), { decimal: "0,3000", percent: "30,00%" });
  assert.equal(s.expectedWins, 1.1);
});

test("rekap: belum ada percobaan", () => {
  const s = B.summarize([50, 60, 70, 50, 40].map((p) => ({ p, x: null })));
  assert.equal(s.played, 0);
  assert.equal(s.sequenceProbability, null);
  assert.equal(s.expectedWins, null);
  assert.equal(B.fmtSequence(s), null);
});
