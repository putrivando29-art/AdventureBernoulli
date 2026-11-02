# Spesifikasi Fitur: Login, LKM Digital, dan Akun Dosen

Acuan pengodean nanti. Isi LKM mengikuti draf kelompok (`LKPD-Distribusi-Bernoulli.pdf`, 6 halaman, dari
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
  → Tombol "Kerjakan LKM"
  → LKM (5 halaman asli draf, isian di atas kotak) → Kirim LKM
Akun dosen (email terdaftar) → tab "Dosen" di menu
```

---

## 2. Login dan profil (email dan kata sandi)

| Fitur | Perilaku |
|---|---|
| Halaman Masuk | Ditampilkan sebelum menu. Isi: judul game, Universitas Sriwijaya · by Kelompok 17, dua tab: **Masuk** dan **Daftar**. Tanpa login, game tidak bisa dimulai |
| Tab Masuk | Email, Kata sandi (dengan tombol tampilkan/sembunyikan), tombol **Masuk**, tautan **Lupa kata sandi?** |
| Tab Daftar | Email, Kata sandi (minimal 6 karakter), Ulangi kata sandi, Nama (maks. 40 karakter), Kelas (maks. 15 karakter), tombol **Daftar**. Setelah berhasil, langsung masuk ke menu |
| Lupa kata sandi | Mahasiswa mengisi email, sistem mengirim email untuk membuat kata sandi baru. Pesan: "Jika email terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Periksa juga folder spam." |
| Pesan galat (Bahasa Indonesia) | "Email sudah terdaftar. Silakan masuk." · "Kata sandi minimal 6 karakter." · "Kata sandi tidak sama." · "Email atau kata sandi salah." · "Format email tidak valid." · "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi." · "Tidak ada koneksi internet." |
| Login berikutnya | Tetap masuk di perangkat itu sampai menekan Keluar. Nama dan kelas terisi dari akun; masih bisa diubah di menu |
| Pindah perangkat | Masuk dengan email dan kata sandi yang sama; permainan dan jawaban LKM muncul kembali |
| Keluar | Tombol **Keluar** di menu. Data tetap tersimpan di akun |
| Akun dosen | Dibuat pemilik di Firebase Console (bukan lewat tab Daftar). Dikenali dari UID-nya di koleksi `guru`; tombol **Dosen** muncul di menu |
| Gagal terhubung | Jika Firebase tidak bisa dimuat, muncul pesan internet yang sudah ada beserta tombol Muat Ulang |
| Analytics | Tidak dipakai |

## 3. Permainan dan rekap

| Fitur | Perilaku |
|---|---|
| Penyimpanan | Saat rekap tampil, permainan disimpan ke akun jika memakai p bawaan dan minimal 1 tahap dimainkan |
| Mode latihan | Jika p diubah lewat Setting Peluang, menu menampilkan "Mode latihan: peluang diubah, hasil tidak dipakai LKM". Permainan latihan tidak disimpan |
| Rekap di layar dan PDF | Judul, kalimat pembuka ("Berikut catatan pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa."), nama, kelas, tanggal, tabel Tahap, Kondisi, p, Hasil, dan jumlah menang, kalah, tidak dimainkan. Tanpa rumus, perhitungan, atau refleksi |
| Tombol di rekap | **Unduh PDF Rekap**, **Buka PDF di Tab Baru**, **Kerjakan LKM**, **Kembali ke Menu Utama** |

---

## 4. LKM untuk mahasiswa (sudah dikodekan)

LKM draf lama sudah diganti **LKM (Lembar Kerja Mahasiswa) revisi Kelompok 17**, ditampilkan 1:1 (gambar asli
halaman 1 sampai 5 dengan isian di atas kotak dan garisnya). Rincian lengkap (akses dan syarat tahap 3, isi tiap
halaman, ID isian, cara mengisi, tombol Rumus, bar halaman 5, PDF, rangkuman materi, status) ada di
`PRODUCT.md` Bagian 7 dan Bagian 11, agar tidak ada dua versi yang berbeda.

---

## 5. Akun dosen

| Fitur | Perilaku |
|---|---|
| Daftar mahasiswa | Tabel: nama, kelas, email, sudah bermain (ya/tidak), hasil (menang dari dimainkan), status LKM (belum dibuka, draf, terkirim, minta ubah), kemajuan isian, waktu terakhir |
| Saring dan cari | Saring per kelas (dikelompokkan dari isian Kelas, huruf besar-kecil dan spasi diabaikan), cari nama |
| Detail mahasiswa | Hasil permainan per tahap; jawaban LKM dalam susunan draf; di sampingnya kunci jawaban yang sudah disesuaikan dengan tahap terakhir mahasiswa itu |
| Pengajuan perubahan | Daftar pengajuan dengan alasan mahasiswa; tombol **Setujui** dan **Tolak** |
| Unduh | PDF rekap dan PDF LKM per mahasiswa; CSV semua mahasiswa (satu baris per mahasiswa, satu kolom per isian) untuk penilaian di luar website |
| Hapus data mahasiswa | Menghapus permainan dan LKM mahasiswa (dengan konfirmasi), agar mahasiswa bisa mengulang dari awal |
| Lampiran | Halaman 6 draf (kunci dan rubrik) tampil di sini, tidak di akun mahasiswa |

Penilaian dilakukan kelompok di luar website; akun dosen tidak menyimpan nilai.

---

## 6. Data yang tersimpan (ringkas)

```
guru/{uid}                       diisi manual dengan UID akun dosen (tutorial Bagian 6)
users/{uid}                      nama, kelas, kelasKey, email, dibuat, diperbarui
users/{uid}/permainan/{id}       p, x (5 nilai: 1, 0, atau null), karakter, mulai, selesai
users/{uid}/lkpd/jawaban         isian {id: teks}, status, progres, diperbarui, dikirim,
                                 permainanId (dikunci saat dikirim), alasanUbah, diputuskanOleh, diputuskanPada
```

Aturan aksesnya di `docs/tutorial-firebase.md` Bagian 5.

---

## 7. Catatan untuk draf LKM kelompok

> Arsip: catatan ini untuk draf LKPD lama dan tidak berlaku lagi untuk LKM revisi. Ketidakcocokan LKM revisi dengan game ada di `PRODUCT.md` Bagian 18.

Draf sudah rapi dan mengikuti pola contoh dosen. Ada beberapa ketidakcocokan yang perlu diperbaiki sebelum
dipakai:

1. **Kunci jawaban belum mengikuti soal yang diubah.** Soal 2, 3, dan 4 di draf memakai "tahap terakhir",
   tetapi kunci di halaman 6 masih memakai tahap 3 (soal 2), tahap 2 (soal 3), serta tahap 1 dan 3 (soal 4).
   Kunci yang benar bergantung pada tahap terakhir mahasiswa; lihat tabel 7.1.
2. **"Tahap TERAKHIR" di soal 2 bisa dibaca dua cara:** tahap 5 (tahap terakhir game) atau tahap terakhir
   yang dimainkan. Soal 3 sudah menulis "yang kamu mainkan"; samakan soal 2 dan 4.
3. **Soal 4 "2 tahap terakhir"** tidak bisa dikerjakan mahasiswa yang hanya memainkan 1 tahap, kecuali
   dijelaskan bahwa E(X) dan Var(X) cukup dihitung dari p.
4. **Soal 5 memakai tahap 3**, tetapi mahasiswa yang berhenti sebelum tahap 3 tidak punya hasil tahap 3 untuk
   "dilihat". Usulan: "...Jelaskan dengan melihat hasil permainanmu. Jika kamu tidak sampai tahap 3,
   jelaskan dengan hasil tahap lain yang kamu mainkan."
5. **Rubrik tabel belum menyebut kolom Peluang Kalah (q)** yang baru ditambahkan. Usulan: 1 jika q, ceklis,
   X, dan P(X = x) benar.
6. **Kotak Informasi 1 dipindah sebelum tabel** dan kolom q ditambahkan: ini perbaikan yang baik, karena
   mahasiswa membaca rumus dulu sebelum mengisi tabel.

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
