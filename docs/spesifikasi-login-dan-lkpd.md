# Spesifikasi Fitur: Login, LKPD Digital, dan Akun Guru

Acuan pengodean nanti. Isi LKPD mengikuti draf kelompok (`LKPD-Distribusi-Bernoulli.pdf`, 6 halaman, dari
Microsoft Word). Pemasangan Firebase ada di `docs/tutorial-firebase.md`. Belum dikodekan; pengodean
menunggu permintaan pemilik.

---

## 1. Alur besar

```
Buka situs
  → Halaman Masuk (tombol "Masuk dengan Google")
  → [pertama kali] Isi Nama dan Kelas
  → Menu utama (email dan tombol Keluar terlihat)
  → Bermain tahap 1 sampai 5 (boleh berhenti)
  → Rekap ringkas: hasil menang dan kalah
  → Tombol "Kerjakan LKPD"
  → LKPD (5 halaman) → Kirim LKPD
Akun guru (email terdaftar) → tab "Guru" di menu
```

---

## 2. Login dan profil

| Fitur | Perilaku |
|---|---|
| Halaman Masuk | Ditampilkan sebelum menu. Isi: judul game, Universitas Sriwijaya · by Kelompok 17, tombol **Masuk dengan Google**. Tanpa login, game tidak bisa dimulai |
| Cara login | Jendela pop-up Google. Jika pop-up diblokir, muncul pesan "Izinkan pop-up untuk situs ini, lalu coba lagi" |
| Profil pertama kali | Setelah login pertama, siswa mengisi **Nama** (maks. 40 karakter) dan **Kelas** (maks. 15 karakter) sendiri. Disimpan di akun |
| Login berikutnya | Nama dan kelas terisi otomatis dari akun; masih bisa diubah di menu |
| Pindah perangkat | Login dengan akun yang sama; permainan dan jawaban LKPD muncul kembali |
| Keluar | Tombol **Keluar** di menu. Data tetap tersimpan di akun |
| Pengenalan guru | Jika email ada di koleksi `guru` (Firestore), tombol **Guru** muncul di menu |
| Gagal terhubung | Jika Firebase tidak bisa dimuat, muncul pesan internet yang sudah ada beserta tombol Muat Ulang |

---

## 3. Permainan dan rekap

| Fitur | Perilaku |
|---|---|
| Penyimpanan | Saat rekap tampil, permainan disimpan ke akun jika memakai p bawaan dan minimal 1 tahap dimainkan |
| Mode latihan | Jika p diubah lewat Setting Guru, menu menampilkan "Mode latihan: peluang diubah, hasil tidak dipakai LKPD". Permainan latihan tidak disimpan |
| Rekap di layar dan PDF | Judul, kalimat pembuka ("Berikut catatan pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa."), nama, kelas, tanggal, tabel Tahap, Kondisi, p, Hasil, dan jumlah menang, kalah, tidak dimainkan. Tanpa rumus, perhitungan, atau refleksi |
| Tombol di rekap | **Unduh PDF Rekap**, **Buka PDF di Tab Baru**, **Kerjakan LKPD**, **Kembali ke Menu Utama** |

---

## 4. LKPD untuk siswa

### 4.1 Akses dan data

| Fitur | Perilaku |
|---|---|
| Kunci akses | LKPD terbuka jika sudah ada permainan tersimpan (p bawaan, minimal 1 tahap dimainkan). Jika belum, tombol LKPD menampilkan "Selesaikan permainan dulu" |
| Data yang dipakai | Sebelum LKPD dikirim: permainan **terbaru**. Setelah dikirim: permainan yang dipakai saat itu **dikunci** |
| Pemberitahuan data berubah | Jika siswa bermain lagi sebelum mengirim, LKPD menampilkan "Datamu berubah karena kamu bermain lagi. Periksa kembali jawabanmu." |
| Panel Rekap | Tombol **Lihat Rekapku** di setiap halaman LKPD menampilkan hasil permainan (tahap, p, hasil) agar siswa bisa menyalin ke tabel |

### 4.2 Tampilan

- Lima halaman siswa mengikuti draf 1:1 (halaman 6, Lampiran Kunci dan Rubrik, hanya di akun guru).
- Navigasi: tombol **Sebelumnya** dan **Berikutnya**, penanda "Halaman 3 dari 5", dan daftar halaman.
- Di HP: satu kolom, kotak jawaban selebar layar; di laptop: lebar maksimum seperti halaman A4.
- Sampul: nama dan kelas terisi dari akun (bukan garis kosong).

### 4.3 Isian dan ID kolom

| ID | Bagian draf | Jenis isian |
|---|---|---|
| `s1` | Soal 1 | Uraian |
| `s2` | Soal 2 | Uraian (boleh rumus) |
| `tabel.t{n}.q` | Kolom Peluang Kalah (q), tahap n = 1 sampai 5 | Angka |
| `tabel.t{n}.hasil` | Kolom Menang / Kalah | Ceklis satu dari dua (atau kosong jika tidak dimainkan) |
| `tabel.t{n}.x` | Kolom X | Angka atau "-" |
| `tabel.t{n}.px` | Kolom P(X = x) | Angka atau "-" |
| `s3` | Soal 3 | Uraian dengan rumus |
| `s4` | Soal 4 | Uraian dengan rumus |
| `s5` | Soal 5 | Uraian |
| `s6` | Soal 6 a, b, c (satu kotak, seperti draf) | Uraian dengan rumus |
| `s7` | Soal 7 | Uraian |
| `refleksi` | Refleksi | Uraian |

Kolom Peluang menang (p) di tabel diisi sistem (0,5; 0,6; 0,7; 0,4; 0,3) dan tidak bisa diubah.

### 4.4 Editor rumus

- Setiap kotak jawaban punya tombol **Rumus**.
- Menekan **Rumus** membuka editor persamaan (MathLive, dari CDN) dengan papan tombol: pangkat (x²),
  indeks bawah, pecahan, kali (·), kurang (−), kurung, huruf p, q, x, X, E, Var.
- Di HP, papan tombol rumus muncul sebagai keyboard virtual di bawah layar.
- Rumus disisipkan ke dalam jawaban uraian sebagai potongan rumus; teks biasa tetap bisa diketik sebelum dan
  sesudahnya. Contoh hasil: "P(X = 1) = 0,6¹ · 0,4⁰ = 0,6".
- Disimpan sebagai teks dengan rumus LaTeX di antara tanda `$...$`. Di layar guru ditampilkan rapi; di PDF
  ditulis sebagai teks biasa dengan pangkat (karena jsPDF tidak bisa mencetak LaTeX).

### 4.5 Penyimpanan, kirim, dan perubahan

| Fitur | Perilaku |
|---|---|
| Simpan otomatis | Setiap kali siswa pindah dari satu kotak jawaban, jawaban disimpan. Penanda di atas: "Menyimpan..." lalu "Tersimpan" |
| Sinyal putus | Jawaban disimpan sementara di perangkat dan dikirim ke server saat sinyal kembali |
| Kemajuan | Penanda "12 dari 20 isian terisi" di setiap halaman |
| Tanpa koreksi otomatis | Tidak ada tanda benar atau salah |
| Kirim LKPD | Tombol di halaman 5. Jika masih ada isian kosong, muncul daftar isian kosong dan pilihan **Kembali mengisi** atau **Tetap kirim** |
| Setelah terkirim | Semua kotak terkunci (hanya baca). Status "Terkirim" beserta tanggal dan jam |
| Ajukan Perubahan | Muncul setelah terkirim. Siswa menulis alasan singkat. Status menjadi "Menunggu persetujuan guru" |
| Disetujui guru | Kotak terbuka lagi; siswa mengubah lalu menekan Kirim LKPD lagi |
| Ditolak guru | Status kembali "Terkirim" dengan catatan "Pengajuan ditolak" |
| Unduh LKPD (PDF) | Kapan saja. Berisi sampul, soal, dan jawaban siswa sesuai susunan draf. Nama file `LKPD_Bernoulli_<nama>.pdf` |

### 4.6 Teks soal yang menyesuaikan data

Draf memakai "tahap terakhir" dan "2 tahap terakhir". Agar tidak ambigu, versi digital menuliskan nomor
tahapnya langsung dari data siswa:

| Soal | Teks di draf | Teks di layar (contoh siswa yang berhenti di tahap 4) |
|---|---|---|
| 2 | "Pada tahap TERAKHIR..." | "Pada tahap terakhir yang kamu mainkan (**tahap 4**)..." |
| 3 | "...pada tahap terakhir yang kamu mainkan" | "...pada tahap terakhir yang kamu mainkan (**tahap 4**)" |
| 4 | "...untuk 2 tahap terakhir" | "...untuk **tahap 3 dan tahap 4**" |

Jika siswa hanya memainkan tahap 1, soal 4 memakai tahap 1 dan tahap 2 (E(X) dan Var(X) tetap bisa dihitung
karena hanya bergantung pada p). Usulan ini menunggu persetujuan kelompok (lihat bagian 7).

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
guru/{email}                     diisi manual (tutorial Bagian 6)
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
