// Data 5 tahap Adventure Bernoulli. Satu-satunya sumber nilai p di seluruh game.
// p disimpan dalam perseratus (60 berarti 0,6) agar cocok dengan js/bernoulli.js.
// Ini nilai p BAWAAN. Setting Peluang di menu utama (js/settings.js) hanya mengganti p untuk latihan
// sebelum permainan dimulai; selama sesi berjalan p tidak berubah.
// Teks {p} dan {q} di dialog diganti peluang menang dan kalah tahap itu (dalam persen).
// Perlengkapan (power), ramuan, sihir, dan QTE hanya memengaruhi fase hack and slash dan animasi, BUKAN p.
// Serangan Penentu dipicu oleh yang lebih dulu terjadi: HP boss 20% atau HP player 1.
// Keduanya satu percobaan Bernoulli yang sama dengan peluang p tahap itu.

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => v && typeof v === "object" && deepFreeze(v));
  return Object.freeze(o);
};

export const CONFIG = deepFreeze({
  // Ramuan dan gulungan sihir yang muncul di arena selama fase hack and slash.
  potions: {
    spawnEvery: 8, // detik antar kemunculan benda
    maxOnField: 2,
    heal: 35, // Ramuan Darah menambah HP
    attackMultiplier: 2, // Ramuan Serangan: kerusakan tebasan 2 kali
    attackDuration: 15, // detik
    fireball: 6, // Bola Api: kerusakan = 6 kali kerusakan tebasan tahap itu
    lightning: 8, // Petir: 8 kali kerusakan tebasan, boss terpaku sebentar
    lightningStun: 1.5, // detik
  },

  stages: [
    {
      id: 1,
      power: { damage: 10, bossHp: 1000, bossHit: 1.0 }, // kerusakan tebasan, HP boss, kekuatan pukulan boss
      nama: "Tahap 1: Pertemuan Pertama",
      kondisi: "Tanpa perlengkapan",
      kondisiPlayer: "Tanpa perlengkapan, hanya pedang kayu",
      kondisiBoss: "Arca Durgaraksa baru bangkit dari tidurnya",
      p: 50,
      gear: { sword: "wood", armor: null, shield: null, cape: false },
      boss: "normal",
      resi: "Peluangmu menang {p}, peluangmu kalah {q}. Jumlahnya selalu 100%.",
      cutscene: [
        { who: "resi", text: "Kau sudah bangun, Pengembara. Inilah ruang singgasana Swarnadwipa." },
        { who: "arca", text: "SIAPA BERANI MENGUSIK SINGGASANA INI?" },
        { who: "player", text: "Aku, {nama}. Aku datang untuk menghentikanmu!" },
      ],
    },
    {
      id: 2,
      power: { damage: 14, bossHp: 1000, bossHit: 1.0 }, // kerusakan tebasan, HP boss, kekuatan pukulan boss
      nama: "Tahap 2: Pedang Besi",
      kondisi: "Mendapat pedang besi",
      kondisiPlayer: "Pedang besi bercahaya biru",
      kondisiBoss: "Arca Durgaraksa dengan kekuatan biasa",
      p: 60,
      gear: { sword: "iron", armor: null, shield: null, cape: false },
      boss: "normal",
      resi: "Dengan pedang ini peluang menangmu {p}. Tapi {p} bukan berarti pasti menang.",
      cutscene: [
        { who: "resi", text: "Ambillah pedang besi ini. Bilahnya jauh lebih tajam." },
        { who: "arca", text: "Pedang baru tidak membuatmu kebal, manusia kecil." },
      ],
    },
    {
      id: 3,
      power: { damage: 17, bossHp: 1000, bossHit: 1.0 }, // kerusakan tebasan, HP boss, kekuatan pukulan boss
      nama: "Tahap 3: Pedang dan Armor",
      kondisi: "Pedang besi dan armor",
      kondisiPlayer: "Pedang besi dan armor perak (helm, pelindung dada, pelindung bahu)",
      kondisiBoss: "Arca Durgaraksa dengan kekuatan biasa",
      p: 70,
      gear: { sword: "iron", armor: "silver", shield: null, cape: false },
      boss: "normal",
      resi: "Dengan pedang dan armor, peluang menangmu {p}. Kekalahan masih mungkin terjadi.",
      cutscene: [
        { who: "resi", text: "Armor perak ini warisan para penjaga kerajaan. Pakailah." },
        { who: "player", text: "Berat juga... tapi aku siap!" },
      ],
    },
    {
      id: 4,
      power: { damage: 22, bossHp: 1400, bossHit: 1.25 }, // kerusakan tebasan, HP boss, kekuatan pukulan boss
      nama: "Tahap 4: Arca Bangkit Lebih Kuat",
      kondisi: "Arca Durgaraksa lebih kuat",
      kondisiPlayer: "Pedang ksatria, armor perak, dan perisai ksatria",
      kondisiBoss: "Arca Durgaraksa bangkit lebih kuat, kristal ungu tumbuh di punggungnya",
      p: 40,
      gear: { sword: "knight", armor: "silver", shield: "knight", cape: false },
      boss: "strong",
      resi: "Sang arca bangkit lebih kuat. Peluang menangmu kini {p}, peluang kalahmu {q}.",
      cutscene: [
        { who: "arca", text: "Batu-batuku menyatu kembali... LEBIH KERAS DARI SEBELUMNYA!" },
        { who: "resi", text: "Ia menyerap kristal ungu. Bawalah pedang dan perisai ksatria ini." },
      ],
    },
    {
      id: 5,
      power: { damage: 28, bossHp: 1800, bossHit: 1.5 }, // kerusakan tebasan, HP boss, kekuatan pukulan boss
      nama: "Tahap 5: Arca Murka",
      kondisi: "Arca Durgaraksa murka",
      kondisiPlayer: "Pedang api, armor emas, perisai emas, dan jubah",
      kondisiBoss: "Arca Durgaraksa murka, tubuhnya diselimuti aura merah",
      p: 30,
      gear: { sword: "flame", armor: "gold", shield: "gold", cape: true },
      boss: "enraged",
      resi: "Sang arca murka. Peluang menangmu {p}. Apa pun peluangnya, hasilnya baru diketahui setelah undian.",
      cutscene: [
        { who: "arca", text: "CUKUP! RASAKAN MURKA SANG PENJAGA!" },
        { who: "player", text: "Pedang api ini akan menjawabmu." },
        { who: "resi", text: "Ini percobaan terakhir. Apa pun hasilnya, catatlah." },
      ],
    },
  ],

  dialog: {
    pembuka:
      "Setiap pertarunganmu dengan Arca Durgaraksa hanya punya dua akhir: menang atau kalah. Itulah satu percobaan Bernoulli.",
    kalah:
      "Kekalahan ini tercatat. Bangkitlah. Pertarungan berikutnya adalah percobaan baru yang tidak dipengaruhi hasil sebelumnya.",
    berhenti:
      "Tidak apa-apa beristirahat. Percobaan yang tidak dilakukan tidak punya hasil, jadi tidak dihitung menang ataupun kalah.",
    penutup: "Lihatlah catatanmu. Setiap tahap adalah satu percobaan Bernoulli dengan peluangnya sendiri.",
    // Serangan Penentu yang dipicu saat PLAYER sekarat (peluangnya tetap p tahap itu)
    sekarat: "Kau sekarat! Satu serangan balik terakhir akan diundi. Peluangnya tetap sama: {p}.",
    beruntung: [
      "Hahaha! Kau sangat beruntung, Pengembara!",
      "Serangan balikmu tepat mengenai retakan di dadanya. Ayo, kita lanjutkan!",
    ],
  },
});
