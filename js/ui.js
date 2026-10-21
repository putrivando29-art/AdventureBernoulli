// Antarmuka HTML: pindah layar dan menu utama.

const $ = (sel) => document.querySelector(sel);

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

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
