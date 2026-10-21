// Titik masuk game. Three.js dimuat lewat import map; jika gagal (tidak ada internet)
// pesan yang jelas ditampilkan.
import { initMenu, show, showOffline } from "./ui.js";

const state = { student: null };

async function boot() {
  initMenu((student) => {
    state.student = student;
    document.querySelector("#character-greeting").textContent =
      `Halo, ${student.nama} (${student.kelas}). Layar pilih karakter 3D dibuat pada Fase 2.`;
    show("character");
  });

  try {
    await import("three");
  } catch (err) {
    console.error("Three.js gagal dimuat:", err);
    showOffline();
    return;
  }

  if (new URLSearchParams(location.search).get("test") === "1") {
    const { runBrowserTests } = await import("./browser-tests.js");
    runBrowserTests();
  }
}

boot();
