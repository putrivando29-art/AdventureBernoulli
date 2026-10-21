/* Antarmuka dan alur permainan Adventure Bernoulli. */
(function () {
  "use strict";

  const B = window.Bernoulli;
  const Art = window.Art;
  const $ = (sel) => document.querySelector(sel);
  const SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
  const sub = (n) => String(n).split("").map((d) => SUB[+d]).join("");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPIN_MS = reduceMotion ? 300 : 2600;
  const HISTORY_MAX = 30;

  // ---------- penyimpanan (aman bila localStorage diblokir) ----------
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* abaikan: game tetap jalan tanpa penyimpanan */
      }
    },
  };

  function loadPs() {
    const saved = store.get("ab.p", null);
    const def = B.DEFAULT_STAGES.map((s) => s.p);
    if (!Array.isArray(saved) || saved.length !== def.length) return def;
    const ok = saved.map(B.clampP);
    return ok.every((v) => v !== null) ? ok : def;
  }

  const state = {
    screen: "menu",
    ps: loadPs(),
    sound: store.get("ab.sound", true) !== false,
    history: (() => {
      const h = store.get("ab.history", []);
      return Array.isArray(h) ? h : [];
    })(),
    session: null, // sesi yang sedang dimainkan
    report: null, // sesi yang sedang ditampilkan di layar hasil
    token: 0, // berubah setiap sesi baru / keluar, membatalkan timer lama
    labToken: 0,
  };

  const stagesNow = () => B.DEFAULT_STAGES.map((s, i) => ({ ...s, p: state.ps[i] }));

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function playerName() {
    const v = $("#player-name").value.trim();
    return v || "Pemain";
  }

  // ---------- suara sederhana (Web Audio) ----------
  let audioCtx = null;
  function tone(freqs, dur = 0.12, type = "triangle", gap = 0.1) {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audioCtx.currentTime;
      freqs.forEach((f, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = f;
        const st = t0 + i * gap;
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(0.15, st + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, st + dur);
        o.connect(g).connect(audioCtx.destination);
        o.start(st);
        o.stop(st + dur + 0.02);
      });
    } catch (e) {
      /* audio tidak tersedia */
    }
  }
  const sfx = {
    click: () => tone([520], 0.06, "square"),
    spin: () => tone([300, 340, 380, 420], 0.07, "square", 0.08),
    win: () => tone([523, 659, 784, 1046], 0.18, "triangle", 0.11),
    lose: () => tone([392, 330, 262], 0.25, "sawtooth", 0.15),
    fanfare: () => tone([523, 523, 659, 784, 659, 784, 1046], 0.2, "triangle", 0.14),
  };

  function syncSoundUi() {
    const btn = $("#sound-btn");
    btn.textContent = state.sound ? "🔊" : "🔇";
    btn.setAttribute("aria-pressed", String(state.sound));
    btn.setAttribute("aria-label", state.sound ? "Matikan suara" : "Nyalakan suara");
    $("#sound-toggle").checked = state.sound;
  }

  // ---------- navigasi layar ----------
  function show(screen) {
    if (state.screen === "lab" && screen !== "lab") state.labToken++; // hentikan simulasi
    state.screen = screen;
    document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("is-active", el.id === "screen-" + screen));
    if (screen === "howto") renderHowto();
    if (screen === "settings") renderSettings();
    if (screen === "history") renderHistory();
    window.scrollTo(0, 0);
    const heading = document.querySelector("#screen-" + screen + " h1, #screen-" + screen + " h2");
    if (heading && screen !== "game") {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function sessionInProgress() {
    const s = state.session;
    return s && !s.finished && (s.records.length > 0 || s.phase === "spinning");
  }

  function confirmDialog(title, text, okLabel) {
    const dlg = $("#confirm-dialog");
    $("#confirm-title").textContent = title;
    $("#confirm-text").textContent = text;
    $("#confirm-ok").textContent = okLabel;
    return new Promise((resolve) => {
      if (typeof dlg.showModal !== "function") {
        resolve(window.confirm(title + "\n" + text));
        return;
      }
      dlg.returnValue = "";
      dlg.addEventListener("close", () => resolve(dlg.returnValue === "ok"), { once: true });
      dlg.showModal();
    });
  }

  async function leaveGame(target) {
    if (sessionInProgress()) {
      const ok = await confirmDialog(
        "Keluar dari petualangan?",
        "Sesi ini belum selesai. Hasil tahap yang sudah dimainkan tidak akan disimpan.",
        "Ya, keluar"
      );
      if (!ok) return;
    }
    state.token++;
    state.session = null;
    show(target);
  }

  // ---------- permainan ----------
  function startSession() {
    state.token++;
    state.session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      player: playerName(),
      startedAt: new Date().toISOString(),
      stages: stagesNow(),
      records: [],
      index: 0,
      phase: "ready",
      finished: false,
    };
    store.set("ab.player", state.session.player);
    $("#hero-name").textContent = state.session.player;
    renderDots();
    renderLog();
    renderStage();
    show("game");
    $("#btn-attack").focus();
  }

  function renderDots() {
    const s = state.session;
    $("#stage-dots").innerHTML = s.stages
      .map((st, i) => {
        const rec = s.records[i];
        let cls = "dot";
        let label = "Tahap " + st.id;
        if (rec) {
          cls += rec.x ? " is-win" : " is-lose";
          label += rec.x ? ": menang" : ": kalah";
        } else if (i === s.index) {
          cls += " is-current";
          label += ": sedang dimainkan";
        }
        return `<li class="${cls}" aria-label="${label}"><span>${st.id}</span></li>`;
      })
      .join("");
    const w = s.records.filter((r) => r.x === 1).length;
    $("#tally-win").textContent = "Menang " + w;
    $("#tally-lose").textContent = "Kalah " + (s.records.length - w);
  }

  function renderLog() {
    const s = state.session;
    $("#log-rows").innerHTML = s.stages
      .map((st, i) => {
        const r = s.records[i];
        const res = r ? (r.x ? '<span class="tag tag-win">Menang</span>' : '<span class="tag tag-lose">Kalah</span>') : '<span class="muted">-</span>';
        return `<tr class="${i === s.index && !r ? "is-current" : ""}"><td>${st.id}</td><td>${escapeHtml(st.kondisi)}</td><td>${B.fmtP(st.p)}</td><td>${B.fmtP(B.complement(st.p))}</td><td>${res}</td><td>${r ? r.x : ""}</td></tr>`;
      })
      .join("");
  }

  function setWheel(p) {
    const r = 70;
    const c = 2 * Math.PI * r;
    const win = $("#wheel-win");
    const lose = $("#wheel-lose");
    win.setAttribute("stroke-dasharray", `${(c * p) / 100} ${c}`);
    lose.setAttribute("stroke-dasharray", `${c} 0`);
    // garis batas di U = p
    const ang = (p / 100) * 2 * Math.PI;
    const x1 = 100 + 52 * Math.sin(ang);
    const y1 = 100 - 52 * Math.cos(ang);
    const x2 = 100 + 88 * Math.sin(ang);
    const y2 = 100 - 88 * Math.cos(ang);
    const lx = 100 + 104 * Math.sin(ang);
    const ly = 100 - 104 * Math.cos(ang);
    $("#wheel-ticks").innerHTML =
      `<line x1="100" y1="52" x2="100" y2="12" class="wheel-tick"/>` +
      `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" class="wheel-tick"/>` +
      `<text x="${lx.toFixed(2)}" y="${(ly + 4).toFixed(2)}" class="wheel-plabel">${B.fmtP(p)}</text>`;
  }

  function setNeedle(deg, animate) {
    const n = $("#needle");
    n.style.transition = animate ? `transform ${SPIN_MS}ms cubic-bezier(.12,.75,.18,1)` : "none";
    n.style.transform = `rotate(${deg}deg)`;
  }

  function renderStage() {
    const s = state.session;
    const st = s.stages[s.index];
    s.phase = "ready";
    const scene = $("#scene");
    scene.dataset.theme = st.theme;
    scene.classList.remove("hit-win", "hit-lose", "attacking");
    $("#scene-bg").innerHTML = Art.background(st.theme);
    $("#hero-sprite").innerHTML = Art.hero(st.gear);
    $("#enemy-sprite").innerHTML = Art.enemy(st.enemy);
    $("#enemy-name").textContent = st.musuh;
    $("#scene-stage").textContent = "Tahap " + st.id;
    $("#scene-location").textContent = st.lokasi;
    $("#stage-eyebrow").textContent = `Tahap ${st.id} dari ${s.stages.length} · ${st.lokasi}`;
    $("#stage-title").textContent = st.kondisi;
    $("#stage-story").textContent = st.cerita;
    $("#chip-p").textContent = B.fmtP(st.p);
    $("#chip-q").textContent = B.fmtP(B.complement(st.p));
    $("#stage-notation").textContent = `X${sub(st.id)} ~ Bernoulli(${B.fmtP(st.p)})`;
    setWheel(st.p);
    setNeedle(0, false);
    void $("#needle").getBoundingClientRect(); // paksa reflow agar reset tidak ikut beranimasi
    const btn = $("#btn-attack");
    btn.disabled = false;
    btn.hidden = false;
    $("#result").hidden = true;
    $("#result").className = "result";
    renderDots();
    renderLog();
  }

  function attack() {
    const s = state.session;
    if (!s || s.phase !== "ready") return; // cegah klik ganda
    s.phase = "spinning";
    const st = s.stages[s.index];
    const btn = $("#btn-attack");
    btn.disabled = true;
    const draw = B.trial(st.p);
    const turns = reduceMotion ? 0 : 4;
    setNeedle(turns * 360 + draw.u * 360, true);
    $("#scene").classList.add("attacking");
    sfx.spin();
    const token = state.token;
    setTimeout(() => {
      if (token !== state.token || state.session !== s) return; // sesi sudah ditinggalkan
      resolve(st, draw);
    }, SPIN_MS + 80);
  }

  function resolve(st, draw) {
    const s = state.session;
    s.records.push({ stageId: st.id, kondisi: st.kondisi, p: st.p, x: draw.x, u: draw.u });
    s.phase = "result";
    const scene = $("#scene");
    scene.classList.remove("attacking");
    scene.classList.add(draw.x ? "hit-win" : "hit-lose");
    draw.x ? sfx.win() : sfx.lose();

    const last = s.index === s.stages.length - 1;
    const res = $("#result");
    res.className = "result " + (draw.x ? "is-win" : "is-lose");
    $("#result-title").textContent = draw.x
      ? `Menang! ${st.musuh} berhasil dikalahkan.`
      : `Kalah! ${st.musuh} terlalu kuat kali ini.`;
    $("#res-u").textContent = `U = ${B.fmtU(draw.u)} ${draw.x ? "<" : "≥"} p = ${B.fmtP(st.p)}`;
    $("#res-x").textContent = draw.x ? "Menang, X = 1" : "Kalah, X = 0";
    $("#res-pmf").textContent = `P(X = ${draw.x}) = ${B.pmfText(st.p, draw.x)}`;
    $("#res-e").textContent = `E(X) = p = ${B.fmtP(st.p)}`;
    $("#res-var").textContent = `Var(X) = ${B.varianceText(st.p)}`;
    $("#btn-next").textContent = last ? "Lihat hasil akhir" : `Lanjut ke Tahap ${st.id + 1}`;
    $("#btn-attack").hidden = true;
    res.hidden = false;
    renderDots();
    renderLog();
    $("#btn-next").focus();
  }

  function next() {
    const s = state.session;
    if (!s || s.phase !== "result") return;
    if (s.index < s.stages.length - 1) {
      s.index++;
      renderStage();
      $("#btn-attack").focus();
      return;
    }
    finish();
  }

  function finish() {
    const s = state.session;
    s.finished = true;
    s.phase = "done";
    const entry = {
      id: s.id,
      player: s.player,
      startedAt: s.startedAt,
      finishedAt: new Date().toISOString(),
      records: s.records.map((r) => ({ stageId: r.stageId, kondisi: r.kondisi, p: r.p, x: r.x, u: r.u })),
    };
    state.history = [entry, ...state.history.filter((h) => h.id !== entry.id)].slice(0, HISTORY_MAX);
    store.set("ab.history", state.history);
    state.report = entry;
    sfx.fanfare();
    renderReport(entry);
    state.session = null;
    show("summary");
  }

  // ---------- laporan hasil akhir ----------
  function joinList(items) {
    if (items.length <= 1) return items.join("");
    return items.slice(0, -1).join(", ") + " dan " + items[items.length - 1];
  }

  function conclusionText(entry, a) {
    const recs = entry.records;
    const name = escapeHtml(entry.player);
    const parts = [];
    const pct = B.percentText(a.seqNum, a.seqDigits);
    const factors = recs.map((r) => B.fmtP(B.pmf(r.p, r.x))).join(" × ");
    parts.push(
      `<p>${name} menang <strong>${a.wins}</strong> kali dan kalah <strong>${a.losses}</strong> kali. ` +
        `Peluang mendapatkan urutan hasil persis seperti ini adalah ${factors} = <strong>${B.fmtScaled(a.seqNum, a.seqDigits)}</strong> ` +
        `(${pct.exact ? "atau" : "sekitar"} ${pct.text}), dihitung dengan perkalian karena hasil satu tahap tidak memengaruhi tahap lain.</p>`
    );

    const eText = recs.map((r) => B.fmtP(r.p)).join(" + ");
    const E = a.expectedNum / 100;
    let cmp;
    let tail;
    if (Math.abs(a.wins - E) < 0.5) {
      cmp = `Menang ${a.wins} kali berarti hasilmu dekat dengan nilai harapan.`;
      tail = "";
    } else if (a.wins > E) {
      const t = B.percentText(a.probGeq, a.distDigits);
      cmp = `Menang ${a.wins} kali berarti lebih beruntung dari rata-rata`;
      tail = `Peluang menang ${a.wins} kali atau lebih adalah P(W ≥ ${a.wins}) = ${B.fmtScaled(a.probGeq, a.distDigits)} (${t.exact ? "" : "sekitar "}${t.text}), ` +
        (a.probGeq * 20 >= 10 ** a.distDigits ? "jadi hasil ini masih wajar karena hasil Bernoulli bersifat acak." : "jadi hasil ini tergolong jarang (di bawah 5%), tetapi tetap mungkin terjadi.");
      cmp += ".";
    } else {
      const t = B.percentText(a.probLeq, a.distDigits);
      cmp = `Menang ${a.wins} kali berarti kurang beruntung dibanding rata-rata.`;
      tail = `Peluang menang ${a.wins} kali atau kurang adalah P(W ≤ ${a.wins}) = ${B.fmtScaled(a.probLeq, a.distDigits)} (${t.exact ? "" : "sekitar "}${t.text}), ` +
        (a.probLeq * 20 >= 10 ** a.distDigits ? "jadi hasil ini masih wajar karena hasil Bernoulli bersifat acak." : "jadi hasil ini tergolong jarang (di bawah 5%), tetapi tetap mungkin terjadi.");
    }
    parts.push(
      `<p>Jumlah menang yang diharapkan adalah ${eText} = <strong>${B.fmtScaled(a.expectedNum, 2)}</strong>. ${cmp} ${tail}</p>`
    );

    const lowWins = recs.filter((r) => r.x === 1 && r.p < 50).map((r) => `tahap ${r.stageId} (p = ${B.fmtP(r.p)})`);
    const highLoss = recs.filter((r) => r.x === 0 && r.p >= 50).map((r) => `tahap ${r.stageId} (p = ${B.fmtP(r.p)})`);
    const obs = [];
    if (lowWins.length) obs.push(`kemenangan di ${joinList(lowWins)} menunjukkan bahwa peluang kecil tidak berarti pasti kalah`);
    if (highLoss.length) obs.push(`kekalahan di ${joinList(highLoss)} menunjukkan bahwa peluang setengah atau lebih tidak berarti pasti menang`);
    if (obs.length) {
      const sentence = obs.join(", dan ");
      parts.push(`<p>${sentence.charAt(0).toUpperCase() + sentence.slice(1)}. Satu percobaan Bernoulli hanya memberi satu hasil, bukan cerminan langsung dari p.</p>`);
    } else {
      parts.push(
        `<p>Pada sesi ini setiap tahap dengan p ≥ 0,5 dimenangkan dan setiap tahap dengan p &lt; 0,5 kalah. Itu pun kebetulan: satu percobaan Bernoulli hanya memberi satu hasil, bukan cerminan langsung dari p. Jika dimainkan ulang, urutannya bisa berbeda.</p>`
      );
    }

    if (a.allSame) {
      parts.push(
        `<p class="note"><strong>Catatan:</strong> semua tahap memakai p yang sama (${B.fmtP(recs[0].p)}) dan saling bebas, sehingga jumlah menang W berdistribusi binomial, W ~ Binomial(${a.n}; ${B.fmtP(recs[0].p)}).</p>`
      );
    } else {
      parts.push(
        `<p class="note"><strong>Catatan:</strong> jumlah menang dari ${a.n} tahap ini <strong>bukan</strong> distribusi binomial, karena peluang menang tiap tahap berbeda. Distribusinya adalah Poisson-binomial (lihat grafik di bawah).</p>`
      );
    }
    return parts.join("");
  }

  function distChart(a, highlight, sim) {
    // Grafik batang distribusi W. sim (opsional): frekuensi relatif hasil simulasi (array 0..1).
    const n = a.dist.length;
    const den = 10 ** a.distDigits;
    const probs = a.dist.map((v) => v / den);
    const maxV = Math.max(...probs, ...(sim || [0])) || 1;
    const W = 520;
    const H = 230;
    const padL = 44;
    const padB = 34;
    const padT = 16;
    const plotW = W - padL - 10;
    const plotH = H - padB - padT;
    const band = plotW / n;
    const barW = sim ? Math.min(30, band * 0.34) : Math.min(46, band * 0.55);
    const yMax = Math.ceil((maxV * 10) + 0.0001) / 10;
    const y = (v) => padT + plotH - (v / yMax) * plotH;
    let grid = "";
    for (let t = 0; t <= yMax + 1e-9; t += yMax > 0.5 ? 0.2 : 0.1) {
      const yy = y(t).toFixed(1);
      grid += `<line x1="${padL}" x2="${W - 10}" y1="${yy}" y2="${yy}" class="grid"/><text x="${padL - 6}" y="${(+yy + 4).toFixed(1)}" class="axis" text-anchor="end">${t.toFixed(1).replace(".", ",")}</text>`;
    }
    let bars = "";
    for (let k = 0; k < n; k++) {
      const cx = padL + band * k + band / 2;
      const th = probs[k];
      const thX = sim ? cx - barW - 1 : cx - barW / 2;
      const tip = `W = ${k}: peluang teoretis ${B.fmtRounded(a.dist[k], a.distDigits, 4)}`;
      bars += `<g class="bar-g${k === highlight ? " is-hl" : ""}"><title>${tip}${sim ? `; frekuensi relatif simulasi ${sim[k].toFixed(4).replace(".", ",")}` : ""}</title>
        <rect x="${(cx - band / 2).toFixed(1)}" y="${padT}" width="${band.toFixed(1)}" height="${plotH}" class="hit"/>
        <path d="${barPath(thX, y(th), barW, y(0))}" class="bar bar-th"/>`;
      if (sim) bars += `<path d="${barPath(cx + 1, y(sim[k]), barW, y(0))}" class="bar bar-sim"/>`;
      if (!sim) bars += `<text x="${cx.toFixed(1)}" y="${(y(th) - 5).toFixed(1)}" class="val" text-anchor="middle">${B.fmtRounded(a.dist[k], a.distDigits, 3)}</text>`;
      bars += `<text x="${cx.toFixed(1)}" y="${H - padB + 16}" class="axis" text-anchor="middle">${k}</text></g>`;
      if (k === highlight) bars += `<text x="${cx.toFixed(1)}" y="${H - 4}" class="axis hl" text-anchor="middle">hasilmu</text>`;
    }
    const legend = sim
      ? `<div class="legend"><span><i class="sw sw-th"></i>Peluang teoretis</span><span><i class="sw sw-sim"></i>Frekuensi relatif simulasi</span></div>`
      : "";
    return `<figure class="chart">${legend}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik distribusi jumlah menang W">
      ${grid}<line x1="${padL}" x2="${W - 10}" y1="${y(0)}" y2="${y(0)}" class="baseline"/>${bars}
      <text x="${W - 10}" y="${H - padB + 16}" class="axis" text-anchor="end">W</text></svg>
      <figcaption>Distribusi jumlah menang W = X₁ + … + X${sub(a.n)} (sumbu tegak: peluang).</figcaption></figure>`;
  }

  function barPath(x, yTop, w, yBase) {
    const h = yBase - yTop;
    if (h <= 0.5) return `M${x.toFixed(1)} ${yBase.toFixed(1)} h${w.toFixed(1)}`;
    const r = Math.min(4, h, w / 2);
    return `M${x.toFixed(1)} ${yBase.toFixed(1)} V${(yTop + r).toFixed(1)} Q${x.toFixed(1)} ${yTop.toFixed(1)} ${(x + r).toFixed(1)} ${yTop.toFixed(1)} H${(x + w - r).toFixed(1)} Q${(x + w).toFixed(1)} ${yTop.toFixed(1)} ${(x + w).toFixed(1)} ${(yTop + r).toFixed(1)} V${yBase.toFixed(1)} Z`;
  }

  function distTable(a, highlight) {
    const rows = a.dist
      .map((v, k) => `<tr class="${k === highlight ? "is-hl" : ""}"><td>${k}</td><td>${B.fmtScaled(v, a.distDigits)}</td></tr>`)
      .join("");
    return `<details class="dist-table"><summary>Tabel peluang eksak P(W = k)</summary><table class="data-table compact"><thead><tr><th>k</th><th>P(W = k)</th></tr></thead><tbody>${rows}</tbody></table></details>`;
  }

  function renderReport(entry) {
    const recs = entry.records;
    const a = B.analyze(recs);
    const date = new Date(entry.finishedAt || entry.startedAt);
    const dateText = isNaN(date) ? "" : date.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

    const sheet = recs
      .map(
        (r) =>
          `<tr><td>${r.stageId}</td><td>${escapeHtml(r.kondisi)}</td><td>${B.fmtP(r.p)}</td><td>${B.fmtP(B.complement(r.p))}</td><td>${r.x ? '<span class="tag tag-win">Menang</span>' : '<span class="tag tag-lose">Kalah</span>'}</td><td>${r.x}</td></tr>`
      )
      .join("");

    const dists = recs.map((r) => `X${sub(r.stageId)} ~ Bernoulli(${B.fmtP(r.p)})`).join(", ");

    const perStage = recs
      .map(
        (r) =>
          `<tr><td>${r.stageId}</td><td>X=${r.x}</td><td>${B.pmfText(r.p, r.x)}</td><td>${B.fmtP(r.p)}</td><td>${B.varianceText(r.p)}</td></tr>`
      )
      .join("");

    $("#report").innerHTML = `
      <header class="report-head">
        <h1 id="summary-title" class="report-title">Adventure Bernoulli: Catatan dan Analisis</h1>
        <p class="muted">Pemain: <strong>${escapeHtml(entry.player)}</strong>${dateText ? " · " + dateText : ""}</p>
        <p class="muted small">Satu sesi permainan (${a.n} tahap). Hasil menang-kalah berasal dari undian simulasi komputer, bukan data siswa sebenarnya.</p>
      </header>

      <section class="report-sec">
        <h3>1. Lembar catatan</h3>
        <div class="table-scroll"><table class="data-table">
          <thead><tr><th>Tahap</th><th>Kondisi</th><th>p (menang)</th><th>1 − p (kalah)</th><th>Hasil</th><th>X</th></tr></thead>
          <tbody>${sheet}</tbody>
        </table></div>
      </section>

      <section class="report-sec">
        <h3>2. Letak Bernoulli</h3>
        <p>Setiap tahap adalah satu percobaan Bernoulli karena dilakukan satu kali dan hasilnya hanya dua: menang (X = 1) atau kalah (X = 0). ${
          a.allSame ? "Karena p tiap tahap sama, setiap tahap mengikuti distribusi Bernoulli yang sama" : "Karena p tiap tahap berbeda, setiap tahap punya distribusi Bernoulli sendiri"
        }: ${dists}.</p>
      </section>

      <section class="report-sec">
        <h3>3. Hasil Bernoulli tiap tahap</h3>
        <p>Fungsi peluang: P(X = x) = p<sup>x</sup>(1 − p)<sup>1−x</sup> untuk x = 0 atau 1, dengan E(X) = p dan Var(X) = p(1 − p).</p>
        <div class="table-scroll"><table class="data-table">
          <thead><tr><th>Tahap</th><th>Hasil</th><th>Peluang hasil</th><th>E(X)</th><th>Var(X)</th></tr></thead>
          <tbody>${perStage}</tbody>
        </table></div>
      </section>

      <section class="report-sec">
        <h3>4. Kesimpulan dari satu sesi</h3>
        ${conclusionText(entry, a)}
      </section>

      <section class="report-sec">
        <h3>5. Distribusi jumlah menang</h3>
        <p>E(W) = ${B.fmtScaled(a.expectedNum, 2)} dan Var(W) = Σ p(1 − p) = ${B.fmtScaled(a.varNum, 4)}. Batang yang disorot adalah jumlah menang pada sesi ini (W = ${a.wins}), dengan P(W = ${a.wins}) = ${B.fmtScaled(a.probExact, a.distDigits)}.</p>
        ${distChart(a, a.wins)}
        ${distTable(a, a.wins)}
      </section>`;
  }

  function downloadCsv() {
    const entry = state.report;
    if (!entry) return;
    const a = B.analyze(entry.records);
    const lines = [
      ["Pemain", entry.player],
      ["Waktu", entry.finishedAt || entry.startedAt],
      [],
      ["Tahap", "Kondisi", "p (menang)", "1-p (kalah)", "Hasil", "X", "U (bilangan acak)", "P(X=x)", "E(X)", "Var(X)"],
      ...entry.records.map((r) => [
        r.stageId,
        r.kondisi,
        B.fmtP(r.p),
        B.fmtP(B.complement(r.p)),
        r.x ? "Menang" : "Kalah",
        r.x,
        typeof r.u === "number" ? r.u.toFixed(6).replace(".", ",") : "",
        B.fmtP(B.pmf(r.p, r.x)),
        B.fmtP(r.p),
        B.fmtScaled(B.variance(r.p), 4),
      ]),
      [],
      ["Jumlah menang", a.wins],
      ["Peluang urutan hasil", B.fmtScaled(a.seqNum, a.seqDigits)],
      ["Jumlah menang yang diharapkan", B.fmtScaled(a.expectedNum, 2)],
    ];
    // Pemisah titik koma agar desimal berkoma terbaca benar di Excel berbahasa Indonesia.
    const csv = lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safe = entry.player.replace(/[^\w-]+/g, "_").slice(0, 30) || "pemain";
    link.href = url;
    link.download = `adventure-bernoulli-${safe}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- halaman pendukung ----------
  function renderHowto() {
    $("#howto-stage-rows").innerHTML = stagesNow()
      .map((s) => `<tr><td>${s.id}</td><td>${s.lokasi}</td><td>${s.kondisi}</td><td>${B.fmtP(s.p)}</td><td>${B.fmtP(B.complement(s.p))}</td></tr>`)
      .join("");
  }

  function renderSettings() {
    $("#settings-stage-fields").innerHTML = stagesNow()
      .map(
        (s, i) => `<label class="field" for="p-${i}"><span>Tahap ${s.id}: ${s.kondisi}</span>
          <input id="p-${i}" name="p-${i}" type="text" inputmode="decimal" value="${B.fmtP(s.p)}" aria-describedby="settings-msg"></label>`
      )
      .join("");
    $("#settings-msg").textContent = "";
    $("#settings-msg").className = "form-msg";
    syncSoundUi();
  }

  function parseP(text) {
    const t = String(text).trim().replace(",", ".");
    if (!/^0?\.\d{1,2}$|^0$|^1$/.test(t)) return null;
    return B.clampP(Number(t) * 100);
  }

  function saveSettings(ev) {
    ev.preventDefault();
    const vals = [];
    const msg = $("#settings-msg");
    for (let i = 0; i < B.DEFAULT_STAGES.length; i++) {
      const input = $("#p-" + i);
      const v = parseP(input.value);
      input.setAttribute("aria-invalid", v === null ? "true" : "false");
      if (v === null) {
        msg.textContent = `Nilai p tahap ${i + 1} tidak valid. Gunakan angka 0,01 sampai 0,99 dengan paling banyak dua desimal.`;
        msg.className = "form-msg is-error";
        input.focus();
        return;
      }
      vals.push(v);
    }
    state.ps = vals;
    state.sound = $("#sound-toggle").checked;
    store.set("ab.p", vals);
    store.set("ab.sound", state.sound);
    syncSoundUi();
    renderSettings();
    msg.textContent = "Pengaturan tersimpan. Berlaku untuk sesi berikutnya.";
    msg.className = "form-msg is-ok";
  }

  function resetSettings() {
    state.ps = B.DEFAULT_STAGES.map((s) => s.p);
    store.set("ab.p", state.ps);
    renderSettings();
    $("#settings-msg").textContent = "Peluang dikembalikan ke nilai bawaan (0,5; 0,6; 0,7; 0,5; 0,4).";
    $("#settings-msg").className = "form-msg is-ok";
  }

  function renderHistory() {
    const list = $("#history-list");
    if (!state.history.length) {
      list.innerHTML = `<p class="empty">Belum ada sesi yang selesai. Mainkan satu petualangan sampai tahap 5 untuk mengisi riwayat.</p>`;
      return;
    }
    list.innerHTML =
      `<div class="table-scroll"><table class="data-table"><thead><tr><th>Waktu</th><th>Pemain</th><th>Urutan hasil</th><th>Menang</th><th>Peluang urutan</th><th></th></tr></thead><tbody>` +
      state.history
        .map((h) => {
          const a = B.analyze(h.records);
          const d = new Date(h.finishedAt || h.startedAt);
          const seq = h.records.map((r) => `<span class="tag ${r.x ? "tag-win" : "tag-lose"}" title="Tahap ${r.stageId}">${r.x ? "M" : "K"}</span>`).join("");
          return `<tr><td>${isNaN(d) ? "-" : d.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</td><td>${escapeHtml(h.player)}</td><td class="seq">${seq}</td><td>${a.wins} / ${a.n}</td><td>${B.fmtScaled(a.seqNum, a.seqDigits)}</td><td><button class="btn btn-sm" data-action="open-history" data-id="${escapeHtml(h.id)}">Lihat</button></td></tr>`;
        })
        .join("") +
      `</tbody></table></div>`;
  }

  // ---------- lab simulasi ----------
  function runLab() {
    const n = parseInt($("#lab-n").value, 10);
    const ps = state.ps.slice();
    const k = ps.length;
    const token = ++state.labToken;
    const stageWins = new Array(k).fill(0);
    const hist = new Array(k + 1).fill(0);
    let done = 0;
    const btn = document.querySelector('[data-action="lab-run"]');
    btn.disabled = true;
    $("#lab-output").innerHTML = "";
    const status = $("#lab-status");
    const CHUNK = 5000;
    const thresholds = ps.map((p) => p * 4294967296); // menang jika u32*100 < p*2^32

    function step() {
      if (token !== state.labToken) {
        btn.disabled = false;
        return;
      }
      const m = Math.min(CHUNK, n - done);
      const buf = new Uint32Array(m * k);
      // getRandomValues dibatasi 65.536 byte per panggilan, jadi diisi per potongan.
      for (let off = 0; off < buf.length; off += 16384) {
        crypto.getRandomValues(buf.subarray(off, Math.min(off + 16384, buf.length)));
      }
      for (let s = 0; s < m; s++) {
        let w = 0;
        for (let j = 0; j < k; j++) {
          if (buf[s * k + j] * 100 < thresholds[j]) {
            stageWins[j]++;
            w++;
          }
        }
        hist[w]++;
      }
      done += m;
      status.textContent = `Memproses ${done.toLocaleString("id-ID")} dari ${n.toLocaleString("id-ID")} sesi…`;
      if (done < n) setTimeout(step, 0);
      else {
        btn.disabled = false;
        status.textContent = `Selesai: ${n.toLocaleString("id-ID")} sesi disimulasikan dengan p saat ini.`;
        renderLab(n, ps, stageWins, hist);
      }
    }
    step();
  }

  function renderLab(n, ps, stageWins, hist) {
    const a = B.analyze(ps.map((p) => ({ p, x: 0 })));
    const rel = hist.map((h) => h / n);
    let mean = 0;
    hist.forEach((h, w) => (mean += h * w));
    mean /= n;
    let ss = 0;
    hist.forEach((h, w) => (ss += h * (w - mean) ** 2));
    const sampleVar = n > 1 ? ss / (n - 1) : NaN;
    const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d).replace(".", ",") : "-");
    const stageRows = ps
      .map((p, i) => {
        const f = stageWins[i] / n;
        return `<tr><td>${i + 1}</td><td>${B.DEFAULT_STAGES[i].kondisi}</td><td>${B.fmtP(p)}</td><td>${stageWins[i].toLocaleString("id-ID")}</td><td>${fmt(f)}</td><td>${(f - p / 100 >= 0 ? "+" : "") + fmt(f - p / 100)}</td></tr>`;
      })
      .join("");
    const distRows = a.dist
      .map((v, k) => `<tr><td>${k}</td><td>${B.fmtRounded(v, a.distDigits, 4)}</td><td>${hist[k].toLocaleString("id-ID")}</td><td>${fmt(rel[k])}</td></tr>`)
      .join("");
    $("#lab-output").innerHTML = `
      <h3>Frekuensi relatif menang tiap tahap</h3>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>Tahap</th><th>Kondisi</th><th>p</th><th>Banyak menang</th><th>Frekuensi relatif</th><th>Selisih dengan p</th></tr></thead><tbody>${stageRows}</tbody></table></div>
      <h3>Jumlah menang per sesi (W)</h3>
      <div class="stat-row">
        <div class="stat"><span class="stat-label">Rata-rata W simulasi</span><span class="stat-val">${fmt(mean)}</span><span class="stat-sub">E(W) teoretis = ${B.fmtScaled(a.expectedNum, 2)}</span></div>
        <div class="stat"><span class="stat-label">Varians sampel W</span><span class="stat-val">${fmt(sampleVar)}</span><span class="stat-sub">Var(W) teoretis = ${B.fmtScaled(a.varNum, 4)}</span></div>
      </div>
      ${distChart(a, -1, rel)}
      <div class="table-scroll"><table class="data-table compact"><thead><tr><th>k</th><th>P(W = k) teoretis</th><th>Banyak sesi</th><th>Frekuensi relatif</th></tr></thead><tbody>${distRows}</tbody></table></div>
      <p class="muted small">Semakin besar jumlah sesi, frekuensi relatif cenderung makin dekat ke peluang teoretis (hukum bilangan besar). Dengan sedikit sesi, selisihnya bisa besar.</p>`;
  }

  // ---------- event ----------
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go],[data-action]");
    if (!el || el.disabled) return;
    const go = el.dataset.go;
    const action = el.dataset.action;
    if (go) {
      sfx.click();
      if (state.screen === "game") leaveGame(go);
      else show(go);
      return;
    }
    switch (action) {
      case "start":
        sfx.click();
        startSession();
        break;
      case "attack":
        attack();
        break;
      case "next":
        sfx.click();
        next();
        break;
      case "quit":
        leaveGame("menu");
        break;
      case "print":
        window.print();
        break;
      case "csv":
        downloadCsv();
        break;
      case "toggle-sound":
        state.sound = !state.sound;
        store.set("ab.sound", state.sound);
        syncSoundUi();
        sfx.click();
        break;
      case "reset-settings":
        resetSettings();
        break;
      case "clear-history":
        if (!state.history.length) return;
        confirmDialog("Hapus semua riwayat?", "Semua sesi yang tersimpan di browser ini akan dihapus.", "Ya, hapus").then((ok) => {
          if (!ok) return;
          state.history = [];
          store.set("ab.history", []);
          renderHistory();
        });
        break;
      case "open-history": {
        const h = state.history.find((x) => x.id === el.dataset.id);
        if (h) {
          state.report = h;
          renderReport(h);
          show("summary");
        }
        break;
      }
      case "lab-run":
        runLab();
        break;
    }
  });

  $("#settings-form").addEventListener("submit", saveSettings);
  // Tabel distribusi berada di <details>; buka saat dicetak agar ikut tercetak.
  window.addEventListener("beforeprint", () => document.querySelectorAll("#report details").forEach((d) => (d.open = true)));
  $("#player-name").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      startSession();
    }
  });

  // ---------- inisialisasi ----------
  $("#player-name").value = store.get("ab.player", "") || "";
  syncSoundUi();
  renderHowto();

  // Kait untuk pengujian otomatis (tidak dipakai saat bermain biasa).
  window.__AB__ = { state, B };
})();
