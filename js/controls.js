// Input laptop: WASD, mouse (pointer lock, cadangan seret), klik tebas, Space, C/Ctrl, Shift, Esc.
// Input HP: joystick virtual kiri, geser sisi kanan untuk kamera, tombol Tebas/Lompat/Jongkok/Hindar.

// Perangkat sentuh: penunjuk utama kasar (HP/tablet). Laptop berlayar sentuh tetap dianggap laptop.
export const isTouchDevice = () => {
  const mq = (q) => window.matchMedia && window.matchMedia(q).matches;
  return mq("(pointer: coarse)") || (navigator.maxTouchPoints > 0 && !mq("(pointer: fine)"));
};

export class Controls {
  constructor(canvas) {
    this.canvas = canvas;
    this.enabled = false;
    this.keys = new Set();
    this.look = { dx: 0, dy: 0 };
    this.edges = { attack: false, jump: false, dodge: false, spell: false };
    this.touch = isTouchDevice();
    this.locked = false;
    this.lockDenied = false;
    this.dragging = false;
    this.expectUnlock = false;
    this.onPause = null;
    this.onLockChange = null;
    this.joy = { x: 0, y: 0 };
    this.touchCrouch = false;
    if (this.touch) this.attachTouch();

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
    if (["Space", "ShiftLeft", "ShiftRight", "KeyC", "ControlLeft", "ControlRight", "KeyW", "KeyA", "KeyS", "KeyD", "KeyQ"].includes(e.code)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    this.keys.add(e.code);
    if (e.code === "Space") this.edges.jump = true;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") this.edges.dodge = true;
    if (e.code === "KeyQ") this.edges.spell = true;
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

  attachTouch() {
    const zone = document.querySelector("#joy");
    const base = document.querySelector("#joy-base");
    const knob = document.querySelector("#joy-knob");
    const look = document.querySelector("#look-zone");
    let joyId = null;
    let lookId = null;
    let lastX = 0;
    let lastY = 0;
    const resetJoy = () => {
      joyId = null;
      this.joy = { x: 0, y: 0 };
      knob.style.transform = "";
    };
    const moveJoy = (e) => {
      const r = base.getBoundingClientRect();
      const rad = r.width / 2;
      let dx = e.clientX - (r.left + rad);
      let dy = e.clientY - (r.top + rad);
      const len = Math.hypot(dx, dy);
      if (len > rad) {
        dx *= rad / len;
        dy *= rad / len;
      }
      this.joy = { x: dx / rad, y: -dy / rad };
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    zone.addEventListener("pointerdown", (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      joyId = e.pointerId;
      zone.setPointerCapture(e.pointerId);
      moveJoy(e);
    });
    zone.addEventListener("pointermove", (e) => e.pointerId === joyId && moveJoy(e));
    ["pointerup", "pointercancel"].forEach((t) => zone.addEventListener(t, (e) => e.pointerId === joyId && resetJoy()));

    look.addEventListener("pointerdown", (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      lookId = e.pointerId;
      look.setPointerCapture(e.pointerId);
      lastX = e.clientX;
      lastY = e.clientY;
    });
    look.addEventListener("pointermove", (e) => {
      if (e.pointerId !== lookId || !this.enabled) return;
      this.look.dx += (e.clientX - lastX) * 1.15;
      this.look.dy += (e.clientY - lastY) * 1.15;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    ["pointerup", "pointercancel"].forEach((t) => look.addEventListener(t, (e) => e.pointerId === lookId && (lookId = null)));

    document.querySelectorAll("[data-touch]").forEach((btn) => {
      const act = btn.dataset.touch;
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (!this.enabled) return;
        if (act === "crouch") this.touchCrouch = true;
        else this.edges[act] = true;
        btn.classList.add("is-down");
      });
      const up = () => {
        if (act === "crouch") this.touchCrouch = false;
        btn.classList.remove("is-down");
      };
      ["pointerup", "pointercancel", "pointerleave"].forEach((t) => btn.addEventListener(t, up));
    });
    this.resetTouch = () => {
      resetJoy();
      lookId = null;
      this.touchCrouch = false;
    };
  }

  setEnabled(on) {
    this.enabled = on;
    this.keys.clear();
    this.edges = { attack: false, jump: false, dodge: false, spell: false };
    this.look.dx = this.look.dy = 0;
    this.dragging = false;
    this.resetTouch?.();
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
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const out = {
      move: {
        x: clamp((k.has("KeyD") ? 1 : 0) - (k.has("KeyA") ? 1 : 0) + this.joy.x),
        y: clamp((k.has("KeyW") ? 1 : 0) - (k.has("KeyS") ? 1 : 0) + this.joy.y),
      },
      crouch: k.has("KeyC") || k.has("ControlLeft") || k.has("ControlRight") || this.touchCrouch,
      attack: this.edges.attack,
      jump: this.edges.jump,
      dodge: this.edges.dodge,
      spell: this.edges.spell,
      look: { dx: this.look.dx, dy: this.look.dy },
    };
    this.edges = { attack: false, jump: false, dodge: false, spell: false };
    this.look.dx = this.look.dy = 0;
    return out;
  }
}
