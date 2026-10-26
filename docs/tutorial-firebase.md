# Tutorial Pemasangan Firebase untuk Adventure Bernoulli

Panduan langkah demi langkah: menyiapkan proyek Firebase `bernoulliadventure`, mengaktifkan login
**email dan kata sandi**, membuat database Firestore, memasang aturan akses, membuat akun guru, dan
menghubungkannya dengan situs di Vercel. Semua langkah dilakukan di browser oleh pemilik akun Firebase.
Tidak perlu kartu kredit; cukup paket gratis **Spark**.

Catatan keyakinan: nama menu Firebase Console kadang berubah. Nama menu di bawah **[Kemungkinan Besar]**
sesuai tampilan sekarang. Jika ada yang berbeda, cari menu dengan arti yang sama.

---

## Bagian 0. Yang perlu disiapkan

1. Akun Google pemilik proyek Firebase (memegang semua data siswa; jangan dipakai bersama-sama).
2. Alamat situs di Vercel, misalnya `adventure-bernoulli.vercel.app`.
3. Empat email guru beserta nama guru.
4. Satu email lain untuk menguji sebagai siswa.

---

## Bagian 1. Proyek Firebase

Proyek `bernoulliadventure` sudah dibuat. Jika suatu saat perlu membuat proyek baru: buka
**https://console.firebase.google.com** → **Create a project** → isi nama → Google Analytics boleh dimatikan
→ **Create project**.

---

## Bagian 2. Konfigurasi aplikasi web

Konfigurasi web sudah didapat (berisi `apiKey`, `authDomain`, `projectId`, `storageBucket`,
`messagingSenderId`, `appId`, `measurementId`). Hal yang perlu diketahui:

- **Tidak perlu `npm install firebase`.** Game memuat Firebase dari CDN, sesuai aturan proyek bahwa game
  tidak bergantung pada npm.
- **Google Analytics tidak dipakai.** Baris `getAnalytics(app)` pada contoh kode Firebase tidak dimasukkan ke
  game, karena tidak diperlukan dan Analytics mengumpulkan data perilaku pengguna, termasuk siswa di bawah
  umur. `measurementId` boleh tetap ada di konfigurasi; tanpa `getAnalytics`, nilai itu tidak dipakai.
- **Apakah `apiKey` rahasia?** [Kemungkinan Besar] Tidak. Menurut dokumentasi Firebase, konfigurasi web
  memang ditaruh di kode yang bisa dilihat publik. Keamanan data dijaga oleh aturan Firestore (Bagian 5).

Melihat konfigurasi lagi: ikon roda gigi → **Project settings** → tab **General** → bagian **Your apps**.

---

## Bagian 3. Mengaktifkan login email dan kata sandi

1. Menu kiri: **Build** → **Authentication** → **Get started** (jika belum).
2. Tab **Sign-in method** → pilih **Email/Password**.
3. Aktifkan **Email/Password** (baris pertama). **Biarkan "Email link (passwordless sign-in)" nonaktif.**
4. Tekan **Save**.
5. Jika sebelumnya **Google** sudah diaktifkan dan tidak dipakai, buka baris **Google** → nonaktifkan →
   **Save**.

### Bahasa email "lupa kata sandi"

Siswa yang lupa kata sandi menerima email untuk membuat kata sandi baru.
1. **Authentication** → tab **Templates** → **Password reset**.
2. Ubah bahasa template ke **Indonesian** (ikon bahasa di kanan atas template), jika tersedia.
3. Isi nama pengirim, misalnya `Adventure Bernoulli`.

Catatan: email ini hanya sampai jika siswa mendaftar dengan alamat email yang benar-benar ada. Ingatkan siswa
memakai email aktif.

### Mendaftarkan domain Vercel

1. **Authentication** → tab **Settings** → **Authorized domains** → **Add domain**.
2. Isi domain Vercel tanpa `https://`, misalnya `adventure-bernoulli.vercel.app` → **Add**.
3. Tambahkan juga domain sendiri jika ada.

---

## Bagian 4. Membuat database Firestore

1. Menu kiri: **Build** → **Firestore Database** → **Create database**.
2. Jika ditanya edisi, pilih **Standard edition**.
3. **Location**: pilih yang dekat dengan pengguna, misalnya **asia-southeast2 (Jakarta)**. Lokasi **tidak
   bisa diubah** setelah dibuat.
4. Mode awal: **Start in production mode**.
5. Tekan **Create**.

---

## Bagian 5. Memasang aturan akses

1. **Firestore Database** → tab **Rules**.
2. Hapus isi yang ada, lalu tempelkan seluruh isi file **`firestore.rules`** dari repository (salin dari file
   itu, bukan dari Word/PDF, supaya tanda kutip dan baris tidak berubah). Isinya sama dengan di bawah ini.
3. Tekan **Publish**.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function masuk() { return request.auth != null; }
    // akun guru dikenali dari UID-nya di koleksi guru (dibuat manual di Console)
    function guru() {
      return masuk() && exists(/databases/$(database)/documents/guru/$(request.auth.uid));
    }
    function pemilik(uid) { return masuk() && request.auth.uid == uid; }
    function hanyaUbah(kolom) {
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(kolom);
    }

    // daftar guru: tiap akun hanya bisa mengecek dirinya sendiri
    match /guru/{uid} {
      allow read: if masuk() && request.auth.uid == uid;
      allow write: if false;
    }

    match /users/{uid} {
      allow read: if pemilik(uid) || guru();
      allow create: if pemilik(uid);
      allow update: if guru() || (pemilik(uid) && hanyaUbah(['nama', 'kelas', 'kelasKey', 'diperbarui']));
      allow delete: if guru();

      // permainan: hanya p bawaan yang disimpan; tidak bisa diubah setelah tersimpan
      match /permainan/{id} {
        allow read: if pemilik(uid) || guru();
        allow create: if pemilik(uid) && request.resource.data.p == [50, 60, 70, 40, 30];
        allow update: if false;
        allow delete: if guru();
      }

      // LKPD: siswa mengisi saat draf atau dibuka guru; setelah terkirim hanya bisa mengajukan perubahan
      match /lkpd/{doc} {
        allow read: if pemilik(uid) || guru();
        allow create: if pemilik(uid) && request.resource.data.status == 'draf';
        allow update: if
          (pemilik(uid) && resource.data.status in ['draf', 'dibuka']
             && request.resource.data.status in ['draf', 'dibuka', 'terkirim'])
          || (pemilik(uid) && resource.data.status == 'terkirim'
             && request.resource.data.status == 'minta-ubah' && hanyaUbah(['status', 'alasanUbah']))
          || (guru() && hanyaUbah(['status', 'diputuskanOleh', 'diputuskanPada']));
        allow delete: if guru();
      }
    }
  }
}
```

Arti aturan ini:
- Siswa hanya bisa membaca dan menulis datanya sendiri; guru bisa membaca semua.
- Permainan yang tersimpan wajib memakai p bawaan (0,5; 0,6; 0,7; 0,4; 0,3). Permainan latihan dengan p
  dari Setting Guru tidak disimpan.
- Setelah LKPD dikirim, siswa hanya bisa mengajukan perubahan; guru yang memutuskan.
- Hanya guru yang bisa menghapus data siswa.

Mengapa guru dikenali dari UID, bukan email [Pasti]: dengan login email dan kata sandi, siapa pun bisa
mendaftar memakai alamat email apa saja tanpa membuktikan bahwa email itu miliknya. Jika guru dikenali dari
email, orang lain bisa mendaftar dengan email guru (sebelum guru itu mendaftar) lalu mendapat akses guru. UID
dibuat Firebase dan tidak bisa dipilih pendaftar, jadi celah ini tertutup.

Batas yang perlu diketahui [Pasti]: undian permainan berjalan di perangkat siswa. Aturan ini mencegah p
dipalsukan, tetapi siswa yang paham alat developer browser masih bisa mengirim hasil menang/kalah palsu.
Untuk LKPD yang menilai penalaran, ini dapat diterima.

---

## Bagian 6. Membuat akun guru

Akun guru dibuat oleh pemilik proyek, bukan didaftarkan sendiri lewat situs.

### Langkah 1: buat akun di Authentication

1. **Authentication** → tab **Users** → **Add user**.
2. Isi **Email** guru dan **Password** sementara (minimal 6 karakter) → **Add user**.
3. Di daftar pengguna, salin **User UID** akun itu (deretan huruf dan angka panjang).
4. Ulangi untuk keempat guru.

### Langkah 2: daftarkan UID sebagai guru

1. **Firestore Database** → tab **Data** → **Start collection** (atau **Add document** jika koleksi `guru`
   sudah ada).
2. **Collection ID**: `guru`.
3. **Document ID**: tempel **User UID** guru (bukan email, jangan pakai Auto-ID).
4. Tambahkan field: `nama` (string) berisi nama guru, dan `email` (string) berisi email guru (hanya sebagai
   catatan). Tekan **Save**.
5. Ulangi untuk keempat guru.

### Langkah 3: kata sandi guru

Beri tahu setiap guru kata sandi sementaranya. Guru bisa menggantinya lewat tautan **Lupa kata sandi** di
halaman masuk situs (email reset dikirim ke alamat guru).

Untuk mencabut akses guru, hapus dokumennya dari koleksi `guru`. Untuk menghapus akunnya sama sekali, hapus
juga dari **Authentication** → **Users**.

---

## Bagian 7. Menguji aturan sebelum dipakai siswa

Di tab **Rules**, buka **Rules Playground**. Coba skenario berikut:

| No | Simulasi | Hasil yang benar |
|---|---|---|
| 1 | Tanpa login, `get` di `/users/abc` | Ditolak |
| 2 | Login dengan uid `abc`, `get` di `/users/abc` | Diizinkan |
| 3 | Login dengan uid `abc`, `get` di `/users/xyz` | Ditolak |
| 4 | Login uid `abc`, `create` di `/users/abc/permainan/1` dengan data `p` = [50, 60, 70, 40, 30] | Diizinkan |
| 5 | Sama dengan nomor 4, tetapi `p` = [10, 20, 30, 40, 50] | Ditolak |
| 6 | Login dengan uid guru (yang ada di koleksi `guru`), `get` di `/users/xyz` | Diizinkan |

Jika hasilnya berbeda, periksa apakah aturan sudah di-**Publish** dan apakah Document ID di koleksi `guru`
sama persis dengan User UID guru.

---

## Bagian 8. Menghubungkan dengan situs Vercel

1. Konfigurasi web sudah diterima pengembang dan akan dimasukkan ke file `js/firebase-config.js`.
2. Setelah kode diperbarui dan di-deploy ulang di Vercel, buka situs produksi.
3. Uji sebagai **siswa**: **Daftar** dengan email dan kata sandi → isi nama dan kelas → bermain sampai rekap
   → buka LKPD → isi beberapa jawaban → keluar → masuk lagi di perangkat lain dengan email dan kata sandi
   yang sama → jawaban harus tetap ada.
4. Uji **Lupa kata sandi**: email reset harus masuk ke kotak masuk (periksa juga folder spam).
5. Uji sebagai **guru**: masuk dengan akun guru → tombol **Guru** muncul → siswa uji terlihat di daftar.
6. Periksa di **Firestore Database** → **Data**: harus muncul koleksi `users` berisi dokumen siswa uji.

---

## Bagian 9. Pemantauan kuota dan pemeliharaan

- Paket **Spark** gratis. Kuota harian Firestore menurut dokumentasi resmi: 50.000 baca dan 20.000 tulis.
  Jika terlampaui, layanan berhenti sementara sampai periode berikutnya, bukan ditagih.
- Lihat pemakaian di **Firestore Database** → tab **Usage**.
- Perkiraan [Dugaan]: satu siswa memakai sekitar 50 sampai 100 tulis untuk bermain dan mengerjakan LKPD, jika
  jawaban disimpan saat pindah kolom.
- **Jangan** menekan upgrade ke paket **Blaze** kecuali memang diperlukan; Blaze memerlukan kartu kredit dan
  bisa menimbulkan tagihan.
- Pengguna yang lupa kata sandi dan tidak memakai email aktif bisa dibantu pemilik: **Authentication** →
  **Users** → menu titik tiga pada akun itu → **Reset password** atau hapus akun agar siswa mendaftar ulang.

### Opsional: membatasi kunci API ke domain situs

[Kemungkinan Besar] Buka **https://console.cloud.google.com** → proyek `bernoulliadventure` → **APIs &
Services** → **Credentials** → kunci "Browser key (auto created by Firebase)" → **Application
restrictions**: **Websites** → tambahkan `https://adventure-bernoulli.vercel.app/*` → **Save**. Lakukan
setelah semua uji berhasil; jika login gagal setelah langkah ini, periksa daftar domainnya.

---

## Bagian 10. Data pribadi siswa

Data yang tersimpan: email, nama, kelas, hasil permainan, dan jawaban LKPD. Kata sandi tidak disimpan di
database; Firebase Authentication menyimpannya dalam bentuk tersandi dan pengembang maupun guru tidak bisa
membacanya. Siswa kelas XII umumnya masih di bawah 18 tahun; Pasal 25 UU 27/2022 tentang Pelindungan Data
Pribadi mewajibkan persetujuan orang tua atau wali untuk pemrosesan data pribadi anak. Izin diurus kelompok
sebelum situs dipakai siswa.

Setelah penelitian selesai, data bisa diunduh guru (CSV), lalu dihapus dari Firestore dan Authentication.
