// Akun siswa dan guru: login email dan kata sandi (Firebase Authentication) dan penyimpanan data (Firestore).
// SDK Firebase dimuat dari CDN lewat import map (lihat index.html), bukan npm.
import { firebaseConfig } from "./firebase-config.js";

let A = null; // modul auth
let F = null; // modul firestore
let auth = null;
let db = null;

/** Memuat SDK dan menyiapkan Firebase. Gagal (misalnya tanpa internet) dilempar ke pemanggil. */
export async function initAkun() {
  const [appMod, authMod, fsMod] = await Promise.all([import("firebase/app"), import("firebase/auth"), import("firebase/firestore")]);
  A = authMod;
  F = fsMod;
  const app = appMod.initializeApp(firebaseConfig);
  auth = A.getAuth(app);
  auth.languageCode = "id"; // email lupa kata sandi dalam Bahasa Indonesia
  db = F.getFirestore(app);
}

export const siap = () => !!auth;
export const penggunaSekarang = () => auth?.currentUser || null;

/** cb(user | null) dipanggil setiap status login berubah. */
export function pantauLogin(cb) {
  return A.onAuthStateChanged(auth, cb);
}

export const kelasKey = (kelas) => kelas.trim().toLowerCase().replace(/\s+/g, " ");

export async function masuk(email, sandi) {
  await A.signInWithEmailAndPassword(auth, email.trim(), sandi);
}

/** Membuat akun baru lalu menyimpan profil nama dan kelas. */
export async function daftar(email, sandi, nama, kelas) {
  const { user } = await A.createUserWithEmailAndPassword(auth, email.trim(), sandi);
  await F.setDoc(F.doc(db, "users", user.uid), {
    nama, kelas, kelasKey: kelasKey(kelas), email: user.email,
    dibuat: F.serverTimestamp(), diperbarui: F.serverTimestamp(),
  });
}

export async function lupaSandi(email) {
  await A.sendPasswordResetEmail(auth, email.trim());
}

export async function keluar() {
  await A.signOut(auth);
}

/** Profil akun yang sedang masuk, atau null jika belum ada (misalnya akun guru yang dibuat di Console). */
export async function bacaProfil() {
  const u = penggunaSekarang();
  if (!u) return null;
  const snap = await F.getDoc(F.doc(db, "users", u.uid));
  return snap.exists() ? snap.data() : null;
}

/** Menyimpan nama dan kelas; membuat profil jika belum ada. */
export async function simpanProfil(nama, kelas) {
  const u = penggunaSekarang();
  if (!u) return;
  const ref = F.doc(db, "users", u.uid);
  const snap = await F.getDoc(ref);
  if (!snap.exists()) {
    await F.setDoc(ref, { nama, kelas, kelasKey: kelasKey(kelas), email: u.email, dibuat: F.serverTimestamp(), diperbarui: F.serverTimestamp() });
  } else {
    const d = snap.data();
    if (d.nama !== nama || d.kelas !== kelas) {
      await F.updateDoc(ref, { nama, kelas, kelasKey: kelasKey(kelas), diperbarui: F.serverTimestamp() });
    }
  }
}

/** Akun guru dikenali dari dokumen guru/{uid} yang dibuat pemilik di Firebase Console. */
export async function cekGuru() {
  const u = penggunaSekarang();
  if (!u) return false;
  try {
    return (await F.getDoc(F.doc(db, "guru", u.uid))).exists();
  } catch (e) {
    return false;
  }
}

/** Menyimpan satu permainan ber-p bawaan. x berisi 1, 0, atau null (tidak dimainkan). */
export async function simpanPermainan({ p, x, karakter, mulai }) {
  const u = penggunaSekarang();
  if (!u) throw new Error("belum masuk");
  await F.addDoc(F.collection(db, "users", u.uid, "permainan"), {
    p, x, karakter, mulai, selesai: F.serverTimestamp(),
  });
}

/** Permainan terbaru milik akun yang sedang masuk, atau null. */
export async function permainanTerbaru() {
  const u = penggunaSekarang();
  if (!u) return null;
  const q = F.query(F.collection(db, "users", u.uid, "permainan"), F.orderBy("selesai", "desc"), F.limit(1));
  const snap = await F.getDocs(q);
  return snap.docs.length ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
}

/** Satu permainan menurut id, atau null. */
export async function bacaPermainan(id) {
  const u = penggunaSekarang();
  if (!u || !id) return null;
  const snap = await F.getDoc(F.doc(db, "users", u.uid, "permainan", id));
  return snap.exists() ? { id, ...snap.data() } : null;
}

// ---------- LKPD: users/{uid}/lkpd/jawaban ----------
const lkpdRef = () => F.doc(db, "users", penggunaSekarang().uid, "lkpd", "jawaban");

/** Dokumen LKPD milik akun yang sedang masuk, atau null jika belum pernah dibuka. */
export async function bacaLkpd() {
  if (!penggunaSekarang()) return null;
  const snap = await F.getDoc(lkpdRef());
  return snap.exists() ? snap.data() : null;
}

/** Membuat LKPD baru berstatus draf (aturan Firestore hanya mengizinkan status draf saat dibuat). */
export async function buatLkpd(permainanId) {
  const data = { isian: {}, status: "draf", progres: 0, permainanId, dibuat: F.serverTimestamp(), diperbarui: F.serverTimestamp() };
  await F.setDoc(lkpdRef(), data);
  return { ...data, isian: {} };
}

/** Menyimpan sebagian isian. ID kolom memakai garis bawah, bukan titik (titik berarti kolom bersarang). */
export async function simpanIsian(perubahan, progres, permainanId) {
  const data = { progres, diperbarui: F.serverTimestamp() };
  if (permainanId) data.permainanId = permainanId;
  for (const [id, v] of Object.entries(perubahan)) data["isian." + id] = v;
  await F.updateDoc(lkpdRef(), data);
}

/** Mengirim LKPD: jawaban dan permainan yang dipakai terkunci. */
export async function kirimLkpd(permainanId, progres) {
  await F.updateDoc(lkpdRef(), { status: "terkirim", permainanId, progres, dikirim: F.serverTimestamp(), diperbarui: F.serverTimestamp() });
}

/** Mengajukan perubahan setelah terkirim; guru yang memutuskan. */
export async function ajukanPerubahan(alasan) {
  await F.updateDoc(lkpdRef(), { status: "minta-ubah", alasanUbah: alasan });
}

/** Pesan galat Firebase dalam Bahasa Indonesia. */
export function pesanGalat(err) {
  const code = (err && err.code) || "";
  const map = {
    "auth/email-already-in-use": "Email sudah terdaftar. Silakan masuk.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/weak-password": "Kata sandi minimal 6 karakter.",
    "auth/missing-password": "Kata sandi wajib diisi.",
    "auth/invalid-credential": "Email atau kata sandi salah.",
    "auth/wrong-password": "Email atau kata sandi salah.",
    "auth/user-not-found": "Email atau kata sandi salah.",
    "auth/invalid-login-credentials": "Email atau kata sandi salah.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi.",
    "auth/network-request-failed": "Tidak ada koneksi internet.",
    "auth/user-disabled": "Akun ini dinonaktifkan. Hubungi guru.",
    "permission-denied": "Akses ditolak. Hubungi guru.",
    unavailable: "Tidak ada koneksi internet.",
  };
  return map[code] || "Terjadi kesalahan. Coba lagi.";
}
