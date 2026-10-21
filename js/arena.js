// Arena: ruang singgasana Kerajaan Swarnadwipa yang runtuh.
import * as THREE from "three";
import { toon, glow, makeBox, fireMaterial } from "./shaders.js";

export const ARENA_RADIUS = 15.5; // batas gerak player dan boss
const WALL_RADIUS = 17.5;

// Pengacak berbiji agar susunan reruntuhan selalu sama.
function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const at = (mesh, x, y, z) => (mesh.position.set(x, y, z), mesh);

export function createArena(scene, quality) {
  const rand = seeded(17);
  const group = new THREE.Group();
  scene.add(group);
  const colliders = [];
  const tmp = new THREE.Object3D();
  const col = new THREE.Color();

  scene.background = new THREE.Color(0x150d22);
  scene.fog = new THREE.FogExp2(0x1a1028, 0.022);

  // ---------- lantai ubin dua warna ----------
  const TILE = 1.5;
  const tilesA = [];
  const tilesB = [];
  for (let i = -13; i <= 13; i++) {
    for (let j = -13; j <= 13; j++) {
      const x = i * TILE;
      const z = j * TILE;
      if (x * x + z * z > (WALL_RADIUS + 1) ** 2) continue;
      ((i + j) & 1 ? tilesA : tilesB).push([x, z]);
    }
  }
  [
    [tilesA, 0x5d5968],
    [tilesB, 0x45414f],
  ].forEach(([list, color]) => {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(TILE - 0.04, 0.2, TILE - 0.04), toon(0xffffff), list.length);
    list.forEach(([x, z], k) => {
      tmp.position.set(x, -0.1 - rand() * 0.015, z);
      tmp.rotation.set(0, 0, 0);
      tmp.updateMatrix();
      mesh.setMatrixAt(k, tmp.matrix);
      mesh.setColorAt(k, col.set(color).multiplyScalar(0.92 + rand() * 0.12));
    });
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  // ---------- karpet merah sobek dari pintu ke singgasana ----------
  const carpet = toon(0x8c1f26);
  const trim = toon(0xa88f4a);
  for (let z = 15.5; z > -11; z -= 1) {
    if (rand() < 0.14) continue; // bagian yang sobek hilang
    const w = 2.4 - (rand() < 0.3 ? rand() * 0.8 : 0);
    const off = (2.4 - w) * (rand() - 0.5);
    const seg = makeBox(w, 0.03, 0.96, carpet, { cast: false, receive: true });
    seg.position.set(off, 0.015, z);
    group.add(seg);
    if (rand() > 0.2) {
      for (const sx of [-1, 1]) {
        const t = makeBox(0.12, 0.035, 0.96, trim, { cast: false, receive: true });
        t.position.set(off + sx * (w / 2 - 0.06), 0.018, z);
        group.add(t);
      }
    }
  }

  // ---------- singgasana batu ----------
  const stone = toon(0x6f6b78);
  const stoneDark = toon(0x55515e);
  const throne = new THREE.Group();
  throne.position.set(0, 0, -13.6);
  const parts = [
    [6, 0.4, 4, 0, 0.2, 0, stoneDark],
    [4.2, 0.25, 1, 0, 0.125, 2.4, stone],
    [1.9, 0.7, 1.5, 0, 0.75, 0, stone],
    [2.0, 2.8, 0.45, 0, 1.8, -0.75, stone],
    [0.35, 0.6, 1.4, -1.1, 1.1, 0, stoneDark],
    [0.35, 0.6, 1.4, 1.1, 1.1, 0, stoneDark],
    [1.5, 0.12, 1.2, 0, 1.16, 0.05, toon(0x8c1f26)],
    [2.3, 0.25, 0.55, 0, 3.3, -0.75, trim],
    [0.3, 0.45, 0.3, -0.8, 3.65, -0.75, trim],
    [0.3, 0.6, 0.3, 0, 3.72, -0.75, trim],
    [0.3, 0.45, 0.3, 0.8, 3.65, -0.75, trim],
  ];
  parts.forEach(([w, h, d, x, y, z, m]) => {
    const b = makeBox(w, h, d, m, { receive: true });
    b.position.set(x, y, z);
    throne.add(b);
  });
  group.add(throne);
  colliders.push({ x: 0, z: -13.6, r: 3.0 });

  // ---------- dinding melingkar dari blok batu ----------
  const ROWS = 7;
  const per = 70;
  const wallList = [];
  for (let row = 0; row < ROWS; row++) {
    for (let k = 0; k < per; k++) {
      const a = ((k + (row % 2) * 0.5) / per) * Math.PI * 2;
      const doorGap = Math.abs(Math.atan2(Math.sin(a - Math.PI / 2), Math.cos(a - Math.PI / 2))) < 0.11 && row < 4;
      if (doorGap) continue;
      if (row === ROWS - 1 && rand() < 0.4) continue; // bagian atas runtuh
      if (row === ROWS - 2 && rand() < 0.12) continue;
      wallList.push([a, row]);
    }
  }
  const wall = new THREE.InstancedMesh(new THREE.BoxGeometry(1.58, 0.98, 1.1), toon(0xffffff), wallList.length);
  wallList.forEach(([a, row], k) => {
    tmp.position.set(Math.cos(a) * WALL_RADIUS, 0.5 + row, Math.sin(a) * WALL_RADIUS);
    tmp.rotation.set(0, -a + Math.PI / 2, 0);
    tmp.updateMatrix();
    wall.setMatrixAt(k, tmp.matrix);
    wall.setColorAt(k, col.set(0x4d4858).multiplyScalar(0.8 + rand() * 0.35));
  });
  wall.receiveShadow = true;
  group.add(wall);

  // ---------- dua spanduk merah-emas berlambang mahkota ----------
  for (const sx of [-1, 1]) {
    const banner = new THREE.Group();
    const x = sx * 4.6;
    banner.position.set(x, 0, -Math.sqrt(WALL_RADIUS ** 2 - x * x) + 0.75);
    banner.add(at(makeBox(1.7, 3.4, 0.08, toon(0x9a1d24)), 0, 4.1, 0));
    banner.add(at(makeBox(1.9, 0.18, 0.14, trim), 0, 5.85, 0));
    banner.add(at(makeBox(1.7, 0.12, 0.1, trim), 0, 2.45, 0.01));
    // mahkota sederhana
    const crown = [
      [0.9, 0.22, 0, 4.2],
      [0.2, 0.32, -0.35, 4.45],
      [0.2, 0.42, 0, 4.5],
      [0.2, 0.32, 0.35, 4.45],
    ];
    crown.forEach(([w, h, cx, cy]) => {
      const c = makeBox(w, h, 0.06, trim, { cast: false });
      c.position.set(cx, cy, 0.07);
      banner.add(c);
    });
    group.add(banner);
  }

  // ---------- empat pilar dengan obor ----------
  const fires = [];
  const torchPositions = [];
  [
    [-7, -5],
    [7, -5],
    [-7, 6],
    [7, 6],
  ].forEach(([x, z]) => {
    const pillar = new THREE.Group();
    pillar.position.set(x, 0, z);
    pillar.add(at(makeBox(1.6, 0.4, 1.6, stoneDark, { receive: true }), 0, 0.2, 0));
    pillar.add(at(makeBox(1.05, 6.2, 1.05, stone, { receive: true }), 0, 3.5, 0));
    pillar.add(at(makeBox(1.5, 0.45, 1.5, stoneDark, { receive: true }), 0, 6.75, 0));
    // obor di sisi pilar yang menghadap tengah arena
    const dir = new THREE.Vector2(-x, -z).normalize();
    const tx = dir.x * 0.68;
    const tz = dir.y * 0.68;
    pillar.add(at(makeBox(0.16, 0.5, 0.16, toon(0x3b2a1e)), tx, 2.75, tz));
    pillar.add(at(makeBox(0.3, 0.14, 0.3, toon(0x2b2b30)), tx, 3.05, tz));
    const fire = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), fireMaterial());
    fire.scale.set(0.55, 0.9, 1);
    fire.position.set(tx, 3.48, tz);
    fire.frustumCulled = false;
    pillar.add(fire);
    fires.push(fire);
    const light = new THREE.PointLight(0xff8a3a, 22, 16, 1.6);
    light.position.set(tx * 1.6, 3.4, tz * 1.6);
    pillar.add(light);
    torchPositions.push(new THREE.Vector3(x + tx, 3.2, z + tz));
    group.add(pillar);
    colliders.push({ x, z, r: 1.05 });
  });

  // ---------- balok runtuh ----------
  [
    [-11.5, 1.5, 1.8, 1.1, 1.3, 0.4],
    [11, -1.5, 2.2, 0.9, 1.1, -0.6],
    [-4.5, 11.5, 1.4, 1.0, 1.4, 1.1],
    [5.5, -9.5, 1.2, 0.8, 1.2, 0.2],
  ].forEach(([x, z, w, h, d, ry]) => {
    const b = makeBox(w, h, d, stoneDark, { receive: true });
    b.position.set(x, h / 2, z);
    b.rotation.set(rand() * 0.2, ry, rand() * 0.25);
    group.add(b);
    colliders.push({ x, z, r: Math.max(w, d) * 0.6 });
  });
  // potongan pilar yang rebah
  const broken = makeBox(1.0, 1.0, 4.2, stone, { receive: true });
  broken.position.set(11.2, 0.5, 7.5);
  broken.rotation.y = 0.5;
  group.add(broken);
  colliders.push({ x: 11.2, z: 7.5, r: 1.2 }, { x: 10.1, z: 5.7, r: 0.9 }, { x: 12.3, z: 9.3, r: 0.9 });

  // ---------- cahaya: obor hangat + biru redup dari atas ----------
  scene.add(new THREE.HemisphereLight(0x8c8ca8, 0x3a2e28, 0.7));
  const moon = new THREE.DirectionalLight(0x8aa4ff, 1.1);
  moon.position.set(5, 22, 8);
  moon.castShadow = quality.shadows;
  moon.shadow.mapSize.set(quality.shadowMap, quality.shadowMap);
  Object.assign(moon.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: 1, far: 50 });
  moon.shadow.camera.updateProjectionMatrix();
  moon.shadow.bias = -0.0004;
  moon.shadow.normalBias = 0.03;
  scene.add(moon);
  scene.add(moon.target);

  // ---------- 9. partikel debu dan bara obor ----------
  const dustCount = quality.particles;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = Math.sqrt(rand()) * 15;
    const a = rand() * Math.PI * 2;
    dustPos.set([Math.cos(a) * r, 0.2 + rand() * 6, Math.sin(a) * r], i * 3);
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: 0xb9a8d8, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false })
  );
  group.add(dust);

  const emberPer = Math.round(quality.particles / 20);
  const emberCount = emberPer * torchPositions.length;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(emberCount * 3);
  const emberLife = new Float32Array(emberCount).map(() => rand());
  emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
  const embers = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({ color: new THREE.Color(3, 1.2, 0.2), size: 0.07, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  group.add(embers);

  function update(time, dt) {
    for (let i = 0; i < dustCount; i++) {
      let y = dustPos[i * 3 + 1] + dt * 0.08;
      if (y > 6.5) y = 0.2;
      dustPos[i * 3 + 1] = y;
      dustPos[i * 3] += Math.sin(time * 0.3 + i) * dt * 0.05;
    }
    dustGeo.attributes.position.needsUpdate = true;
    for (let i = 0; i < emberCount; i++) {
      emberLife[i] += dt * 0.9;
      if (emberLife[i] > 1) emberLife[i] -= 1;
      const src = torchPositions[i % torchPositions.length];
      const l = emberLife[i];
      emberPos[i * 3] = src.x + Math.sin(i * 7.3 + time * 2) * 0.15 * l;
      emberPos[i * 3 + 1] = src.y + 0.3 + l * 1.4;
      emberPos[i * 3 + 2] = src.z + Math.cos(i * 3.1 + time * 2) * 0.15 * l;
    }
    emberGeo.attributes.position.needsUpdate = true;
  }

  return { group, colliders, update, fires };
}

/** Dorong titik (x, z) keluar dari lingkaran penghalang dan tetap di dalam arena. */
export function collide(pos, radius, colliders) {
  for (const c of colliders) {
    const dx = pos.x - c.x;
    const dz = pos.z - c.z;
    const min = c.r + radius;
    const d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 1e-8) {
      const d = Math.sqrt(d2);
      pos.x = c.x + (dx / d) * min;
      pos.z = c.z + (dz / d) * min;
    }
  }
  const r = Math.hypot(pos.x, pos.z);
  const max = ARENA_RADIUS - radius;
  if (r > max) {
    pos.x *= max / r;
    pos.z *= max / r;
  }
}
