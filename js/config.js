// Data 5 tahap Adventure Bernoulli. Satu-satunya sumber nilai p di seluruh game.
// p disimpan dalam perseratus (60 berarti 0,6) agar cocok dengan js/bernoulli.js.
// Ini nilai p BAWAAN. Guru bisa menggantinya lewat Setting Guru di menu utama (js/settings.js)
// sebelum permainan dimulai; selama sesi berjalan p tidak berubah.
// Teks {p} dan {q} di dialog diganti peluang menang dan kalah tahap itu (dalam persen).
// Perlengkapan, ramuan, dan QTE hanya memengaruhi fase hack and slash dan animasi, BUKAN p.

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => v && typeof v === "object" && deepFreeze(v));
  return Object.freeze(o);
};

export const CONFIG = deepFreeze({
  // Jumlah tebasan biasa yang kena sampai HP boss tersisa 20%. Sama untuk semua tahap.
  // Ramuan Serangan membuat tiap tebasan bernilai lebih, jadi ambang tercapai lebih cepat.
  bossHitsToThreshold: 90,

  // Ramuan dan pertolongan Resi Bayang selama fase hack and slash.
  potions: {
    spawnEvery: 9, // detik antar kemunculan ramuan
    maxOnField: 2,
    heal: 35, // Ramuan Darah menambah HP
    attackMultiplier: 2, // Ramuan Serangan: tiap tebasan bernilai 2 kali
    attackDuration: 15, // detik
    rescueHpBelow: 20, // saat sekarat, Resi Bayang menyembuhkan
    rescueHealTo: 60,
    rescueCooldown: 25, // detik
  },

  stages: [
    {
      id: 1,
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
    tolong: "Bertahanlah! Kekuatan ini akan memulihkanmu.",
  },
});
