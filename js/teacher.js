// Layar Setting Peluang: mencoba-coba p tiap tahap sebagai latihan (hanya di tab ini) dan mengembalikan bawaan.
import { CONFIG } from "./config.js";
import { loadPs, savePs, clearPs, defaultPs, parseP, validatePs } from "./settings.js";
import { $, probParts, escapeHtml } from "./ui.js";
// Peluang bawaan dirahasiakan sampai rekap (saran dosen): menu tidak menampilkannya dan form latihan dimulai kosong.

const B = () => window.Bernoulli;

export function renderPSource() {
  const { ps } = loadPs();
  // p bukan bawaan: permainan hanya latihan, tidak disimpan ke akun dan tidak dipakai LKM
  $("#latihan-note").hidden = ps.join() === defaultPs().join();
}

function renderRows(ps) {
  $("#teacher-rows").innerHTML = CONFIG.stages
    .map(
      (s, i) => `<div class="teacher-row">
        <label class="field" for="tp-${i}"><span>${escapeHtml(s.nama)}</span>
          <input id="tp-${i}" type="text" inputmode="decimal" value="${ps ? B().fmtP(ps[i]) : ""}" placeholder="contoh 0,45" autocomplete="off"></label>
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
    el.innerHTML = $("#tp-" + i).value.trim() ? `<span class="txt-lose">Isi angka di antara 0 dan 1, contoh 0,45</span>` : `<span class="muted">Isi angka di antara 0 dan 1, contoh 0,45</span>`;
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

export function initTeacher() {
  renderPSource();
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-go="teacher"]')) {
      const { ps, source } = loadPs();
      renderRows(source === "guru" ? ps : null);
      message("", true);
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
    message(
      savePs(ps)
        ? "Dipakai untuk latihan di tab ini. Hasil latihan tidak disimpan ke akun dan tidak dipakai LKM. Tekan Kembalikan Bawaan untuk bermain biasa."
        : "Browser menolak penyimpanan peluang latihan.",
      true
    );
    renderPSource();
  });
  $("#btn-latihan-off").addEventListener("click", () => {
    clearPs();
    renderPSource();
  });
  $("#btn-teacher-reset").addEventListener("click", () => {
    clearPs();
    renderRows(null);
    renderPSource();
    message("Peluang dikembalikan ke nilai bawaan.", true);
  });
}
