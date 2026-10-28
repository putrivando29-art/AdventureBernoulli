// Papan rumus LKPD, mirip keyboard GeoGebra: dibuka lewat tombol Papan Rumus, lalu tombolnya menulis
// langsung ke kotak jawaban yang sedang dipilih. Pangkat dan indeks memakai karakter Unicode (x², pˣ, q₁),
// jadi pecahan bertingkat tidak bisa; pecahan ditulis dengan garis miring, misalnya 1/2.
import { $, printableText } from "./ui.js";

export const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", i: "ⁱ", k: "ᵏ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", t: "ᵗ", x: "ˣ", y: "ʸ", "(": "⁽", ")": "⁾", "-": "⁻", "−": "⁻", "+": "⁺", "=": "⁼" };
export const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", a: "ₐ", e: "ₑ", i: "ᵢ", n: "ₙ", o: "ₒ", p: "ₚ", x: "ₓ", "(": "₍", ")": "₎", "-": "₋", "−": "₋", "+": "₊", "=": "₌" };

/** Teks jawaban untuk font PDF bawaan: pangkat menjadi ^(..), indeks menjadi _(..), simbol lain diganti. */
export function pdfText(s) {
  const inv = (map) => Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k === "−" ? "-" : k]));
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
    const m = supInv[ch] !== undefined ? "sup" : subInv[ch] !== undefined ? "sub" : null;
    if (m) {
      if (mode !== m) flush();
      mode = m;
      buf += m === "sup" ? supInv[ch] : subInv[ch];
    } else {
      flush();
      out += ch;
    }
  }
  flush();
  const ganti = { "−": "-", "≤": "<=", "≥": ">=", "≠": "!=", "√": "akar ", "π": "pi", "÷": ":", "→": "->", "←": "<-" };
  // printableText membuang ganti baris, jadi diproses per baris
  return out
    .replace(/[−≤≥≠√π÷→←]/g, (c) => ganti[c])
    .split(/\r?\n/)
    .map(printableText)
    .join("\n");
}

// tombol: teks biasa disisipkan apa adanya; objek { t: label, v: sisipan, a: aksi, w: lebar kolom, fn: tombol fungsi }
const KIRI = { t: "←", a: "kiri", fn: true, label: "Geser kursor ke kiri" };
const KANAN = { t: "→", a: "kanan", fn: true, label: "Geser kursor ke kanan" };
const HAPUS = { t: "⌫", a: "hapus", fn: true, label: "Hapus" };
const SPASI = { t: "spasi", v: " ", w: 3, label: "Spasi" };
const ENTER = { t: "↵", a: "enter", fn: true, label: "Baris baru" };
const TAB = {
  "123": [
    ["7", "8", "9", "×", "÷", "(", ")"],
    ["4", "5", "6", "+", "−", "=", "≠"],
    ["1", "2", "3", ",", ".", "<", ">"],
    ["0", "·", "/", "%", KIRI, KANAN, HAPUS],
    [SPASI, ENTER],
  ],
  "f(x)": [
    [{ t: "x²", v: "²", label: "Kuadrat" }, { t: "xⁿ", a: "sup", fn: true, label: "Mode pangkat" }, { t: "x₂", a: "sub", fn: true, label: "Mode indeks bawah" }, "√", "π", "±"],
    ["p", "q", "x", "X", "n", "="],
    [{ t: "P(X = x)", w: 2 }, "E(X)", "Var(X)", "≤", "≥"],
    [{ t: "pˣ · q¹⁻ˣ", w: 2 }, { t: "1 − p", w: 2 }, KIRI, KANAN, HAPUS],
    [SPASI, ENTER],
  ],
  ABC: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "?"],
    [{ t: "⇧", a: "shift", fn: true, label: "Huruf besar" }, "z", "x", "c", "v", "b", "n", "m", "!", HAPUS],
    [",", ".", ":", { t: "spasi", v: " ", w: 4, label: "Spasi" }, KIRI, KANAN, ENTER],
  ],
};

const st = { buka: false, tab: "123", mode: null, shift: false, target: null, aktif: () => true };

const kunciAt = (k) => (typeof k === "string" ? { t: k, v: k } : { v: k.a ? undefined : k.t, ...k });

function tombolHtml(k) {
  const d = kunciAt(k);
  const attr = d.a ? `data-aksi="${d.a}"` : `data-v="${d.v.replace(/"/g, "&quot;")}"`;
  const pressed = d.a === "sup" || d.a === "sub" || d.a === "shift" ? ' aria-pressed="false"' : "";
  return `<button type="button" class="papan-key${d.fn ? " is-fn" : ""}" ${attr}${pressed} style="grid-column: span ${d.w || 1}"${d.label ? ` aria-label="${d.label}"` : ""}>${d.t}</button>`;
}

function render() {
  const cols = (row) => row.reduce((n, k) => n + ((typeof k === "object" && k.w) || 1), 0);
  $("#papan-keys").innerHTML = TAB[st.tab]
    .map((row) => `<div class="papan-row" style="grid-template-columns: repeat(${cols(row)}, 1fr)">${row.map(tombolHtml).join("")}</div>`)
    .join("");
  document.querySelectorAll(".papan-tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === st.tab)));
  sinkronTanda();
}

function sinkronTanda() {
  document.querySelectorAll("#papan-keys [aria-pressed]").forEach((b) => {
    const a = b.dataset.aksi;
    b.setAttribute("aria-pressed", String(a === "shift" ? st.shift : st.mode === a));
  });
  if (st.tab === "ABC") document.querySelectorAll("#papan-keys [data-v]").forEach((b) => {
    if (/^[a-z]$/i.test(b.dataset.v)) b.textContent = st.shift ? b.dataset.v.toUpperCase() : b.dataset.v.toLowerCase();
  });
  const el = $("#papan-status");
  if (!targetSah()) el.textContent = "Ketuk kotak jawaban dulu, lalu tekan tombol di papan ini.";
  else if (st.mode === "sup") el.textContent = "Mode pangkat: angka dan huruf ditulis kecil di atas. Tekan xⁿ lagi untuk keluar.";
  else if (st.mode === "sub") el.textContent = "Mode indeks: angka dan huruf ditulis kecil di bawah. Tekan x₂ lagi untuk keluar.";
  else el.textContent = "";
}

const isianTeks = (el) => el && el.matches && el.matches("textarea[data-f], input[data-f]");
const targetSah = () => isianTeks(st.target) && document.contains(st.target) && !st.target.readOnly && !st.target.disabled && st.aktif();

/** Ubah teks sesuai mode pangkat atau indeks yang sedang aktif. */
function ubahMode(teks) {
  if (!st.mode) return teks;
  const map = st.mode === "sup" ? SUP : SUB;
  return [...teks].map((c) => map[c] ?? map[c.toLowerCase()] ?? c).join("");
}

function kabari(el) {
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function tekan(btn) {
  const aksi = btn.dataset.aksi;
  if (aksi === "sup" || aksi === "sub") {
    st.mode = st.mode === aksi ? null : aksi;
    return sinkronTanda();
  }
  if (aksi === "shift") {
    st.shift = !st.shift;
    return sinkronTanda();
  }
  if (!targetSah()) return sinkronTanda();
  const el = st.target;
  el.focus({ preventScroll: true });
  const a = el.selectionStart ?? el.value.length;
  const b = el.selectionEnd ?? a;
  if (aksi === "kiri" || aksi === "kanan") {
    const pos = aksi === "kiri" ? Math.max(0, a === b ? a - 1 : a) : Math.min(el.value.length, a === b ? b + 1 : b);
    return el.setSelectionRange(pos, pos);
  }
  if (aksi === "hapus") {
    if (a === b && a === 0) return;
    el.setRangeText("", a === b ? a - 1 : a, b, "end");
    return kabari(el);
  }
  let teks = aksi === "enter" ? "\n" : btn.dataset.v;
  if (aksi === "enter" && el.tagName !== "TEXTAREA") return;
  if (st.tab === "ABC" && /^[a-z]$/i.test(teks)) {
    teks = st.shift ? teks.toUpperCase() : teks.toLowerCase();
    if (st.shift) {
      st.shift = false;
      sinkronTanda();
    }
  }
  el.setRangeText(ubahMode(teks), a, b, "end");
  kabari(el);
}

/** Saat papan terbuka, keyboard bawaan HP tidak dimunculkan (inputmode none), seperti GeoGebra. */
function aturInputmode() {
  document.querySelectorAll("#screen-lkpd textarea[data-f], #screen-lkpd input[data-f]").forEach((el) => {
    if (st.buka) el.setAttribute("inputmode", "none");
    else el.removeAttribute("inputmode");
  });
}

function ukurTinggi() {
  const h = st.buka ? $("#papan-rumus").offsetHeight : 0;
  document.documentElement.style.setProperty("--papan-h", h + "px");
  $("#screen-lkpd").classList.toggle("papan-buka", st.buka);
}

export function bukaPapan() {
  st.buka = true;
  $("#papan-rumus").hidden = false;
  $("#btn-papan").setAttribute("aria-expanded", "true");
  $("#btn-papan").hidden = true;
  aturInputmode();
  render();
  ukurTinggi();
  if (targetSah()) {
    // fokus ulang agar keyboard HP tertutup dan papan yang dipakai
    const el = st.target;
    el.blur();
    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      tampakkan(el);
    });
  }
}

export function tutupPapan(keyboardHp = false) {
  if (!st.buka) return;
  st.buka = false;
  st.mode = null;
  $("#papan-rumus").hidden = true;
  $("#btn-papan").setAttribute("aria-expanded", "false");
  aturInputmode();
  ukurTinggi();
  syncTombol();
  if (keyboardHp && targetSah()) {
    st.target.blur();
    requestAnimationFrame(() => st.target.focus());
  }
}

/** Kotak yang sedang ditulis jangan tertutup papan. */
function tampakkan(el) {
  if (!st.buka) return;
  const r = el.getBoundingClientRect();
  const batas = window.innerHeight - $("#papan-rumus").offsetHeight - 12;
  if (r.bottom > batas) window.scrollBy(0, r.bottom - batas);
  else if (r.top < 8) window.scrollBy(0, r.top - 8);
}

/** Tombol Papan Rumus tampil hanya saat LKPD masih bisa diisi. */
export function syncTombol() {
  $("#btn-papan").hidden = st.buka || !st.aktif();
  if (st.buka && !st.aktif()) tutupPapan();
}

/** aktif(): apakah LKPD sedang bisa diisi (bukan terkunci). */
export function initPapanRumus({ aktif }) {
  st.aktif = aktif;
  const papan = $("#papan-rumus");
  // pointerdown dicegah agar kotak jawaban tidak kehilangan fokus (kursor tetap di tempatnya)
  papan.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) e.preventDefault();
  });
  papan.addEventListener("click", (e) => {
    const key = e.target.closest(".papan-key");
    if (key) return tekan(key);
    const tab = e.target.closest(".papan-tab[data-tab]");
    if (tab) {
      st.tab = tab.dataset.tab;
      st.shift = false;
      render();
      return ukurTinggi();
    }
    if (e.target.closest("#papan-hp")) return tutupPapan(true);
    if (e.target.closest("#papan-tutup")) return tutupPapan();
  });
  $("#btn-papan").addEventListener("click", bukaPapan);
  document.addEventListener("focusin", (e) => {
    if (!isianTeks(e.target) || !e.target.closest("#screen-lkpd")) return;
    st.target = e.target;
    if (st.buka) {
      sinkronTanda();
      tampakkan(e.target);
    }
  });
  // ketikan dari keyboard laptop atau HP ikut mode pangkat/indeks
  document.addEventListener("beforeinput", (e) => {
    const el = e.target;
    if (!st.buka || !st.mode || !isianTeks(el) || e.inputType !== "insertText" || !e.data) return;
    const conv = ubahMode(e.data);
    if (conv === e.data) return;
    e.preventDefault();
    el.setRangeText(conv, el.selectionStart, el.selectionEnd, "end");
    kabari(el);
  });
  window.addEventListener("resize", () => st.buka && ukurTinggi());
}
