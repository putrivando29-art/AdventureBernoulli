// Alur 5 tahap: pilih karakter, percakapan singkat, pembuka tahap, hack and slash (dengan ramuan),
// Serangan Penentu (dengan QTE), kebangkitan, hasil tahap, fitur berhenti, dan rekap.
// Nilai p dibaca SEKALI saat petualangan dimulai (bawaan CONFIG atau Setting Guru), dibekukan,
// dan hanya dipakai di satu undian decisiveRoll per tahap.
import * as THREE from "three";
import { CONFIG } from "./config.js";
import { createArena } from "./arena.js";
import { Player, LOOK_OPTIONS, DEFAULT_LOOK } from "./player.js";
import { Boss } from "./boss.js";
import { Mystic } from "./mystic.js";
import { Combat } from "./combat.js";
import { Controls } from "./controls.js";
import { Potions, POTION_LABEL } from "./potions.js";
import { playCutscene } from "./cutscene.js";
import { runQte, qteFeedback } from "./qte.js";
import * as ui from "./ui.js";
import { buildRecapPdf, pdfFileName, reflectionQuestions } from "./pdf.js";
import { loadPs, SOURCE_LABEL } from "./settings.js";
import { sfx, setMuted, isMuted, setMood } from "./audio.js";

const B = window.Bernoulli;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
/** Jalankan fn(k) dengan k 0..1 selama ms milidetik (waktu nyata). */
const tween = (ms, fn) =>
  new Promise((resolve) => {
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      fn(k * k * (3 - 2 * k));
      if (k < 1) requestAnimationFrame(step);
      else resolve();
    };
    step();
  });
const PLAYER_START = new THREE.Vector3(0, 0, 7);
const BOSS_START = new THREE.Vector3(0, 0, -3);
const PC = CONFIG.potions;

export class Adventure {
  constructor(engine, student) {
    this.engine = engine;
    this.student = student;
    this.look = { ...DEFAULT_LOOK };
    this.phase = "char"; // char | cutscene | intro | fight | paused | decisive | revive | result | recap
    this.index = 0;
    // Satu catatan per tahap. x = null berarti belum/tidak dimainkan (bukan kalah).
    this.records = CONFIG.stages.map((s) => ({ stageId: s.id, x: null, U: null, skipped: false }));
    // p sesi ini: diambil sekali, lalu dibekukan sampai halaman ditutup.
    const { ps, source } = loadPs();
    this.pSource = source;
    const pct = (v) => B.fmtPercent(v);
    this.stages = Object.freeze(
      CONFIG.stages.map((s, i) =>
        Object.freeze({ ...s, p: ps[i], resi: s.resi.replaceAll("{p}", pct(ps[i])).replaceAll("{q}", pct(B.complement(ps[i]))) })
      )
    );

    const scene = engine.scene;
    this.arena = createArena(scene, engine.quality);
    this.player = new Player(this.look);
    this.boss = new Boss();
    this.mystic = new Mystic();
    scene.add(this.player.root, this.boss.root, this.mystic.root);
    this.mysticHome = new THREE.Vector3(-4.5, 0, -10.5);
    this.mystic.root.position.copy(this.mysticHome);
    this.potions = new Potions(scene, PC, this.arena.colliders);

    this.controls = new Controls(engine.renderer.domElement);
    this.controls.onPause = () => this.pause();
    this.controls.onLockChange = () => this.refreshLockHint();

    this.combat = new Combat(scene, engine.camera, ui.$("#dmg-layer"), {
      onThreshold: () => this.decisive(),
      onBossHit: (pct) => {
        ui.updateHud({ bossHp: pct });
        sfx.hit();
      },
      onPlayerHit: (hp) => {
        ui.updateHud({ playerHp: hp });
        sfx.hit();
      },
      onPrompt: (text) => ui.setPrompt(text),
      shake: (a) => engine.rig.shake(a),
    });
    this.combat.particleScale = engine.quality.particles >= 300 ? 1 : 0.5;
    engine.onLowQuality(() => {
      this.combat.particleScale = 0.5;
      this.arena.reduceParticles();
    });
    this.lastAttackId = null;
    this.lastStep = 0;
    this.buffT = 0;
    this.rescueCd = 0;

    this.bindUi();
    engine.onFrame((dt, real) => this.frame(dt, real));
    this.enterCharacterSelect();
  }

  get stage() {
    return this.stages[this.index];
  }

  // ---------- tombol ----------
  bindUi() {
    ui.$("#ov-char").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-value]");
      if (!btn) return;
      const key = btn.parentElement.dataset.choice;
      const val = btn.dataset.value;
      // ganti tubuh: gaya rambut bawaan ikut menyesuaikan (masih bisa diubah)
      if (key === "gender" && ["pendek", "panjang"].includes(this.look.hairStyle)) this.look.hairStyle = val === "perempuan" ? "panjang" : "pendek";
      this.look[key] = val;
      this.player.setLook(this.look);
      this.syncChoiceButtons();
    });
    ui.$("#btn-random").addEventListener("click", () => {
      for (const [key, opt] of Object.entries(LOOK_OPTIONS)) {
        const vals = Object.keys(opt.items);
        this.look[key] = vals[Math.floor(Math.random() * vals.length)];
      }
      this.player.setLook(this.look);
      this.syncChoiceButtons();
    });
    ui.$("#btn-pick").addEventListener("click", () => this.startStage(0));
    ui.$("#btn-fight").addEventListener("click", () => this.beginFight());
    ui.$("#btn-sound").addEventListener("click", () => {
      setMuted(!isMuted());
      const b = ui.$("#btn-sound");
      b.textContent = isMuted() ? "🔇" : "🔊";
      b.setAttribute("aria-pressed", String(isMuted()));
      b.setAttribute("aria-label", isMuted() ? "Nyalakan suara" : "Matikan suara");
    });
    ui.$("#btn-stop-intro").addEventListener("click", () => this.requestStop());
    ui.$("#btn-resume").addEventListener("click", () => this.resume());
    ui.$("#btn-stop-pause").addEventListener("click", () => this.requestStop());
    ui.$("#btn-pause").addEventListener("click", () => this.pause());
    ui.$("#btn-controls").addEventListener("click", () => {
      const box = ui.$("#pause-controls");
      box.hidden = !box.hidden;
      ui.$("#btn-controls").setAttribute("aria-expanded", String(!box.hidden));
    });
    ui.$("#btn-next").addEventListener("click", () => this.next());
    ui.$("#btn-stop-result").addEventListener("click", () => this.requestStop());
    ui.$("#ov-recap").addEventListener("click", (e) => {
      if (e.target.closest("#btn-menu")) location.reload();
      if (e.target.closest("#btn-pdf")) this.downloadPdf(false);
      if (e.target.closest("#btn-pdf-open")) this.downloadPdf(true);
    });
    // Satu handler Esc: buka jeda saat bertarung, tutup jeda saat dijeda.
    // (Saat kursor terkunci, Esc melepas kunci dan jeda dibuka lewat pointerlockchange.)
    window.addEventListener("keydown", (e) => {
      if (e.code !== "Escape" || ui.$("#dlg-stop").open) return;
      if (this.phase === "fight" && !this.controls.locked) this.pause();
      else if (this.phase === "paused" && performance.now() - this.pausedAt > 250) this.resume();
    });
  }

  syncChoiceButtons() {
    ui.$("#ov-char").querySelectorAll(".choice-row").forEach((row) => {
      row.querySelectorAll("[data-value]").forEach((b) => b.setAttribute("aria-pressed", String(this.look[row.dataset.choice] === b.dataset.value)));
    });
  }

  characterLabel() {
    return ui.lookLabel(LOOK_OPTIONS, this.look);
  }

  // ---------- pilih karakter ----------
  enterCharacterSelect() {
    this.phase = "char";
    this.player.reset(new THREE.Vector3(0, 0, 4), 0);
    this.player.setGear(CONFIG.stages[0].gear);
    this.boss.root.visible = false;
    this.engine.rig.mode = "preview";
    ui.renderCharOptions(LOOK_OPTIONS, this.look);
    ui.setHudVisible(false);
    ui.showOverlay("#ov-char");
    setMood("calm");
  }

  // ---------- awal tahap: percakapan singkat lalu layar pembuka ----------
  async startStage(i) {
    this.index = i;
    const s = this.stage;
    this.phase = "cutscene";
    this.controls.setEnabled(false);
    this.setTouchVisible(false);
    this.player.reset(PLAYER_START, Math.PI);
    this.player.setGear(s.gear);
    this.player.setBuff(false);
    this.boss.root.visible = true;
    this.boss.setVariant(s.boss);
    this.boss.reset(BOSS_START, 0);
    this.boss.pose = "normal";
    this.mystic.root.position.copy(this.mysticHome);
    this.combat.reset(CONFIG.bossHitsToThreshold);
    this.potions.reset();
    ui.setHudVisible(false);
    ui.resiSay(null);
    ui.showOverlay(null);
    setMood("calm");

    const rig = this.engine.rig;
    await playCutscene(s.cutscene, {
      playerName: this.student.nama,
      playerColors: ui.lookColors(LOOK_OPTIONS, this.look),
      onLine: (line) => {
        if (line.who === "arca") rig.talk(this.boss.position, this.boss.facing, 3.0, 7.5);
        else if (line.who === "resi") rig.talk(this.mystic.root.position, this.mystic.root.rotation.y, 2.0, 4.2);
        else rig.talk(this.player.position, this.player.facing, 1.4, 3.2);
      },
    });
    this.showIntro();
  }

  showIntro() {
    const s = this.stage;
    const i = this.index;
    this.phase = "intro";
    this.engine.rig.mode = "intro";
    this.engine.rig.yaw = Math.PI;
    ui.$("#intro-eyebrow").textContent = `Tahap ${s.id} dari ${this.stages.length}`;
    ui.$("#intro-title").textContent = s.nama;
    ui.$("#intro-player").textContent = s.kondisiPlayer;
    ui.$("#intro-boss").textContent = s.kondisiBoss;
    ui.$("#intro-prob").innerHTML = ui.probBoxHtml(s.p);
    ui.$("#intro-resi").innerHTML =
      (i === 0 ? `<p>${ui.escapeHtml(CONFIG.dialog.pembuka)}</p>` : "") + `<p>${ui.escapeHtml(s.resi)}</p>`;
    // Tahap 1: daftar kontrol sesuai perangkat
    ui.$("#intro-controls").innerHTML = i === 0 ? ui.controlsHtml(this.controls.touch) : "";
    ui.$("#intro-controls").hidden = i !== 0;
    ui.showOverlay("#ov-intro");
  }

  beginFight() {
    if (this.phase !== "intro") return;
    this.phase = "fight";
    ui.showOverlay(null);
    ui.setHudVisible(true);
    ui.updateHud({ stageName: this.stage.nama, playerHp: 100, bossHp: 100, p: this.stage.p, records: this.records });
    ui.setBuffText(null);
    this.buffT = 0;
    this.rescueCd = 0;
    this.engine.rig.mode = "follow";
    this.controls.setEnabled(true);
    this.setTouchVisible(true);
    this.refreshLockHint();
    setMood("battle");
    this.engine.renderer.domElement.focus?.();
  }

  setTouchVisible(on) {
    ui.$("#touch").hidden = !(on && this.controls.touch);
  }

  refreshLockHint() {
    const c = this.controls;
    ui.setLockHint(this.phase === "fight" && !c.touch && !c.locked && !c.lockDenied);
  }

  // ---------- jeda ----------
  pause() {
    if (this.phase !== "fight") return;
    this.phase = "paused";
    this.pausedAt = performance.now();
    this.controls.setEnabled(false);
    this.setTouchVisible(false);
    ui.setLockHint(false);
    ui.setPrompt(null);
    ui.$("#pause-controls").innerHTML = ui.controlsHtml(this.controls.touch);
    ui.$("#pause-controls").hidden = true;
    ui.$("#btn-controls").setAttribute("aria-expanded", "false");
    ui.showOverlay("#ov-pause");
    setMood("calm");
  }

  resume() {
    if (this.phase !== "paused") return;
    this.phase = "fight";
    ui.showOverlay(null);
    this.controls.setEnabled(true);
    this.setTouchVisible(true);
    this.refreshLockHint();
    setMood("battle");
  }

  // ---------- berhenti ----------
  async requestStop() {
    // Tidak bisa berhenti saat percakapan, Serangan Penentu, atau kebangkitan berlangsung.
    if (!["intro", "paused", "result"].includes(this.phase)) return;
    const ok = await ui.confirmStop();
    if (!ok || !["intro", "paused", "result"].includes(this.phase)) return;
    // Tahap yang belum diundi (termasuk tahap yang sedang berjalan) dicatat "Tidak dimainkan".
    this.records.forEach((r) => {
      if (r.x === null) r.skipped = true;
    });
    this.showRecap(CONFIG.dialog.berhenti);
  }

  // ---------- ramuan dan pertolongan Resi ----------
  pickPotion(type, pos) {
    const pl = this.player;
    sfx.potion();
    if (type === "darah") {
      const before = pl.hp;
      pl.hp = Math.min(100, pl.hp + PC.heal);
      this.combat.number(pos.setY(1.6), "+" + (pl.hp - before) + " HP", "dmg-heal");
      ui.updateHud({ playerHp: pl.hp });
    } else {
      this.buffT = PC.attackDuration;
      this.combat.multiplier = PC.attackMultiplier;
      pl.setBuff(true);
      this.combat.number(pos.setY(1.6), "Serangan x" + PC.attackMultiplier, "dmg-buff");
    }
    ui.setPrompt(POTION_LABEL[type] + "!", "good");
  }

  rescue() {
    // Saat sekarat, Resi Bayang memulihkan HP agar tidak tertahan di 1.
    const pl = this.player;
    pl.hp = Math.max(pl.hp, PC.rescueHealTo);
    this.rescueCd = PC.rescueCooldown;
    ui.updateHud({ playerHp: pl.hp });
    ui.resiSay(CONFIG.dialog.tolong, 2500);
    this.combat.burst(pl.position.clone().setY(1.0), 0x5bff9a, 12);
    this.engine.flash(0x5bff9a, 0.25);
    sfx.potion();
  }

  // ---------- Serangan Penentu dengan QTE ----------
  /** Letakkan player tepat di depan boss, saling berhadapan. */
  async faceOff(dist = 2.3) {
    const bp = this.boss.position;
    const pp = this.player.position;
    let dx = pp.x - bp.x;
    let dz = pp.z - bp.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    const target = new THREE.Vector3(bp.x + dx * (this.boss.radius + dist), 0, bp.z + dz * (this.boss.radius + dist));
    const from = pp.clone();
    this.boss.facing = Math.atan2(-dx, -dz);
    this.player.facing = Math.atan2(-dx, -dz) + Math.PI;
    await tween(350, (k) => this.player.position.lerpVectors(from, target, k));
  }

  hitBoss(times, gap) {
    for (let n = 0; n < times; n++) {
      setTimeout(() => {
        this.boss.flash.value = 1;
        const p = this.boss.position.clone().setY(1.6 + Math.random() * 1.2);
        this.combat.spark(p);
        this.combat.burst(p, 0xcfd8c8, 8);
        this.engine.rig.shake(0.25);
        sfx.hit();
      }, 150 + n * gap);
    }
  }

  async decisive() {
    if (this.phase !== "fight") return;
    const s = this.stage;
    const rec = this.records[this.index];
    if (rec.x !== null) return; // hanya satu undian per tahap
    this.phase = "decisive";
    this.controls.setEnabled(false);
    this.setTouchVisible(false);
    ui.setHudVisible(false); // kotak peluang tampil di overlay Serangan Penentu
    ui.setLockHint(false);
    ui.setPrompt(null);
    ui.setBuffText(null);
    this.player.setBuff(false);
    this.combat.multiplier = 1;
    this.buffT = 0;
    this.boss.calm();
    this.player.attack = null;
    this.player.roll = null;
    this.combat.clearDecal();
    const eng = this.engine;
    const pl = this.player;
    const boss = this.boss;
    const touch = this.controls.touch;
    setMood("decisive");

    await this.faceOff();
    pl.pose = "ready";
    eng.setTimeScale(0.3); // gerak lambat
    eng.grading(0.55, 0.75); // desaturasi + vignette lebih gelap
    eng.rig.startOrbit(pl.position, boss.position);
    ui.showDecisive(s.p);
    await wait(1800);

    // QTE 1: tekan = serangan beruntun, tidak = bertahan dari sapuan
    const q1 = await runQte({ label: "Serangan Beruntun!", keyText: touch ? "KETUK" : "KLIK", mouse: !touch, codes: ["KeyJ"], ms: 1600 });
    eng.setTimeScale(1);
    eng.grading(0.2, 0.6);
    if (q1) {
      qteFeedback("Tebasan beruntun!");
      pl.pose = "normal";
      pl.startAttack(0, boss.position);
      setTimeout(() => pl.startAttack(1, boss.position), 380);
      setTimeout(() => pl.startAttack(2, boss.position), 760);
      this.hitBoss(3, 380);
    } else {
      qteFeedback("Bertahan!");
      pl.pose = "block";
      boss.playCine("sweep", () => {
        this.combat.spark(pl.position.clone().setY(1.7));
        sfx.clang();
        eng.rig.shake(0.35);
      });
    }
    await wait(1700);
    pl.pose = "ready";
    await this.faceOff();
    eng.setTimeScale(0.3);
    eng.grading(0.55, 0.75);

    // QTE 2: tekan = tebasan dari udara, tidak = berguling menghindari hantaman
    const q2 = await runQte({ label: "Lompatan!", keyText: touch ? "KETUK" : "SPACE", codes: ["Space"], ms: 1600 });
    eng.setTimeScale(1);
    eng.grading(0.2, 0.6);
    pl.pose = "normal";
    if (q2) {
      qteFeedback("Tebasan dari udara!");
      pl.vy = 8.5;
      pl.grounded = false;
      setTimeout(() => pl.startAttack(2, boss.position), 120);
      this.hitBoss(1, 0);
    } else {
      qteFeedback("Berguling menghindar!");
      boss.playCine("slam", () => {
        this.combat.burst(boss.position.clone().addScaledVector(boss.forward(), 2.4 * boss.v.scale).setY(0.2), 0x8a8578, 14);
        eng.rig.shake(0.45);
        sfx.step();
      });
      setTimeout(() => (pl.roll = { t: 0, dir: pl.facing + Math.PI / 2 }), 200);
    }
    await wait(1700);
    await this.faceOff();
    pl.pose = "ready";
    eng.setTimeScale(0.3);
    eng.grading(0.6, 0.8);

    // QTE terakhir: tampil sama untuk semua pemain. Menekan atau tidak, hasilnya tetap dari undian.
    await runQte({ label: "Serangan Terakhir!", keyText: touch ? "KETUK" : "KLIK", mouse: !touch, codes: ["KeyJ", "Space"], ms: 1500 });
    qteFeedback("Hasil ditentukan undian, bukan tombol");

    // Satu-satunya undian tahap ini. p diambil dari this.stages (dibekukan saat petualangan dimulai).
    const roll = B.decisiveRoll(s.p);
    rec.x = roll.X;
    rec.U = roll.U;
    ui.updateHud({ records: this.records });

    eng.setTimeScale(1);
    eng.grading(0, 0.45);
    if (roll.X === 1) {
      // MENANG: player menebas, arca berlutut
      pl.pose = "normal";
      const dir = pl.position.clone().sub(boss.position).setY(0).normalize();
      const to = boss.position.clone().addScaledVector(dir, boss.radius + 1.3);
      const from = pl.position.clone();
      await tween(200, (k) => pl.position.lerpVectors(from, to, k));
      pl.startAttack(2, boss.position);
      setTimeout(() => {
        boss.pose = "kneel";
        boss.poseT = 0;
        boss.flash.value = 1;
        this.combat.burst(boss.position.clone().setY(1.5), 0xcfd8c8, 24);
        this.combat.spark(boss.position.clone().setY(2));
        eng.rig.shake(0.6);
        eng.flash(0xffd36b);
        sfx.win();
        ui.showDecisiveResult(roll.X, roll.U, s.p);
      }, 330);
      setTimeout(() => (pl.pose = "victory"), 1000);
    } else {
      // KALAH: arca menghantam player
      boss.playCine("slam", () => {
        pl.pose = "lying";
        this.combat.burst(pl.position.clone().setY(0.6), 0xff6b6b, 14);
        eng.rig.shake(0.6);
        eng.flash(0xff3b30);
        sfx.lose();
        ui.showDecisiveResult(roll.X, roll.U, s.p);
        setTimeout(() => {
          boss.pose = "triumph";
          boss.poseT = 0;
        }, 500);
      }, 0.35);
    }
    await wait(3200);
    ui.hideDecisive();
    eng.rig.stopOrbit();
    setMood("calm");

    if (roll.X === 0) await this.revive();
    this.phase = "result";
    ui.setHudVisible(false);
    ui.showStageResult(s, rec, this.index === this.stages.length - 1);
  }

  /** Cutscene: Resi Bayang membangkitkan player (hanya cerita, tidak mengubah apa pun). */
  async revive() {
    this.phase = "revive";
    const p = this.player.position;
    const m = this.mystic;
    const target = new THREE.Vector3(p.x - 1.6, 0, p.z + 1.2);
    const from = m.root.position.clone();
    this.engine.rig.focusOn(p, 6.5);
    ui.resiSay(CONFIG.dialog.kalah);
    await tween(1400, (k) => m.root.position.lerpVectors(from, target, k));
    // 5. shader kebangkitan: player muncul kembali dari tak terlihat (dissolve 1 -> 0, sekitar 1,5 detik)
    const pl = this.player;
    pl.setDissolve(1);
    pl.pose = "normal";
    pl.hp = 100;
    sfx.revive();
    this.engine.flash(0x4da6ff, 0.3);
    await tween(1500, (k) => pl.setDissolve(1 - k));
    pl.setDissolve(0);
    await wait(2000);
    ui.resiSay(null);
  }

  // ---------- tahap berikutnya dan rekap ----------
  next() {
    if (this.phase !== "result") return;
    if (this.index >= this.stages.length - 1) {
      this.showRecap(CONFIG.dialog.penutup);
      return;
    }
    this.startStage(this.index + 1);
  }

  showRecap(closing) {
    this.phase = "recap";
    this.controls.setEnabled(false);
    this.setTouchVisible(false);
    ui.setHudVisible(false);
    ui.setLockHint(false);
    ui.resiSay(null);
    setMood("calm");
    this.engine.rig.mode = "intro";
    this.recapData = {
      student: this.student,
      character: this.characterLabel(),
      stages: this.stages,
      pSource: SOURCE_LABEL[this.pSource],
      records: this.records,
      closing,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      reflection: reflectionQuestions(this.stages),
    };
    ui.renderRecap(this.recapData);
  }

  /** Unduh PDF dengan doc.save; cadangan untuk HP: buka PDF di tab baru. */
  downloadPdf(openInTab) {
    const msg = ui.$("#pdf-msg");
    try {
      const doc = buildRecapPdf(this.recapData);
      if (openInTab) {
        const win = window.open(doc.output("bloburl"), "_blank");
        if (!win) throw new Error("tab baru diblokir");
      } else {
        doc.save(pdfFileName(this.student.nama));
      }
      msg.className = "form-msg txt-win";
      msg.textContent = openInTab ? "PDF dibuka di tab baru." : "PDF sedang diunduh. Jika tidak muncul, tekan Buka PDF.";
    } catch (err) {
      console.error(err);
      msg.className = "form-msg";
      msg.textContent = "PDF gagal dibuat atau diunduh. Coba tombol Buka PDF, atau izinkan pop-up untuk situs ini.";
    }
  }

  // ---------- per frame ----------
  frame(dt, real) {
    const fighting = this.phase === "fight";
    const input = fighting ? this.controls.consume() : null;
    if (input) this.engine.rig.addLook(input.look.dx, input.look.dy);
    const simulate = this.phase !== "paused";

    if (simulate) {
      this.player.update(dt, input, {
        enabled: fighting,
        cameraYaw: this.engine.rig.yaw,
        colliders: this.boss.root.visible ? [...this.arena.colliders, { x: this.boss.position.x, z: this.boss.position.z, r: this.boss.radius }] : this.arena.colliders,
        target: this.boss.position,
      });
      if (this.phase === "char") this.player.root.rotation.y += real * 0.8; // pratinjau berputar
      if (this.boss.root.visible) {
        this.boss.update(dt, {
          ai: fighting,
          player: this.player,
          colliders: this.arena.colliders,
          onTelegraph: (a) => this.combat.telegraph(a, this.boss),
          onStrike: (a) => this.combat.strike(a, this.boss, this.player),
        });
      }
      this.mystic.update(dt, this.player.position);
      this.potions.update(dt, this.player, fighting, (type, pos) => this.pickPotion(type, pos));
      if (fighting) {
        // Ramuan Serangan berakhir setelah durasinya habis
        if (this.buffT > 0) {
          this.buffT -= dt;
          if (this.buffT <= 0) {
            this.combat.multiplier = 1;
            this.player.setBuff(false);
            ui.setBuffText(null);
          } else ui.setBuffText(`Ramuan Serangan x${PC.attackMultiplier}: ${Math.ceil(this.buffT)} dtk`);
        }
        this.rescueCd -= dt;
        if (this.player.hp <= PC.rescueHpBelow && this.rescueCd <= 0) this.rescue();
      }
      // suara tebasan dan langkah boss
      const atk = this.player.attack;
      if (atk && atk.id !== this.lastAttackId) sfx.slash();
      this.lastAttackId = atk ? atk.id : null;
      const step = Math.floor(this.boss.walk / Math.PI);
      if (step !== this.lastStep) sfx.step();
      this.lastStep = step;
      this.arena.update(this.engine.time, dt);
      this.combat.update(dt, this.player, this.boss, fighting);
    }
    this.boss.flash.value = Math.max(0, this.boss.flash.value - real * 10); // kilatan putih sekitar 0,1 detik (waktu nyata)
    this.engine.rig.update(real, this.player, this.boss);
  }
}
