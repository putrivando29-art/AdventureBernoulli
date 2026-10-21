// Quick Time Event pada Serangan Penentu. Menekan atau tidak hanya memilih animasi;
// hasil menang/kalah TETAP ditentukan satu undian decisiveRoll dengan p dari config.
import { $ } from "./ui.js";

/**
 * Tampilkan satu prompt QTE selama `ms` milidetik (waktu nyata).
 * opts: { label, keyText, codes: ["Space"], mouse: boolean }. Mengembalikan Promise<boolean> (ditekan atau tidak).
 */
export function runQte({ label, keyText, codes = [], mouse = false, ms = 1600 }) {
  const box = $("#qte");
  const btn = $("#qte-btn");
  const ring = $("#qte-ring");
  $("#qte-label").textContent = label;
  $("#qte-key").textContent = keyText;
  $("#qte-feedback").textContent = "";
  box.className = "qte";
  box.hidden = false;
  const C = 2 * Math.PI * 46;
  ring.style.strokeDasharray = String(C);
  return new Promise((resolve) => {
    let done = false;
    const t0 = performance.now();
    const finish = (pressed) => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("mousedown", onMouse, true);
      btn.removeEventListener("pointerdown", onBtn);
      box.className = "qte " + (pressed ? "is-pressed" : "is-missed");
      setTimeout(() => {
        box.hidden = true;
        resolve(pressed);
      }, 350);
    };
    const onKey = (e) => {
      if (codes.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        finish(true);
      }
    };
    const onMouse = (e) => {
      if (mouse && e.button === 0) finish(true);
    };
    const onBtn = (e) => {
      e.preventDefault();
      finish(true);
    };
    let raf = 0;
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      ring.style.strokeDashoffset = String(C * k);
      if (k >= 1) finish(false);
      else raf = requestAnimationFrame(tick);
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("mousedown", onMouse, true);
    btn.addEventListener("pointerdown", onBtn);
    tick();
  });
}

export function qteFeedback(text) {
  $("#qte-feedback").textContent = text;
}
