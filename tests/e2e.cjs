/*
 * Simulasi end-to-end di Chromium: memainkan game dari menu utama sampai hasil akhir
 * berkali-kali dan memeriksa konsistensi tampilan dengan data sesi.
 * Jalankan: node tests/e2e.cjs  (butuh paket playwright; Chromium sudah terpasang)
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const URL = "file://" + path.join(ROOT, "index.html");
const SHOTS = process.env.SHOTS_DIR || "";
let failures = 0;
function check(cond, msg) {
  if (!cond) {
    failures++;
    console.error("  GAGAL:", msg);
  }
}

async function shot(page, name) {
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + ".png"), fullPage: true });
}

async function playSession(page, name, opts = {}) {
  if (!(await page.isVisible("#screen-menu"))) await page.click('.screen.is-active [data-go="menu"]');
  await page.fill("#player-name", name);
  await page.click('[data-action="start"]');
  await page.waitForSelector("#screen-game.is-active");
  for (let i = 0; i < 5; i++) {
    const title = await page.textContent("#stage-title");
    const eyebrow = await page.textContent("#stage-eyebrow");
    check(eyebrow.startsWith(`Tahap ${i + 1} dari 5`), `eyebrow tahap ${i + 1}: ${eyebrow}`);
    if (opts.shots && i === 0) await shot(page, "game-ready");
    if (opts.doubleClick) {
      await page.dblclick("#btn-attack");
      await page.click("#btn-attack", { force: true, trial: false }).catch(() => {});
    } else {
      await page.click("#btn-attack");
    }
    await page.waitForSelector("#result:not([hidden])", { timeout: 6000 });
    if (opts.shots && i === 4) await shot(page, "game-result");
    const st = await page.evaluate(() => {
      const s = window.__AB__.state.session;
      return { n: s.records.length, rec: s.records[s.records.length - 1], idx: s.index };
    });
    check(st.n === i + 1, `jumlah catatan setelah tahap ${i + 1} = ${st.n} (klik ganda tidak boleh menambah catatan)`);
    const rx = await page.textContent("#res-x");
    check(rx.includes(`X = ${st.rec.x}`), `teks hasil cocok dengan X: ${rx} vs ${st.rec.x}`);
    const ru = await page.textContent("#res-u");
    const uShown = parseFloat(ru.match(/U = ([\d,]+)/)[1].replace(",", "."));
    const pShown = parseFloat(ru.match(/p = ([\d,]+)/)[1].replace(",", "."));
    check(st.rec.x === (uShown < pShown ? 1 : 0), `U tampil ${uShown} vs p ${pShown} konsisten dengan X=${st.rec.x}`);
    check(title === st.rec.kondisi, `judul tahap = kondisi catatan (${title} / ${st.rec.kondisi})`);
    // posisi jarum harus di daerah yang benar
    const deg = await page.evaluate(() => {
      const m = getComputedStyle(document.querySelector("#needle")).transform;
      if (m === "none") return 0;
      const [a, b] = m.slice(7, -1).split(",").map(Number);
      return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    });
    const inWin = deg < (st.rec.p / 100) * 360;
    check(inWin === (st.rec.x === 1), `jarum ${deg.toFixed(1)}° sesuai hasil X=${st.rec.x} (p=${st.rec.p})`);
    const logX = await page.textContent(`#log-rows tr:nth-child(${i + 1}) td:nth-child(6)`);
    check(logX.trim() === String(st.rec.x), `lembar catatan baris ${i + 1} X=${logX}`);
    await page.click("#btn-next");
  }
  await page.waitForSelector("#screen-summary.is-active");
  return page.evaluate(() => window.__AB__.state.report);
}

async function verifyReport(page, entry) {
  const B = require(path.join(ROOT, "js/bernoulli.js"));
  const a = B.analyze(entry.records);
  const text = await page.textContent("#report");
  check(text.includes(`menang ${a.wins} kali dan kalah ${a.losses} kali`), "kalimat jumlah menang/kalah");
  check(text.includes(B.fmtScaled(a.seqNum, a.seqDigits)), "peluang urutan tercantum " + B.fmtScaled(a.seqNum, a.seqDigits));
  check(text.includes("= 2,7"), "nilai harapan 2,7 tercantum");
  check(text.includes("bukan distribusi binomial"), "catatan bukan binomial");
  const rows = await page.$$eval("#report .report-sec:nth-of-type(1) tbody tr", (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent.trim())));
  check(rows.length === 5, "lembar catatan 5 baris");
  rows.forEach((r, i) => {
    const rec = entry.records[i];
    check(r[5] === String(rec.x) && r[4] === (rec.x ? "Menang" : "Kalah"), `baris laporan ${i + 1}: ${r.join(" | ")}`);
    check(r[2] === B.fmtP(rec.p) && r[3] === B.fmtP(100 - rec.p), `p dan 1-p baris ${i + 1}`);
  });
  const sec3 = await page.$$eval("#report .report-sec:nth-of-type(3) tbody tr", (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent.trim())));
  sec3.forEach((r, i) => {
    const rec = entry.records[i];
    check(r[2] === B.pmfText(rec.p, rec.x), `peluang hasil baris ${i + 1}: ${r[2]}`);
    check(r[4] === B.varianceText(rec.p), `Var baris ${i + 1}: ${r[4]}`);
  });
}

(async () => {
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const errors = [];

  // ---------- desktop ----------
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text()) && !/ERR_|net::/.test(m.text()) && errors.push("console: " + m.text()));
  await page.goto(URL);
  await page.waitForSelector("#screen-menu.is-active");
  await shot(page, "menu");

  console.log("1. Menu: semua tombol navigasi");
  for (const s of ["howto", "theory", "lab", "history", "settings"]) {
    await page.click(`#screen-menu [data-go="${s}"]`);
    check(await page.isVisible(`#screen-${s}`), `layar ${s} tampil`);
    await shot(page, "page-" + s);
    await page.click(`#screen-${s} [data-go="menu"]`);
    check(await page.isVisible("#screen-menu"), `kembali ke menu dari ${s}`);
  }
  const howRows = await page.$$eval("#howto-stage-rows tr", (t) => t.length);
  check(howRows === 5, "tabel cara bermain 5 tahap");

  console.log("2. Mainkan satu sesi lengkap + periksa laporan");
  const e1 = await playSession(page, "Siswa Uji", { shots: true });
  await verifyReport(page, e1);
  await shot(page, "summary");

  console.log("3. Klik ganda tombol Serang tidak menggandakan catatan");
  await page.click('#screen-summary [data-action="start"]');
  await page.click('#screen-game [data-action="quit"]'); // belum ada hasil -> langsung keluar
  check(await page.isVisible("#screen-menu"), "keluar tanpa konfirmasi saat belum ada hasil");
  await playSession(page, "Klik Ganda", { doubleClick: true });

  console.log("4. Keluar di tengah putaran tidak merusak sesi baru");
  await page.click('#screen-summary [data-go="menu"]');
  await page.click('#screen-menu [data-action="start"]');
  await page.click("#btn-attack");
  await page.click('#screen-game [data-action="quit"]');
  check(await page.isVisible("#confirm-dialog"), "dialog konfirmasi muncul saat putaran berjalan");
  await page.click("#confirm-dialog button[value=cancel]");
  check(await page.isVisible("#screen-game"), "Batal tetap di permainan");
  await page.waitForSelector("#result:not([hidden])");
  await page.click('#screen-game [data-action="quit"]');
  await page.click("#confirm-ok");
  await page.waitForSelector("#screen-menu.is-active", { timeout: 2000 }).catch(() => {});
  check(await page.isVisible("#screen-menu"), "Ya keluar kembali ke menu");
  // mulai sesi baru, lalu keluar saat jarum berputar dan langsung mulai lagi
  await page.click('#screen-menu [data-action="start"]');
  await page.click("#btn-attack");
  await page.click('#screen-game [data-action="quit"]');
  await page.click("#confirm-ok");
  await page.waitForSelector("#screen-menu.is-active");
  await page.click('#screen-menu [data-action="start"]');
  await page.waitForTimeout(3200); // timer putaran lama sudah lewat
  const fresh = await page.evaluate(() => ({ n: window.__AB__.state.session.records.length, phase: window.__AB__.state.session.phase }));
  check(fresh.n === 0 && fresh.phase === "ready", `timer lama tidak bocor ke sesi baru (${JSON.stringify(fresh)})`);
  await page.click('#screen-game [data-action="quit"]');
  await page.waitForSelector("#screen-menu.is-active");

  console.log("5. Banyak sesi: konsistensi + frekuensi");
  const hist = [];
  await page.evaluate(() => document.documentElement.style.setProperty("--x", "1"));
  for (let k = 0; k < 6; k++) hist.push(await playSession(page, "Batch " + k));
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("ab.history")).length);
  check(stored === 8, `riwayat tersimpan 8 sesi, nyata ${stored}`);

  console.log("6. Riwayat: buka sesi lama");
  await page.click('#screen-summary [data-go="menu"]');
  await page.click('#screen-menu [data-go="history"]');
  await shot(page, "history");
  const btns = await page.$$('[data-action="open-history"]');
  check(btns.length === 8, "8 tombol Lihat di riwayat");
  await btns[btns.length - 1].click();
  check(await page.isVisible("#screen-summary"), "laporan sesi lama terbuka");
  await verifyReport(page, e1);

  console.log("7. Pengaturan: validasi dan p sama -> binomial");
  await page.click('#screen-summary [data-go="menu"]');
  await page.click('#screen-menu [data-go="settings"]');
  await page.fill("#p-0", "1,5");
  await page.click('#settings-form button[type=submit]');
  check((await page.textContent("#settings-msg")).includes("tidak valid"), "input 1,5 ditolak");
  await page.fill("#p-0", "0,123");
  await page.click('#settings-form button[type=submit]');
  check((await page.textContent("#settings-msg")).includes("tidak valid"), "input 3 desimal ditolak");
  for (let i = 0; i < 5; i++) await page.fill("#p-" + i, "0,3");
  await page.click('#settings-form button[type=submit]');
  check((await page.textContent("#settings-msg")).includes("tersimpan"), "pengaturan tersimpan");
  await page.click('#screen-settings [data-go="menu"]');
  const eb = await playSession(page, "Binomial");
  const txt = await page.textContent("#report");
  check(txt.includes("Binomial(5; 0,3)"), "catatan binomial muncul bila p sama");
  check(txt.includes("= 1,5"), "E(W) = 1,5 untuk p = 0,3");
  check(eb.records.every((r) => r.p === 30), "sesi memakai p baru");
  await page.click('#screen-summary [data-go="menu"]');
  await page.click('#screen-menu [data-go="settings"]');
  await page.click('[data-action="reset-settings"]');
  check((await page.inputValue("#p-4")) === "0,4", "reset ke bawaan");
  await page.click('#screen-settings [data-go="menu"]');

  console.log("8. Lab simulasi 100.000 sesi");
  await page.click('#screen-menu [data-go="lab"]');
  await page.selectOption("#lab-n", "100000");
  await page.click('[data-action="lab-run"]');
  await page.waitForSelector("#lab-output table", { timeout: 30000 });
  await shot(page, "lab");
  const labRows = await page.$eval("#lab-output table", (t) => [...t.tBodies[0].rows].map((tr) => [...tr.cells].map((c) => c.textContent.trim())));
  labRows.forEach((r) => {
    const p = parseFloat(r[2].replace(",", "."));
    const f = parseFloat(r[4].replace(",", "."));
    check(Math.abs(f - p) < 0.01, `lab tahap ${r[0]}: frekuensi ${f} dekat p ${p}`);
  });
  const meanTxt = await page.textContent(".stat-val");
  check(Math.abs(parseFloat(meanTxt.replace(",", ".")) - 2.7) < 0.03, "rata-rata W simulasi dekat 2,7: " + meanTxt);
  await page.selectOption("#lab-n", "100000");
  await page.click('[data-action="lab-run"]');
  await page.click('#screen-lab [data-go="menu"]'); // tinggalkan saat berjalan
  await page.click('#screen-menu [data-go="lab"]');
  await page.waitForTimeout(300);
  check(!(await page.isDisabled('[data-action="lab-run"]')), "tombol lab aktif lagi setelah simulasi dibatalkan");

  console.log("9. Hapus riwayat");
  await page.click('#screen-lab [data-go="menu"]');
  await page.click('#screen-menu [data-go="history"]');
  await page.click('[data-action="clear-history"]');
  await page.click("#confirm-ok");
  await page.waitForTimeout(100);
  check((await page.textContent("#history-list")).includes("Belum ada sesi"), "riwayat kosong setelah dihapus");
  await page.click('#screen-history [data-go="menu"]');

  console.log("10. Unduh CSV");
  await playSession(page, "CSV \"Uji\";");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click('[data-action="csv"]')]);
  const csvPath = await dl.path();
  const csv = fs.readFileSync(csvPath, "utf8");
  check(csv.split("\r\n").length >= 12 && csv.includes('"Tahap";"Kondisi"'), "CSV berisi tabel");
  check(csv.includes('"CSV ""Uji"";"'), "nama dengan tanda kutip di-escape di CSV");

  console.log("11. Tampilan HP (375 px) tanpa scroll horizontal");
  const m = await browser.newContext({ viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  mp.on("pageerror", (e) => errors.push("pageerror(mobile): " + e.message));
  await mp.goto(URL);
  await shot(mp, "m-menu");
  const overflow = async (label) => {
    const o = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(o <= 0, `${label}: tidak ada scroll horizontal (lebih ${o}px)`);
  };
  await overflow("menu");
  await mp.fill("#player-name", "Pemain HP");
  await mp.tap('#screen-menu [data-action="start"]');
  await overflow("permainan");
  await shot(mp, "m-game");
  for (let i = 0; i < 5; i++) {
    await mp.tap("#btn-attack");
    await mp.waitForSelector("#result:not([hidden])");
    await overflow("hasil tahap " + (i + 1));
    if (i === 0) await shot(mp, "m-result");
    await mp.tap("#btn-next");
  }
  await mp.waitForSelector("#screen-summary.is-active");
  await overflow("laporan");
  await shot(mp, "m-summary");
  for (const s of ["howto", "theory", "lab", "settings", "history"]) {
    await mp.tap('#screen-summary [data-go="menu"]').catch(() => {});
    await mp.evaluate(() => window.scrollTo(0, 0));
    if (!(await mp.isVisible("#screen-menu"))) await mp.tap(".screen.is-active [data-go=\"menu\"]");
    await mp.tap(`#screen-menu [data-go="${s}"]`);
    await overflow("halaman " + s);
    await shot(mp, "m-" + s);
    await mp.tap(`#screen-${s} [data-go="menu"]`);
  }

  // ---------- tanpa localStorage ----------
  console.log("12. Berjalan walau localStorage diblokir");
  const nc = await browser.newContext();
  await nc.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  });
  const np = await nc.newPage();
  np.on("pageerror", (e) => errors.push("pageerror(nostorage): " + e.message));
  await np.goto(URL);
  await np.fill("#player-name", "Tanpa Storage");
  await np.click('[data-action="start"]');
  for (let i = 0; i < 5; i++) {
    await np.click("#btn-attack");
    await np.waitForSelector("#result:not([hidden])");
    await np.click("#btn-next");
  }
  check(await np.isVisible("#screen-summary"), "sesi selesai tanpa localStorage");

  check(errors.length === 0, "tidak ada error JavaScript: " + errors.join(" | "));
  await browser.close();
  console.log(failures ? `\n${failures} pemeriksaan GAGAL` : "\nSemua pemeriksaan lulus");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
