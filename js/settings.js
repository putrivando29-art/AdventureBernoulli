// Setting Guru: nilai p tiap tahap. Sumber nilai (urutan prioritas):
// 1) tautan dari guru (?p=50-60-70-40-30), 2) disimpan di browser ini, 3) bawaan js/config.js.
// Nilai dibaca SEKALI saat petualangan dimulai dan tidak berubah selama sesi.
import { CONFIG } from "./config.js";

const KEY = "ab.teacherP";
const B = () => window.Bernoulli;

export const defaultPs = () => CONFIG.stages.map((s) => s.p);

/** Teks "0,45", "0.45", atau ",45" menjadi 45 (perseratus); null jika tidak valid. */
export function parseP(text) {
  const t = String(text).trim().replace(",", ".");
  if (!/^0?\.\d{1,2}$/.test(t)) return null;
  const p = Math.round(Number(t) * 100);
  return B().isValidP(p) ? p : null;
}

/** Pesan kesalahan, atau null jika semua p valid dan tidak ada yang sama. */
export function validatePs(ps) {
  if (!Array.isArray(ps) || ps.length !== CONFIG.stages.length) return "Jumlah tahap tidak sesuai.";
  const bad = ps.findIndex((p) => !B().isValidP(p));
  if (bad >= 0) return `Peluang tahap ${bad + 1} harus di antara 0 dan 1 (contoh 0,45), tidak boleh 0 atau 1.`;
  for (let i = 0; i < ps.length; i++) {
    const j = ps.indexOf(ps[i]);
    if (j !== i) return `Peluang tahap ${j + 1} dan tahap ${i + 1} sama (${B().fmtP(ps[i])}). Setiap tahap harus punya peluang berbeda.`;
  }
  return null;
}

function readUrl() {
  const raw = new URLSearchParams(location.search).get("p");
  if (!raw) return null;
  const ps = raw.split("-").map(Number);
  return validatePs(ps) ? null : ps;
}

function readStore() {
  try {
    const ps = JSON.parse(localStorage.getItem(KEY));
    return ps && !validatePs(ps) ? ps : null;
  } catch (e) {
    return null;
  }
}

/** { ps, source } dengan source "tautan" | "guru" | "bawaan". */
export function loadPs() {
  const fromUrl = readUrl();
  if (fromUrl) return { ps: fromUrl, source: "tautan" };
  const stored = readStore();
  if (stored) return { ps: stored, source: "guru" };
  return { ps: defaultPs(), source: "bawaan" };
}

export function savePs(ps) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ps));
    return true;
  } catch (e) {
    return false;
  }
}

export function clearPs() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    /* abaikan */
  }
}

/** Tautan untuk dibagikan ke siswa agar semua memakai p yang sama. */
export function shareUrl(ps) {
  const u = new URL(location.href);
  u.search = "";
  u.hash = "";
  u.searchParams.set("p", ps.join("-"));
  return u.toString();
}

export const SOURCE_LABEL = {
  bawaan: "nilai bawaan game",
  guru: "diatur di Setting Guru",
  tautan: "diatur guru lewat tautan",
};
