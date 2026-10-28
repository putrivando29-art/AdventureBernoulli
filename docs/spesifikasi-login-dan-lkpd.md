# Spesifikasi Fitur: Login, LKPD Digital, dan Akun Guru

Acuan pengodean nanti. Isi LKPD mengikuti draf kelompok (`LKPD-Distribusi-Bernoulli.pdf`, 6 halaman, dari
Microsoft Word). Pemasangan Firebase ada di `docs/tutorial-firebase.md`. Belum dikodekan; pengodean
menunggu permintaan pemilik.

---

## 1. Alur besar

```
Buka situs
  → Halaman Masuk (email dan kata sandi) atau Daftar (email, kata sandi, nama, kelas)
  → Menu utama (email dan tombol Keluar terlihat)
  → Bermain tahap 1 sampai 5 (boleh berhenti)
  → Rekap ringkas: hasil menang dan kalah
  → Tombol "Kerjakan LKPD"
  → LKPD (5 halaman asli draf, isian di atas kotak) → Kirim LKPD
Akun guru (email terdaftar) → tab "Guru" di menu
```

---

## 2. Login dan profil (email dan kata sandi)

| Fitur | Perilaku |
|---|---|
| Halaman Masuk | Ditampilkan sebelum menu. Isi: judul game, Universitas Sriwijaya · by Kelompok 17, dua tab: **Masuk** dan **Daftar**. Tanpa login, game tidak bisa dimulai |
| Tab Masuk | Email, Kata sandi (dengan tombol tampilkan/sembunyikan), tombol **Masuk**, tautan **Lupa kata sandi?** |
| Tab Daftar | Email, Kata sandi (minimal 6 karakter), Ulangi kata sandi, Nama (maks. 40 karakter), Kelas (maks. 15 karakter), tombol **Daftar**. Setelah berhasil, langsung masuk ke menu |
| Lupa kata sandi | Siswa mengisi email, sistem mengirim email untuk membuat kata sandi baru. Pesan: "Jika email terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Periksa juga folder spam." |
| Pesan galat (Bahasa Indonesia) | "Email sudah terdaftar. Silakan masuk." · "Kata sandi minimal 6 karakter." · "Kata sandi tidak sama." · "Email atau kata sandi salah." · "Format email tidak valid." · "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi." · "Tidak ada koneksi internet." |
| Login berikutnya | Tetap masuk di perangkat itu sampai menekan Keluar. Nama dan kelas terisi dari akun; masih bisa diubah di menu |
| Pindah perangkat | Masuk dengan email dan kata sandi yang sama; permainan dan jawaban LKPD muncul kembali |
| Keluar | Tombol **Keluar** di menu. Data tetap tersimpan di akun |
| Akun guru | Dibuat pemilik di Firebase Console (bukan lewat tab Daftar). Dikenali dari UID-nya di koleksi `guru`; tombol **Guru** muncul di menu |
| Gagal terhubung | Jika Firebase tidak bisa dimuat, muncul pesan internet yang sudah ada beserta tombol Muat Ulang |
| Analytics | Tidak dipakai |

## 3. Permainan dan rekap

| Fitur | Perilaku |
|---|---|
| Penyimpanan | Saat rekap tampil, permainan disimpan ke akun jika memakai p bawaan dan minimal 1 tahap dimainkan |
| Mode latihan | Jika p diubah lewat Setting Peluang, menu menampilkan "Mode latihan: peluang diubah, hasil tidak dipakai LKPD". Permainan latihan tidak disimpan |
| Rekap di layar dan PDF | Judul, kalimat pembuka ("Berikut catatan pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa."), nama, kelas, tanggal, tabel Tahap, Kondisi, p, Hasil, dan jumlah menang, kalah, tidak dimainkan. Tanpa rumus, perhitungan, atau refleksi |
| Tombol di rekap | **Unduh PDF Rekap**, **Buka PDF di Tab Baru**, **Kerjakan LKPD**, **Kembali ke Menu Utama** |

---

## 4. LKPD untuk siswa (sudah dikodekan)

### 4.1 Akses dan data

| Fitur | Perilaku |
|---|---|
| Kunci akses | LKPD terbuka jika sudah ada permainan tersimpan (p bawaan, minimal 1 tahap dimainkan). Jika belum, muncul "Selesaikan permainan dulu" |
| Data yang dipakai | Sebelum LKPD dikirim: permainan **terbaru**. Setelah dikirim: permainan yang dipakai saat itu **dikunci** |
| Pemberitahuan data berubah | Jika siswa bermain lagi sebelum mengirim: "Datamu berubah karena kamu bermain lagi. Periksa kembali jawabanmu." |
| Progres permainan | Di atas lembar: hasil tiap tahap (T1 Menang, T2 Kalah, T3 -, ...) dan "Tahap terakhir yang dimainkan: n" |

### 4.2 Tampilan 1:1 dengan draf kelompok

- Halaman 1 sampai 5 adalah **gambar asli** draf Word kelompok (`assets/lkpd/hal-1.png` sampai `hal-5.png`,
  200 dpi, dibuat dari PDF draf tanpa diubah). Teks soal, kotak, warna, dan tata letak tidak diubah sama sekali.
  Halaman 6 (kunci dan rubrik) tidak ditampilkan ke siswa.
- Kolom isian ditempel tepat di atas kotak "Jawaban" dan sel tabel. Koordinatnya diukur dari PDF draf
  (150 dpi, 1241 x 1754 piksel per halaman) dan disimpan di `js/lkpd-lembar.js`. Jika draf diganti, gambar
  dan koordinat harus diukur ulang.
- Satu halaman per layar. **Berikutnya** baru bisa ditekan jika semua isian di halaman itu terisi; isian yang
  kosong ditandai merah. Tombol nomor halaman juga mengikuti aturan ini.
- **Zoom:** cubit dua jari di lembar (HP), Ctrl + gulir atau tombol − dan + (laptop), tombol **Pas Layar**.
  Di HP, kotak yang diketuk otomatis diperbesar sampai selebar layar. Selama LKPD terbuka, zoom bawaan
  browser dimatikan agar iPhone tidak memperbesar halaman sendiri saat kotak diketuk.
- Jawaban panjang: kotak bisa digulir di dalamnya (ukuran kotak mengikuti draf).
- Tabel halaman 3: tahap yang tidak dimainkan diarsir tipis dan otomatis berisi "-" (sesuai catatan di bawah
  tabel draf); ceklisnya tidak bisa diketuk. Ceklis Menang dan Kalah: satu per baris, ketuk lagi untuk menghapus.
- Huruf jawaban: Arial berwarna biru tua, ukuran sama dengan teks draf (sekitar 10,6 pt).

### 4.3 Isian dan ID kolom

| ID | Bagian draf | Jenis isian |
|---|---|---|
| `nama`, `kelas` | Garis Nama dan Kelas di sampul (halaman 1) | Ditulis siswa langsung di garis sampul |
| `s1`, `s2` | Soal 1 dan 2 | Uraian |
| `s2_menang`, `s2_kalah` | Titik-titik "...." di kalimat soal 2 | Isian pendek berhuruf tebal, ditulis di atas titik-titik |
| `t{n}_q`, `t{n}_x`, `t{n}_px` | Kolom q, X, dan P(X = x), tahap n = 1 sampai 5 | Sel tabel (hanya tahap yang dimainkan) |
| `t{n}_hasil` | Kolom Menang / Kalah | Ceklis satu dari dua |
| `s3`, `s4`, `s5` | Soal 3, 4, 5 | Uraian |
| `s6` | Soal 6 a, b, c (satu kotak, seperti draf) | Uraian |
| `s7`, `refleksi` | Soal 7 dan Refleksi | Uraian |

Semua isian wajib diisi, kecuali baris tabel tahap yang tidak dimainkan.

### 4.4 Papan rumus (mirip keyboard GeoGebra)

- Tombol **Papan Rumus** di kiri bawah membuka papan di bagian bawah layar. Selama papan terbuka, keyboard
  bawaan HP tidak muncul (seperti GeoGebra); tombol **Keyboard HP** menutup papan dan memunculkan keyboard HP lagi.
- Tab **123**: angka, koma, operasi, kurung, panah kursor, hapus. Tab **f(x)**: x², mode pangkat xⁿ, mode
  indeks x₂, √, π, ±, p, q, x, X, n, P(X = x), E(X), Var(X), pˣ · q¹⁻ˣ, 1 − p, ≤, ≥. Tab **ABC**: huruf.
- Pangkat dan indeks memakai karakter Unicode. Batasnya [Pasti]: pecahan bertingkat (pembilang di atas
  penyebut) tidak bisa; pecahan ditulis dengan garis miring, misalnya 1/2. Huruf q tidak punya bentuk pangkat
  di Unicode.

### 4.5 Bar halaman 5, kirim, hasil, dan PDF

| Fitur | Perilaku |
|---|---|
| Bar halaman 5 | Di bawah lembar halaman 5: tombol **Kirim LKPD**, **Lihat Hasil**, **Unduh PDF**, dan **Ajukan Perubahan** (setelah terkirim). Nama dan Kelas tidak ada di sini; keduanya diisi di sampul |
| Tulisan tombol di gambar | Tulisan "[ Kirim LKPD ]", "[ Unduh LKPD (PDF) ]", dan "[ Ajukan Perubahan ]" di gambar halaman 5 juga bisa diketuk |
| Syarat | Kirim, Lihat Hasil, dan Unduh PDF hanya jalan jika semua isian terisi; jika belum, muncul daftar halaman yang masih kosong |
| Simpan otomatis | Jawaban disimpan sekitar 0,6 detik setelah berhenti mengetik. Penanda "Menyimpan..." lalu "Tersimpan" |
| Kirim LKPD | Konfirmasi sekali ("Tekan Kirim LKPD sekali lagi"), lalu semua isian terkunci |
| Lihat Hasil | Ringkasan: nama, kelas, status, progres permainan (menang/kalah/tidak dimainkan), dan semua jawaban |
| Unduh PDF | 5 halaman LKPD persis seperti di layar (gambar draf + jawaban di kotaknya) ditambah 1 halaman **Hasil Singkat**. Jika jawaban terlalu panjang untuk kotaknya, huruf di PDF dikecilkan; jika masih tidak muat, lanjutannya ada di halaman Hasil Singkat. Nama file `LKPD_Bernoulli_<nama>.pdf` |
| Ajukan Perubahan | Siswa menulis alasan singkat; status "Menunggu persetujuan guru" |
| Tanpa koreksi otomatis | Tidak ada tanda benar atau salah |

### 4.6 Teks soal

Teks soal tidak diubah karena memakai gambar asli. Akibatnya [Pasti]: soal 2 tetap berbunyi "Pada tahap
TERAKHIR" dan soal 4 "2 tahap terakhir". Sebagai bantuan, di atas lembar ditampilkan "Tahap terakhir yang
dimainkan: n". Jika kelompok ingin teks soal diperjelas, ubah di Word, ekspor PDF, lalu gambar dan koordinat
diukur ulang (lihat bagian 7).

---

## 5. Akun guru

| Fitur | Perilaku |
|---|---|
| Daftar siswa | Tabel: nama, kelas, email, sudah bermain (ya/tidak), hasil (menang dari dimainkan), status LKPD (belum dibuka, draf, terkirim, minta ubah), kemajuan isian, waktu terakhir |
| Saring dan cari | Saring per kelas (dikelompokkan dari isian Kelas, huruf besar-kecil dan spasi diabaikan), cari nama |
| Detail siswa | Hasil permainan per tahap; jawaban LKPD dalam susunan draf; di sampingnya kunci jawaban yang sudah disesuaikan dengan tahap terakhir siswa itu |
| Pengajuan perubahan | Daftar pengajuan dengan alasan siswa; tombol **Setujui** dan **Tolak** |
| Unduh | PDF rekap dan PDF LKPD per siswa; CSV semua siswa (satu baris per siswa, satu kolom per isian) untuk penilaian di luar website |
| Hapus data siswa | Menghapus permainan dan LKPD siswa (dengan konfirmasi), agar siswa bisa mengulang dari awal |
| Lampiran | Halaman 6 draf (kunci dan rubrik) tampil di sini, tidak di akun siswa |

Penilaian dilakukan kelompok di luar website; akun guru tidak menyimpan nilai.

---

## 6. Data yang tersimpan (ringkas)

```
guru/{uid}                       diisi manual dengan UID akun guru (tutorial Bagian 6)
users/{uid}                      nama, kelas, kelasKey, email, dibuat, diperbarui
users/{uid}/permainan/{id}       p, x (5 nilai: 1, 0, atau null), karakter, mulai, selesai
users/{uid}/lkpd/jawaban         isian {id: teks}, status, progres, diperbarui, dikirim,
                                 permainanId (dikunci saat dikirim), alasanUbah, diputuskanOleh, diputuskanPada
```

Aturan aksesnya di `docs/tutorial-firebase.md` Bagian 5.

---

## 7. Catatan untuk draf LKPD kelompok

Draf sudah rapi dan mengikuti pola contoh dosen. Ada beberapa ketidakcocokan yang perlu diperbaiki sebelum
dipakai:

1. **Kunci jawaban belum mengikuti soal yang diubah.** Soal 2, 3, dan 4 di draf memakai "tahap terakhir",
   tetapi kunci di halaman 6 masih memakai tahap 3 (soal 2), tahap 2 (soal 3), serta tahap 1 dan 3 (soal 4).
   Kunci yang benar bergantung pada tahap terakhir siswa; lihat tabel 7.1.
2. **"Tahap TERAKHIR" di soal 2 bisa dibaca dua cara:** tahap 5 (tahap terakhir game) atau tahap terakhir
   yang dimainkan. Soal 3 sudah menulis "yang kamu mainkan"; samakan soal 2 dan 4.
3. **Soal 4 "2 tahap terakhir"** tidak bisa dikerjakan siswa yang hanya memainkan 1 tahap, kecuali
   dijelaskan bahwa E(X) dan Var(X) cukup dihitung dari p.
4. **Soal 5 memakai tahap 3**, tetapi siswa yang berhenti sebelum tahap 3 tidak punya hasil tahap 3 untuk
   "dilihat". Usulan: "...Jelaskan dengan melihat hasil permainanmu. Jika kamu tidak sampai tahap 3,
   jelaskan dengan hasil tahap lain yang kamu mainkan."
5. **Rubrik tabel belum menyebut kolom Peluang Kalah (q)** yang baru ditambahkan. Usulan: 1 jika q, ceklis,
   X, dan P(X = x) benar.
6. **Kotak Informasi 1 dipindah sebelum tabel** dan kolom q ditambahkan: ini perbaikan yang baik, karena
   siswa membaca rumus dulu sebelum mengisi tabel.

### 7.1 Kunci soal 2, 3, dan 4 menurut tahap terakhir yang dimainkan [Pasti]

| Tahap terakhir | Soal 2 (p dan q) | Soal 3 (P(X = 1) dan P(X = 0)) | Soal 4 (dua tahap terakhir) |
|---|---|---|---|
| 1 | 0,5 dan 0,5 | 0,5 dan 0,5 | Tahap 1: E = 0,5, Var = 0,25; tahap 2: E = 0,6, Var = 0,24 → tahap 1 lebih sulit ditebak |
| 2 | 0,6 dan 0,4 | 0,6 dan 0,4 | Tahap 1: E = 0,5, Var = 0,25; tahap 2: E = 0,6, Var = 0,24 → tahap 1 lebih sulit ditebak |
| 3 | 0,7 dan 0,3 | 0,7 dan 0,3 | Tahap 2: E = 0,6, Var = 0,24; tahap 3: E = 0,7, Var = 0,21 → tahap 2 lebih sulit ditebak |
| 4 | 0,4 dan 0,6 | 0,4 dan 0,6 | Tahap 3: E = 0,7, Var = 0,21; tahap 4: E = 0,4, Var = 0,24 → tahap 4 lebih sulit ditebak |
| 5 | 0,3 dan 0,7 | 0,3 dan 0,7 | Tahap 4: E = 0,4, Var = 0,24; tahap 5: E = 0,3, Var = 0,21 → tahap 4 lebih sulit ditebak |

Alasan "lebih sulit ditebak": variansinya lebih besar, karena p tahap itu lebih dekat ke 0,5.

Soal 3 menurut rumus: P(X = 1) = p¹ · q⁰ = p dan P(X = 0) = p⁰ · q¹ = q, sehingga hasilnya sama dengan p
dan q tahap itu.
