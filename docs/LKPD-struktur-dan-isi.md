# LKPD Adventure Bernoulli: Struktur dan Isi (revisi 5)

Dokumen kerja untuk Kelompok 17, Universitas Sriwijaya. Isinya struktur LKPD digital dari sampul sampai
penutup, teks untuk siswa, kolom isian, kunci jawaban, rubrik, dan hal yang masih perlu dikonfirmasi.
Desain visual menyusul dari kelompok; teks di sini menjadi isi yang dimasukkan 1:1 ke desain itu.
Pengodean belum dimulai dan menunggu permintaan pemilik. Rancangan pendataan ada di
`docs/rancangan-firebase.md`.

Tanda keyakinan: **[Pasti]** untuk rumus baku dan hitungan yang bisa dicek, **[Kemungkinan Besar]**
untuk interpretasi sumber, **[Dugaan]** untuk perkiraan yang harus dicek kelompok.

---

## Bagian 0. Keputusan dan analisis (untuk kelompok, tidak ditampilkan ke siswa)

### 0.1 Keputusan pemilik

| Topik | Keputusan |
|---|---|
| Fokus materi | **Hanya distribusi Bernoulli** (permintaan dosen). Materi, Tujuan Pembelajaran, kegiatan, dan soal tidak membahas distribusi lain |
| Sasaran | Kelas XII, Matematika Tingkat Lanjut, Fase F (kelas pasti mengikuti ATP sekolah mitra) |
| Kurikulum | LKPD untuk siswa hanya memuat Tujuan Pembelajaran, dan semuanya tentang Bernoulli. CP tidak menyebut Bernoulli, jadi TP dirumuskan khusus untuk Bernoulli (keputusan pemilik) |
| Materi awal | Ada bagian materi distribusi Bernoulli sebelum kegiatan, untuk siswa yang belum mengenalnya |
| Waktu | Asinkron, kapan saja; 1 siswa 1 perangkat; login Google |
| Permainan | p bawaan (0,5; 0,6; 0,7; 0,4; 0,3). Boleh berhenti sebelum tahap 5; soal memakai tahap yang dimainkan |
| Data yang dipakai LKPD | Selama LKPD belum dikirim: permainan ber-p bawaan **terbaru** (jika bermain lagi, datanya berganti). Setelah LKPD dikirim: data dan jawaban **terkunci**; bermain lagi tidak mengubah LKPD dan tidak membuka LKPD baru. Guru bisa menghapus data siswa jika perlu diulang |
| Rekap dan PDF | Hanya hasil menang dan kalah. Refleksi hanya di LKPD |
| Isian | Semua isian bisa memakai editor persamaan; tidak ada tanda benar/salah otomatis |
| Setelah dikirim | Perubahan jawaban lewat persetujuan guru |
| Penilaian | Oleh kelompok, di luar website, memakai Bagian C |
| Konteks soal cerita | Penalti futsal, kain songket Palembang, bibit cabai (disetujui) |

### 0.2 Kaitan dengan Capaian Pembelajaran

Kutipan CP Matematika Tingkat Lanjut Fase F, elemen Analisis Data dan Peluang, dari tangkapan layar yang
dikirim kelompok:

> "Memahami variabel acak diskrit (distribusi binomial) dan fungsi peluang (distribusi normal), dan
> menggunakannya dalam memodelkan data; menginterpretasi parameter distribusi data secara statistik,
> menghitung nilai harapan distribusi binomial dan normal, dan menggunakannya dalam penyelesaian masalah."

Tangkapan layar tidak menunjukkan judul dan nomor keputusan dokumennya. Catat dari dokumen aslinya jika CP
dikutip di laporan.

| Frasa CP | Tujuan Pembelajaran LKPD |
|---|---|
| Memahami variabel acak diskrit ... menggunakannya dalam memodelkan data | TP 1: ciri percobaan Bernoulli dan variabel acaknya dari data permainan |
| Fungsi peluang | TP 2: fungsi peluang distribusi Bernoulli |
| Menginterpretasi parameter distribusi; menghitung nilai harapan | TP 3: p, E(X), Var(X) dan artinya |
| Menggunakannya dalam penyelesaian masalah | TP 4: peluang rangkaian percobaan dan soal cerita |

Catatan:
- CP tidak menyebut Bernoulli. Sesuai keputusan pemilik, keempat TP dirumuskan khusus untuk distribusi
  Bernoulli dan tidak menyinggung distribusi lain; tabel di atas hanya menunjukkan frasa CP yang menjadi
  pijakan tiap TP.
- CP menyebut nilai harapan, tetapi tidak menyebut variansi secara langsung. Variansi dimasukkan sebagai
  bagian dari "menginterpretasi parameter distribusi secara statistik".

### 0.3 Urutan Tebakan Awal dan materi

Tebakan Awal gunanya merekam pemikiran siswa **sebelum** belajar, lalu dibandingkan di Refleksi. Jika
materi ditaruh sebelum Tebakan Awal, tebakan itu sudah dipengaruhi materi dan tidak lagi "awal". Karena
itu urutannya: **Tebakan Awal → Materi**. Kekhawatiran bahwa siswa belum tahu istilah Bernoulli diatasi
dengan menulis Tebakan Awal tanpa istilah teknis, hanya memakai pengalaman bermain.

### 0.4 Akibat yang perlu disadari

- Gagasan "hasil mendekati p jika percobaannya banyak" hanya muncul lewat Cerita C (angka permisalan), bukan
  lewat data kelas sungguhan. [Pasti]
- Sebagian hitungan sama untuk semua siswa (1 - p, E(X), Var(X), urutan paling mungkin) karena p bawaan sama.
  Bobot penilaian dibuat lebih besar di uraian (C.2).
- Jika siswa bermain lagi sebelum mengirim LKPD, jawaban yang sudah ditulis bisa tidak cocok lagi dengan
  data baru. LKPD perlu menampilkan pemberitahuan: "Datamu berubah karena kamu bermain lagi. Periksa kembali
  jawabanmu."

### 0.5 Prinsip agar LKPD tidak terasa dipaksakan

1. **Data dulu, istilah kemudian.** Kegiatan 1 sampai 3 dimulai dari hasil permainan siswa sendiri.
2. **Cerita hanya bingkai.** Swarnadwipa dipakai di judul dan pesan pembuka, bukan di setiap soal.
3. **Soal cerita membawa konsep keluar dari game.** Setiap cerita menguji satu gagasan: kebebasan (A),
   "berhasil" hanyalah nama (B), harapan dibanding kenyataan dari sedikit dan banyak percobaan (C).
4. **Menyasar salah paham:** "p = 0,7 berarti pasti menang", "setelah gagal peluang naik", "QTE mengubah
   peluang", "Tidak dimainkan = kalah", "berhasil harus berarti hal yang baik".

---

## Bagian A. Struktur LKPD

| No | Bagian | Isi pokok | Isian |
|---|---|---|---|
| 0 | Sampul | Judul, identitas (terisi dari akun) | - |
| 1 | Petunjuk penggunaan | Cara mengerjakan, editor persamaan, kirim | - |
| 2 | Tujuan pembelajaran | 4 tujuan | - |
| 3 | Tebakan Awal | 3 pertanyaan tanpa istilah teknis | 3 |
| 4 | Materi: Distribusi Bernoulli (Gulungan Pengetahuan Resi Bayang) | Pengertian, ciri, contoh dan bukan contoh, variabel acak, fungsi peluang, E(X) dan Var(X) beserta asal rumusnya, contoh soal | - |
| 5 | Kegiatan 1: Catatan Pertarunganku | Data permainan, ciri Bernoulli | 1 tabel, 3 soal |
| 6 | Kegiatan 2: Menghitung Setiap Pertarungan | P(X = x), E(X), Var(X), harapan vs kenyataan | 1 tabel, 4 soal |
| 7 | Kegiatan 3: Peluang Satu Rangkaian Pertarungan | Peluang urutan, kebebasan, urutan paling mungkin, menang semua vs kalah semua | 4 soal |
| 8 | Kegiatan 4: Di Luar Swarnadwipa | Memilah percobaan Bernoulli dan 3 soal cerita | 1 tabel, 3 cerita |
| 9 | Refleksi | Benar/salah beralasan, kesimpulan, membandingkan dengan Tebakan Awal, penilaian diri | 4 bagian |
| 10 | Penutup | Pesan Resi Bayang, Kirim LKPD | - |
| 11 | Glosarium | Istilah | - |

---

## Bagian B. Isi untuk siswa

Konvensi: `[id | jenis]`. Jenis: `teks` (uraian dengan editor persamaan), `angka` (angka atau rumus dengan
editor persamaan), `pilihan`, `benar-salah`, `tabel`. Data bertanda **(sistem)** ditampilkan dari akun dan
tidak bisa diubah siswa.

### 0. Sampul

- **LKPD Distribusi Bernoulli**
- *Catatan Pertarungan di Kerajaan Swarnadwipa*
- Lembar kerja pendamping game Adventure Bernoulli
- Matematika Tingkat Lanjut · Kelas XII · Fase F
- Nama, kelas, email: (sistem, dari akun)
- Universitas Sriwijaya · by Kelompok 17

### 1. Petunjuk penggunaan

1. LKPD ini terbuka setelah permainanmu tercatat. Datamu terisi otomatis dari akunmu.
2. Jika kamu berhenti sebelum tahap 5, kerjakan soal untuk tahap yang kamu mainkan saja.
3. Jika kamu bermain lagi sebelum mengirim LKPD, datamu berganti dengan permainan terbaru. Periksa kembali
   jawabanmu. Setelah LKPD dikirim, datamu terkunci.
4. Kerjakan berurutan. Jawabanmu tersimpan otomatis; kamu bisa melanjutkan di perangkat lain dengan akun
   yang sama.
5. Tulis angka desimal dengan koma, misalnya 0,24. Untuk pangkat, pecahan, atau indeks, tekan tombol
   **Rumus**.
6. Tidak ada tanda benar atau salah selama mengerjakan. Jawab dengan pemahamanmu sendiri.
7. Tekan **Kirim LKPD** jika sudah selesai. Untuk mengubah jawaban setelah terkirim, tekan **Ajukan
   Perubahan** dan tunggu persetujuan guru.

### 2. Tujuan pembelajaran

Setelah bermain dan mengerjakan LKPD ini, kamu dapat:
1. mengidentifikasi ciri percobaan Bernoulli dan variabel acaknya dari hasil permainanmu;
2. menentukan fungsi peluang distribusi Bernoulli, P(X = x) = p^x (1 - p)^(1 - x);
3. menghitung serta menjelaskan arti nilai harapan E(X) = p dan variansi Var(X) = p(1 - p);
4. menggunakan distribusi Bernoulli untuk menyelesaikan masalah, termasuk peluang beberapa percobaan
   Bernoulli yang saling bebas dan soal cerita di luar game.

### 3. Tebakan Awal

Jawab dengan pendapatmu sekarang, sebelum membaca materi. Bagian ini tidak dinilai benar atau salah; kamu
akan melihatnya lagi di Refleksi.

- **T1** Di tahap 3 peluang menangmu 0,7. Apakah kamu pasti menang? Mengapa? `[t.t1 | teks]`
- **T2** Jika kamu kalah di tahap 1, apakah peluang menangmu di tahap 2 berubah? Mengapa? `[t.t2 | teks]`
- **T3** Jika tahap 3 dimainkan 100 kali, kira-kira berapa kali kamu menang? Apa arti angka 0,7 bagimu?
  `[t.t3 | teks]`

### 4. Materi: Distribusi Bernoulli (Gulungan Pengetahuan Resi Bayang)

"Pengembara, setiap pertarunganmu sudah tercatat. Sebelum membacanya, pelajari dulu gulungan ini."

**A. Percobaan Bernoulli**

Percobaan Bernoulli adalah satu percobaan acak yang hanya mempunyai **dua kemungkinan hasil**. Satu hasil
diberi nama **berhasil**, yang lain **gagal**. Nama ini hanya label: hasil yang dicatat sebagai "berhasil"
tidak harus hal yang baik. [Pasti]

Jika percobaan Bernoulli dilakukan berkali-kali, dianggap:
1. setiap percobaan hanya punya dua hasil;
2. peluang berhasil, **p**, sama di setiap percobaan;
3. hasil satu percobaan tidak memengaruhi percobaan lain (**saling bebas**).

**B. Contoh dan bukan contoh**

| Situasi | Percobaan Bernoulli? | Alasan |
|---|---|---|
| Menjawab satu soal benar-salah dengan menebak; dicatat benar atau salah | Ya | Dua hasil; jika menebak acak, p = 0,5 |
| Mencatat golongan darah seorang siswa (A, B, AB, O) | Bukan | Ada empat hasil |
| Mencatat apakah golongan darah seorang siswa O atau bukan O | Ya | Hasilnya dibuat menjadi dua |

**C. Variabel acak Bernoulli**

Hasil percobaan diubah menjadi angka: **X = 1** jika berhasil dan **X = 0** jika gagal. X disebut variabel
acak Bernoulli dengan parameter p, ditulis **X ~ Bernoulli(p)**. [Pasti]

**D. Fungsi peluang**

| x | 0 | 1 |
|---|---|---|
| P(X = x) | 1 - p | p |

Dalam satu rumus: **P(X = x) = p^x (1 - p)^(1 - x)**, untuk x = 0 atau 1. Coba masukkan x = 1, hasilnya p;
masukkan x = 0, hasilnya 1 - p. Jumlah kedua peluang selalu 1. [Pasti]

**E. Nilai harapan dan variansi**

- Nilai harapan: E(X) = 0 × (1 - p) + 1 × p = **p**. [Pasti]
  Artinya: jika percobaan diulang sangat banyak kali, rata-rata nilai X (yaitu proporsi berhasil) mendekati p.
- Variansi: E(X²) = 0² × (1 - p) + 1² × p = p, sehingga
  Var(X) = E(X²) - [E(X)]² = p - p² = **p(1 - p)**. [Pasti]
  Artinya: ukuran seberapa jauh nilai X biasanya menyimpang dari E(X), atau seberapa sulit hasilnya ditebak.

**F. Contoh soal**

Sebuah percobaan Bernoulli memiliki p = 0,45 (angka ini tidak dipakai di game).
P(X = 1) = 0,45; P(X = 0) = 1 - 0,45 = 0,55; E(X) = 0,45; Var(X) = 0,45 × 0,55 = 0,2475. [Pasti]

### 5. Kegiatan 1: Catatan Pertarunganku

Tabel `[k1.tabel | tabel]`:

| Tahap | Kondisi (sistem) | p (sistem) | Hasil (sistem) | 1 - p | X |
|---|---|---|---|---|---|
| 1 | Tanpa perlengkapan | 0,5 | Menang / Kalah / Tidak dimainkan | `[angka]` | `[angka]` |
| 2 | Mendapat pedang besi | 0,6 | | `[angka]` | `[angka]` |
| 3 | Pedang besi dan armor | 0,7 | | `[angka]` | `[angka]` |
| 4 | Arca Durgaraksa lebih kuat | 0,4 | | `[angka]` | `[angka]` |
| 5 | Arca Durgaraksa murka | 0,3 | | `[angka]` | `[angka]` |

Untuk tahap Tidak dimainkan, kolom X diisi "-".

- **Q1.1** Di game ini, hasil apa yang kamu beri nama "berhasil" (X = 1) dan "gagal" (X = 0)? Ada berapa
  kemungkinan hasil dalam satu tahap? `[k1.q1 | teks]`
- **Q1.2** Tunjukkan bahwa setiap tahap memenuhi tiga ciri percobaan Bernoulli (materi bagian A), masing-
  masing dengan satu bukti dari permainanmu. `[k1.q2 | tabel 3 baris: ciri | bukti]`
- **Q1.3** Perlengkapanmu makin kuat dari tahap 1 ke tahap 3, dan peluang menangmu naik. Apakah itu berarti
  kemampuanmu bermain ikut menentukan hasil Serangan Penentu? Jelaskan. `[k1.q3 | teks]`

### 6. Kegiatan 2: Menghitung Setiap Pertarungan

Tabel `[k2.tabel | tabel]`:

| Tahap | p | P(X = 1) | P(X = 0) | P(hasilmu) | E(X) | Var(X) |
|---|---|---|---|---|---|---|
| 1 sampai 5 | (sistem) | `[angka]` | `[angka]` | `[angka]` | `[angka]` | `[angka]` |

P(hasilmu) = P(X = 1) jika menang, P(X = 0) jika kalah, "-" jika tidak dimainkan. E(X) dan Var(X) tetap
dihitung untuk tahap yang tidak dimainkan karena hanya bergantung pada p.

- **Q2.1** Tahap mana yang Var(X)-nya paling besar? Apa artinya bagi hasil pertarungan di tahap itu?
  `[k2.q1a | pilihan]` `[k2.q1b | teks]`
- **Q2.2** Var(X) tahap 2 (p = 0,6) sama dengan Var(X) tahap 4 (p = 0,4). Mengapa bisa sama?
  `[k2.q2 | teks]`
- **Q2.3** E(X) tahap 3 adalah 0,7, padahal X hanya 0 atau 1. Apa arti angka 0,7 itu? `[k2.q3 | teks]`
- **Q2.4** Jumlahkan E(X) tahap-tahap yang kamu mainkan. Itulah banyak kemenangan yang wajar diharapkan.
  Bandingkan dengan banyak kemenanganmu yang sebenarnya. Jika berbeda, apakah game curang? Jelaskan.
  `[k2.q4a | angka]` `[k2.q4b | teks]`

### 7. Kegiatan 3: Peluang Satu Rangkaian Pertarungan

- **Q3.1** Tulis urutan hasilmu (misalnya M, K, M, M, K) dan hitung peluang urutan itu dengan mengalikan
  P(hasilmu) dari Kegiatan 2. `[k3.urutan | teks]` `[k3.hitung | angka]`
- **Q3.2** Mengapa peluang setiap tahap boleh dikalikan? `[k3.q2 | teks]`
- **Q3.3** Urutan hasil apa yang peluangnya paling besar untuk kelima tahap? Berapa peluangnya? Apakah
  urutan itu pasti terjadi? `[k3.q3a | teks]` `[k3.q3b | angka]` `[k3.q3c | teks]`
- **Q3.4** Hitung peluang menang di kelima tahap dan peluang kalah di kelima tahap. Apa yang kamu
  perhatikan? Mengapa bisa begitu? `[k3.menang | angka]` `[k3.kalah | angka]` `[k3.q4 | teks]`

### 8. Kegiatan 4: Di Luar Swarnadwipa

"Pengembara, aturan yang sama berlaku di luar kerajaan ini. Mari kita uji."

Semua angka di kegiatan ini adalah permisalan untuk latihan, bukan data nyata.

**Bagian A. Bernoulli atau bukan?** `[k4.pilah | tabel]`

| No | Situasi | Bernoulli? | Jika ya: berhasil = ... dan p | Alasan |
|---|---|---|---|---|
| 1 | Sebuah koin seimbang dilempar sekali; dicatat muncul angka atau gambar | `[pilihan]` | `[teks]` | `[teks]` |
| 2 | Sebuah dadu dilempar sekali; dicatat mata dadu yang muncul | `[pilihan]` | `[teks]` | `[teks]` |
| 3 | Sebuah dadu dilempar sekali; dicatat apakah muncul mata 6 | `[pilihan]` | `[teks]` | `[teks]` |
| 4 | Sepuluh bibit ditanam; dicatat banyak bibit yang tumbuh | `[pilihan]` | `[teks]` | `[teks]` |

**Bagian B. Soal cerita**

**Cerita A: Tendangan Penalti.** Rafi, pemain futsal sekolah, mencetak gol dari tendangan penalti dengan
peluang 0,8 setiap kali menendang. Misalkan X = 1 jika gol dan X = 0 jika tidak.
- a. Tuliskan fungsi peluang X. `[k4.a1 | angka]`
- b. Hitung E(X) dan Var(X). `[k4.a2 | angka]`
- c. Dalam latihan, dua tendangan Rafi berturut-turut gagal. Temannya berkata, "Tendangan berikutnya pasti
  gol, kan sudah dua kali gagal." Setujukah kamu? Jelaskan dengan konsep yang kamu pelajari. `[k4.a3 | teks]`

**Cerita B: Kain Songket.** Seorang perajin songket di Palembang memeriksa kain hasil tenunannya. Misalkan
peluang selembar kain memiliki cacat tenun adalah 0,05, dan setiap kain saling bebas. Petugas memberi nilai
X = 1 jika kain cacat.
- a. Pada pemeriksaan ini, apa yang disebut "berhasil" dan berapa p-nya? Apakah aneh menyebut kain cacat
  sebagai "berhasil"? Jelaskan. `[k4.b1 | teks]`
- b. Hitung P(X = 0), E(X), dan Var(X). `[k4.b2 | angka]`
- c. Tiga lembar kain diperiksa satu per satu. Berapa peluang ketiganya tidak cacat? `[k4.b3 | angka]`

**Cerita C: Bibit Cabai.** Sebuah toko pertanian menyebut peluang satu bibit cabai tumbuh adalah 0,7.
Bu Sari menanam 10 bibit dan yang tumbuh 5. Pak Budi menanam 1.000 bibit dan yang tumbuh 712.
- a. Berapa banyak bibit tumbuh yang diharapkan untuk Bu Sari dan untuk Pak Budi? `[k4.c1 | angka]`
- b. Hitung frekuensi relatif bibit yang tumbuh untuk masing-masing. `[k4.c2 | angka]`
- c. Frekuensi relatif siapa yang lebih dekat dengan 0,7? Mengapa? `[k4.c3 | teks]`
- d. Bu Sari berkata, "Tokonya bohong, peluangnya pasti bukan 0,7." Apakah kesimpulan itu tepat? Hubungkan
  dengan jawabanmu di Q2.4 tentang kemenanganmu sendiri. `[k4.c4 | teks]`

### 9. Refleksi

**A. Benar atau salah? Beri alasan.** `[r.bs1..bs5 | benar-salah + teks]`
1. Jika p = 0,7, aku pasti menang.
2. Setelah kalah di tahap 1, peluang menangku di tahap 2 menjadi lebih besar.
3. P(X = 1) + P(X = 0) selalu sama dengan 1.
4. Tahap yang Tidak dimainkan dihitung sebagai X = 0.
5. Menekan tombol QTE lebih cepat menaikkan peluang menang.

**B. Lengkapi kesimpulan.** `[r.k1..k4 | teks]`
1. Percobaan Bernoulli adalah satu percobaan dengan tepat ____ hasil.
2. Jika peluang berhasil p, peluang gagal adalah ____.
3. Nilai harapan percobaan Bernoulli adalah ____ dan variansinya ____.
4. Jika percobaan Bernoulli dengan peluang berhasil p diulang sangat banyak kali, proporsi hasil berhasil
   akan mendekati ____.

**C. Lihat lagi Tebakan Awalmu (T1 sampai T3, ditampilkan sistem).** Apa yang sekarang ingin kamu tambah
atau ubah? `[r.banding | teks]`

**D. Penilaian diri.** `[r.diri1..diri4 | pilihan: Sudah bisa / Belum yakin]`
1. Aku bisa menjelaskan mengapa satu tahap adalah satu percobaan Bernoulli.
2. Aku bisa menghitung P(X = x), E(X), dan Var(X).
3. Aku bisa menghitung peluang rangkaian percobaan Bernoulli yang saling bebas.
4. Aku bisa memakai konsep Bernoulli pada soal cerita di luar game.

### 10. Penutup

"Catatanmu kini lengkap, Pengembara. Peluang tidak menjanjikan hasil satu pertarungan, tetapi ia terlihat
dari banyak pertarungan." (Teks baru untuk LKPD, bukan dialog game.)

Tombol: **Kirim LKPD** · **Unduh LKPD (PDF)** · setelah terkirim: **Ajukan Perubahan**.

### 11. Glosarium

- **Percobaan Bernoulli:** satu percobaan acak dengan dua hasil, berhasil atau gagal.
- **Variabel acak:** aturan yang memberi angka pada setiap hasil percobaan.
- **Parameter p:** peluang berhasil pada percobaan Bernoulli.
- **Fungsi peluang:** rumus yang memberi peluang setiap nilai variabel acak.
- **Nilai harapan:** rata-rata jangka panjang variabel acak.
- **Variansi:** ukuran seberapa jauh nilai variabel acak biasanya menyimpang dari nilai harapannya.
- **Frekuensi relatif:** banyak kejadian dibagi banyak percobaan.
- **Saling bebas:** hasil satu percobaan tidak mengubah peluang percobaan lain.

---

## Bagian C. Kunci jawaban dan rubrik (untuk penilai)

### C.1 Kunci

Kegiatan 1 sampai 3 memakai p bawaan 0,5; 0,6; 0,7; 0,4; 0,3. [Pasti]

| Soal | Jawaban |
|---|---|
| T1 sampai T3 | Tidak dinilai. Dipakai di Refleksi C |
| Tabel K1 | 1 - p: 0,5; 0,4; 0,3; 0,6; 0,7. X = 1 jika Menang, 0 jika Kalah, "-" jika Tidak dimainkan |
| Q1.1 | Berhasil = menang (X = 1), gagal = kalah (X = 0). Dua kemungkinan hasil, tidak ada seri |
| Q1.2 | (1) Dua hasil saja: Serangan Penentu selalu berakhir menang atau kalah. (2) p sama selama tahap: kotak peluang sama dari pembuka sampai Serangan Penentu; ramuan, perlengkapan, dan QTE tidak mengubahnya. (3) Saling bebas: setiap tahap memakai undian baru; kalah di satu tahap tidak mengubah p tahap berikutnya |
| Q1.3 | Tidak. p setiap tahap sudah ditetapkan sebelum bertarung; hasil ditentukan satu undian dengan peluang p. Bukti: di tahap 4 dan 5 perlengkapan makin kuat tetapi p turun |
| Tabel K2 | P(X = 1) = p; P(X = 0) = 1 - p; P(hasilmu) sesuai hasil; E(X) = p; Var(X): 0,25; 0,24; 0,21; 0,24; 0,21 |
| Q2.1 | Tahap 1 (p = 0,5, Var = 0,25): menang dan kalah sama besar peluangnya, jadi hasilnya paling sulit ditebak |
| Q2.2 | p(1 - p): 0,6 × 0,4 = 0,4 × 0,6 = 0,24; faktornya sama, hanya bertukar tempat |
| Q2.3 | Rata-rata jangka panjang: jika tahap 3 dimainkan sangat banyak kali, sekitar 70% berakhir menang |
| Q2.4 | Jika kelima tahap dimainkan: 0,5 + 0,6 + 0,7 + 0,4 + 0,3 = 2,5. Hasil nyata tidak harus sama karena hanya 5 percobaan; bukan tanda curang |
| Q3.1 | Hasil kali P(hasilmu) tahap yang dimainkan. Contoh M, M, M, K, M: 0,5 × 0,6 × 0,7 × 0,6 × 0,3 = 0,0378 |
| Q3.2 | Tahap-tahap saling bebas: setiap Serangan Penentu memakai undian baru |
| Q3.3 | Pilih hasil berpeluang lebih besar di tiap tahap: tahap 1 seimbang, tahap 2 M, tahap 3 M, tahap 4 K, tahap 5 K. Ada dua urutan terbesar, M, M, M, K, K dan K, M, M, K, K, masing-masing 0,5 × 0,6 × 0,7 × 0,6 × 0,7 = 0,0882. Tidak pasti terjadi: hanya 8,82%, dari 2⁵ = 32 urutan yang mungkin |
| Q3.4 | Menang semua 0,5 × 0,6 × 0,7 × 0,4 × 0,3 = 0,0252; kalah semua 0,5 × 0,4 × 0,3 × 0,6 × 0,7 = 0,0252. Sama, karena kumpulan nilai 1 - p berisi angka yang sama dengan kumpulan nilai p, dan perkalian tidak bergantung urutan |
| K4 Bagian A | 1 Ya: berhasil = angka (atau gambar), p = 0,5. 2 Tidak: enam hasil. 3 Ya: berhasil = mata 6, p = 1/6. 4 Tidak: ini sepuluh percobaan, bukan satu; setiap bibit adalah satu percobaan Bernoulli |
| Cerita A | a. P(X = x) = 0,8^x × 0,2^(1 - x), x = 0 atau 1. b. E(X) = 0,8; Var(X) = 0,8 × 0,2 = 0,16. c. Tidak setuju: dalam model ini tiap tendangan saling bebas dengan p tetap 0,8, jadi dua kegagalan tidak membuat gol berikutnya pasti atau lebih mungkin |
| Cerita B | a. Berhasil = kain cacat, p = 0,05. Tidak aneh: "berhasil" hanya nama untuk hasil yang dicatat sebagai X = 1, bukan berarti hal yang baik. b. P(X = 0) = 0,95; E(X) = 0,05; Var(X) = 0,05 × 0,95 = 0,0475. c. 0,95 × 0,95 × 0,95 = 0,857375 |
| Cerita C | a. Bu Sari 10 × 0,7 = 7; Pak Budi 1.000 × 0,7 = 700 (jumlah E(X) setiap bibit). b. 5/10 = 0,5; 712/1.000 = 0,712. c. Pak Budi (selisih 0,012 dibanding 0,2) karena percobaannya jauh lebih banyak. d. Tidak tepat: 10 percobaan terlalu sedikit; hasil 5 dari 10 masih wajar walau p = 0,7. Untuk penilai: peluang paling banyak 5 dari 10 bibit tumbuh dengan p = 0,7 kira-kira 0,15. Sama dengan kemenangan siswa di Q2.4 yang tidak harus sama dengan harapan |
| Refleksi A | 1 Salah; 2 Salah; 3 Benar; 4 Salah; 5 Salah |
| Refleksi B | dua; 1 - p; p dan p(1 - p); p |

### C.2 Rubrik

**Isian angka dan tabel**

| Skor | Kriteria |
|---|---|
| 2 | Benar (selisih pembulatan di digit terakhir diterima) |
| 1 | Cara benar tetapi salah hitung |
| 0 | Salah atau kosong |

**Soal uraian**

| Skor | Kriteria |
|---|---|
| 4 | Benar, alasan memakai konsep yang tepat (dua hasil, p tetap, saling bebas, rata-rata jangka panjang, banyaknya percobaan) dan merujuk data atau cerita yang ditanyakan |
| 3 | Benar, alasan benar tetapi kurang lengkap atau tidak merujuk data |
| 2 | Sebagian benar, atau alasan mengandung satu salah paham |
| 1 | Salah, atau benar tanpa alasan |
| 0 | Kosong |

**Benar/salah beralasan dan Bagian A Kegiatan 4:** 1 untuk pilihan benar, 0 sampai 2 untuk alasan (2 tepat,
1 sebagian, 0 salah atau kosong).

**Usulan bobot [Dugaan, sesuaikan]:** isian angka 30%, uraian 50%, benar/salah beralasan dan pemilahan 20%.

Tebakan Awal, Refleksi C, dan penilaian diri tidak diberi skor; dipakai untuk melihat perubahan pemahaman.

---

## Bagian D. Panduan (dua dokumen terpisah, disusun nanti)

1. **Panduan website untuk guru:** login dengan email guru, daftar siswa, hasil permainan dan PDF, progres
   LKPD, menyetujui pengajuan perubahan, menghapus data siswa.
2. **Panduan pembelajaran:** alur asinkron, cara membimbing pengisian nama dan kelas, kunci, rubrik, dan
   soal yang perlu dibahas bersama (Q1.3, Q2.4, Q3.3, Cerita C).

---

## Bagian E. Yang masih perlu dikonfirmasi

1. Judul dan nomor keputusan dokumen CP, jika CP dikutip di laporan.
