# 3. Fitur produk (kondisi saat ini)

## 3.1 Game Adventure Bernoulli
- **Cerita:** Pengembara melawan Arca Durgaraksa di ruang singgasana Kerajaan Swarnadwipa, dipandu Resi Bayang.
- **Lima tahap** dengan peluang menang bawaan 0,5; 0,6; 0,7; 0,4; 0,3 (berbeda tiap tahap). Perlengkapan dan
  kekuatan arca berubah tiap tahap, tetapi hanya memengaruhi pertarungan, bukan peluang.
- **Serangan Penentu:** satu undian acak (crypto.getRandomValues), X = 1 jika U < p, selain itu X = 0. Dipicu saat
  HP arca 20% atau HP pemain 1. Satu undian per tahap; menang atau kalah tetap lanjut.
- **Peluang dirahasiakan** selama bermain (pembuka tahap, HUD, Serangan Penentu, hasil tahap, dialog).
- **Berhenti kapan saja:** tahap yang belum dimainkan dicatat "Tidak dimainkan", bukan kalah.
- **Rekap:** tabel Tahap, Kondisi, Peluang menang (p), Hasil; ringkasan menang dan kalah; penjelasan bahwa hasil
  ditentukan undian dengan peluang itu, dengan contoh dari hasil sendiri; unduh PDF rekap.
- **Pendukung permainan:** kontrol laptop (WASD, mouse) dan HP (joystick, tombol), kustomisasi karakter, dialog
  gaya visual novel, ramuan, gulungan sihir, QTE, musik, efek gerak Nyaman/Penuh, slider kecepatan kamera,
  kualitas grafis otomatis.
- **Setting Peluang** (latihan): mencoba peluang lain; hasilnya tidak disimpan dan tidak dipakai LKM.

## 3.2 Akun dan data (Firebase)
- Daftar dan masuk dengan email dan kata sandi; lupa kata sandi.
- Hasil permainan dengan peluang bawaan tersimpan di akun.
- Aturan keamanan: mahasiswa hanya membaca datanya sendiri; dosen dikenali dari koleksi `guru`.

## 3.3 LKM digital (Lembar Kerja Mahasiswa)
- Halaman 1 sampai 5 tampil **1:1 dengan desain kelompok** (gambar asli), isian ditempel di atas kotaknya.
- Bagian A Mengamati Pertarungan (soal 1 sampai 3, tabel hasil 5 tahap), Bagian B Menemukan Ciri Percobaan
  (soal 4 sampai 6), Bagian C Menemukan Rumus Peluang (soal 7 sampai 9, Kotak Informasi 1), Bagian D
  Menyimpulkan (soal 10, Kotak Informasi 2), Refleksi.
- Terbuka jika permainan minimal sampai tahap 3. Satu halaman per layar, semua isian wajib, zoom cubit,
  tombol Rumus (papan rumus mirip GeoGebra), simpan otomatis.
- Kirim LKM (terkunci setelah dikirim), Lihat Hasil, Unduh PDF (5 halaman persis layar + Hasil Singkat),
  Ajukan Perubahan (diputuskan dosen).
- **Rangkuman materi** terbuka setelah LKM dikirim.

## 3.4 Halaman dosen
- Daftar mahasiswa dan status LKM; melihat LKM mahasiswa 1:1 dan mengunduhnya; menyetujui atau menolak
  pengajuan perubahan.

## 3.5 Pretest materi prasyarat
- Tiga soal pilihan ganda beralasan (ruang sampel dan peluang kejadian), tiga tingkat kesulitan, dengan
  pengecoh, kunci, dan pedoman skor (berkas Word di folder docs).

## 3.6 Teknologi
- HTML, CSS, JavaScript murni; Three.js 0.160.0; jsPDF 2.5.1; Firebase JS SDK 12.19.0; dihosting di Vercel.
