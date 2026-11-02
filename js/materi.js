// Rangkuman materi distribusi Bernoulli. Terbuka setelah LKM dikirim (catatan di halaman 5 LKM).
// Isinya hanya dari LKM Kelompok 17 (Kotak Informasi 1 dan 2, harapan jawaban soal 1 sampai 10) dan nilai p
// bawaan game di js/config.js; tidak ada materi di luar LKM.
import { CONFIG } from "./config.js";
import { $, show } from "./ui.js";

const B = () => window.Bernoulli;

function isi() {
  const f = (p) => B().fmtP(p);
  const baris = CONFIG.stages.map((s) => `<tr><td>${s.id}</td><td>${f(s.p)}</td><td>${f(100 - s.p)}</td></tr>`).join("");
  const t3 = CONFIG.stages[2].p;
  return `
    <h3>1. Percobaan Bernoulli</h3>
    <p>Satu kali percobaan yang hanya memiliki dua hasil, dengan peluang sukses yang tetap, disebut
      <strong>percobaan Bernoulli</strong>. Hasil sukses diberi nilai <strong>X = 1</strong> dan hasil gagal diberi
      nilai <strong>X = 0</strong>. Peluang sukses dinyatakan dengan <strong>p</strong> dan peluang gagal dengan
      <strong>q</strong>.</p>
    <p>Di Adventure Bernoulli, satu Serangan Penentu di satu tahap adalah satu percobaan Bernoulli: hasil menang
      adalah sukses (X = 1) dan hasil kalah adalah gagal (X = 0).</p>
    <h4>Ciri yang kamu temukan di game</h4>
    <ul>
      <li>Hanya ada dua macam hasil: menang atau kalah.</li>
      <li>Satu kali Serangan Penentu langsung menentukan hasil tahap itu.</li>
      <li>Peluang menang tidak berubah selama tahap berlangsung.</li>
      <li>Hasil satu tahap tidak memengaruhi peluang menang di tahap lain, karena setiap tahap adalah percobaan
        tersendiri.</li>
    </ul>

    <h3>2. Peluang gagal</h3>
    <p>Dalam satu percobaan hanya ada dua hasil dan keduanya tidak bisa terjadi bersamaan, jadi jumlah peluangnya 1:</p>
    <p class="materi-rumus">q = 1 − p</p>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Tahap</th><th>Peluang menang (p)</th><th>Peluang kalah (q)</th></tr></thead>
      <tbody>${baris}</tbody>
    </table></div>

    <h3>3. Peubah acak dan distribusi Bernoulli</h3>
    <p><strong>Peubah acak</strong> adalah lambang, seperti X, yang nilainya ditentukan oleh hasil suatu percobaan.
      Peubah acak X yang menyatakan hasil satu percobaan Bernoulli (X = 1 jika sukses, X = 0 jika gagal) dikatakan
      <strong>berdistribusi Bernoulli</strong>.</p>
    <p>Rumus berikut disebut <strong>fungsi peluang distribusi Bernoulli</strong>:</p>
    <p class="materi-rumus">P(X = x) = p<sup>x</sup> × q<sup>1 − x</sup>, untuk x = 0 atau x = 1</p>
    <p>Jadi P(X = 1) = p dan P(X = 0) = q = 1 − p.</p>

    <h4>Contoh: tahap 3 (p = ${f(t3)}, q = ${f(100 - t3)})</h4>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>x</th><th>p<sup>x</sup></th><th>q<sup>1 − x</sup></th><th>P(X = x) = p<sup>x</sup> × q<sup>1 − x</sup></th></tr></thead>
      <tbody>
        <tr><td>0</td><td>${f(t3)}<sup>0</sup> = 1</td><td>${f(100 - t3)}<sup>1</sup> = ${f(100 - t3)}</td><td>1 × ${f(100 - t3)} = ${f(100 - t3)}</td></tr>
        <tr><td>1</td><td>${f(t3)}<sup>1</sup> = ${f(t3)}</td><td>${f(100 - t3)}<sup>0</sup> = 1</td><td>${f(t3)} × 1 = ${f(t3)}</td></tr>
      </tbody>
    </table></div>
    <p>Bilangan selain nol yang dipangkatkan 0 hasilnya 1, jadi satu rumus ini memberi peluang menang saat x = 1 dan
      peluang kalah saat x = 0.</p>
    <p class="muted small">Rangkuman ini disusun dari Kotak Informasi 1 dan 2 serta harapan jawaban LKM Kelompok 17.</p>`;
}

export function bukaMateri() {
  $("#materi-isi").innerHTML = isi();
  show("materi");
}
