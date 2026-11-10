/**
 * DishMarquee: premium, smooth, auto-scrolling side carousel.
 *
 * - Runs on requestAnimationFrame with delta time, so the speed is identical on
 *   60Hz, 120Hz and slow phones (no CSS animation restarts, no jumps).
 * - Speed is eased: hover / focus / pause slow it down smoothly, and it
 *   accelerates smoothly when it starts again.
 * - Drag or swipe with the mouse, finger or trackpad, with inertia.
 * - Prev / next move exactly one card with an eased glide.
 * - Seamless loop: the markup contains the card set `copies` times
 *   (cards have data-set="0", "1", ...). The class tells you when it needs more
 *   copies through options.onNeedCopies(n).
 * - Only runs while visible. Respects prefers-reduced-motion (falls back to a
 *   normal swipeable list, see the CSS).
 * - Vertical page scroll on phones keeps working (touch-action: pan-y).
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export interface MarqueeOptions {
  speed?: number;
  mobileSpeed?: number;
  mobileQuery?: string;
  hoverPause?: boolean;
  stepDuration?: number;
  maxCopies?: number;
  onNeedCopies?: ((n: number) => void) | null;
  onStateChange?: ((s: { paused: boolean }) => void) | null;
}

export class DishMarquee {
  vp: HTMLElement;
  track: HTMLElement;
  opt: Required<MarqueeOptions>;
  pos = 0;
  vel = 0;
  k = 5;
  userPaused = false;
  hovering = false;
  focused = false;
  visible = true;
  drag: { id: number; x0: number; startPos: number; moved: boolean; samples: { t: number; x: number }[] } | null = null;
  tween: { t0: number; from: number; to: number; delta: number } | null = null;
  setW = 0;
  stepW = 0;
  raf = 0;
  last = 0;
  noClickUntil = 0;
  destroyed = false;
  reduce: boolean;
  mq: MediaQueryList;
  io?: IntersectionObserver;
  ro?: ResizeObserver;

  constructor(viewport: HTMLElement, track: HTMLElement, options: MarqueeOptions = {}) {
    this.vp = viewport;
    this.track = track;
    this.opt = Object.assign(
      {
        speed: 48,                 // px per second on desktop
        mobileSpeed: 34,           // px per second on phones
        mobileQuery: "(max-width: 767px)",
        hoverPause: true,          // mouse only
        stepDuration: 650,         // ms for prev / next
        maxCopies: 8,
        onNeedCopies: null,        // (n) => void
        onStateChange: null,       // ({ paused }) => void
      },
      options
    ) as Required<MarqueeOptions>;

    this.pos = 0;           // scroll position in px (grows = content moves left)
    this.vel = 0;           // current velocity in px/s
    this.k = 5;             // easing strength (higher = quicker response)
    this.userPaused = false;
    this.hovering = false;
    this.focused = false;
    this.visible = true;
    this.drag = null;
    this.tween = null;
    this.setW = 0;
    this.stepW = 0;
    this.raf = 0;
    this.last = 0;
    this.noClickUntil = 0;
    this.destroyed = false;

    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.mq = window.matchMedia(this.opt.mobileQuery);

    this._bind();
    this.measure();
    if (!this.reduce) this.raf = requestAnimationFrame(this._tick);
  }

  /* ---------------- public API ---------------- */

  /** call after the cards changed (filter, resize, fonts) */
  measure() {
    const first = this.track.querySelector('[data-set="0"]') as HTMLElement | null;
    if (!first) return;
    const second = this.track.querySelector('[data-set="1"]') as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    this.stepW = first.offsetWidth + gap;

    const copies = new Set(
      Array.from(this.track.querySelectorAll<HTMLElement>("[data-set]"), (n) => n.dataset.set)
    ).size;

    this.setW = second ? second.offsetLeft - first.offsetLeft : 0;
    const vpW = this.vp.clientWidth;
    const need = this.setW > 0 ? clamp(Math.ceil(vpW / this.setW) + 1, 2, this.opt.maxCopies) : 2;
    if (copies < need && this.opt.onNeedCopies) this.opt.onNeedCopies(need);

    // clones are decoration: hide them from screen readers and the tab order
    this.track.querySelectorAll<HTMLElement>("[data-set]").forEach((n) => {
      if (n.dataset.set !== "0") {
        n.setAttribute("aria-hidden", "true");
        n.setAttribute("inert", "");
      }
    });

    this.pos = this._wrap(this.pos);
    this._apply();
  }

  reset() {
    this.pos = 0;
    this.vel = 0;
    this.tween = null;
    this._apply();
  }

  next() { this._step(1); }
  prev() { this._step(-1); }

  setPaused(paused: boolean) {
    this.userPaused = !!paused;
    if (this.opt.onStateChange) this.opt.onStateChange({ paused: this.userPaused });
  }
  toggle() { this.setPaused(!this.userPaused); return this.userPaused; }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this._unbind();
  }

  /* ---------------- internals ---------------- */

  _wrap(p: number) {
    return this.setW > 0 ? ((p % this.setW) + this.setW) % this.setW : p;
  }

  _apply() {
    this.track.style.transform = `translate3d(${-this._wrap(this.pos)}px,0,0)`;
  }

  _targetSpeed() {
    if (this.userPaused || this.hovering || this.focused) return 0;
    return this.mq.matches ? this.opt.mobileSpeed : this.opt.speed;
  }

  _step(dir: number) {
    if (!this.setW) return;
    const now = performance.now();
    const base = this.tween ? this.tween.to : this.pos;
    this.tween = { t0: now, from: this.pos, to: base + dir * this.stepW };
    this.tween.delta = this.tween.to - this.tween.from;
    this.vel = 0;
  }

  _tick = (now: number) => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this._tick);
    const dt = clamp((now - (this.last || now)) / 1000, 0, 0.05);
    this.last = now;
    if (!this.visible || !this.setW) return;

    if (this.tween) {
      const p = clamp((now - this.tween.t0) / this.opt.stepDuration, 0, 1);
      this.pos = this.tween.from + this.tween.delta * easeInOutCubic(p);
      if (p >= 1) {
        this.pos = this._wrap(this.tween.to);
        this.tween = null;
        this.vel = 0;
      }
    } else if (!this.drag) {
      const target = this._targetSpeed();
      if (this.k !== 5 && Math.abs(this.vel - target) < 20) this.k = 5;
      this.vel += (target - this.vel) * (1 - Math.exp(-dt * this.k));
      this.pos = this._wrap(this.pos + this.vel * dt);
    }
    this._apply();
  };

  /* ---- pointer: drag / swipe with inertia ---- */
  _down = (e: PointerEvent) => {
    if (this.reduce) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.drag = {
      id: e.pointerId,
      x0: e.clientX,
      startPos: this.pos,
      moved: false,
      samples: [{ t: performance.now(), x: e.clientX }],
    };
  };

  _move = (e: PointerEvent) => {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      this.tween = null;
      this.vel = 0;
      try { this.vp.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      this.vp.classList.add("is-dragging");
    }
    this.pos = d.startPos - dx;
    d.samples.push({ t: performance.now(), x: e.clientX });
    if (d.samples.length > 6) d.samples.shift();
    this._apply();
  };

  _up = (e: PointerEvent) => {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    this.vp.classList.remove("is-dragging");
    if (!d.moved) return;
    this.noClickUntil = performance.now() + 80; // do not "click" a card after a drag
    if (e.type === "pointerup") {
      const s = d.samples;
      const a = s[0];
      const b = s[s.length - 1];
      const dt = Math.max(1, b.t - a.t);
      const pointerV = ((b.x - a.x) / dt) * 1000;           // px/s of the finger
      this.vel = clamp(-pointerV, -2600, 2600);               // content follows the finger
      this.k = 2.6;                                           // long, smooth glide
    }
  };

  _click = (e: Event) => {
    if (performance.now() < this.noClickUntil) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /* ---- trackpad sideways scroll ---- */
  _wheel = (e: WheelEvent) => {
    if (this.reduce) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      this.tween = null;
      this.pos += e.deltaX;
      this.vel = 0;
    }
  };

  _enter = (e: PointerEvent) => { if (this.opt.hoverPause && e.pointerType === "mouse") this.hovering = true; };
  _leave = (e: PointerEvent) => { if (e.pointerType === "mouse") this.hovering = false; };
  _focusIn = () => { this.focused = true; };
  _focusOut = () => { this.focused = this.vp.matches(":focus-within"); };

  _key = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { this.next(); e.preventDefault(); }
    if (e.key === "ArrowLeft") { this.prev(); e.preventDefault(); }
  };

  _bind() {
    const v = this.vp;
    v.addEventListener("pointerdown", this._down);
    v.addEventListener("pointermove", this._move);
    v.addEventListener("pointerup", this._up);
    v.addEventListener("pointercancel", this._up);
    v.addEventListener("click", this._click, true);
    v.addEventListener("wheel", this._wheel, { passive: false });
    v.addEventListener("pointerenter", this._enter);
    v.addEventListener("pointerleave", this._leave);
    v.addEventListener("focusin", this._focusIn);
    v.addEventListener("focusout", this._focusOut);
    v.addEventListener("keydown", this._key);

    this.io = new IntersectionObserver(
      (entries) => { this.visible = entries[0].isIntersecting; this.last = 0; },
      { threshold: 0 }
    );
    this.io.observe(v);

    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(v);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => !this.destroyed && this.measure());
    }
  }

  _unbind() {
    const v = this.vp;
    v.removeEventListener("pointerdown", this._down);
    v.removeEventListener("pointermove", this._move);
    v.removeEventListener("pointerup", this._up);
    v.removeEventListener("pointercancel", this._up);
    v.removeEventListener("click", this._click, true);
    v.removeEventListener("wheel", this._wheel);
    v.removeEventListener("pointerenter", this._enter);
    v.removeEventListener("pointerleave", this._leave);
    v.removeEventListener("focusin", this._focusIn);
    v.removeEventListener("focusout", this._focusOut);
    v.removeEventListener("keydown", this._key);
    if (this.io) this.io.disconnect();
    if (this.ro) this.ro.disconnect();
  }
}
