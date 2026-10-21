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

/** Menu utama: Nama Siswa dan Kelas wajib diisi sebelum mulai. */
export function initMenu(onStart) {
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go]");
    if (el && !el.disabled) show(el.dataset.go);
  });

  $("#menu-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const nameInput = $("#student-name");
    const classInput = $("#student-class");
    const nama = nameInput.value.trim();
    const kelas = classInput.value.trim();
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
  return `<span class="pb-win">${t.win}</span><span class="pb-sep" aria-hidden="true">|</span><span class="pb-lose">${t.lose}</span>`;
}

export const CONTROLS_LAPTOP = [
  "W A S D: bergerak",
  "Gerakkan mouse: putar kamera (klik area game untuk mengunci kursor)",
  "Klik kiri: tebas (combo 3 tebasan)",
  "Space: lompat",
  "C atau Ctrl: jongkok",
  "Shift: menghindar (berguling)",
  "Esc: jeda",
];
export const CONTROLS_HP = [
  "Joystick kiri: bergerak",
  "Geser di sisi kanan layar: putar kamera",
  "Tombol Tebas, Lompat, Jongkok, Hindar di kanan bawah",
  "Tombol jeda di kanan atas",
];

export function controlsHtml(touch) {
  const list = touch ? CONTROLS_HP : CONTROLS_LAPTOP;
  return `<h3>Kontrol ${touch ? "HP" : "Laptop"}</h3><ul>${list.map((l) => `<li>${l}</li>`).join("")}</ul>` +
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
    $("#hud-prob").innerHTML = `<span class="pb-win">${t.win}</span><span class="pb-lose">${t.lose}</span>`;
  }
  if (records) {
    $("#mini-table").innerHTML = records
      .map((r, i) => {
        const [cls, txt] = r.x === 1 ? ["tag-win", "Menang"] : r.x === 0 ? ["tag-lose", "Kalah"] : r.skipped ? ["tag-none", "Tidak dimainkan"] : ["tag-none", "Belum"];
        return `<li><span>Tahap ${i + 1}</span><span class="tag ${cls}">${txt}</span></li>`;
      })
      .join("");
  }
}

let promptTimer = 0;
export function setPrompt(text) {
  const el = $("#prompt");
  clearTimeout(promptTimer);
  if (!text) {
    el.hidden = true;
    return;
  }
  el.textContent = text;
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
export function showDecisive(p) {
  $("#decisive-prob").innerHTML = probBoxHtml(p);
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
  $("#result-line").textContent =
    `Tercatat: Tahap ${stage.id} | ${stage.kondisi} | p = ${b.fmtP(stage.p)} | 1 - p = ${b.fmtP(b.complement(stage.p))} | X = ${record.x}`;
  $("#btn-next").textContent = isLast ? "Lihat Rekap" : "Lanjut ke Tahap Berikutnya";
  $("#btn-stop-result").hidden = isLast;
  showOverlay("#ov-result");
}

// ---------- rekap ----------
export function renderRecap({ student, character, stages, records, closing }) {
  const b = B();
  const summary = b.summarize(records.map((r, i) => ({ p: stages[i].p, x: r.x })));
  const rows = stages
    .map((s, i) => {
      const r = records[i];
      const played = r.x === 0 || r.x === 1;
      const hasil = r.x === 1 ? '<span class="tag tag-win">Menang</span>' : r.x === 0 ? '<span class="tag tag-lose">Kalah</span>' : '<span class="tag tag-none">Tidak dimainkan</span>';
      return `<tr><td>${s.id}</td><td>${escapeHtml(s.kondisi)}</td><td>${b.fmtP(s.p)}</td><td>${b.fmtP(b.complement(s.p))}</td><td>${hasil}</td>` +
        `<td>${played ? r.x : "-"}</td><td>${played ? b.fmtPmf(r.x, s.p) : "-"}</td><td>${b.fmtP(s.p)}</td><td>${b.fmtVar(s.p)}</td></tr>`;
    })
    .join("");
  let calc;
  if (summary.played === 0) {
    calc = `<p><strong>Belum ada percobaan yang dilakukan.</strong></p>`;
  } else {
    const played = records.map((r, i) => ({ r, s: stages[i] })).filter(({ r }) => r.x === 0 || r.x === 1);
    const seq = b.fmtSequence(summary);
    calc = `
      <p>Peluang urutan hasil = ${played.map(({ r, s }) => b.fmtPmf(r.x, s.p)).join(" × ")} = <strong>${seq.decimal}</strong> (${seq.percent}).</p>
      <p>Jumlah menang yang diharapkan = ${played.map(({ s }) => b.fmtP(s.p)).join(" + ")} = <strong>${b.fmtFixed(summary.expectedNum, 2, 1)}</strong>. Nilai harapan jumlah sama dengan jumlah nilai harapannya.</p>`;
  }
  $("#recap").innerHTML = `
    <header class="recap-head">
      <h2 id="recap-title">Rekap Adventure Bernoulli</h2>
      <p class="muted">Universitas Sriwijaya · by Kelompok 17</p>
      <p>Nama Siswa: <strong>${escapeHtml(student.nama)}</strong> · Kelas: <strong>${escapeHtml(student.kelas)}</strong></p>
      <p class="muted small">Karakter: ${escapeHtml(character)} · ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
    </header>
    ${closing ? `<div class="resi-line"><div class="portrait" aria-hidden="true"><i></i><i></i></div><p>${escapeHtml(closing)}</p></div>` : ""}
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Tahap</th><th>Kondisi</th><th>p</th><th>1 - p</th><th>Hasil</th><th>X</th><th>P(hasil)</th><th>E(X)</th><th>Var(X)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="muted small">P(X = x) = p^x (1 - p)^(1 - x); E(X) = p; Var(X) = p(1 - p).</p>
    <p>Tahap dimainkan: <strong>${summary.played}</strong> · Menang: <strong>${summary.wins}</strong> · Kalah: <strong>${summary.losses}</strong></p>
    ${calc}
    <p class="note">Jumlah kemenangan ini bukan distribusi binomial karena peluang tiap tahap berbeda.</p>
    <div class="row-buttons" id="recap-buttons">
      <button type="button" class="btn" id="btn-menu">Kembali ke Menu Utama</button>
    </div>`;
  showOverlay("#ov-recap");
  return summary;
}
