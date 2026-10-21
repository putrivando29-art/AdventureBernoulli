// Alur 5 tahap: pilih karakter, pembuka tahap, hack and slash, Serangan Penentu, kebangkitan,
// hasil tahap, fitur berhenti, dan rekap. Nilai p SELALU dibaca dari CONFIG; tidak ada jalur lain.
import * as THREE from "three";
import { CONFIG } from "./config.js";
import { createArena } from "./arena.js";
import { Player } from "./player.js";
import { Boss } from "./boss.js";
import { Mystic } from "./mystic.js";
import { Combat } from "./combat.js";
import { Controls } from "./controls.js";
import * as ui from "./ui.js";
import { buildRecapPdf, pdfFileName, REFLECTION } from "./pdf.js";
import { sfx, setMuted, isMuted } from "./audio.js";

const B = window.Bernoulli;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const PLAYER_START = new THREE.Vector3(0, 0, 7);
const BOSS_START = new THREE.Vector3(0, 0, -3);
const LOOK_LABEL = {
  gender: { laki: "Laki-laki", perempuan: "Perempuan" },
  shirt: { biru: "baju biru", merah: "baju merah", hijau: "baju hijau", ungu: "baju ungu" },
  hair: { hitam: "rambut hitam", cokelat: "rambut cokelat", pirang: "rambut pirang" },
};

export class Adventure {
  constructor(engine, student) {
    this.engine = engine;
    this.student = student;
    this.look = { gender: "laki", shirt: "biru", hair: "hitam" };
    this.phase = "char"; // char | intro | fight | paused | decisive | revive | result | recap
    this.index = 0;
    // Satu catatan per tahap. x = null berarti belum/tidak dimainkan (bukan kalah).
    this.records = CONFIG.stages.map((s) => ({ stageId: s.id, x: null, U: null, skipped: false }));

    const scene = engine.scene;
    this.arena = createArena(scene, engine.quality);
    this.player = new Player(this.look);
    this.boss = new Boss();
    this.mystic = new Mystic();
    scene.add(this.player.root, this.boss.root, this.mystic.root);
    this.mysticHome = new THREE.Vector3(-4.5, 0, -10.5);
    this.mystic.root.position.copy(this.mysticHome);

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

    this.bindUi();
    engine.onFrame((dt, real) => this.frame(dt, real));
    this.enterCharacterSelect();
  }

  get stage() {
    return CONFIG.stages[this.index];
  }

  // ---------- tombol ----------
  bindUi() {
    ui.$("#ov-char").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-value]");
      if (!btn) return;
      const key = btn.parentElement.dataset.choice;
      this.look[key] = btn.dataset.value;
      this.player.setLook(this.look);
      this.player.setGear(CONFIG.stages[0].gear);
      this.syncChoiceButtons();
    });
    ui.$("#btn-pick").addEventListener("click", () => this.showIntro(0));
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
    return `${LOOK_LABEL.gender[this.look.gender]}, ${LOOK_LABEL.shirt[this.look.shirt]}, ${LOOK_LABEL.hair[this.look.hair]}`;
  }

  // ---------- pilih karakter ----------
  enterCharacterSelect() {
    this.phase = "char";
    this.player.reset(new THREE.Vector3(0, 0, 4), 0);
    this.player.setGear(CONFIG.stages[0].gear);
    this.boss.root.visible = false;
    this.engine.rig.mode = "preview";
    this.syncChoiceButtons();
    ui.setHudVisible(false);
    ui.showOverlay("#ov-char");
  }

  // ---------- pembuka tahap ----------
  showIntro(i) {
    this.index = i;
    const s = this.stage;
    this.phase = "intro";
    this.controls.setEnabled(false);
    this.player.reset(PLAYER_START, Math.PI);
    this.player.setGear(s.gear);
    this.boss.root.visible = true;
    this.boss.setVariant(s.boss);
    this.boss.reset(BOSS_START, 0);
    this.boss.pose = "normal";
    this.mystic.root.position.copy(this.mysticHome);
    this.combat.reset(CONFIG.bossHitsToThreshold);
    this.engine.rig.mode = "intro";
    this.engine.rig.yaw = Math.PI;
    ui.setHudVisible(false);
    ui.resiSay(null);

    ui.$("#intro-eyebrow").textContent = `Tahap ${s.id} dari ${CONFIG.stages.length}`;
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
    this.engine.rig.mode = "follow";
    this.controls.setEnabled(true);
    this.setTouchVisible(true);
    this.refreshLockHint();
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
  }

  resume() {
    if (this.phase !== "paused") return;
    this.phase = "fight";
    ui.showOverlay(null);
    this.controls.setEnabled(true);
    this.setTouchVisible(true);
    this.refreshLockHint();
  }

  // ---------- berhenti ----------
  async requestStop() {
    // Tidak bisa berhenti saat Serangan Penentu atau kebangkitan berlangsung.
    if (!["intro", "paused", "result"].includes(this.phase)) return;
    const ok = await ui.confirmStop();
    if (!ok || !["intro", "paused", "result"].includes(this.phase)) return;
    // Tahap yang belum diundi (termasuk tahap yang sedang berjalan) dicatat "Tidak dimainkan".
    this.records.forEach((r) => {
      if (r.x === null) r.skipped = true;
    });
    this.showRecap(CONFIG.dialog.berhenti);
  }

  // ---------- Serangan Penentu ----------
  async decisive() {
    if (this.phase !== "fight") return;
    const s = this.stage;
    const rec = this.records[this.index];
    if (rec.x !== null) return; // hanya satu undian per tahap
    this.phase = "decisive";
    this.controls.setEnabled(false);
    this.setTouchVisible(false);
    ui.setLockHint(false);
    ui.setPrompt(null);
    this.boss.calm();
    this.player.attack = null;
    this.player.roll = null;
    this.player.pose = "ready";
    this.combat.clearDecal();
    const eng = this.engine;
    eng.setTimeScale(0.25); // gerak lambat
    eng.grading(0.55, 0.75); // desaturasi + vignette lebih gelap
    eng.rig.startOrbit(this.player.position, this.boss.position);
    ui.showDecisive(s.p);
    await wait(3200);

    // Satu-satunya undian tahap ini. p diambil langsung dari CONFIG.
    const roll = B.decisiveRoll(s.p);
    rec.x = roll.X;
    rec.U = roll.U;
    ui.updateHud({ records: this.records });

    eng.setTimeScale(1);
    eng.grading(0, 0.45);
    ui.showDecisiveResult(roll.X, roll.U, s.p);
    if (roll.X === 1) {
      eng.flash(0xffd36b);
      sfx.win();
      this.player.pose = "normal";
      this.player.startAttack(2, this.boss.position);
      setTimeout(() => {
        this.boss.pose = "kneel";
        this.boss.poseT = 0;
        this.boss.flash.value = 1;
        this.combat.burst(this.boss.position.clone().setY(1.5), 0xcfd8c8, 20);
        eng.rig.shake(0.5);
      }, 350);
      setTimeout(() => (this.player.pose = "victory"), 900);
    } else {
      eng.flash(0xff3b30);
      sfx.lose();
      this.boss.pose = "triumph";
      this.boss.poseT = 0;
      setTimeout(() => {
        this.player.pose = "lying";
        eng.rig.shake(0.5);
      }, 300);
    }
    await wait(2600);
    ui.hideDecisive();
    eng.rig.stopOrbit();

    if (roll.X === 0) await this.revive();
    this.phase = "result";
    ui.setHudVisible(false);
    ui.showStageResult(s, rec, this.index === CONFIG.stages.length - 1);
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
    const t0 = performance.now();
    await new Promise((resolve) => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / 1400);
        m.root.position.lerpVectors(from, target, k * k * (3 - 2 * k));
        if (k < 1) requestAnimationFrame(step);
        else resolve();
      };
      step();
    });
    // 5. shader kebangkitan: player muncul kembali dari tak terlihat (dissolve 1 -> 0, sekitar 1,5 detik)
    const pl = this.player;
    pl.setDissolve(1);
    pl.pose = "normal";
    pl.hp = 100;
    sfx.revive();
    this.engine.flash(0x4da6ff, 0.3);
    const t1 = performance.now();
    await new Promise((resolve) => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t1) / 1500);
        pl.setDissolve(1 - k);
        if (k < 1) requestAnimationFrame(step);
        else resolve();
      };
      step();
    });
    await wait(2000);
    ui.resiSay(null);
  }

  // ---------- tahap berikutnya dan rekap ----------
  next() {
    if (this.phase !== "result") return;
    if (this.index >= CONFIG.stages.length - 1) {
      this.showRecap(CONFIG.dialog.penutup);
      return;
    }
    this.showIntro(this.index + 1);
  }

  showRecap(closing) {
    this.phase = "recap";
    this.controls.setEnabled(false);
    this.setTouchVisible(false);
    ui.setHudVisible(false);
    ui.setLockHint(false);
    ui.resiSay(null);
    this.engine.rig.mode = "intro";
    this.recapData = {
      student: this.student,
      character: this.characterLabel(),
      stages: CONFIG.stages,
      records: this.records,
      closing,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      reflection: REFLECTION,
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
