// Antarmuka HTML: menu utama, overlay game, HUD, dialog Resi Bayang, konfirmasi berhenti, dan rekap.

export const $ = (sel) => document.querySelector(sel);
const B = () => window.Bernoulli;

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ---------- layar menu ----------
export function show(screen) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("is-active", el.id === "screen-" + screen));
  window.scrollTo(0, 0);
  const heading = document.querySelector(`#screen-${screen} h1, #screen-${screen} h2`);
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

export function showOffline() {
  $("#offline-message").hidden = false;
  $("#btn-start").disabled = true;
}

// Font bawaan jsPDF hanya bisa mencetak huruf Latin dasar dan Latin-1 (plus tanda kutip miring).
const PRINTABLE = /[ -~ -ÿ‘’“”]/;

/** Huruf beraksen di luar Latin-1 diganti huruf dasarnya (Ğ jadi G); emoji dan simbol lain dihapus. */
export function printableText(s) {
  let out = "";
  for (const ch of s) {
    if (PRINTABLE.test(ch)) out += ch;
    else {
      const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "");
      if (base && [...base].every((c) => PRINTABLE.test(c))) out += base;
    }
  }
  return out;
}

/** Tombol Mulai aktif hanya jika Nama dan Kelas terisi (bukan hanya spasi) dan library sudah termuat. */
export function syncStart() {
  const filled = !!($("#student-name").value.trim() && $("#student-class").value.trim());
  $("#btn-start").disabled = !filled || !$("#offline-message").hidden;
  $("#start-hint").hidden = filled;
}

/** Menu utama: Nama Siswa dan Kelas wajib diisi sebelum mulai. */
export function initMenu(onStart) {
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go]");
    if (el && !el.disabled) show(el.dataset.go);
  });

  const nameInput = $("#student-name");
  const classInput = $("#student-class");
  [nameInput, classInput].forEach((input) =>
    input.addEventListener("input", () => {
      const clean = printableText(input.value);
      if (clean !== input.value) {
        input.value = clean;
        $("#menu-msg").textContent = "Emoji dan simbol khusus dihapus karena tidak bisa dicetak di PDF.";
      } else $("#menu-msg").textContent = "";
      syncStart();
    })
  );
  syncStart();

  $("#menu-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const nama = nameInput.value.trim().replace(/\s+/g, " ");
    const kelas = classInput.value.trim().replace(/\s+/g, " ");
    nameInput.setAttribute("aria-invalid", String(!nama));
    classInput.setAttribute("aria-invalid", String(!kelas));
    const msg = $("#menu-msg");
    if (!nama || !kelas) {
      msg.textContent = !nama && !kelas ? "Nama Siswa dan Kelas wajib diisi." : !nama ? "Nama Siswa wajib diisi." : "Kelas wajib diisi.";
      (!nama ? nameInput : classInput).focus();
      return;
    }
    msg.textContent = "";
    onStart({ nama, kelas });
  });
}

// ---------- teks peluang ----------
/** "Peluang menang: 60% (3/5 = 0,6)" dan "Peluang kalah: 40% (2/5 = 0,4)". */
export function probParts(p) {
  const b = B();
  const q = b.complement(p);
  return {
    win: `Peluang menang: ${b.fmtPercent(p)} (${b.fraction(p)} = ${b.fmtP(p)})`,
    lose: `Peluang kalah: ${b.fmtPercent(q)} (${b.fraction(q)} = ${b.fmtP(q)})`,
  };
}

export function probBoxHtml(p) {
  const t = probParts(p);
  // persen dibungkus <b> agar bisa ditonjolkan; isi teks sama dengan probParts
  const pct = (s) => s.replace(/(\d+(?:,\d+)?%)/, '<b class="pb-pct">$1</b>').replace(/(\(.*\))/, '<span class="pb-frac">$1</span>');
  return `<span class="pb-win">${pct(t.win)}</span><span class="pb-sep" aria-hidden="true">|</span><span class="pb-lose">${pct(t.lose)}</span>`;
}

/** Satu baris keterangan bahwa peluang bukan jaminan. */
export function probHint(p) {
  return `Peluang bukan jaminan: dari 100 pertarungan seperti ini, kira-kira ${p} berakhir menang.`;
}

export const CONTROLS_LAPTOP = [
  "W A S D: bergerak",
  "Gerakkan mouse: putar kamera (klik area game untuk mengunci kursor)",
  "Klik kiri: tebas (combo 3 tebasan)",
  "Space: lompat",
  "C atau Ctrl: jongkok",
  "Shift: menghindar (berguling)",
  "Q: pakai sihir dari gulungan (Bola Api atau Petir)",
  "Esc: jeda",
];
export const CONTROLS_HP = [
  "Joystick kiri: bergerak",
  "Geser di sisi kanan layar: putar kamera",
  "Tombol Tebas, Lompat, Jongkok, Hindar, Sihir di kanan bawah",
  "Tombol jeda di kanan atas",
];

const TIPS = [
  "Ramuan Darah (merah): tambah HP. Ramuan Serangan (oranye): tebasan 2 kali lebih kuat selama 15 detik. Gulungan sihir (Bola Api atau Petir): ambil, lalu pakai. Sentuh benda untuk mengambil.",
  "Serangan Penentu terjadi saat arca sekarat (HP 20%) atau saat kamu sekarat (HP 1). Peluangnya sama: p tahap itu.",
  "Tombol yang muncul di Serangan Penentu hanya memilih gaya serangan, tidak mengubah peluang menang.",
];

export function controlsHtml(touch) {
  const list = touch ? CONTROLS_HP : CONTROLS_LAPTOP;
  return `<h3>Kontrol ${touch ? "HP" : "Laptop"}</h3><ul>${list.map((l) => `<li>${l}</li>`).join("")}</ul>` +
    `<h3>Tips</h3><ul>${TIPS.map((l) => `<li>${l}</li>`).join("")}</ul>` +
    (touch ? `<p class="muted small">Putar HP ke mode landscape agar lebih nyaman.</p>` : "");
}

// ---------- overlay game ----------
const OVERLAYS = ["#ov-char", "#ov-intro", "#ov-pause", "#ov-result", "#ov-recap"];

export function showOverlay(id) {
  OVERLAYS.forEach((sel) => ($(sel).hidden = sel !== id));
  if (id) {
    const first = $(id).querySelector("button.btn-primary, button");
    first?.focus({ preventScroll: true });
  }
}

export function setHudVisible(on) {
  $("#hud").hidden = !on;
}

export function updateHud({ stageName, playerHp, bossHp, p, records }) {
  if (stageName !== undefined) $("#hud-stage").textContent = stageName;
  if (playerHp !== undefined) {
    $("#hp-player").style.width = playerHp + "%";
    $("#hp-player-num").textContent = Math.round(playerHp);
  }
  if (bossHp !== undefined) $("#hp-boss").style.width = bossHp + "%";
  if (p !== undefined) {
    const t = probParts(p);
    const b = B();
    const q = b.complement(p);
    $("#hud-prob").innerHTML =
      `<span class="pb-win">Menang ${b.fmtPercent(p)} (${b.fraction(p)} = ${b.fmtP(p)})</span>` +
      `<span class="pb-lose">Kalah ${b.fmtPercent(q)} (${b.fraction(q)} = ${b.fmtP(q)})</span>`;
  }
  if (records) {
    $("#mini-table").innerHTML = records
      .map((r, i) => {
        const [cls, txt] = r.x === 1 ? ["tag-win", "Menang"] : r.x === 0 ? ["tag-lose", "Kalah"] : r.skipped ? ["tag-none", "Tidak dimainkan"] : ["tag-none", "Belum"];
        return `<li><span><span aria-hidden="true">T${i + 1}</span><span class="sr-only">Tahap ${i + 1}</span></span><span class="tag ${cls}">${txt}</span></li>`;
      })
      .join("");
  }
}

let promptTimer = 0;
export function setPrompt(text, kind = "warn") {
  const el = $("#prompt");
  clearTimeout(promptTimer);
  if (!text) {
    el.hidden = true;
    return;
  }
  el.textContent = text;
  el.className = "prompt prompt-" + kind;
  el.hidden = false;
  promptTimer = setTimeout(() => (el.hidden = true), 2500);
}

export function setLockHint(on) {
  $("#lock-hint").hidden = !on;
}

let resiTimer = 0;
/** Kotak dialog Resi Bayang di bawah tengah. ms = 0 berarti tetap tampil sampai disembunyikan. */
export function resiSay(text, ms = 0) {
  const box = $("#resi-box");
  clearTimeout(resiTimer);
  if (!text) {
    box.hidden = true;
    return;
  }
  $("#resi-text").textContent = text;
  box.hidden = false;
  if (ms) resiTimer = setTimeout(() => (box.hidden = true), ms);
}

/** Konfirmasi berhenti. Mengembalikan Promise<boolean>. */
export function confirmStop() {
  const dlg = $("#dlg-stop");
  return new Promise((resolve) => {
    dlg.returnValue = "";
    dlg.addEventListener("close", () => resolve(dlg.returnValue === "ok"), { once: true });
    dlg.showModal();
    dlg.querySelector('button[value="cancel"]').focus();
  });
}

// ---------- Serangan Penentu ----------
export function showDecisive(p, sub = "") {
  $("#decisive-prob").innerHTML = probBoxHtml(p);
  $("#decisive-sub").textContent = sub;
  const title = $("#decisive-title");
  title.classList.remove("slam");
  void title.offsetWidth; // ulangi animasi judul
  title.classList.add("slam");
  $("#decisive-result").hidden = true;
  $("#decisive-u").hidden = true;
  $("#ov-decisive").hidden = false;
  $("#ov-decisive").className = "decisive";
}

export function showDecisiveResult(x, U, p) {
  const r = $("#decisive-result");
  r.textContent = x === 1 ? "MENANG (X = 1)" : "KALAH (X = 0)";
  r.hidden = false;
  $("#ov-decisive").className = "decisive " + (x === 1 ? "is-win" : "is-lose");
  const u = $("#decisive-u");
  u.textContent = `Bilangan acak U = ${B().fmtU(U)} ${x === 1 ? "<" : "≥"} p = ${B().fmtP(p)}`;
  u.hidden = false;
}

export function hideDecisive() {
  $("#ov-decisive").hidden = true;
}

// ---------- hasil tahap ----------
export function showStageResult(stage, record, isLast) {
  const b = B();
  $("#result-eyebrow").textContent = stage.nama;
  const t = $("#result-title");
  t.textContent = record.x === 1 ? "MENANG (X = 1)" : "KALAH (X = 0)";
  t.className = record.x === 1 ? "txt-win" : "txt-lose";
  const trig = record.trigger === "player" ? "kamu sekarat" : "arca sekarat";
  $("#result-line").textContent =
    `Tercatat: Tahap ${stage.id} · ${stage.kondisi} · p = ${b.fmtP(stage.p)} · 1 - p = ${b.fmtP(b.complement(stage.p))} · X = ${record.x}`;
  $("#result-trig").textContent = `Serangan Penentu dipicu saat ${trig}; peluangnya tetap p.`;
  $("#btn-next").textContent = isLast ? "Lihat Rekap" : "Lanjut ke Tahap Berikutnya";
  $("#btn-stop-result").hidden = isLast;
  showOverlay("#ov-result");
}

// ---------- rekap ----------
export const RECAP_INTRO = "Berikut catatan pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa.";

/** Rekap ringkas: hanya hasil menang dan kalah. Perhitungan peluang dikerjakan siswa di LKPD. */
export function renderRecap({ student, stages, records, closing, date, latihan }) {
  const b = B();
  const summary = b.summarize(records.map((r, i) => ({ p: stages[i].p, x: r.x })));
  const rows = stages
    .map((s, i) => {
      const r = records[i];
      const hasil = r.x === 1 ? '<span class="tag tag-win">Menang</span>' : r.x === 0 ? '<span class="tag tag-lose">Kalah</span>' : '<span class="tag tag-none">Tidak dimainkan</span>';
      return `<tr><td>${s.id}</td><td>${escapeHtml(s.kondisi)}</td><td>${b.fmtP(s.p)}</td><td>${hasil}</td></tr>`;
    })
    .join("");
  $("#recap").innerHTML = `
    <header class="recap-head">
      <h2 id="recap-title">Rekap Adventure Bernoulli</h2>
      <p class="muted">Universitas Sriwijaya · by Kelompok 17</p>
      <p>${RECAP_INTRO}</p>
      <p>Nama Siswa: <strong>${escapeHtml(student.nama)}</strong> · Kelas: <strong>${escapeHtml(student.kelas)}</strong> · ${escapeHtml(date)}</p>
      ${latihan ? '<p class="latihan-note">Mode latihan: peluang diubah lewat Setting Peluang, jadi hasil ini tidak disimpan dan tidak dipakai LKPD.</p>' : ""}
    </header>
    ${closing ? `<div class="resi-line"><div class="portrait" aria-hidden="true"><i></i><i></i></div><p>${escapeHtml(closing)}</p></div>` : ""}
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Tahap</th><th>Kondisi</th><th>p</th><th>Hasil</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${summary.played === 0
      ? "<p><strong>Belum ada percobaan yang dilakukan.</strong></p>"
      : `<p>Tahap dimainkan: <strong>${summary.played}</strong> · Menang: <strong>${summary.wins}</strong> · Kalah: <strong>${summary.losses}</strong> · Tidak dimainkan: <strong>${summary.notPlayed}</strong></p>`}
    <p id="save-msg" class="form-msg save-msg" role="status"></p>
    <button type="button" class="btn" id="btn-save-retry" hidden>Simpan Ulang</button>
    <p id="pdf-msg" class="form-msg" role="status"></p>
    <div class="row-buttons" id="recap-buttons">
      <button type="button" class="btn btn-primary btn-lg" id="btn-pdf">Unduh PDF Rekap</button>
      <button type="button" class="btn" id="btn-pdf-open">Buka PDF di Tab Baru</button>
      <button type="button" class="btn btn-primary" id="btn-recap-lkpd" hidden>Kerjakan LKPD</button>
      <button type="button" class="btn" id="btn-menu">Kembali ke Menu Utama</button>
    </div>`;
  showOverlay("#ov-recap");
  return summary;
}

// ---------- ikon ----------
// Gong (suara) dan bingkai sudut (layar penuh), digambar garis emas lewat CSS .icon
const GONG = '<path d="M3 3h18M8 3v4M16 3v4"/><circle cx="12" cy="14" r="7"/><circle cx="12" cy="14" r="2.2"/>';
export function soundIcon(muted) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${GONG}${muted ? '<path d="M4 21L20 7"/>' : ""}</svg>`;
}

// ---------- layar penuh ----------
export function fullscreenSupported() {
  return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
}

const isFullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);

export function enterFullscreen() {
  if (!fullscreenSupported() || isFullscreen()) return;
  const el = document.documentElement;
  try {
    const r = (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: "hide" });
    if (r && r.catch) r.catch(() => {});
  } catch (e) {
    /* ditolak browser: game tetap jalan */
  }
}

export function toggleFullscreen() {
  if (isFullscreen()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  else enterFullscreen();
}

/** Tombol [data-fullscreen] di menu, menu jeda, dan pojok layar game. */
export function initFullscreen(isTouch) {
  const btns = document.querySelectorAll("[data-fullscreen]");
  if (!fullscreenSupported()) {
    btns.forEach((b) => (b.hidden = true));
    if (isTouch) $("#fs-note").hidden = false;
    return;
  }
  btns.forEach((b) => b.addEventListener("click", toggleFullscreen));
  const sync = () =>
    btns.forEach((b) => {
      if (b.classList.contains("fs-corner")) b.setAttribute("aria-label", isFullscreen() ? "Keluar layar penuh" : "Layar penuh");
      else b.textContent = isFullscreen() ? "Keluar Layar Penuh" : "Layar Penuh";
    });
  document.addEventListener("fullscreenchange", sync);
  document.addEventListener("webkitfullscreenchange", sync);
}

// ---------- pilih karakter ----------
const hex = (n) => "#" + n.toString(16).padStart(6, "0");

export function renderCharOptions(options, look) {
  $("#char-options").innerHTML = Object.entries(options)
    .map(([key, opt]) => {
      const items = Object.entries(opt.items)
        .map(([val, [label, color]]) => {
          const sw = color !== undefined ? `<i class="sw" style="background:${hex(color)}"></i>` : "";
          return `<button type="button" class="btn chip-btn" data-value="${val}" aria-pressed="${look[key] === val}">${sw}${label}</button>`;
        })
        .join("");
      return `<fieldset class="choice"><legend>${opt.label}</legend><div class="choice-row" data-choice="${key}">${items}</div></fieldset>`;
    })
    .join("");
}

/** Deskripsi kostum untuk rekap, misalnya "Perempuan, kulit sawo matang, rambut panjang hitam, baju ungu". */
export function lookLabel(options, look) {
  const l = (k) => options[k].items[look[k]][0].toLowerCase();
  const parts = [
    options.gender.items[look.gender][0],
    "kulit " + l("skin"),
    `rambut ${l("hairStyle")} ${l("hair")}`,
    "baju " + l("shirt"),
    "celana " + l("pants"),
  ];
  if (look.accessory !== "none") parts.push(l("accessory"));
  return parts.join(", ");
}

export function lookColors(options, look) {
  return {
    skin: hex(options.skin.items[look.skin][1]),
    hair: hex(options.hair.items[look.hair][1]),
    shirt: hex(options.shirt.items[look.shirt][1]),
  };
}

export function setBuffText(text) {
  const el = $("#hud-buff");
  el.hidden = !text;
  if (text) el.textContent = text;
}

export function setSpellText(text) {
  const el = $("#hud-spell");
  el.hidden = !text;
  if (text) el.textContent = text;
}

export function setLetterbox(on) {
  $("#letterbox").classList.toggle("is-on", on);
}
