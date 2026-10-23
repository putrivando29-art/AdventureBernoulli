# LKPD Adventure Bernoulli: Struktur dan Isi

Dokumen kerja untuk Kelompok 17, Universitas Sriwijaya. Isinya struktur lengkap LKPD (Lembar Kerja
Peserta Didik) dari sampul sampai penutup, teks untuk siswa, kolom isian, kunci jawaban, rubrik,
petunjuk guru, dan catatan teknis untuk pengodean nanti. Desain visual menyusul dari kelompok.

Tanda keyakinan: **[Pasti]** untuk rumus baku dan hitungan yang bisa dicek, **[Kemungkinan Besar]**
untuk interpretasi sumber sekunder, **[Dugaan]** untuk perkiraan yang harus dicek kelompok.

---

## Bagian 0. Analisis sebelum menyusun

### 0.1 Apa yang sudah dikerjakan game, dan apa yang belum

Keputusan pemilik (23 Oktober 2026): rekap dan PDF di akhir game **hanya berisi hasil** (tahap,
kondisi, p, Menang/Kalah/Tidak dimainkan, jumlah menang dan kalah). Semua perhitungan dan pertanyaan
pindah ke LKPD, supaya LKPD tetap terkait dengan game dan jawabannya tidak sudah tersedia di rekap.

| Ada di game (setelah keputusan itu) | Dikerjakan siswa di LKPD |
|---|---|
| Satu tahap = satu percobaan Bernoulli, hasil MENANG (X = 1) atau KALAH (X = 0), p tiap tahap | Menyebutkan ciri percobaan Bernoulli dengan bukti dari pengalaman bermain |
| Rekap ringkas: tahap, kondisi, p, hasil, jumlah menang dan kalah | Menghitung 1 - p, X, P(hasil), E(X), Var(X), peluang urutan, dan jumlah menang yang diharapkan |
| Satu sesi hanya memberi satu hasil per tahap | Membandingkan frekuensi relatif dari beberapa kali main dan data gabungan kelas dengan p |
| (Catatan "bukan binomial" dan tiga pertanyaan refleksi dipindah dari rekap) | Menjelaskan mengapa bukan binomial, menjembatani ke binomial, dan refleksi sebelum-sesudah |
| Konteks hanya Kerajaan Swarnadwipa | Memindahkan konsep ke situasi di luar game |

Jadi rekap adalah **data mentah** dan LKPD adalah **tempat mengolahnya**.

### 0.2 Kesesuaian dengan kurikulum

- [Kemungkinan Besar] Materi ini masuk Capaian Pembelajaran **Matematika Tingkat Lanjut Fase F**,
  elemen **Analisis Data dan Peluang**. Menurut ringkasan hasil pencarian laman resmi Kemendikdasmen,
  di akhir fase siswa memahami variabel acak diskrit dan fungsi peluang, menginterpretasikan parameter
  distribusi seragam, binomial, dan normal, serta menghitung nilai harapan distribusi binomial dan
  normal. Laman resminya tidak bisa saya buka langsung dari lingkungan kerja ini, jadi **kelompok wajib
  menyalin kalimat CP dari laman resmi** sebelum dicetak:
  https://guru.kemdikbud.go.id/kurikulum/referensi-penerapan/capaian-pembelajaran/sd-sma/matematika-tingkat-lanjut/fase-f/
- [Kemungkinan Besar] Distribusi Bernoulli tidak selalu disebut namanya di CP. Posisinya sebagai dasar
  distribusi binomial (binomial dengan n = 1). Karena itu LKPD diakhiri jembatan ke binomial (Kegiatan 5).
- Beberapa sumber sekunder menyebut fase ini "F+" atau merujuk keputusan BSKAP yang berbeda (032/2024
  atau 046/2025). Pakai nomor keputusan yang berlaku di sekolah tujuan.

### 0.3 Komponen LKPD yang dipakai

[Kemungkinan Besar] Sumber sekunder yang merujuk Depdiknas (2008) menyebut enam komponen pokok LKPD:
judul, petunjuk belajar, kompetensi dasar atau materi pokok, informasi pendukung, tugas atau langkah
kerja, dan penilaian. Versi lain menambah waktu penyelesaian, alat dan bahan, serta laporan. Struktur di
bawah memuat semuanya. Dokumen asli Depdiknas belum saya baca langsung, jadi jika LKPD ini masuk
laporan, kutip dari dokumen aslinya.

### 0.4 Prinsip agar LKPD tidak terasa dipaksakan

1. **Data dulu, istilah kemudian.** Setiap kegiatan dimulai dari hasil permainan siswa sendiri.
2. **Cerita hanya sebagai bingkai.** Nama dan suasana Swarnadwipa dipakai di judul kegiatan dan pesan
   pembuka, bukan disisipkan ke setiap soal.
3. **Setiap soal punya alasan.** Soal yang tidak menambah pemahaman baru dibuang. Total sekitar 25 isian.
4. **Lentur terhadap jumlah permainan.** Bisa dikerjakan setelah main 1 kali. Bagian pribadi Kegiatan 3
   hanya untuk yang main 2 kali atau lebih; bagian data kelas tetap bisa dikerjakan semua siswa.
5. **Rekap sebagai data, bukan kunci.** Rekap tidak lagi memuat perhitungan, jadi pengecekan lewat
   umpan balik LKPD digital (tanda cocok/belum, tanpa skor) atau kunci guru.
6. **Menyasar salah paham yang dipancing game.** "p = 0,7 berarti pasti menang", "setelah kalah,
   peluang menang naik", "QTE mengubah peluang", "tahap Tidak dimainkan = kalah". Empat hal ini sudah
   disinggung dialog Resi Bayang; LKPD mengujinya dengan tebakan awal dan pernyataan benar/salah
   beralasan.

### 0.5 Satu hal yang harus diperhatikan: p bisa diubah guru

Beberapa soal memakai nilai p bawaan (0,5; 0,6; 0,7; 0,4; 0,3), misalnya Q2.2 dan Q5.1. Jika guru
mengubah p lewat Setting Guru atau tautan siswa, soal itu tidak berlaku. Di versi digital, soal bertanda
**(p bawaan)** ditampilkan hanya jika sumber p di rekap adalah "nilai bawaan game", atau angkanya dihitung
ulang dari p yang dipakai.

---

## Bagian A. Struktur LKPD (urutan halaman)

| No | Bagian | Isi pokok | Kolom isian |
|---|---|---|---|
| 0 | Sampul | Judul, subjudul, identitas mapel, identitas siswa, identitas pembuat | Nama, Kelas, Nomor absen, Tanggal |
| 1 | Petunjuk penggunaan | Langkah kerja siswa, ikon, waktu | - |
| 2 | Tujuan pembelajaran dan alat | 4 tujuan, alat dan bahan, alokasi waktu | - |
| 3 | Sebelum Mulai: Tebakan Awal | Tiga pertanyaan refleksi yang dipindah dari rekap game, dijawab sebelum belajar | 3 isian |
| 3a | Gulungan Pengetahuan Resi Bayang (informasi pendukung) | Definisi, rumus, satu contoh | - |
| 4 | Kegiatan 1: Catatan Pertarunganku | Tabel hasil dari rekap, ciri percobaan Bernoulli | Tabel 5 baris, 3 soal |
| 5 | Kegiatan 2: Menghitung Setiap Pertarungan | P(X = 1), P(X = 0), E(X), Var(X) | Tabel 5 baris, 3 soal |
| 6 | Kegiatan 3: Bertarung Lagi, Apakah Hasilnya Sama? | Frekuensi relatif dari beberapa kali main dan data kelas | 2 tabel, 3 soal |
| 7 | Kegiatan 4: Peluang Satu Rangkaian Pertarungan | Peluang urutan hasil, kebebasan, nilai harapan jumlah | 4 soal |
| 8 | Kegiatan 5: Dari Bernoulli ke Binomial | Menang semua, kalah semua, mengapa bukan binomial, andaikan p sama | 3 soal (+1 tantangan) |
| 9 | Kegiatan 6: Di Luar Swarnadwipa | Empat situasi sehari-hari | 4 isian |
| 10 | Refleksi dan Kesimpulan | Benar/salah beralasan, kesimpulan rumpang, membandingkan dengan tebakan awal, penilaian diri | 5 + 4 + 1 + 4 isian |
| 11 | Penutup | Pesan Resi Bayang, tombol unduh atau kirim | - |
| 12 | Glosarium | Istilah penting | - |
| 13 | Daftar pustaka | Sumber yang benar-benar dipakai | - |
| Guru | Kunci jawaban, rubrik, petunjuk guru | Terpisah dari LKPD siswa | - |

---

## Bagian B. Isi lengkap untuk siswa

Konvensi kolom isian: `[id | jenis]`. Jenis: `teks-pendek`, `teks-panjang`, `angka` (koma desimal),
`pilihan`, `benar-salah`, `tabel`. ID dipakai saat pengodean.

### 0. Sampul

- Judul: **LKPD Distribusi Bernoulli**
- Subjudul: **Catatan Pertarungan di Kerajaan Swarnadwipa**
- Keterangan: Lembar kerja pendamping game Adventure Bernoulli
- Mata pelajaran: Matematika Tingkat Lanjut (konfirmasi kelompok)
- Fase/Kelas: F / XI atau XII (konfirmasi kelompok)
- Materi: Distribusi Peluang, Percobaan Bernoulli
- Identitas siswa:
  - Nama: `[s.nama | teks-pendek]` (versi digital: terisi dari Nama Siswa di game, boleh diubah)
  - Kelas: `[s.kelas | teks-pendek]`
  - Nomor absen: `[s.absen | angka]`
  - Tanggal: `[s.tanggal | teks-pendek]`
- Pembuat: Universitas Sriwijaya · by Kelompok 17
- Ilustrasi saran: Arca Durgaraksa di ruang singgasana, Resi Bayang memegang gulungan.

### 1. Petunjuk penggunaan

1. Mainkan Adventure Bernoulli sampai layar rekap. Kamu boleh berhenti sebelum tahap 5.
2. Unduh PDF rekap atau biarkan rekap terbuka. Rekap hanya berisi hasil pertarunganmu; semua
   perhitungan kamu kerjakan di LKPD ini.
3. Kerjakan bagian secara berurutan, mulai dari Tebakan Awal.
4. Tulis angka desimal dengan koma, misalnya 0,24.
5. Jika kamu bermain lebih dari sekali, catat hasil setiap permainan di Kegiatan 3.
6. Setelah selesai, unduh LKPD-mu atau kirim ke guru.

Ikon saran: buku (baca), pensil (tulis), pedang (data dari permainan), centang (periksa kembali).

### 2. Tujuan pembelajaran, alat, dan waktu

Setelah bermain dan mengerjakan LKPD ini, kamu dapat:
1. menjelaskan ciri percobaan Bernoulli dengan bukti dari permainan (Kegiatan 1);
2. menentukan fungsi peluang P(X = x) = p^x (1 - p)^(1 - x), nilai harapan E(X) = p, dan variansi
   Var(X) = p(1 - p) (Kegiatan 2);
3. membedakan peluang p, hasil satu percobaan, dan frekuensi relatif dari banyak percobaan (Kegiatan 3);
4. menghitung peluang rangkaian percobaan yang saling bebas dan menjelaskan hubungan Bernoulli dengan
   binomial (Kegiatan 4 dan 5), lalu menerapkannya pada situasi lain (Kegiatan 6).

Rumusan ini draf. Sesuaikan dengan kalimat CP resmi dan alur tujuan pembelajaran sekolah.

Alat dan bahan: laptop atau HP dengan internet, game Adventure Bernoulli, PDF rekap, alat tulis atau
kalkulator.

Waktu [Dugaan, perlu uji coba]: bermain 15 sampai 20 menit per sesi; LKPD sekitar 60 sampai 70 menit
(Kegiatan 1 dan 2 sekitar 20 menit, Kegiatan 3 sekitar 15 menit, Kegiatan 4 dan 5 sekitar 20 menit,
Kegiatan 6 dan refleksi sekitar 15 menit). Cocok untuk 2 JP ditambah waktu bermain.

### 3. Sebelum Mulai: Tebakan Awal

Jawab dengan pendapatmu sendiri sekarang. Jawaban ini tidak dinilai benar atau salah; kamu akan
melihatnya lagi di akhir LKPD.

- **T1** Mengapa satu pertarungan melawan Arca Durgaraksa bisa disebut satu percobaan Bernoulli?
  `[t.t1 | teks-panjang]`
- **T2** Pada tahap 3 dengan p = 0,7, apakah kamu pasti menang? `[t.t2 | teks-panjang]`
- **T3** Apakah kalah di tahap 1 memengaruhi peluang menangmu di tahap 2? `[t.t3 | teks-panjang]`

(Tiga pertanyaan ini sebelumnya ada di rekap dan PDF game. Di versi digital, angka tahap dan p di T2
mengikuti tahap dengan p terbesar.)

### 3a. Gulungan Pengetahuan Resi Bayang (informasi pendukung)

Pesan pembuka: "Pengembara, setiap pertarunganmu sudah tercatat. Sekarang mari kita baca catatan itu."

- **Percobaan Bernoulli** adalah satu percobaan yang hasilnya hanya dua: berhasil atau gagal.
- **Variabel acak X** mencatat hasilnya: X = 1 jika berhasil, X = 0 jika gagal.
- **p** adalah peluang berhasil, dan **1 - p** adalah peluang gagal. Keduanya selalu berjumlah 1.
- **Fungsi peluang:** P(X = x) = p^x (1 - p)^(1 - x), untuk x = 0 atau 1. [Pasti]
- **Nilai harapan:** E(X) = p. **Variansi:** Var(X) = p(1 - p). [Pasti]
- **Dua percobaan saling bebas** jika hasil yang satu tidak mengubah peluang yang lain. Peluang
  rangkaian hasil dari percobaan yang saling bebas sama dengan hasil kali peluang masing-masing. [Pasti]

Contoh (sengaja memakai p yang tidak ada di game bawaan): sebuah percobaan Bernoulli dengan p = 0,45.
P(X = 1) = 0,45; P(X = 0) = 1 - 0,45 = 0,55; E(X) = 0,45; Var(X) = 0,45 × 0,55 = 0,2475. [Pasti]

### 4. Kegiatan 1: Catatan Pertarunganku

Pengantar: Salin tahap, p, dan hasil dari rekap permainan pertamamu. Kolom 1 - p dan X kamu isi
sendiri.

Tabel `[k1.tabel | tabel]`:

| Tahap | Kondisi | p | 1 - p | Hasil (Menang / Kalah / Tidak dimainkan) | X |
|---|---|---|---|---|---|
| 1 | Tanpa perlengkapan | `[k1.p1]` | `[k1.q1]` | `[k1.h1 | pilihan]` | `[k1.x1]` |
| 2 | Mendapat pedang besi | `[k1.p2]` | `[k1.q2]` | `[k1.h2 | pilihan]` | `[k1.x2]` |
| 3 | Pedang besi dan armor | `[k1.p3]` | `[k1.q3]` | `[k1.h3 | pilihan]` | `[k1.x3]` |
| 4 | Arca Durgaraksa lebih kuat | `[k1.p4]` | `[k1.q4]` | `[k1.h4 | pilihan]` | `[k1.x4]` |
| 5 | Arca Durgaraksa murka | `[k1.p5]` | `[k1.q5]` | `[k1.h5 | pilihan]` | `[k1.x5]` |

Untuk tahap "Tidak dimainkan", kolom X diisi tanda "-".

Soal:
- **Q1.1** Dalam satu tahap, ada berapa kemungkinan hasil Serangan Penentu? Sebutkan.
  `[k1.q1_1 | teks-pendek]`
- **Q1.2** Tuliskan ciri percobaan Bernoulli yang kamu lihat di game, masing-masing dengan satu bukti
  dari permainanmu. `[k1.q1_2 | tabel 3 baris: ciri | bukti dari game]`
  Petunjuk: pikirkan banyaknya hasil, apakah p berubah selama satu tahap, dan apakah hasil tahap
  sebelumnya memengaruhi tahap berikutnya.
- **Q1.3** Mengapa tahap yang "Tidak dimainkan" tidak diberi nilai X, padahal kamu tidak menang di tahap
  itu? `[k1.q1_3 | teks-panjang]`

### 5. Kegiatan 2: Menghitung Setiap Pertarungan

Pengantar: Gunakan rumus di Gulungan Pengetahuan. Rekap game tidak memuat angka-angka ini.

Tabel `[k2.tabel | tabel]`:

| Tahap | p | P(X = 1) | P(X = 0) | P(hasilmu) | E(X) | Var(X) |
|---|---|---|---|---|---|---|
| 1 sampai 5 | (dari Kegiatan 1) | `[angka]` | `[angka]` | `[angka]` | `[angka]` | `[angka]` |

P(hasilmu) adalah P(X = 1) jika kamu menang, P(X = 0) jika kamu kalah, dan "-" jika tidak dimainkan.
E(X) dan Var(X) tetap bisa dihitung untuk tahap yang tidak dimainkan karena hanya bergantung pada p.

Soal:
- **Q2.1** Tahap mana yang Var(X)-nya paling besar? Apa artinya bagi hasil pertarungan di tahap itu?
  `[k2.q2_1a | pilihan: Tahap 1 sampai 5]` `[k2.q2_1b | teks-panjang]`
- **Q2.2 (p bawaan)** Var(X) tahap 2 (p = 0,6) sama dengan Var(X) tahap 4 (p = 0,4). Mengapa bisa sama?
  `[k2.q2_2 | teks-panjang]`
- **Q2.3** E(X) tahap 3 adalah 0,7, padahal X hanya bisa 0 atau 1. Apa arti angka 0,7 itu?
  `[k2.q2_3 | teks-panjang]`

### 6. Kegiatan 3: Bertarung Lagi, Apakah Hasilnya Sama?

**Bagian A (jika kamu bermain 2 kali atau lebih).** Lewati jika baru bermain sekali.

Tabel `[k3.main | tabel]` (isi M untuk menang, K untuk kalah, TD untuk tidak dimainkan):

| Permainan ke- | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

Tabel `[k3.frek | tabel]`:

| Tahap | p | Banyak dimainkan | Banyak menang | Frekuensi relatif menang = menang : dimainkan |
|---|---|---|---|---|
| 1 sampai 5 | | `[angka]` | `[angka]` | `[angka]` |

- **Q3.1** Apakah frekuensi relatif menangmu sama dengan p? Jika berbeda, apakah itu berarti game curang?
  Jelaskan. `[k3.q3_1 | teks-panjang]`

**Bagian B (semua siswa).** Gurumu akan menuliskan data gabungan satu kelas.

Tabel `[k3.kelas | tabel]`:

| Tahap | p | Banyak percobaan sekelas | Banyak menang sekelas | Frekuensi relatif kelas |
|---|---|---|---|---|
| 1 sampai 5 | | `[angka]` | `[angka]` | `[angka]` |

- **Q3.2** Mana yang lebih dekat dengan p: frekuensi relatifmu sendiri atau frekuensi relatif kelas?
  Mengapa? `[k3.q3_2 | teks-panjang]`
- **Q3.3** Jika satu kelas bermain 100 kali lagi, apa yang kamu perkirakan terjadi pada frekuensi relatif
  menang tahap 3? `[k3.q3_3 | teks-panjang]`

### 7. Kegiatan 4: Peluang Satu Rangkaian Pertarungan

- **Q4.1** Tulis urutan hasilmu (misalnya M, K, M, M, K) dan hitung peluang urutan itu dengan mengalikan
  P(hasil) setiap tahap yang dimainkan (dari Kegiatan 2).
  `[k4.urutan | teks-pendek]` `[k4.perkalian | teks-pendek]` `[k4.hasil | angka]`
- **Q4.2** Mengapa peluang setiap tahap boleh dikalikan? `[k4.q4_2 | teks-panjang]`
- **Q4.3 (p bawaan)** Urutan hasil apa yang peluangnya paling besar? Berapa peluangnya? Apakah urutan itu
  "kemungkinan besar terjadi"? `[k4.q4_3a | teks-pendek]` `[k4.q4_3b | angka]` `[k4.q4_3c | teks-panjang]`
- **Q4.4** Jumlah menang yang diharapkan dari kelima tahap adalah jumlah E(X) kelima tahap. Hitunglah
  (p bawaan). Mungkinkah kamu menang sebanyak angka itu? Apa artinya?
  `[k4.q4_4a | angka]` `[k4.q4_4b | teks-panjang]`

### 8. Kegiatan 5: Dari Bernoulli ke Binomial

- **Q5.1 (p bawaan)** Hitung peluang menang di kelima tahap, lalu peluang kalah di kelima tahap. Apa
  yang kamu perhatikan? Mengapa bisa begitu?
  `[k5.menang_semua | angka]` `[k5.kalah_semua | angka]` `[k5.q5_1 | teks-panjang]`
- **Q5.2** Apakah jumlah kemenanganmu dari lima tahap berdistribusi binomial? Syarat distribusi binomial
  mana yang menentukan jawabanmu? `[k5.q5_2 | teks-panjang]`
- **Q5.3** Andaikan kelima tahap punya peluang menang yang sama, p = 0,6, dan saling bebas.
  a. Berapa peluang satu urutan tertentu dengan tepat 3 menang, misalnya M, M, M, K, K? `[k5.a | angka]`
  b. Ada berapa urutan berbeda yang memuat tepat 3 menang dari 5 tahap? `[k5.b | angka]`
  c. Berapa peluang menang tepat 3 kali? `[k5.c | angka]`
- **Tantangan (pilihan)** Untuk p bawaan, hitung jumlah Var(X) kelima tahap. `[k5.tantangan | angka]`

### 9. Kegiatan 6: Di Luar Swarnadwipa

Tentukan apakah setiap situasi adalah satu percobaan Bernoulli. Jika ya, tuliskan hasil yang dianggap
berhasil dan p-nya. Jika tidak, jelaskan alasannya. Angka dalam situasi ini hanya permisalan, bukan data.

| No | Situasi | Bernoulli? | Berhasil = ... dan p | Alasan |
|---|---|---|---|---|
| 1 | Seorang pemain menendang satu penalti; misalkan peluang gol 0,8 | `[k6.b1 | pilihan Ya/Tidak]` | `[k6.p1]` | `[k6.a1]` |
| 2 | Satu dadu dilempar dan dicatat angka yang muncul | `[k6.b2]` | `[k6.p2]` | `[k6.a2]` |
| 3 | Satu dadu dilempar dan dicatat apakah muncul angka 6 | `[k6.b3]` | `[k6.p3]` | `[k6.a3]` |
| 4 | Sepuluh benih ditanam dan dicatat banyak benih yang tumbuh | `[k6.b4]` | `[k6.p4]` | `[k6.a4]` |

### 10. Refleksi dan Kesimpulan

**A. Benar atau salah? Beri alasan.** `[r.bs1..bs5 | benar-salah + teks-pendek]`
1. Jika p = 0,7, aku pasti menang.
2. Setelah kalah di tahap 1, peluang menangku di tahap 2 menjadi lebih besar.
3. P(X = 1) + P(X = 0) selalu sama dengan 1.
4. Tahap yang Tidak dimainkan dihitung sebagai X = 0.
5. Menekan tombol QTE lebih cepat menaikkan peluang menang.

**B. Lengkapi kesimpulan.** `[r.k1..k4 | teks-pendek]`
1. Percobaan Bernoulli adalah satu percobaan dengan tepat ____ hasil.
2. Jika peluang berhasil p, maka peluang gagal adalah ____.
3. Nilai harapan percobaan Bernoulli adalah ____ dan variansinya ____.
4. Jumlah keberhasilan dari beberapa percobaan Bernoulli yang saling bebas berdistribusi binomial jika
   ____.

**C. Lihat lagi tebakan awalmu.** Baca jawabanmu untuk T1, T2, dan T3 di bagian Sebelum Mulai. Apa
yang sekarang ingin kamu tambah atau ubah? `[r.banding | teks-panjang]`

**D. Penilaian diri.** `[r.diri1..diri4 | pilihan: Sudah bisa / Belum yakin]`
1. Aku bisa menjelaskan mengapa satu tahap adalah satu percobaan Bernoulli.
2. Aku bisa menghitung P(X = x), E(X), dan Var(X).
3. Aku bisa menjelaskan mengapa frekuensi relatif tidak harus sama dengan p.
4. Aku bisa menjelaskan kapan jumlah keberhasilan menjadi binomial.

### 11. Penutup

Pesan Resi Bayang (teks baru untuk LKPD, bukan dialog game): "Catatanmu kini lengkap, Pengembara.
Peluang tidak menjanjikan hasil satu pertarungan, tetapi ia terlihat dari banyak pertarungan."

Tombol versi digital: **Unduh LKPD (PDF)** dan **Kirim ke Guru** (lihat Bagian E).

### 12. Glosarium

- **Percobaan Bernoulli:** satu percobaan dengan dua hasil, berhasil atau gagal.
- **Variabel acak:** aturan yang memberi angka pada setiap hasil percobaan.
- **Fungsi peluang:** rumus yang memberi peluang setiap nilai variabel acak.
- **Nilai harapan:** rata-rata jangka panjang variabel acak.
- **Variansi:** ukuran seberapa jauh nilai variabel acak biasanya menyimpang dari nilai harapannya.
- **Frekuensi relatif:** banyak kejadian dibagi banyak percobaan.
- **Saling bebas:** hasil satu percobaan tidak mengubah peluang percobaan lain.
- **Distribusi binomial:** distribusi banyak keberhasilan dari n percobaan Bernoulli yang saling bebas
  dengan p yang sama.

### 13. Daftar pustaka

Isi hanya dengan sumber yang benar-benar dibaca kelompok. Kandidat:
- Capaian Pembelajaran Matematika Tingkat Lanjut Fase F (laman resmi):
  https://guru.kemdikbud.go.id/kurikulum/referensi-penerapan/capaian-pembelajaran/sd-sma/matematika-tingkat-lanjut/fase-f/
- Depdiknas (2008), Panduan Pengembangan Bahan Ajar (cari dokumen aslinya; di bawah ini hanya sumber
  sekunder yang mengutipnya):
  https://eprints.umm.ac.id/id/eprint/28637/3/BAB%20II.pdf
  https://etheses.iainkediri.ac.id/6930/3/932301518_bab2.pdf

---

## Bagian C. Kunci jawaban dan rubrik (untuk guru)

### C.1 Kunci jawaban

Semua hitungan memakai p bawaan dan bisa dicek ulang. [Pasti]

| Soal | Jawaban |
|---|---|
| Q1.1 | Dua: MENANG (X = 1) atau KALAH (X = 0). |
| Q1.2 | (1) Hanya dua hasil: Serangan Penentu selalu berakhir menang atau kalah, tidak ada seri. (2) p tetap: kotak peluang menunjukkan p yang sama dari pembuka tahap sampai Serangan Penentu; ramuan, perlengkapan, dan QTE tidak mengubahnya. (3) Tidak dipengaruhi tahap lain: setiap tahap memakai undian baru, Resi Bayang mengatakan pertarungan berikutnya tidak dipengaruhi hasil sebelumnya. |
| Q1.3 | Percobaannya tidak dilakukan, jadi tidak ada hasil. X hanya ada jika percobaan terjadi. Mencatatnya sebagai X = 0 berarti mengaku kalah di pertarungan yang tidak pernah terjadi. |
| Tabel K2 | P(X = 1) = p; P(X = 0) = 1 - p; E(X) = p; Var(X): tahap 1 0,25; tahap 2 0,24; tahap 3 0,21; tahap 4 0,24; tahap 5 0,21. |
| Q2.1 | Tahap 1 (p = 0,5, Var = 0,25). Hasilnya paling sulit ditebak karena menang dan kalah sama besar peluangnya. |
| Q2.2 | Var(X) = p(1 - p). Untuk p = 0,6: 0,6 × 0,4 = 0,24. Untuk p = 0,4: 0,4 × 0,6 = 0,24. Faktornya sama, hanya bertukar tempat. |
| Q2.3 | E(X) adalah rata-rata jangka panjang. Jika tahap 3 dimainkan sangat banyak kali, rata-rata X mendekati 0,7, artinya sekitar 70% pertarungan berakhir menang. Bukan nilai yang muncul dalam satu pertarungan. |
| Q3.1 | Tidak harus sama. Percobaannya sedikit, sehingga frekuensi relatif bisa jauh dari p. Contoh untuk p = 0,7 dan main 3 kali: peluang menang ketiganya 0,7³ = 0,343, peluang tidak pernah menang 0,3³ = 0,027. Frekuensi 1 atau 0 masih wajar dan tidak menunjukkan kecurangan. |
| Q3.2 | Biasanya frekuensi kelas lebih dekat ke p karena percobaannya lebih banyak. Jawaban "tidak lebih dekat" tetap bisa benar jika alasannya data kelas masih sedikit; nilai alasannya. |
| Q3.3 | Frekuensi relatif cenderung makin dekat ke 0,7 jika banyak percobaan bertambah (hukum bilangan besar, dikenalkan secara informal). Tetap tidak harus tepat 0,7. |
| T1 sampai T3 | Tidak dinilai benar/salah. Dipakai untuk melihat perubahan pemahaman di Refleksi C. Jawaban ideal sama dengan Q1.2, Refleksi A1, dan Refleksi A2. |
| Q4.1 | Tergantung data siswa: hasil kali P(hasil) tahap yang dimainkan. Versi digital bisa menghitung pembandingnya dari data permainan. |
| Q4.2 | Tahap-tahap saling bebas: setiap Serangan Penentu memakai undian baru dengan p tahap itu, tanpa dipengaruhi hasil sebelumnya. |
| Q4.3 | Pilih hasil berpeluang lebih besar di setiap tahap: tahap 1 seimbang (0,5), tahap 2 M (0,6), tahap 3 M (0,7), tahap 4 K (0,6), tahap 5 K (0,7). Ada dua urutan terbesar: M, M, M, K, K dan K, M, M, K, K, masing-masing 0,5 × 0,6 × 0,7 × 0,6 × 0,7 = 0,0882. Tidak "kemungkinan besar terjadi": hanya 8,82%, karena ada 2⁵ = 32 urutan yang mungkin. |
| Q4.4 | 0,5 + 0,6 + 0,7 + 0,4 + 0,3 = 2,5. Tidak mungkin menang 2,5 kali; 2,5 adalah rata-rata banyak menang jika kelima tahap dimainkan berulang kali. |
| Q5.1 | Menang semua: 0,5 × 0,6 × 0,7 × 0,4 × 0,3 = 0,0252. Kalah semua: 0,5 × 0,4 × 0,3 × 0,6 × 0,7 = 0,0252. Sama, karena kumpulan nilai 1 - p (0,5; 0,4; 0,3; 0,6; 0,7) berisi angka yang sama dengan kumpulan nilai p, hanya urutannya berbeda, dan perkalian tidak bergantung urutan. |
| Q5.2 | Tidak. Binomial membutuhkan p yang sama di setiap percobaan (selain banyak percobaan tetap dan saling bebas). Di game, p tiap tahap berbeda. |
| Q5.3 | a. 0,6³ × 0,4² = 0,216 × 0,16 = 0,03456. b. 10 urutan (memilih 3 dari 5 posisi: C(5, 3) = 10). c. 10 × 0,03456 = 0,3456. |
| Tantangan | 0,25 + 0,24 + 0,21 + 0,24 + 0,21 = 1,15. (Variansi jumlah percobaan yang saling bebas sama dengan jumlah variansinya.) |
| K6 no 1 | Ya. Berhasil = gol, p = 0,8. |
| K6 no 2 | Tidak. Ada enam hasil, bukan dua. |
| K6 no 3 | Ya. Berhasil = muncul 6, p = 1/6. |
| K6 no 4 | Tidak, ini sepuluh percobaan, bukan satu. Setiap benih adalah satu percobaan Bernoulli. Banyak benih yang tumbuh berdistribusi binomial jika peluang tumbuh tiap benih sama dan saling bebas. |
| Refleksi A | 1 Salah (p = 0,7 masih menyisakan peluang kalah 0,3). 2 Salah (tahap saling bebas; p tahap 2 tetap 0,6). 3 Benar. 4 Salah (tidak punya X). 5 Salah (QTE hanya mengubah animasi). |
| Refleksi B | 1 dua; 2 1 - p; 3 p dan p(1 - p); 4 peluang berhasil setiap percobaan sama (dan banyak percobaan tetap). |

### C.2 Rubrik soal uraian

| Skor | Kriteria |
|---|---|
| 4 | Jawaban benar, alasan memakai konsep yang tepat (dua hasil, p tetap, saling bebas, jangka panjang) dan merujuk data permainan |
| 3 | Jawaban benar, alasan benar tetapi kurang lengkap atau tidak merujuk data |
| 2 | Jawaban sebagian benar atau alasan mengandung satu salah paham |
| 1 | Jawaban salah atau tanpa alasan |
| 0 | Tidak diisi |

Usulan bobot [Dugaan, sesuaikan]: Kegiatan 1 15%, Kegiatan 2 20%, Kegiatan 3 15%, Kegiatan 4 20%,
Kegiatan 5 15%, Kegiatan 6 dan refleksi 15%. Isian angka: benar 1, salah 0, kesalahan pembulatan
kecil tetap dianggap benar.

---

## Bagian D. Petunjuk guru

1. **Samakan p untuk satu kelas.** Kegiatan 3 Bagian B hanya bermakna jika semua siswa memakai p yang
   sama. Pakai p bawaan, atau bagikan satu tautan siswa dari Setting Guru.
2. **Urutan pertemuan [Dugaan]:** bermain (15 sampai 20 menit) → Kegiatan 1 dan 2 → bermain lagi jika
   waktu cukup → Kegiatan 3 sampai 6 → refleksi.
3. **Mengumpulkan data kelas:** tulis di papan, per tahap, banyak siswa yang memainkan tahap itu dan
   banyak yang menang (hitung dari semua permainan, termasuk permainan ulang).
4. **Bahas Q3.1 dan Q4.3 bersama.** Dua soal ini paling sering memancing anggapan "game curang" atau
   "urutan paling mungkin pasti terjadi".
5. **Jika p diubah guru,** soal bertanda (p bawaan) diganti atau dihitung ulang (lihat Bagian 0.5).
6. **Pengayaan:** Q5.3 dan Tantangan bisa menjadi pembuka pertemuan distribusi binomial.

---

## Bagian E. Catatan teknis untuk pengodean nanti

Bagian ini belum dikerjakan; hanya mencatat keputusan yang harus diambil.

1. **Posisi di game.** Usulan: tombol "Kerjakan LKPD" di layar rekap, membuka layar LKPD. Ini fitur
   baru, jadi berlaku pengecualian aturan 3 di PRODUCT.md (sudah dicatat di bagian 18).
2. **Isi otomatis.** Nama dan kelas boleh diisi otomatis. Untuk tabel Kegiatan 1, pilih: (a) diisi
   otomatis dari rekap, atau (b) siswa menyalin sendiri lalu dicek. Saran: (b), karena menyalin dan
   membaca rekap adalah bagian dari belajar.
3. **Beberapa kali main.** Saat ini semua hasil hilang ketika halaman dimuat ulang, dan tombol Kembali
   ke Menu Utama memuat ulang halaman. Agar Kegiatan 3 bisa diisi otomatis, riwayat permainan perlu
   disimpan di localStorage perangkat itu. Ini mengubah perilaku "data tidak disimpan" di README dan
   menyentuh `js/stages.js`, jadi perlu persetujuan pemilik. Alternatif tanpa perubahan: siswa mencatat
   sendiri dari tiap PDF rekap.
4. **Isian angka.** Terima koma dan titik desimal, simpan sebagai teks asli siswa. Karena rekap tidak
   lagi memuat perhitungan, umpan balik (jika dipakai) dihitung LKPD sendiri dari data permainan dan
   ditampilkan sebagai tanda cocok/belum tanpa skor. Pilihan lain: tanpa umpan balik, dinilai guru.
5. **Draf otomatis.** Simpan jawaban sementara di localStorage agar tidak hilang saat HP mengunci layar.
6. **Unduh.** PDF LKPD dibuat dengan jsPDF yang sudah dipakai game, dengan nama file
   `LKPD_Bernoulli_<nama>.pdf`. Huruf yang tidak bisa dicetak sudah ditangani di Nama Siswa; jawaban
   uraian perlu pembersihan yang sama.
7. **Kirim ke guru: perlu keputusan pemilik**, karena game tidak punya backend (aturan 6 dan hosting
   statis):
   - **A. Unduh lalu unggah** ke Google Classroom, LMS sekolah, atau WhatsApp. Tanpa server tambahan,
     paling aman untuk data siswa. Saran utama.
   - **B. Netlify Forms.** Game sudah di Netlify, dan Netlify bisa menerima kiriman formulir dari situs
     statis. Batas kiriman di paket gratis tidak jelas karena sumber saling bertentangan: forum Netlify
     tahun 2020 menyebut 100 kiriman per bulan per situs, ulasan pihak ketiga menyebut tanpa batas di
     paket berbasis kredit sejak 2026. **[Dugaan] Wajib dicek di https://www.netlify.com/pricing
     sebelum dipilih.** Nama siswa terkirim ke akun Netlify kelompok, jadi perlu izin sekolah.
   - **C. Google Apps Script ke Google Sheets milik guru.** Gratis, tetapi guru harus menyiapkan skrip
     sendiri, dan datanya keluar dari game ke layanan pihak ketiga.

---

## Bagian F. Yang perlu dikonfirmasi kelompok

1. Mata pelajaran dan fase/kelas tujuan, serta kalimat CP resmi yang dikutip.
2. Apakah Kegiatan 5 (binomial) wajib atau pengayaan, tergantung urutan materi di sekolah.
3. Pilihan isi otomatis tabel Kegiatan 1 (Bagian E nomor 2).
4. Penyimpanan riwayat permainan (Bagian E nomor 3).
5. Cara mengirim ke guru (Bagian E nomor 7).
6. Waktu pengerjaan setelah uji coba dengan siswa sungguhan.
