const test = require("node:test");
const assert = require("node:assert/strict");
const B = require("../js/bernoulli.js");

test("data tahap bawaan sesuai lembar contoh", () => {
  assert.deepEqual(B.DEFAULT_STAGES.map((s) => s.p), [50, 60, 70, 50, 40]);
  assert.deepEqual(B.DEFAULT_STAGES.map((s) => s.kondisi), [
    "Setara", "Dapat senjata", "Senjata + armor", "Boss lebih kuat", "Boss mode marah",
  ]);
});

test("format desimal eksak berkoma", () => {
  assert.equal(B.fmtP(50), "0,5");
  assert.equal(B.fmtP(5), "0,05");
  assert.equal(B.fmtP(100), "1");
  assert.equal(B.fmtScaled(42000000, 10), "0,0042");
  assert.equal(B.fmtScaled(270, 2), "2,7");
  assert.equal(B.fmtScaled(2400, 4), "0,24");
  assert.equal(B.fmtRounded(123456, 6, 3), "0,123");
});

test("fungsi peluang, E dan Var seperti lembar contoh", () => {
  assert.equal(B.pmfText(50, 1), "0,5¹ × 0,5⁰ = 0,5");
  assert.equal(B.pmfText(60, 1), "0,6¹ × 0,4⁰ = 0,6");
  assert.equal(B.pmfText(50, 0), "0,5⁰ × 0,5¹ = 0,5");
  assert.equal(B.pmfText(40, 1), "0,4¹ × 0,6⁰ = 0,4");
  assert.equal(B.pmfText(70, 0), "0,7⁰ × 0,3¹ = 0,3");
  assert.equal(B.varianceText(50), "0,5 × 0,5 = 0,25");
  assert.equal(B.varianceText(60), "0,6 × 0,4 = 0,24");
  assert.equal(B.varianceText(70), "0,7 × 0,3 = 0,21");
  assert.equal(B.varianceText(40), "0,4 × 0,6 = 0,24");
});

test("analisis sesi contoh PDF: M M M K M", () => {
  const xs = [1, 1, 1, 0, 1];
  const a = B.analyze(B.DEFAULT_STAGES.map((s, i) => ({ p: s.p, x: xs[i] })));
  assert.equal(a.wins, 4);
  assert.equal(a.losses, 1);
  assert.equal(B.fmtScaled(a.seqNum, a.seqDigits), "0,042");
  assert.deepEqual(B.percentText(a.seqNum, a.seqDigits), { text: "4,2%", exact: true });
  assert.equal(B.fmtScaled(a.expectedNum, 2), "2,7");
  assert.equal(B.fmtScaled(a.varNum, 4), "1,19");
  assert.equal(a.allSame, false);
});

test("distribusi jumlah menang berjumlah 1 dan rata-ratanya = jumlah p", () => {
  const ps = [50, 60, 70, 50, 40];
  const d = B.sumDistribution(ps);
  const den = 100 ** ps.length;
  assert.equal(d.reduce((a, b) => a + b, 0), den);
  const mean = d.reduce((a, v, k) => a + k * v, 0) / den;
  assert.ok(Math.abs(mean - 2.7) < 1e-12);
  const v = d.reduce((a, val, k) => a + (k - 2.7) ** 2 * val, 0) / den;
  assert.ok(Math.abs(v - 1.19) < 1e-12);
  // P(W = 5) = 0,5 × 0,6 × 0,7 × 0,5 × 0,4
  assert.equal(B.fmtScaled(d[5], 10), "0,042");
  // P(W = 0) = 0,5 × 0,4 × 0,3 × 0,5 × 0,6
  assert.equal(B.fmtScaled(d[0], 10), "0,018");
});

test("p sama -> distribusi sama dengan binomial", () => {
  const d = B.sumDistribution([30, 30, 30]);
  // Binomial(3; 0,3): 0,343 0,441 0,189 0,027
  assert.deepEqual(d.map((v) => B.fmtScaled(v, 6)), ["0,343", "0,441", "0,189", "0,027"]);
  assert.equal(B.analyze([30, 30, 30].map((p) => ({ p, x: 1 }))).allSame, true);
});

test("undian: batas U < p tepat", () => {
  const T = 4294967296;
  assert.equal(B.drawFromU32(50, 0).x, 1);
  assert.equal(B.drawFromU32(50, T / 2 - 1).x, 1);
  assert.equal(B.drawFromU32(50, T / 2).x, 0);
  assert.equal(B.drawFromU32(50, T - 1).x, 0);
  assert.equal(B.drawFromU32(1, T - 1).x, 0);
  assert.equal(B.drawFromU32(99, 0).x, 1);
  // tampilan U dipotong, tidak dibulatkan ke atas melewati p
  const r = B.drawFromU32(60, Math.floor(0.59999 * T));
  assert.equal(r.x, 1);
  assert.equal(B.fmtU(r.u), "0,5999");
});

test("frekuensi relatif undian mendekati p (200.000 percobaan)", () => {
  for (const p of [40, 50, 60, 70]) {
    let w = 0;
    const n = 200000;
    for (let i = 0; i < n; i++) w += B.trial(p).x;
    const f = w / n;
    // simpangan baku ~ 0,0011; batas 5 simpangan baku
    assert.ok(Math.abs(f - p / 100) < 0.006, `p=${p} f=${f}`);
  }
});

test("clampP menolak nilai di luar 0,01..0,99", () => {
  assert.equal(B.clampP(0), null);
  assert.equal(B.clampP(100), null);
  assert.equal(B.clampP("abc"), null);
  assert.equal(B.clampP(55), 55);
});
