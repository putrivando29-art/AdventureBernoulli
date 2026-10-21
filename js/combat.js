// Interaksi pertarungan: tebasan player ke boss, serangan boss ke player, dan efek visual.
// HP boss berhenti di 20% (lalu Serangan Penentu), HP player berhenti di 1. Tidak ada yang mati di sini.
import * as THREE from "three";

const REACH = 1.7; // jangkauan pedang dari permukaan boss
const BOSS_MAX_HP = 1000;
const THRESHOLD = 0.2;
const DAMAGE = { slam: 14, sweep: 12, stomp: 10 };

export class Combat {
  constructor(scene, camera, layer, hooks) {
    this.scene = scene;
    this.camera = camera;
    this.layer = layer; // elemen HTML untuk angka kerusakan
    this.hooks = hooks; // { onThreshold, onPlayerHit, onBossHit, onPrompt, shake }
    this.numbers = [];
    this.rings = [];
    this.decal = null;
    this.buildParticles();
    this.buildTrail();
    this.buildDecals();
    this.reset(1);
  }

  reset(hitsToThreshold) {
    this.hitsToThreshold = hitsToThreshold;
    this.bossHits = 0;
    this.multiplier = 1; // Ramuan Serangan membuat tiap tebasan bernilai lebih
    this.thresholdReached = false;
    this.rings.forEach((r) => (r.mesh.visible = false));
    this.rings = [];
    this.clearDecal();
    this.numbers.forEach((n) => n.el.remove());
    this.numbers = [];
  }

  /** HP boss dalam persen (100 sampai 20). */
  get bossHpPct() {
    return 100 - (100 - THRESHOLD * 100) * Math.min(1, this.bossHits / this.hitsToThreshold);
  }

  get damagePerHit() {
    return Math.round((BOSS_MAX_HP * (1 - THRESHOLD)) / this.hitsToThreshold);
  }

  update(dt, player, boss, active) {
    if (active && !this.thresholdReached) this.checkPlayerHit(player, boss);
    if (active) this.updateRings(dt, player);
    this.updateDecal(boss);
    this.updateTrail(player);
    this.updateParticles(dt);
    this.updateNumbers(dt);
  }

  checkPlayerHit(player, boss) {
    const atk = player.activeAttack;
    if (!atk || atk.hitDone) return;
    const pp = player.position;
    const bp = boss.position;
    const dx = bp.x - pp.x;
    const dz = bp.z - pp.z;
    const dist = Math.hypot(dx, dz);
    let ang = Math.atan2(dx, dz) - player.facing;
    ang = Math.atan2(Math.sin(ang), Math.cos(ang));
    if (dist - boss.radius > REACH || Math.abs(ang) > 1.25) return;
    atk.hitDone = true;
    this.bossHits = Math.min(this.hitsToThreshold, this.bossHits + this.multiplier);
    boss.flash.value = 1;
    const hitPoint = new THREE.Vector3(pp.x + (dx / dist) * (dist - boss.radius * 0.8), 1.3 + Math.random() * 0.8, pp.z + (dz / dist) * (dist - boss.radius * 0.8));
    this.burst(hitPoint, 0xcfd8c8, 9);
    this.spark(hitPoint);
    this.number(hitPoint, String(this.damagePerHit * this.multiplier), this.multiplier > 1 ? "dmg-boss dmg-buff" : "dmg-boss");
    this.hooks.shake?.(0.12);
    this.hooks.onBossHit?.(this.bossHpPct);
    if (this.bossHits >= this.hitsToThreshold) {
      this.thresholdReached = true;
      this.hooks.onThreshold?.();
    }
  }

  hitPlayer(player, type) {
    if (player.invulnerable) return false;
    const n = DAMAGE[type];
    player.damage(n);
    const p = player.position.clone();
    p.y += 1.6;
    this.number(p, String(n), "dmg-player");
    this.burst(p.setY(1.0), 0xff6b6b, 6);
    this.hooks.shake?.(0.3);
    this.hooks.onPlayerHit?.(player.hp);
    return true;
  }

  // ---------- serangan boss ----------
  telegraph(attack, boss) {
    const prompts = { slam: "Hantaman! Menghindar", sweep: "Sapuan! Jongkok", stomp: "Hentakan! Lompat" };
    this.hooks.onPrompt?.(prompts[attack.type], attack.type);
    this.showDecal(attack, boss);
  }

  strike(attack, boss, player) {
    this.clearDecal();
    this.hooks.onPrompt?.(null);
    const s = boss.v.scale;
    const bp = boss.position;
    const fwd = boss.forward();
    const pp = player.position;
    if (attack.type === "slam") {
      const c = bp.clone().addScaledVector(fwd, 2.4 * s);
      this.burst(c.clone().setY(0.2), 0x8a8578, 14);
      this.hooks.shake?.(0.45);
      if (Math.hypot(pp.x - c.x, pp.z - c.z) < 2.2 * s + 0.35 && pp.y < 1.3) this.hitPlayer(player, "slam");
    } else if (attack.type === "sweep") {
      const dx = pp.x - bp.x;
      const dz = pp.z - bp.z;
      let ang = Math.atan2(dx, dz) - boss.facing;
      ang = Math.atan2(Math.sin(ang), Math.cos(ang));
      this.hooks.shake?.(0.2);
      if (Math.hypot(dx, dz) < 4.3 * s && Math.abs(ang) < 1.75 && !player.crouching) this.hitPlayer(player, "sweep");
    } else if (attack.type === "stomp") {
      this.hooks.shake?.(0.35);
      const mesh = this.ringPool.find((m) => !m.visible);
      if (mesh) {
        mesh.visible = true;
        mesh.position.set(bp.x, 0.06, bp.z);
        this.rings.push({ mesh, r: 1.2 * s, hit: false });
      }
    }
  }

  updateRings(dt, player) {
    const pp = player.position;
    for (const ring of this.rings) {
      ring.r += dt * 8.5;
      ring.mesh.scale.setScalar(ring.r);
      ring.mesh.material.opacity = Math.max(0, 1 - ring.r / 11);
      const d = Math.hypot(pp.x - ring.mesh.position.x, pp.z - ring.mesh.position.z);
      // gelombang kejut rendah: lolos jika sedang melompat
      if (!ring.hit && Math.abs(d - ring.r) < 0.45 && pp.y < 0.35) {
        ring.hit = true;
        this.hitPlayer(player, "stomp");
      }
      if (ring.r > 11) ring.mesh.visible = false;
    }
    this.rings = this.rings.filter((r) => r.mesh.visible);
  }

  // ---------- penanda bahaya di lantai ----------
  buildDecals() {
    const mat = () => new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 0.15, 0.1), transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    this.decals = {
      slam: new THREE.Mesh(new THREE.CircleGeometry(1, 40), mat()),
      sweep: new THREE.Mesh(new THREE.RingGeometry(0.25, 1, 40, 1, -Math.PI / 2, Math.PI), mat()),
      stomp: new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), mat()),
    };
    Object.values(this.decals).forEach((d) => {
      d.rotation.x = -Math.PI / 2;
      d.visible = false;
      d.renderOrder = 2;
      this.scene.add(d);
    });
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 0.9, 0.25), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    this.ringPool = [0, 1, 2, 3].map(() => {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 64), ringMat.clone());
      m.rotation.x = -Math.PI / 2;
      m.visible = false;
      this.scene.add(m);
      return m;
    });
  }

  showDecal(attack, boss) {
    this.clearDecal();
    this.decal = { mesh: this.decals[attack.type], attack, t: 0 };
    this.decal.mesh.visible = true;
    this.updateDecal(boss);
  }

  updateDecal(boss) {
    if (!this.decal) return;
    const { mesh, attack } = this.decal;
    const s = boss.v.scale;
    const bp = boss.position;
    const fwd = boss.forward();
    this.decal.t += 0.016;
    mesh.material.opacity = 0.3 + Math.abs(Math.sin(this.decal.t * 9)) * 0.35;
    if (attack.type === "slam") {
      mesh.position.set(bp.x + fwd.x * 2.4 * s, 0.05, bp.z + fwd.z * 2.4 * s);
      mesh.scale.setScalar(2.2 * s);
    } else if (attack.type === "sweep") {
      mesh.position.set(bp.x, 0.05, bp.z);
      mesh.scale.setScalar(4.3 * s);
      mesh.rotation.z = boss.facing - Math.PI / 2;
    } else {
      mesh.position.set(bp.x, 0.05, bp.z);
      mesh.scale.setScalar(1.6 * s + this.decal.t * 0.5);
    }
  }

  clearDecal() {
    if (this.decal) this.decal.mesh.visible = false;
    this.decal = null;
  }

  // ---------- partikel kotak dan kilatan ----------
  buildParticles() {
    this.pCount = 80;
    this.pMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), new THREE.MeshBasicMaterial(), this.pCount);
    this.pMesh.frustumCulled = false;
    this.pMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.particles = Array.from({ length: this.pCount }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler() }));
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < this.pCount; i++) {
      this.pMesh.setMatrixAt(i, hidden);
      this.pMesh.setColorAt(i, new THREE.Color(1, 1, 1));
    }
    this.scene.add(this.pMesh);
    this.sparkMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 4, 3.5), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    this.sparkMesh.visible = false;
    this.sparkLife = 0;
    this.scene.add(this.sparkMesh);
    this._m = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._s = new THREE.Vector3();
    this.particleScale = 1;
  }

  burst(pos, color, n) {
    const c = new THREE.Color(color);
    n = Math.max(2, Math.round(n * this.particleScale));
    let spawned = 0;
    for (let i = 0; i < this.pCount && spawned < n; i++) {
      const pt = this.particles[i];
      if (pt.life > 0) continue;
      pt.life = 0.6 + Math.random() * 0.3;
      pt.p.copy(pos);
      pt.v.set((Math.random() - 0.5) * 6, 2 + Math.random() * 4, (Math.random() - 0.5) * 6);
      pt.r.set(Math.random() * 3, Math.random() * 3, 0);
      this.pMesh.setColorAt(i, c);
      spawned++;
    }
    this.pMesh.instanceColor.needsUpdate = true;
  }

  spark(pos) {
    this.sparkMesh.position.copy(pos);
    this.sparkMesh.visible = true;
    this.sparkLife = 0.12;
  }

  updateParticles(dt) {
    for (let i = 0; i < this.pCount; i++) {
      const pt = this.particles[i];
      if (pt.life <= 0) continue;
      pt.life -= dt;
      pt.v.y -= 14 * dt;
      pt.p.addScaledVector(pt.v, dt);
      if (pt.p.y < 0.06) {
        pt.p.y = 0.06;
        pt.v.multiplyScalar(0.5);
        pt.v.y = Math.abs(pt.v.y) * 0.3;
      }
      pt.r.x += dt * 8;
      const sc = Math.max(0, Math.min(1, pt.life * 3));
      this._q.setFromEuler(pt.r);
      this._s.setScalar(sc);
      this._m.compose(pt.p, this._q, this._s);
      this.pMesh.setMatrixAt(i, this._m);
    }
    this.pMesh.instanceMatrix.needsUpdate = true;
    if (this.sparkLife > 0) {
      this.sparkLife -= dt;
      const k = Math.max(0, this.sparkLife / 0.12);
      this.sparkMesh.scale.setScalar(0.4 + (1 - k) * 1.6);
      this.sparkMesh.material.opacity = k;
      this.sparkMesh.rotation.y += dt * 10;
      if (this.sparkLife <= 0) this.sparkMesh.visible = false;
    }
  }

  // ---------- jejak tebasan putih ----------
  buildTrail() {
    this.trailN = 12;
    const geo = new THREE.BufferGeometry();
    this.trailPos = new Float32Array(this.trailN * 2 * 3);
    this.trailCol = new Float32Array(this.trailN * 2 * 4);
    geo.setAttribute("position", new THREE.BufferAttribute(this.trailPos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(this.trailCol, 4));
    const idx = [];
    for (let i = 0; i < this.trailN - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    geo.setIndex(idx);
    this.trail = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
    );
    this.trail.frustumCulled = false;
    this.scene.add(this.trail);
    this.samples = [];
    this._a = new THREE.Vector3();
    this._b = new THREE.Vector3();
  }

  updateTrail(player) {
    const a = player.attack;
    if (a && a.time > 0.08) {
      player.swordBase.getWorldPosition(this._a);
      player.swordTip.getWorldPosition(this._b);
      this.samples.unshift([this._a.clone(), this._b.clone()]);
      if (this.samples.length > this.trailN) this.samples.pop();
    } else if (this.samples.length) {
      this.samples.pop();
    }
    const n = this.samples.length;
    for (let i = 0; i < this.trailN; i++) {
      const s = this.samples[Math.min(i, n - 1)];
      const alpha = n > 1 && i < n ? (1 - i / n) * 0.85 : 0;
      for (let e = 0; e < 2; e++) {
        const v = s ? s[e] : this._a;
        this.trailPos.set([v.x, v.y, v.z], (i * 2 + e) * 3);
        this.trailCol.set([2.2, 2.2, 2.4, alpha * (e ? 1 : 0.25)], (i * 2 + e) * 4);
      }
    }
    this.trail.geometry.attributes.position.needsUpdate = true;
    this.trail.geometry.attributes.color.needsUpdate = true;
    this.trail.visible = n > 1;
  }

  // ---------- angka kerusakan melayang ----------
  number(pos, text, cls) {
    const el = document.createElement("div");
    el.className = "dmg " + cls;
    el.textContent = text;
    this.layer.appendChild(el);
    this.numbers.push({ el, pos: pos.clone(), life: 0.9 });
  }

  updateNumbers(dt) {
    const v = new THREE.Vector3();
    const w = this.layer.clientWidth;
    const h = this.layer.clientHeight;
    for (const n of this.numbers) {
      n.life -= dt;
      n.pos.y += dt * 1.2;
      v.copy(n.pos).project(this.camera);
      const behind = v.z > 1;
      n.el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -50%)`;
      n.el.style.opacity = behind ? 0 : Math.min(1, n.life * 2.5);
      if (n.life <= 0) n.el.remove();
    }
    this.numbers = this.numbers.filter((n) => n.life > 0);
  }
}
