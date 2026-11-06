# PRODUCT.md: Adventure Bernoulli

Dokumen ini menggambarkan isi website Adventure Bernoulli apa adanya: tokoh, layar, alur, konsep, LKM
digital, data, tampilan, teknologi, aturan kerja, dan keputusan pemilik proyek. Semua angka dan teks
diambil dari kode (`index.html`, `js/`, `css/style.css`, `firestore.rules`), bukan perkiraan. Status
setiap bagian ditulis jelas: **sudah jalan** atau **belum dibuat**.

## 1. Ringkasan

| Hal | Isi |
|---|---|
| Nama | Adventure Bernoulli |
| Jenis | Game edukasi 3D hack and slash di browser untuk mengajarkan distribusi Bernoulli, ditambah LKM digital |
| Pembuat | Kelompok 17, Universitas Sriwijaya |
| Pengguna | Mahasiswa (mengisi Nama, NIM, dan Kelas di LKM); dosen (4 akun dari pemilik) |
| Hosting | Website statis di Vercel, dari cabang `claude/gallant-wright-oqf0ms` |
| Akun dan data | Firebase Authentication (email dan kata sandi) dan Cloud Firestore |
| Teknologi | HTML, CSS, JavaScript murni (ES module), tanpa build tool. Three.js 0.160.0 (jsDelivr), jsPDF 2.5.1 (cdnjs), Firebase JS SDK 12.19.0 (gstatic), font Cinzel (Google Fonts). npm hanya untuk tes di komputer pengembang |

### Status fitur

| Bagian | Status |
|---|---|
| Game 5 tahap, Serangan Penentu, rekap ringkas, PDF rekap | Sudah jalan |
| Masuk dan Daftar (email dan kata sandi), profil, simpan hasil permainan | Sudah jalan |
| Setting Peluang (latihan) | Sudah jalan |
| LKM digital 1:1 untuk mahasiswa (isi, simpan otomatis, kirim, Lihat Hasil, PDF, ajukan perubahan) | Sudah jalan |
| Halaman dosen (lihat LKM mahasiswa, unduh, setujui/tolak perubahan, hapus data) | **Belum dibuat** (Tahap C) |

## 2. Pengguna dan cara pakai

- Mahasiswa bermain dan mengerjakan LKM secara asinkron, 1 mahasiswa 1 perangkat, satu sesi sekitar 15 sampai
  20 menit untuk game.
- Perangkat: laptop (utama) dan HP Android (lebar 360 sampai 412 piksel). Game dimainkan dalam
  landscape; menu, rekap, dan LKM dalam portrait.
- Data tersimpan di akun, jadi mahasiswa bisa pindah perangkat.

## 3. Cerita dan tokoh

Di ruang singgasana Kerajaan Swarnadwipa, pemain (Pengembara) melawan Arca Durgaraksa, arca batu kuno
yang bangkit, dalam 5 tahap. Resi Bayang, pertapa bertudung dengan tongkat bercahaya, memandu pemain
dan menjelaskan konsep peluang.

| Tokoh | Peran |
|---|---|
| Pengembara (pemain) | Karakter yang dipilih dan dikustomisasi mahasiswa; namanya diambil dari Nama Mahasiswa |
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
Buka website → Masuk / Daftar → isi Nama Mahasiswa dan Kelas → Mulai Petualangan
→ pilih karakter → tahap 1 sampai 5 (boleh berhenti kapan saja) → rekap
→ hasil tersimpan di akun → Kerjakan LKM (5 halaman) → Kirim LKM
→ (bila perlu) Ajukan Perubahan → dosen menyetujui atau menolak
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
| Daftar | Email, Kata sandi (minimal 6 karakter), Ulangi kata sandi, "Tampilkan kata sandi", Nama Mahasiswa (maks. 40 karakter), Kelas (maks. 15 karakter), tombol Daftar |

Pesan galat ditulis dalam Bahasa Indonesia (email salah, kata sandi salah, email sudah dipakai, kata sandi
terlalu pendek, koneksi bermasalah). Saat memeriksa akun tampil "Memeriksa akun...".

**Sudah masuk:** baris "Masuk sebagai <email>" dengan tombol **Keluar**, isian Nama Mahasiswa dan Kelas (terisi
dari profil, bisa diubah dan ikut tersimpan ke profil saat mulai), tombol **Mulai Petualangan** (aktif hanya
jika keduanya terisi; jika belum, muncul "Isi Nama Mahasiswa dan Kelas untuk memulai."), dan tombol
**Kerjakan LKM**.

Di bawahnya untuk semua: tombol **Cara Bermain** dan **Setting Peluang** (tidak ada angka peluang di menu, karena
peluang dirahasiakan sampai rekap), dan, jika peluang latihan aktif, catatan "Mode
latihan: peluang diubah lewat Setting Peluang, jadi hasil permainan tidak disimpan dan tidak dipakai LKM."
dengan tombol **Kembali ke Peluang Bawaan**.

### 6.2 Cara Bermain (sudah jalan)

Penjelasan singkat (5 tahap, tebas sampai HP arca 20%, Serangan Penentu, satu tahap = satu percobaan
Bernoulli, MENANG (X = 1) atau KALAH (X = 0), p tidak berubah karena cara bermain, menang atau kalah tetap
lanjut), kontrol laptop dan HP dalam format "tombol: aksi", lalu tips.

### 6.3 Setting Peluang (sudah jalan, hanya latihan)

- Mengisi p tiap tahap: angka di antara 0 dan 1, paling banyak dua desimal (contoh 0,45), setiap tahap
  berbeda. Kotaknya dimulai kosong; peluang bawaan tidak ditulis di layar ini agar tetap rahasia sampai rekap.
- Tombol **Pakai untuk Latihan** dan **Kembalikan Bawaan**.
- Peluang latihan hanya berlaku di tab browser itu (sessionStorage) sampai tab ditutup atau dikembalikan.
- Permainan latihan ditandai "Mode latihan" di rekap dan PDF, **tidak disimpan ke akun, dan tidak dipakai LKM**.
- Tautan `?p=` dan penyimpanan permanen versi lama sudah dihapus.

### 6.4 Pilih karakter (sudah jalan)

Tubuh, warna kulit, 5 gaya rambut, 6 warna rambut, 8 warna baju, 4 warna celana, aksesori, tombol Acak dan
Pilih. Hanya tampilan.

### 6.5 Satu tahap permainan (sudah jalan)

1. **Percakapan singkat** gaya visual novel: Resi Bayang, Arca Durgaraksa, dan pemain. Ketuk atau Enter untuk
   lanjut, Lewati untuk melewati.
2. **Pembuka tahap**: nama tahap, kondisi pemain dan arca, kotak "Peluang menang dan kalah tahap ini dirahasiakan.
   Kamu akan melihatnya di rekap setelah selesai bermain.", keterangan "Hasil tahap ini ditentukan oleh satu undian
   dengan peluang menang yang sudah ditetapkan sebelum bertarung.", pesan Resi, dan di tahap 1 daftar kontrol. Tombol **Mulai Pertarungan** dan
   **Berhenti dan Lihat Rekap**.
3. **Fase hack and slash**: HUD (nama tahap, HP pemain, bar HP arca dengan tanda 20%, tulisan "Peluang: rahasia
   sampai rekap", tabel mini T1 sampai T5, tombol jeda); ramuan dan gulungan sihir muncul di arena.
4. **Serangan Penentu**: dipicu yang lebih dulu terjadi antara HP arca 20% ("gacha serangan") atau HP pemain
   1 ("gacha kabur"). Bilah sinematik, potongan kamera, kotak peluang yang dirahasiakan, catatan "Tombol yang muncul hanya
   mengubah gaya serangan, bukan peluang menang", tiga QTE (hanya animasi), lalu satu undian dan hasil besar
   MENANG (X = 1) atau KALAH (X = 0). Baris "U < p" tidak ditampilkan karena memperlihatkan p.
5. **Hasil tahap**: judul hasil, baris "Tercatat: Tahap 1 · Tanpa perlengkapan · X = 1" (tanpa p),
   baris pemicu, tombol **Lanjut ke Tahap Berikutnya** (di tahap 5: **Lihat Rekap**) dan **Berhenti dan Lihat
   Rekap**. Jika kalah, Resi Bayang membangkitkan pemain (efek dissolve) sebelum lanjut.

### 6.6 Menu jeda dan konfirmasi berhenti (sudah jalan)

- Menu jeda: Lanjut Bertarung, Daftar Kontrol, Layar Penuh, Efek gerak (Nyaman/Penuh), Berhenti dan Lihat
  Rekap.
- Konfirmasi berhenti: "Yakin berhenti? Tahap yang belum dimainkan dicatat "Tidak dimainkan": tidak dihitung
  menang atau kalah. Setelah itu rekap langsung tampil." Tombol **Ya, berhenti** dan **Batal**. Tidak bisa
  dibuka saat percakapan, Serangan Penentu, atau kebangkitan.

### 6.7 Rekap (sudah jalan, ringkas)

Rekap sengaja **hanya berisi hasil menang dan kalah**; semua perhitungan peluang dikerjakan mahasiswa di LKM.

- Judul "Rekap Adventure Bernoulli", Universitas Sriwijaya · by Kelompok 17, kalimat "Berikut catatan
  pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa.", Nama Mahasiswa, Kelas, tanggal.
- Pesan penutup Resi Bayang.
- Kalimat pembuka ditambah "Peluang menang yang dirahasiakan selama bermain sekarang diperlihatkan."
- Tabel 4 kolom: Tahap, Kondisi, Peluang menang (p), Hasil (Menang / Kalah / Tidak dimainkan). Rekap adalah tempat
  pertama mahasiswa melihat peluang. Peluang kalah sengaja tidak ditulis karena soal 2 langkah 2 LKM meminta
  mahasiswa menentukannya sendiri.
- Di bawah tabel ada penjelasan: "Inilah peluang menang yang sudah diatur untuk setiap tahap tadi. Menang atau
  kalahmu di setiap tahap ditentukan oleh satu undian dengan peluang itu, bukan oleh cara bermainmu." ditambah
  satu contoh dari hasil mahasiswa sendiri (diutamakan tahap yang menang dengan peluang kecil atau kalah dengan
  peluang besar). Penjelasan yang sama ada di PDF rekap.
- Ringkasan: Tahap dimainkan, Menang, Kalah, Tidak dimainkan. Jika tidak ada tahap dimainkan: "Belum ada
  percobaan yang dilakukan."
- Status penyimpanan ke akun: "Menyimpan hasil ke akunmu...", "Koneksi lambat. Jangan tutup halaman ini; ...",
  "Hasil permainan tersimpan di akunmu. Sekarang kerjakan LKM.", atau "Gagal menyimpan. Periksa koneksi, lalu
  tekan Simpan Ulang." dengan tombol **Simpan Ulang**.
- Tombol: **Unduh PDF Rekap**, **Buka PDF di Tab Baru**, **Kerjakan LKM** (muncul setelah tersimpan),
  **Kembali ke Menu Utama** (ditahan sampai penyimpanan selesai).
- Disimpan hanya jika memakai p bawaan dan minimal 1 tahap dimainkan, sekali per permainan.

### 6.8 PDF rekap (sudah jalan)

Isi sama dengan rekap: kepala (Adventure Bernoulli, Universitas Sriwijaya, by Kelompok 17), kalimat pembuka,
Nama Mahasiswa, Kelas, Tanggal, catatan mode latihan bila ada, tabel Tahap, Kondisi, Peluang menang (p), Hasil, dan ringkasan.
Tanpa rumus, tanpa refleksi, tanpa umpan balik aplikasi. Nama file `Rekap_Bernoulli_<nama>.pdf`.

## 7. LKM digital (sudah jalan untuk mahasiswa)

LKM = Lembar Kerja Mahasiswa. Nama file, ID elemen, dan koleksi Firestore di kode masih memakai "lkpd" agar
data dan aturan akses tidak berubah.

### 7.1 Prinsip

- **Tampilan 1:1 dengan LKM revisi Kelompok 17** ("LKM Distribusi Bernoulli: Adventure Bernoulli"). Halaman 1
  sampai 5 adalah gambar asli LKM (`assets/lkpd/hal-1.png` sampai `hal-5.png`, 200 dpi) yang tidak diubah
  sedikit pun. Kolom isian ditempel tepat di atas kotak jawaban, sel tabel, garis identitas, dan titik-titik.
  Halaman 6 (harapan jawaban dan rubrik, "Untuk dosen dan validator") **tidak ditampilkan ke mahasiswa**.
- Hanya tentang percobaan dan distribusi Bernoulli. Tidak ada materi binomial, nilai harapan, atau variansi.
- Tidak ada koreksi otomatis. Penilaian dilakukan kelompok di luar website memakai rubrik halaman 6.

### 7.2 Akses dan data permainan

| Keadaan | Perilaku |
|---|---|
| Belum ada permainan tersimpan | "Mainkan game dulu dengan peluang bawaan, minimal sampai tahap 3. Setelah layar rekap muncul, LKM bisa dibuka." |
| Permainan terakhir berhenti sebelum tahap 3 | LKM belum bisa dibuka: "Permainan terakhirmu berhenti di tahap n. Sesuai petunjuk LKM, mainkan game minimal sampai tahap 3 ...". Di rekap muncul pesan yang sama dan tombol Kerjakan LKM disembunyikan |
| LKM belum dikirim | Memakai permainan **terbaru** mahasiswa |
| Mahasiswa bermain lagi sebelum mengirim | Muncul "Datamu berubah karena kamu bermain lagi. Periksa kembali jawabanmu." |
| LKM sudah dikirim | Permainan yang dipakai saat dikirim **dikunci** |
| Cara membuka | Tombol Kerjakan LKM di menu atau di rekap |

### 7.3 Isi halaman (dari LKM revisi)

| Halaman | Isi LKM | Yang bisa diisi mahasiswa |
|---|---|---|
| 1. Sampul | Lembar Kerja Mahasiswa, "Adventure Bernoulli: Eksplorasi Distribusi Bernoulli", "Catatan Pertarungan di Kerajaan Swarnadwipa", kotak Identitas, ilustrasi Pengembara, Arca Durgaraksa, dan Resi Bayang, Universitas Sriwijaya · Kelompok 17 | **Nama**, **NIM**, **Kelas** di garis identitas |
| 2. Tujuan dan petunjuk | Tujuan Pembelajaran (mengidentifikasi ciri percobaan Bernoulli; menemukan fungsi peluang distribusi Bernoulli; menjelaskan percobaan dan distribusi Bernoulli dengan bahasa sendiri), Petunjuk Pengerjaan LKM, Petunjuk Penggunaan Game | Tidak ada isian |
| 3. Bagian A dan awal Bagian B | Soal 1 (hasil Serangan Penentu dan banyaknya), soal 2 (tabel 5 tahap: peluang menang, peluang kalah, centang Menang/Kalah, peluang dari hasil yang didapat), soal 3 (cara menentukan peluang kalah), soal 4 (berapa kali Serangan Penentu dalam satu tahap), soal 5 (apakah peluang tahap 3 masih 0,7) | Kotak soal 1, 3, 4, 5; sel tabel soal 2 |
| 4. Bagian B dan C | Soal 6 (pengaruh hasil tahap 1 pada tahap 2), Kotak Informasi 1 (percobaan Bernoulli, X = 1, X = 0, p, q), soal 7 (tabel tahap 3: P(X = 1) = ..., P(X = 0) = ...), soal 8 (P(X = 1) = ... dan P(X = 0) = ... dengan p dan q), soal 9 (tabel x, pˣ, q¹⁻ˣ, kolom terakhir; lalu pertanyaan cara mengoperasikan) | Kotak soal 6 dan 9; titik-titik soal 7 dan 8 (huruf tebal); 6 sel tabel soal 9 |
| 5. Bagian D | Kotak Informasi 2 (peubah acak, berdistribusi Bernoulli, fungsi peluang P(X = x) = pˣ × q¹⁻ˣ), soal 10 (apa itu percobaan Bernoulli; apa itu distribusi Bernoulli), Refleksi, "[ Kirim LKM ] [ Unduh LKM (PDF) ]", catatan "Setelah LKM dikirim, materi distribusi Bernoulli dapat dibuka di website sebagai rangkuman." | Kotak soal 10 bagian 1 dan 2, kotak refleksi; tulisan tombol di gambar bisa diketuk |

### 7.4 Cara mengisi

- **Satu halaman per layar.** Tombol **Sebelumnya**, nomor halaman 1 sampai 5, **Berikutnya**, penanda
  "Halaman n dari 5".
- **Semua isian wajib.** Berikutnya (dan nomor halaman di depan) baru bisa dibuka jika semua isian halaman itu
  terisi; yang kosong ditandai merah: "Masih ada n isian kosong di halaman n (ditandai merah). Isi semuanya
  dulu, lalu lanjut."
- **Ketuk lalu tulis** langsung di kotak. Baris tulisan jatuh tepat di atas garis titik-titik kotak LKM. Jawaban
  panjang bisa digulir di dalam kotak. Di soal 10, baris pertama dimulai setelah nomor "1." dan "2.".
- **Titik-titik "..."** (soal 7 dan 8) diisi dengan huruf tebal di atas titik-titiknya; huruf mengecil sendiri
  bila ruangnya sempit.
- **Tabel soal 2:** centang Menang atau Kalah, satu per baris, ketuk lagi untuk menghapus. Tahap yang tidak
  dimainkan diarsir tipis dan otomatis berisi "-" (sesuai langkah 5 soal 2); barisnya tidak perlu diisi.
- **Mengikuti progres permainan:** di atas lembar tampil hasil tiap tahap (T1 Menang, T2 Kalah, T3 -, ...) dan
  "Tahap terakhir yang dimainkan: n".
- **Zoom:** cubit dua jari di lembar (HP), Ctrl + gulir atau tombol −, +, dan **Pas Layar** (laptop). Di HP,
  kotak yang diketuk otomatis diperbesar selebar layar. Selama LKM terbuka, zoom bawaan browser dimatikan.
- **Huruf jawaban:** Arial biru tua, sekitar 10,6 pt.
- **Simpan otomatis** sekitar 0,6 detik setelah berhenti mengetik: "Menyimpan...", "Tersimpan", "Koneksi
  lambat. ...", atau "Gagal menyimpan. ...". Penanda "n% isian terisi".

### 7.5 Tombol Rumus (papan rumus mirip keyboard GeoGebra)

- Tombol **Rumus** di kiri bawah (sesuai petunjuk LKM "tekan tombol Rumus") membuka papan di bagian bawah
  layar; tombol ✕ menutupnya. Selama papan terbuka, keyboard bawaan HP tidak muncul. Tombol **Keyboard HP**
  menutup papan dan memunculkan keyboard HP.
- Tab **123**: 0 sampai 9, × ÷ ( ) + − = ≠ , . < > · / %, panah kursor, hapus, spasi, baris baru.
- Tab **f(x)**: x², mode pangkat xⁿ, mode indeks x₂, √, π, ±, p, q, x, X, n, =, P(X = x), E(X), Var(X),
  pˣ · q¹⁻ˣ, 1 − p, ≤, ≥.
- Tab **ABC**: huruf a sampai z, huruf besar (⇧), tanda baca.
- Batas: pangkat memakai karakter Unicode, jadi pecahan bertingkat tidak bisa (ditulis 1/2), dan huruf q tidak
  punya bentuk pangkat.

### 7.6 Bar halaman 5, pengiriman, dan rangkuman

| Fitur | Perilaku |
|---|---|
| Bar halaman 5 | **Kirim LKM**, **Lihat Hasil**, **Unduh LKM (PDF)**, **Ajukan Perubahan** (setelah terkirim), **Buka Rangkuman Materi** (setelah dikirim) |
| Syarat | Kirim, Lihat Hasil, dan Unduh hanya jalan jika semua isian halaman 1 sampai 5 terisi |
| Kirim LKM | Konfirmasi sekali ("... hanya bisa diubah dengan persetujuan dosen. Tekan Kirim LKM sekali lagi"), lalu "LKM terkirim. Terima kasih! Rangkuman materi distribusi Bernoulli sekarang bisa dibuka." |
| Lihat Hasil | Nama, NIM, Kelas, status, progres permainan (Tahap, p, Hasil; jumlah menang dan kalah), semua jawaban |
| Unduh LKM (PDF) | 5 halaman persis seperti di layar ditambah 1 halaman **Hasil Singkat**. Jawaban yang terlalu panjang dikecilkan; jika masih tidak muat, lanjutannya di Hasil Singkat. Nama file `LKM_Bernoulli_<nama>.pdf` |
| Ajukan Perubahan | Mahasiswa menulis alasan singkat (maks. 300 karakter); status "Menunggu persetujuan dosen untuk mengubah jawaban." Tombol ini hanya di bar, karena LKM revisi tidak mencantumkannya |
| Rangkuman Materi | Layar "Rangkuman: Distribusi Bernoulli", terbuka setelah LKM dikirim: percobaan Bernoulli dan cirinya di game, q = 1 − p dengan tabel p dan q kelima tahap, peubah acak dan distribusi Bernoulli, fungsi peluang, contoh tahap 3. Isinya hanya dari Kotak Informasi 1 dan 2 serta harapan jawaban LKM (`js/materi.js`) |

### 7.7 Status LKM

`draf` (bisa diisi) → `terkirim` (terkunci) → `minta-ubah` (menunggu dosen) → `dibuka` (boleh diubah lalu dikirim
lagi) atau kembali `terkirim` jika ditolak.

## 8. Halaman dosen (belum dibuat, Tahap C)

Rencana yang sudah disetujui sebagian:
- Akun dosen (4 email dari pemilik) dibuat pemilik di Firebase Console dan dikenali dari UID di koleksi `guru`.
- Melihat LKM tiap mahasiswa **persis seperti yang mereka isi** (tampilan 1:1, hanya baca) dan mengunduhnya.
- Daftar mahasiswa per kelas, hasil permainan, status dan kemajuan LKM.
- Tombol Setujui dan Tolak untuk pengajuan perubahan.
- Hapus data mahasiswa agar mahasiswa bisa mengulang.
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
- Percobaan Bernoulli, q = 1 − p, peubah acak, dan fungsi peluang P(X = x) = pˣ × q¹⁻ˣ ditemukan mahasiswa di LKM
  (Kotak Informasi 1 dan 2) dan dirangkum di layar Rangkuman Materi setelah LKM dikirim; tidak
  dihitung di rekap.
- Format angka memakai koma desimal (0,6) di HUD, layar hasil, rekap, LKM, dan PDF.

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
guru/{uid}                       diisi manual dengan UID akun dosen
users/{uid}                      nama, kelas, kelasKey, email, dibuat, diperbarui
users/{uid}/permainan/{id}       p, x (5 nilai: 1, 0, atau null), karakter, mulai, selesai
users/{uid}/lkpd/jawaban         isian, status, progres, permainanId, dikirim, diperbarui,
                                 alasanUbah, diputuskanOleh, diputuskanPada
```

ID isian LKM: `nama`, `nim`, `kelas`, `s1`, `t1_p` sampai `t5_p`, `t1_q` sampai `t5_q`, `t1_hasil` sampai
`t5_hasil`, `t1_ph` sampai `t5_ph`, `s3`, `s4`, `s5`, `s6`, `s7_1`, `s7_0`, `s8_1`, `s8_0`, `s9_p0`, `s9_q0`, `s9_h0`,
`s9_p1`, `s9_q1`, `s9_h1`, `s9`, `s10_1`, `s10_2`, `refleksi`.

Aturan akses (`firestore.rules`, harus diterbitkan di Console):
- Mahasiswa hanya membaca dan menulis datanya sendiri; dosen membaca semua.
- Permainan hanya bisa disimpan dengan p 50, 60, 70, 40, 30 dan tidak bisa diubah setelah tersimpan.
- LKM bisa diubah mahasiswa saat `draf` atau `dibuka`; setelah `terkirim` mahasiswa hanya bisa mengajukan perubahan;
  dosen hanya mengubah status keputusan.
- Hanya dosen yang bisa menghapus data mahasiswa.

Di browser hanya tersimpan: pilihan Efek gerak (localStorage) dan peluang latihan (sessionStorage).
Nama, NIM, email, dan jawaban mahasiswa adalah data pribadi (UU 27/2022 tentang Pelindungan Data Pribadi);
persetujuan pemakaiannya diurus kelompok.

## 12. Gaya visual

- Dunia: ruang singgasana batu, emas kusam, api obor, arca kuno. Model kotak-kotak dengan toon shading dan
  garis tepi.
- Palet antarmuka: batu gelap hangat (`--bg #14110d`, `--panel #1f1a14`, `--panel-2 #2b241b`), garis emas kusam
  (`--line #4a3d28`), teks perkamen (`--text #f3ead8`), aksen emas `#f6c453`, hijau menang `#3ecf8e`, merah
  kalah `#ff6b6b`. Ungu hanya untuk Resi Bayang.
- Huruf: Cinzel untuk judul, font sistem untuk isi. LKM memakai tampilan asli LKM revisi (krem, bingkai emas); jawaban Arial biru tua.
- Tombol: primer emas, sekunder batu gelap bergaris emas tipis, bahaya merah bata; sudut 10 px.
- Ikon: SVG garis, bukan emoji. Papan rumus memakai warna terang ala GeoGebra dengan aksen ungu `#6557d2`.

## 13. Bahasa dan nada

Bahasa Indonesia yang jelas, singkat, dan ramah untuk mahasiswa. Tombol menyebut akibatnya ("Berhenti dan Lihat
Rekap", "Buka PDF di Tab Baru", "Kirim LKM").

## 14. Aksesibilitas dan tampilan di berbagai layar

- Fokus keyboard terlihat; semua isian LKM punya label untuk pembaca layar.
- MENANG, KALAH, dan Tidak dimainkan dibedakan dengan teks, bukan hanya warna. Kontras teks minimal 4,5:1.
- Perangkat sentuh: tombol aksi game minimal 54 px (Tebas 66 px); tombol jeda, suara, layar penuh 48 px; zona
  aman poni memakai `env(safe-area-inset-*)`.
- Zona aman kanan bawah (`--safe-bottom`) dipertahankan untuk badge hosting.
- Portrait: menu, rekap, dan LKM bisa digulir tanpa scroll ke samping (diuji di 360, 768, 1366, 1920 px).

## 15. Ketahanan terhadap kasus pinggir

- Nama atau Kelas kosong atau hanya spasi: tombol Mulai nonaktif dengan petunjuk.
- Emoji dan simbol yang tidak bisa dicetak di PDF dihapus dari nama dan kelas, dengan pesan.
- Internet putus atau CDN gagal: "Game membutuhkan koneksi internet. Periksa koneksi lalu muat ulang halaman."
  dengan tombol Muat Ulang.
- Dibuka dengan klik dua kali `index.html` (file://): pesan cara membuka yang benar.
- Klik ganda tombol penting tidak menjalankan aksi dua kali.
- Penyimpanan gagal: hasil permainan bisa disimpan ulang; jawaban LKM dicoba lagi saat mahasiswa mengetik.

## 16. Tes

- `npm test`: 12 tes Node untuk `js/bernoulli.js` dan data `js/config.js`.
- `?test=1`: tes browser, termasuk 10.000 undian p = 60 yang harus memberi frekuensi 0,58 sampai 0,62.
- LKM diuji dengan Firebase tiruan di Playwright (lebar 360, 768, 1366, 1920 px). Firebase asli harus diuji di
  Vercel.

## 17. Struktur folder

```
index.html, .nojekyll, README.md, PRODUCT.md, package.json, firestore.rules
css/style.css
tests/bernoulli.test.js
assets/lkpd/hal-1.png ... hal-5.png   gambar asli halaman LKM (jangan diedit)
docs/  tutorial-firebase.md, rancangan-firebase.md, spesifikasi-login-dan-lkpd.md,
       LKPD-struktur-dan-isi.md, LKPD-Distribusi-Bernoulli.docx/.pdf, Panduan-Firebase-dan-Fitur-LKPD.docx/.pdf
       (tiga dokumen LKPD terakhir adalah draf lama sebelum LKM revisi; disimpan sebagai arsip)
js/  bernoulli.js  config.js  main.js  player.js  boss.js  mystic.js  arena.js
     controls.js  combat.js  stages.js  ui.js  shaders.js  pdf.js  audio.js  browser-tests.js
     cutscene.js  qte.js  potions.js  spells.js  settings.js  teacher.js
     firebase-config.js  akun.js  masuk.js  lkpd.js  lkpd-lembar.js  papan-rumus.js  materi.js
```

`js/teacher.js` adalah layar Setting Peluang (nama file lama), bukan halaman dosen.

## 18. Keterbatasan yang diketahui

- Butuh internet untuk Three.js, jsPDF, Firebase, dan font.
- Belum diuji di Safari atau iPhone, dan Firebase asli belum diuji dari lingkungan pengembangan.
- Halaman dosen belum ada; sampai dibuat, pengajuan perubahan LKM belum bisa diputuskan dari website.
- Teks LKM tidak bisa diubah dari website karena memakai gambar asli. Beberapa kalimat LKM revisi belum sama
  dengan game, dan perbaikannya harus di dokumen LKM kelompok:
  - Petunjuk Penggunaan Game nomor 1: "Masuk dengan akun Google, lalu isi nama dan kelas". Game memakai
    **email dan kata sandi**, bukan Google (keputusan pemilik).
  - Petunjuk nomor 2: "Jika kalah sebelum tahap 3, ulangi permainan". Di game, kalah tidak menghentikan
    permainan (menang atau kalah tetap lanjut), jadi tahap 3 hanya tidak tercapai jika mahasiswa menekan
    Berhenti. Website memakai aturan "minimal sampai tahap 3" itu.
  - Bagian A: "Kerajaan Swarnadwipa dijaga oleh para penguasa dungeon". Di game hanya ada satu lawan, Arca
    Durgaraksa, di ruang singgasana.
  - Halaman 5 hanya mencantumkan Kirim LKM dan Unduh LKM; tombol Ajukan Perubahan tetap ada di bar website
    sesuai keputusan pemilik.
  - Harapan jawaban soal 9 di halaman 6 berakhir pada "Rumusnya adalah" tanpa rumus.
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
- **Login email dan kata sandi** (bukan Google). Mahasiswa mendaftar sendiri; akun dosen dibuat pemilik di Console
  dan dikenali dari UID. Ini pengecualian tertulis untuk aturan 3 dan mengganti prinsip "tanpa backend";
  aturan 6 tetap berlaku (pustaka dari CDN, tanpa npm).
- **Permainan** tahap 1 sampai 5 dengan p bawaan; boleh berhenti sebelum tahap 5. LKM revisi meminta
  permainan **minimal sampai tahap 3**; jika berhenti lebih awal, mahasiswa bermain lagi dan LKM memakai
  permainan terbaru sampai LKM dikirim.
- **Rekap dan PDF rekap ringkas:** hanya menang dan kalah. Rumus, perhitungan, dan refleksi pindah ke LKM.
  Keputusan ini mengesampingkan aturan 2 (isi perhitungan PDF) dan aturan 4 khusus untuk rekap dan PDF.
  Layar hasil tahap dan Serangan Penentu tetap menampilkan X.
- **Peluang dirahasiakan selama bermain (saran dosen):** menu, Setting Peluang, pembuka tahap, HUD, Serangan
  Penentu, dan hasil tahap tidak menampilkan angka peluang; peluang menang tiap tahap baru diperlihatkan di
  rekap. Akibatnya kalimat LKM revisi yang menyuruh membaca kotak peluang selama bermain (petunjuk game nomor 3,
  soal 2 langkah 1, soal 5) perlu direvisi kelompok. Dialog Resi tidak menyebut angka; Resi hanya menyatakan
  bahwa peluang menang dan kalah sudah diatur sebelum bertarung dan angkanya diberitahukan di akhir.
- **LKM 1:1 dengan LKM revisi kelompok** (menggantikan LKPD draf lama; istilah siswa menjadi mahasiswa, LKPD
  menjadi LKM, guru menjadi dosen): gambar asli tidak diubah; isian ditempel di atas kotak dan garisnya; Nama,
  NIM, dan Kelas diisi di sampul; titik-titik menjadi isian berhuruf tebal; satu halaman per layar; semua isian
  wajib; zoom dengan cubit; tombol Rumus untuk papan rumus; bar halaman 5 berisi Kirim LKM, Lihat Hasil, Unduh
  LKM (PDF); rangkuman materi terbuka setelah LKM dikirim.
- **Jika kelompok merevisi LKM:** versi digital mengikuti revisi dengan cara yang sama. PDF revisi diubah
  menjadi gambar `assets/lkpd/hal-N.png` (200 dpi) tanpa diubah isinya, lalu posisi setiap kotak, sel tabel,
  garis, dan titik-titik diukur ulang di `BIDANG` (`js/lkpd-lembar.js`). Titik-titik atau garis kosong
  dijadikan isian di tempatnya.
- **Setelah LKM dikirim**, perubahan hanya dengan persetujuan dosen. Dosen juga bisa menghapus data mahasiswa agar
  mahasiswa mengulang.
- **Penilaian** dilakukan kelompok di luar website; tidak ada koreksi otomatis.
- **Hosting Vercel**; zona aman kanan bawah dipertahankan.
- Fitur game yang dipertahankan: Efek gerak Nyaman/Penuh, kustomisasi karakter, percakapan gaya visual
  novel, QTE (hanya animasi), ramuan, gulungan sihir, musik latar, dan Serangan Penentu yang juga dipicu saat
  pemain sekarat (peluang tetap p tahap itu).

Dokumen rinci: `docs/spesifikasi-login-dan-lkpd.md` (fitur), `docs/rancangan-firebase.md` (rancangan
teknis), `docs/tutorial-firebase.md` (pemasangan Firebase), LKM revisi kelompok (PDF dari pemilik) untuk isi LKM.
