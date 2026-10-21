// Data 5 tahap Adventure Bernoulli. Satu-satunya sumber nilai p di seluruh game.
// p disimpan dalam perseratus (60 berarti 0,6) agar cocok dengan js/bernoulli.js.
// Nilai p ditetapkan di sini dan tidak diubah oleh kode lain mana pun.

export const CONFIG = Object.freeze({
  // Jumlah tebasan yang kena sampai HP boss tersisa 20%. Sama untuk semua tahap
  // dan tidak memengaruhi p. Nilai akhir disetel saat combat dibuat (Fase 3).
  bossHitsToThreshold: 45,

  stages: Object.freeze([
    Object.freeze({
      id: 1,
      nama: "Tahap 1: Pertemuan Pertama",
      kondisi: "Setara, tanpa perlengkapan",
      kondisiPlayer: "Tanpa perlengkapan, hanya pedang kayu",
      kondisiBoss: "Arca Durgaraksa baru bangkit, kekuatannya setara denganmu",
      p: 50,
      gear: Object.freeze({ sword: "wood", armor: false }),
      boss: "normal",
      resi: "Kekuatan kalian setara. Peluangmu menang 50%, peluangmu kalah juga 50%. Jumlahnya selalu 100%.",
    }),
    Object.freeze({
      id: 2,
      nama: "Tahap 2: Pedang Besi",
      kondisi: "Mendapat pedang besi",
      kondisiPlayer: "Memegang pedang besi",
      kondisiBoss: "Arca Durgaraksa dengan kekuatan biasa",
      p: 60,
      gear: Object.freeze({ sword: "iron", armor: false }),
      boss: "normal",
      resi: "Pedang ini membuat peluang menangmu 60%. Tapi 60% bukan berarti pasti menang.",
    }),
    Object.freeze({
      id: 3,
      nama: "Tahap 3: Pedang dan Armor",
      kondisi: "Pedang besi dan armor",
      kondisiPlayer: "Memegang pedang besi dan memakai armor",
      kondisiBoss: "Arca Durgaraksa dengan kekuatan biasa",
      p: 70,
      gear: Object.freeze({ sword: "iron", armor: true }),
      boss: "normal",
      resi: "Dengan pedang dan armor, peluangmu 70%. Kekalahan masih mungkin terjadi.",
    }),
    Object.freeze({
      id: 4,
      nama: "Tahap 4: Arca Bangkit Lebih Kuat",
      kondisi: "Arca Durgaraksa lebih kuat",
      kondisiPlayer: "Memegang pedang besi dan memakai armor",
      kondisiBoss: "Arca Durgaraksa bangkit lebih kuat",
      p: 50,
      gear: Object.freeze({ sword: "iron", armor: true }),
      boss: "strong",
      resi: "Sang arca bangkit lebih kuat. Peluangmu kembali 50%.",
    }),
    Object.freeze({
      id: 5,
      nama: "Tahap 5: Arca Murka",
      kondisi: "Arca Durgaraksa murka",
      kondisiPlayer: "Memegang pedang besi dan memakai armor",
      kondisiBoss: "Arca Durgaraksa murka",
      p: 40,
      gear: Object.freeze({ sword: "iron", armor: true }),
      boss: "enraged",
      resi: "Sang arca murka. Peluangmu hanya 40%, tapi peluang kecil bukan berarti pasti kalah.",
    }),
  ]),

  dialog: Object.freeze({
    pembuka:
      "Setiap pertarunganmu dengan Arca Durgaraksa hanya punya dua akhir: menang atau kalah. Itulah satu percobaan Bernoulli.",
    kalah:
      "Kekalahan ini tercatat. Bangkitlah. Pertarungan berikutnya adalah percobaan baru yang tidak dipengaruhi hasil sebelumnya.",
    berhenti:
      "Tidak apa-apa beristirahat. Percobaan yang tidak dilakukan tidak punya hasil, jadi tidak dihitung menang ataupun kalah.",
    penutup: "Lihatlah catatanmu. Setiap tahap adalah satu percobaan Bernoulli dengan peluangnya sendiri.",
  }),
});
