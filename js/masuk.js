// Kartu menu utama: Masuk atau Daftar dengan email dan kata sandi, lalu menu bermain setelah masuk.
import * as akun from "./akun.js";
import { bukaLkpd } from "./lkpd.js";
import { $, printableText, syncStart } from "./ui.js";

const rapi = (s) => printableText(s).trim().replace(/\s+/g, " ");

function sibuk(btn, on, label) {
  btn.disabled = on;
  btn.textContent = on ? "Mohon tunggu..." : label;
}

function pesan(el, text, ok = false) {
  el.className = "form-msg" + (ok ? " txt-win" : "");
  el.textContent = text;
}

export function initMasuk() {
  const tab = (mode) => {
    const m = mode === "masuk";
    $("#tab-masuk").setAttribute("aria-selected", String(m));
    $("#tab-daftar").setAttribute("aria-selected", String(!m));
    $("#form-masuk").hidden = !m;
    $("#form-daftar").hidden = m;
    (m ? $("#masuk-email") : $("#daftar-email")).focus();
  };
  $("#tab-masuk").addEventListener("click", () => tab("masuk"));
  $("#tab-daftar").addEventListener("click", () => tab("daftar"));

  document.querySelectorAll("[data-show-pass]").forEach((cb) =>
    cb.addEventListener("change", () => cb.dataset.showPass.split(" ").forEach((id) => ($("#" + id).type = cb.checked ? "text" : "password")))
  );

  // nama dan kelas dicetak di PDF: emoji dan simbol khusus dihapus
  ["#daftar-nama", "#daftar-kelas"].forEach((sel) =>
    $(sel).addEventListener("input", (e) => {
      const clean = printableText(e.target.value);
      if (clean !== e.target.value) {
        e.target.value = clean;
        pesan($("#daftar-msg"), "Emoji dan simbol khusus dihapus karena tidak bisa dicetak di PDF.");
      }
    })
  );

  $("#form-masuk").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const msg = $("#masuk-msg");
    const email = $("#masuk-email").value;
    const sandi = $("#masuk-sandi").value;
    if (!email.trim() || !sandi) return pesan(msg, "Email dan kata sandi wajib diisi.");
    sibuk($("#btn-masuk"), true, "Masuk");
    try {
      await akun.masuk(email, sandi);
      pesan(msg, "");
      $("#masuk-sandi").value = "";
    } catch (e) {
      pesan(msg, akun.pesanGalat(e));
    } finally {
      sibuk($("#btn-masuk"), false, "Masuk");
    }
  });

  $("#btn-lupa").addEventListener("click", async () => {
    const msg = $("#masuk-msg");
    const email = $("#masuk-email").value;
    if (!email.trim()) {
      $("#masuk-email").focus();
      return pesan(msg, "Isi email dulu, lalu tekan Lupa kata sandi.");
    }
    const terkirim = "Jika email terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Periksa juga folder spam.";
    try {
      await akun.lupaSandi(email);
      pesan(msg, terkirim, true);
    } catch (e) {
      // email yang tidak terdaftar diberi pesan yang sama agar daftar akun tidak bisa ditebak
      if (e && e.code === "auth/user-not-found") pesan(msg, terkirim, true);
      else pesan(msg, akun.pesanGalat(e));
    }
  });

  $("#form-daftar").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const msg = $("#daftar-msg");
    const email = $("#daftar-email").value;
    const sandi = $("#daftar-sandi").value;
    const nama = rapi($("#daftar-nama").value);
    const kelas = rapi($("#daftar-kelas").value);
    if (!email.trim()) return pesan(msg, "Email wajib diisi.");
    if (sandi.length < 6) return pesan(msg, "Kata sandi minimal 6 karakter.");
    if (sandi !== $("#daftar-sandi2").value) return pesan(msg, "Kata sandi tidak sama.");
    if (!nama || !kelas) return pesan(msg, !nama && !kelas ? "Nama Siswa dan Kelas wajib diisi." : !nama ? "Nama Siswa wajib diisi." : "Kelas wajib diisi.");
    sibuk($("#btn-daftar"), true, "Daftar");
    try {
      await akun.daftar(email, sandi, nama, kelas);
      $("#student-name").value = nama;
      $("#student-class").value = kelas;
      syncStart();
      pesan(msg, "");
      ["#daftar-sandi", "#daftar-sandi2"].forEach((s) => ($(s).value = ""));
    } catch (e) {
      pesan(msg, akun.pesanGalat(e));
    } finally {
      sibuk($("#btn-daftar"), false, "Daftar");
    }
  });

  $("#btn-keluar").addEventListener("click", async () => {
    try {
      await akun.keluar();
    } catch (e) {
      pesan($("#menu-msg"), akun.pesanGalat(e));
    }
  });

  akun.pantauLogin(async (user) => {
    $("#auth-loading").hidden = true;
    $("#auth-panel").hidden = !!user;
    $("#menu-form").hidden = !user;
    if (!user) {
      $("#student-name").value = "";
      $("#student-class").value = "";
      syncStart();
      return;
    }
    $("#akun-email").textContent = user.email;
    try {
      const profil = await akun.bacaProfil();
      if (profil) {
        $("#student-name").value = profil.nama || "";
        $("#student-class").value = profil.kelas || "";
      }
    } catch (e) {
      console.warn("Profil belum bisa dibaca:", e);
    }
    syncStart();
    // datang dari tombol Kerjakan LKPD di rekap
    const url = new URL(location.href);
    if (url.searchParams.has("lkpd")) {
      url.searchParams.delete("lkpd");
      history.replaceState(null, "", url.toString());
      bukaLkpd();
    }
  });
}
