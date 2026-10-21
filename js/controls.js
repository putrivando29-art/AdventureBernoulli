// Input laptop: WASD, mouse (pointer lock, cadangan seret), klik tebas, Space, C/Ctrl, Shift, Esc.
// Kontrol sentuh HP ditambahkan pada Fase 5 lewat antarmuka yang sama (move, look, aksi).

export const isTouchDevice = () =>
  (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || "ontouchstart" in window;

export class Controls {
  constructor(canvas) {
    this.canvas = canvas;
    this.enabled = false;
    this.keys = new Set();
    this.look = { dx: 0, dy: 0 };
    this.edges = { attack: false, jump: false, dodge: false };
    this.touch = isTouchDevice();
    this.locked = false;
    this.lockDenied = false;
    this.dragging = false;
    this.expectUnlock = false;
    this.onPause = null;
    this.onLockChange = null;

    window.addEventListener("keydown", (e) => this.keyDown(e));
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
    window.addEventListener("blur", () => this.keys.clear());

    canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
    window.addEventListener("mouseup", () => (this.dragging = false));
    window.addEventListener("mousemove", (e) => {
      if (!this.enabled) return;
      if (this.locked || this.dragging) {
        this.look.dx += e.movementX;
        this.look.dy += e.movementY;
      }
    });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("pointerlockchange", () => {
      const was = this.locked;
      this.locked = document.pointerLockElement === canvas;
      this.onLockChange?.(this.locked);
      // Esc saat kursor terkunci melepas kunci tanpa mengirim keydown: anggap sebagai jeda.
      if (was && !this.locked && this.enabled && !this.expectUnlock) this.onPause?.();
      this.expectUnlock = false;
    });
    document.addEventListener("pointerlockerror", () => {
      this.lockDenied = true; // tetap bisa main: kamera diputar dengan seret mouse
      this.onLockChange?.(false);
    });
  }

  keyDown(e) {
    if (!this.enabled || e.code === "Escape") return; // Esc ditangani stages.js
    if (["Space", "ShiftLeft", "ShiftRight", "KeyC", "ControlLeft", "ControlRight", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    this.keys.add(e.code);
    if (e.code === "Space") this.edges.jump = true;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") this.edges.dodge = true;
  }

  mouseDown(e) {
    if (!this.enabled) return;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    if (!this.touch && !this.locked && !this.lockDenied && this.canvas.requestPointerLock) {
      // klik pertama hanya mengunci kursor
      try {
        const r = this.canvas.requestPointerLock();
        if (r && typeof r.catch === "function") r.catch(() => {
          this.lockDenied = true;
          this.onLockChange?.(false);
        });
      } catch (err) {
        this.lockDenied = true;
      }
      return;
    }
    if (!this.locked) this.dragging = true;
    if (e.button === 0) this.edges.attack = true;
  }

  setEnabled(on) {
    this.enabled = on;
    this.keys.clear();
    this.edges = { attack: false, jump: false, dodge: false };
    this.look.dx = this.look.dy = 0;
    this.dragging = false;
    if (!on) this.releaseLock();
  }

  releaseLock() {
    if (document.pointerLockElement) {
      this.expectUnlock = true;
      document.exitPointerLock();
    }
  }

  /** Ambil input frame ini lalu kosongkan aksi sekali-tekan. */
  consume() {
    const k = this.keys;
    const out = {
      move: { x: (k.has("KeyD") ? 1 : 0) - (k.has("KeyA") ? 1 : 0), y: (k.has("KeyW") ? 1 : 0) - (k.has("KeyS") ? 1 : 0) },
      crouch: k.has("KeyC") || k.has("ControlLeft") || k.has("ControlRight"),
      attack: this.edges.attack,
      jump: this.edges.jump,
      dodge: this.edges.dodge,
      look: { dx: this.look.dx, dy: this.look.dy },
    };
    this.edges = { attack: false, jump: false, dodge: false };
    this.look.dx = this.look.dy = 0;
    return out;
  }
}
