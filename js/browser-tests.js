// Tes di browser. Berjalan otomatis jika halaman dibuka dengan ?test=1.
// Hasil dicetak di konsol (F12 > Console).
import { CONFIG } from "./config.js";
import { parseP, validatePs } from "./settings.js";

export function runBrowserTests() {
  const B = window.Bernoulli;
  const results = [];
  const check = (name, ok, detail = "") => results.push({ tes: name, hasil: ok ? "LULUS" : "GAGAL", detail });
  const throws = (fn) => {
    try {
      fn();
      return false;
    } catch (e) {
      return e instanceof RangeError;
    }
  };

  let wins = 0;
  const N = 10000;
  for (let i = 0; i < N; i++) wins += B.decisiveRoll(60).X;
  const freq = wins / N;
  check("10.000 undian p = 60: frekuensi di antara 0,58 dan 0,62", freq >= 0.58 && freq <= 0.62, "frekuensi = " + freq);

  check("pmf(1, 60) = 0,6", B.pmf(1, 60) === 0.6, String(B.pmf(1, 60)));
  check("pmf(0, 60) = 0,4", B.pmf(0, 60) === 0.4, String(B.pmf(0, 60)));
  check("mean(60) = 0,6", B.mean(60) === 0.6, String(B.mean(60)));
  check("variance(60) = 0,24", B.variance(60) === 0.24, String(B.variance(60)));
  check("p = 0 ditolak validasi", !B.isValidP(0) && throws(() => B.decisiveRoll(0)));
  check("p = 100 ditolak validasi", !B.isValidP(100) && throws(() => B.decisiveRoll(100)));

  const roll = B.decisiveRoll(50);
  check("decisiveRoll mengembalikan {U, X} dengan X hanya 0 atau 1", roll.U >= 0 && roll.U < 1 && (roll.X === 0 || roll.X === 1), JSON.stringify(roll));
  check("config: p bawaan = 50, 60, 70, 40, 30 (semua berbeda)", CONFIG.stages.map((s) => s.p).join() === "50,60,70,40,30");
  check("Setting Guru: '0,45' dibaca 45; '1' dan '0,123' ditolak", parseP("0,45") === 45 && parseP("1") === null && parseP("0,123") === null);
  check("Setting Guru: p yang sama ditolak", validatePs([50, 60, 70, 50, 30]) !== null && validatePs([50, 60, 70, 40, 30]) === null);
  check("config: data tahap dibekukan (p tidak bisa diubah)", Object.isFrozen(CONFIG.stages[0]) && Object.isFrozen(CONFIG.stages));

  const failed = results.filter((r) => r.hasil !== "LULUS").length;
  console.table(results);
  if (failed) console.error(`TES BROWSER: ${failed} dari ${results.length} GAGAL`);
  else console.log(`TES BROWSER: semua ${results.length} tes LULUS`);
  return { total: results.length, failed, results };
}
