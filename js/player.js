// Player: model balok, animasi prosedural, dan gerakan (jalan, lompat, jongkok, berguling, tebasan combo).
import * as THREE from "three";
import { toonDissolve, makeBox } from "./shaders.js";
import { collide } from "./arena.js";

export const SHIRT_COLORS = { biru: 0x3f6fd8, merah: 0xc94040, hijau: 0x3f9a52, ungu: 0x7b4fc4 };
export const HAIR_COLORS = { hitam: 0x1b1820, cokelat: 0x6b4126, pirang: 0xe3c065 };
const SKIN = 0xe2b48c;
const PANTS = 0x2e2a40;
const SHOE = 0x1c1820;
const BELT = 0x6b4222;
const SILVER = 0xc4cad6;
const OUT = 0.022;

export const PLAYER_RADIUS = 0.4;
const WALK_SPEED = 5.2;
const CROUCH_SPEED = 2.2;
const JUMP_SPEED = 6.6;
const GRAVITY = 20;
const ROLL_TIME = 0.55;
const ROLL_SPEED = 9;

// Tiga tebasan combo. t dinormalisasi 0..1. sx/sy: putaran bahu kanan, el: siku, tw: putaran badan, lean: condong.
const ATTACKS = [
  {
    dur: 0.42, hit: [0.3, 0.62], lunge: 2.4,
    keys: [
      [0, { sx: -0.5, sy: 0, el: 0.5, tw: 0, lean: 0 }],
      [0.3, { sx: -1.45, sy: -1.5, el: 0.25, tw: -0.7, lean: 0 }],
      [0.62, { sx: -1.5, sy: 1.15, el: 0.15, tw: 0.7, lean: 0.12 }],
      [1, { sx: -0.6, sy: 0.3, el: 0.4, tw: 0.1, lean: 0 }],
    ],
  },
  {
    dur: 0.42, hit: [0.3, 0.62], lunge: 2.4,
    keys: [
      [0, { sx: -0.6, sy: 0.3, el: 0.4, tw: 0.1, lean: 0 }],
      [0.3, { sx: -0.45, sy: 1.1, el: 0.3, tw: 0.65, lean: 0 }],
      [0.62, { sx: -2.4, sy: -0.9, el: 0.15, tw: -0.6, lean: -0.05 }],
      [1, { sx: -0.6, sy: -0.2, el: 0.4, tw: 0, lean: 0 }],
    ],
  },
  {
    dur: 0.62, hit: [0.42, 0.68], lunge: 3.4,
    keys: [
      [0, { sx: -0.6, sy: -0.2, el: 0.4, tw: 0, lean: 0 }],
      [0.38, { sx: -3.0, sy: 0, el: 0.4, tw: 0, lean: -0.25 }],
      [0.62, { sx: -0.35, sy: 0, el: 0.05, tw: 0, lean: 0.42 }],
      [1, { sx: -0.5, sy: 0, el: 0.5, tw: 0, lean: 0 }],
    ],
  },
];

const smooth = (t) => t * t * (3 - 2 * t);
function sampleKeys(keys, t) {
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i];
    const [t1, b] = keys[i + 1];
    if (t <= t1) {
      const k = smooth(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));
      const out = {};
      for (const key in a) out[key] = a[key] + (b[key] - a[key]) * k;
      return out;
    }
  }
  return keys[keys.length - 1][1];
}

const JOINTS = ["lean", "twist", "head", "rx", "ry", "rz", "re", "lx", "ly", "lz", "le", "hipR", "kneeR", "hipL", "kneeL", "drop", "roll", "pivotY"];

export class Player {
  constructor(look) {
    this.root = new THREE.Group();
    this.rollPivot = new THREE.Group();
    this.rollPivot.position.y = 0.55;
    this.root.add(this.rollPivot);
    this.body = new THREE.Group();
    this.body.position.y = -0.55;
    this.rollPivot.add(this.body);

    this.look = { gender: "laki", shirt: "biru", hair: "hitam", ...look };
    this.dissolve = { value: 0 }; // uniform efek kebangkitan
    this.matCache = new Map();
    this.gear = { sword: "wood", armor: false };
    this.j = Object.fromEntries(JOINTS.map((k) => [k, 0]));
    this.j.pivotY = 0.55;
    this.time = 0;
    this.walkPhase = 0;
    this.reset(new THREE.Vector3(0, 0, 8), Math.PI);
    this.build();
  }

  reset(pos, facing) {
    this.root.position.copy(pos);
    this.facing = facing;
    this.vy = 0;
    this.grounded = true;
    this.crouching = false;
    this.roll = null;
    this.rollCd = 0;
    this.attack = null;
    this.nextCombo = 0;
    this.comboTimer = 0;
    this.hurtT = 0;
    this.moveAmt = 0;
    this.hp = 100;
    this.pose = "normal"; // normal | ready | lying | victory | defeated-stand
  }

  /** Material toon milik player (bisa dissolve), dibuat sekali per warna. */
  mat(color) {
    if (!this.matCache.has(color)) this.matCache.set(color, toonDissolve(color, this.dissolve));
    return this.matCache.get(color);
  }

  // ---------- model ----------
  build() {
    const toon = (c) => this.mat(c);
    this.body.clear();
    const f = this.look.gender === "perempuan";
    const tw = f ? 0.42 : 0.5;
    const td = f ? 0.25 : 0.28;
    const armW = f ? 0.13 : 0.15;
    const legW = f ? 0.16 : 0.18;
    const shirt = toon(SHIRT_COLORS[this.look.shirt] ?? SHIRT_COLORS.biru);
    const hairMat = toon(HAIR_COLORS[this.look.hair] ?? HAIR_COLORS.hitam);
    const skin = toon(SKIN);
    const o = { outline: OUT };

    const pelvis = new THREE.Group();
    pelvis.position.y = 0.85;
    this.body.add(pelvis);
    const hipBox = makeBox(tw - 0.02, 0.16, td, toon(PANTS), o);
    hipBox.position.y = -0.02;
    pelvis.add(hipBox);

    const spine = new THREE.Group();
    pelvis.add(spine);
    const torso = makeBox(tw, 0.56, td, shirt, o);
    torso.position.y = 0.3;
    spine.add(torso);
    const belt = makeBox(tw + 0.03, 0.08, td + 0.03, toon(BELT));
    belt.position.y = 0.06;
    spine.add(belt);

    const head = new THREE.Group();
    head.position.y = 0.6;
    spine.add(head);
    const headBox = makeBox(0.36, 0.36, 0.34, skin, o);
    headBox.position.y = 0.19;
    head.add(headBox);
    for (const sx of [-1, 1]) {
      const eye = makeBox(0.06, 0.07, 0.02, toon(0x0c0b10), { cast: false });
      eye.position.set(sx * 0.08, 0.21, 0.175);
      head.add(eye);
    }
    const hair = new THREE.Group();
    head.add(hair);
    const cap = makeBox(0.39, 0.1, 0.37, hairMat, o);
    cap.position.set(0, 0.39, -0.005);
    hair.add(cap);
    const back = makeBox(0.39, 0.2, 0.07, hairMat, o);
    back.position.set(0, 0.27, -0.18);
    hair.add(back);
    const fringe = makeBox(0.39, 0.06, 0.05, hairMat);
    fringe.position.set(0, 0.33, 0.165);
    hair.add(fringe);
    let longHair = null;
    if (f) {
      // rambut panjang: kotak memanjang di belakang kepala sampai bahu
      longHair = makeBox(0.41, 0.55, 0.08, hairMat, o);
      longHair.position.set(0, 0.08, -0.2);
      head.add(longHair);
      for (const sx of [-1, 1]) {
        const lock = makeBox(0.05, 0.3, 0.2, hairMat);
        lock.position.set(sx * 0.2, 0.2, -0.06);
        head.add(lock);
      }
    }

    // helm (tahap 3 sampai 5)
    const helmet = new THREE.Group();
    const helmBox = makeBox(0.43, 0.4, 0.41, toon(SILVER), o);
    helmBox.position.y = 0.23;
    helmet.add(helmBox);
    const slit = makeBox(0.3, 0.05, 0.02, toon(0x0c0b10), { cast: false });
    slit.position.set(0, 0.22, 0.21);
    helmet.add(slit);
    const crest = makeBox(0.06, 0.12, 0.34, toon(0xa88f4a), o);
    crest.position.set(0, 0.48, 0);
    helmet.add(crest);
    head.add(helmet);

    // armor dada
    const chest = makeBox(tw + 0.06, 0.42, td + 0.08, toon(SILVER), o);
    chest.position.y = 0.36;
    spine.add(chest);

    const makeArm = (side) => {
      const sh = new THREE.Group();
      sh.rotation.order = "YXZ";
      sh.position.set(side * (tw / 2 + armW / 2 + 0.01), 0.5, 0);
      spine.add(sh);
      const upper = makeBox(armW, 0.32, armW, shirt, o);
      upper.position.y = -0.14;
      sh.add(upper);
      const pad = makeBox(armW + 0.1, 0.12, armW + 0.1, toon(SILVER), o);
      pad.position.y = 0.0;
      sh.add(pad);
      const el = new THREE.Group();
      el.position.y = -0.3;
      sh.add(el);
      const lower = makeBox(armW - 0.01, 0.28, armW - 0.01, skin, o);
      lower.position.y = -0.13;
      el.add(lower);
      const hand = makeBox(armW + 0.01, 0.12, armW + 0.02, skin, o);
      hand.position.y = -0.31;
      el.add(hand);
      return { sh, el, hand, pad };
    };
    const armR = makeArm(-1); // sisi kanan karakter ada di -x (karakter menghadap +z)
    const armL = makeArm(1);

    const makeLeg = (side) => {
      const hip = new THREE.Group();
      hip.position.set(side * (tw / 4 + 0.01), 0, 0);
      pelvis.add(hip);
      const upper = makeBox(legW, 0.4, legW + 0.01, toon(PANTS), o);
      upper.position.y = -0.2;
      hip.add(upper);
      const knee = new THREE.Group();
      knee.position.y = -0.4;
      hip.add(knee);
      const lower = makeBox(legW - 0.01, 0.37, legW, toon(PANTS), o);
      lower.position.y = -0.185;
      knee.add(lower);
      const shoe = makeBox(legW + 0.03, 0.09, 0.3, toon(SHOE), o);
      shoe.position.set(0, -0.415, 0.05);
      knee.add(shoe);
      return { hip, knee };
    };
    const legR = makeLeg(-1);
    const legL = makeLeg(1);

    // pedang di tangan kanan; bilah membentuk sudut dari lengan bawah
    const swordMount = new THREE.Group();
    swordMount.position.y = -0.31;
    swordMount.rotation.x = 2.04;
    armR.el.add(swordMount);

    this.parts = { pelvis, spine, head, hair, longHair, helmet, chest, armR, armL, legR, legL, swordMount };
    this.buildSword();
    this.applyGear();
  }

  buildSword() {
    const toon = (c) => this.mat(c);
    const m = this.parts.swordMount;
    m.clear();
    const iron = this.gear.sword === "iron";
    const grip = makeBox(0.045, 0.18, 0.045, toon(0x5a3a22), { outline: 0.012 });
    m.add(grip);
    const guard = makeBox(iron ? 0.26 : 0.18, 0.05, 0.07, toon(iron ? 0xd9b23a : 0x7a5531), { outline: 0.012 });
    guard.position.y = 0.1;
    m.add(guard);
    const len = iron ? 0.88 : 0.74;
    const blade = makeBox(iron ? 0.085 : 0.075, len, 0.025, toon(iron ? 0xe4ebf5 : 0xc9a46a), { outline: 0.012 });
    blade.position.y = 0.12 + len / 2;
    m.add(blade);
    if (iron) {
      // cahaya biru tipis di sekitar bilah (disembunyikan selama efek kebangkitan)
      const aura = new THREE.Mesh(
        blade.geometry,
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.75, 2.4), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      aura.scale.set(1.7, 1.03, 2.2);
      aura.userData.outline = true;
      aura.position.copy(blade.position);
      m.add(aura);
    }
    this.swordBase = new THREE.Object3D();
    this.swordBase.position.y = 0.2;
    this.swordTip = new THREE.Object3D();
    this.swordTip.position.y = 0.12 + len;
    m.add(this.swordBase, this.swordTip);
  }

  applyGear() {
    const a = this.gear.armor;
    const p = this.parts;
    p.helmet.visible = a;
    p.chest.visible = a;
    p.armR.pad.visible = a;
    p.armL.pad.visible = a;
    p.hair.visible = !a;
  }

  /** Atur efek kebangkitan: 1 = tak terlihat, 0 = utuh. Garis tepi disembunyikan selama efek. */
  setDissolve(v) {
    this.dissolve.value = v;
    const active = v > 0.001;
    this.root.traverse((o) => {
      if (o.userData.outline) o.visible = !active;
      if (o.isMesh && !o.userData.outline) o.castShadow = !active;
    });
  }

  setLook(look) {
    this.look = { ...this.look, ...look };
    this.build();
  }

  setGear(gear) {
    this.gear = { ...gear };
    this.buildSword();
    this.applyGear();
  }

  get invulnerable() {
    return !!this.roll && this.roll.t < 0.85;
  }

  get position() {
    return this.root.position;
  }

  /** Serangan yang sedang dalam jendela kena, atau null. */
  get activeAttack() {
    const a = this.attack;
    if (!a) return null;
    const t = a.time / ATTACKS[a.idx].dur;
    const [h0, h1] = ATTACKS[a.idx].hit;
    return t >= h0 && t <= h1 ? a : null;
  }

  damage(n) {
    // HP berhenti di 1: player tidak bisa mati selama fase hack and slash.
    this.hp = Math.max(1, this.hp - n);
    this.hurtT = 0.3;
  }

  startAttack(idx, target) {
    this.attack = { idx, time: 0, queued: false, hitDone: false, id: Math.random() };
    if (target) {
      const dx = target.x - this.root.position.x;
      const dz = target.z - this.root.position.z;
      if (dx * dx + dz * dz < 5 * 5) this.facing = Math.atan2(dx, dz);
    }
  }

  // ---------- kontrol dan fisika ----------
  update(dt, input, ctx) {
    this.time += dt;
    this.rollCd -= dt;
    this.comboTimer -= dt;
    this.hurtT = Math.max(0, this.hurtT - dt);
    const pos = this.root.position;
    const canAct = ctx.enabled && this.pose === "normal";

    let mx = 0;
    let mz = 0;
    if (canAct && input) {
      const fx = Math.sin(ctx.cameraYaw);
      const fz = Math.cos(ctx.cameraYaw);
      const rx = -Math.cos(ctx.cameraYaw);
      const rz = Math.sin(ctx.cameraYaw);
      mx = fx * input.move.y + rx * input.move.x;
      mz = fz * input.move.y + rz * input.move.x;
      const len = Math.hypot(mx, mz);
      if (len > 1) {
        mx /= len;
        mz /= len;
      }
    }
    const moveLen = Math.hypot(mx, mz);

    this.crouching = canAct && input.crouch && this.grounded && !this.roll && !this.attack;

    if (canAct && input.dodge && this.grounded && !this.roll && this.rollCd <= 0) {
      const dir = moveLen > 0.1 ? Math.atan2(mx, mz) : this.facing;
      this.roll = { t: 0, dir };
      this.facing = dir;
      this.attack = null;
    }
    if (canAct && input.jump && this.grounded && !this.roll && !this.attack) {
      this.vy = JUMP_SPEED;
      this.grounded = false;
    }
    if (canAct && input.attack && !this.roll) {
      if (!this.attack) this.startAttack(this.comboTimer > 0 ? this.nextCombo : 0, ctx.target);
      else if (this.attack.time / ATTACKS[this.attack.idx].dur > 0.4) this.attack.queued = true;
    }

    let vx = 0;
    let vz = 0;
    if (this.attack) {
      const a = this.attack;
      const def = ATTACKS[a.idx];
      a.time += dt;
      const t = a.time / def.dur;
      if (t > 0.15 && t < 0.6) {
        vx = Math.sin(this.facing) * def.lunge;
        vz = Math.cos(this.facing) * def.lunge;
      }
      if (t >= 1) {
        if (a.queued && a.idx < 2) this.startAttack(a.idx + 1, ctx.target);
        else {
          this.attack = null;
          this.nextCombo = (a.idx + 1) % 3;
          this.comboTimer = a.idx < 2 ? 0.5 : 0;
        }
      }
    } else if (this.roll) {
      this.roll.t += dt / ROLL_TIME;
      const sp = ROLL_SPEED * (1 - this.roll.t * 0.5);
      vx = Math.sin(this.roll.dir) * sp;
      vz = Math.cos(this.roll.dir) * sp;
      if (this.roll.t >= 1) {
        this.roll = null;
        this.rollCd = 0.2;
      }
    } else if (moveLen > 0.05) {
      const sp = this.crouching ? CROUCH_SPEED : WALK_SPEED;
      vx = mx * sp;
      vz = mz * sp;
      const target = Math.atan2(mx, mz);
      let d = target - this.facing;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      this.facing += d * Math.min(1, dt * 12);
    }
    this.moveAmt += ((this.attack || this.roll ? 0 : moveLen) - this.moveAmt) * Math.min(1, dt * 10);

    pos.x += vx * dt;
    pos.z += vz * dt;
    if (!this.grounded) {
      this.vy -= GRAVITY * dt;
      pos.y += this.vy * dt;
      if (pos.y <= 0) {
        pos.y = 0;
        this.vy = 0;
        this.grounded = true;
      }
    }
    collide(pos, PLAYER_RADIUS, ctx.colliders);
    this.root.rotation.y = this.facing;
    this.animate(dt);
  }

  // ---------- animasi prosedural ----------
  animate(dt) {
    const T = {};
    JOINTS.forEach((k) => (T[k] = 0));
    T.pivotY = 0.55;
    T.rx = -0.45;
    T.re = 0.5;
    T.rz = -0.08;
    T.lz = 0.1;
    T.le = 0.2;
    let k = 12;
    const w = this.moveAmt;
    const sp = this.crouching ? 6 : 10;
    this.walkPhase += dt * sp * Math.max(w, 0.0001);
    const s = Math.sin(this.walkPhase);

    // berdiri / berjalan
    T.hipR = s * 0.65 * w;
    T.hipL = -s * 0.65 * w;
    T.kneeR = 0.08 + Math.max(0, s) * 0.9 * w;
    T.kneeL = 0.08 + Math.max(0, -s) * 0.9 * w;
    T.lx = s * 0.7 * w;
    T.rx += -s * 0.3 * w;
    T.drop = -Math.abs(Math.cos(this.walkPhase)) * 0.04 * w;
    T.lean = 0.06 * w + Math.sin(this.time * 2) * 0.015;

    if (this.crouching) {
      T.hipR += -1.05;
      T.hipL += -1.05;
      T.kneeR += 1.75;
      T.kneeL += 1.75;
      T.drop = -0.26;
      T.lean = 0.3;
      T.lx = -0.5;
      T.rx = -0.8;
    }
    if (!this.grounded) {
      T.hipR = -0.6;
      T.hipL = -0.2;
      T.kneeR = 1.1;
      T.kneeL = 0.6;
      T.lx = -1.2;
      T.lz = 0.5;
    }
    if (this.roll) {
      k = 30;
      T.roll = this.roll.t * Math.PI * 2;
      T.hipR = T.hipL = -1.7;
      T.kneeR = T.kneeL = 2.2;
      T.lean = 0.7;
      T.lx = T.rx = -1.2;
      T.drop = -0.15;
    }
    if (this.attack) {
      k = 40;
      const def = ATTACKS[this.attack.idx];
      const p = sampleKeys(def.keys, Math.min(1, this.attack.time / def.dur));
      T.rx = p.sx;
      T.ry = p.sy;
      T.re = p.el;
      T.twist = p.tw;
      T.lean = p.lean;
      T.lx = -0.4;
      T.lz = 0.35;
      T.hipR = 0.3;
      T.hipL = -0.4;
      T.kneeL = 0.35;
      T.kneeR = 0.15;
    }
    if (this.hurtT > 0) T.lean -= this.hurtT * 1.2;

    // pose untuk adegan (Serangan Penentu, kalah, menang)
    if (this.pose === "ready") {
      T.rx = -2.3; T.ry = -0.3; T.re = 0.35; T.twist = -0.2;
      T.hipR = 0.35; T.hipL = -0.45; T.kneeL = 0.4; T.kneeR = 0.2; T.lean = 0.1; T.lx = -0.6; T.lz = 0.4;
    } else if (this.pose === "victory") {
      T.rx = -3.0; T.re = 0.1; T.lx = 0.1; T.lz = 0.4; T.lean = -0.1;
    } else if (this.pose === "lying") {
      k = 5;
      T.roll = -Math.PI / 2;
      T.pivotY = 0.16;
      T.rx = -2.6; T.lx = -2.6; T.re = 0.2; T.le = 0.2;
      T.hipR = T.hipL = -0.1;
    }

    const j = this.j;
    const a = 1 - Math.exp(-dt * k);
    JOINTS.forEach((key) => (j[key] += (T[key] - j[key]) * a));
    if (this.roll) j.roll = T.roll; // putaran berguling dipakai langsung
    if (!this.roll && this.pose !== "lying" && Math.abs(j.roll) > 3) j.roll = 0;

    const p = this.parts;
    this.rollPivot.rotation.x = j.roll;
    this.rollPivot.position.y = j.pivotY;
    this.body.position.y = -0.55 + j.drop;
    p.spine.rotation.set(j.lean, j.twist, 0);
    p.armR.sh.rotation.set(j.rx, j.ry, j.rz);
    p.armR.el.rotation.x = -j.re;
    p.armL.sh.rotation.set(j.lx, j.ly, j.lz);
    p.armL.el.rotation.x = -j.le;
    p.legR.hip.rotation.x = j.hipR;
    p.legR.knee.rotation.x = j.kneeR;
    p.legL.hip.rotation.x = j.hipL;
    p.legL.knee.rotation.x = j.kneeL;
  }
}
