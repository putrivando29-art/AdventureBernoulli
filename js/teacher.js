// Layar Setting Guru: mengisi p tiap tahap, menyimpan, mengembalikan bawaan, dan membuat tautan untuk siswa.
import { CONFIG } from "./config.js";
import { loadPs, savePs, clearPs, defaultPs, parseP, validatePs, shareUrl, SOURCE_LABEL } from "./settings.js";
import { $, probParts, escapeHtml } from "./ui.js";

const B = () => window.Bernoulli;

export function renderPSource() {
  const { ps, source } = loadPs();
  $("#p-source").textContent = `Peluang menang tiap tahap: ${ps.map((p) => B().fmtP(p)).join(" · ")} (${SOURCE_LABEL[source]})`;
}

function renderRows(ps) {
  $("#teacher-rows").innerHTML = CONFIG.stages
    .map(
      (s, i) => `<div class="teacher-row">
        <label class="field" for="tp-${i}"><span>${escapeHtml(s.nama)}</span>
          <input id="tp-${i}" type="text" inputmode="decimal" value="${B().fmtP(ps[i])}" autocomplete="off"></label>
        <p class="teacher-preview" id="tpv-${i}"></p>
      </div>`
    )
    .join("");
  CONFIG.stages.forEach((_, i) => preview(i));
}

function preview(i) {
  const p = parseP($("#tp-" + i).value);
  const el = $("#tpv-" + i);
  if (p === null) {
    el.innerHTML = `<span class="txt-lose">Isi angka di antara 0 dan 1, contoh 0,45</span>`;
    return;
  }
  const t = probParts(p);
  el.innerHTML = `<span class="pb-win">${t.win}</span><br><span class="pb-lose">${t.lose}</span>`;
}

function readForm() {
  return CONFIG.stages.map((_, i) => parseP($("#tp-" + i).value));
}

function message(text, ok) {
  const m = $("#teacher-msg");
  m.textContent = text;
  m.className = "form-msg " + (ok ? "txt-win" : "");
}

function dropUrlParam() {
  // Nilai di tautan lebih diutamakan; hapus dari alamat agar nilai yang baru disimpan yang dipakai.
  const u = new URL(location.href);
  if (u.searchParams.has("p")) {
    u.searchParams.delete("p");
    history.replaceState(null, "", u.toString());
  }
}

export function initTeacher() {
  renderPSource();
  // Tautan siswa (?p=...): Setting Guru disembunyikan agar siswa langsung bermain dengan peluang dari guru.
  if (loadPs().source === "tautan") document.querySelectorAll('[data-go="teacher"]').forEach((b) => (b.hidden = true));
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-go="teacher"]')) {
      renderRows(loadPs().ps);
      message("", true);
      $("#teacher-link").hidden = true;
    }
  });
  $("#teacher-rows").addEventListener("input", (e) => {
    const i = Number(e.target.id.replace("tp-", ""));
    if (!Number.isNaN(i)) preview(i);
  });
  $("#teacher-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const ps = readForm();
    const bad = ps.findIndex((p) => p === null);
    if (bad >= 0) {
      message(`Peluang tahap ${bad + 1} tidak valid. Isi angka di antara 0 dan 1 dengan paling banyak dua desimal, contoh 0,45.`, false);
      $("#tp-" + bad).focus();
      return;
    }
    const err = validatePs(ps);
    if (err) return message(err, false);
    dropUrlParam();
    message(savePs(ps) ? "Tersimpan. Peluang ini dipakai mulai petualangan berikutnya." : "Browser menolak penyimpanan. Gunakan tombol Salin Tautan untuk Siswa.", true);
    renderPSource();
  });
  $("#btn-teacher-reset").addEventListener("click", () => {
    clearPs();
    dropUrlParam();
    renderRows(defaultPs());
    renderPSource();
    message("Peluang dikembalikan ke nilai bawaan.", true);
  });
  $("#btn-teacher-link").addEventListener("click", async () => {
    const ps = readForm();
    const err = ps.some((p) => p === null) ? "Ada peluang yang belum valid." : validatePs(ps);
    if (err) return message(err, false);
    const url = shareUrl(ps);
    const box = $("#teacher-link");
    box.textContent = url;
    box.hidden = false;
    try {
      await navigator.clipboard.writeText(url);
      message("Tautan disalin. Bagikan ke siswa; game akan memakai peluang ini.", true);
    } catch (e2) {
      message("Salin tautan di bawah ini secara manual, lalu bagikan ke siswa.", true);
    }
  });
}
