# Tutorial Pemasangan Firebase untuk Adventure Bernoulli

Panduan langkah demi langkah dari nol: membuat proyek Firebase, mengaktifkan login Google, membuat
database Firestore, memasang aturan akses, mendaftarkan akun guru, dan menghubungkannya dengan situs di
Vercel. Semua langkah dilakukan di browser oleh pemilik akun Firebase. Tidak perlu kartu kredit; cukup
paket gratis **Spark**.

Catatan keyakinan: nama menu Firebase Console kadang berubah. Nama menu di bawah **[Kemungkinan Besar]**
sesuai tampilan sekarang. Jika ada yang berbeda, cari menu dengan arti yang sama.

---

## Bagian 0. Yang perlu disiapkan

1. Akun Google pemilik proyek (akun ini memegang semua data siswa; jangan dipakai bersama-sama).
2. Alamat situs di Vercel, misalnya `adventure-bernoulli.vercel.app`.
3. Empat email guru (akun Google) yang akan mendapat akses guru.
4. Satu akun Google lain untuk menguji sebagai siswa.

---

## Bagian 1. Membuat proyek Firebase

1. Buka **https://console.firebase.google.com** dan masuk dengan akun pemilik.
2. Tekan **Create a project** (atau **Add project**).
3. Isi nama proyek, misalnya `adventure-bernoulli`. Firebase membuat **Project ID** otomatis; catat.
4. Saat ditanya **Google Analytics**, matikan (tidak diperlukan). Tekan **Create project**, tunggu selesai,
   lalu **Continue**.

Jika proyek lama sudah ada dan ingin dipakai, lewati bagian ini. Jika ingin proyek baru yang bersih, buat
proyek baru seperti di atas.

---

## Bagian 2. Mendaftarkan aplikasi web dan mengambil konfigurasi

1. Di halaman **Project Overview**, tekan ikon **Web** (`</>`).
2. Isi **App nickname**, misalnya `adventure-bernoulli-web`.
3. **Jangan** centang "Also set up Firebase Hosting" (situs memakai Vercel).
4. Tekan **Register app**. Firebase menampilkan kode berisi `firebaseConfig`, kira-kira seperti ini:

   ```js
   const firebaseConfig = {
     apiKey: "....",
     authDomain: "adventure-bernoulli.firebaseapp.com",
     projectId: "adventure-bernoulli",
     storageBucket: "....",
     messagingSenderId: "....",
     appId: "...."
   };
   ```

5. Salin keenam nilai itu dan simpan. Nilai ini yang nanti dimasukkan ke kode game.
6. Tekan **Continue to console**. Langkah "npm install firebase" yang ditampilkan Firebase **tidak perlu
   diikuti**; game memuat Firebase dari CDN.

Apakah `apiKey` rahasia? [Kemungkinan Besar] Tidak. Menurut dokumentasi Firebase, konfigurasi web memang
ditaruh di kode yang bisa dilihat publik. Keamanan data dijaga oleh **aturan Firestore** (Bagian 5), bukan
oleh kerahasiaan konfigurasi. Konfigurasi boleh dikirim ke pengembang.

Jika suatu saat perlu melihat konfigurasi lagi: ikon roda gigi → **Project settings** → tab **General** →
bagian **Your apps**.

---

## Bagian 3. Mengaktifkan login Google

1. Menu kiri: **Build** → **Authentication** → tekan **Get started**.
2. Tab **Sign-in method** → pilih **Google**.
3. Geser **Enable** menjadi aktif.
4. Isi **Public-facing name** (nama yang terlihat siswa saat login), misalnya `Adventure Bernoulli`, dan
   pilih **Project support email** (email pemilik).
5. Tekan **Save**.

### Mendaftarkan domain Vercel

Login Google hanya mau berjalan di domain yang terdaftar.

1. Masih di **Authentication**, buka tab **Settings** → **Authorized domains**.
2. Tekan **Add domain**, isi domain Vercel tanpa `https://`, misalnya `adventure-bernoulli.vercel.app`.
   Tekan **Add**.
3. Jika memakai domain sendiri (misalnya `bernoulli.sekolah.sch.id`), tambahkan juga.
4. `localhost` biasanya sudah ada secara bawaan; biarkan untuk pengujian di komputer.

Catatan: setiap deployment pratinjau Vercel memakai alamat berbeda. Login hanya berfungsi di alamat yang
didaftarkan; uji login di alamat produksi.

---

## Bagian 4. Membuat database Firestore

1. Menu kiri: **Build** → **Firestore Database** → **Create database**.
2. Jika ditanya edisi, pilih **Standard edition**.
3. **Location**: pilih yang dekat dengan pengguna, misalnya **asia-southeast2 (Jakarta)**.
   Lokasi **tidak bisa diubah** setelah dibuat.
4. Mode awal: pilih **Start in production mode** (semua akses ditolak sampai aturan dipasang).
5. Tekan **Create**.

---

## Bagian 5. Memasang aturan akses

1. Di **Firestore Database**, buka tab **Rules**.
2. Hapus isi yang ada, lalu tempelkan aturan berikut seluruhnya. Salin dari file `firestore.rules` di
   repository (bukan dari Word/PDF), supaya tanda kutip dan baris tidak berubah:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function masuk() { return request.auth != null; }
    function guru() {
      return masuk() && request.auth.token.email_verified == true
        && exists(/databases/$(database)/documents/guru/$(request.auth.token.email));
    }
    function pemilik(uid) { return masuk() && request.auth.uid == uid; }
    function hanyaUbah(kolom) {
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(kolom);
    }

    // daftar guru: diisi manual di Console; tiap orang hanya bisa mengecek emailnya sendiri
    match /guru/{email} {
      allow read: if masuk() && request.auth.token.email == email;
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

3. Tekan **Publish**. Tunggu sampai muncul tanda berhasil.

Arti aturan ini:
- Siswa hanya bisa membaca dan menulis datanya sendiri; guru bisa membaca semua.
- Permainan yang tersimpan wajib memakai p bawaan (0,5; 0,6; 0,7; 0,4; 0,3). Permainan latihan dengan p
  dari Setting Guru tidak disimpan.
- Setelah LKPD dikirim, siswa tidak bisa mengubah jawaban; ia hanya bisa mengajukan perubahan, lalu guru
  memutuskan.
- Hanya guru yang bisa menghapus data siswa.

Batas yang perlu diketahui [Pasti]: undian permainan berjalan di perangkat siswa. Aturan ini mencegah p
dipalsukan, tetapi siswa yang paham alat developer browser masih bisa mengirim hasil menang/kalah palsu.
Untuk LKPD yang menilai penalaran, ini dapat diterima.

---

## Bagian 6. Mendaftarkan akun guru

Akun guru dikenali dari dokumen di koleksi `guru`. Email guru tidak ditulis di kode, jadi tidak terbuka di
repository.

1. **Firestore Database** → tab **Data** → **Start collection**.
2. **Collection ID**: `guru` → **Next**.
3. **Document ID**: isi email guru pertama, huruf kecil semua, misalnya `guru.satu@gmail.com`.
   (Jangan pakai **Auto-ID**.)
4. Tambahkan satu field: **Field** `nama`, **Type** string, **Value** nama guru. Tekan **Save**.
5. Ulangi untuk tiga email guru lainnya: di koleksi `guru` tekan **Add document**, isi Document ID dengan
   email, tambahkan field `nama`, lalu **Save**.

Untuk mencabut akses guru, hapus dokumennya dari koleksi `guru`.

---

## Bagian 7. Menguji aturan sebelum dipakai siswa

Di tab **Rules**, buka **Rules Playground** (atau **Develop and test**). Coba skenario berikut:

| No | Simulasi | Hasil yang benar |
|---|---|---|
| 1 | Tanpa login, `get` di `/users/abc` | Ditolak |
| 2 | Login dengan uid `abc`, `get` di `/users/abc` | Diizinkan |
| 3 | Login dengan uid `abc`, `get` di `/users/xyz` | Ditolak |
| 4 | Login uid `abc`, `create` di `/users/abc/permainan/1` dengan data `p` = [50, 60, 70, 40, 30] | Diizinkan |
| 5 | Sama dengan nomor 4, tetapi `p` = [10, 20, 30, 40, 50] | Ditolak |
| 6 | Login dengan email yang ada di koleksi `guru`, `get` di `/users/xyz` | Diizinkan |

Jika hasilnya berbeda, periksa apakah aturan sudah di-**Publish** dan apakah email guru ditulis persis
(huruf kecil) sebagai Document ID.

---

## Bagian 8. Menghubungkan dengan situs Vercel

1. Kirim keenam nilai `firebaseConfig` (Bagian 2) kepada pengembang. Pengembang memasukkannya ke file
   `js/firebase-config.js`.
2. Setelah kode diperbarui dan di-deploy ulang di Vercel, buka situs produksi.
3. Uji sebagai **siswa** (akun yang bukan guru): masuk dengan Google → isi nama dan kelas → bermain sampai
   rekap → buka LKPD → isi beberapa jawaban → buka situs di perangkat lain dengan akun yang sama → jawaban
   harus tetap ada.
4. Uji sebagai **guru**: masuk dengan email guru → tab Guru muncul → siswa uji terlihat di daftar.
5. Periksa di **Firestore Database** → **Data**: harus muncul koleksi `users` berisi dokumen siswa uji.

---

## Bagian 9. Pemantauan kuota dan pemeliharaan

- Paket **Spark** gratis. Kuota harian Firestore menurut dokumentasi resmi: 50.000 baca dan 20.000 tulis.
  Jika terlampaui, layanan berhenti sementara sampai periode berikutnya, bukan ditagih.
- Lihat pemakaian di **Firestore Database** → tab **Usage**.
- Perkiraan [Dugaan]: satu siswa memakai sekitar 50 sampai 100 tulis untuk bermain dan mengerjakan LKPD,
  jika jawaban disimpan saat pindah kolom. Satu angkatan beberapa kelas masih jauh di bawah batas harian.
- **Jangan** menekan tombol upgrade ke paket **Blaze** kecuali memang diperlukan; Blaze memerlukan kartu
  kredit dan bisa menimbulkan tagihan.

### Opsional: membatasi kunci API ke domain situs

Lapisan pengaman tambahan [Kemungkinan Besar]: buka **https://console.cloud.google.com** → pilih proyek yang
sama → **APIs & Services** → **Credentials** → pilih kunci "Browser key (auto created by Firebase)" →
**Application restrictions**: **Websites** → tambahkan `https://adventure-bernoulli.vercel.app/*` dan
`https://adventure-bernoulli.firebaseapp.com/*` → **Save**. Lakukan setelah semua uji berhasil; jika login
gagal setelah langkah ini, periksa daftar domainnya.

---

## Bagian 10. Data pribadi siswa

Data yang tersimpan: email, nama, kelas, hasil permainan, dan jawaban LKPD. Siswa kelas XII umumnya masih di
bawah 18 tahun; Pasal 25 UU 27/2022 tentang Pelindungan Data Pribadi mewajibkan persetujuan orang tua atau
wali untuk pemrosesan data pribadi anak. Izin diurus kelompok sebelum situs dipakai siswa.

Setelah penelitian selesai, data bisa diunduh guru (CSV), lalu dihapus dari Firestore.
