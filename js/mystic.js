// Resi Bayang: pertapa berjubah ungu yang melayang, wajah hitam bermata putih, tongkat berkristal biru.
import * as THREE from "three";
import { toon, glow, makeBox } from "./shaders.js";

export class Mystic {
  constructor() {
    this.root = new THREE.Group();
    const o = { outline: 0.03 };
    const robe = toon(0x3a1f5c);
    const robeDark = toon(0x28143f);
    const float = new THREE.Group();
    this.root.add(float);
    this.float = float;

    // jubah panjang tanpa kaki terlihat
    const lower = makeBox(0.9, 1.0, 0.7, robeDark, o);
    lower.position.y = 0.6;
    float.add(lower);
    const upper = makeBox(0.72, 0.8, 0.55, robe, o);
    upper.position.y = 1.45;
    float.add(upper);
    const sash = makeBox(0.76, 0.1, 0.59, toon(0xa88f4a));
    sash.position.y = 1.12;
    float.add(sash);
    // tudung dan wajah gelap
    const hood = makeBox(0.56, 0.56, 0.54, robeDark, o);
    hood.position.y = 2.1;
    float.add(hood);
    const face = makeBox(0.4, 0.36, 0.06, toon(0x050408), { cast: false });
    face.position.set(0, 2.06, 0.25);
    float.add(face);
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.03), glow(0xffffff, 3));
      eye.position.set(sx * 0.09, 2.1, 0.29);
      float.add(eye);
    }
    // lengan memegang tongkat
    const arm = makeBox(0.18, 0.55, 0.18, robe, o);
    arm.position.set(0.45, 1.5, 0.15);
    arm.rotation.x = -0.5;
    float.add(arm);
    const staff = makeBox(0.07, 2.6, 0.07, toon(0x3b2a1e), { outline: 0.015 });
    staff.position.set(0.5, 1.4, 0.35);
    float.add(staff);
    const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), glow(0x4da6ff, 3.2));
    crystal.position.set(0.5, 2.85, 0.35);
    crystal.rotation.set(Math.PI / 4, 0, Math.PI / 4);
    float.add(crystal);
    this.crystal = crystal;
    const light = new THREE.PointLight(0x4da6ff, 6, 6, 1.8);
    light.position.copy(crystal.position);
    float.add(light);
    this.time = 0;
  }

  update(dt, lookAt) {
    this.time += dt;
    this.float.position.y = 0.25 + Math.sin(this.time * 1.4) * 0.12; // melayang naik-turun pelan
    this.crystal.rotation.y += dt;
    if (lookAt) {
      const dx = lookAt.x - this.root.position.x;
      const dz = lookAt.z - this.root.position.z;
      this.root.rotation.y = Math.atan2(dx, dz);
    }
  }
}
