# PRODUCT.md: Adventure Bernoulli

## Ringkasan produk

- **Nama:** Adventure Bernoulli.
- **Jenis:** game edukasi 3D berbasis browser (Three.js) untuk mengajarkan distribusi Bernoulli kepada siswa.
- **Pembuat:** Kelompok 17, Universitas Sriwijaya.
- **Hosting:** website statis gratis di GitHub Pages. Tanpa build tool, tanpa backend, tanpa database. npm hanya untuk tes di komputer pengembang.

## Pengguna

- Siswa, bermain mandiri tanpa pendamping.
- Perangkat: laptop (utama) dan HP.
- Lama satu sesi: 15 sampai 20 menit.

## Cerita

Di ruang singgasana Kerajaan Swarnadwipa, pemain melawan Arca Durgaraksa dalam 5 tahap, dipandu Resi Bayang.

## Konsep yang diajarkan

- Setiap tahap adalah satu percobaan Bernoulli.
- Hasil hanya dua: MENANG (X = 1) atau KALAH (X = 0), ditentukan oleh Serangan Penentu dengan peluang p yang tetap untuk tiap tahap.
- Pemain boleh berhenti. Tahap yang tidak dimainkan dicatat "Tidak dimainkan", bukan kalah.
- Rekap akhir diunduh sebagai PDF.

## Gaya visual

- Fantasi gelap yang hangat: model kotak-kotak dengan toon shading, aksen emas, font judul Cinzel.
- Menu utama yang sekarang (langit berbintang, siluet kastil, kartu menu) sudah disukai dan harus dipertahankan.

## Bahasa dan nada

Bahasa Indonesia yang jelas, singkat, dan ramah untuk siswa.

## Aturan untuk semua perintah impeccable berikutnya

1. Hanya boleh mengubah tampilan antarmuka HTML/CSS: menu utama, layar Cara Bermain, layar pilih karakter, HUD, dialog Resi Bayang, layar hasil tahap, konfirmasi berhenti, dan layar rekap.
2. DILARANG mengubah: `js/bernoulli.js`, `js/config.js` (termasuk nilai p 50, 60, 70, 40, 30), logika Serangan Penentu, logika fitur berhenti, logika pencatatan hasil, rumus dan isi perhitungan di PDF, scene Three.js, model 3D, kontrol, shader, dan tes.
3. DILARANG menambah fitur, layar, mode, tutorial, onboarding, pengaturan, atau sistem skor.
4. DILARANG mengubah teks konsep Bernoulli (X = 1, X = 0, p, 1 - p, E(X), Var(X), "bukan binomial", "Tidak dimainkan") kecuali memperbaiki salah ketik.
5. Identitas wajib tetap: Universitas Sriwijaya, by Kelompok 17, Kerajaan Swarnadwipa, Arca Durgaraksa, Resi Bayang.
6. Tidak boleh ada path absolut berawalan "/", dan game tidak boleh bergantung pada npm untuk berjalan.
7. Sebelum mengubah file apa pun, tunjukkan daftar perubahan dan tunggu persetujuan pemilik proyek.

## Keputusan pemilik (sudah diputuskan)

- **Nilai p bawaan resmi: 50, 60, 70, 40, 30** (0,5; 0,6; 0,7; 0,4; 0,3), semuanya berbeda. Nilai ini yang dipertahankan dan tidak boleh diubah.
- **Setting Guru tetap ada** agar guru bisa mencoba berbagai nilai p dan membagikan tautan siswa (`?p=...`). Saat game dibuka lewat tautan siswa, tombol Setting Guru disembunyikan.
- Fitur yang sudah ada dan dipertahankan: tombol "Efek gerak: Nyaman/Penuh" di menu jeda, kustomisasi karakter, percakapan singkat gaya visual novel, QTE di Serangan Penentu (hanya animasi), ramuan, gulungan sihir, musik latar, dan Serangan Penentu yang juga dipicu saat player sekarat (peluang tetap p tahap itu). Aturan 3 berlaku untuk penambahan baru.
