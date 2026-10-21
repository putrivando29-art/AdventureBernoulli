// Sihir dari gulungan: Bola Api (proyektil) dan Petir (sambaran dari atas, boss terpaku sebentar).
// Hanya mempercepat turunnya HP boss; tidak mengubah p Serangan Penentu.
import * as THREE from "three";
import { glow } from "./shaders.js";

export const SPELL_LABEL = { api: "Bola Api", petir: "Petir" };

export class Spells {
  constructor(scene) {
    this.scene = scene;
    // bola api: inti terang + cangkang oranye + cahaya
    this.fire = new THREE.Group();
    const core = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), glow(0xffe08a, 4));
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.9, 0.15), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    this.fire.add(core, shell);
    this.fireLight = new THREE.PointLight(0xff8a2a, 0, 10, 1.6);
    this.fire.add(this.fireLight);
    this.fire.visible = false;
    scene.add(this.fire);
    // petir: rantai balok tipis yang dibuat ulang tiap sambaran
    this.bolt = new THREE.Group();
    this.boltMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 3.2, 5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.boltGeo = new THREE.BoxGeometry(0.12, 1, 0.12);
    for (let i = 0; i < 14; i++) this.bolt.add(new THREE.Mesh(this.boltGeo, this.boltMat));
    this.bolt.visible = false;
    scene.add(this.bolt);
    this.boltLight = new THREE.PointLight(0x9fd8ff, 0, 18, 1.4);
    scene.add(this.boltLight);
    this.active = null;
    this.boltT = 0;
  }

  /** Lepaskan Bola Api dari player ke boss; onHit(point) dipanggil saat meledak. */
  castFire(player, boss, onHit) {
    const p = player.position;
    this.fire.position.set(p.x + Math.sin(player.facing) * 0.8, 1.4, p.z + Math.cos(player.facing) * 0.8);
    this.fire.visible = true;
    this.fireLight.intensity = 12;
    this.active = { boss, onHit, t: 0 };
  }

  /** Sambaran petir tepat ke boss. */
  castLightning(boss, onHit) {
    const b = boss.position;
    const top = 14;
    let x = b.x;
    let z = b.z;
    let y = top;
    const seg = top / this.bolt.children.length;
    this.bolt.children.forEach((m) => {
      const nx = b.x + (Math.random() - 0.5) * 1.2;
      const nz = b.z + (Math.random() - 0.5) * 1.2;
      const ny = y - seg;
      m.position.set((x + nx) / 2, (y + ny) / 2, (z + nz) / 2);
      m.scale.set(1, Math.hypot(nx - x, seg, nz - z), 1);
      m.lookAt(nx, ny, nz);
      m.rotateX(Math.PI / 2);
      x = nx;
      z = nz;
      y = ny;
    });
    this.bolt.visible = true;
    this.boltT = 0.35;
    this.boltLight.position.set(b.x, 4, b.z);
    this.boltLight.intensity = 60;
    onHit(new THREE.Vector3(b.x, 2.5, b.z));
  }

  update(dt) {
    const a = this.active;
    if (a) {
      a.t += dt;
      const target = a.boss.position.clone().setY(2.0);
      const dir = target.clone().sub(this.fire.position);
      const d = dir.length();
      this.fire.rotation.x += dt * 8;
      this.fire.rotation.y += dt * 6;
      if (d < a.boss.radius * 0.9 || a.t > 3) {
        this.fire.visible = false;
        this.fireLight.intensity = 0;
        this.active = null;
        a.onHit(this.fire.position.clone());
      } else this.fire.position.addScaledVector(dir.normalize(), Math.min(d, dt * 16));
    }
    if (this.boltT > 0) {
      this.boltT -= dt;
      this.boltMat.opacity = Math.max(0, this.boltT / 0.35) * (0.6 + Math.random() * 0.4);
      this.boltLight.intensity = Math.max(0, this.boltT / 0.35) * 60;
      if (this.boltT <= 0) this.bolt.visible = false;
    }
  }

  reset() {
    this.active = null;
    this.fire.visible = false;
    this.fireLight.intensity = 0;
    this.bolt.visible = false;
    this.boltLight.intensity = 0;
    this.boltT = 0;
  }
}
