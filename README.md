# Adventure Bernoulli

Game 3D hack and slash berbasis browser (Three.js) untuk belajar distribusi Bernoulli.
Universitas Sriwijaya, by Kelompok 17.

> Status: sedang dikerjakan bertahap. README lengkap ditulis ulang pada Fase 6.

## Menjalankan di komputer sendiri

```bash
python -m http.server 8000
```

Lalu buka http://localhost:8000. Membuka `index.html` dengan klik dua kali tidak bisa,
karena browser memblokir ES module pada `file://`. Game butuh internet untuk memuat
Three.js dari CDN.

## Tes

- `npm test`: tes Node untuk `js/bernoulli.js` dan data tahap di `js/config.js`.
- Buka http://localhost:8000/?test=1 lalu lihat Console (F12): tes browser mencetak hasilnya.
