# LKPD Adventure Bernoulli: Struktur dan Isi (revisi 2)

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
| Permainan | Putaran 1 memakai p bawaan (sama untuk semua). Putaran 2 memakai p lain (lihat 0.3) |
| Kunci LKPD | LKPD terbuka setelah tercatat 2 permainan |
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
| Dua permainan tercatat di akun | Membandingkan harapan dengan kenyataan, sendiri dan sekelas |
| - | Menjembatani ke distribusi binomial, refleksi akhir |

Rekap adalah **data mentah**; LKPD adalah **tempat mengolahnya**.

### 0.3 Putaran 2: rekomendasi

Pertanyaan pemilik: putaran 2 memakai p dari Setting Guru, atau main mode normal 2 kali ("tapi nanti
tidak Bernoulli dong")?

Koreksi: **bermain dengan p yang sama dua kali tetap percobaan Bernoulli.** [Pasti] Setiap tahap di setiap
permainan adalah satu percobaan Bernoulli, berapa pun p-nya dan berapa kali pun diulang. Yang berubah
hanya apa yang bisa dibandingkan.

| Pilihan | Kelebihan | Kekurangan |
|---|---|---|
| A. Putaran 2 = p bawaan lagi | Per tahap ada 2 percobaan dengan p sama; data kelas mudah digabung | Hitungan E(X) dan Var(X) sama untuk semua siswa, mudah disalin; tidak ada pengalaman "p berbeda" |
| B. Putaran 2 = satu set p dari guru untuk seluruh kelas | Siswa melihat bahwa hasil mengikuti p, bukan kemampuan bermain; data kelas tetap bisa digabung | Hitungan tetap sama untuk semua siswa |
| C. Putaran 2 = p unik per siswa, diacak otomatis sekali dan disimpan di akun | Hitungan tiap siswa berbeda (sulit menyalin, penting karena asinkron); tetap bisa dibandingkan dengan putaran 1 | Data kelas putaran 2 hanya bisa digabung lewat jumlah (Σp dibanding jumlah menang), bukan per tahap |

**Rekomendasi: C.** Alasan utamanya mode asinkron: siswa mengerjakan di rumah dan bisa saling bertukar
jawaban; dengan p unik, jawaban hitungan tidak bisa dipakai bersama. Kebutuhan data kelas tetap terpenuhi
lewat putaran 1 (p sama) dan lewat jumlah di putaran 2.

Aturan p acak: satu desimal, 0,1 sampai 0,9, kelima tahap berbeda. Diacak di perangkat siswa saat
putaran 1 selesai, disimpan sekali di akun, tidak bisa diubah siswa; guru bisa melihat dan menggantinya di
akun guru. Setting Guru di menu tetap ada untuk guru mencoba-coba p di perangkatnya sendiri.

Isi LKPD di bawah ditulis untuk pilihan C. Jika kelompok memilih A atau B, soal bertanda **(C)** perlu
disesuaikan.

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
| 3 | Tebakan Awal | 3 pertanyaan sebelum belajar | 3 |
| 4 | Gulungan Pengetahuan Resi Bayang | Definisi, rumus, contoh | - |
| 5 | Kegiatan 1: Catatan Pertarunganku | Data dua putaran, ciri Bernoulli | 2 tabel, 3 soal |
| 6 | Kegiatan 2: Menghitung Setiap Pertarungan | P(X = x), E(X), Var(X) dengan p putaran 2 | 1 tabel, 3 soal |
| 7 | Kegiatan 3: Ramalan Resi dan Kenyataan | Jumlah menang yang diharapkan vs nyata, sendiri dan sekelas | 3 tabel, 3 soal |
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

1. LKPD ini terbuka setelah kamu menyelesaikan 2 permainan. Datamu terisi otomatis dari akunmu.
2. Kerjakan berurutan, mulai dari Tebakan Awal. Jawabanmu tersimpan otomatis; kamu bisa melanjutkan di
   perangkat lain dengan akun yang sama.
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
3. membandingkan jumlah menang yang diharapkan dengan jumlah menang yang terjadi, dari sedikit dan dari
   banyak percobaan (Kegiatan 3);
4. menghitung peluang rangkaian percobaan Bernoulli yang saling bebas dan menjelaskan kapan jumlah
   keberhasilannya berdistribusi binomial (Kegiatan 4 dan 5).

(Rumusan dicocokkan lagi setelah kelompok mengirim tangkapan layar CP.)

### 3. Tebakan Awal

Jawab dengan pendapatmu sekarang. Bagian ini tidak dinilai benar atau salah; kamu akan melihatnya lagi di
Refleksi.

- **T1** Mengapa satu pertarungan melawan Arca Durgaraksa bisa disebut satu percobaan Bernoulli? `[t.t1 | teks]`
- **T2** Jika peluang menang di suatu tahap 0,7, apakah kamu pasti menang? `[t.t2 | teks]`
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

Tabel putaran 1 `[k1.r1 | tabel]` dan tabel putaran 2 `[k1.r2 | tabel]`, bentuknya sama:

| Tahap | Kondisi | p (sistem) | Hasil (sistem) | 1 - p | X |
|---|---|---|---|---|---|
| 1 sampai 5 | (sistem) | (sistem) | Menang / Kalah / Tidak dimainkan | `[angka]` | `[angka]` |

Untuk tahap Tidak dimainkan, kolom X diisi "-".

- **Q1.1** Dalam satu tahap, ada berapa kemungkinan hasil Serangan Penentu? Sebutkan. `[k1.q1 | teks]`
- **Q1.2** Tuliskan tiga ciri percobaan Bernoulli yang kamu lihat di game, masing-masing dengan satu bukti
  dari permainanmu. `[k1.q2 | tabel 3 baris: ciri | bukti]`
  Petunjuk: banyaknya hasil, apakah p berubah selama satu tahap, apakah hasil tahap sebelumnya
  memengaruhi tahap berikutnya.
- **Q1.3** Mengapa tahap yang Tidak dimainkan tidak diberi nilai X, padahal kamu tidak menang di tahap itu?
  `[k1.q3 | teks]`

### 6. Kegiatan 2: Menghitung Setiap Pertarungan (C)

Gunakan p putaran 2 milikmu.

Tabel `[k2.tabel | tabel]`:

| Tahap | p (sistem) | P(X = 1) | P(X = 0) | P(hasilmu) | E(X) | Var(X) |
|---|---|---|---|---|---|---|
| 1 sampai 5 | | `[angka]` | `[angka]` | `[angka]` | `[angka]` | `[angka]` |

P(hasilmu) = P(X = 1) jika menang, P(X = 0) jika kalah, "-" jika tidak dimainkan. E(X) dan Var(X) tetap
dihitung untuk tahap yang tidak dimainkan karena hanya bergantung pada p.

- **Q2.1** Di putaran 2, tahap mana yang Var(X)-nya paling besar? Apa artinya bagi hasil pertarungan di
  tahap itu? `[k2.q1a | pilihan]` `[k2.q1b | teks]`
- **Q2.2** Di putaran 1, Var(X) tahap 2 (p = 0,6) sama dengan Var(X) tahap 4 (p = 0,4). Mengapa bisa sama?
  `[k2.q2 | teks]`
- **Q2.3** E(X) sebuah tahap bisa 0,7, padahal X hanya 0 atau 1. Apa arti angka 0,7 itu? `[k2.q3 | teks]`

### 7. Kegiatan 3: Ramalan Resi dan Kenyataan

"Sebelum bertarung, aku bisa meramal berapa kemenangan yang wajar. Mari kita lihat apakah ramalanku tepat."

**Bagian A: dirimu**

Tabel `[k3.diri | tabel]`:

| Putaran | Jumlah p tahap yang dimainkan (jumlah menang yang diharapkan) | Jumlah menang nyata (sistem) | Selisih |
|---|---|---|---|
| 1 | `[angka]` | | `[angka]` |
| 2 | `[angka]` | | `[angka]` |

- **Q3.1** Apakah jumlah menangmu sama dengan ramalan? Jika berbeda, apakah game curang? Jelaskan.
  `[k3.q1 | teks]`

**Bagian B: satu kelas** (terbuka setelah guru menekan Buka Data Kelas)

Tabel `[k3.kelas1 | tabel]`, putaran 1 per tahap:

| Tahap | p | Banyak percobaan sekelas (sistem) | Banyak menang sekelas (sistem) | Frekuensi relatif menang |
|---|---|---|---|---|
| 1 sampai 5 | 0,5; 0,6; 0,7; 0,4; 0,3 | | | `[angka]` |

Tabel `[k3.kelas2 | tabel]`, putaran 2 seluruh kelas:

| Jumlah p semua siswa (sistem) | Jumlah menang semua siswa (sistem) | Selisih | Selisih dibagi jumlah p |
|---|---|---|---|
| | | `[angka]` | `[angka]` |

- **Q3.2** Hitung juga selisihmu sendiri di putaran 2 dibagi jumlah p milikmu. Bandingkan dengan hasil kelas.
  Mana yang lebih kecil? Mengapa? `[k3.q2 | teks]`
- **Q3.3** Mengapa data kelas putaran 2 dijumlahkan, bukan dihitung frekuensi per tahap seperti putaran 1?
  `[k3.q3 | teks]`

### 8. Kegiatan 4: Peluang Satu Rangkaian Pertarungan (C)

- **Q4.1** Tulis urutan hasilmu di putaran 2 (misalnya M, K, M, M, K) dan hitung peluang urutan itu.
  `[k4.urutan | teks]` `[k4.hitung | angka]`
- **Q4.2** Mengapa peluang setiap tahap boleh dikalikan? `[k4.q2 | teks]`
- **Q4.3** Dengan p putaran 2 milikmu, urutan hasil apa yang peluangnya paling besar? Berapa peluangnya?
  Apakah urutan itu pasti terjadi? `[k4.q3a | teks]` `[k4.q3b | angka]` `[k4.q3c | teks]`

### 9. Kegiatan 5: Dari Bernoulli ke Binomial

- **Q5.1** Dengan p putaran 1 (0,5; 0,6; 0,7; 0,4; 0,3), hitung peluang menang di kelima tahap dan peluang
  kalah di kelima tahap. Apa yang kamu perhatikan? Mengapa?
  `[k5.menang | angka]` `[k5.kalah | angka]` `[k5.q1 | teks]`
- **Q5.2** Apakah jumlah kemenanganmu dari lima tahap berdistribusi binomial? Syarat mana yang menentukan
  jawabanmu? `[k5.q2 | teks]`
- **Q5.3** Andaikan kelima tahap punya p = 0,6 dan saling bebas.
  a. Peluang satu urutan tertentu dengan tepat 3 menang, misalnya M, M, M, K, K. `[k5.a | angka]`
  b. Banyak urutan berbeda dengan tepat 3 menang. `[k5.b | angka]`
  c. Peluang menang tepat 3 kali. `[k5.c | angka]`
- **Tantangan (pilihan)** Hitung jumlah Var(X) kelima tahap putaran 1. `[k5.t | angka]`

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
atau ubah? `[r.banding | teks]`

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

Putaran 1 memakai p bawaan. Putaran 2 berbeda tiap siswa; kuncinya mengikuti rumus, dan akun guru bisa
menampilkan kunci hitungan per siswa dari p-nya (hanya terlihat oleh guru). Contoh pengerjaan untuk penilai
memakai p putaran 2 = 0,2; 0,9; 0,5; 0,7; 0,1. [Pasti]

| Soal | Jawaban |
|---|---|
| T1 sampai T3 | Tidak dinilai. Dipakai di Refleksi C |
| Tabel K1 | 1 - p dari p; X = 1 jika Menang, 0 jika Kalah, "-" jika Tidak dimainkan |
| Q1.1 | Dua: MENANG (X = 1) atau KALAH (X = 0) |
| Q1.2 | Dua hasil saja (tidak ada seri); p tetap selama tahap (kotak peluang sama dari pembuka sampai Serangan Penentu, ramuan dan QTE tidak mengubahnya); tidak dipengaruhi tahap lain (undian baru tiap tahap) |
| Q1.3 | Percobaannya tidak terjadi, jadi tidak ada hasil; X hanya ada jika percobaan dilakukan |
| Tabel K2 (contoh) | E(X) = p. Var(X): 0,16; 0,09; 0,25; 0,21; 0,09 |
| Q2.1 (contoh) | Tahap dengan p paling dekat 0,5 (contoh: tahap 3, Var = 0,25): hasilnya paling sulit ditebak |
| Q2.2 | p(1 - p): 0,6 × 0,4 = 0,4 × 0,6 = 0,24; faktornya sama, hanya bertukar tempat |
| Q2.3 | Rata-rata jangka panjang: jika tahap itu dimainkan sangat banyak kali, sekitar 70% berakhir menang |
| K3 diri | Putaran 1 (semua tahap dimainkan): 0,5 + 0,6 + 0,7 + 0,4 + 0,3 = 2,5. Putaran 2 (contoh): 2,4 |
| Q3.1 | Tidak harus sama; percobaan sedikit, hasil bisa jauh dari harapan; bukan tanda curang |
| Q3.2 | Selisih relatif kelas umumnya lebih kecil karena percobaannya jauh lebih banyak. Jawaban sebaliknya tetap bisa diterima jika dijelaskan dengan banyaknya data |
| Q3.3 | Di putaran 2 p tiap siswa berbeda, jadi percobaan per tahap tidak punya p yang sama untuk dibandingkan; jumlah tetap bermakna karena nilai harapan jumlah = jumlah p |
| Q4.1 | Hasil kali P(hasil) tahap yang dimainkan |
| Q4.2 | Tahap-tahap saling bebas: setiap Serangan Penentu memakai undian baru |
| Q4.3 (contoh) | Pilih hasil berpeluang lebih besar di tiap tahap: K, M, (M atau K), M, K. Peluang 0,8 × 0,9 × 0,5 × 0,7 × 0,9 = 0,2268. Tidak pasti terjadi; peluangnya masih jauh dari 1 |
| Q5.1 | Menang semua 0,5 × 0,6 × 0,7 × 0,4 × 0,3 = 0,0252; kalah semua 0,5 × 0,4 × 0,3 × 0,6 × 0,7 = 0,0252. Sama, karena kumpulan nilai 1 - p berisi angka yang sama dengan kumpulan nilai p |
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

Tebakan Awal, Refleksi C, dan penilaian diri tidak diberi skor; dipakai untuk melihat perubahan pemahaman.

---

## Bagian D. Panduan (dua dokumen terpisah, disusun nanti)

1. **Panduan website untuk guru:** login dengan email guru, daftar siswa, hasil permainan dan PDF, progres
   LKPD, Buka Data Kelas, mengganti p putaran 2, menyetujui pengajuan perubahan.
2. **Panduan pembelajaran:** alur asinkron, cara membimbing pengisian nama dan kelas, kunci, rubrik, dan
   soal yang perlu dibahas bersama (Q3.1 dan Q4.3).

---

## Bagian E. Yang masih perlu dikonfirmasi

1. Pilihan putaran 2: rekomendasi C (p unik otomatis) atau B (satu set dari guru).
2. Permainan yang dihitung: rekomendasi, sebuah permainan dihitung jika sampai rekap dan minimal 1 tahap
   dimainkan. Tanpa syarat ini, siswa bisa membuka LKPD dengan berhenti di tahap 1 dua kali.
3. Apakah Tebakan Awal tetap dipakai.
4. Tangkapan layar CP untuk mencocokkan Tujuan Pembelajaran.
