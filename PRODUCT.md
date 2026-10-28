# PRODUCT.md: Adventure Bernoulli

Dokumen ini adalah gambaran lengkap game: isi, alur, konsep, tampilan, teknologi, aturan kerja, dan
keputusan pemilik proyek. Semua angka di dokumen ini diambil dari kode (`js/config.js`,
`js/bernoulli.js`, `js/pdf.js`, `css/style.css`), bukan perkiraan.

## 1. Ringkasan produk

- **Nama:** Adventure Bernoulli.
- **Jenis:** game edukasi 3D hack and slash berbasis browser untuk mengajarkan distribusi Bernoulli.
- **Pembuat:** Kelompok 17, Universitas Sriwijaya.
- **Hosting:** website statis di Vercel (sebelumnya Netlify). Tanpa build tool. npm hanya untuk tes di
  komputer pengembang.
- **Backend (Tahap A dan B sudah dikodekan: login, profil, simpan permainan, rekap ringkas, LKPD siswa; akun guru belum):** Firebase Authentication (email dan kata sandi) dan Cloud Firestore
  untuk menyimpan hasil permainan dan LKPD per siswa, serta akun guru. Rancangan:
  `docs/rancangan-firebase.md`.
- **Teknologi:** HTML, CSS, JavaScript murni (ES module), Three.js 0.160.0 lewat import map dari
  jsDelivr, jsPDF 2.5.1 dari cdnjs, font Cinzel dari Google Fonts.

## 2. Pengguna

- Siswa kelas XII, Matematika Tingkat Lanjut, Fase F (kelas pasti mengikuti ATP sekolah mitra), bermain
  dan mengerjakan LKPD secara asinkron, 1 siswa 1 perangkat.
- Guru (4 email yang ditentukan pemilik), memantau hasil siswa lewat akun guru.
- Perangkat: laptop (utama) dan HP Android (lebar 360 sampai 412 piksel; bermain dalam landscape,
  menu dan rekap dalam portrait).
- Lama satu sesi: 15 sampai 20 menit.

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

## 5. Alur layar

1. **Menu utama**: langit berbintang, siluet kastil, kartu menu. Isi: Universitas Sriwijaya, judul,
   by Kelompok 17, input Nama Siswa (maks. 40 karakter) dan Kelas (maks. 15 karakter), tombol Mulai
   Petualangan (aktif hanya jika keduanya terisi), Cara Bermain, Setting Peluang, keterangan sumber p,
   dan tombol Layar Penuh.
2. **Cara Bermain**: penjelasan singkat, kontrol laptop dan HP (format "tombol: aksi"), lalu tips.
3. **Setting Peluang**: mencoba p tiap tahap sebagai latihan (angka di antara 0 dan 1, paling banyak dua
   desimal, setiap tahap berbeda). Tombol Pakai untuk Latihan dan Kembalikan Bawaan. Peluang latihan hanya
   berlaku di tab itu (sessionStorage); hasil latihan tidak disimpan dan tidak dipakai LKPD. Tautan `?p=`
   dihapus.
4. **Pilih karakter**: tubuh, warna kulit, 5 gaya rambut, 6 warna rambut, 8 warna baju, 4 warna
   celana, aksesori, tombol Acak dan Pilih. Hanya tampilan.
5. **Percakapan singkat** (gaya visual novel) sebelum setiap tahap: Resi Bayang, Arca Durgaraksa, dan
   pemain. Ketuk atau Enter untuk lanjut, Lewati untuk melewati.
6. **Pembuka tahap**: nama tahap, kondisi pemain dan arca, kotak peluang ("Peluang menang: 50% (1/2 =
   0,5)" dan "Peluang kalah: ..."), keterangan "Peluang bukan jaminan: dari 100 pertarungan seperti
   ini, kira-kira 50 berakhir menang.", pesan Resi, dan di tahap 1 daftar kontrol. Tombol Mulai
   Pertarungan dan Berhenti dan Lihat Rekap.
7. **Fase hack and slash**: HUD (nama tahap, HP pemain, bar HP arca dengan tanda 20%, kotak peluang
   ringkas Menang/Kalah, tabel mini T1 sampai T5, tombol jeda), ramuan dan gulungan sihir muncul di
   arena.
8. **Serangan Penentu**: dipicu yang lebih dulu terjadi antara HP arca 20% ("gacha serangan") atau HP
   pemain 1 ("gacha kabur"). Bilah sinematik, potongan kamera, kotak peluang, catatan "Tombol yang
   muncul hanya mengubah gaya serangan, bukan peluang menang", tiga QTE (hanya animasi), lalu satu
   undian dan hasil besar MENANG (X = 1) atau KALAH (X = 0).
9. **Hasil tahap**: judul hasil, baris "Tercatat: Tahap 1 · Tanpa perlengkapan · p = 0,5 · 1 - p = 0,5
   · X = 1", baris pemicu, tombol Lanjut ke Tahap Berikutnya (di tahap 5: Lihat Rekap) dan Berhenti dan
   Lihat Rekap. Jika kalah, Resi Bayang membangkitkan pemain (efek dissolve) sebelum lanjut.
10. **Menu jeda**: Lanjut Bertarung, Daftar Kontrol, Layar Penuh, Efek gerak (Nyaman/Penuh), Berhenti
    dan Lihat Rekap.
11. **Konfirmasi berhenti**: "Yakin berhenti? Tahap yang belum dimainkan dicatat "Tidak dimainkan":
    tidak dihitung menang atau kalah. Setelah itu rekap langsung tampil." Tombol Ya, berhenti dan
    Batal. Tidak bisa dibuka saat percakapan, Serangan Penentu, atau kebangkitan.
12. **Rekap**: identitas (nama, kelas, karakter, tanggal, sumber p), pesan penutup Resi, tabel 9 kolom
    (Tahap, Kondisi, p, 1 - p, Hasil, X, P(hasil), E(X), Var(X)), rumus, keterangan kolom P(hasil),
    E(X), Var(X), ringkasan (tahap dimainkan, menang, kalah), peluang urutan hasil, jumlah menang yang
    diharapkan, catatan "bukan distribusi binomial", tiga pertanyaan refleksi, tombol Unduh PDF Rekap,
    Buka PDF di Tab Baru, Kembali ke Menu Utama.
13. **PDF rekap**: isi yang sama dengan rekap ditambah garis jawaban tulisan tangan untuk refleksi.
    Nama file `Rekap_Bernoulli_<nama>.pdf` (karakter tidak aman diganti garis bawah).

Pertanyaan refleksi di rekap dan PDF:
1. Mengapa satu pertarungan melawan Arca Durgaraksa disebut satu percobaan Bernoulli?
2. Pada tahap dengan p terbesar (bawaan: tahap 3, p = 0,7), apakah kamu pasti menang? Jelaskan.
3. Apakah kalah di tahap 1 memengaruhi peluang menangmu di tahap 2? Mengapa?

## 6. Konsep yang diajarkan dan aturannya di kode

- Setiap tahap adalah satu percobaan Bernoulli dengan dua hasil saja: MENANG (X = 1) atau KALAH (X = 0).
- p dibaca sekali saat petualangan dimulai (peluang latihan Setting Peluang di tab itu jika ada, selain itu
  bawaan) dan dibekukan selama sesi.
- Serangan Penentu memanggil `decisiveRoll(p)` di `js/bernoulli.js`: satu bilangan acak U di [0, 1)
  dari `crypto.getRandomValues`, X = 1 jika U < p, selain itu X = 0. Satu undian per tahap, tidak bisa
  dibatalkan. Perhitungan memakai bilangan bulat perseratus agar tepat.
- Fase hack and slash hanya membawa pertarungan ke Serangan Penentu: HP arca berhenti di 20% dan HP
  pemain berhenti di 1.
- Menang atau kalah, pemain lanjut ke tahap berikutnya.
- Rekap memakai P(X = x) = p^x (1 - p)^(1 - x), E(X) = p, Var(X) = p(1 - p). Peluang urutan hasil adalah
  perkalian P(hasil) tahap yang dimainkan; jumlah menang yang diharapkan adalah jumlah p tahap yang
  dimainkan.
- Jumlah kemenangan dari 5 tahap bukan distribusi binomial karena p tiap tahap berbeda.
- Tahap yang tidak dimainkan karena berhenti dicatat "Tidak dimainkan", bukan kalah, dan tidak punya X.
- Format angka memakai koma desimal (0,6) di HUD, layar hasil, rekap, dan PDF.

## 7. Fitur permainan

- **Kontrol laptop:** W A S D bergerak, mouse memutar kamera (klik untuk mengunci kursor; jika ditolak,
  seret mouse), klik kiri tebas (combo 3), Space lompat, C atau Ctrl jongkok, Shift menghindar, Q sihir,
  Esc jeda. Lompat, jongkok, dan menghindar membatalkan tebasan.
- **Kontrol HP:** joystick kiri, geser sisi kanan untuk kamera, tombol Tebas, Lompat, Jongkok, Hindar,
  Sihir di kanan bawah, tombol jeda di kanan atas. Petunjuk "Putar HP ke mode landscape" muncul saat
  bertarung dalam portrait, tanpa mengunci orientasi.
- **Serangan arca dengan aba-aba:** hantaman (dua lengan diangkat, hindari dengan berguling), sapuan
  (satu lengan ditarik, hindari dengan jongkok), hentakan (satu kaki diangkat, gelombang di lantai,
  hindari dengan lompat).
- **Ramuan dan sihir:** Ramuan Darah +35 HP, Ramuan Serangan kerusakan 2 kali selama 15 detik, gulungan
  Bola Api (6 kali kerusakan tebasan) dan Petir (8 kali, arca terpaku 1,5 detik). Muncul tiap 8 detik,
  paling banyak 2 di arena.
- **Efek gerak Nyaman** (bawaan): guncangan dan kilatan layar diredam, kamera tidak berputar-putar.
- **Musik latar sintetis** (dengung, akor, derak obor, drum saat bertarung, detak jantung saat
  Serangan Penentu) dan efek suara. Tombol suara (ikon gong) selalu tersedia.
- **Kualitas grafis otomatis:** di HP dan saat fps di bawah 40, bloom, bayangan, dan sebagian partikel
  dimatikan.

## 8. Gaya visual

- Dunia: ruang singgasana batu, emas kusam, api obor, arca kuno. Model kotak-kotak dengan toon shading
  dan garis tepi.
- Palet antarmuka: batu gelap hangat (`--bg #14110d`, `--panel #1f1a14`, `--panel-2 #2b241b`), garis
  emas kusam (`--line #4a3d28`, garis panel `rgba(246, 196, 83, .45)`), teks perkamen (`--text #f3ead8`),
  aksen emas `#f6c453`, hijau menang `#3ecf8e`, merah kalah `#ff6b6b`. Aksen ungu dipakai hanya untuk
  Resi Bayang sebagai warna tokohnya.
- Huruf: Cinzel untuk judul, font sistem untuk isi.
- Tombol: primer emas seperti lempeng emas, sekunder batu gelap bergaris emas tipis, bahaya merah
  bata. Sudut 10 px, tidak berbentuk pil.
- Ikon: SVG garis emas (gong untuk suara, bingkai sudut untuk layar penuh), bukan emoji.
- Menu utama (langit berbintang, siluet kastil, kartu menu) dipertahankan tata letaknya.

## 9. Bahasa dan nada

Bahasa Indonesia yang jelas, singkat, dan ramah untuk siswa. Tombol menyebut akibatnya ("Berhenti dan
Lihat Rekap", "Buka PDF di Tab Baru").

## 10. Aksesibilitas dan tampilan di berbagai layar

- Fokus keyboard terlihat (garis emas), urutan Tab dimulai dari Nama Siswa.
- MENANG, KALAH, dan Tidak dimainkan dibedakan dengan teks, bukan hanya warna. Kontras teks minimal
  4,5:1.
- Perangkat sentuh: tombol aksi minimal 54 px (Tebas 66 px), jarak 10 px; tombol jeda, suara, dan layar
  penuh 48 px; zona aman poni memakai `env(safe-area-inset-*)`.
- Zona aman kanan bawah (`--safe-bottom`) untuk badge hosting seperti Netlify.
- Di HP landscape, tabel mini pindah ke bawah panel HP agar sisi kanan tidak menumpuk.
- Portrait: menu sampai rekap bisa digulir tanpa scroll ke samping; tabel rekap bergeser di dalam
  wadahnya sendiri.

## 11. Ketahanan terhadap kasus pinggir

- Nama atau Kelas kosong atau hanya spasi: tombol Mulai nonaktif dengan petunjuk.
- Emoji dan simbol yang tidak bisa dicetak di PDF dihapus saat mengetik, dengan pesan; huruf beraksen
  di luar Latin-1 diganti huruf dasarnya.
- Internet putus atau CDN gagal (termasuk menggantung 30 detik): pesan "Game membutuhkan koneksi
  internet. Periksa koneksi lalu muat ulang halaman." dengan tombol Muat Ulang.
- Dibuka dengan klik dua kali `index.html` (file://): pesan cara membuka yang benar.
- Klik ganda tombol Mulai Pertarungan, Lanjut, Ya berhenti, Unduh PDF, Buka PDF tidak menjalankan aksi
  dua kali.

## 12. Data dan privasi

- Saat ini: belum ada data yang dikirim ke server. Hasil hanya ada selama halaman terbuka. Setting Peluang dan
  pilihan Efek gerak disimpan di localStorage browser itu.
- Setelah rencana Firebase dikerjakan: nama, kelas, email, hasil permainan, dan jawaban LKPD
  disimpan di Firestore milik akun Firebase pemilik. Siswa hanya bisa membaca datanya sendiri; guru bisa
  membaca semua. Data siswa di bawah 18 tahun memerlukan persetujuan orang tua atau wali (Pasal 25 UU
  27/2022); izin diurus kelompok.

## 13. Tes

- `npm test`: 12 tes Node untuk `js/bernoulli.js` dan data `js/config.js`.
- `?test=1`: tes browser, termasuk 10.000 undian p = 60 yang harus memberi frekuensi 0,58 sampai 0,62.

## 14. Struktur folder

```
index.html, .nojekyll, README.md, PRODUCT.md, package.json
css/style.css
tests/bernoulli.test.js
docs/LKPD-struktur-dan-isi.md, docs/rancangan-firebase.md
js/  bernoulli.js  config.js  main.js  player.js  boss.js  mystic.js  arena.js
     controls.js  combat.js  stages.js  ui.js  shaders.js  pdf.js  audio.js  browser-tests.js
     cutscene.js  qte.js  potions.js  spells.js  settings.js  teacher.js
```

## 15. Keterbatasan yang diketahui

- Butuh internet untuk Three.js, jsPDF, dan font.
- Belum diuji di Safari atau iPhone.
- Setelah tab ditinggal lalu dibuka lagi, pengukur fps di `js/main.js` dapat menurunkan grafis laptop
  ke kualitas rendah secara permanen. Perbaikannya ada di loop render (area terlarang) dan menunggu izin
  pemilik.
- Siswa bisa membuka Setting Peluang untuk latihan; permainan latihan ditandai dan tidak disimpan.

## 16. Aturan untuk semua perintah impeccable berikutnya

1. Hanya boleh mengubah tampilan antarmuka HTML/CSS: menu utama, layar Cara Bermain, layar pilih karakter, HUD, dialog Resi Bayang, layar hasil tahap, konfirmasi berhenti, dan layar rekap.
2. DILARANG mengubah: `js/bernoulli.js`, `js/config.js` (termasuk nilai p 50, 60, 70, 40, 30), logika Serangan Penentu, logika fitur berhenti, logika pencatatan hasil, rumus dan isi perhitungan di PDF, scene Three.js, model 3D, kontrol, shader, dan tes.
3. DILARANG menambah fitur, layar, mode, tutorial, onboarding, pengaturan, atau sistem skor.
4. DILARANG mengubah teks konsep Bernoulli (X = 1, X = 0, p, 1 - p, E(X), Var(X), "bukan binomial", "Tidak dimainkan") kecuali memperbaiki salah ketik.
5. Identitas wajib tetap: Universitas Sriwijaya, by Kelompok 17, Kerajaan Swarnadwipa, Arca Durgaraksa, Resi Bayang.
6. Tidak boleh ada path absolut berawalan "/", dan game tidak boleh bergantung pada npm untuk berjalan.
7. Sebelum mengubah file apa pun, tunjukkan daftar perubahan dan tunggu persetujuan pemilik proyek.

## 17. Keputusan pemilik (sudah diputuskan)

- **Nilai p bawaan resmi: 50, 60, 70, 40, 30** (0,5; 0,6; 0,7; 0,4; 0,3), semuanya berbeda. Nilai ini
  yang dipertahankan dan tidak boleh diubah.
- **Setting Peluang tetap ada untuk latihan** (mencoba-coba p). Permainan biasa selalu memakai p bawaan;
  peluang latihan tidak tersimpan permanen dan tautan siswa `?p=` dihapus (keputusan pemilik setelah p
  latihan sempat terbawa ke permainan biasa).
- Fitur yang sudah ada dan dipertahankan: tombol "Efek gerak: Nyaman/Penuh" di menu jeda, kustomisasi
  karakter, percakapan singkat gaya visual novel, QTE di Serangan Penentu (hanya animasi), ramuan,
  gulungan sihir, musik latar, dan Serangan Penentu yang juga dipicu saat player sekarat (peluang tetap
  p tahap itu). Aturan 3 berlaku untuk penambahan baru.
- Hosting pindah ke Vercel. Zona aman kanan bawah tetap dipertahankan.
- **Rekap dan PDF akhir dibuat ringkas (diputuskan 23 Oktober 2026, belum dikerjakan):** hanya berisi
  identitas, tahap, kondisi, p, hasil (Menang/Kalah/Tidak dimainkan), jumlah menang serta kalah, dengan satu
  kalimat pembuka. Tidak ada umpan balik aplikasi. Kolom 1 - p, X, P(hasil), E(X), Var(X), rumus, peluang
  urutan, jumlah menang yang diharapkan, catatan "bukan binomial", dan pertanyaan refleksi dipindah ke
  LKPD agar jawabannya tidak tersedia di rekap. Keputusan ini mengesampingkan aturan 2 (isi perhitungan PDF) dan aturan 4 khusus untuk rekap
  dan PDF. Layar hasil tahap, HUD, dan Serangan Penentu tetap menampilkan p, 1 - p, dan X. Daftar
  perubahan kodenya menunggu persetujuan pemilik sebelum dikerjakan (aturan 7).

## 18. Rencana yang diminta pemilik: login, LKPD digital, dan akun guru

Penambahan ini atas permintaan langsung pemilik, jadi menjadi pengecualian tertulis untuk aturan 3, dan
mengganti prinsip "tanpa backend". Aturan 6 tetap berlaku: semua pustaka dimuat dari CDN, tanpa npm.

- **Login email dan kata sandi** (Firebase; bukan Google, keputusan pemilik). Siswa mendaftar sendiri dengan
  email, kata sandi, nama, dan kelas; akun guru dibuat pemilik di Console. Data tersimpan di
  akun sehingga bisa pindah perangkat.
- **Satu permainan per siswa** (tahap 1 sampai 5) dengan p bawaan. Tidak ada putaran kedua. Setting Peluang tetap
  terlihat untuk latihan; aturan database menolak permainan dengan p selain bawaan.
- **LKPD digital** hanya tentang distribusi Bernoulli (permintaan dosen), terbuka setelah permainan ber-p
  bawaan tercatat. LKPD memakai permainan terbaru sampai LKPD dikirim; setelah itu data dan jawaban terkunci. Struktur dan isi: `docs/LKPD-struktur-dan-isi.md`.
  Desain dari kelompok, ditampilkan 1:1: halaman 1 sampai 5 adalah gambar asli draf (`assets/lkpd/`,
  tidak boleh diubah), kolom isian ditempel di atas kotak jawabannya, satu halaman per layar, zoom dengan
  cubit, papan rumus mirip GeoGebra lewat tombol, semua isian wajib, Nama dan Kelas ditulis langsung di
  garis sampul, titik-titik "...." di soal juga menjadi isian (huruf tebal), dan bar halaman 5 berisi Kirim,
  Lihat Hasil, dan Unduh PDF. Tidak ada tanda benar/salah otomatis. Setelah
  dikirim, perubahan hanya dengan persetujuan guru. Rincian: `docs/spesifikasi-login-dan-lkpd.md` Bagian 4.
- **Jika kelompok merevisi LKPD** (keputusan pemilik): versi digital mengikuti revisi dengan cara yang sama.
  PDF revisi diubah menjadi gambar `assets/lkpd/hal-N.png` (200 dpi) tanpa diubah isinya, lalu posisi setiap
  kotak "Jawaban", sel tabel, garis isian, dan titik-titik "...." diukur ulang dan ditulis di `BIDANG`
  (`js/lkpd-lembar.js`). Bagian yang berupa titik-titik atau garis kosong dijadikan isian di tempatnya.
- **Akun guru** (4 email dari pemilik): memantau hasil permainan, PDF, progres dan jawaban LKPD,
  menyetujui pengajuan perubahan, menerbitkan data kelas. Penilaian dilakukan kelompok di luar website.
- Rancangan teknis: `docs/rancangan-firebase.md`; tutorial pemasangan: `docs/tutorial-firebase.md`;
  spesifikasi fitur: `docs/spesifikasi-login-dan-lkpd.md`. Tahapan: A (login dan data permainan), B (LKPD), C (akun
  guru), D (uji dan panduan).
