# 2. Kronologi pengembangan (dari riwayat git)

Tanggal dan nama commit berasal dari riwayat repositori. Alasan perubahan berasal dari keputusan pemilik
selama pengembangan.

## Tahap 1. Game 2D awal dan pembangunan ulang 3D (21 Oktober 2026)
- Versi pertama adalah game web 2D ("Add Adventure Bernoulli web game").
- Fase 0 sampai 1: versi 2D dibersihkan; dibuat konfigurasi lima tahap dan inti hitungan Bernoulli
  (`js/bernoulli.js`, `js/config.js`) untuk pembangunan ulang 3D.
- Fase 2 sampai 3: arena Three.js, karakter, pertarungan hack and slash, undian Serangan Penentu, dan alur tahap.
- Fase 4 sampai 5: rekap PDF, kontrol sentuh untuk HP, audio, efek kebangkitan, dan kualitas grafis otomatis.
- Fase 6: README ditulis ulang untuk game 3D.
- Penambahan: QTE di Serangan Penentu (hanya animasi), ramuan, perlengkapan tiap tahap, kustomisasi karakter,
  dialog Resi Bayang, musik; setting peluang untuk dosen; peluang bawaan dibuat berbeda tiap tahap; gulungan
  sihir, pembatalan tebasan, pemicu saat pemain sekarat, dan sinematik Serangan Penentu.
- Dibuat PRODUCT.md sebagai acuan produk dan aturan perubahan antarmuka.

## Tahap 2. Perbaikan antarmuka (21 Oktober 2026)
- Audit antarmuka: tata letak HP, kontras, aksesibilitas.
- Adaptasi HP: tombol ikon 48 piksel, jarak tombol aksi, zona aman poni, HUD lebih lega.
- Penguatan (harden): validasi nama dan kelas, teks PDF aman dari emoji, pesan offline, perlindungan klik ganda.
- Penjernihan teks dan identitas Kerajaan Swarnadwipa: palet batu dan emas.

## Tahap 3. Perancangan LKPD dan data (23 sampai 26 Oktober 2026)
- LKPD disusun dalam enam revisi: dari ide kegiatan bermain berulang, menjadi satu permainan dengan p bawaan,
  soal cerita di luar game, fokus hanya Bernoulli (kalimat jembatan binomial dihapus), sampai versi sederhana
  mengikuti contoh dosen.
- LKPD dibuat dalam Word dan PDF; dirancang pendataan Firebase.
- Tutorial Firebase, spesifikasi login dan LKPD, dan aturan keamanan Firestore ditulis.

## Tahap 4. Akun dan penyimpanan data (26 Oktober 2026)
- Login email dan kata sandi (Firebase Authentication), menggantikan rencana login Google.
- Hasil permainan tersimpan di akun; rekap dibuat ringkas (hanya menang dan kalah).
- Permainan biasa selalu memakai peluang bawaan; Setting Peluang hanya untuk latihan.

## Tahap 5. LKPD digital 1:1 (26 sampai 29 Oktober 2026)
- LKPD digital pertama dibuat, lalu diganti karena pemilik meminta tampilan **sama persis** dengan desain kelompok.
- Halaman desain kelompok dipakai sebagai gambar asli; kolom isian ditempel di atas kotak jawabannya.
- Fitur isian: satu halaman per layar, zoom cubit, papan rumus mirip GeoGebra, simpan otomatis, unduh PDF.
- Nama "Setting Guru" diganti "Setting Peluang". PRODUCT.md ditulis ulang sesuai isi website.

## Tahap 6. LKM revisi dan istilah mahasiswa (2 November 2026)
- LKPD diganti LKM (Lembar Kerja Mahasiswa) revisi Kelompok 17: struktur Bagian A sampai D, soal 1 sampai 10.
- Istilah siswa menjadi mahasiswa, guru menjadi dosen; ditambah NIM.
- Rangkuman materi terbuka setelah LKM dikirim; syarat permainan minimal sampai tahap 3.

## Tahap 7. Peluang dirahasiakan (6 November 2026)
- Atas saran dosen, peluang tidak ditampilkan selama bermain dan baru dibuka di rekap.
- Dialog Resi Bayang tidak lagi menyebut angka; rekap menjelaskan bahwa menang atau kalah ditentukan undian
  dengan peluang tadi, disertai contoh dari hasil mahasiswa.

## Tahap 8. Pretest dan penyesuaian LKM (6 sampai 12 November 2026)
- Pretest materi prasyarat (ruang sampel dan peluang kejadian) dibuat; versi Word pilihan ganda beralasan dengan
  pengecoh dan tiga tingkat kesulitan, lengkap kunci dan pedoman skor.
- LKM dipasang ulang: tabel soal 2 tanpa kolom terakhir; kolom rumus soal 9 berkotak, dengan nilai 0,3 dan 0,7.

## Tahap 9. Halaman dosen dan kenyamanan (14 sampai 22 November 2026)
- Halaman dosen sederhana: daftar mahasiswa, melihat LKM 1:1, menyetujui atau menolak pengajuan perubahan.
- Slider kecepatan kamera di menu jeda (0,5x sampai 3x) atas keluhan kamera terasa lambat.
