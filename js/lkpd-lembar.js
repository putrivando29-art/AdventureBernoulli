// Lembar LKPD 1:1. Halaman 1 sampai 5 adalah gambar asli draf Word Kelompok 17 (assets/lkpd/hal-N.png,
// tidak diubah sedikit pun); kolom isian ditempel tepat di atas kotak jawabannya. Halaman 6 draf berisi kunci
// jawaban dan rubrik, jadi tidak ditampilkan. Dipakai layar LKPD siswa dan (nanti) layar guru.
// Koordinat diukur dari PDF draf pada 150 dpi: satu halaman A4 = 1241 x 1754 piksel.
import { CONFIG } from "./config.js";
import { escapeHtml } from "./ui.js";
import { pdfText } from "./papan-rumus.js";

export const HAL_W = 1241;
export const HAL_H = 1754;
export const JUMLAH_HAL = 5;
export const gambarHal = (n) => `assets/lkpd/hal-${n}.png`;

const B = () => window.Bernoulli;
const KX = 151; // tepi kiri bagian dalam kotak Jawaban
const KW = 940;
const LABEL_H = 30; // tulisan "Jawaban" di pojok kiri atas kotak tidak ditimpa
const KOLOM = { q: [363, 510], Menang: [511, 676], Kalah: [677, 811], x: [812, 894], px: [895, 1158] };
const BARIS_Y = 1054;
const BARIS_H = 76;
export const TABEL_X = [83, 1158];

const uraian = (id, hal, y1, y2, label) => ({ id, hal, jenis: "uraian", x: KX, y: y1, w: KW, h: y2 - y1, label });

function selTabel() {
  const out = [];
  CONFIG.stages.forEach((s, i) => {
    const t = `t${i + 1}`;
    const sel = (id, k, extra) => ({ id, hal: 3, tahap: i, x: KOLOM[k][0], y: BARIS_Y + i * BARIS_H, w: KOLOM[k][1] - KOLOM[k][0], h: BARIS_H, ...extra });
    out.push(sel(`${t}_q`, "q", { jenis: "sel", label: `Peluang kalah q tahap ${s.id}` }));
    out.push(sel(`${t}_hasil`, "Menang", { jenis: "ceklis", nilai: "Menang", label: `Ceklis Menang tahap ${s.id}` }));
    out.push(sel(`${t}_hasil`, "Kalah", { jenis: "ceklis", nilai: "Kalah", label: `Ceklis Kalah tahap ${s.id}` }));
    out.push(sel(`${t}_x`, "x", { jenis: "sel", label: `X tahap ${s.id}` }));
    out.push(sel(`${t}_px`, "px", { jenis: "sel", label: `P(X = x) tahap ${s.id}` }));
  });
  return out;
}

/** Semua isian. Titik-titik soal 2 diisi dengan huruf tebal (isian "titik"); lebarnya mengikuti ruang kosong di gambar. */
export const BIDANG = [
  { id: "nama", hal: 1, jenis: "identitas", x: 464, y: 644, w: 414, h: 38, label: "Nama", maks: 40 },
  { id: "kelas", hal: 1, jenis: "identitas", x: 462, y: 689, w: 414, h: 38, label: "Kelas", maks: 15 },
  uraian("s1", 3, 243, 359, "Jawaban soal 1"),
  { id: "s2_menang", hal: 3, jenis: "titik", x: 736, y: 372, w: 38, h: 27, label: "Soal 2: peluang kamu menang" },
  { id: "s2_kalah", hal: 3, jenis: "titik", x: 221, y: 405, w: 200, h: 27, label: "Soal 2: peluang kamu kalah" },
  uraian("s2", 3, 453, 568, "Jawaban soal 2"),
  ...selTabel(),
  uraian("s3", 4, 259, 417, "Jawaban soal 3"),
  uraian("s4", 4, 696, 874, "Jawaban soal 4"),
  uraian("s5", 4, 968, 1125, "Jawaban soal 5"),
  uraian("s6", 5, 416, 636, "Jawaban soal 6 a, b, dan c"),
  uraian("s7", 5, 730, 887, "Jawaban soal 7"),
  uraian("refleksi", 5, 1031, 1168, "Jawaban refleksi"),
];

/** Tulisan tombol "[ Kirim LKPD ]" dan seterusnya di bawah halaman 5 dibuat bisa diketuk. */
const TOMBOL_HAL5 = [
  { aksi: "kirim", x: 278, w: 128, label: "Kirim LKPD" },
  { aksi: "pdf", x: 419, w: 197, label: "Unduh LKPD (PDF)" },
  { aksi: "ubah", x: 631, w: 332, label: "Ajukan Perubahan (setelah terkirim)" },
].map((t) => ({ ...t, y: 1199, h: 38 }));

export const STATUS_TEKS = {
  draf: "Draf. Jawaban tersimpan otomatis.",
  terkirim: "Terkirim. Jawaban terkunci.",
  "minta-ubah": "Menunggu persetujuan guru untuk mengubah jawaban.",
  dibuka: "Guru menyetujui perubahan. Ubah jawaban, lalu kirim lagi.",
};

export const dimainkan = (main, i) => main.x[i] === 0 || main.x[i] === 1;
export const terisi = (v) => typeof v === "string" && v.trim() !== "";
export const halamanIsi = (id) => BIDANG.find((x) => x.id === id).hal;

/** ID isian wajib. Baris tabel untuk tahap yang tidak dimainkan tidak diisi siswa (otomatis "-"). */
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

const CENTANG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Satu halaman: gambar asli + kolom isian di atas kotaknya. Kunci (hanya baca) diatur lewat kunciLembar. */
export function bangunLembar(n, main) {
  const el = document.createElement("div");
  el.className = "lk-sheet";
  el.dataset.hal = n;
  let html = `<img class="lk-sheet-img" src="${gambarHal(n)}" width="1654" height="2339" alt="LKPD Distribusi Bernoulli halaman ${n}" draggable="false">`;
  if (n === 3) {
    CONFIG.stages.forEach((s, i) => {
      if (!dimainkan(main, i)) {
        const y = BARIS_Y + i * BARIS_H;
        html += `<div class="lk-row-off" style="${pct({ x: KOLOM.q[0], y, w: KOLOM.px[1] - KOLOM.q[0], h: BARIS_H })}" title="Tahap ${s.id} tidak dimainkan"></div>`;
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
      html += `<textarea class="lk-f lk-f-uraian" data-f="${b.id}" aria-label="${b.label}" spellcheck="false" style="${pct(b, 8, LABEL_H, -16, -LABEL_H - 6)}"></textarea>`;
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
      return `Tahap ${s.id}: q = ${v(t + "_q")}; ceklis ${v(t + "_hasil")}; X = ${v(t + "_x")}; P(X = x) = ${v(t + "_px")}`;
    })
    .join("\n");
  return {
    nama: isian.nama || "",
    kelas: isian.kelas || "",
    permainan: CONFIG.stages.map((s, i) => ({ tahap: s.id, p: B().fmtP(main.p[i]), hasil: hasilTeks(main.x[i]) })),
    jawaban: [
      ["Soal 1", v("s1")],
      ["Soal 2 (titik-titik)", `Peluang menang: ${v("s2_menang")}; peluang kalah: ${v("s2_kalah")}`],
      ["Soal 2 (kotak jawaban)", v("s2")],
      ["Tabel hasil permainan", tabel],
      ["Soal 3", v("s3")],
      ["Soal 4", v("s4")],
      ["Soal 5", v("s5")],
      ["Soal 6 (a, b, dan c)", v("s6")],
      ["Soal 7", v("s7")],
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
      <div><dt>Kelas</dt><dd>${escapeHtml(r.kelas) || "-"}</dd></div>
      <div><dt>Status</dt><dd>${escapeHtml(STATUS_TEKS[status] || status)}</dd></div>
    </dl>
    <h4>Progres permainan</h4>
    <div class="table-scroll"><table class="data-table"><thead><tr><th>Tahap</th><th>p</th><th>Hasil</th></tr></thead><tbody>${r.permainan
      .map((g) => `<tr><td>${g.tahap}</td><td>${g.p}</td><td class="${g.hasil === "Menang" ? "txt-win" : g.hasil === "Kalah" ? "txt-lose" : "muted"}">${g.hasil}</td></tr>`)
      .join("")}</tbody></table></div>
    <p class="small">Menang ${menang} kali, kalah ${kalah} kali${menang + kalah < 5 ? `, ${5 - menang - kalah} tahap tidak dimainkan` : ""}.</p>
    <h4>Jawaban LKPD</h4>
    <dl class="lk-hasil-jawab">${r.jawaban.map(([j, isi]) => `<div><dt>${j}</dt><dd>${escapeHtml(isi)}</dd></div>`).join("")}</dl>`;
}

// ---------- PDF: halaman asli + jawaban di kotaknya, lalu satu halaman ringkasan ----------
const TINTA = "#1d3f8f";
export const HURUF = 'Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif';
export const UKURAN = 22; // px pada lebar 1241, kira-kira 10,6 pt; sama dengan ukuran di layar (lihat CSS .lk-sheet)

function muatGambar(src) {
  return new Promise((ok, gagal) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => gagal(new Error("Gambar LKPD gagal dimuat: " + src));
    im.src = src;
  });
}

function bungkus(ctx, teks, lebar) {
  const out = [];
  for (const para of String(teks).split(/\r?\n/)) {
    let baris = "";
    for (const kata of para.split(" ")) {
      const coba = baris ? baris + " " + kata : kata;
      if (ctx.measureText(coba).width <= lebar) {
        baris = coba;
        continue;
      }
      if (baris) out.push(baris);
      baris = "";
      // kata yang lebih panjang dari kotak dipotong per huruf
      for (const ch of kata) {
        if (ctx.measureText(baris + ch).width > lebar && baris) {
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

/** Menulis teks di kotak; huruf dikecilkan bila perlu. Hasil true jika tetap tidak muat dan dipotong. */
function tulisKotak(ctx, teks, x, y, w, h) {
  let s = UKURAN;
  let baris;
  for (; s >= 13; s -= 1) {
    ctx.font = `${s}px ${HURUF}`;
    baris = bungkus(ctx, teks, w);
    if (baris.length * s * 1.25 <= h) break;
  }
  s = Math.max(s, 13);
  ctx.font = `${s}px ${HURUF}`;
  const lh = s * 1.25;
  const muat = Math.max(1, Math.floor(h / lh));
  let potong = false;
  if (baris.length > muat) {
    potong = true;
    baris = baris.slice(0, muat);
    const ekor = " ... (lanjutan di halaman Hasil Singkat)";
    let akhir = baris[muat - 1];
    while (akhir && ctx.measureText(akhir + ekor).width > w) akhir = akhir.slice(0, -1);
    baris[muat - 1] = akhir + ekor;
  }
  baris.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
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
      if (v) potong = tulisKotak(ctx, v, b.x + 12, b.y + LABEL_H + 2, b.w - 24, b.h - LABEL_H - 8) || potong;
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
  para("Hasil Singkat LKPD Distribusi Bernoulli", 15, "bold", 2);
  para("Catatan Pertarungan di Kerajaan Swarnadwipa · Universitas Sriwijaya · by Kelompok 17", 9.5, "normal", 4);
  para(`Nama: ${r.nama || "-"}`, 11, "normal", 0.5);
  para(`Kelas: ${r.kelas || "-"}`, 11, "normal", 0.5);
  para(`Status: ${STATUS_TEKS[status] || status}`, 10, "italic", 4);
  para("Progres permainan", 11.5, "bold", 1);
  r.permainan.forEach((g) => para(`Tahap ${g.tahap} (p = ${g.p}): ${g.hasil}`, 10.5, "normal", 0.3));
  y += 4;
  para("Jawaban LKPD", 11.5, "bold", 1.5);
  r.jawaban.forEach(([judul, isi]) => {
    para(judul, 10.5, "bold", 0.8);
    para(isi, 10.5, "normal", 3);
  });
}

/** Unduh PDF: 5 halaman LKPD persis seperti di layar (dengan jawaban) dan 1 halaman Hasil Singkat. */
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
  doc.save(`LKPD_Bernoulli_${aman || "Siswa"}.pdf`);
}
