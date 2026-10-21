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
2. DILARANG mengubah: `js/bernoulli.js`, `js/config.js` (termasuk nilai p), logika Serangan Penentu, logika fitur berhenti, logika pencatatan hasil, rumus dan isi perhitungan di PDF, scene Three.js, model 3D, kontrol, shader, dan tes.
3. DILARANG menambah fitur, layar, mode, tutorial, onboarding, pengaturan, atau sistem skor.
4. DILARANG mengubah teks konsep Bernoulli (X = 1, X = 0, p, 1 - p, E(X), Var(X), "bukan binomial", "Tidak dimainkan") kecuali memperbaiki salah ketik.
5. Identitas wajib tetap: Universitas Sriwijaya, by Kelompok 17, Kerajaan Swarnadwipa, Arca Durgaraksa, Resi Bayang.
6. Tidak boleh ada path absolut berawalan "/", dan game tidak boleh bergantung pada npm untuk berjalan.
7. Sebelum mengubah file apa pun, tunjukkan daftar perubahan dan tunggu persetujuan pemilik proyek.

## Kondisi kode saat PRODUCT.md dibuat (perlu keputusan pemilik)

Brief pemilik dan isi repo berbeda di beberapa hal. Perbedaan ini dicatat, tidak diubah:

| Hal | Menurut brief | Kenyataan di kode |
|---|---|---|
| Nilai p bawaan di `js/config.js` | 50, 60, 70, 50, 40 | 50, 60, 70, 40, 30 (diubah atas permintaan sebelumnya agar tidak ada p yang sama) |
| Pengaturan | tidak ada | Layar "Setting Guru" untuk mengganti p (disimpan di browser atau lewat tautan `?p=`) dan tombol "Efek gerak: Nyaman/Penuh" di menu jeda |
| Fitur permainan lain yang sudah ada | tidak disebut | Kustomisasi karakter (7 kategori), percakapan singkat gaya visual novel, QTE di Serangan Penentu (hanya animasi), ramuan, gulungan sihir, musik latar, Serangan Penentu yang juga dipicu saat player sekarat (peluang tetap p tahap itu) |

Selama perbedaan ini belum diputuskan, semua perintah memperlakukan kode yang ada sebagai kondisi sekarang dan tidak mengubahnya. Aturan 3 berlaku untuk penambahan baru.
