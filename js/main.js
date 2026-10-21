// Titik masuk game. Three.js dimuat lewat import map secara dinamis, sehingga jika gagal
// (tidak ada internet) pesan yang jelas tetap bisa ditampilkan.
import { initMenu, showOffline, $ } from "./ui.js";
import { isTouchDevice } from "./controls.js";
import { initAudio } from "./audio.js";

let libs = null;
let adventure = null;

async function loadLibs() {
  const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }, shaders] = await Promise.all([
    import("three"),
    import("three/addons/postprocessing/EffectComposer.js"),
    import("three/addons/postprocessing/RenderPass.js"),
    import("three/addons/postprocessing/UnrealBloomPass.js"),
    import("three/addons/postprocessing/ShaderPass.js"),
    import("three/addons/postprocessing/OutputPass.js"),
    import("./shaders.js"),
  ]);
  return { THREE, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass, shaders };
}

function createEngine(L) {
  const { THREE } = L;
  const touch = isTouchDevice();
  const quality = touch
    ? { shadows: false, shadowMap: 1024, particles: 120, pixelRatio: 1, bloom: false }
    : { shadows: true, shadowMap: 2048, particles: 300, pixelRatio: Math.min(window.devicePixelRatio || 1, 2), bloom: true };

  const renderer = new THREE.WebGLRenderer({ antialias: !touch, powerPreference: "high-performance" });
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.tabIndex = 0;
  $("#canvas-wrap").appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120);

  // 3. Post-processing: RenderPass -> UnrealBloomPass -> grading (vignette, warna) -> OutputPass
  const composer = new L.EffectComposer(renderer);
  composer.addPass(new L.RenderPass(scene, camera));
  const bloom = new L.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.45, 0.92);
  bloom.enabled = quality.bloom;
  composer.addPass(bloom);
  const gradingPass = new L.ShaderPass(L.shaders.GradingShader);
  composer.addPass(gradingPass);
  composer.addPass(new L.OutputPass());

  const engine = {
    THREE, renderer, scene, camera, composer, bloom, quality, time: 0, timeScale: 1,
    listeners: [],
    onFrame(fn) { this.listeners.push(fn); },
    setTimeScale(s) { this.timeScale = s; },
  };

  // grading: desaturasi dan vignette bergerak halus ke target
  const grade = { desat: 0, vig: 0.45, tDesat: 0, tVig: 0.45, flash: 0 };
  engine.grading = (desat, vig) => Object.assign(grade, { tDesat: desat, tVig: vig });
  engine.flash = (hex, amount = 0.65) => {
    gradingPass.uniforms.uFlashColor.value.set(hex);
    grade.flash = amount;
  };

  // 10. Kualitas otomatis: di HP sudah rendah sejak awal; di laptop turun jika fps rata-rata < 40 selama 3 detik.
  const lowListeners = [];
  engine.onLowQuality = (fn) => lowListeners.push(fn);
  engine.setLowQuality = () => {
    if (quality.low) return;
    quality.low = true;
    bloom.enabled = false;
    renderer.shadowMap.enabled = false;
    scene.traverse((o) => {
      if (o.isLight) o.castShadow = false;
      if (o.material) [].concat(o.material).forEach((m) => (m.needsUpdate = true));
    });
    renderer.setPixelRatio(1);
    composer.setPixelRatio(1);
    lowListeners.forEach((fn) => fn());
    console.info("Kualitas grafis diturunkan otomatis (bloom, bayangan, dan partikel dikurangi).");
  };
  quality.low = touch;
  const perf = { frames: 0, time: 0, warmup: 3 };

  engine.rig = createRig(THREE, camera);

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  });

  let last = performance.now();
  const frame = (now) => {
    const raw = (now - last) / 1000;
    const real = Math.min(0.05, raw);
    last = now;
    if (!quality.low) {
      if (perf.warmup > 0) perf.warmup -= raw;
      else {
        perf.frames++;
        perf.time += raw;
        if (perf.time >= 3) {
          if (perf.frames / perf.time < 40) engine.setLowQuality();
          perf.frames = 0;
          perf.time = 0;
        }
      }
    }
    const dt = real * engine.timeScale;
    engine.time += dt;
    const k = 1 - Math.exp(-real * 4);
    grade.desat += (grade.tDesat - grade.desat) * k;
    grade.vig += (grade.tVig - grade.vig) * k;
    grade.flash = Math.max(0, grade.flash - real * 1.6);
    gradingPass.uniforms.uDesat.value = grade.desat;
    gradingPass.uniforms.uVignette.value = grade.vig;
    gradingPass.uniforms.uFlash.value = grade.flash;
    engine.listeners.forEach((fn) => fn(dt, real));
    L.shaders.tickShaders(engine.time);
    composer.render();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return engine;
}

/** Kamera orang ketiga yang bisa diputar, plus mode adegan (pratinjau, pembuka, orbit, fokus). */
function createRig(THREE, camera) {
  const pos = new THREE.Vector3(6, 4, 14);
  const look = new THREE.Vector3(0, 1.5, 0);
  const wantPos = new THREE.Vector3();
  const wantLook = new THREE.Vector3();
  const rig = {
    mode: "intro", yaw: Math.PI, pitch: 0.32, dist: 5.6, shakeAmt: 0, t: 0,
    orbit: { center: new THREE.Vector3(), angle: 0, radius: 7 },
    focus: { point: new THREE.Vector3(), dist: 6 },
    addLook(dx, dy) {
      this.yaw -= dx * 0.0035;
      this.pitch = Math.min(1.05, Math.max(-0.25, this.pitch + dy * 0.0035));
    },
    shake(a) { this.shakeAmt = Math.max(this.shakeAmt, a); },
    startOrbit(a, b) {
      this.orbit.center.set((a.x + b.x) / 2, 1.6, (a.z + b.z) / 2);
      this.orbit.radius = Math.max(6, Math.hypot(a.x - b.x, a.z - b.z) * 0.5 + 5);
      this.orbit.angle = Math.atan2(pos.x - this.orbit.center.x, pos.z - this.orbit.center.z);
      this.mode = "orbit";
    },
    stopOrbit() { this.mode = "follow"; },
    focusOn(p, d) { this.focus.point.set(p.x, 0.8, p.z); this.focus.dist = d; this.mode = "focus"; },
    update(real, player, boss) {
      this.t += real;
      const p = player.position;
      let k = 1 - Math.exp(-real * 10);
      if (this.mode === "follow") {
        const cp = Math.cos(this.pitch);
        wantLook.set(p.x, p.y + 1.45, p.z);
        wantPos.set(
          wantLook.x - Math.sin(this.yaw) * cp * this.dist,
          wantLook.y + Math.sin(this.pitch) * this.dist,
          wantLook.z - Math.cos(this.yaw) * cp * this.dist
        );
        k = 1 - Math.exp(-real * 14);
      } else if (this.mode === "preview") {
        wantLook.set(p.x, 1.0, p.z);
        wantPos.set(p.x + 0.4, 1.5, p.z + 3.6);
        k = 1 - Math.exp(-real * 4);
      } else if (this.mode === "intro") {
        wantLook.set(0, 1.8, -2);
        wantPos.set(Math.sin(this.t * 0.12) * 6, 4.2, 12.5);
        k = 1 - Math.exp(-real * 2);
      } else if (this.mode === "orbit") {
        this.orbit.angle += real * 0.55;
        const c = this.orbit.center;
        wantLook.copy(c);
        wantPos.set(c.x + Math.sin(this.orbit.angle) * this.orbit.radius, 3.2, c.z + Math.cos(this.orbit.angle) * this.orbit.radius);
        k = 1 - Math.exp(-real * 3);
      } else if (this.mode === "focus") {
        const f = this.focus.point;
        wantLook.copy(f);
        wantPos.set(f.x + 2.5, 2.6, f.z + this.focus.dist * 0.75);
        k = 1 - Math.exp(-real * 3);
      }
      // jaga kamera di dalam dinding arena dan di atas lantai
      const r = Math.hypot(wantPos.x, wantPos.z);
      if (r > 16.2) {
        wantPos.x *= 16.2 / r;
        wantPos.z *= 16.2 / r;
      }
      wantPos.y = Math.max(0.5, wantPos.y);
      pos.lerp(wantPos, k);
      look.lerp(wantLook, Math.min(1, k * 1.5));
      camera.position.copy(pos);
      if (this.shakeAmt > 0.001) {
        camera.position.x += (Math.random() - 0.5) * this.shakeAmt * 0.5;
        camera.position.y += (Math.random() - 0.5) * this.shakeAmt * 0.5;
        this.shakeAmt *= Math.exp(-real * 9);
      }
      camera.lookAt(look);
    },
  };
  return rig;
}

async function startAdventure(student) {
  if (!libs) return;
  initAudio(); // dibuat setelah klik pertama pemain (tombol Mulai)
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("is-active"));
  $("#game-root").hidden = false;
  $("#game-root").classList.toggle("is-touch", isTouchDevice());
  if (!adventure) {
    const engine = createEngine(libs);
    const { Adventure } = await import("./stages.js");
    adventure = new Adventure(engine, student);
    window.__adventure = adventure; // dipakai tes browser
  }
}

async function boot() {
  initMenu((student) => startAdventure(student));
  try {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error("jsPDF tidak termuat");
    libs = await loadLibs();
  } catch (err) {
    console.error("Library dari CDN gagal dimuat:", err);
    showOffline();
    return;
  }
  if (new URLSearchParams(location.search).get("test") === "1") {
    const { runBrowserTests } = await import("./browser-tests.js");
    runBrowserTests();
  }
}

boot();
