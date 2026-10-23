# LKPD Adventure Bernoulli: Struktur dan Isi (revisi 3)

Dokumen kerja untuk Kelompok 17, Universitas Sriwijaya. Isinya struktur LKPD digital dari sampul sampai
penutup, teks untuk siswa, kolom isian, kunci jawaban, rubrik, dan hal yang masih perlu dikonfirmasi.
Desain visual menyusul dari kelompok; teks di sini menjadi isi yang dimasukkan 1:1 ke desain itu.
Rancangan pendataan (login, database, akun guru) ada di `docs/rancangan-firebase.md`.

Tanda keyakinan: **[Pasti]** untuk rumus baku dan hitungan yang bisa dicek, **[Kemungkinan Besar]**
untuk interpretasi sumber, **[Dugaan]** untuk perkiraan yang harus dicek kelompok.

---

## Bagian 0. Keputusan dan analisis

### 0.1 Keputusan pemilik yang membentuk LKPD ini

| Topik | Keputusan |
|---|---|
| Sasaran | Kelas XII, Matematika Tingkat Lanjut, Fase F (kelas pasti mengikuti ATP sekolah mitra) |
| Kurikulum | LKPD hanya memuat Tujuan Pembelajaran. Kelompok mengirim tangkapan layar CP Fase F untuk dicocokkan |
| Prasyarat | Siswa sudah belajar kombinasi C(n, r) |
| Waktu | Asinkron, dikerjakan kapan saja; 1 siswa 1 perangkat |
| Login | Google. Setelah login, siswa mengisi nama dan kelas sendiri. Data tersimpan di akun, jadi bisa pindah perangkat |
| Permainan | **Satu kali, tahap 1 sampai 5, dengan p bawaan (0,5; 0,6; 0,7; 0,4; 0,3).** Tidak ada putaran kedua dan tidak memakai Setting Guru |
| Kunci LKPD | LKPD terbuka setelah permainan itu tercatat |
| Rekap dan PDF | Hanya hasil menang dan kalah, ditambah umpan balik singkat tentang aplikasi. Refleksi hanya di LKPD |
| Isian | Semua isian (angka, rumus, uraian) bisa memakai editor persamaan (pangkat, indeks bawah, pecahan) |
| Umpan balik otomatis | Tidak ada. Jawaban murni dari siswa |
| Setelah dikirim | Jawaban terkunci. Siswa bisa mengajukan perubahan; guru menyetujui di akun guru |
| Penilaian | Oleh kelompok, di luar website. Dokumen ini menyediakan kunci dan rubrik |
| Kegiatan di luar game | Tidak dimasukkan. LKPD berfokus pada data menang dan kalah siswa |

### 0.2 Apa yang dikerjakan game, apa yang dikerjakan LKPD

| Di game | Di LKPD |
|---|---|
| Satu tahap = satu percobaan Bernoulli; p tiap tahap terlihat di pembuka tahap dan HUD | Menyebutkan ciri percobaan Bernoulli dengan bukti dari permainan sendiri |
| Rekap: tahap, kondisi, p, hasil, jumlah menang dan kalah, umpan balik aplikasi | Menghitung 1 - p, X, P(hasil), E(X), Var(X), peluang urutan, jumlah menang yang diharapkan |
| Satu permainan per siswa tercatat di akun; semua siswa memakai p yang sama | Membandingkan harapan dengan kenyataan, untuk diri sendiri (5 percobaan) dan untuk sekelas (banyak percobaan) |
| - | Menjembatani ke distribusi binomial, refleksi akhir |

Rekap adalah **data mentah**; LKPD adalah **tempat mengolahnya**.

### 0.3 Akibat keputusan "satu permainan, p bawaan"

- **Data kelas per tahap kini sah.** [Pasti] Semua siswa memakai p yang sama di setiap tahap, jadi hasil
  tahap 3 dari 30 siswa adalah 30 percobaan dengan p = 0,7 dan frekuensi relatifnya bisa dibandingkan
  dengan p. Kegiatan 3 kembali memakai bentuk ini.
- **Data pribadi hanya 5 percobaan**, satu per tahap. Siswa tidak bisa melihat "frekuensi mendekati p"
  dari datanya sendiri; bagian ini bergantung pada data kelas.
- **Sebagian hitungan sama untuk semua siswa** (1 - p, E(X), Var(X), jumlah menang yang diharapkan 2,5,
  urutan paling mungkin). Dalam mode asinkron, angka-angka ini mudah disalin. Yang berbeda tiap siswa: X,
  P(hasil), peluang urutan hasil, selisih harapan dan kenyataan, dan semua uraian yang meminta bukti dari
  permainan sendiri. Karena itu bobot penilaian sebaiknya lebih banyak di uraian (lihat C.2).

### 0.4 Prinsip agar LKPD tidak terasa dipaksakan

1. **Data dulu, istilah kemudian.** Setiap kegiatan dimulai dari hasil permainan siswa sendiri.
2. **Cerita hanya bingkai.** Swarnadwipa dipakai di judul kegiatan dan pesan pembuka, bukan di setiap soal.
3. **Setiap soal punya alasan.** Sekitar 20 isian.
4. **Menyasar salah paham yang dipancing game:** "p = 0,7 berarti pasti menang", "setelah kalah peluang
   naik", "QTE mengubah peluang", "tahap Tidak dimainkan = kalah".

---

## Bagian A. Struktur LKPD

| No | Bagian | Isi pokok | Isian |
|---|---|---|---|
| 0 | Sampul | Judul, identitas (terisi dari akun) | - |
| 1 | Petunjuk penggunaan | Cara mengerjakan, editor persamaan, kirim | - |
| 2 | Tujuan pembelajaran | 4 tujuan | - |
| 3 | Tebakan Awal (menunggu konfirmasi) | 3 pertanyaan sebelum belajar | 3 |
| 4 | Gulungan Pengetahuan Resi Bayang | Definisi, rumus, contoh | - |
| 5 | Kegiatan 1: Catatan Pertarunganku | Data permainan, ciri Bernoulli | 1 tabel, 3 soal |
| 6 | Kegiatan 2: Menghitung Setiap Pertarungan | P(X = x), E(X), Var(X) | 1 tabel, 3 soal |
| 7 | Kegiatan 3: Ramalan Resi dan Kenyataan | Harapan vs kenyataan, diri sendiri dan sekelas | 3 tabel, 3 soal |
| 8 | Kegiatan 4: Peluang Satu Rangkaian Pertarungan | Peluang urutan, kebebasan, urutan paling mungkin | 3 soal |
| 9 | Kegiatan 5: Dari Bernoulli ke Binomial | Menang semua dan kalah semua, syarat binomial, C(5, 3) | 3 soal (+1 tantangan) |
| 10 | Refleksi | Benar/salah beralasan, kesimpulan, membandingkan dengan Tebakan Awal, penilaian diri | 4 bagian |
| 11 | Penutup | Pesan Resi Bayang, Kirim LKPD | - |
| 12 | Glosarium | Istilah | - |

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

1. LKPD ini terbuka setelah kamu menyelesaikan permainan tahap 1 sampai 5. Datamu terisi otomatis dari
   akunmu.
2. Kerjakan berurutan. Jawabanmu tersimpan otomatis; kamu bisa melanjutkan di perangkat lain dengan akun
   yang sama.
3. Tulis angka desimal dengan koma, misalnya 0,24. Untuk pangkat, pecahan, atau indeks, tekan tombol
   **Rumus**.
4. Tidak ada tanda benar atau salah selama mengerjakan. Jawab dengan pemahamanmu sendiri.
5. Tekan **Kirim LKPD** jika sudah selesai. Setelah terkirim, jawaban terkunci. Untuk mengubahnya, tekan
   **Ajukan Perubahan** dan tunggu persetujuan guru.

### 2. Tujuan pembelajaran

Setelah bermain dan mengerjakan LKPD ini, kamu dapat:
1. menjelaskan ciri percobaan Bernoulli dengan bukti dari hasil permainanmu (Kegiatan 1);
2. menentukan fungsi peluang P(X = x) = p^x (1 - p)^(1 - x), nilai harapan E(X) = p, dan variansi
   Var(X) = p(1 - p) (Kegiatan 2);
3. membandingkan hasil yang diharapkan dengan hasil yang terjadi, dari sedikit percobaan (permainanmu)
   dan dari banyak percobaan (satu kelas) (Kegiatan 3);
4. menghitung peluang rangkaian percobaan Bernoulli yang saling bebas dan menjelaskan kapan jumlah
   keberhasilannya berdistribusi binomial (Kegiatan 4 dan 5).

(Rumusan dicocokkan lagi setelah kelompok mengirim tangkapan layar CP.)

### 3. Tebakan Awal (menunggu konfirmasi pemilik)

Jawab dengan pendapatmu sekarang. Bagian ini tidak dinilai benar atau salah; kamu akan melihatnya lagi di
Refleksi.

- **T1** Mengapa satu pertarungan melawan Arca Durgaraksa bisa disebut satu percobaan Bernoulli? `[t.t1 | teks]`
- **T2** Di tahap 3 peluang menangmu 0,7. Apakah kamu pasti menang? `[t.t2 | teks]`
- **T3** Apakah kalah di satu tahap memengaruhi peluang menang di tahap berikutnya? `[t.t3 | teks]`

### 4. Gulungan Pengetahuan Resi Bayang

"Pengembara, setiap pertarunganmu sudah tercatat. Sekarang mari kita baca catatan itu."

- **Percobaan Bernoulli:** satu percobaan dengan dua hasil saja, berhasil atau gagal.
- **Variabel acak X:** X = 1 jika berhasil, X = 0 jika gagal.
- **p** peluang berhasil, **1 - p** peluang gagal; jumlahnya selalu 1.
- **Fungsi peluang:** P(X = x) = p^x (1 - p)^(1 - x), untuk x = 0 atau 1. [Pasti]
- **Nilai harapan:** E(X) = p. **Variansi:** Var(X) = p(1 - p). [Pasti]
- **Saling bebas:** hasil satu percobaan tidak mengubah peluang percobaan lain. Peluang rangkaian hasil
  percobaan yang saling bebas = hasil kali peluang masing-masing. [Pasti]

Contoh (p yang tidak dipakai di game): p = 0,45. P(X = 1) = 0,45; P(X = 0) = 0,55; E(X) = 0,45;
Var(X) = 0,45 × 0,55 = 0,2475. [Pasti]

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

- **Q1.1** Dalam satu tahap, ada berapa kemungkinan hasil Serangan Penentu? Sebutkan. `[k1.q1 | teks]`
- **Q1.2** Tuliskan tiga ciri percobaan Bernoulli yang kamu lihat di game, masing-masing dengan satu bukti
  dari permainanmu. `[k1.q2 | tabel 3 baris: ciri | bukti]`
  Petunjuk: banyaknya hasil, apakah p berubah selama satu tahap, apakah hasil tahap sebelumnya
  memengaruhi tahap berikutnya.
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

### 7. Kegiatan 3: Ramalan Resi dan Kenyataan

"Sebelum bertarung, aku bisa meramal berapa kemenangan yang wajar. Mari kita lihat apakah ramalanku tepat."

**Bagian A: dirimu**

Tabel `[k3.diri | tabel]`:

| Jumlah p tahap yang kamu mainkan (jumlah menang yang diharapkan) | Jumlah menang nyata (sistem) | Selisih |
|---|---|---|
| `[angka]` | | `[angka]` |

- **Q3.1** Apakah jumlah menangmu sama dengan ramalan? Jika berbeda, apakah game curang? Jelaskan.
  `[k3.q1 | teks]`

**Bagian B: satu kelas** (terbuka setelah guru menekan Buka Data Kelas)

Tabel `[k3.kelas | tabel]`:

| Tahap | p | Banyak siswa yang memainkan (sistem) | Banyak yang menang (sistem) | Frekuensi relatif menang | Selisih dengan p |
|---|---|---|---|---|---|
| 1 | 0,5 | | | `[angka]` | `[angka]` |
| 2 | 0,6 | | | `[angka]` | `[angka]` |
| 3 | 0,7 | | | `[angka]` | `[angka]` |
| 4 | 0,4 | | | `[angka]` | `[angka]` |
| 5 | 0,3 | | | `[angka]` | `[angka]` |

Tabel `[k3.jumlah | tabel]`:

| Jumlah menang yang diharapkan sekelas (sistem: jumlah p semua tahap yang dimainkan) | Jumlah menang nyata sekelas (sistem) | Selisih dibagi jumlah yang diharapkan |
|---|---|---|
| | | `[angka]` |

- **Q3.2** Hitung juga selisihmu sendiri dibagi jumlah menang yang kamu harapkan. Bandingkan dengan hasil
  kelas. Mana yang lebih kecil? Mengapa? `[k3.q2 | teks]`
- **Q3.3** Frekuensi relatif menang sekelas di setiap tahap tidak tepat sama dengan p. Apa yang kamu
  perkirakan terjadi jika 1.000 siswa memainkan game ini? `[k3.q3 | teks]`

### 8. Kegiatan 4: Peluang Satu Rangkaian Pertarungan

- **Q4.1** Tulis urutan hasilmu (misalnya M, K, M, M, K) dan hitung peluang urutan itu dengan mengalikan
  P(hasilmu) dari Kegiatan 2. `[k4.urutan | teks]` `[k4.hitung | angka]`
- **Q4.2** Mengapa peluang setiap tahap boleh dikalikan? `[k4.q2 | teks]`
- **Q4.3** Urutan hasil apa yang peluangnya paling besar? Berapa peluangnya? Apakah urutan itu pasti
  terjadi? `[k4.q3a | teks]` `[k4.q3b | angka]` `[k4.q3c | teks]`

### 9. Kegiatan 5: Dari Bernoulli ke Binomial

- **Q5.1** Hitung peluang menang di kelima tahap dan peluang kalah di kelima tahap. Apa yang kamu
  perhatikan? Mengapa? `[k5.menang | angka]` `[k5.kalah | angka]` `[k5.q1 | teks]`
- **Q5.2** Apakah jumlah kemenanganmu dari lima tahap berdistribusi binomial? Syarat mana yang menentukan
  jawabanmu? `[k5.q2 | teks]`
- **Q5.3** Andaikan kelima tahap punya p = 0,6 dan saling bebas.
  a. Peluang satu urutan tertentu dengan tepat 3 menang, misalnya M, M, M, K, K. `[k5.a | angka]`
  b. Banyak urutan berbeda dengan tepat 3 menang. `[k5.b | angka]`
  c. Peluang menang tepat 3 kali. `[k5.c | angka]`
- **Tantangan (pilihan)** Hitung jumlah Var(X) kelima tahap. `[k5.t | angka]`

### 10. Refleksi

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
4. Jumlah keberhasilan dari beberapa percobaan Bernoulli yang saling bebas berdistribusi binomial jika ____.

**C. Lihat lagi Tebakan Awalmu (T1 sampai T3, ditampilkan sistem).** Apa yang sekarang ingin kamu tambah
atau ubah? `[r.banding | teks]` (Jika Tebakan Awal tidak dipakai, bagian ini diganti: "Apa satu hal
tentang peluang yang paling berubah dalam pikiranmu setelah bermain dan mengerjakan LKPD ini?")

**D. Penilaian diri.** `[r.diri1..diri4 | pilihan: Sudah bisa / Belum yakin]`
1. Aku bisa menjelaskan mengapa satu tahap adalah satu percobaan Bernoulli.
2. Aku bisa menghitung P(X = x), E(X), dan Var(X).
3. Aku bisa menjelaskan mengapa hasil nyata tidak harus sama dengan harapan.
4. Aku bisa menjelaskan kapan jumlah keberhasilan menjadi binomial.

### 11. Penutup

"Catatanmu kini lengkap, Pengembara. Peluang tidak menjanjikan hasil satu pertarungan, tetapi ia terlihat
dari banyak pertarungan." (Teks baru untuk LKPD, bukan dialog game.)

Tombol: **Kirim LKPD** · **Unduh LKPD (PDF)** · setelah terkirim: **Ajukan Perubahan**.

### 12. Glosarium

Percobaan Bernoulli; variabel acak; fungsi peluang; nilai harapan (rata-rata jangka panjang); variansi
(ukuran seberapa jauh nilai biasanya menyimpang dari nilai harapan); frekuensi relatif; saling bebas;
distribusi binomial (banyak keberhasilan dari n percobaan Bernoulli saling bebas dengan p sama).

---

## Bagian C. Kunci jawaban dan rubrik (untuk penilai)

### C.1 Kunci

Semua memakai p bawaan 0,5; 0,6; 0,7; 0,4; 0,3. [Pasti]

| Soal | Jawaban |
|---|---|
| T1 sampai T3 | Tidak dinilai. Dipakai di Refleksi C |
| Tabel K1 | 1 - p: 0,5; 0,4; 0,3; 0,6; 0,7. X = 1 jika Menang, 0 jika Kalah, "-" jika Tidak dimainkan |
| Q1.1 | Dua: MENANG (X = 1) atau KALAH (X = 0) |
| Q1.2 | Dua hasil saja (tidak ada seri); p tetap selama tahap (kotak peluang sama dari pembuka sampai Serangan Penentu, ramuan dan QTE tidak mengubahnya); tidak dipengaruhi tahap lain (undian baru tiap tahap) |
| Q1.3 | Tidak. p setiap tahap sudah ditetapkan sebelum bertarung; perlengkapan hanya bagian cerita dan memengaruhi fase hack and slash. Hasil ditentukan satu undian dengan peluang p, bukan oleh cara bermain. Bukti: di tahap 4 dan 5 perlengkapan makin kuat tetapi p turun |
| Tabel K2 | P(X = 1) = p; P(X = 0) = 1 - p; P(hasilmu) sesuai hasil; E(X) = p; Var(X): 0,25; 0,24; 0,21; 0,24; 0,21 |
| Q2.1 | Tahap 1 (p = 0,5, Var = 0,25): menang dan kalah sama besar peluangnya, jadi hasilnya paling sulit ditebak |
| Q2.2 | p(1 - p): 0,6 × 0,4 = 0,4 × 0,6 = 0,24; faktornya sama, hanya bertukar tempat |
| Q2.3 | Rata-rata jangka panjang: jika tahap 3 dimainkan sangat banyak kali, sekitar 70% berakhir menang |
| K3 diri | Jika kelima tahap dimainkan: 0,5 + 0,6 + 0,7 + 0,4 + 0,3 = 2,5. Jika berhenti lebih awal, jumlahkan p tahap yang dimainkan saja |
| Q3.1 | Tidak harus sama; hanya 5 percobaan, jadi hasil bisa jauh dari 2,5 (misalnya 0 atau 5 menang). Bukan tanda curang |
| Q3.2 | Selisih relatif kelas umumnya lebih kecil karena percobaannya jauh lebih banyak. Jawaban sebaliknya tetap bisa diterima jika dijelaskan dengan banyaknya data |
| Q3.3 | Frekuensi relatif tiap tahap cenderung makin dekat ke p (hukum bilangan besar, secara informal), tetapi tetap tidak harus tepat sama |
| Q4.1 | Hasil kali P(hasilmu) tahap yang dimainkan. Contoh M, M, M, K, M: 0,5 × 0,6 × 0,7 × 0,6 × 0,3 = 0,0378 |
| Q4.2 | Tahap-tahap saling bebas: setiap Serangan Penentu memakai undian baru |
| Q4.3 | Pilih hasil berpeluang lebih besar di tiap tahap: tahap 1 seimbang, tahap 2 M, tahap 3 M, tahap 4 K, tahap 5 K. Ada dua urutan terbesar, M, M, M, K, K dan K, M, M, K, K, masing-masing 0,5 × 0,6 × 0,7 × 0,6 × 0,7 = 0,0882. Tidak pasti terjadi: hanya 8,82% dari 2⁵ = 32 urutan yang mungkin |
| Q5.1 | Menang semua 0,5 × 0,6 × 0,7 × 0,4 × 0,3 = 0,0252; kalah semua 0,5 × 0,4 × 0,3 × 0,6 × 0,7 = 0,0252. Sama, karena kumpulan nilai 1 - p berisi angka yang sama dengan kumpulan nilai p, dan perkalian tidak bergantung urutan |
| Q5.2 | Tidak; binomial butuh p sama di setiap percobaan (juga banyak percobaan tetap dan saling bebas) |
| Q5.3 | a. 0,6³ × 0,4² = 0,03456. b. C(5, 3) = 10. c. 10 × 0,03456 = 0,3456 |
| Tantangan | 0,25 + 0,24 + 0,21 + 0,24 + 0,21 = 1,15 |
| Refleksi A | 1 Salah; 2 Salah; 3 Benar; 4 Salah; 5 Salah |
| Refleksi B | dua; 1 - p; p dan p(1 - p); p sama di setiap percobaan (dan banyak percobaan tetap) |

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
| 4 | Benar, alasan memakai konsep yang tepat (dua hasil, p tetap, saling bebas, rata-rata jangka panjang) dan merujuk data permainan sendiri |
| 3 | Benar, alasan benar tetapi kurang lengkap atau tidak merujuk data |
| 2 | Sebagian benar, atau alasan mengandung satu salah paham |
| 1 | Salah, atau benar tanpa alasan |
| 0 | Kosong |

**Benar/salah beralasan:** 1 untuk pilihan benar, 0 sampai 2 untuk alasan (2 tepat, 1 sebagian, 0 salah
atau kosong).

**Usulan bobot [Dugaan, sesuaikan]:** karena angka E(X), Var(X), dan 1 - p sama untuk semua siswa (0.3),
bobot uraian dibuat lebih besar: isian angka 30%, uraian 50%, benar/salah beralasan 20%.

Tebakan Awal, Refleksi C, dan penilaian diri tidak diberi skor; dipakai untuk melihat perubahan pemahaman.

---

## Bagian D. Panduan (dua dokumen terpisah, disusun nanti)

1. **Panduan website untuk guru:** login dengan email guru, daftar siswa, hasil permainan dan PDF, progres
   LKPD, Buka Data Kelas, menyetujui pengajuan perubahan.
2. **Panduan pembelajaran:** alur asinkron, cara membimbing pengisian nama dan kelas, kunci, rubrik, dan
   soal yang perlu dibahas bersama (Q1.3, Q3.1, dan Q4.3).

---

## Bagian E. Yang masih perlu dikonfirmasi

1. Apakah Tebakan Awal dipakai.
2. Jika siswa berhenti sebelum tahap 5: LKPD tetap terbuka dengan tahap "Tidak dimainkan", atau siswa
   wajib menyelesaikan kelima tahap?
3. Bolehkah siswa bermain lagi setelah permainan pertama tercatat (hanya untuk hiburan, tidak dipakai LKPD)?
4. Tangkapan layar CP untuk mencocokkan Tujuan Pembelajaran.
