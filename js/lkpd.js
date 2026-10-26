// LKPD digital Distribusi Bernoulli. Isi mengikuti draf Word Kelompok 17 (5 halaman untuk siswa;
// halaman 6, kunci dan rubrik, hanya untuk guru). Data permainan diambil dari akun siswa.
import * as akun from "./akun.js";
import { $, escapeHtml, printableText, show } from "./ui.js";
import { CONFIG } from "./config.js";

const B = () => window.Bernoulli;
const STAGES = CONFIG.stages;
const TERKUNCI = ["terkirim", "minta-ubah"];

let st = null; // { lkpd, main, page, saving }

// ---------- papan rumus: pangkat dan indeks bawah dengan karakter Unicode ----------
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", x: "ˣ", n: "ⁿ", p: "ᵖ", i: "ⁱ", "(": "⁽", ")": "⁾", "-": "⁻", "−": "⁻", "+": "⁺", "=": "⁼", " ": " " };
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", x: "ₓ", n: "ₙ", p: "ₚ", i: "ᵢ", a: "ₐ", e: "ₑ", o: "ₒ", "(": "₍", ")": "₎", "-": "₋", "+": "₊", "=": "₌", " ": " " };
const SYMBOLS = ["·", "−", "×", "=", "≠", "≤", "≥", "√", "(", ")", "/"];

/** Teks jawaban untuk PDF: pangkat menjadi ^(..), indeks menjadi _(..), simbol di luar font PDF diganti. */
export function pdfText(s) {
  const inv = (map) => Object.fromEntries(Object.entries(map).filter(([k]) => k !== " ").map(([k, v]) => [v, k === "−" ? "-" : k]));
  const supInv = inv(SUP);
  const subInv = inv(SUB);
  let out = "";
  let mode = null;
  let buf = "";
  const flush = () => {
    if (buf) out += (mode === "sup" ? "^" : "_") + (buf.length > 1 ? `(${buf})` : buf);
    buf = "";
    mode = null;
  };
  for (const ch of String(s)) {
    if (supInv[ch] !== undefined) {
      if (mode !== "sup") flush();
      mode = "sup";
      buf += supInv[ch];
    } else if (subInv[ch] !== undefined) {
      if (mode !== "sub") flush();
      mode = "sub";
      buf += subInv[ch];
    } else {
      flush();
      out += ch;
    }
  }
  flush();
  return printableText(out.replace(/−/g, "-").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/≠/g, "!=").replace(/√/g, "akar ").replace(/×/g, "x"));
}

// ---------- data permainan ----------
const played = (x) => x === 0 || x === 1;
function lastPlayed(main) {
  let n = 0;
  main.x.forEach((v, i) => played(v) && (n = i + 1));
  return n;
}

/** Teks soal yang bergantung pada tahap terakhir yang dimainkan siswa. */
function soal(main) {
  const n = lastPlayed(main);
  const [a, b] = n >= 2 ? [n - 1, n] : [1, 2];
  const sampai3 = played(main.x[2]);
  return {
    s1: "Dalam satu tahap, ada berapa kemungkinan hasil Serangan Penentu? Sebutkan.",
    s2: `Pada tahap terakhir yang kamu mainkan (<strong>tahap ${n}</strong>), peluang kamu menang adalah .... dan peluang kamu kalah adalah ....`,
    s3: `Pakai rumus P(X = x) pada Kotak Informasi 1. Hitunglah nilai P(X = 1) dan P(X = 0) pada tahap terakhir yang kamu mainkan (<strong>tahap ${n}</strong>). Bandingkan hasilnya, apakah akan sama dengan nilai p dan q pada tahap tersebut?`,
    s4: `Hitung E(X) dan Var(X) untuk 2 tahap terakhir (<strong>tahap ${a} dan tahap ${b}</strong>). Di tahap mana hasil pertarungan lebih sulit ditebak? Mengapa?`,
    s5: "Jika peluang menang di tahap 3 adalah 0,7, apakah itu berarti kamu pasti menang? Jelaskan dengan melihat hasil permainanmu." +
      (sampai3 ? "" : " Kamu tidak sampai tahap 3, jadi jelaskan dengan hasil tahap lain yang kamu mainkan."),
  };
}

// ---------- daftar isian (untuk kemajuan dan PDF) ----------
function fieldIds(main) {
  const ids = ["s1", "s2"];
  main.x.forEach((v, i) => played(v) && ids.push(`t${i + 1}_q`, `t${i + 1}_hasil`, `t${i + 1}_x`, `t${i + 1}_px`));
  ids.push("s3", "s4", "s5", "s6", "s7", "refleksi");
  return ids;
}
const filled = (v) => typeof v === "string" && v.trim() !== "";
function progress() {
  const ids = fieldIds(st.main);
  return Math.round((ids.filter((id) => filled(st.lkpd.isian[id])).length / ids.length) * 100);
}

// ---------- tampilan ----------
const box = (id, label = "Jawaban") =>
  `<div class="lk-answer">
    <label class="sr-only" for="f-${id}">${label}</label>
    <textarea id="f-${id}" data-f="${id}" rows="4" placeholder="${label}"></textarea>
    <button type="button" class="btn lk-rumus-btn" data-rumus="${id}" aria-expanded="false">Rumus</button>
    <div class="lk-rumus" id="rumus-${id}" hidden></div>
  </div>`;

function pagesHtml(profil) {
  const m = st.main;
  const q = soal(m);
  const rows = STAGES.map((s, i) => {
    const t = `t${i + 1}`;
    const ok = played(m.x[i]);
    const dis = ok ? "" : "disabled";
    return `<tr class="${ok ? "" : "lk-off"}">
      <td>${s.id}</td><td>${B().fmtP(m.p[i])}</td>
      <td><input type="text" inputmode="decimal" data-f="${t}_q" aria-label="Peluang kalah q tahap ${s.id}" ${dis}></td>
      <td><input type="radio" name="${t}_hasil" value="Menang" data-f="${t}_hasil" aria-label="Menang tahap ${s.id}" ${dis}></td>
      <td><input type="radio" name="${t}_hasil" value="Kalah" data-f="${t}_hasil" aria-label="Kalah tahap ${s.id}" ${dis}></td>
      <td><input type="text" inputmode="decimal" data-f="${t}_x" aria-label="X tahap ${s.id}" ${dis} placeholder="${ok ? "" : "-"}"></td>
      <td><input type="text" inputmode="decimal" data-f="${t}_px" aria-label="P(X = x) tahap ${s.id}" ${dis} placeholder="${ok ? "" : "-"}"></td>
    </tr>`;
  }).join("");
  return `
  <section class="lk-page" data-page="1">
    <div class="lk-cover">
      <p class="lk-cover-top">LEMBAR KERJA<br>PESERTA DIDIK</p>
      <p class="lk-cover-title">Distribusi Bernoulli</p>
      <p class="lk-cover-sub">Catatan Pertarungan di Kerajaan Swarnadwipa</p>
      <dl class="lk-cover-id"><div><dt>Nama</dt><dd>${escapeHtml(profil.nama)}</dd></div><div><dt>Kelas</dt><dd>${escapeHtml(profil.kelas)}</dd></div></dl>
      <p class="muted small">Matematika Tingkat Lanjut · Kelas XII · Fase F</p>
      <p class="muted small">Universitas Sriwijaya · by Kelompok 17</p>
    </div>
  </section>

  <section class="lk-page" data-page="2" hidden>
    <h3>Distribusi Bernoulli</h3>
    <h4>Tujuan Pembelajaran</h4>
    <p>Setelah bermain dan mengerjakan LKPD ini, kamu dapat:</p>
    <ol>
      <li>mengidentifikasi ciri percobaan Bernoulli dari permainan Adventure Bernoulli;</li>
      <li>menentukan fungsi peluang, nilai harapan, dan variansi distribusi Bernoulli;</li>
      <li>menggunakan distribusi Bernoulli untuk menyelesaikan soal cerita.</li>
    </ol>
    <div class="lk-two">
      <div class="lk-info"><h4>Petunjuk Pengerjaan LKPD</h4><ol>
        <li>Baca dan amati setiap informasi yang diberikan.</li>
        <li>Jawablah sesuai instruksi pada tiap soal.</li>
        <li>Tulis angka desimal dengan koma, misalnya 0,24. Tekan tombol <strong>Rumus</strong> untuk pangkat atau pecahan.</li>
        <li>Periksa kembali jawabanmu sebelum menekan <strong>Kirim LKPD</strong>.</li>
      </ol></div>
      <div class="lk-info"><h4>Petunjuk Penggunaan Alat (game Adventure Bernoulli)</h4><ol>
        <li>Masuk dengan akunmu, lalu isi nama dan kelas.</li>
        <li>Mainkan tahap 1 sampai 5. Kamu boleh berhenti sebelum tahap 5.</li>
        <li>Perhatikan kotak peluang di awal setiap tahap dan hasil Serangan Penentu.</li>
        <li>Setelah layar rekap muncul, buka LKPD ini.</li>
      </ol></div>
    </div>
  </section>

  <section class="lk-page" data-page="3" hidden>
    <p><strong>Amatilah permainan Adventure Bernoulli dan jawablah pertanyaan berikut!</strong></p>
    <p class="lk-q"><b>1.</b> ${q.s1}</p>${box("s1")}
    <p class="lk-q"><b>2.</b> ${q.s2}</p>${box("s2")}
    <div class="lk-info">
      <h4>Kotak Informasi 1</h4>
      <p>Setiap tahap adalah satu <strong>percobaan Bernoulli</strong>: hanya ada dua hasil. Menang disebut <strong>sukses</strong> (X = 1) dengan peluang <strong>p</strong>, dan kalah disebut <strong>gagal</strong> (X = 0) dengan peluang <strong>q = 1 − p</strong>.</p>
      <p>Peluang ini sudah ditetapkan sebelum bertarung dan tidak berubah karena cara bermain.</p>
      <p>Fungsi peluangnya: <strong>P(X = x) = p<sup>x</sup> · q<sup>1 − x</sup></strong>, untuk x = 0 atau x = 1.</p>
    </div>
    <p><strong>Tuliskan hasil permainanmu. Berikan tanda ceklis pada hasil setiap tahap.</strong></p>
    <p class="muted small lk-swipe">Geser tabel ke samping untuk melihat semua kolom.</p>
    <div class="table-scroll"><table class="data-table lk-table">
      <thead><tr><th>Tahap</th><th>Peluang menang (p)</th><th>Peluang kalah (q)</th><th>Menang</th><th>Kalah</th><th>X</th><th>P(X = x)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="muted small">Isi X = 1 jika menang dan X = 0 jika kalah. Isi kolom P(X = x) setelah membaca Kotak Informasi 1. Jika tahap tidak dimainkan, kolomnya tidak perlu diisi.</p>
  </section>

  <section class="lk-page" data-page="4" hidden>
    <p class="lk-q"><b>3.</b> ${q.s3}</p>${box("s3")}
    <div class="lk-info">
      <h4>Kotak Informasi 2</h4>
      <p><strong>Nilai harapan</strong> E(X) = p, yaitu rata-rata nilai X jika percobaan diulang sangat banyak kali.</p>
      <p><strong>Variansi</strong> Var(X) = p · q, yaitu ukuran seberapa sulit hasil percobaan ditebak.</p>
    </div>
    <p class="lk-q"><b>4.</b> ${q.s4}</p>${box("s4")}
    <p class="lk-q"><b>5.</b> ${q.s5}</p>${box("s5")}
  </section>

  <section class="lk-page" data-page="5" hidden>
    <p class="lk-q"><b>6.</b> <strong>Tendangan Penalti.</strong> Rafi, pemain futsal sekolah, mencetak gol dari tendangan penalti dengan peluang 0,8 setiap kali menendang (angka permisalan). Misalkan X = 1 jika gol dan X = 0 jika tidak.</p>
    <ol class="lk-sub" type="a">
      <li>Tentukan p dan q, lalu tuliskan fungsi peluang X.</li>
      <li>Hitung E(X) dan Var(X).</li>
      <li>Dua tendangan Rafi berturut-turut gagal. Temannya berkata, "Tendangan berikutnya pasti gol." Setujukah kamu? Jelaskan.</li>
    </ol>
    ${box("s6", "Jawaban a, b, dan c")}
    <p class="lk-q"><b>7.</b> Permainan yang telah kamu lakukan dan tendangan penalti Rafi merupakan contoh <strong>distribusi Bernoulli</strong>. Apa yang dapat kamu simpulkan tentang distribusi tersebut?</p>${box("s7")}
    <h4>Refleksi</h4>
    <p class="lk-q">Setelah bermain dan mengerjakan LKPD ini, apa yang paling kamu pahami, dan apa yang masih membingungkan?</p>${box("refleksi")}
    <p id="lk-send-msg" class="form-msg" role="status"></p>
    <div class="row-buttons lk-actions">
      <button type="button" class="btn btn-primary btn-lg" id="btn-lk-kirim">Kirim LKPD</button>
      <button type="button" class="btn" id="btn-lk-ubah" hidden>Ajukan Perubahan</button>
      <button type="button" class="btn" id="btn-lk-pdf">Unduh LKPD (PDF)</button>
    </div>
  </section>`;
}

function rekapHtml() {
  const m = st.main;
  return `<table class="data-table"><thead><tr><th>Tahap</th><th>p</th><th>Hasil</th></tr></thead><tbody>${STAGES.map(
    (s, i) => `<tr><td>${s.id}</td><td>${B().fmtP(m.p[i])}</td><td>${m.x[i] === 1 ? "Menang" : m.x[i] === 0 ? "Kalah" : "Tidak dimainkan"}</td></tr>`
  ).join("")}</tbody></table>`;
}

function fill() {
  const v = st.lkpd.isian || {};
  document.querySelectorAll("#lk-pages [data-f]").forEach((el) => {
    const id = el.dataset.f;
    if (el.type === "radio") el.checked = v[id] === el.value;
    else el.value = v[id] || "";
  });
}

function setLocked() {
  const locked = TERKUNCI.includes(st.lkpd.status);
  document.querySelectorAll("#lk-pages [data-f], #lk-pages [data-rumus]").forEach((el) => {
    if (el.closest(".lk-off")) return;
    el.disabled = locked;
  });
  document.querySelectorAll(".lk-rumus").forEach((r) => (r.hidden = true));
  $("#btn-lk-kirim").hidden = locked;
  $("#btn-lk-ubah").hidden = st.lkpd.status !== "terkirim";
  const status = {
    draf: "Draf. Jawaban tersimpan otomatis.",
    terkirim: "Terkirim. Jawaban terkunci.",
    "minta-ubah": "Menunggu persetujuan guru untuk mengubah jawaban.",
    dibuka: "Guru menyetujui perubahan. Ubah jawabanmu, lalu tekan Kirim LKPD lagi.",
  }[st.lkpd.status] || "";
  $("#lk-status").textContent = status;
}

function showPage(n) {
  st.page = Math.min(5, Math.max(1, n));
  document.querySelectorAll(".lk-page").forEach((p) => (p.hidden = Number(p.dataset.page) !== st.page));
  $("#lk-page-no").textContent = `Halaman ${st.page} dari 5`;
  $("#lk-prev").disabled = st.page === 1;
  $("#lk-next").disabled = st.page === 5;
  document.querySelectorAll("#lk-dots button").forEach((b) => b.setAttribute("aria-current", String(Number(b.dataset.go2) === st.page)));
  $("#screen-lkpd").scrollIntoView({ block: "start" });
}

function updateProgress() {
  $("#lk-progress").textContent = `${progress()}% isian terisi`;
}

// ---------- simpan ----------
let pending = {};
let timer = 0;
function queueSave(id, value) {
  if (TERKUNCI.includes(st.lkpd.status)) return;
  st.lkpd.isian[id] = value;
  pending[id] = value;
  updateProgress();
  clearTimeout(timer);
  timer = setTimeout(flushSave, 600);
}

async function flushSave() {
  const batch = pending;
  pending = {};
  if (!Object.keys(batch).length) return;
  const el = $("#lk-save");
  el.textContent = "Menyimpan...";
  const slow = setTimeout(() => (el.textContent = "Koneksi lambat. Jawaban akan tersimpan saat koneksi kembali."), 6000);
  try {
    await akun.simpanIsian(batch, progress(), st.lkpd.status === "draf" ? st.main.id : null);
    el.textContent = "Tersimpan";
  } catch (e) {
    console.error("Gagal menyimpan LKPD:", e);
    Object.assign(pending, batch);
    el.textContent = "Gagal menyimpan. Periksa koneksi; jawaban dicoba lagi saat kamu mengetik.";
  } finally {
    clearTimeout(slow);
  }
}

// ---------- kirim dan ajukan perubahan ----------
async function kirim() {
  const msg = $("#lk-send-msg");
  await flushSave();
  const kosong = fieldIds(st.main).filter((id) => !filled(st.lkpd.isian[id]));
  if (kosong.length && !st.konfirmasiKosong) {
    st.konfirmasiKosong = true;
    msg.className = "form-msg";
    msg.textContent = `Masih ada ${kosong.length} isian kosong. Tekan Kirim LKPD sekali lagi jika tetap ingin mengirim.`;
    return;
  }
  try {
    await akun.kirimLkpd(st.main.id, progress());
    st.lkpd.status = "terkirim";
    msg.className = "form-msg txt-win";
    msg.textContent = "LKPD terkirim. Terima kasih!";
    setLocked();
  } catch (e) {
    msg.className = "form-msg";
    msg.textContent = akun.pesanGalat(e);
  }
}

function initDialog() {
  const dlg = $("#dlg-ubah");
  // tombol Ajukan Perubahan ada di halaman 5 yang dirender belakangan, jadi pakai delegasi
  $("#lk-pages").addEventListener("click", (e) => {
    if (!e.target.closest("#btn-lk-ubah")) return;
    $("#ubah-alasan").value = "";
    $("#ubah-msg").textContent = "";
    dlg.showModal();
  });
  $("#form-ubah").addEventListener("submit", async (e) => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    const alasan = printableText($("#ubah-alasan").value).trim();
    if (!alasan) {
      $("#ubah-msg").textContent = "Tulis alasan singkat.";
      return;
    }
    try {
      await akun.ajukanPerubahan(alasan);
      st.lkpd.status = "minta-ubah";
      dlg.close();
      setLocked();
    } catch (err) {
      $("#ubah-msg").textContent = akun.pesanGalat(err);
    }
  });
}

// ---------- papan rumus ----------
function rumusPanel(id) {
  return `<div class="lk-rumus-row" role="group" aria-label="Papan rumus">
    <button type="button" class="chip-btn btn" data-mode="sup" aria-pressed="false">Pangkat x²</button>
    <button type="button" class="chip-btn btn" data-mode="sub" aria-pressed="false">Indeks x₂</button>
    ${SYMBOLS.map((c) => `<button type="button" class="chip-btn btn" data-ins="${c}">${c}</button>`).join("")}
  </div>
  <p class="muted small">Tekan Pangkat atau Indeks, lalu ketik angka atau huruf x. Tekan lagi untuk kembali ke tulisan biasa.</p>`;
}

function initRumus(root) {
  const modes = {}; // id kolom -> "sup" | "sub" | null
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-rumus]");
    if (btn) {
      const panel = $("#rumus-" + btn.dataset.rumus);
      if (!panel.innerHTML) panel.innerHTML = rumusPanel(btn.dataset.rumus);
      panel.hidden = !panel.hidden;
      btn.setAttribute("aria-expanded", String(!panel.hidden));
      return;
    }
    const panel = e.target.closest(".lk-rumus");
    if (!panel) return;
    const id = panel.id.replace("rumus-", "");
    const ta = $("#f-" + id);
    const mode = e.target.closest("[data-mode]");
    if (mode) {
      const m = mode.dataset.mode;
      modes[id] = modes[id] === m ? null : m;
      panel.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(modes[id] === b.dataset.mode)));
      ta.focus();
      return;
    }
    const ins = e.target.closest("[data-ins]");
    if (ins) {
      ta.setRangeText(ins.dataset.ins, ta.selectionStart, ta.selectionEnd, "end");
      ta.focus();
      queueSave(id, ta.value);
    }
  });
  // ketikan saat mode pangkat/indeks aktif diubah menjadi karakter pangkat/indeks
  root.addEventListener("beforeinput", (e) => {
    const ta = e.target;
    if (!ta.matches || !ta.matches("textarea[data-f]") || e.inputType !== "insertText" || !e.data) return;
    const m = modes[ta.dataset.f];
    if (!m) return;
    const map = m === "sup" ? SUP : SUB;
    const conv = [...e.data].map((c) => map[c.toLowerCase()] ?? map[c] ?? c).join("");
    if (conv === e.data) return;
    e.preventDefault();
    ta.setRangeText(conv, ta.selectionStart, ta.selectionEnd, "end");
    queueSave(ta.dataset.f, ta.value);
  });
}

// ---------- PDF jawaban ----------
function downloadPdf(profil) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const L = 14, W = 182;
  let y = 18;
  const ensure = (h) => {
    if (y + h > 284) {
      doc.addPage();
      y = 18;
    }
  };
  const para = (text, size = 10, style = "normal", gap = 1.5) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(pdfText(text), W);
    ensure(lines.length * size * 0.42 + gap);
    doc.text(lines, L, y);
    y += lines.length * size * 0.42 + gap;
  };
  const strip = (h) => h.replace(/<[^>]+>/g, "");
  const ans = (id) => st.lkpd.isian[id] || "(kosong)";
  const q = soal(st.main);
  para("LKPD Distribusi Bernoulli", 16, "bold", 2);
  para("Catatan Pertarungan di Kerajaan Swarnadwipa · Universitas Sriwijaya · by Kelompok 17", 9.5, "normal", 4);
  para(`Nama: ${profil.nama}    Kelas: ${profil.kelas}`, 10.5, "normal", 1.5);
  para(`Status: ${st.lkpd.status}`, 9.5, "italic", 5);
  const qa = (no, text, id) => {
    para(`${no}. ${strip(text)}`, 10.5, "bold", 1.5);
    para(ans(id), 10.5, "normal", 4);
  };
  qa(1, q.s1, "s1");
  qa(2, q.s2, "s2");
  para("Hasil permainan", 10.5, "bold", 1.5);
  STAGES.forEach((s, i) => {
    const t = `t${i + 1}`;
    const v = st.lkpd.isian;
    const res = played(st.main.x[i]) ? (st.main.x[i] ? "Menang" : "Kalah") : "Tidak dimainkan";
    para(`Tahap ${s.id} (p = ${B().fmtP(st.main.p[i])}, hasil: ${res}): q = ${v[t + "_q"] || "-"}; ceklis: ${v[t + "_hasil"] || "-"}; X = ${v[t + "_x"] || "-"}; P(X = x) = ${v[t + "_px"] || "-"}`, 10, "normal", 1);
  });
  y += 3;
  qa(3, q.s3, "s3");
  qa(4, q.s4, "s4");
  qa(5, q.s5, "s5");
  qa(6, "Tendangan Penalti (a, b, c)", "s6");
  qa(7, "Kesimpulan tentang distribusi Bernoulli", "s7");
  para("Refleksi", 10.5, "bold", 1.5);
  para(ans("refleksi"), 10.5, "normal", 3);
  const safe = String(profil.nama).normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  doc.save(`LKPD_Bernoulli_${safe || "Siswa"}.pdf`);
}

// ---------- buka LKPD ----------
export async function bukaLkpd() {
  show("lkpd");
  const body = $("#lk-body");
  const msg = $("#lk-load");
  body.hidden = true;
  msg.hidden = false;
  msg.textContent = "Memuat LKPD...";
  try {
    const profil = (await akun.bacaProfil()) || { nama: "", kelas: "" };
    let lkpd = await akun.bacaLkpd();
    let main;
    if (lkpd && lkpd.status !== "draf") main = await akun.bacaPermainan(lkpd.permainanId);
    else main = await akun.permainanTerbaru();
    if (!main) {
      msg.innerHTML = "Selesaikan permainan dulu (minimal satu tahap dengan peluang bawaan). Setelah layar rekap muncul, LKPD bisa dibuka.";
      return;
    }
    let changed = false;
    if (!lkpd) lkpd = await akun.buatLkpd(main.id);
    else if (lkpd.status === "draf" && lkpd.permainanId !== main.id) changed = true;
    lkpd.isian = lkpd.isian || {};
    st = { lkpd, main, page: 1, profil };
    $("#lk-pages").innerHTML = pagesHtml(profil);
    $("#lk-rekap-body").innerHTML = rekapHtml();
    $("#lk-changed").hidden = !changed;
    if (changed) akun.simpanIsian({}, progress(), main.id).catch(() => {});
    fill();
    setLocked();
    updateProgress();
    $("#lk-save").textContent = "";
    msg.hidden = true;
    body.hidden = false;
    showPage(1);
  } catch (e) {
    console.error("LKPD gagal dimuat:", e);
    msg.textContent = akun.pesanGalat(e);
  }
}

export function initLkpd() {
  const pages = $("#lk-pages");
  pages.addEventListener("input", (e) => {
    const el = e.target.closest("[data-f]");
    if (el && el.type !== "radio") queueSave(el.dataset.f, el.value);
  });
  pages.addEventListener("change", (e) => {
    const el = e.target.closest("[data-f]");
    if (el) queueSave(el.dataset.f, el.value);
    flushSave();
  });
  pages.addEventListener("click", (e) => {
    if (e.target.closest("#btn-lk-kirim")) kirim();
    if (e.target.closest("#btn-lk-pdf")) downloadPdf(st.profil);
  });
  initRumus(pages);
  $("#lk-prev").addEventListener("click", () => { flushSave(); showPage(st.page - 1); });
  $("#lk-next").addEventListener("click", () => { flushSave(); showPage(st.page + 1); });
  $("#lk-dots").addEventListener("click", (e) => {
    const b = e.target.closest("[data-go2]");
    if (b) { flushSave(); showPage(Number(b.dataset.go2)); }
  });
  $("#lk-rekap-btn").addEventListener("click", () => {
    const p = $("#lk-rekap");
    p.hidden = !p.hidden;
    $("#lk-rekap-btn").setAttribute("aria-expanded", String(!p.hidden));
  });
  initDialog();
  // simpan sebelum halaman ditutup
  window.addEventListener("pagehide", flushSave);
}
