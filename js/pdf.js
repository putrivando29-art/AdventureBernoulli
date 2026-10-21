// Rekap PDF dengan jsPDF (window.jspdf.jsPDF dari CDN). Rumus ditulis dengan karakter biasa
// (p^x, tanda minus "-") agar terbaca dengan font standar PDF.

/** Pertanyaan refleksi; nomor 2 memakai tahap dengan p terbesar pada sesi ini. */
export function reflectionQuestions(stages) {
  const top = stages.reduce((a, s) => (s.p > a.p ? s : a), stages[0]);
  return [
    "Mengapa satu pertarungan melawan Arca Durgaraksa disebut satu percobaan Bernoulli?",
    `Pada tahap ${top.id} dengan p = ${window.Bernoulli.fmtP(top.p)}, apakah kamu pasti menang? Jelaskan.`,
    "Apakah kalah di tahap 1 memengaruhi peluang menangmu di tahap 2? Mengapa?",
  ];
}

export function pdfFileName(nama) {
  const safe = String(nama).normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `Rekap_Bernoulli_${safe || "Siswa"}.pdf`;
}

export function buildRecapPdf({ student, character, stages, records, date, pSource, reflection }) {
  const B = window.Bernoulli;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const L = 14;
  const R = 196;
  const W = R - L;
  let y = 18;

  const ensure = (h) => {
    if (y + h > 284) {
      doc.addPage();
      y = 18;
    }
  };
  const para = (text, size = 10, style = "normal", gap = 1.5) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, W);
    ensure(lines.length * size * 0.42 + gap);
    doc.text(lines, L, y);
    y += lines.length * size * 0.42 + gap;
  };

  // kepala
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Adventure Bernoulli", L, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Universitas Sriwijaya", L, y);
  y += 5;
  doc.text("by Kelompok 17", L, y);
  y += 4;
  doc.setDrawColor(150);
  doc.line(L, y, R, y);
  y += 6;
  para(`Nama Siswa: ${student.nama}`, 10.5);
  para(`Kelas: ${student.kelas}`, 10.5);
  para(`Karakter: ${character}`, 10.5);
  para(`Tanggal: ${date}`, 10.5);
  para(`Sumber nilai p: ${pSource}`, 10.5, "normal", 4);

  // tabel
  const cols = [
    ["Tahap", 13], ["Kondisi", 48], ["p", 11], ["1 - p", 13], ["Hasil", 27], ["X", 9], ["P(hasil)", 18], ["E(X)", 13], ["Var(X)", 16],
  ];
  const tableW = cols.reduce((a, c) => a + c[1], 0);
  const drawRow = (cells, bold, fill) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    const wrapped = cells.map((c, i) => doc.splitTextToSize(String(c), cols[i][1] - 2));
    const h = Math.max(...wrapped.map((w) => w.length)) * 3.8 + 3;
    ensure(h);
    if (fill) {
      doc.setFillColor(235, 232, 245);
      doc.rect(L, y, tableW, h, "F");
    }
    let x = L;
    wrapped.forEach((w, i) => {
      doc.text(w, x + 1, y + 4.2);
      x += cols[i][1];
    });
    y += h;
    doc.setDrawColor(190);
    doc.line(L, y, L + tableW, y);
  };
  drawRow(cols.map((c) => c[0]), true, true);
  stages.forEach((s, i) => {
    const r = records[i];
    const played = r.x === 0 || r.x === 1;
    drawRow([
      s.id,
      s.kondisi,
      B.fmtP(s.p),
      B.fmtP(B.complement(s.p)),
      r.x === 1 ? "Menang" : r.x === 0 ? "Kalah" : "Tidak dimainkan",
      played ? r.x : "-",
      played ? B.fmtPmf(r.x, s.p) : "-",
      B.fmtP(s.p),
      B.fmtVar(s.p),
    ]);
  });
  y += 4;
  para("P(hasil) dihitung dengan P(X = x) = p^x (1 - p)^(1 - x). E(X) = p dan Var(X) = p(1 - p).", 9.5, "italic", 4);

  // ringkasan
  const summary = B.summarize(records.map((r, i) => ({ p: stages[i].p, x: r.x })));
  para(`Jumlah tahap dimainkan: ${summary.played}    Jumlah menang: ${summary.wins}    Jumlah kalah: ${summary.losses}`, 10.5, "bold", 3);
  if (summary.played === 0) {
    para("Belum ada percobaan yang dilakukan.", 10.5, "normal", 3);
  } else {
    const played = stages.map((s, i) => ({ s, r: records[i] })).filter(({ r }) => r.x === 0 || r.x === 1);
    const seq = B.fmtSequence(summary);
    para(
      `Peluang urutan hasil (perkalian P(hasil) tahap yang dimainkan) = ${played.map(({ s, r }) => B.fmtPmf(r.x, s.p)).join(" × ")} = ${seq.decimal} atau ${seq.percent}`,
      10.5, "normal", 2.5
    );
    para(
      `Jumlah menang yang diharapkan (jumlah p tahap yang dimainkan) = ${played.map(({ s }) => B.fmtP(s.p)).join(" + ")} = ${B.fmtTrim(summary.expectedNum, 2, 1)}. ` +
        "Nilai harapan jumlah sama dengan jumlah nilai harapannya.",
      10.5, "normal", 2.5
    );
  }
  para("Catatan: Jumlah kemenangan ini bukan distribusi binomial karena peluang tiap tahap berbeda.", 10.5, "bold", 6);

  // pertanyaan refleksi dengan ruang tulis tangan
  para("Pertanyaan Refleksi", 12, "bold", 3);
  reflection.forEach((q, i) => {
    para(`${i + 1}) ${q}`, 10.5, "normal", 2);
    ensure(26);
    doc.setDrawColor(200);
    for (let k = 0; k < 4; k++) {
      y += 6.5;
      doc.line(L + 4, y, R, y);
    }
    y += 6;
  });
  return doc;
}
