// Rekap PDF dengan jsPDF (window.jspdf.jsPDF dari CDN): hanya hasil menang dan kalah.
// Perhitungan peluang dikerjakan siswa di LKPD.

export function pdfFileName(nama) {
  const safe = String(nama).normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `Rekap_Bernoulli_${safe || "Siswa"}.pdf`;
}

export function buildRecapPdf({ student, stages, records, date, latihan }) {
  const B = window.Bernoulli;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const L = 14;
  const R = 196;
  const W = R - L;
  let y = 18;

  const para = (text, size = 10, style = "normal", gap = 1.5) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, W);
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
  para("Berikut catatan pertarunganmu melawan Arca Durgaraksa di Kerajaan Swarnadwipa.", 10.5, "normal", 3);
  para(`Nama Siswa: ${student.nama}`, 10.5);
  para(`Kelas: ${student.kelas}`, 10.5);
  para(`Tanggal: ${date}`, 10.5, "normal", latihan ? 1.5 : 4);
  if (latihan) para("Mode latihan: peluang diubah lewat Setting Peluang; hasil ini tidak dipakai LKPD.", 10, "italic", 4);

  // tabel hasil
  const cols = [["Tahap", 18], ["Kondisi", 92], ["p", 22], ["Hasil", 50]];
  const tableW = cols.reduce((a, c) => a + c[1], 0);
  const drawRow = (cells, bold, fill) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    const wrapped = cells.map((c, i) => doc.splitTextToSize(String(c), cols[i][1] - 3));
    const h = Math.max(...wrapped.map((w) => w.length)) * 4.2 + 3.5;
    if (fill) {
      doc.setFillColor(240, 232, 214);
      doc.rect(L, y, tableW, h, "F");
    }
    let x = L;
    wrapped.forEach((w, i) => {
      doc.text(w, x + 1.5, y + 4.6);
      x += cols[i][1];
    });
    y += h;
    doc.setDrawColor(190);
    doc.line(L, y, L + tableW, y);
  };
  drawRow(cols.map((c) => c[0]), true, true);
  stages.forEach((s, i) => {
    const r = records[i];
    drawRow([s.id, s.kondisi, B.fmtP(s.p), r.x === 1 ? "Menang" : r.x === 0 ? "Kalah" : "Tidak dimainkan"]);
  });
  y += 6;

  // ringkasan
  const summary = B.summarize(records.map((r, i) => ({ p: stages[i].p, x: r.x })));
  if (summary.played === 0) para("Belum ada percobaan yang dilakukan.", 10.5, "bold", 3);
  else {
    para(
      `Tahap dimainkan: ${summary.played}    Menang: ${summary.wins}    Kalah: ${summary.losses}    Tidak dimainkan: ${summary.notPlayed}`,
      10.5, "bold", 3
    );
  }
  return doc;
}
