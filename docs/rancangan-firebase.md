# Rancangan Pendataan: Login Email, Firestore, dan Akun Guru

Rancangan agar hasil setiap siswa (permainan dan LKPD) tersimpan di akunnya, bisa dilanjutkan di
perangkat lain, dan bisa dipantau guru. Belum dikodekan. Bagian bertanda **[Dugaan]** harus dicek saat
pengerjaan.

## 1. Pilihan teknologi

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Hosting | Vercel (website statis, file yang sama seperti sekarang) | Keputusan pemilik |
| Login | Firebase Authentication, email dan kata sandi | Siswa mendaftar sendiri dengan email apa pun; akun guru dibuat pemilik |
| Database | Cloud Firestore | Data per akun, aturan akses per email, sinkron antarperangkat |
| PDF | Dibuat ulang dari data dengan jsPDF (sudah ada di game) | Tidak perlu Cloud Storage. Satu sumber pihak ketiga menyebut Cloud Storage kini wajib paket berbayar Blaze [Dugaan, cek dokumen resmi] |
| Editor persamaan | MathLive (lisensi MIT, dari CDN) | Pangkat, indeks bawah, pecahan, keyboard virtual di HP |
| Pemasangan | SDK Firebase dan MathLive dimuat dari CDN dengan versi tetap | Aturan 6: game tidak bergantung pada npm |

Kuota gratis Firestore (paket Spark, dokumentasi resmi): 50.000 baca dan 20.000 tulis per hari. Jika
terlampaui, layanan berhenti sampai periode berikutnya. Perkiraan pemakaian [Dugaan]: satu siswa sekitar
50 sampai 100 tulis untuk seluruh kegiatan jika jawaban disimpan saat pindah kolom, bukan setiap ketikan.
150 siswa dalam beberapa hari masih jauh di bawah batas harian.

## 2. Alur siswa

1. Buka website → **Masuk** dengan email dan kata sandi, atau **Daftar** (email, kata sandi, nama, kelas).
2. Nama dan kelas tersimpan di akun.
3. **Bermain satu kali**, tahap 1 sampai 5, dengan p bawaan (0,5; 0,6; 0,7; 0,4; 0,3). Setting Peluang dan
   tautan `?p=` tidak berlaku untuk akun siswa. Sampai rekap →
   permainan tersimpan.
4. **LKPD** terbuka setelah tercatat permainan ber-p bawaan dengan minimal 1 tahap dimainkan. Jawaban
   tersimpan otomatis; bisa dilanjutkan di perangkat lain.
5. Selama LKPD belum dikirim, LKPD memakai permainan ber-p bawaan **terbaru**. Jika data berganti karena
   bermain lagi, LKPD menampilkan pemberitahuan agar siswa memeriksa jawabannya.
6. **Kirim LKPD** → id permainan yang dipakai disimpan di dokumen LKPD, sehingga data dan jawaban
   terkunci. Bermain lagi sesudahnya tidak mengubah LKPD dan tidak membuka LKPD baru. **Ajukan Perubahan**
   (dengan alasan) → menunggu guru. Guru juga bisa menghapus data siswa agar ia mulai dari awal.
7. Permainan dengan p dari Setting Peluang (mode latihan) tidak disimpan dan tidak dipakai LKPD.

## 3. Alur guru

1. Masuk dengan akun guru (dibuat pemilik di Console, UID terdaftar di koleksi `guru`) → tombol **Guru** muncul.
2. Daftar siswa per kelas (dikelompokkan dari isian Kelas, huruf besar-kecil dan spasi diabaikan): nama,
   email, jumlah permainan, progres LKPD (persen kolom terisi), status (draf, terkirim, minta ubah).
3. Detail siswa: hasil permainan, jawaban LKPD terakhir, unduh PDF rekap dan PDF LKPD.
4. **Persetujuan perubahan**: setujui (LKPD siswa terbuka lagi) atau tolak.
5. **Hapus Data Siswa**: menghapus permainan dan LKPD seorang siswa atas permintaannya, agar ia bisa
   bermain ulang dan LKPD memakai data baru.
6. Unduh semua data kelas (CSV) untuk penilaian di luar website.

## 4. Struktur data Firestore

```
guru/{uid}                           dibuat manual di Firebase Console, Document ID = UID akun guru
users/{uid}
  nama, kelas, kelasKey, email, dibuat
users/{uid}/permainan/{id}
  p: [5], x: [5, berisi 1, 0, atau null], karakter, mulai, selesai
users/{uid}/lkpd/jawaban
  isian: { "<id kolom>": "<teks, rumus ditulis sebagai $...$ LaTeX>" }
  status: "draf" | "terkirim" | "minta-ubah" | "dibuka"
  permainanId (diisi saat dikirim; permainan yang dipakai dan dikunci)
  progres, diperbarui, dikirim, alasanUbah, diputuskanOleh, diputuskanPada
```

Guru dikenali dari UID di koleksi `guru`, bukan dari email, karena dengan login email dan kata sandi siapa pun
bisa mendaftar memakai email orang lain. Daftar guru tidak ditulis di kode.

## 5. Aturan akses

Versi final aturan ada di `docs/tutorial-firebase.md` Bagian 5 (satu sumber, supaya tidak berbeda).

Catatan:
- Siswa bisa berpindah dari "dibuka" ke "draf" lewat aturan pertama. Ini tidak berbahaya karena kedua
  status sama-sama boleh diisi, tetapi akan dirapikan saat pengujian.
- Batas yang harus disadari [Pasti]: undian dan pencatatan berjalan di perangkat siswa. Aturan di atas
  mencegah siswa memakai p selain bawaan, tetapi siswa yang paham alat developer browser masih bisa mengirim
  hasil menang/kalah palsu. Untuk LKPD yang menilai penalaran, ini dapat diterima.
- Kunci LKPD (permainan sudah tercatat) dicek di perangkat. Aturan tidak bisa menghitung isi koleksi; jika perlu dikunci
  ketat, ditambah penghitung permainan di dokumen `users`.

## 6. Hal teknis yang harus dicek saat pengerjaan

1. **Login email dan kata sandi** tidak memakai pop-up atau pengalihan halaman, jadi tidak terkena masalah
   pemblokiran penyimpanan pihak ketiga di browser HP. [Kemungkinan Besar]
2. **Domain Vercel** harus ditambahkan di Firebase Console → Authentication → Settings → Authorized domains.
3. **Cache luring Firestore** diaktifkan agar jawaban tidak hilang saat sinyal putus sesaat.
4. **Rumus di PDF**: jsPDF tidak bisa mencetak LaTeX. Usulan: di PDF rumus ditulis sebagai teks biasa
   (p², 3/5), sedangkan tampilan rapi ada di layar guru.
5. **Data pribadi anak**: Pasal 25 UU 27/2022 mewajibkan persetujuan orang tua atau wali. Izin diurus
   kelompok (keputusan pemilik).

## 7. Tahapan pengerjaan

| Tahap | Isi | Butuh dari kelompok |
|---|---|---|
| A | Login email dan kata sandi (masuk, daftar, lupa kata sandi), profil nama dan kelas, penyimpanan permainan dengan p bawaan, tanda mode latihan, rekap ringkas, PDF ringkas | Domain Vercel (konfigurasi Firebase sudah diterima) |
| B | Layar LKPD siswa sesuai desain, editor persamaan, simpan otomatis, kirim, ajukan perubahan, PDF LKPD | Desain LKPD |
| C | Tab guru: daftar dan detail siswa, persetujuan, Hapus Data Siswa, unduh CSV | Email guru dimasukkan ke koleksi `guru` |
| D | Uji dengan akun siswa dan akun guru, panduan website dan panduan pembelajaran | Satu email siswa uji dan satu akun guru |

Tahap A sudah bisa dikerjakan sebelum desain LKPD datang.
