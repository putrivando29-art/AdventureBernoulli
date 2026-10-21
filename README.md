# Adventure Bernoulli

Game 3D hack and slash berbasis browser untuk belajar distribusi Bernoulli.
Universitas Sriwijaya, by Kelompok 17.

Di bawah reruntuhan Kerajaan Swarnadwipa, Arca Durgaraksa bangkit dan harus dilawan dalam
5 tahap. Resi Bayang memandu pemain. Setiap tahap diakhiri satu **Serangan Penentu**: satu
undian dengan peluang menang p yang menentukan MENANG (X = 1) atau KALAH (X = 0).

Dibuat dengan HTML, CSS, dan JavaScript murni, Three.js 0.160.0 (import map dari jsDelivr),
dan jsPDF 2.5.1 (cdnjs). Tanpa build tool, tanpa backend, tanpa database.

## 1. Menjalankan di komputer sendiri

1. Buka folder proyek ini di terminal.
2. Jalankan:

   ```bash
   python -m http.server 8000
   ```

   (Di sebagian komputer perintahnya `python3 -m http.server 8000`.)
3. Buka http://localhost:8000 di Chrome.

Game **tidak bisa** dibuka dengan klik dua kali `index.html`, karena browser memblokir
ES module pada alamat `file://`. Komputer juga harus terhubung ke internet untuk memuat
Three.js dan jsPDF dari CDN.

## 2. Publikasi gratis di GitHub Pages

1. Buat repository baru di GitHub dengan visibilitas **Public**.
2. Upload semua file proyek. `index.html` harus berada di folder paling atas repository
   (bukan di dalam subfolder), bersama file `.nojekyll`.
3. Buka **Settings > Pages**.
4. Pada **Build and deployment > Source**, pilih **Deploy from a branch**.
5. Pilih branch **main** dan folder **/ (root)**, lalu tekan **Save**.
6. Tunggu beberapa menit sampai situs selesai dibuat.
7. Buka `https://<username>.github.io/<nama-repo>/`.

Semua path di kode memakai awalan `./`, jadi game tetap jalan walaupun situs berada di
subfolder `/<nama-repo>/`. Nama file semuanya huruf kecil karena GitHub Pages peka huruf
besar-kecil.

## 3. Menjalankan tes

- **Tes Node** (butuh Node.js 18 atau lebih baru, tanpa instalasi paket):

  ```bash
  npm test
  ```

  Menguji `js/bernoulli.js` (decisiveRoll, pmf, mean, variance, validasi p, format angka,
  rekap) dan data tahap di `js/config.js`.
- **Tes browser**: jalankan server lokal lalu buka http://localhost:8000/?test=1. Hasilnya
  tercetak di Console (F12 > Console), antara lain 10.000 undian p = 60 harus memberi
  frekuensi 0,58 sampai 0,62.

`package.json` hanya untuk tes dan server lokal. Game di GitHub Pages tidak membutuhkan npm.

## 4. Kontrol

**Laptop**

| Tombol | Aksi |
|---|---|
| W A S D | bergerak |
| Gerakkan mouse | putar kamera (klik area game untuk mengunci kursor; jika ditolak, seret mouse) |
| Klik kiri | tebas (combo 3 tebasan) |
| Space | lompat |
| C atau Ctrl | jongkok |
| Shift | menghindar (berguling); lompat, jongkok, dan hindar membatalkan tebasan |
| Q | pakai sihir dari gulungan |
| Esc | jeda |

**HP**

| Kontrol | Aksi |
|---|---|
| Joystick kiri | bergerak |
| Geser di sisi kanan layar | putar kamera |
| Tombol Tebas, Lompat, Jongkok, Hindar, Sihir (kanan bawah) | aksi |
| Tombol jeda (kanan atas) | jeda |

Perangkat sentuh dideteksi otomatis. Putar HP ke mode landscape agar lebih nyaman. Tombol
**Layar Penuh** ada di pojok kanan atas menu, di menu jeda, dan di pojok layar game; di HP,
game juga otomatis masuk layar penuh saat tombol Mulai Petualangan ditekan (jika browser
mendukung).

## Fitur permainan

- **Kustomisasi karakter**: tubuh, warna kulit, 5 gaya rambut, 6 warna rambut, 8 warna baju,
  4 warna celana, dan aksesori (ikat kepala, syal, kacamata), plus tombol Acak. Hanya tampilan.
- **Percakapan singkat** gaya visual novel sebelum setiap tahap (Resi Bayang, Arca
  Durgaraksa, dan pemain). Ketuk atau Enter untuk lanjut, tombol Lewati untuk melewati.
- **Perlengkapan berbeda tiap tahap**: pedang kayu (1), pedang besi bercahaya biru (2), pedang
  besi + armor perak (3), pedang ksatria + armor perak + perisai (4), pedang api + armor emas +
  perisai emas + jubah (5).
- **Kekuatan naik tiap tahap**: kerusakan tebasan 10, 14, 17, 22, 28 (sesuai perlengkapan);
  HP arca 1000, 1000, 1000, 1400, 1800 dan pukulannya makin keras di tahap 4 dan 5.
- **Ramuan dan sihir** di arena: Ramuan Darah (+35 HP), Ramuan Serangan (kerusakan x2 selama
  15 detik), gulungan Bola Api (6 kali kerusakan tebasan) dan Petir (8 kali, arca terpaku 1,5
  detik). Gulungan dipakai dengan Q atau tombol Sihir.
- **Serangan Penentu, dua pemicu**: yang lebih dulu terjadi antara arca sekarat (HP 20%,
  "gacha serangan") dan player sekarat (HP 1, "gacha kabur"). Keduanya satu undian dengan p
  tahap itu. Jika menang saat sekarat, Resi Bayang tertawa: "Hahaha! Kau sangat beruntung!".
- **Adegan sinematik**: bilah hitam, judul, potongan kamera (close-up arca, dari balik bahu,
  sudut rendah, samping), dua QTE yang hanya memilih animasi, QTE terakhir yang sama untuk semua,
  lalu benturan dan hasil: MENANG = player menebas dan arca berlutut, KALAH = arca menghantam.
- **Efek gerak Nyaman** (bawaan, bisa diubah di menu jeda): guncangan dan kilatan layar
  diredam, kamera tidak berputar-putar.
- **Musik latar** sintetis (dengung, akor, derak obor; drum saat bertarung; detak jantung saat
  Serangan Penentu) dan efek suara. Tombol suara selalu tersedia.

Serangan boss punya aba-aba: **hantaman** (kedua lengan diangkat) dihindari dengan
berguling, **sapuan** (satu lengan ditarik ke samping) dihindari dengan jongkok, dan
**hentakan** (satu kaki diangkat, gelombang di lantai) dihindari dengan lompat.

## 5. Konsep Bernoulli di game

- Satu tahap = satu percobaan Bernoulli dengan dua hasil saja: MENANG (X = 1) atau
  KALAH (X = 0). Tidak ada hasil seri.
- Nilai p bawaan ada di `js/config.js` dan semuanya berbeda:

  | Tahap | Kondisi | p | 1 - p |
  |---|---|---|---|
  | 1 | Tanpa perlengkapan | 0,5 = 1/2 | 0,5 = 1/2 |
  | 2 | Mendapat pedang besi | 0,6 = 3/5 | 0,4 = 2/5 |
  | 3 | Pedang besi dan armor | 0,7 = 7/10 | 0,3 = 3/10 |
  | 4 | Arca Durgaraksa lebih kuat | 0,4 = 2/5 | 0,6 = 3/5 |
  | 5 | Arca Durgaraksa murka | 0,3 = 3/10 | 0,7 = 7/10 |

- **Setting Guru** (menu utama) dapat mengganti p tiap tahap: angka di antara 0 dan 1 dengan
  paling banyak dua desimal, dan setiap tahap harus berbeda. Nilai tersimpan di browser itu, dan
  tombol "Salin Tautan untuk Siswa" membuat tautan seperti `.../?p=35-45-80-25-65` agar semua
  siswa memakai peluang yang sama. Prioritas: tautan, lalu nilai tersimpan, lalu bawaan.
- p dibaca sekali saat petualangan dimulai lalu dibekukan; selama sesi p tidak berubah karena
  cara bermain, sisa HP, pilihan karakter, hasil tahap sebelumnya, atau Setting Guru. Rekap dan
  PDF mencatat sumber nilai p (bawaan, Setting Guru, atau tautan).

- QTE, ramuan, perlengkapan, dan kostum hanya mengubah fase hack and slash dan animasi. Tidak
  satu pun mengubah p; di layar Serangan Penentu tertulis "Tombol yang muncul hanya mengubah
  gaya serangan, bukan peluang menang".
- Fase hack and slash hanya membawa pertarungan ke Serangan Penentu: HP boss berhenti di
  20% dan HP player berhenti di 1, jadi tidak ada yang mati di fase ini.
- Serangan Penentu mengambil satu bilangan acak U di [0, 1) dengan
  `crypto.getRandomValues`. X = 1 jika U < p, selain itu X = 0. Hanya satu undian per tahap
  dan hasilnya tidak bisa dibatalkan.
- Menang atau kalah, pemain lanjut ke tahap berikutnya.
- Rekap memakai P(X = x) = p^x (1 - p)^(1 - x), E(X) = p, dan Var(X) = p(1 - p). Peluang
  urutan hasil adalah perkalian P(hasil) tahap yang dimainkan, dan jumlah menang yang
  diharapkan adalah jumlah p tahap yang dimainkan (nilai harapan jumlah sama dengan jumlah
  nilai harapannya).
- Jumlah kemenangan dari 5 tahap **bukan** distribusi binomial, karena p tiap tahap berbeda.
- Tahap yang tidak dimainkan karena pemain berhenti dicatat "Tidak dimainkan", bukan kalah,
  dan tidak punya nilai X.

## 6. Keterbatasan

- Butuh internet untuk memuat Three.js dan jsPDF. Tanpa internet, game menampilkan pesan
  "Game membutuhkan koneksi internet. Periksa koneksi lalu muat ulang halaman."
- Data tidak disimpan. Semua hasil hilang saat halaman ditutup atau dimuat ulang, jadi
  unduh PDF rekap sebelum menutup halaman.
- Durasi fase hack and slash diatur lewat `power` tiap tahap dan `potions` di `js/config.js`.
  Durasi untuk siswa sungguhan masih perkiraan dan perlu dicek saat uji coba.
- Siswa juga bisa membuka Setting Guru dan mengubah p sebelum bermain. Periksa baris "Sumber
  nilai p" di PDF rekap siswa.
- Badge hosting (misalnya "Powered by Netlify") muncul di pojok kanan bawah dan tidak bisa
  dihapus dari kode game. Area itu sengaja dikosongkan dari tombol dan teks penting.
- QTE bisa disalahpahami sebagai penentu hasil. Guru sebaiknya menegaskan bahwa hasil hanya
  dari undian; pertanyaan refleksi nomor 2 dan 3 di PDF membantu membahasnya.
- Membuka `index.html` dengan klik dua kali menampilkan pesan cara membuka yang benar, karena
  game memang tidak bisa berjalan dari `file://`.
- Di Chrome, kombinasi **Ctrl+W** menutup tab dan tidak bisa dicegah oleh halaman web.
  Saat jongkok sambil bergerak maju, lebih aman memakai **C**.
- Pengujian otomatis dijalankan di Chromium tanpa GPU dan emulasi HP. Game belum diuji di
  Safari atau iPhone. Di HP dan di perangkat yang fps-nya di bawah 40, bloom, bayangan, dan
  sebagian partikel dimatikan otomatis.
- Jika browser menolak kunci kursor, kamera tetap bisa diputar dengan menyeret mouse.
- Jika unduhan PDF tidak muncul di HP, tekan **Buka PDF di Tab Baru**
  (izinkan pop-up bila diminta).

## Struktur folder

```
index.html, .nojekyll, README.md, package.json
css/style.css
tests/bernoulli.test.js
js/  bernoulli.js  config.js  main.js  player.js  boss.js  mystic.js  arena.js
     controls.js  combat.js  stages.js  ui.js  shaders.js  pdf.js  audio.js  browser-tests.js
     cutscene.js  qte.js  potions.js  spells.js  settings.js  teacher.js
```
