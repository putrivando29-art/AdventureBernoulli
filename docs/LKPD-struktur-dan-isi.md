# LKPD Adventure Bernoulli: Struktur dan Isi (revisi 6, versi sederhana)

Dokumen kerja untuk Kelompok 17, Universitas Sriwijaya. Mengikuti pola contoh LKPD dari dosen
("Distribusi Peubah Acak Geometri", 5 halaman): sampul, petunjuk pengerjaan dan petunjuk alat, pengamatan
alat peraga dengan tabel ceklis, kotak informasi, soal dengan kotak jawaban, lalu kesimpulan. Di LKPD ini
alat peraganya adalah game Adventure Bernoulli. Desain visual menyusul dari kelompok; pengodean menunggu
permintaan pemilik.

Tanda keyakinan: **[Pasti]** untuk rumus baku dan hitungan yang bisa dicek, **[Dugaan]** untuk perkiraan.

---

## Bagian 0. Keputusan (untuk kelompok, tidak ditampilkan ke siswa)

| Topik | Keputusan |
|---|---|
| Bentuk | Sederhana seperti contoh dosen: sekitar 5 halaman, 7 soal, 1 tabel hasil, 2 kotak informasi |
| Fokus | Hanya distribusi Bernoulli. Yang diutamakan: kegiatan dengan alat peraga (game) |
| Soal cerita di luar game | Satu saja (tendangan penalti) |
| Sasaran | Kelas XII, Matematika Tingkat Lanjut, Fase F |
| Permainan | Satu permainan, p bawaan (0,5; 0,6; 0,7; 0,4; 0,3). Boleh berhenti sebelum tahap 5; soal memakai tahap yang dimainkan |
| Data | Sebelum LKPD dikirim: permainan terbaru. Setelah dikirim: terkunci |
| Notasi | Mengikuti contoh dosen: peluang sukses p, peluang gagal q = 1 - p |
| Refleksi | Satu pertanyaan di akhir LKPD. PDF game hanya berisi hasil menang dan kalah |
| Penilaian | Oleh kelompok di luar website, dengan kunci dan rubrik di Bagian C |

Yang dihapus dibanding revisi 5 agar sederhana: Tebakan Awal, bagian materi panjang (diganti dua kotak
informasi seperti contoh dosen), peluang rangkaian pertarungan, pemilahan Bernoulli atau bukan, dua soal
cerita lain, pernyataan benar/salah, penilaian diri, glosarium. Akibatnya, kebebasan antarpercobaan hanya
diuji di soal cerita (6c), dan gagasan "hasil mendekati p jika percobaan banyak" hanya disinggung lewat arti
E(X) di kotak informasi. [Pasti]

---

## Bagian A. Susunan halaman

| Halaman | Isi |
|---|---|
| 1 | Sampul: "Lembar Kerja Peserta Didik", Nama, Kelas, ilustrasi Swarnadwipa |
| 2 | Judul "Distribusi Bernoulli", Tujuan Pembelajaran, Petunjuk Pengerjaan LKPD, Petunjuk Penggunaan Alat (game) |
| 3 | Amati alat peraga: soal 1 dan 2, tabel hasil permainan dengan ceklis |
| 4 | Kotak informasi 1 (p, q, fungsi peluang), soal 3; kotak informasi 2 (E(X), Var(X)), soal 4 dan 5 |
| 5 | Soal cerita (soal 6), kesimpulan (soal 7), refleksi, tombol Kirim LKPD |

---

## Bagian B. Isi untuk siswa

`[id]` adalah kotak jawaban; semua kotak bisa memakai editor persamaan. Data bertanda **(sistem)** terisi
dari akun.

### Halaman 1. Sampul

- **Lembar Kerja Peserta Didik**
- Nama: (sistem) · Kelas: (sistem)
- Universitas Sriwijaya · by Kelompok 17
- Ilustrasi saran: Pengembara, Arca Durgaraksa, dan Resi Bayang di ruang singgasana

### Halaman 2. Judul, tujuan, dan petunjuk

**Distribusi Bernoulli**

**Tujuan Pembelajaran.** Setelah bermain dan mengerjakan LKPD ini, kamu dapat:
1. mengidentifikasi ciri percobaan Bernoulli dari permainan Adventure Bernoulli;
2. menentukan fungsi peluang, nilai harapan, dan variansi distribusi Bernoulli;
3. menggunakan distribusi Bernoulli untuk menyelesaikan soal cerita.

**Petunjuk Pengerjaan LKPD**
1. Baca dan amati setiap informasi yang diberikan.
2. Jawablah sesuai instruksi pada tiap soal.
3. Tulis angka desimal dengan koma, misalnya 0,24. Tekan tombol **Rumus** untuk pangkat atau pecahan.
4. Periksa kembali jawabanmu sebelum menekan **Kirim LKPD**.

**Petunjuk Penggunaan Alat (game Adventure Bernoulli)**
1. Masuk dengan akun Google, lalu isi nama dan kelas.
2. Mainkan tahap 1 sampai 5. Kamu boleh berhenti sebelum tahap 5.
3. Perhatikan kotak peluang di awal setiap tahap dan hasil Serangan Penentu.
4. Setelah layar rekap muncul, buka LKPD ini.

### Halaman 3. Amati alat peraga

**Amatilah permainan Adventure Bernoulli dan jawablah pertanyaan berikut!**

1. Dalam satu tahap, ada berapa kemungkinan hasil Serangan Penentu? Sebutkan. `[s1]`
2. Pada tahap 3, peluang kamu menang adalah .... dan peluang kamu kalah adalah .... `[s2]`

**Tuliskan hasil permainanmu. Berikan tanda ceklis pada hasil setiap tahap.**

| Tahap | Peluang menang p (sistem) | Menang | Kalah | X | P(X = x) |
|---|---|---|---|---|---|
| 1 | 0,5 | `[ ]` | `[ ]` | `[t1x]` | `[t1p]` |
| 2 | 0,6 | `[ ]` | `[ ]` | `[t2x]` | `[t2p]` |
| 3 | 0,7 | `[ ]` | `[ ]` | `[t3x]` | `[t3p]` |
| 4 | 0,4 | `[ ]` | `[ ]` | `[t4x]` | `[t4p]` |
| 5 | 0,3 | `[ ]` | `[ ]` | `[t5x]` | `[t5p]` |

Isi X = 1 jika menang dan X = 0 jika kalah. Isi kolom P(X = x) setelah membaca kotak informasi di halaman 4.
Jika tahap tidak dimainkan, biarkan ceklis kosong dan isi "-".

### Halaman 4. Informasi dan perhitungan

**Kotak informasi 1**

> Setiap tahap adalah satu **percobaan Bernoulli**: hanya ada dua hasil. Menang disebut **sukses** (X = 1)
> dengan peluang **p**, dan kalah disebut **gagal** (X = 0) dengan peluang **q = 1 - p**. Peluang ini sudah
> ditetapkan sebelum bertarung dan tidak berubah karena cara bermain. Fungsi peluangnya:
> **P(X = x) = p^x · q^(1 - x)**, untuk x = 0 atau x = 1.

3. Gunakan rumus pada kotak informasi untuk menghitung P(X = 1) dan P(X = 0) pada tahap 2. Apakah hasilnya
   sama dengan p dan q? `[s3]`

**Kotak informasi 2**

> **Nilai harapan** E(X) = p, yaitu rata-rata nilai X jika percobaan diulang sangat banyak kali.
> **Variansi** Var(X) = p · q, yaitu ukuran seberapa sulit hasil percobaan ditebak.

4. Hitung E(X) dan Var(X) untuk tahap 1 dan tahap 3. Di tahap mana hasil pertarungan lebih sulit ditebak?
   Mengapa? `[s4]`
5. Peluang menang di tahap 3 adalah 0,7. Apakah itu berarti kamu pasti menang? Jelaskan dengan melihat hasil
   permainanmu. `[s5]`

### Halaman 5. Soal cerita, kesimpulan, refleksi

6. **Tendangan Penalti.** Rafi, pemain futsal sekolah, mencetak gol dari tendangan penalti dengan peluang 0,8
   setiap kali menendang (angka permisalan). Misalkan X = 1 jika gol dan X = 0 jika tidak.
   a. Tentukan p dan q, lalu tuliskan fungsi peluang X. `[s6a]`
   b. Hitung E(X) dan Var(X). `[s6b]`
   c. Dua tendangan Rafi berturut-turut gagal. Temannya berkata, "Tendangan berikutnya pasti gol." Setujukah
      kamu? Jelaskan. `[s6c]`
7. Permainan yang telah kamu lakukan merupakan contoh **distribusi Bernoulli**. Apa yang dapat kamu
   simpulkan tentang distribusi tersebut? `[s7]`

**Refleksi.** Setelah bermain dan mengerjakan LKPD ini, apa yang paling kamu pahami, dan apa yang masih
membingungkan? `[refleksi]`

Tombol: **Kirim LKPD** · **Unduh LKPD (PDF)** · setelah terkirim: **Ajukan Perubahan**.

---

## Bagian C. Kunci jawaban dan rubrik (untuk penilai)

### C.1 Kunci [Pasti]

| Soal | Jawaban |
|---|---|
| 1 | Dua: menang atau kalah |
| 2 | Menang 0,7; kalah 1 - 0,7 = 0,3 |
| Tabel | Ceklis sesuai rekap. X = 1 jika menang, 0 jika kalah. P(X = x) = p jika menang, q jika kalah. q tiap tahap: 0,5; 0,4; 0,3; 0,6; 0,7 |
| 3 | P(X = 1) = 0,6¹ · 0,4⁰ = 0,6; P(X = 0) = 0,6⁰ · 0,4¹ = 0,4. Sama dengan p dan q |
| 4 | Tahap 1: E(X) = 0,5; Var(X) = 0,5 · 0,5 = 0,25. Tahap 3: E(X) = 0,7; Var(X) = 0,7 · 0,3 = 0,21. Tahap 1 lebih sulit ditebak karena variansinya lebih besar; peluang menang dan kalah sama besar |
| 5 | Tidak. Masih ada peluang kalah q = 0,3. Siswa merujuk hasilnya sendiri: jika menang, menang itu bukan jaminan; jika kalah, itu bukti bahwa 0,7 bukan kepastian |
| 6a | p = 0,8; q = 0,2; P(X = x) = 0,8^x · 0,2^(1 - x), x = 0 atau 1 |
| 6b | E(X) = 0,8; Var(X) = 0,8 · 0,2 = 0,16 |
| 6c | Tidak setuju. Setiap tendangan saling bebas dengan peluang gol tetap 0,8; dua kegagalan tidak membuat gol berikutnya pasti atau lebih mungkin |
| 7 | Distribusi Bernoulli menggambarkan satu percobaan dengan dua hasil: sukses (X = 1) dengan peluang p dan gagal (X = 0) dengan peluang q = 1 - p. Fungsi peluangnya P(X = x) = p^x q^(1 - x), E(X) = p, Var(X) = pq. Peluang menunjukkan kemungkinan, bukan jaminan hasil satu percobaan |
| Refleksi | Tidak dinilai |

### C.2 Rubrik

| Jenis | Skor |
|---|---|
| Tabel (per tahap yang dimainkan) | 1 jika ceklis, X, dan P(X = x) benar; 0 jika ada yang salah |
| Soal hitungan (2, 3, 4 bagian hitung, 6a, 6b) | 2 benar; 1 cara benar tetapi salah hitung; 0 salah atau kosong |
| Soal uraian (1, 4 bagian alasan, 5, 6c, 7) | 4 benar dengan alasan memakai konsep yang tepat dan merujuk data permainan atau cerita; 3 benar tetapi alasan kurang lengkap; 2 sebagian benar atau ada satu salah paham; 1 salah atau tanpa alasan; 0 kosong |

Nilai akhir = jumlah skor dibagi skor maksimum × 100. Skor maksimum tabel bergantung pada banyak tahap yang
dimainkan.

---

## Bagian D. Yang masih perlu dikonfirmasi

1. Judul dan nomor keputusan dokumen CP, jika CP dikutip di laporan (tidak tampil di LKPD).
