// Ramuan di arena selama fase hack and slash. Ramuan hanya memengaruhi HP dan kecepatan
// menurunkan HP boss; tidak ada hubungannya dengan p Serangan Penentu.
import * as THREE from "three";
import { toon, glow, makeBox } from "./shaders.js";

const TYPES = {
  darah: { liquid: 0xff2a3a, label: "Ramuan Darah" },
  serangan: { liquid: 0xff9a1a, label: "Ramuan Serangan" },
};

export class Potions {
  constructor(scene, cfg, colliders) {
    this.scene = scene;
    this.cfg = cfg;
    this.colliders = colliders;
    this.items = [];
    this.time = 0;
    this.reset();
  }

  reset() {
    this.items.forEach((it) => this.scene.remove(it.group));
    this.items = [];
    this.timer = 4; // ramuan pertama muncul cepat
  }

  makeBottle(type) {
    const g = new THREE.Group();
    const glass = makeBox(0.34, 0.36, 0.34, toon(0xd7e6ff), { outline: 0.02 });
    glass.position.y = 0.18;
    g.add(glass);
    const liquid = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.28), glow(TYPES[type].liquid, 2.4));
    liquid.position.y = 0.16;
    g.add(liquid);
    const neck = makeBox(0.14, 0.14, 0.14, toon(0xd7e6ff), { outline: 0.02 });
    neck.position.y = 0.43;
    g.add(neck);
    const cork = makeBox(0.12, 0.08, 0.12, toon(0x7a5531));
    cork.position.y = 0.53;
    g.add(cork);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.55, 32),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(TYPES[type].liquid).multiplyScalar(1.6), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    ring.userData.ground = true;
    const holder = new THREE.Group();
    holder.add(g, ring);
    return { group: holder, bottle: g };
  }

  spawn(player, hpLow) {
    let pos = null;
    for (let tries = 0; tries < 30 && !pos; tries++) {
      const r = 3 + Math.random() * 9;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const blocked = this.colliders.some((c) => Math.hypot(x - c.x, z - c.z) < c.r + 0.8);
      const nearPlayer = Math.hypot(x - player.position.x, z - player.position.z) < 2.5;
      if (!blocked && !nearPlayer) pos = [x, z];
    }
    if (!pos) return;
    // HP rendah: Ramuan Darah lebih sering muncul
    const type = Math.random() < (hpLow ? 0.75 : 0.5) ? "darah" : "serangan";
    const it = { type, ...this.makeBottle(type), t: Math.random() * 6 };
    it.group.position.set(pos[0], 0, pos[1]);
    this.scene.add(it.group);
    this.items.push(it);
  }

  /** onPick(type) dipanggil saat player menyentuh ramuan. */
  update(dt, player, active, onPick) {
    this.time += dt;
    if (active) {
      this.timer -= dt;
      if (this.timer <= 0 && this.items.length < this.cfg.maxOnField) {
        this.spawn(player, player.hp < 50);
        this.timer = this.cfg.spawnEvery;
      }
    }
    for (const it of this.items) {
      it.t += dt;
      it.bottle.position.y = 0.35 + Math.sin(it.t * 3) * 0.1;
      it.bottle.rotation.y += dt * 1.5;
      if (active && !it.taken) {
        const d = Math.hypot(player.position.x - it.group.position.x, player.position.z - it.group.position.z);
        if (d < 1.0 && player.position.y < 1.2) {
          it.taken = true;
          onPick(it.type, it.group.position.clone());
        }
      }
    }
    this.items.filter((it) => it.taken).forEach((it) => this.scene.remove(it.group));
    this.items = this.items.filter((it) => !it.taken);
  }
}

export const POTION_LABEL = Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, v.label]));
