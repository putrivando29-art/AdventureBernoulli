// Lembar LKM 1:1. Halaman 1 sampai 5 adalah gambar asli LKM revisi Kelompok 17 (assets/lkpd/hal-N.png,
// tidak diubah sedikit pun); kolom isian ditempel tepat di atas kotak jawaban, sel tabel, garis, dan
// titik-titiknya. Halaman 6 LKM berisi harapan jawaban dan rubrik untuk dosen, jadi tidak ditampilkan.
// Dipakai layar LKM mahasiswa dan (nanti) layar dosen.
// Koordinat diukur dari PDF LKM pada 150 dpi: satu halaman A4 = 1240 x 1754 piksel.
import { CONFIG } from "./config.js";
import { escapeHtml } from "./ui.js";
import { pdfText } from "./papan-rumus.js";

export const HAL_W = 1240;
export const HAL_H = 1754;
export const JUMLAH_HAL = 5;
export const SYARAT_TAHAP = 3; // petunjuk LKM: mainkan game minimal sampai tahap 3
export const gambarHal = (n) => `assets/lkpd/hal-${n}.png`;

const B = () => window.Bernoulli;
// Kotak jawaban: tepi dalam x 121 sampai 1120; garis titik-titik untuk menulis dari x 166 sampai 1073.
const KX = 125;
const KW = 991;
const GARIS_X = 166;
export const LEBAR_KOTAK = [117, 1124]; // dipakai untuk memperbesar kotak saat diketuk di HP
// Tabel soal 2
const KOLOM = { p: [197, 375], q: [377, 534], Menang: [536, 647], Kalah: [648, 758], ph: [759, 1120] };
const BARIS_Y = 630;
const BARIS_JARAK = 44;
const BARIS_H = 42;

/** Kotak uraian. g1 = letak garis tulis pertama, jarak = jarak antargaris, indent = geser baris pertama (nomor "1."). */
const uraian = (id, hal, y1, y2, g1, jarak, label, indent = 0) =>
  ({ id, hal, jenis: "uraian", x: KX, y: y1 + 3, w: KW, h: y2 - y1 - 6, g1, jarak, indent, label });

function selTabel() {
  const out = [];
  CONFIG.stages.forEach((s, i) => {
    const t = `t${i + 1}`;
    const sel = (id, k, extra) => ({ id, hal: 3, tahap: i, x: KOLOM[k][0], y: BARIS_Y + i * BARIS_JARAK, w: KOLOM[k][1] - KOLOM[k][0], h: BARIS_H, ...extra });
    out.push(sel(`${t}_p`, "p", { jenis: "sel", label: `Peluang menang tahap ${s.id}` }));
    out.push(sel(`${t}_q`, "q", { jenis: "sel", label: `Peluang kalah tahap ${s.id}` }));
    out.push(sel(`${t}_hasil`, "Menang", { jenis: "ceklis", nilai: "Menang", label: `Centang Menang tahap ${s.id}` }));
    out.push(sel(`${t}_hasil`, "Kalah", { jenis: "ceklis", nilai: "Kalah", label: `Centang Kalah tahap ${s.id}` }));
    out.push(sel(`${t}_ph`, "ph", { jenis: "sel", label: `Peluang dari hasil tahap ${s.id}` }));
  });
  return out;
}

// Tabel soal 9: baris x = 0 dan x = 1; kolom pˣ, q¹⁻ˣ, dan kolom terakhir (hasil operasi)
function selSoal9() {
  const kol = { p: [201, 306, "pˣ"], q: [307, 412, "q¹⁻ˣ"], h: [413, 519, "kolom terakhir"] };
  const out = [];
  [[0, 1111, 41], [1, 1153, 40]].forEach(([x, y, h]) => {
    for (const [k, [x1, x2, nama]] of Object.entries(kol)) {
      out.push({ id: `s9_${k}${x}`, hal: 4, jenis: "sel", x: x1, y, w: x2 - x1, h, label: `Soal 9, x = ${x}: ${nama}` });
    }
  });
  return out;
}

/** Semua isian, urut sesuai halaman. Titik-titik "..." diisi dengan huruf tebal (jenis "titik"). */
export const BIDANG = [
  { id: "nama", hal: 1, jenis: "identitas", x: 414, y: 511, w: 546, h: 34, label: "Nama", maks: 40 },
  { id: "nim", hal: 1, jenis: "identitas", x: 414, y: 559, w: 546, h: 34, label: "NIM", maks: 20 },
  { id: "kelas", hal: 1, jenis: "identitas", x: 414, y: 607, w: 546, h: 34, label: "Kelas", maks: 15 },
  uraian("s1", 3, 252, 357, 303.5, 39, "Jawaban soal 1"),
  ...selTabel(),
  uraian("s3", 3, 902, 1007, 953.5, 39, "Jawaban soal 3"),
  uraian("s4", 3, 1157, 1255, 1204.5, 36, "Jawaban soal 4"),
  uraian("s5", 3, 1335, 1435, 1384.5, 36, "Jawaban soal 5"),
  uraian("s6", 4, 168, 307, 217.5, 38.3, "Jawaban soal 6"),
  { id: "s7_1", hal: 4, jenis: "titik", x: 549, y: 729, w: 131, h: 39, label: "Soal 7: P(X = 1)" },
  { id: "s7_0", hal: 4, jenis: "titik", x: 549, y: 772, w: 131, h: 39, label: "Soal 7: P(X = 0)" },
  { id: "s8_1", hal: 4, jenis: "titik", x: 236, y: 903, w: 134, h: 46, label: "Soal 8: P(X = 1)" },
  { id: "s8_0", hal: 4, jenis: "titik", x: 462, y: 903, w: 650, h: 46, label: "Soal 8: P(X = 0)" },
  ...selSoal9(),
  uraian("s9", 4, 1334, 1462, 1378.5, 34.5, "Jawaban soal 9"),
  uraian("s10_1", 5, 524, 727, 579.5, 45.3, "Soal 10 nomor 1: apa itu percobaan Bernoulli", 24),
  uraian("s10_2", 5, 722, 912, 761.5, 45.3, "Soal 10 nomor 2: apa itu distribusi Bernoulli", 24),
  uraian("refleksi", 5, 984, 1277, 1039.5, 44.6, "Jawaban refleksi"),
];

/** Tulisan "[ Kirim LKM ]" dan "[ Unduh LKM (PDF) ]" di bawah halaman 5 dibuat bisa diketuk. */
const TOMBOL_HAL5 = [
  { aksi: "kirim", x: 431, w: 148, label: "Kirim LKM" },
  { aksi: "pdf", x: 578, w: 230, label: "Unduh LKM (PDF)" },
].map((t) => ({ ...t, y: 1317, h: 34 }));

export const STATUS_TEKS = {
  draf: "Draf. Jawaban tersimpan otomatis.",
  terkirim: "Terkirim. Jawaban terkunci.",
  "minta-ubah": "Menunggu persetujuan dosen untuk mengubah jawaban.",
  dibuka: "Dosen menyetujui perubahan. Ubah jawaban, lalu kirim lagi.",
};

export const dimainkan = (main, i) => main.x[i] === 0 || main.x[i] === 1;
export const terisi = (v) => typeof v === "string" && v.trim() !== "";
export const halamanIsi = (id) => BIDANG.find((x) => x.id === id).hal;

/** ID isian wajib. Baris tabel untuk tahap yang tidak dimainkan tidak diisi mahasiswa (otomatis "-"). */
export function idWajib(main) {
  const ids = [];
  for (const b of BIDANG) {
    if (b.tahap !== undefined && !dimainkan(main, b.tahap)) continue;
    if (!ids.includes(b.id)) ids.push(b.id);
  }
  return ids;
}

export const idKosong = (main, isian, hal = null) =>
  idWajib(main).filter((id) => !terisi(isian[id]) && (hal === null || halamanIsi(id) === hal));

export function tahapTerakhir(main) {
  let n = 0;
  main.x.forEach((v, i) => (v === 0 || v === 1) && (n = i + 1));
  return n;
}

export const hasilTeks = (x) => (x === 1 ? "Menang" : x === 0 ? "Kalah" : "Tidak dimainkan");

// ---------- tampilan di layar ----------
const pct = (b, dx = 0, dy = 0, dw = 0, dh = 0) =>
  `left:${((b.x + dx) / HAL_W) * 100}%;top:${((b.y + dy) / HAL_H) * 100}%;width:${((b.w + dw) / HAL_W) * 100}%;height:${((b.h + dh) / HAL_H) * 100}%`;

// Baris tulisan jatuh tepat di atas garis titik-titik kotak. Ukuran dalam em (1em = UKURAN piksel pada lebar asli).
const em = (px) => (px / UKURAN).toFixed(3) + "em";
const garisPertama = (b) => b.g1 - 4; // garis dasar huruf sedikit di atas garis titik-titik
function gayaGaris(b) {
  const atas = garisPertama(b) - b.y - (b.jarak / 2 + 0.345 * UKURAN);
  return `line-height:${em(b.jarak)};padding:${em(Math.max(0, atas))} ${em(b.x + b.w - 1073)} 0 ${em(GARIS_X - b.x)};text-indent:${em(b.indent)}`;
}

const CENTANG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Satu halaman: gambar asli + kolom isian di atas kotaknya. Kunci (hanya baca) diatur lewat kunciLembar. */
export function bangunLembar(n, main) {
  const el = document.createElement("div");
  el.className = "lk-sheet";
  el.dataset.hal = n;
  let html = `<img class="lk-sheet-img" src="${gambarHal(n)}" width="1653" height="2339" alt="LKM Distribusi Bernoulli halaman ${n}" draggable="false">`;
  if (n === 3) {
    CONFIG.stages.forEach((s, i) => {
      if (!dimainkan(main, i)) {
        const y = BARIS_Y + i * BARIS_JARAK;
        html += `<div class="lk-row-off" style="${pct({ x: KOLOM.p[0], y, w: KOLOM.ph[1] - KOLOM.p[0], h: BARIS_H })}" title="Tahap ${s.id} tidak dimainkan"></div>`;
      }
    });
  }
  for (const b of BIDANG.filter((x) => x.hal === n)) {
    const main_ok = b.tahap === undefined || dimainkan(main, b.tahap);
    if (b.jenis === "identitas") {
      html += `<input type="text" class="lk-f lk-f-identitas" data-f="${b.id}" maxlength="${b.maks}" aria-label="${b.label}" autocomplete="off" spellcheck="false" style="${pct(b)}">`;
    } else if (b.jenis === "titik") {
      html += `<input type="text" class="lk-f lk-f-titik${b.w < 100 ? " is-tengah" : ""}" data-f="${b.id}" maxlength="30" aria-label="${b.label}" autocomplete="off" spellcheck="false" style="${pct(b)}">`;
    } else if (b.jenis === "uraian") {
      html += `<textarea class="lk-f lk-f-uraian" data-f="${b.id}" aria-label="${b.label}" spellcheck="false" style="${pct(b)};${gayaGaris(b)}"></textarea>`;
    } else if (!main_ok) {
      if (b.jenis === "sel") html += `<span class="lk-f-strip" style="${pct(b)}" aria-hidden="true">-</span>`;
    } else if (b.jenis === "sel") {
      html += `<input type="text" class="lk-f lk-f-sel" data-f="${b.id}" aria-label="${b.label}" autocomplete="off" spellcheck="false" style="${pct(b, 4, 6, -8, -12)}">`;
    } else if (b.jenis === "ceklis") {
      html += `<button type="button" class="lk-f-ceklis" data-f="${b.id}" data-nilai="${b.nilai}" aria-pressed="false" aria-label="${b.label}" style="${pct(b, 3, 3, -6, -6)}">${CENTANG}</button>`;
    }
  }
  if (n === 5) {
    for (const t of TOMBOL_HAL5) html += `<button type="button" class="lk-hotspot" data-aksi="${t.aksi}" aria-label="${t.label}" style="${pct(t)}"></button>`;
  }
  el.innerHTML = html;
  return el;
}

/** Isian titik-titik sempit: huruf dikecilkan sampai muat (paling kecil 55%) agar tidak menutupi teks soal. */
export function pasHuruf(el) {
  el.style.fontSize = "";
  for (let f = 1; f > 0.55 && el.scrollWidth > el.clientWidth + 1; f -= 0.05) el.style.fontSize = f.toFixed(2) + "em";
}

/** Mengisi semua kolom di dalam root dengan isian tersimpan. */
export function isiLembar(root, isian) {
  root.querySelectorAll("textarea[data-f], input[data-f]").forEach((el) => {
    const v = isian[el.dataset.f] || "";
    if (el.value !== v) el.value = v;
  });
  root.querySelectorAll(".lk-f-ceklis").forEach((el) => el.setAttribute("aria-pressed", String(isian[el.dataset.f] === el.dataset.nilai)));
  root.querySelectorAll(".lk-f-titik").forEach(pasHuruf);
}

export function kunciLembar(root, kunci) {
  root.querySelectorAll("textarea[data-f], input[data-f]").forEach((el) => (el.readOnly = kunci));
  root.querySelectorAll(".lk-f-ceklis").forEach((el) => (el.disabled = kunci));
}

// ---------- ringkasan (Lihat Hasil, halaman terakhir PDF, layar guru) ----------
export function ringkasan(main, isian) {
  const v = (id) => (terisi(isian[id]) ? isian[id] : "(kosong)");
  const tabel = CONFIG.stages
    .map((s, i) => {
      if (!dimainkan(main, i)) return `Tahap ${s.id}: tidak dimainkan`;
      const t = `t${i + 1}`;
      return `Tahap ${s.id}: peluang menang = ${v(t + "_p")}; peluang kalah = ${v(t + "_q")}; centang ${v(t + "_hasil")}; peluang dari hasil = ${v(t + "_ph")}`;
    })
    .join("\n");
  const soal9 = [0, 1].map((x) => `x = ${x}: pˣ = ${v("s9_p" + x)}; q¹⁻ˣ = ${v("s9_q" + x)}; kolom terakhir = ${v("s9_h" + x)}`).join("\n");
  return {
    nama: isian.nama || "",
    nim: isian.nim || "",
    kelas: isian.kelas || "",
    permainan: CONFIG.stages.map((s, i) => ({ tahap: s.id, p: B().fmtP(main.p[i]), hasil: hasilTeks(main.x[i]) })),
    jawaban: [
      ["Soal 1", v("s1")],
      ["Soal 2 (tabel hasil permainan)", tabel],
      ["Soal 3", v("s3")],
      ["Soal 4", v("s4")],
      ["Soal 5", v("s5")],
      ["Soal 6", v("s6")],
      ["Soal 7", `P(X = 1) = ${v("s7_1")}; P(X = 0) = ${v("s7_0")}`],
      ["Soal 8", `P(X = 1) = ${v("s8_1")}; P(X = 0) = ${v("s8_0")}`],
      ["Soal 9 (tabel)", soal9],
      ["Soal 9 (jawaban)", v("s9")],
      ["Soal 10 nomor 1", v("s10_1")],
      ["Soal 10 nomor 2", v("s10_2")],
      ["Refleksi", v("refleksi")],
    ],
  };
}

export function ringkasanHtml(main, isian, status) {
  const r = ringkasan(main, isian);
  const menang = main.x.filter((x) => x === 1).length;
  const kalah = main.x.filter((x) => x === 0).length;
  return `
    <dl class="lk-hasil-id">
      <div><dt>Nama</dt><dd>${escapeHtml(r.nama) || "-"}</dd></div>
      <div><dt>NIM</dt><dd>${escapeHtml(r.nim) || "-"}</dd></div>
      <div><dt>Kelas</dt><dd>${escapeHtml(r.kelas) || "-"}</dd></div>
      <div><dt>Status</dt><dd>${escapeHtml(STATUS_TEKS[status] || status)}</dd></div>
    </dl>
    <h4>Progres permainan</h4>
    <div class="table-scroll"><table class="data-table"><thead><tr><th>Tahap</th><th>p</th><th>Hasil</th></tr></thead><tbody>${r.permainan
      .map((g) => `<tr><td>${g.tahap}</td><td>${g.p}</td><td class="${g.hasil === "Menang" ? "txt-win" : g.hasil === "Kalah" ? "txt-lose" : "muted"}">${g.hasil}</td></tr>`)
      .join("")}</tbody></table></div>
    <p class="small">Menang ${menang} kali, kalah ${kalah} kali${menang + kalah < 5 ? `, ${5 - menang - kalah} tahap tidak dimainkan` : ""}.</p>
    <h4>Jawaban LKM</h4>
    <dl class="lk-hasil-jawab">${r.jawaban.map(([j, isi]) => `<div><dt>${j}</dt><dd>${escapeHtml(isi)}</dd></div>`).join("")}</dl>`;
}

// ---------- PDF: halaman asli + jawaban di kotaknya, lalu satu halaman ringkasan ----------
const TINTA = "#1d3f8f";
export const HURUF = 'Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif';
export const UKURAN = 22; // px pada lebar 1240, kira-kira 10,6 pt; sama dengan ukuran di layar (lihat CSS .lk-sheet)

function muatGambar(src) {
  return new Promise((ok, gagal) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => gagal(new Error("Gambar LKM gagal dimuat: " + src));
    im.src = src;
  });
}

function bungkus(ctx, teks, lebar, indent = 0) {
  const out = [];
  const muatDi = () => lebar - (out.length === 0 ? indent : 0);
  for (const para of String(teks).split(/\r?\n/)) {
    let baris = "";
    for (const kata of para.split(" ")) {
      const coba = baris ? baris + " " + kata : kata;
      if (ctx.measureText(coba).width <= muatDi()) {
        baris = coba;
        continue;
      }
      if (baris) out.push(baris);
      baris = "";
      // kata yang lebih panjang dari kotak dipotong per huruf
      for (const ch of kata) {
        if (ctx.measureText(baris + ch).width > muatDi() && baris) {
          out.push(baris);
          baris = "";
        }
        baris += ch;
      }
    }
    out.push(baris);
  }
  return out;
}

/** Menulis jawaban di atas garis titik-titik kotak. Jika tidak muat, huruf dan jarak baris dikecilkan;
 *  jika tetap tidak muat, sisanya dipotong (lengkapnya ada di halaman Hasil Singkat). Hasil true jika dipotong. */
function tulisKotak(ctx, teks, b) {
  const x = GARIS_X;
  const w = 1073 - GARIS_X;
  const bawah = b.y + b.h - 6;
  ctx.textBaseline = "alphabetic";
  let s = UKURAN;
  let baris, lh, dasar, muat;
  for (; s >= 13; s -= 1) {
    ctx.font = `${s}px ${HURUF}`;
    lh = (b.jarak * s) / UKURAN;
    dasar = s === UKURAN ? garisPertama(b) : b.y + 4 + s;
    muat = Math.max(1, Math.floor((bawah - dasar) / lh) + 1);
    baris = bungkus(ctx, teks, w, b.indent * (s / UKURAN));
    if (baris.length <= muat) break;
  }
  s = Math.max(s, 13);
  let potong = false;
  if (baris.length > muat) {
    potong = true;
    baris = baris.slice(0, muat);
    const ekor = " ... (lanjutan di halaman Hasil Singkat)";
    let akhir = baris[muat - 1];
    while (akhir && ctx.measureText(akhir + ekor).width > w) akhir = akhir.slice(0, -1);
    baris[muat - 1] = akhir + ekor;
  }
  baris.forEach((l, i) => ctx.fillText(l, x + (i === 0 ? b.indent * (s / UKURAN) : 0), dasar + i * lh));
  ctx.textBaseline = "top";
  return potong;
}

function tulisSatuBaris(ctx, teks, x, y, w, h, tengah, tebal = "") {
  let s = UKURAN;
  for (; s > 10; s -= 1) {
    ctx.font = `${tebal}${s}px ${HURUF}`;
    if (ctx.measureText(teks).width <= w) break;
  }
  ctx.textAlign = tengah ? "center" : "left";
  ctx.fillText(teks, tengah ? x + w / 2 : x, y + (h - s) / 2);
  ctx.textAlign = "left";
}

export async function kanvasHalaman(n, main, isian) {
  const img = await muatGambar(gambarHal(n));
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  ctx.scale(c.width / HAL_W, c.height / HAL_H);
  ctx.fillStyle = TINTA;
  ctx.strokeStyle = TINTA;
  ctx.textBaseline = "top";
  let potong = false;
  for (const b of BIDANG.filter((x) => x.hal === n)) {
    const main_ok = b.tahap === undefined || dimainkan(main, b.tahap);
    const v = isian[b.id] || "";
    if (b.jenis === "uraian") {
      if (v) potong = tulisKotak(ctx, v, b) || potong;
    } else if (b.jenis === "identitas") {
      if (v) tulisSatuBaris(ctx, v, b.x + 6, b.y, b.w - 12, b.h, false);
    } else if (b.jenis === "titik") {
      if (v) tulisSatuBaris(ctx, v, b.x + 1, b.y - 3, b.w - 2, b.h - 4, b.w < 100, "bold ");
    } else if (b.jenis === "sel") {
      const t = main_ok ? v : "-";
      if (t) tulisSatuBaris(ctx, t, b.x + 6, b.y, b.w - 12, b.h, true);
    } else if (b.jenis === "ceklis" && main_ok && v === b.nilai) {
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 1);
      ctx.lineTo(cx - 4, cy + 11);
      ctx.lineTo(cx + 16, cy - 11);
      ctx.stroke();
    }
  }
  return { kanvas: c, potong };
}

function halamanRingkasan(doc, main, isian, status) {
  const r = ringkasan(main, isian);
  const L = 18;
  const W = 174;
  let y = 20;
  const pastikan = (h) => {
    if (y + h > 282) {
      doc.addPage();
      y = 20;
    }
  };
  const para = (teks, size = 10.5, gaya = "normal", jarak = 1.5) => {
    doc.setFont("helvetica", gaya);
    doc.setFontSize(size);
    for (const line of doc.splitTextToSize(pdfText(teks), W)) {
      pastikan(size * 0.45);
      doc.text(line, L, y);
      y += size * 0.45;
    }
    y += jarak;
  };
  para("Hasil Singkat LKM Distribusi Bernoulli", 15, "bold", 2);
  para("Catatan Pertarungan di Kerajaan Swarnadwipa · Universitas Sriwijaya · by Kelompok 17", 9.5, "normal", 4);
  para(`Nama: ${r.nama || "-"}`, 11, "normal", 0.5);
  para(`NIM: ${r.nim || "-"}`, 11, "normal", 0.5);
  para(`Kelas: ${r.kelas || "-"}`, 11, "normal", 0.5);
  para(`Status: ${STATUS_TEKS[status] || status}`, 10, "italic", 4);
  para("Progres permainan", 11.5, "bold", 1);
  r.permainan.forEach((g) => para(`Tahap ${g.tahap} (p = ${g.p}): ${g.hasil}`, 10.5, "normal", 0.3));
  y += 4;
  para("Jawaban LKM", 11.5, "bold", 1.5);
  r.jawaban.forEach(([judul, isi]) => {
    para(judul, 10.5, "bold", 0.8);
    para(isi, 10.5, "normal", 3);
  });
}

/** Unduh PDF: 5 halaman LKM persis seperti di layar (dengan jawaban) dan 1 halaman Hasil Singkat. */
export async function unduhPdf({ main, isian, status }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  for (let n = 1; n <= JUMLAH_HAL; n++) {
    const { kanvas } = await kanvasHalaman(n, main, isian);
    if (n > 1) doc.addPage();
    doc.addImage(kanvas.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, 210, 297);
  }
  doc.addPage();
  halamanRingkasan(doc, main, isian, status);
  const aman = String(isian.nama || "").normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  doc.save(`LKM_Bernoulli_${aman || "Mahasiswa"}.pdf`);
}
