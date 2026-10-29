# PRODUCT.md: Adventure Bernoulli

Dokumen ini menggambarkan isi website Adventure Bernoulli apa adanya: tokoh, layar, alur, konsep, LKPD
digital, data, tampilan, teknologi, aturan kerja, dan keputusan pemilik proyek. Semua angka dan teks
diambil dari kode (`index.html`, `js/`, `css/style.css`, `firestore.rules`), bukan perkiraan. Status
setiap bagian ditulis jelas: **sudah jalan** atau **belum dibuat**.

## 1. Ringkasan

| Hal | Isi |
|---|---|
| Nama | Adventure Bernoulli |
| Jenis | Game edukasi 3D hack and slash di browser untuk mengajarkan distribusi Bernoulli, ditambah LKPD digital |
| Pembuat | Kelompok 17, Universitas Sriwijaya |
| Pengguna | Siswa kelas XII, Matematika Tingkat Lanjut, Fase F; guru (4 akun dari pemilik) |
| Hosting | Website statis di Vercel, dari cabang `claude/gallant-wright-oqf0ms` |
| Akun dan data | Firebase Authentication (email dan kata sandi) dan Cloud Firestore |
| Teknologi | HTML, CSS, JavaScript murni (ES module), tanpa build tool. Three.js 0.160.0 (jsDelivr), jsPDF 2.5.1 (cdnjs), Firebase JS SDK 12.19.0 (gstatic), font Cinzel (Google Fonts). npm hanya untuk tes di komputer pengembang |

### Status fitur

| Bagian | Status |
|---|---|
| Game 5 tahap, Serangan Penentu, rekap ringkas, PDF rekap | Sudah jalan |
| Masuk dan Daftar (email dan kata sandi), profil, simpan hasil permainan | Sudah jalan |
| Setting Peluang (latihan) | Sudah jalan |
| LKPD digital 1:1 untuk siswa (isi, simpan otomatis, kirim, Lihat Hasil, PDF, ajukan perubahan) | Sudah jalan |
| Halaman guru (lihat LKPD siswa, unduh, setujui/tolak perubahan, hapus data) | **Belum dibuat** (Tahap C) |

## 2. Pengguna dan cara pakai

- Siswa bermain dan mengerjakan LKPD secara asinkron, 1 siswa 1 perangkat, satu sesi sekitar 15 sampai
  20 menit untuk game.
- Perangkat: laptop (utama) dan HP Android (lebar 360 sampai 412 piksel). Game dimainkan dalam
  landscape; menu, rekap, dan LKPD dalam portrait.
- Data tersimpan di akun, jadi siswa bisa pindah perangkat.

## 3. Cerita dan tokoh

Di ruang singgasana Kerajaan Swarnadwipa, pemain (Pengembara) melawan Arca Durgaraksa, arca batu kuno
yang bangkit, dalam 5 tahap. Resi Bayang, pertapa bertudung dengan tongkat bercahaya, memandu pemain
dan menjelaskan konsep peluang.

| Tokoh | Peran |
|---|---|
| Pengembara (pemain) | Karakter yang dipilih dan dikustomisasi siswa; namanya diambil dari Nama Siswa |
| Arca Durgaraksa | Boss di kelima tahap; makin kuat di tahap 4 (kristal ungu) dan 5 (aura merah) |
| Resi Bayang | Pemandu; dialognya menjelaskan p, 1 - p, kebebasan antarpercobaan, dan "Tidak dimainkan" |

## 4. Data lima tahap (nilai bawaan)

| Tahap | Nama | Kondisi | p | 1 - p | Perlengkapan pemain | Kerusakan tebasan | HP arca | Kekuatan pukulan arca |
|---|---|---|---|---|---|---|---|---|
| 1 | Pertemuan Pertama | Tanpa perlengkapan | 0,5 | 0,5 | Pedang kayu | 10 | 1000 | 1,0 |
| 2 | Pedang Besi | Mendapat pedang besi | 0,6 | 0,4 | Pedang besi bercahaya biru | 14 | 1000 | 1,0 |
| 3 | Pedang dan Armor | Pedang besi dan armor | 0,7 | 0,3 | Pedang besi, armor perak | 17 | 1000 | 1,0 |
| 4 | Arca Bangkit Lebih Kuat | Arca Durgaraksa lebih kuat | 0,4 | 0,6 | Pedang ksatria, armor perak, perisai ksatria | 22 | 1400 | 1,25 |
| 5 | Arca Murka | Arca Durgaraksa murka | 0,3 | 0,7 | Pedang api, armor emas, perisai emas, jubah | 28 | 1800 | 1,5 |

Perlengkapan, kerusakan, HP arca, ramuan, sihir, kostum, dan QTE hanya mengubah fase hack and slash
dan animasi. Tidak satu pun mengubah p.

## 5. Alur besar

```
Buka website → Masuk / Daftar → isi Nama Siswa dan Kelas → Mulai Petualangan
→ pilih karakter → tahap 1 sampai 5 (boleh berhenti kapan saja) → rekap
→ hasil tersimpan di akun → Kerjakan LKPD (5 halaman) → Kirim LKPD
→ (bila perlu) Ajukan Perubahan → guru menyetujui atau menolak
```

## 6. Layar dan isinya

### 6.1 Menu utama (sudah jalan)

Latar langit berbintang dan siluet kastil, kartu menu di tengah, tombol **Layar Penuh** di pojok kanan atas.
Kartu berisi: Universitas Sriwijaya, judul Adventure Bernoulli, by Kelompok 17, lalu salah satu dari dua
keadaan berikut.

**Belum masuk:** tab **Masuk** dan **Daftar**.

| Tab | Isi |
|---|---|
| Masuk | Email, Kata sandi, "Tampilkan kata sandi", tombol Masuk, tombol "Lupa kata sandi?" (mengirim tautan buat kata sandi baru; email yang tidak terdaftar mendapat pesan yang sama agar daftar akun tidak bisa ditebak) |
| Daftar | Email, Kata sandi (minimal 6 karakter), Ulangi kata sandi, "Tampilkan kata sandi", Nama Siswa (maks. 40 karakter), Kelas (maks. 15 karakter), tombol Daftar |

Pesan galat ditulis dalam Bahasa Indonesia (email salah, kata sandi salah, email sudah dipakai, kata sandi
terlalu pendek, koneksi bermasalah). Saat memeriksa akun tampil "Memeriksa akun...".

**Sudah masuk:** baris "Masuk sebagai <email>" dengan tombol **Keluar**, isian Nama Siswa dan Kelas (terisi
dari profil, bisa diubah dan ikut tersimpan ke profil saat mulai), tombol **Mulai Petualangan** (aktif hanya
jika keduanya terisi; jika belum, muncul "Isi Nama Siswa dan Kelas untuk memulai."), dan tombol
**Kerjakan LKPD**.

Di bawahnya untuk semua: tombol **Cara Bermain** dan **Setting Peluang**, baris sumber peluang ("Peluang menang
tiap tahap: 0,5 · 0,6 · 0,7 · 0,4 · 0,3 (nilai bawaan game)"), dan, jika peluang latihan aktif, catatan "Mode
latihan: peluang diubah lewat Setting Peluang, jadi hasil permainan tidak disimpan dan tidak dipakai LKPD."
dengan tombol **Kembali ke Peluang Bawaan**.

### 6.2 Cara Bermain (sudah jalan)

Penjelasan singkat (5 tahap, tebas sampai HP arca 20%, Serangan Penentu, satu tahap = satu percobaan
Bernoulli, MENANG (X = 1) atau KALAH (X = 0), p tidak berubah karena cara bermain, menang atau kalah tetap
lanjut), kontrol laptop dan HP dalam format "tombol: aksi", lalu tips.

### 6.3 Setting Peluang (sudah jalan, hanya latihan)

- Mengisi p tiap tahap: angka di antara 0 dan 1, paling banyak dua desimal (contoh 0,45), setiap tahap
  berbeda.
- Tombol **Pakai untuk Latihan** dan **Kembalikan Bawaan**.
- Peluang latihan hanya berlaku di tab browser itu (sessionStorage) sampai tab ditutup atau dikembalikan.
- Permainan latihan ditandai "Mode latihan" di rekap dan PDF, **tidak disimpan ke akun, dan tidak dipakai LKPD**.
- Tautan `?p=` dan penyimpanan permanen versi lama sudah dihapus.

### 6.4 Pilih karakter (sudah jalan)

Tubuh, warna kulit, 5 gaya rambut, 6 warna rambut, 8 warna baju, 4 warna celana, aksesori, tombol Acak dan
Pilih. Hanya tampilan.

### 6.5 Satu tahap permainan (sudah jalan)

1. **Percakapan singkat** gaya visual novel: Resi Bayang, Arca Durgaraksa, dan pemain. Ketuk atau Enter untuk
   lanjut, Lewati untuk melewati.
2. **Pembuka tahap**: nama tahap, kondisi pemain dan arca, kotak peluang ("Peluang menang: 50% (1/2 = 0,5)"
   dan "Peluang kalah: ..."), keterangan "Peluang bukan jaminan: dari 100 pertarungan seperti ini, kira-kira
   50 berakhir menang.", pesan Resi, dan di tahap 1 daftar kontrol. Tombol **Mulai Pertarungan** dan
   **Berhenti dan Lihat Rekap**.
3. **Fase hack and slash**: HUD (nama tahap, HP pemain, bar HP arca dengan tanda 20%, kotak peluang ringkas
   Menang/Kalah, tabel mini T1 sampai T5, tombol jeda); ramuan dan gulungan sihir muncul di arena.
4. **Serangan Penentu**: dipicu yang lebih dulu terjadi antara HP arca 20% ("gacha serangan") atau HP pemain
   1 ("gacha kabur"). Bilah sinematik, potongan kamera, kotak peluang, catatan "Tombol yang muncul hanya
   mengubah gaya serangan, bukan peluang menang", tiga QTE (hanya animasi), lalu satu undian dan hasil besar
   MENANG (X = 1) atau KALAH (X = 0).
5. **Hasil tahap**: judul hasil, baris "Tercatat: Tahap 1 · Tanpa perlengkapan · p = 0,5 · 1 - p = 0,5 · X = 1",
   baris pemicu, tombol **Lanjut ke Tahap Berikutnya** (di tahap 5: **Lihat Rekap**) dan **Berhenti dan Lihat
   Rekap**. Jika kalah, Resi Bayang membangkitkan pemain (efek dissolve) sebelum lanjut.

### 6.6 Menu jeda dan konfirmasi berhenti (sudah jalan)

- Menu jeda: Lanjut Bertarung, Daftar Kontrol, Layar Penuh, Efek gerak (Nyaman/Penuh), Berhenti dan Lihat
  Rekap.
- Konfirmasi berhenti: "Yakin berhenti? Tahap yang belum dimainkan dicatat "Tidak dimainkan": tidak dihitung
  menang atau kalah. Setelah itu rekap langsung tampil." Tombol **Ya, berhenti** dan **Batal**. Tidak bisa
  dibuka saat percakapan, Serangan Penentu, atau kebangkitan.

### 6.7 Rekap (sudah jalan, ringkas)

Rekap sengaja **hanya berisi hasil menang dan kalah**; semua perhitungan peluang dikerjakan siswa di LKPD.

- Judul "Rekap Adventure Bernoulli", Universitas Sriwijaya · by Kelompok 17, kalimat "Berikut catatan
  pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa.", Nama Siswa, Kelas, tanggal.
- Pesan penutup Resi Bayang.
- Tabel 4 kolom: Tahap, Kondisi, p, Hasil (Menang / Kalah / Tidak dimainkan).
- Ringkasan: Tahap dimainkan, Menang, Kalah, Tidak dimainkan. Jika tidak ada tahap dimainkan: "Belum ada
  percobaan yang dilakukan."
- Status penyimpanan ke akun: "Menyimpan hasil ke akunmu...", "Koneksi lambat. Jangan tutup halaman ini; ...",
  "Hasil permainan tersimpan di akunmu. Sekarang kerjakan LKPD.", atau "Gagal menyimpan. Periksa koneksi, lalu
  tekan Simpan Ulang." dengan tombol **Simpan Ulang**.
- Tombol: **Unduh PDF Rekap**, **Buka PDF di Tab Baru**, **Kerjakan LKPD** (muncul setelah tersimpan),
  **Kembali ke Menu Utama** (ditahan sampai penyimpanan selesai).
- Disimpan hanya jika memakai p bawaan dan minimal 1 tahap dimainkan, sekali per permainan.

### 6.8 PDF rekap (sudah jalan)

Isi sama dengan rekap: kepala (Adventure Bernoulli, Universitas Sriwijaya, by Kelompok 17), kalimat pembuka,
Nama Siswa, Kelas, Tanggal, catatan mode latihan bila ada, tabel Tahap, Kondisi, p, Hasil, dan ringkasan.
Tanpa rumus, tanpa refleksi, tanpa umpan balik aplikasi. Nama file `Rekap_Bernoulli_<nama>.pdf`.

## 7. LKPD digital (sudah jalan untuk siswa)

### 7.1 Prinsip

- **Tampilan 1:1 dengan draf Kelompok 17.** Halaman 1 sampai 5 adalah gambar asli draf Word
  (`assets/lkpd/hal-1.png` sampai `hal-5.png`, 200 dpi) yang tidak diubah sedikit pun. Kolom isian ditempel
  tepat di atas kotak jawaban, sel tabel, garis, dan titik-titik. Halaman 6 draf (kunci jawaban dan rubrik)
  **tidak ditampilkan ke siswa**.
- Hanya tentang distribusi Bernoulli (permintaan dosen); tidak ada materi binomial.
- Tidak ada koreksi otomatis. Penilaian dilakukan kelompok di luar website.

### 7.2 Akses dan data permainan

| Keadaan | Perilaku |
|---|---|
| Belum ada permainan tersimpan | "Selesaikan permainan dulu (minimal satu tahap dengan peluang bawaan). Setelah layar rekap muncul, LKPD bisa dibuka." |
| LKPD belum dikirim | Memakai permainan **terbaru** siswa |
| Siswa bermain lagi sebelum mengirim | Muncul "Datamu berubah karena kamu bermain lagi. Periksa kembali jawabanmu." |
| LKPD sudah dikirim | Permainan yang dipakai saat dikirim **dikunci** |
| Cara membuka | Tombol Kerjakan LKPD di menu atau di rekap |

### 7.3 Isi halaman (dari draf kelompok)

| Halaman | Isi draf | Yang bisa diisi siswa |
|---|---|---|
| 1. Sampul | LEMBAR KERJA PESERTA DIDIK, Distribusi Bernoulli, "Catatan Pertarungan di Kerajaan Swarnadwipa", garis Nama dan Kelas, ruang ilustrasi, Matematika Tingkat Lanjut · Kelas XII · Fase F, Universitas Sriwijaya · by Kelompok 17 | **Nama** dan **Kelas** ditulis langsung di garisnya |
| 2. Tujuan dan petunjuk | Tujuan Pembelajaran, Petunjuk Pengerjaan, Petunjuk Penggunaan Alat | Tidak ada isian |
| 3. Pengamatan | Soal 1 (berapa kemungkinan hasil Serangan Penentu), soal 2 ("Pada tahap TERAKHIR, peluang kamu menang adalah .... dan peluang kamu kalah adalah ...."), Kotak Informasi 1 (percobaan Bernoulli, q = 1 − p, P(X = x) = pˣ · q¹⁻ˣ), tabel hasil 5 tahap (Tahap, p, q, Menang, Kalah, X, P(X = x)) | Kotak soal 1; dua titik-titik soal 2 (huruf tebal); kotak soal 2; sel q, X, P(X = x); ceklis Menang atau Kalah |
| 4. Nilai harapan dan variansi | Soal 3 (P(X = 1) dan P(X = 0) tahap terakhir), Kotak Informasi 2 (E(X) = p, Var(X) = p · q), soal 4 (E(X) dan Var(X) 2 tahap terakhir), soal 5 (p = 0,7 di tahap 3, apakah pasti menang) | Kotak soal 3, 4, 5 |
| 5. Soal cerita, kesimpulan, refleksi | Soal 6 Tendangan Penalti (Rafi, peluang gol 0,8; a, b, c), soal 7 (kesimpulan tentang distribusi Bernoulli), Refleksi, tulisan "[ Kirim LKPD ] [ Unduh LKPD (PDF) ] [ Ajukan Perubahan ]" | Kotak soal 6 (a, b, dan c), soal 7, refleksi; tulisan tombol di gambar bisa diketuk |

### 7.4 Cara mengisi

- **Satu halaman per layar.** Tombol **Sebelumnya**, nomor halaman 1 sampai 5, **Berikutnya**, dan penanda
  "Halaman n dari 5".
- **Semua isian wajib.** Berikutnya (dan nomor halaman di depan) baru bisa dibuka jika semua isian halaman itu
  terisi; yang kosong ditandai merah dengan pesan "Masih ada n isian kosong di halaman n (ditandai merah).
  Isi semuanya dulu, lalu lanjut."
- **Ketuk lalu tulis** langsung di kotak. Jawaban panjang bisa digulir di dalam kotak (ukuran kotak mengikuti
  draf).
- **Titik-titik "...."** diisi dengan huruf tebal di atas titik-titiknya. Titik-titik yang sempit membuat huruf
  mengecil sendiri (paling kecil sekitar setengah) agar teks soal tidak tertutup.
- **Tabel halaman 3:** ceklis Menang atau Kalah, satu per baris, ketuk lagi untuk menghapus. Tahap yang tidak
  dimainkan diarsir tipis dan otomatis berisi "-" (sesuai catatan di bawah tabel draf); barisnya tidak perlu
  diisi.
- **Mengikuti progres permainan:** di atas lembar tampil hasil tiap tahap (T1 Menang, T2 Kalah, T3 -, ...) dan
  "Tahap terakhir yang dimainkan: n".
- **Zoom:** cubit dua jari di lembar (HP), Ctrl + gulir atau tombol −, +, dan **Pas Layar** (laptop). Di HP,
  kotak yang diketuk otomatis diperbesar selebar layar. Selama LKPD terbuka, zoom bawaan browser dimatikan
  agar iPhone tidak memperbesar halaman sendiri.
- **Huruf jawaban:** Arial biru tua, ukurannya setara teks draf (sekitar 10,6 pt).
- **Simpan otomatis** sekitar 0,6 detik setelah berhenti mengetik: "Menyimpan...", "Tersimpan", "Koneksi
  lambat. ...", atau "Gagal menyimpan. ...". Penanda kemajuan "n% isian terisi".

### 7.5 Papan Rumus (mirip keyboard GeoGebra)

- Tombol **Papan Rumus** di kiri bawah membuka papan di bagian bawah layar; tombol ✕ menutupnya. Selama papan
  terbuka, keyboard bawaan HP tidak muncul. Tombol **Keyboard HP** menutup papan dan memunculkan keyboard HP.
- Tab **123**: 0 sampai 9, × ÷ ( ) + − = ≠ , . < > · / %, panah kursor, hapus, spasi, baris baru.
- Tab **f(x)**: x², mode pangkat xⁿ, mode indeks x₂, √, π, ±, p, q, x, X, n, =, P(X = x), E(X), Var(X),
  pˣ · q¹⁻ˣ, 1 − p, ≤, ≥.
- Tab **ABC**: huruf a sampai z, huruf besar (⇧), tanda baca.
- Batas: pangkat dan indeks memakai karakter Unicode, jadi pecahan bertingkat tidak bisa (ditulis 1/2), dan
  huruf q tidak punya bentuk pangkat.

### 7.6 Bar halaman 5 dan pengiriman

| Fitur | Perilaku |
|---|---|
| Bar halaman 5 | Di bawah lembar halaman 5: **Kirim LKPD**, **Lihat Hasil**, **Unduh PDF**, dan **Ajukan Perubahan** (setelah terkirim) |
| Syarat | Ketiga tombol pertama hanya jalan jika semua isian halaman 1 sampai 5 terisi; jika belum, muncul daftar halaman yang masih kosong |
| Kirim LKPD | Konfirmasi sekali ("Setelah dikirim, jawaban terkunci ... Tekan Kirim LKPD sekali lagi"), lalu status "Terkirim. Jawaban terkunci." |
| Lihat Hasil | Ringkasan: Nama, Kelas, status, progres permainan (tabel Tahap, p, Hasil; jumlah menang dan kalah), semua jawaban |
| Unduh PDF | 5 halaman persis seperti di layar (gambar draf + jawaban di tempatnya) ditambah 1 halaman **Hasil Singkat** (identitas, progres permainan, semua jawaban). Jawaban yang terlalu panjang dikecilkan; jika masih tidak muat, lanjutannya ada di Hasil Singkat. Nama file `LKPD_Bernoulli_<nama>.pdf` |
| Ajukan Perubahan | Hanya setelah terkirim. Siswa menulis alasan singkat (maks. 300 karakter); status "Menunggu persetujuan guru untuk mengubah jawaban." |
| Disetujui guru | Status "Guru menyetujui perubahan. Ubah jawaban, lalu kirim lagi."; isian terbuka lagi |

### 7.7 Status LKPD

`draf` (bisa diisi) → `terkirim` (terkunci) → `minta-ubah` (menunggu guru) → `dibuka` (boleh diubah lalu dikirim
lagi) atau kembali `terkirim` jika ditolak.

## 8. Halaman guru (belum dibuat, Tahap C)

Rencana yang sudah disetujui sebagian:
- Akun guru (4 email dari pemilik) dibuat pemilik di Firebase Console dan dikenali dari UID di koleksi `guru`.
- Melihat LKPD tiap siswa **persis seperti yang mereka isi** (tampilan 1:1, hanya baca) dan mengunduhnya.
- Daftar siswa per kelas, hasil permainan, status dan kemajuan LKPD.
- Tombol Setujui dan Tolak untuk pengajuan perubahan.
- Hapus data siswa agar siswa bisa mengulang.
- Tidak menyimpan nilai; penilaian di luar website.

## 9. Konsep yang diajarkan dan aturannya di kode

- Setiap tahap adalah satu percobaan Bernoulli dengan dua hasil saja: MENANG (X = 1) atau KALAH (X = 0).
- Permainan biasa selalu memakai p bawaan; p dibaca sekali saat petualangan dimulai dan dibekukan.
- Serangan Penentu memanggil `decisiveRoll(p)` di `js/bernoulli.js`: satu bilangan acak U di [0, 1) dari
  `crypto.getRandomValues`, X = 1 jika U < p, selain itu X = 0. Satu undian per tahap, tidak bisa dibatalkan.
  Perhitungan memakai bilangan bulat perseratus agar tepat.
- Fase hack and slash hanya membawa pertarungan ke Serangan Penentu: HP arca berhenti di 20% dan HP pemain
  berhenti di 1.
- Menang atau kalah, pemain lanjut ke tahap berikutnya.
- Tahap yang tidak dimainkan karena berhenti dicatat "Tidak dimainkan", bukan kalah, dan tidak punya X.
- Rumus P(X = x) = pˣ · q¹⁻ˣ, E(X) = p, dan Var(X) = p · q diajarkan di LKPD (Kotak Informasi 1 dan 2), tidak
  dihitung di rekap.
- Format angka memakai koma desimal (0,6) di HUD, layar hasil, rekap, LKPD, dan PDF.

## 10. Fitur permainan

- **Kontrol laptop:** W A S D bergerak, mouse memutar kamera (klik untuk mengunci kursor; jika ditolak, seret
  mouse), klik kiri tebas (combo 3), Space lompat, C atau Ctrl jongkok, Shift menghindar, Q sihir, Esc jeda.
- **Kontrol HP:** joystick kiri, geser sisi kanan untuk kamera, tombol Tebas, Lompat, Jongkok, Hindar, Sihir
  di kanan bawah, tombol jeda di kanan atas. Petunjuk "Putar HP ke mode landscape" muncul saat bertarung
  dalam portrait, tanpa mengunci orientasi.
- **Serangan arca dengan aba-aba:** hantaman (hindari dengan berguling), sapuan (jongkok), hentakan (lompat).
- **Ramuan dan sihir:** Ramuan Darah +35 HP, Ramuan Serangan kerusakan 2 kali selama 15 detik, gulungan Bola
  Api (6 kali kerusakan tebasan) dan Petir (8 kali, arca terpaku 1,5 detik). Muncul tiap 8 detik, paling
  banyak 2 di arena.
- **Efek gerak Nyaman** (bawaan): guncangan dan kilatan layar diredam.
- **Musik latar sintetis** dan efek suara; tombol suara (ikon gong) selalu tersedia.
- **Kualitas grafis otomatis:** di HP dan saat fps di bawah 40, bloom, bayangan, dan sebagian partikel
  dimatikan.

## 11. Data yang tersimpan

```
guru/{uid}                       diisi manual dengan UID akun guru
users/{uid}                      nama, kelas, kelasKey, email, dibuat, diperbarui
users/{uid}/permainan/{id}       p, x (5 nilai: 1, 0, atau null), karakter, mulai, selesai
users/{uid}/lkpd/jawaban         isian, status, progres, permainanId, dikirim, diperbarui,
                                 alasanUbah, diputuskanOleh, diputuskanPada
```

ID isian LKPD: `nama`, `kelas`, `s1`, `s2_menang`, `s2_kalah`, `s2`, `t1_q` sampai `t5_q`, `t1_hasil` sampai
`t5_hasil`, `t1_x` sampai `t5_x`, `t1_px` sampai `t5_px`, `s3`, `s4`, `s5`, `s6`, `s7`, `refleksi`.

Aturan akses (`firestore.rules`, harus diterbitkan di Console):
- Siswa hanya membaca dan menulis datanya sendiri; guru membaca semua.
- Permainan hanya bisa disimpan dengan p 50, 60, 70, 40, 30 dan tidak bisa diubah setelah tersimpan.
- LKPD bisa diubah siswa saat `draf` atau `dibuka`; setelah `terkirim` siswa hanya bisa mengajukan perubahan;
  guru hanya mengubah status keputusan.
- Hanya guru yang bisa menghapus data siswa.

Di browser hanya tersimpan: pilihan Efek gerak (localStorage) dan peluang latihan (sessionStorage).
Data siswa di bawah 18 tahun memerlukan persetujuan orang tua atau wali (Pasal 25 UU 27/2022); izin diurus
kelompok.

## 12. Gaya visual

- Dunia: ruang singgasana batu, emas kusam, api obor, arca kuno. Model kotak-kotak dengan toon shading dan
  garis tepi.
- Palet antarmuka: batu gelap hangat (`--bg #14110d`, `--panel #1f1a14`, `--panel-2 #2b241b`), garis emas kusam
  (`--line #4a3d28`), teks perkamen (`--text #f3ead8`), aksen emas `#f6c453`, hijau menang `#3ecf8e`, merah
  kalah `#ff6b6b`. Ungu hanya untuk Resi Bayang.
- Huruf: Cinzel untuk judul, font sistem untuk isi. LKPD memakai tampilan asli draf (putih, Arial).
- Tombol: primer emas, sekunder batu gelap bergaris emas tipis, bahaya merah bata; sudut 10 px.
- Ikon: SVG garis, bukan emoji. Papan Rumus memakai warna terang ala GeoGebra dengan aksen ungu `#6557d2`.

## 13. Bahasa dan nada

Bahasa Indonesia yang jelas, singkat, dan ramah untuk siswa. Tombol menyebut akibatnya ("Berhenti dan Lihat
Rekap", "Buka PDF di Tab Baru", "Kirim LKPD").

## 14. Aksesibilitas dan tampilan di berbagai layar

- Fokus keyboard terlihat; semua isian LKPD punya label untuk pembaca layar.
- MENANG, KALAH, dan Tidak dimainkan dibedakan dengan teks, bukan hanya warna. Kontras teks minimal 4,5:1.
- Perangkat sentuh: tombol aksi game minimal 54 px (Tebas 66 px); tombol jeda, suara, layar penuh 48 px; zona
  aman poni memakai `env(safe-area-inset-*)`.
- Zona aman kanan bawah (`--safe-bottom`) dipertahankan untuk badge hosting.
- Portrait: menu, rekap, dan LKPD bisa digulir tanpa scroll ke samping (diuji di 360, 768, 1366, 1920 px).

## 15. Ketahanan terhadap kasus pinggir

- Nama atau Kelas kosong atau hanya spasi: tombol Mulai nonaktif dengan petunjuk.
- Emoji dan simbol yang tidak bisa dicetak di PDF dihapus dari nama dan kelas, dengan pesan.
- Internet putus atau CDN gagal: "Game membutuhkan koneksi internet. Periksa koneksi lalu muat ulang halaman."
  dengan tombol Muat Ulang.
- Dibuka dengan klik dua kali `index.html` (file://): pesan cara membuka yang benar.
- Klik ganda tombol penting tidak menjalankan aksi dua kali.
- Penyimpanan gagal: hasil permainan bisa disimpan ulang; jawaban LKPD dicoba lagi saat siswa mengetik.

## 16. Tes

- `npm test`: 12 tes Node untuk `js/bernoulli.js` dan data `js/config.js`.
- `?test=1`: tes browser, termasuk 10.000 undian p = 60 yang harus memberi frekuensi 0,58 sampai 0,62.
- LKPD diuji dengan Firebase tiruan di Playwright (lebar 360, 768, 1366, 1920 px). Firebase asli harus diuji di
  Vercel.

## 17. Struktur folder

```
index.html, .nojekyll, README.md, PRODUCT.md, package.json, firestore.rules
css/style.css
tests/bernoulli.test.js
assets/lkpd/hal-1.png ... hal-5.png   gambar asli halaman LKPD (jangan diedit)
docs/  tutorial-firebase.md, rancangan-firebase.md, spesifikasi-login-dan-lkpd.md,
       LKPD-struktur-dan-isi.md, LKPD-Distribusi-Bernoulli.docx/.pdf, Panduan-Firebase-dan-Fitur-LKPD.docx/.pdf
js/  bernoulli.js  config.js  main.js  player.js  boss.js  mystic.js  arena.js
     controls.js  combat.js  stages.js  ui.js  shaders.js  pdf.js  audio.js  browser-tests.js
     cutscene.js  qte.js  potions.js  spells.js  settings.js  teacher.js
     firebase-config.js  akun.js  masuk.js  lkpd.js  lkpd-lembar.js  papan-rumus.js
```

`js/teacher.js` adalah layar Setting Peluang (nama file lama), bukan halaman guru.

## 18. Keterbatasan yang diketahui

- Butuh internet untuk Three.js, jsPDF, Firebase, dan font.
- Belum diuji di Safari atau iPhone, dan Firebase asli belum diuji dari lingkungan pengembangan.
- Halaman guru belum ada; sampai dibuat, pengajuan perubahan LKPD belum bisa diputuskan dari website.
- Teks soal LKPD tidak bisa menyesuaikan data siswa karena memakai gambar asli. Soal 2 ("tahap TERAKHIR") dan
  soal 4 ("2 tahap terakhir") bisa dibaca dua arti, dan kunci jawaban di halaman 6 draf belum sesuai dengan
  soal 2 sampai 4. Perbaikannya di draf Word kelompok.
- Titik-titik pertama soal 2 hanya selebar sekitar 4 huruf.
- Setelah tab ditinggal lalu dibuka lagi, pengukur fps di `js/main.js` dapat menurunkan grafis laptop ke
  kualitas rendah secara permanen. Perbaikannya ada di loop render (area terlarang) dan menunggu izin pemilik.

## 19. Aturan untuk semua perintah impeccable berikutnya

1. Hanya boleh mengubah tampilan antarmuka HTML/CSS: menu utama, layar Cara Bermain, layar pilih karakter, HUD, dialog Resi Bayang, layar hasil tahap, konfirmasi berhenti, dan layar rekap.
2. DILARANG mengubah: `js/bernoulli.js`, `js/config.js` (termasuk nilai p 50, 60, 70, 40, 30), logika Serangan Penentu, logika fitur berhenti, logika pencatatan hasil, rumus dan isi perhitungan di PDF, scene Three.js, model 3D, kontrol, shader, dan tes.
3. DILARANG menambah fitur, layar, mode, tutorial, onboarding, pengaturan, atau sistem skor.
4. DILARANG mengubah teks konsep Bernoulli (X = 1, X = 0, p, 1 - p, E(X), Var(X), "bukan binomial", "Tidak dimainkan") kecuali memperbaiki salah ketik.
5. Identitas wajib tetap: Universitas Sriwijaya, by Kelompok 17, Kerajaan Swarnadwipa, Arca Durgaraksa, Resi Bayang.
6. Tidak boleh ada path absolut berawalan "/", dan game tidak boleh bergantung pada npm untuk berjalan.
7. Sebelum mengubah file apa pun, tunjukkan daftar perubahan dan tunggu persetujuan pemilik proyek.

## 20. Keputusan pemilik

- **Nilai p bawaan resmi: 50, 60, 70, 40, 30** (0,5; 0,6; 0,7; 0,4; 0,3), semuanya berbeda, tidak boleh diubah.
- **Setting Peluang** (dulu Setting Guru) tetap ada hanya untuk latihan; permainan biasa selalu memakai p
  bawaan, peluang latihan tidak tersimpan permanen, tautan `?p=` dihapus.
- **Login email dan kata sandi** (bukan Google). Siswa mendaftar sendiri; akun guru dibuat pemilik di Console
  dan dikenali dari UID. Ini pengecualian tertulis untuk aturan 3 dan mengganti prinsip "tanpa backend";
  aturan 6 tetap berlaku (pustaka dari CDN, tanpa npm).
- **Satu permainan per siswa** (tahap 1 sampai 5) dengan p bawaan; boleh berhenti sebelum tahap 5, LKPD
  memakai tahap yang dimainkan.
- **Rekap dan PDF rekap ringkas:** hanya menang dan kalah. Rumus, perhitungan, dan refleksi pindah ke LKPD.
  Keputusan ini mengesampingkan aturan 2 (isi perhitungan PDF) dan aturan 4 khusus untuk rekap dan PDF.
  Layar hasil tahap, HUD, dan Serangan Penentu tetap menampilkan p, 1 - p, dan X.
- **LKPD 1:1 dengan draf kelompok:** gambar asli tidak diubah; isian ditempel di atas kotak; Nama dan Kelas
  diisi di sampul; titik-titik menjadi isian berhuruf tebal; satu halaman per layar; semua isian wajib; zoom
  dengan cubit; papan rumus lewat tombol; bar halaman 5 berisi Kirim, Lihat Hasil, Unduh PDF.
- **Jika kelompok merevisi LKPD:** versi digital mengikuti revisi dengan cara yang sama. PDF revisi diubah
  menjadi gambar `assets/lkpd/hal-N.png` (200 dpi) tanpa diubah isinya, lalu posisi setiap kotak, sel tabel,
  garis, dan titik-titik diukur ulang di `BIDANG` (`js/lkpd-lembar.js`). Titik-titik atau garis kosong
  dijadikan isian di tempatnya.
- **Setelah LKPD dikirim**, perubahan hanya dengan persetujuan guru. Guru juga bisa menghapus data siswa agar
  siswa mengulang.
- **Penilaian** dilakukan kelompok di luar website; tidak ada koreksi otomatis.
- **Hosting Vercel**; zona aman kanan bawah dipertahankan.
- Fitur game yang dipertahankan: Efek gerak Nyaman/Penuh, kustomisasi karakter, percakapan gaya visual
  novel, QTE (hanya animasi), ramuan, gulungan sihir, musik latar, dan Serangan Penentu yang juga dipicu saat
  pemain sekarat (peluang tetap p tahap itu).

Dokumen rinci: `docs/spesifikasi-login-dan-lkpd.md` (fitur), `docs/rancangan-firebase.md` (rancangan
teknis), `docs/tutorial-firebase.md` (pemasangan Firebase), `docs/LKPD-struktur-dan-isi.md` (struktur LKPD).
