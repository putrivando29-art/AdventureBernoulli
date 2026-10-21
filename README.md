# Adventure Bernoulli

Game petualangan 5 tahap untuk belajar **distribusi Bernoulli**. Setiap pertarungan adalah satu
percobaan Bernoulli: dilakukan satu kali dan hasilnya hanya dua, menang (X = 1) atau kalah (X = 0).

Data tahap mengikuti contoh lembar catatan "Contoh Hasil Adventure Bernoulli":

| Tahap | Lokasi | Kondisi | p (menang) | 1 − p (kalah) |
|---|---|---|---|---|
| 1 | Hutan Gerbang | Setara | 0,5 | 0,5 |
| 2 | Gua Kristal | Dapat senjata | 0,6 | 0,4 |
| 3 | Benteng Reruntuhan | Senjata + armor | 0,7 | 0,3 |
| 4 | Menara Naga | Boss lebih kuat | 0,5 | 0,5 |
| 5 | Singgasana Lava | Boss mode marah | 0,4 | 0,6 |

## Cara menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npm start          # http://localhost:8080
```

Tidak ada langkah build dan tidak ada dependensi runtime. Font judul (Cinzel) diambil dari
Google Fonts; tanpa internet game tetap jalan dengan font cadangan.

## Fitur

- **Menu utama**: nama pemain, Mulai Petualangan, Cara Bermain, Materi Bernoulli, Lab Simulasi,
  Riwayat Sesi, Pengaturan, tombol suara.
- **5 tahap** dengan latar, musuh, perlengkapan pahlawan, dan cerita sendiri.
- **Roda peluang**: komputer mengambil bilangan acak U di [0, 1) (`crypto.getRandomValues`).
  Menang jika U < p. Jarum berhenti tepat di posisi U, jadi yang terlihat sama dengan yang dihitung.
- **Lembar catatan** terisi otomatis, lalu **hasil akhir** dengan struktur yang sama seperti contoh:
  lembar catatan, letak Bernoulli, P(X = x), E(X), Var(X) tiap tahap, kesimpulan sesi
  (peluang urutan hasil, jumlah menang yang diharapkan, P(W ≥ w) atau P(W ≤ w)), catatan
  binomial / bukan binomial, dan grafik distribusi eksak jumlah menang.
- **Cetak / Simpan PDF** dan **Unduh CSV** (pemisah titik koma, desimal berkoma).
- **Lab Simulasi**: 10 sampai 100.000 sesi otomatis, membandingkan frekuensi relatif dengan p
  dan distribusi W simulasi dengan distribusi teoretis.
- **Pengaturan**: p tiap tahap dapat diubah (0,01 sampai 0,99). Jika semua p sama, laporan
  menyatakan W ~ Binomial(5; p).

Semua perhitungan peluang memakai bilangan bulat perseratus (`js/bernoulli.js`), sehingga
hasil seperti 0,5 × 0,6 × 0,7 × 0,5 × 0,4 = 0,042 eksak, tanpa galat floating point.

## Pengujian

```bash
npm test                                             # uji matematika (node:test)
NODE_PATH=$(npm root -g) npm run test:e2e            # simulasi permainan di Chromium (butuh playwright)
```

Uji end-to-end memainkan game dari menu sampai hasil akhir berkali-kali dan memeriksa: hasil X
cocok dengan U dan posisi jarum, klik ganda tidak menggandakan catatan, keluar saat jarum berputar
tidak membocorkan hasil ke sesi baru, laporan cocok dengan data, validasi pengaturan, lab
100.000 sesi mendekati p, CSV, tampilan HP 375 px tanpa scroll horizontal, dan game tetap jalan
saat localStorage diblokir.

Catatan: hasil menang-kalah berasal dari undian simulasi komputer, bukan data siswa sebenarnya.
