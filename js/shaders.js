// Material, shader custom, dan pembuat balok. Setiap material dibuat sekali lalu dipakai ulang.
import * as THREE from "three";

// ---------- 1. Toon shading: gradientMap 3 tingkat ----------
let gradientMap = null;
export function getGradientMap() {
  if (!gradientMap) {
    gradientMap = new THREE.DataTexture(new Uint8Array([70, 160, 255]), 3, 1, THREE.RedFormat);
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.generateMipmaps = false;
    gradientMap.needsUpdate = true;
  }
  return gradientMap;
}

const toonCache = new Map();
/** Material toon bersama (di-cache per warna). */
export function toon(color, emissive = 0x000000, emissiveIntensity = 1) {
  const key = `${color}|${emissive}|${emissiveIntensity}`;
  if (!toonCache.has(key)) {
    toonCache.set(key, new THREE.MeshToonMaterial({ color, emissive, emissiveIntensity, gradientMap: getGradientMap() }));
  }
  return toonCache.get(key);
}

const glowCache = new Map();
/** Material berpendar: warna HDR (> 1) agar tertangkap bloom. */
export function glow(color, intensity = 3) {
  const key = `${color}|${intensity}`;
  if (!glowCache.has(key)) {
    const c = new THREE.Color(color).multiplyScalar(intensity);
    glowCache.set(key, new THREE.MeshBasicMaterial({ color: c }));
  }
  return glowCache.get(key);
}

// ---------- 2. Outline inverted hull ----------
let outlineMat = null;
export function outlineMaterial() {
  if (!outlineMat) outlineMat = new THREE.MeshBasicMaterial({ color: 0x07060c, side: THREE.BackSide });
  return outlineMat;
}

const geoCache = new Map();
export function boxGeo(w, h, d) {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`;
  if (!geoCache.has(key)) geoCache.set(key, new THREE.BoxGeometry(w, h, d));
  return geoCache.get(key);
}

/**
 * Balok dengan material tertentu. opts.outline = tebal garis tepi (unit dunia),
 * dibuat dari salinan balok yang sedikit lebih besar dengan sisi belakang hitam.
 */
export function makeBox(w, h, d, material, opts = {}) {
  const mesh = new THREE.Mesh(boxGeo(w, h, d), material);
  mesh.castShadow = opts.cast ?? true;
  mesh.receiveShadow = opts.receive ?? false;
  if (opts.outline) {
    const t = opts.outline;
    const hull = new THREE.Mesh(boxGeo(w + 2 * t, h + 2 * t, d + 2 * t), outlineMaterial());
    hull.castShadow = false;
    hull.userData.outline = true;
    mesh.add(hull);
  }
  return mesh;
}

// ---------- 7. Kilatan saat kena (uHitFlash) ----------
/** Material toon unik yang bisa memutih lewat uniform bersama `flash` ({ value }). */
export function toonFlash(color, flash, emissive = 0x000000, emissiveIntensity = 1) {
  const m = new THREE.MeshToonMaterial({ color, emissive, emissiveIntensity, gradientMap: getGradientMap() });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uHitFlash = flash;
    shader.fragmentShader =
      "uniform float uHitFlash;\n" +
      shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.6), uHitFlash);"
      );
  };
  m.customProgramCacheKey = () => "toon-hitflash";
  return m;
}

// ---------- 4. Api obor (billboard + noise bergerak naik) ----------
const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }
`;

let fireMat = null;
export function fireMaterial() {
  if (!fireMat) {
    fireMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vSeed;
        void main() {
          vUv = uv;
          vec3 center = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vSeed = fract(sin(dot(center.xz, vec2(12.9898, 78.233))) * 43758.5453);
          vec2 scale = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
          vec4 mv = viewMatrix * vec4(center, 1.0);
          mv.xy += position.xy * scale;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vSeed;
        ${NOISE_GLSL}
        void main() {
          vec2 uv = vUv;
          float n = fbm(vec2(uv.x * 3.0 + vSeed * 17.0, uv.y * 3.5 - uTime * 2.6));
          float width = 0.5 - uv.y * 0.36;
          float body = 1.0 - smoothstep(width * 0.35, width, abs(uv.x - 0.5 + (n - 0.5) * 0.18 * uv.y));
          float flame = body * (1.15 - uv.y) * (0.55 + n * 0.9);
          float a = smoothstep(0.25, 0.7, flame);
          vec3 red = vec3(1.4, 0.18, 0.04);
          vec3 orange = vec3(2.6, 0.9, 0.12);
          vec3 yellow = vec3(3.2, 2.4, 0.8);
          vec3 col = mix(red, orange, smoothstep(0.3, 0.6, flame));
          col = mix(col, yellow, smoothstep(0.7, 1.05, flame));
          gl_FragColor = vec4(col * a, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }
  return fireMat;
}

// ---------- 3 dan 8. Vignette + color grading (+ desaturasi dan kilatan layar) ----------
export const GradingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVignette: { value: 0.45 },
    uDesat: { value: 0 },
    uFlashColor: { value: new THREE.Color(1, 0.8, 0.3) },
    uFlash: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uVignette;
    uniform float uDesat;
    uniform vec3 uFlashColor;
    uniform float uFlash;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = max(c.rgb, 0.0);
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = max(mix(vec3(l), col, 1.06), 0.0);
      col = (col - 0.18) * 1.08 + 0.18;
      vec3 tint = mix(vec3(0.86, 0.92, 1.12), vec3(1.10, 1.0, 0.86), smoothstep(0.04, 0.55, l));
      col = max(col * tint, 0.0);
      col = mix(col, vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), uDesat);
      float d = length(vUv - 0.5) * 1.42;
      col *= 1.0 - uVignette * smoothstep(0.35, 1.0, d);
      col = mix(col, uFlashColor * 1.6, uFlash);
      gl_FragColor = vec4(col, c.a);
    }`,
};

// ---------- 5. Kebangkitan: dissolve terbalik dengan tepi bercahaya biru ----------
/**
 * Material toon yang bisa "larut". uniform `dissolve.value` 1 = hilang semua, 0 = utuh.
 * Kode shader disuntikkan sekali lewat onBeforeCompile dan memakai program yang sama untuk semua warna.
 */
export function toonDissolve(color, dissolve) {
  const m = new THREE.MeshToonMaterial({ color, gradientMap: getGradientMap() });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uDissolve = dissolve;
    shader.vertexShader = "varying vec3 vDWorld;\n" + shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\n  vDWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;"
    );
    shader.fragmentShader =
      "uniform float uDissolve;\nvarying vec3 vDWorld;\n" + NOISE_GLSL +
      shader.fragmentShader
        .replace(
          "#include <clipping_planes_fragment>",
          "#include <clipping_planes_fragment>\n  float dn = fbm(vec2(vDWorld.x * 4.0 + vDWorld.z * 3.0, vDWorld.y * 4.0)) / 0.94;\n  if (dn < uDissolve) discard;"
        )
        .replace(
          "#include <dithering_fragment>",
          "#include <dithering_fragment>\n  float dEdge = (1.0 - smoothstep(0.0, 0.08, dn - uDissolve)) * step(0.001, uDissolve);\n  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.6, 1.5, 4.0), dEdge);"
        );
  };
  m.customProgramCacheKey = () => "toon-dissolve";
  return m;
}

// ---------- 6. Aura boss tahap 5: fresnel merah berdenyut ----------
let auraMat = null;
export function auraMaterial() {
  if (!auraMat) {
    auraMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(1.0, 0.12, 0.05) } },
      vertexShader: /* glsl */ `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
          float pulse = 0.55 + 0.45 * sin(uTime * 4.0);
          float a = clamp(f * pulse + 0.06, 0.0, 1.0);
          gl_FragColor = vec4(uColor * 3.0 * a, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }
  return auraMat;
}

/** Dipanggil sekali per frame untuk memperbarui uniform waktu shader bersama. */
export function tickShaders(time) {
  if (fireMat) fireMat.uniforms.uTime.value = time;
  if (auraMat) auraMat.uniforms.uTime.value = time;
}
