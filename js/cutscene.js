// Percakapan singkat gaya visual novel: kotak dialog dengan potret, nama, dan teks yang diketik.
// Ketuk/klik atau Enter untuk lanjut; tombol Lewati untuk melewati semua.
import { $ } from "./ui.js";

const NAMES = { resi: "Resi Bayang", arca: "Arca Durgaraksa" };

/**
 * lines: [{ who: "resi" | "arca" | "player", text }]. Teks "{nama}" diganti nama siswa.
 * opts: { playerName, playerColors: { skin, hair, shirt }, onLine(line) }
 */
export function playCutscene(lines, opts) {
  const box = $("#vn");
  const portrait = $("#vn-portrait");
  const nameEl = $("#vn-name");
  const textEl = $("#vn-text");
  return new Promise((resolve) => {
    let i = -1;
    let typing = null;
    let full = "";
    const finishTyping = () => {
      clearInterval(typing);
      typing = null;
      textEl.textContent = full;
    };
    const end = () => {
      finishTyping();
      box.hidden = true;
      box.removeEventListener("pointerdown", onTap);
      window.removeEventListener("keydown", onKey, true);
      $("#vn-skip").removeEventListener("click", onSkip);
      resolve();
    };
    const next = () => {
      if (typing) return finishTyping();
      i++;
      if (i >= lines.length) return end();
      const line = lines[i];
      const who = line.who;
      portrait.className = "vn-portrait pt-" + who;
      if (who === "player" && opts.playerColors) {
        portrait.style.setProperty("--skin", opts.playerColors.skin);
        portrait.style.setProperty("--hair", opts.playerColors.hair);
        portrait.style.setProperty("--shirt", opts.playerColors.shirt);
      }
      portrait.innerHTML = "<i></i><i></i>";
      nameEl.textContent = who === "player" ? opts.playerName : NAMES[who];
      nameEl.className = "vn-name name-" + who;
      full = line.text.replace("{nama}", opts.playerName);
      textEl.textContent = "";
      let n = 0;
      typing = setInterval(() => {
        n++;
        textEl.textContent = full.slice(0, n);
        if (n >= full.length) finishTyping();
      }, 22);
      opts.onLine?.(line);
    };
    const onTap = (e) => {
      if (e.target.closest("#vn-skip")) return;
      next();
    };
    const onKey = (e) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
        next();
      } else if (e.code === "Escape") {
        e.stopPropagation();
        end();
      }
    };
    const onSkip = () => end();
    box.hidden = false;
    box.addEventListener("pointerdown", onTap);
    window.addEventListener("keydown", onKey, true);
    $("#vn-skip").addEventListener("click", onSkip);
    next();
  });
}
