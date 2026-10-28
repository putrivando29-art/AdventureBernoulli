// LKPD siswa: halaman asli draf Kelompok 17 ditampilkan satu per satu, kolom isian ada di atas kotak
// jawabannya (lihat js/lkpd-lembar.js). Data permainan diambil dari akun siswa.
import * as akun from "./akun.js";
import * as L from "./lkpd-lembar.js";
import { initPapanRumus, syncTombol, tutupPapan } from "./papan-rumus.js";
import { $, printableText, show } from "./ui.js";

const TERKUNCI = ["terkirim", "minta-ubah"];
const ZOOM_MAKS = 4;
const LEBAR_MAKS = 860;

let st = null; // { lkpd, main, hal, zoom, lembar: [elemen halaman 1..5] }
const terkunci = () => !!st && TERKUNCI.includes(st.lkpd.status);

// ---------- kemajuan dan isian kosong ----------
function progress() {
  const ids = L.idWajib(st.main);
  return Math.round((ids.filter((id) => L.terisi(st.lkpd.isian[id])).length / ids.length) * 100);
}

function tandaiKosong(ids) {
  document.querySelectorAll("#screen-lkpd .lk-kosong").forEach((e) => e.classList.remove("lk-kosong"));
  ids.forEach((id) => document.querySelectorAll(`#screen-lkpd [data-f="${id}"]`).forEach((e) => e.classList.add("lk-kosong")));
}

function lepasTanda(id) {
  document.querySelectorAll(`#screen-lkpd [data-f="${id}"]`).forEach((e) => e.classList.remove("lk-kosong"));
}

// ---------- zoom: cubit dua jari, Ctrl + gulir, atau tombol − dan + ----------
const vp = () => $("#lk-viewport");
const lembarAktif = () => st.lembar[st.hal - 1];
const lebarPas = () => Math.min(vp().clientWidth, LEBAR_MAKS);

function terapkanZoom() {
  const w = Math.round(lebarPas() * st.zoom);
  st.lembar.forEach((s) => {
    s.style.width = w + "px";
    s.style.setProperty("--sw", w);
  });
  $("#lk-zoom-nilai").textContent = Math.round(st.zoom * 100) + "%";
  $("#lk-zoom-out").disabled = st.zoom <= 1;
  $("#lk-zoom-in").disabled = st.zoom >= ZOOM_MAKS;
}

/** Ubah zoom dengan titik (cx, cy) di layar tetap di tempatnya. */
function zoomDi(z, cx, cy) {
  z = Math.min(ZOOM_MAKS, Math.max(1, z));
  if (Math.abs(z - st.zoom) < 0.001) return;
  const sheet = lembarAktif();
  const r = sheet.getBoundingClientRect();
  const fx = (cx - r.left) / r.width;
  const fy = (cy - r.top) / r.height;
  st.zoom = z;
  terapkanZoom();
  const r2 = sheet.getBoundingClientRect();
  vp().scrollLeft += r2.left + fx * r2.width - cx;
  window.scrollBy(0, r2.top + fy * r2.height - cy);
}

function zoomTengah(faktor) {
  const r = vp().getBoundingClientRect();
  zoomDi(st.zoom * faktor, r.left + r.width / 2, Math.max(r.top, 0) + Math.min(r.height, window.innerHeight) / 2);
}

function initCubit() {
  const el = vp();
  let awal = null;
  const jarak = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  el.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) awal = { d: jarak(e.touches), z: st.zoom };
  }, { passive: true });
  el.addEventListener("touchmove", (e) => {
    if (!awal || e.touches.length !== 2) return;
    e.preventDefault();
    const t = e.touches;
    zoomDi((awal.z * jarak(t)) / awal.d, (t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2);
  }, { passive: false });
  el.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) awal = null;
  });
  el.addEventListener("wheel", (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    zoomDi(st.zoom * Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
  }, { passive: false });
  ["gesturestart", "gesturechange"].forEach((t) => el.addEventListener(t, (e) => e.preventDefault()));
}

// Selama LKPD terbuka, zoom bawaan browser dimatikan agar iPhone tidak memperbesar halaman sendiri saat
// kotak diketuk; cubit tetap bisa karena ditangani lembar LKPD.
const META = document.querySelector('meta[name="viewport"]');
const META_ASLI = META ? META.content : "";
function zoomBrowser(boleh) {
  if (META) META.content = boleh ? META_ASLI : META_ASLI + ", maximum-scale=1";
}

/** Di HP, kotak yang diketuk diperbesar sampai selebar layar agar tulisan terbaca. */
function perbesarKe(el) {
  if (terkunci() || vp().clientWidth >= 600 || !el.closest(".lk-sheet")) return;
  const tabel = el.classList.contains("lk-f-sel") || el.classList.contains("lk-f-ceklis");
  const [x1, x2] = tabel ? [L.TABEL_X[0] - 6, L.TABEL_X[1] + 6] : [140, 1102];
  const z = Math.min(ZOOM_MAKS, (vp().clientWidth - 8) / (lebarPas() * ((x2 - x1) / L.HAL_W)));
  if (st.zoom >= z - 0.05) return;
  st.zoom = z;
  terapkanZoom();
  vp().scrollLeft = (x1 / L.HAL_W) * lembarAktif().offsetWidth - 4;
  const r = el.getBoundingClientRect();
  window.scrollBy(0, r.top - window.innerHeight * 0.2);
}

// ---------- tampilan ----------
function tampilMain() {
  const m = st.main;
  const chip = (x, i) =>
    `<span class="lk-chip ${x === 1 ? "is-win" : x === 0 ? "is-lose" : "is-none"}" title="Tahap ${i + 1}: ${L.hasilTeks(x)}"><span class="sr-only">Tahap ${i + 1}: ${L.hasilTeks(x)}</span><span aria-hidden="true">T${i + 1} ${x === 1 || x === 0 ? L.hasilTeks(x) : "-"}</span></span>`;
  $("#lk-main").innerHTML = `<span class="lk-main-judul">Hasil permainanmu</span>${m.x.map(chip).join("")}<span class="lk-chip is-last">Tahap terakhir yang dimainkan: ${L.tahapTerakhir(m)}</span>`;
}

function setLocked() {
  const kunci = terkunci();
  L.kunciLembar($("#screen-lkpd"), kunci);
  $("#btn-lk-kirim").hidden = kunci;
  $("#btn-lk-ubah").hidden = st.lkpd.status !== "terkirim";
  document.querySelectorAll('.lk-hotspot[data-aksi="kirim"]').forEach((b) => (b.disabled = kunci));
  document.querySelectorAll('.lk-hotspot[data-aksi="ubah"]').forEach((b) => (b.disabled = st.lkpd.status !== "terkirim"));
  $("#lk-status").textContent = L.STATUS_TEKS[st.lkpd.status] || "";
  $("#lk-hint").hidden = kunci;
  syncTombol();
}

function updateProgress() {
  $("#lk-progress").textContent = `${progress()}% isian terisi`;
}

/** Halaman n boleh dibuka jika halaman sebelumnya sudah lengkap. Hasil: true, atau nomor halaman yang belum lengkap. */
function bolehKe(n) {
  if (terkunci()) return true;
  for (let h = 1; h < n; h++) if (L.idKosong(st.main, st.lkpd.isian, h).length) return h;
  return true;
}

function tampilHal(n) {
  st.hal = n;
  st.lembar.forEach((s, i) => (s.hidden = i + 1 !== n));
  $("#lk-akhir").hidden = n !== L.JUMLAH_HAL;
  $("#lk-page-no").textContent = `Halaman ${n} dari ${L.JUMLAH_HAL}`;
  $("#lk-prev").disabled = n === 1;
  $("#lk-next").hidden = n === L.JUMLAH_HAL;
  document.querySelectorAll("#lk-dots button").forEach((b) => b.setAttribute("aria-current", String(Number(b.dataset.go2) === n)));
  $("#lk-nav-msg").textContent = "";
  vp().scrollLeft = 0;
  $("#lk-body").scrollIntoView({ block: "start" });
}

function pindah(n) {
  flushSave();
  if (n > st.hal) {
    const ok = bolehKe(n);
    if (ok !== true) {
      if (ok !== st.hal) tampilHal(ok);
      const kosong = L.idKosong(st.main, st.lkpd.isian, ok);
      tandaiKosong(kosong);
      $("#lk-nav-msg").textContent = `Masih ada ${kosong.length} isian kosong di halaman ${ok} (ditandai merah). Isi semuanya dulu, lalu lanjut.`;
      return;
    }
  }
  tampilHal(n);
}

// ---------- simpan ----------
let pending = {};
let timer = 0;
function queueSave(id, value) {
  if (terkunci()) return;
  st.lkpd.isian[id] = value;
  pending[id] = value;
  if (L.terisi(value)) lepasTanda(id);
  updateProgress();
  clearTimeout(timer);
  timer = setTimeout(flushSave, 600);
}

async function flushSave() {
  clearTimeout(timer);
  const batch = pending;
  pending = {};
  if (!st || !Object.keys(batch).length) return;
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

// ---------- kirim, hasil, PDF, ajukan perubahan ----------
function pesan(text, ok = false) {
  const msg = $("#lk-send-msg");
  msg.className = "form-msg" + (ok ? " txt-win" : "");
  msg.textContent = text;
}

/** Semua isian wajib terisi sebelum kirim, lihat hasil, atau unduh PDF. */
function lengkap(aksi) {
  const kosong = L.idKosong(st.main, st.lkpd.isian);
  if (!kosong.length) return true;
  const hal = [...new Set(kosong.map(L.halamanIsi))].sort();
  tandaiKosong(kosong);
  pesan(`Belum bisa ${aksi}: masih ada ${kosong.length} isian kosong di halaman ${hal.join(", ")} (ditandai merah). Semua isian wajib diisi.`);
  return false;
}

async function kirim() {
  await flushSave();
  if (!lengkap("mengirim")) return;
  if (!st.konfirmasi) {
    st.konfirmasi = true;
    pesan("Setelah dikirim, jawaban terkunci dan hanya bisa diubah dengan persetujuan guru. Tekan Kirim LKPD sekali lagi untuk mengirim.");
    return;
  }
  st.konfirmasi = false;
  try {
    await akun.kirimLkpd(st.main.id, progress());
    st.lkpd.status = "terkirim";
    pesan("LKPD terkirim. Terima kasih!", true);
    setLocked();
  } catch (e) {
    pesan(akun.pesanGalat(e));
  }
}

function lihatHasil() {
  if (!lengkap("melihat hasil")) return;
  $("#lk-hasil-body").innerHTML = L.ringkasanHtml(st.main, st.lkpd.isian, st.lkpd.status);
  $("#dlg-hasil").showModal();
}

async function unduh(btn) {
  if (!lengkap("mengunduh PDF")) return;
  const label = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Menyiapkan PDF...";
  }
  try {
    await L.unduhPdf({ main: st.main, isian: st.lkpd.isian, status: st.lkpd.status });
  } catch (e) {
    console.error("PDF LKPD gagal dibuat:", e);
    pesan("PDF gagal dibuat. Coba lagi.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = label;
    }
  }
}

function bukaUbah() {
  if (st.lkpd.status !== "terkirim") return;
  $("#ubah-alasan").value = "";
  $("#ubah-msg").textContent = "";
  $("#dlg-ubah").showModal();
}

function initDialog() {
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
      $("#dlg-ubah").close();
      setLocked();
    } catch (err) {
      $("#ubah-msg").textContent = akun.pesanGalat(err);
    }
  });
  $("#dlg-hasil").addEventListener("click", (e) => {
    if (e.target.closest("#btn-hasil-pdf")) unduh(e.target.closest("button"));
    if (e.target.closest("#btn-hasil-tutup")) $("#dlg-hasil").close();
  });
}

// ---------- buka LKPD ----------
export async function bukaLkpd() {
  show("lkpd");
  zoomBrowser(false);
  const body = $("#lk-body");
  const msg = $("#lk-load");
  body.hidden = true;
  msg.hidden = false;
  msg.textContent = "Memuat LKPD...";
  try {
    let lkpd = await akun.bacaLkpd();
    let main;
    if (lkpd && lkpd.status !== "draf") main = await akun.bacaPermainan(lkpd.permainanId);
    else main = await akun.permainanTerbaru();
    if (!main) {
      msg.textContent = "Selesaikan permainan dulu (minimal satu tahap dengan peluang bawaan). Setelah layar rekap muncul, LKPD bisa dibuka.";
      return;
    }
    let changed = false;
    if (!lkpd) lkpd = await akun.buatLkpd(main.id);
    else if (lkpd.status === "draf" && lkpd.permainanId !== main.id) changed = true;
    lkpd.isian = lkpd.isian || {};
    st = { lkpd, main, hal: 1, zoom: 1, lembar: [] };
    for (let n = 1; n <= L.JUMLAH_HAL; n++) st.lembar.push(L.bangunLembar(n, main));
    $("#lk-pages").replaceChildren(...st.lembar);
    $("#lk-changed").hidden = !changed;
    if (changed) akun.simpanIsian({}, progress(), main.id).catch(() => {});
    L.isiLembar($("#screen-lkpd"), lkpd.isian);
    tampilMain();
    pesan("");
    $("#lk-save").textContent = "";
    msg.hidden = true;
    body.hidden = false;
    setLocked();
    updateProgress();
    terapkanZoom();
    tampilHal(1);
  } catch (e) {
    console.error("LKPD gagal dimuat:", e);
    msg.textContent = akun.pesanGalat(e);
  }
}

export function initLkpd() {
  const scr = $("#screen-lkpd");
  scr.addEventListener("input", (e) => {
    const el = e.target.closest("textarea[data-f], input[data-f]");
    if (!el || el.readOnly) return;
    // nama dan kelas juga dicetak di halaman Hasil Singkat (font PDF bawaan): emoji dan simbol khusus dihapus
    if (el.classList.contains("lk-f-identitas")) {
      const clean = printableText(el.value);
      if (clean !== el.value) el.value = clean;
    }
    if (el.classList.contains("lk-f-titik")) L.pasHuruf(el);
    st.konfirmasi = false;
    queueSave(el.dataset.f, el.value);
    if ($("#lk-send-msg").textContent && !L.idKosong(st.main, st.lkpd.isian).length) pesan("");
  });
  scr.addEventListener("change", () => flushSave());
  scr.addEventListener("click", (e) => {
    const cek = e.target.closest(".lk-f-ceklis");
    if (cek && !cek.disabled) {
      const id = cek.dataset.f;
      const v = st.lkpd.isian[id] === cek.dataset.nilai ? "" : cek.dataset.nilai;
      scr.querySelectorAll(`.lk-f-ceklis[data-f="${id}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.nilai === v)));
      st.konfirmasi = false;
      queueSave(id, v);
      flushSave();
      return;
    }
    const aksi = e.target.closest(".lk-hotspot, #btn-lk-kirim, #btn-lk-pdf, #btn-lk-hasil, #btn-lk-ubah");
    if (!aksi || aksi.disabled) return;
    const a = aksi.dataset.aksi || aksi.id.replace("btn-lk-", "");
    if (a === "kirim") kirim();
    else if (a === "pdf") unduh(aksi.classList.contains("lk-hotspot") ? null : aksi);
    else if (a === "hasil") lihatHasil();
    else if (a === "ubah") bukaUbah();
  });
  scr.addEventListener("focusin", (e) => {
    if (e.target.matches(".lk-f")) perbesarKe(e.target);
  });
  $("#lk-prev").addEventListener("click", () => pindah(st.hal - 1));
  $("#lk-next").addEventListener("click", () => pindah(st.hal + 1));
  $("#lk-dots").addEventListener("click", (e) => {
    const b = e.target.closest("[data-go2]");
    if (b) pindah(Number(b.dataset.go2));
  });
  $("#lk-zoom-in").addEventListener("click", () => zoomTengah(1.25));
  $("#lk-zoom-out").addEventListener("click", () => zoomTengah(1 / 1.25));
  $("#lk-zoom-pas").addEventListener("click", () => {
    st.zoom = 1;
    terapkanZoom();
  });
  initCubit();
  initDialog();
  initPapanRumus({ aktif: () => !!st && !terkunci() });
  window.addEventListener("resize", () => st && terapkanZoom());
  // keluar dari layar LKPD: zoom browser dan papan rumus kembali seperti semula
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go && go.dataset.go !== "lkpd") {
      flushSave();
      tutupPapan();
      zoomBrowser(true);
    }
  });
  window.addEventListener("pagehide", flushSave);
}
