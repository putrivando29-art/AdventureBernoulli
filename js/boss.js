// Arca Durgaraksa: model balok, varian per tahap, animasi, dan AI serangan dengan aba-aba jelas.
import * as THREE from "three";
import { glow, toonFlash, makeBox, auraMaterial } from "./shaders.js";
import { collide } from "./arena.js";

const STONE = 0x7d8a78;
const STONE_DARK = 0x5c6658;
const CRACK = 0x343a33;
const GOLD = 0xa88f4a;
const OUT = 0.045;

// Kecepatan AI tiap varian. Hanya mengubah gaya bertarung, TIDAK mengubah p.
const VARIANTS = {
  normal: { scale: 1.0, eye: [0xff9a2e, 3.2], tele: 1.05, recover: 1.35, speed: 2.1, crystal: false, rage: false },
  strong: { scale: 1.2, eye: [0xff2a1a, 3.2], tele: 0.9, recover: 1.15, speed: 2.5, crystal: true, rage: false },
  enraged: { scale: 1.2, eye: [0xff1a10, 5.5], tele: 0.8, recover: 1.0, speed: 2.9, crystal: true, rage: true },
};

export const BOSS_RADIUS = 1.35;
const SCRATCH = { m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), v: new THREE.Vector3(), one: new THREE.Vector3(1, 1, 1) };

export class Boss {
  constructor() {
    this.root = new THREE.Group();
    this.flash = { value: 0 }; // uniform uHitFlash bersama semua material batu
    this.mats = {
      stone: toonFlash(STONE, this.flash),
      dark: toonFlash(STONE_DARK, this.flash),
      crack: toonFlash(CRACK, this.flash),
      gold: toonFlash(GOLD, this.flash),
      fist: toonFlash(STONE_DARK, this.flash, 0xff1a0a, 0),
    };
    this.build();
    this.setVariant("normal");
    this.reset(new THREE.Vector3(0, 0, -3), 0);
  }

  build() {
    const m = this.mats;
    const o = { outline: OUT };
    const model = new THREE.Group();
    this.root.add(model);
    this.model = model;

    const pelvis = new THREE.Group();
    pelvis.position.y = 1.15;
    model.add(pelvis);

    const makeLeg = (side) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.55, 0, 0);
      pelvis.add(hip);
      const upper = makeBox(0.75, 0.6, 0.8, m.dark, o);
      upper.position.y = -0.28;
      hip.add(upper);
      const knee = new THREE.Group();
      knee.position.y = -0.55;
      hip.add(knee);
      const lower = makeBox(0.7, 0.5, 0.75, m.stone, o);
      lower.position.y = -0.22;
      knee.add(lower);
      const foot = makeBox(0.85, 0.22, 1.05, m.dark, o);
      foot.position.set(0, -0.5, 0.12);
      knee.add(foot);
      return { hip, knee };
    };
    const legR = makeLeg(-1);
    const legL = makeLeg(1);

    const spine = new THREE.Group();
    pelvis.add(spine);
    const waist = makeBox(1.6, 0.45, 1.0, m.dark, o);
    waist.position.y = 0.15;
    spine.add(waist);
    const chest = makeBox(2.1, 1.0, 1.25, m.stone, o);
    chest.position.y = 0.85;
    spine.add(chest);
    // retakan lebih gelap di badan
    [
      [0.5, 0.08, -0.4, 0.95, 0.63],
      [0.08, 0.4, -0.2, 0.75, 0.63],
      [0.35, 0.07, 0.5, 0.55, 0.63],
      [0.07, 0.3, 0.62, 1.1, 0.63],
      [0.4, 0.07, 0.1, 0.2, 0.51],
    ].forEach(([w, h, x, y, z]) => {
      const c = makeBox(w, h, 0.04, m.crack, { cast: false });
      c.position.set(x, y, z);
      spine.add(c);
    });
    const belt = makeBox(1.7, 0.14, 1.08, m.gold, o);
    belt.position.y = 0.38;
    spine.add(belt);
    // kristal ungu di punggung (tahap 4 dan 5)
    const crystals = new THREE.Group();
    [
      [0, 1.05, 0.6, 0.35],
      [-0.5, 0.85, 0.4, 0.25],
      [0.5, 0.9, 0.45, -0.3],
    ].forEach(([x, y, s, r]) => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.28 * s * 2, 0.7 * s * 2, 0.28 * s * 2), glow(0xa04dff, 2.6));
      c.position.set(x, y + 0.2, -0.75);
      c.rotation.set(-0.4, 0, r);
      crystals.add(c);
    });
    spine.add(crystals);

    const head = new THREE.Group();
    head.position.y = 1.4;
    spine.add(head);
    const skull = makeBox(1.05, 0.95, 0.95, m.stone, o);
    skull.position.y = 0.45;
    head.add(skull);
    const jaw = makeBox(0.95, 0.32, 0.55, m.dark, o);
    jaw.position.set(0, 0.06, 0.32);
    head.add(jaw);
    const brow = makeBox(1.1, 0.14, 0.2, m.dark, o);
    brow.position.set(0, 0.72, 0.42);
    head.add(brow);
    const eyes = [];
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.06), glow(0xff9a2e, 3.2));
      eye.position.set(sx * 0.24, 0.55, 0.48);
      head.add(eye);
      eyes.push(eye);
    }
    // mahkota batu
    const crownBase = makeBox(1.12, 0.16, 1.02, m.gold, o);
    crownBase.position.y = 0.98;
    head.add(crownBase);
    [-0.4, 0, 0.4].forEach((x, i) => {
      const spike = makeBox(0.18, i === 1 ? 0.42 : 0.3, 0.18, m.gold, o);
      spike.position.set(x, 1.15 + (i === 1 ? 0.06 : 0), 0.38);
      head.add(spike);
    });

    const makeArm = (side) => {
      const sh = new THREE.Group();
      sh.rotation.order = "YXZ";
      sh.position.set(side * 1.32, 1.12, 0);
      spine.add(sh);
      const pad = makeBox(0.85, 0.5, 0.95, m.dark, o);
      pad.position.y = 0.08;
      sh.add(pad);
      const upper = makeBox(0.6, 0.95, 0.62, m.stone, o);
      upper.position.y = -0.45;
      sh.add(upper);
      const el = new THREE.Group();
      el.position.y = -0.95;
      sh.add(el);
      const fore = makeBox(0.66, 0.85, 0.68, m.stone, o);
      fore.position.y = -0.4;
      el.add(fore);
      const fist = makeBox(0.85, 0.8, 0.85, m.fist, o);
      fist.position.y = -1.15;
      el.add(fist);
      return { sh, el, fist };
    };
    const armR = makeArm(-1);
    const armL = makeArm(1);

    // partikel kotak merah melayang (tahap 5)
    const rageGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const rage = new THREE.InstancedMesh(rageGeo, glow(0xff2a14, 3.5), 26);
    rage.frustumCulled = false;
    this.root.add(rage);

    // aura fresnel merah (tahap 5): cangkang sedikit lebih besar di sekitar bagian batu utama
    const auraTargets = [];
    model.traverse((o) => {
      if (o.isMesh && [m.stone, m.dark, m.fist].includes(o.material)) auraTargets.push(o);
    });
    const aura = auraTargets.map((o) => {
      const shell = new THREE.Mesh(o.geometry, auraMaterial());
      shell.scale.setScalar(1.12);
      shell.castShadow = false;
      shell.renderOrder = 3;
      o.add(shell);
      return shell;
    });

    this.parts = { pelvis, spine, head, eyes, crystals, armR, armL, legR, legL, rage, aura };
  }

  setVariant(name) {
    const v = VARIANTS[name] || VARIANTS.normal;
    this.variant = name;
    this.v = v;
    this.model.scale.setScalar(v.scale);
    this.parts.eyes.forEach((e) => (e.material = glow(v.eye[0], v.eye[1])));
    this.parts.crystals.visible = v.crystal;
    this.parts.rage.visible = v.rage;
    this.parts.aura.forEach((a) => (a.visible = v.rage));
    this.mats.fist.emissiveIntensity = v.rage ? 1.6 : 0;
  }

  get radius() {
    return BOSS_RADIUS * this.v.scale;
  }

  get position() {
    return this.root.position;
  }

  reset(pos, facing) {
    this.root.position.copy(pos);
    this.facing = facing;
    this.state = "idle";
    this.stateT = 0.8;
    this.attack = null;
    this.walk = 0;
    this.time = 0;
    this.pose = "normal"; // normal | kneel | triumph
    this.poseT = 0;
    this.farTime = 0;
  }

  forward() {
    return new THREE.Vector3(Math.sin(this.facing), 0, Math.cos(this.facing));
  }

  // ---------- AI ----------
  /**
   * ctx: { ai: boolean, player, colliders, onTelegraph(type), onStrike(attack) }.
   * Boss tidak bisa mati; HP dan ambang 20% diurus combat.js.
   */
  update(dt, ctx) {
    this.time += dt;
    const pos = this.root.position;
    const pp = ctx.player.position;
    const dx = pp.x - pos.x;
    const dz = pp.z - pos.z;
    const dist = Math.hypot(dx, dz);
    const s = this.v.scale;
    let moving = 0;

    if (ctx.ai && this.pose === "normal") {
      this.stateT -= dt;
      const turnTo = (rate) => {
        let d = Math.atan2(dx, dz) - this.facing;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        this.facing += d * Math.min(1, dt * rate);
      };
      if (this.state === "idle") {
        turnTo(3);
        if (this.stateT <= 0) this.state = "approach";
      } else if (this.state === "approach") {
        turnTo(4);
        this.farTime = dist > 7 ? this.farTime + dt : 0;
        if (dist > 3.2 * s) {
          pos.x += Math.sin(this.facing) * this.v.speed * dt;
          pos.z += Math.cos(this.facing) * this.v.speed * dt;
          moving = 1;
        }
        if (dist <= 3.6 * s || this.farTime > 3.5) this.startAttack(dist, ctx);
      } else if (this.state === "telegraph") {
        if (this.attack.type !== "stomp") turnTo(this.attack.type === "slam" ? 2.5 : 1.5);
        if (this.stateT <= 0) {
          this.state = "strike";
          this.stateT = 0.35;
          ctx.onStrike?.(this.attack);
        }
      } else if (this.state === "strike") {
        if (this.stateT <= 0) {
          this.state = "recover";
          this.stateT = this.v.recover;
        }
      } else if (this.state === "recover") {
        if (this.stateT <= 0) {
          this.state = "approach";
          this.attack = null;
        }
      }
    }
    this.walk += dt * 5 * moving;
    collide(pos, this.radius, ctx.colliders);
    this.root.rotation.y = this.facing;
    this.animate(dt, moving);
  }

  startAttack(dist, ctx) {
    const r = Math.random();
    let type;
    if (dist > 4.5 * this.v.scale) type = "stomp";
    else type = r < 0.42 ? "slam" : r < 0.75 ? "sweep" : "stomp";
    this.attack = { type, id: Math.random() };
    this.state = "telegraph";
    this.stateT = this.v.tele;
    this.farTime = 0;
    ctx.onTelegraph?.(this.attack);
  }

  /** Lepaskan semua aksi (dipakai saat Serangan Penentu dan jeda tahap). */
  calm() {
    this.state = "idle";
    this.stateT = 1;
    this.attack = null;
  }

  // ---------- animasi prosedural ----------
  animate(dt, moving) {
    const p = this.parts;
    const t = this.time;
    const sw = Math.sin(this.walk);
    let rx = sw * 0.35 * moving, lx = -sw * 0.35 * moving, rz = -0.12, lz = 0.12, re = 0.15, le = 0.15;
    let ry = 0, ly = 0;
    let hipR = -sw * 0.45 * moving, hipL = sw * 0.45 * moving, kneeR = 0, kneeL = 0;
    let lean = 0.08 + Math.sin(t * 1.6) * 0.02, twist = 0, headX = 0, drop = 0;

    const st = this.state;
    const tele = st === "telegraph" ? 1 - Math.max(0, this.stateT) / this.v.tele : 0;
    const strikeK = st === "strike" ? 1 - Math.max(0, this.stateT) / 0.35 : 0;
    const type = this.attack?.type;

    if (type === "slam") {
      if (st === "telegraph") {
        // aba-aba: kedua lengan diangkat tinggi
        const k = Math.min(1, tele * 1.6);
        rx = lx = -3.0 * k + Math.sin(t * 20) * 0.04 * k;
        re = le = 0.3 * k;
        lean = -0.25 * k;
        headX = -0.2 * k;
      } else if (st === "strike") {
        const k = Math.min(1, strikeK * 3);
        rx = lx = -3.0 + 2.2 * k;
        re = le = 0.1;
        lean = -0.25 + 0.7 * k;
        drop = -0.2 * k;
      } else if (st === "recover") {
        rx = lx = -0.7;
        lean = 0.35;
        drop = -0.15;
      }
    } else if (type === "sweep") {
      if (st === "telegraph") {
        const k = Math.min(1, tele * 1.6);
        rx = -1.5 * k;
        ry = -1.4 * k;
        twist = -0.6 * k;
        lz = 0.5 * k;
      } else if (st === "strike") {
        const k = Math.min(1, strikeK * 2.5);
        rx = -1.5;
        ry = -1.4 + 3.0 * k;
        twist = -0.6 + 1.3 * k;
      } else if (st === "recover") {
        rx = -0.9;
        ry = 1.2;
        twist = 0.5;
      }
    } else if (type === "stomp") {
      if (st === "telegraph") {
        const k = Math.min(1, tele * 1.4);
        hipR = -1.3 * k;
        kneeR = 1.2 * k;
        rx = lx = -0.8 * k;
        rz = -0.6 * k;
        lz = 0.6 * k;
        lean = -0.15 * k;
      } else if (st === "strike") {
        drop = -0.15;
        rz = -0.5;
        lz = 0.5;
      }
    }

    if (this.pose === "kneel") {
      this.poseT = Math.min(1, this.poseT + dt * 1.5);
      const k = this.poseT;
      hipR = -1.3 * k; kneeR = 1.6 * k; hipL = 0.4 * k; kneeL = 1.5 * k;
      drop = -0.55 * k; lean = 0.6 * k; headX = 0.5 * k; rx = lx = -0.3 * k; re = le = 0.3;
    } else if (this.pose === "triumph") {
      this.poseT = Math.min(1, this.poseT + dt * 2);
      const k = this.poseT;
      rx = lx = -2.8 * k; rz = -0.6 * k; lz = 0.6 * k; lean = -0.3 * k; headX = -0.3 * k;
    }

    p.pelvis.position.y = 1.15 + drop;
    p.spine.rotation.set(lean, twist, 0);
    p.head.rotation.x = headX;
    p.armR.sh.rotation.set(rx, ry, rz);
    p.armR.el.rotation.x = -re;
    p.armL.sh.rotation.set(lx, ly, lz);
    p.armL.el.rotation.x = -le;
    p.legR.hip.rotation.x = hipR;
    p.legR.knee.rotation.x = kneeR;
    p.legL.hip.rotation.x = hipL;
    p.legL.knee.rotation.x = kneeL;

    if (p.rage.visible) {
      const { m, q, e, v, one } = SCRATCH;
      for (let i = 0; i < 26; i++) {
        const a = i * 2.4 + t * (0.4 + (i % 5) * 0.08);
        const r = 2.0 + (i % 4) * 0.35;
        const y = ((i * 0.37 + t * 0.5) % 1) * 4.2 + 0.2;
        e.set(t + i, t * 0.7 + i, 0);
        q.setFromEuler(e);
        m.compose(v.set(Math.cos(a) * r, y, Math.sin(a) * r), q, one);
        p.rage.setMatrixAt(i, m);
      }
      p.rage.instanceMatrix.needsUpdate = true;
      this.mats.fist.emissiveIntensity = 1.2 + Math.sin(t * 6) * 0.5;
    }
  }
}
