// Halaman dosen sederhana: daftar mahasiswa, lihat LKM (hanya baca), setujui atau tolak pengajuan ubah.
import * as akun from "./akun.js";
import * as L from "./lkpd-lembar.js";
import { $, escapeHtml, show } from "./ui.js";

const STATUS = { draf: "Draf", terkirim: "Terkirim", "minta-ubah": "Minta diubah", dibuka: "Dibuka" };

async function muat() {
  const box = $("#dosen-daftar");
  box.textContent = "Memuat...";
  try {
    const list = (await akun.semuaMahasiswa()).sort((a, b) => (a.kelas || "").localeCompare(b.kelas || "") || (a.nama || "").localeCompare(b.nama || ""));
    box.innerHTML = `<table class="data-table"><thead><tr><th>Nama</th><th>Kelas</th><th>Status</th><th>Isi</th><th></th></tr></thead><tbody>${list.map((m) => {
      const k = m.lkpd;
      const aksi = k ? `<button class="btn" data-lihat="${m.uid}">Lihat</button>` + (k.status === "minta-ubah" ? ` <button class="btn btn-primary" data-ya="${m.uid}">Setujui</button> <button class="btn" data-tidak="${m.uid}">Tolak</button>` : "") : "";
      return `<tr><td>${escapeHtml(m.nama || "-")}</td><td>${escapeHtml(m.kelas || "-")}</td><td>${k ? STATUS[k.status] || k.status : "Belum mulai"}</td><td>${k ? k.progres + "%" : "-"}</td><td>${aksi}${k && k.alasanUbah && k.status === "minta-ubah" ? `<br><small>Alasan: ${escapeHtml(k.alasanUbah)}</small>` : ""}</td></tr>`;
    }).join("")}</tbody></table>`;
    box.dataset.list = "";
    box._list = list;
  } catch (e) {
    box.textContent = akun.pesanGalat(e);
  }
}

async function lihat(uid) {
  const m = $("#dosen-daftar")._list.find((x) => x.uid === uid);
  const wadah = $("#dosen-lembar");
  const main = await akun.permainanMahasiswa(uid, m.lkpd.permainanId);
  if (!main) return (wadah.textContent = "Data permainan mahasiswa tidak ditemukan.");
  const isian = { nama: m.nama, kelas: m.kelas, ...m.lkpd.isian };
  wadah.replaceChildren();
  const w = Math.min(wadah.clientWidth || 800, 860);
  for (let n = 1; n <= L.JUMLAH_HAL; n++) {
    const s = L.bangunLembar(n, main);
    s.style.width = w + "px";
    s.style.setProperty("--sw", w);
    s.style.marginBottom = "8px";
    wadah.append(s);
  }
  L.isiLembar(wadah, isian);
  L.kunciLembar(wadah, true);
  $("#dosen-pdf").hidden = false;
  $("#dosen-pdf").onclick = () => L.unduhPdf({ main, isian, status: m.lkpd.status });
  wadah.scrollIntoView();
}

export function initDosen() {
  $("#btn-dosen").addEventListener("click", () => { show("dosen"); muat(); });
  $("#dosen-daftar").addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.lihat) return lihat(b.dataset.lihat);
    const uid = b.dataset.ya || b.dataset.tidak;
    if (!uid) return;
    b.disabled = true;
    try { await akun.putuskan(uid, !!b.dataset.ya); await muat(); } catch (err) { alert(akun.pesanGalat(err)); b.disabled = false; }
  });
}

/** Tombol Dosen tampil hanya untuk akun yang ada di koleksi guru. */
export async function tampilkanTombolDosen() {
  $("#btn-dosen").hidden = !(await akun.cekGuru().catch(() => false));
}
