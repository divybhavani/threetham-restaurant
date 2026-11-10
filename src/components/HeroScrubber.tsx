import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, UtensilsCrossed } from 'lucide-react';
import { isLite } from '../lib/perf';

gsap.registerPlugin(ScrollTrigger);

interface HeroScrubberProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
  /** called once, when the first hero image is decoded (the site can be revealed) */
  onReady?: () => void;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** soft in / hold / soft out window used by the text chapters */
const windowOpacity = (p: number, a: number, b: number, c: number, d: number) => {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p > c) return 1 - (p - c) / (d - c);
  return 1;
};

const HEADLINE_WORDS = ['Step', 'into', 'South', 'India,', 'in', 'the', 'heart', 'of', 'Nashik.'];

/**
 * Hero: video scrubbed by scroll.
 *
 * Why this version is smooth:
 *  - NO React state changes while scrolling. Everything is written straight to the DOM
 *    from one animation loop, so React never re-renders the hero.
 *  - The picture is drawn on a <canvas>. The <video> is only used to decode frames, so a
 *    seek can never show a blank or black frame (the canvas keeps the last good frame).
 *  - The ScrollTrigger is created ONCE and never rebuilt.
 *  - Page loads the poster first; the video downloads quietly afterwards.
 */
export const HeroScrubber: React.FC<HeroScrubberProps> = ({
  onReserveClick,
  onMenuClick,
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const posterLastRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const spotRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const frondRef = useRef<HTMLDivElement>(null);
  const leftLeafRef = useRef<HTMLDivElement>(null);
  const rightLeafRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const ch2Ref = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const ch4Ref = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  const [isDebug] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1'
  );

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!container || !stage || !canvas || !video) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const aspectMq = window.matchMedia('(min-aspect-ratio: 9/10)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as any).connection;
    const saveData = !!(conn && conn.saveData);

    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ---------------- state kept in plain variables (no React) ---------------- */
    let target = 0; // raw scroll progress 0..1
    let smooth = 0; // eased progress used for drawing
    let lastApplied = -1;
    let mode: 'poster' | 'video' = 'poster';
    let seeking = false;
    let pending: number | null = null;
    let lastSeek = -1;
    let canvasDrawn = false;
    let lite = isLite();
    let unlocked = false;
    let destroyed = false;
    let fps = 60;
    const cache = new WeakMap<HTMLElement, Record<string, string>>();

    const onLite = () => {
      lite = true;
      lastApplied = -1;
    };
    window.addEventListener('theertham:lite', onLite);

    /* ---------------- tiny helpers that only touch the DOM when a value changes ---------------- */
    const setStyle = (
      el: HTMLElement | null,
      prop: 'opacity' | 'transform' | 'filter' | 'visibility',
      value: string
    ) => {
      if (!el) return;
      let rec = cache.get(el);
      if (!rec) {
        rec = {};
        cache.set(el, rec);
      }
      if (rec[prop] === value) return;
      rec[prop] = value;
      (el.style as any)[prop] = value;
    };
    const setOpacity = (el: HTMLElement | null, o: number) => {
      if (!el) return;
      const v = Math.round(o * 1000) / 1000;
      setStyle(el, 'opacity', String(v));
      setStyle(el, 'visibility', v > 0.01 ? 'visible' : 'hidden');
    };

    /* ---------------- canvas drawing ---------------- */
    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const dprCap = lite ? 1 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.max(2, Math.round(rect.width * dpr));
      const h = Math.max(2, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const drawVideoFrame = () => {
      if (!ctx || !video.videoWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / video.videoWidth, ch / video.videoHeight);
      const w = video.videoWidth * s;
      const h = video.videoHeight * s;
      ctx.drawImage(video, (cw - w) / 2, (ch - h) / 2, w, h);
      if (!canvasDrawn) {
        canvasDrawn = true;
        canvas.style.opacity = '1';
      }
    };
    resizeCanvas();

    /* ---------------- video: only ONE seek at a time, never blank ---------------- */
    const seekTo = (t: number) => {
      if (seeking) {
        pending = t;
        return;
      }
      seeking = true;
      lastSeek = t;
      video.currentTime = t;
    };
    const onSeeked = () => {
      drawVideoFrame();
      seeking = false;
      if (pending !== null) {
        const p = pending;
        pending = null;
        if (Math.abs(p - video.currentTime) > 1 / 48) seekTo(p);
      }
    };
    const onLoadedData = () => {
      if (destroyed) return;
      mode = 'video';
      resizeCanvas();
      drawVideoFrame();
      lastApplied = -1;
    };
    const onVideoError = () => {
      mode = 'poster';
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onVideoError);

    // start the video download AFTER the first paint (never blocks the page)
    let idleHandle: number | undefined;
    let startTimer: number | undefined;
    const startVideo = () => {
      if (destroyed || reduce || saveData) return;
      video.muted = true;
      video.src = aspectMq.matches ? '/hero-landscape.mp4' : '/hero-portrait.mp4';
      video.load();
    };
    const win = window as any;
    if (win.requestIdleCallback) {
      idleHandle = win.requestIdleCallback(startVideo, { timeout: 1200 });
    } else {
      startTimer = window.setTimeout(startVideo, 300);
    }

    // orientation / big resize: switch to the right video
    const onAspectChange = () => {
      if (reduce || saveData) return;
      mode = 'poster';
      canvasDrawn = false;
      canvas.style.opacity = '0';
      seeking = false;
      pending = null;
      lastSeek = -1;
      startVideo();
    };
    aspectMq.addEventListener('change', onAspectChange);

    // iOS Safari: one play()+pause() after the first touch unlocks seeking
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      const p = video.play();
      if (p && p.then) p.then(() => video.pause()).catch(() => {});
      else video.pause();
    };
    const unlockEvents: Array<keyof WindowEventMap> = ['touchstart', 'pointerdown', 'wheel', 'keydown'];
    unlockEvents.forEach((e) => window.addEventListener(e, unlock, { once: true, passive: true }));

    /* ---------------- ScrollTrigger: created ONCE ---------------- */
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        target = self.progress;
      },
      onRefresh: (self) => {
        target = self.progress;
      },
    });
    target = st.progress;
    smooth = target;

    /* ---------------- everything visual, from one value: p ---------------- */
    const mobileNow = () => !aspectMq.matches;

    const apply = (p: number) => {
      // 1) headline block: flies through the camera (progress 0 to 0.22)
      const fly = clamp(p / 0.22);
      const heroOpacity = Math.max(0, 1 - fly * 1.15);
      setOpacity(heroTextRef.current, heroOpacity);
      setStyle(heroTextRef.current, 'transform', `scale(${(1 + fly * 0.7).toFixed(3)})`);
      const blurPx = lite || mobileNow() ? 0 : Math.round(fly * 8);
      setStyle(heroTextRef.current, 'filter', blurPx ? `blur(${blurPx}px)` : 'none');

      // 2) warm spotlight 0.35 to 0.90
      let spot = 0;
      if (p >= 0.35 && p <= 0.9) spot = ((p - 0.35) / 0.55) * 0.6;
      else if (p > 0.9) spot = Math.max(0, 0.6 - ((p - 0.9) / 0.08) * 0.6);
      setOpacity(spotRef.current, lite ? spot * 0.8 : spot);

      // 3) foreground leaves part outward and fade by 0.45
      const lp = clamp(p / 0.45);
      const leafOpacity = p < 0.35 ? 1 : p < 0.45 ? Math.max(0, 1 - (p - 0.35) / 0.1) : 0;
      setOpacity(leavesRef.current, leafOpacity);
      if (leafOpacity > 0.01) {
        setStyle(
          frondRef.current,
          'transform',
          `translate3d(-50%, ${(-lp * 130).toFixed(2)}%, 0) scale(${(1 + lp * 0.3).toFixed(3)})`
        );
        setStyle(
          leftLeafRef.current,
          'transform',
          `translate3d(${(-lp * 90).toFixed(2)}vw, ${(lp * 50).toFixed(2)}vh, 0) scale(${(1 + lp * 2.5).toFixed(
            3
          )}) rotate(${(-lp * 14).toFixed(2)}deg)`
        );
        setStyle(
          rightLeafRef.current,
          'transform',
          `translate3d(${(lp * 90).toFixed(2)}vw, ${(lp * 50).toFixed(2)}vh, 0) scale(${(1 + lp * 2.5).toFixed(
            3
          )}) rotate(${(lp * 14).toFixed(2)}deg)`
        );
      }

      // 4) lower-centre chapters
      const c2 = windowOpacity(p, 0.48, 0.53, 0.62, 0.67);
      const cc = windowOpacity(p, 0.67, 0.72, 0.79, 0.84);
      const c4 = windowOpacity(p, 0.85, 0.89, 0.94, 0.97);
      setOpacity(ch2Ref.current, c2);
      setOpacity(chipsRef.current, cc);
      setStyle(chipsRef.current, 'transform', `translate3d(0, ${((1 - cc) * 10).toFixed(2)}px, 0)`);
      setOpacity(ch4Ref.current, c4);

      // 5) closing cream leaf panel slides up 0.94 to 1.0
      let wipe = 100;
      if (p >= 0.94) wipe = Math.max(0, 100 - ((p - 0.94) / 0.06) * 100);
      setStyle(wipeRef.current, 'transform', `translate3d(0, ${wipe.toFixed(2)}%, 0)`);
      setStyle(wipeRef.current, 'visibility', wipe < 99.5 ? 'visible' : 'hidden');

      // 6) poster crossfade when the video is not available
      if (mode === 'poster') {
        const f = clamp((p - 0.35) / 0.45);
        setOpacity(posterLastRef.current, f);
      } else {
        setOpacity(posterLastRef.current, 0);
      }
    };

    /* ---------------- one animation loop ---------------- */
    let acc = 0;
    let accFrames = 0;
    const tick = (_time: number, deltaMs: number) => {
      if (destroyed) return;
      const dt = Math.min(deltaMs / 1000, 0.05);

      // frame-rate independent easing (same feel at 60 and 120 Hz)
      const k = 1 - Math.pow(1 - 0.22, dt * 60);
      smooth += (target - smooth) * k;
      if (Math.abs(target - smooth) < 0.00015) smooth = target;

      if (isDebug) {
        acc += deltaMs;
        accFrames += 1;
        if (acc > 500) {
          fps = Math.round((accFrames * 1000) / acc);
          acc = 0;
          accFrames = 0;
        }
      }

      if (Math.abs(smooth - lastApplied) < 0.00008) return; // nothing changed: do nothing
      lastApplied = smooth;
      apply(smooth);

      if (mode === 'video' && video.readyState >= 2 && video.duration && isFinite(video.duration)) {
        const t = Math.min(Math.max(smooth * video.duration, 0.001), video.duration - 0.05);
        if (Math.abs(t - lastSeek) > 1 / 30) seekTo(t);
      }

      if (isDebug && debugRef.current) {
        debugRef.current.textContent = `progress ${smooth.toFixed(2)} | time ${(video.currentTime || 0).toFixed(1)} / ${(
          video.duration || 0
        ).toFixed(1)}s | ${mode} | ${aspectMq.matches ? 'landscape' : 'portrait'} | ${lite ? 'lite' : 'full'} | ${fps} fps`;
      }
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    apply(smooth);

    /* ---------------- resize ---------------- */
    let resizeTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeCanvas();
        if (mode === 'video') drawVideoFrame();
      }, 150);
    });
    ro.observe(stage);

    /* ---------------- tell the app when the first image is ready ---------------- */
    const poster = posterRef.current;
    let readyCalled = false;
    const callReady = () => {
      if (readyCalled) return;
      readyCalled = true;
      onReady && onReady();
    };
    if (poster) {
      if (poster.complete && poster.naturalWidth > 0) {
        poster.decode ? poster.decode().then(callReady, callReady) : callReady();
      } else {
        poster.addEventListener('load', callReady, { once: true });
        poster.addEventListener('error', callReady, { once: true });
      }
    } else {
      callReady();
    }
    const readyFallback = window.setTimeout(callReady, 1500);

    return () => {
      destroyed = true;
      gsap.ticker.remove(tick);
      st.kill();
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(readyFallback);
      if (idleHandle !== undefined && win.cancelIdleCallback) win.cancelIdleCallback(idleHandle);
      if (startTimer !== undefined) window.clearTimeout(startTimer);
      aspectMq.removeEventListener('change', onAspectChange);
      window.removeEventListener('theertham:lite', onLite);
      unlockEvents.forEach((e) => window.removeEventListener(e, unlock));
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onVideoError);
      video.removeAttribute('src');
      video.load();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="th-hero-scroll relative w-full select-none bg-[#112211]">
      {/* Pinned 100svh viewport (CSS sticky: no pin spacers, no jumps) */}
      <div
        ref={stageRef}
        className="sticky top-0 left-0 w-full h-[100svh] overflow-hidden flex items-center justify-center bg-[#112211]"
      >
        {/* SVG Botanical Gradient Definitions */}
        <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="bananaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7cc15a" />
              <stop offset="55%" stopColor="#3e7b3a" />
              <stop offset="100%" stopColor="#1b4a1e" />
            </linearGradient>
            <linearGradient id="palmFrondGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8bd467" />
              <stop offset="60%" stopColor="#356d31" />
              <stop offset="100%" stopColor="#143616" />
            </linearGradient>
          </defs>
        </svg>

        {/* 1. PICTURE: poster first (visible before any JavaScript), canvas on top once the video is ready */}
        <picture>
          <source media="(min-aspect-ratio: 9/10)" srcSet="/hero-landscape-first.webp" />
          <img
            ref={posterRef}
            src="/hero-portrait-first.webp"
            alt="Theertham Entrance Grove"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </picture>

        {/* last poster: only used if the video cannot play */}
        <div ref={posterLastRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0, visibility: 'hidden' }}>
          <picture>
            <source media="(min-aspect-ratio: 9/10)" srcSet="/hero-landscape-last.webp" />
            <img
              src="/hero-portrait-last.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </picture>
        </div>

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0 }}
        />
        {/* the video only decodes frames, it is never shown */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          disablePictureInPicture
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />

        {/* 2. WARM SPOTLIGHT GLOW centred at 50% 45% */}
        <div
          ref={spotRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(255, 210, 120, 0.4) 0%, rgba(232, 163, 61, 0.16) 35%, transparent 65%)',
            opacity: 0,
            visibility: 'hidden',
          }}
        />

        {/* 3. FOREGROUND SVG LEAF DEPTH LAYERS */}
        <div ref={leavesRef} className="th-leaves absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div
            ref={frondRef}
            className="absolute -top-[8vw] left-1/2 w-[110vw] max-w-[850px] aspect-[2/1] will-change-transform"
            style={{ transform: 'translate3d(-50%, 0, 0)' }}
          >
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <path
                d="M400 0 C400 120 480 260 680 320 C540 280 430 180 400 20 C370 180 260 280 120 320 C320 260 400 120 400 0 Z"
                fill="url(#palmFrondGrad)"
              />
            </svg>
          </div>

          <div
            ref={leftLeafRef}
            className="absolute -bottom-[6vw] -left-[14vw] w-[60vw] sm:w-[45vw] max-w-[540px] aspect-[1/2] will-change-transform"
            style={{ transformOrigin: 'bottom left' }}
          >
            <svg viewBox="0 0 350 700" className="w-full h-full">
              <path d="M30 680 C60 520 180 340 320 80 C260 220 180 440 100 680 Z" fill="url(#bananaLeafGrad)" />
              <path
                d="M30 680 Q120 380 270 100"
                stroke="#a3e67e"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>

          <div
            ref={rightLeafRef}
            className="absolute -bottom-[6vw] -right-[14vw] w-[60vw] sm:w-[45vw] max-w-[540px] aspect-[1/2] will-change-transform"
            style={{ transformOrigin: 'bottom right' }}
          >
            <svg viewBox="0 0 350 700" className="w-full h-full">
              <path d="M320 680 C290 520 170 340 30 80 C90 220 170 440 250 680 Z" fill="url(#bananaLeafGrad)" />
              <path
                d="M320 680 Q230 380 80 100"
                stroke="#a3e67e"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>

        {/* 4. BIG, CENTRED HERO TEXT (progress 0 to 0.22) */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6 text-center"
          style={{ transformOrigin: '50% 50%' }}
        >
          <div
            className="absolute w-[92vw] max-w-3xl h-[65vh] max-h-[520px] rounded-full pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 72%)',
            }}
          />

          {/* Theertham Official Logo */}
          <div
            className="mb-4 sm:mb-6 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.65)] border border-white/20"
            style={{ width: 'clamp(140px, 20vmin, 230px)', aspectRatio: '1573/1000' }}
          >
            <img
              src="/assets/aistudio/reslogo_87cb0913.jpeg"
              alt="Theertham Official Logo"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <h1
            className="font-display font-bold text-[#FFF8E7] leading-[1.08] max-w-4xl drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] text-balance"
            style={{ fontSize: 'clamp(34px, 8vmin + 1vw, 84px)' }}
          >
            {HEADLINE_WORDS.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-[0.24em] last:mr-0 align-top">
                <span
                  className="inline-block"
                  style={{
                    animation: `kineticWordUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms backwards`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="font-sans font-normal text-[#FFF8E7]/95 mt-4 sm:mt-5 max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
            style={{ fontSize: 'clamp(16px, 2.2vmin + 0.6vw, 22px)' }}
          >
            Walk through the coconut grove to a banana-leaf meal.
          </p>

          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium text-[#FFF8E7]/90 drop-shadow-md">
              Scroll to step inside
            </span>
            <div className="w-5 h-9 rounded-full border-2 border-[#FFF8E7]/50 flex items-start justify-center p-1">
              <div
                className="w-1.5 h-2.5 bg-[#C8963E] rounded-full"
                style={{ animation: 'bobbingLine 1.6s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>

        {/* 5. LOWER-CENTRE BAND: all chapters stacked in the same cell, bottom aligned */}
        <div
          className="absolute inset-x-0 bottom-[18svh] z-30 pointer-events-none grid justify-items-center items-end px-4 sm:px-6"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div
            ref={ch2Ref}
            className="col-start-1 row-start-1 text-center max-w-2xl"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="font-display font-bold text-[#FFF8E7] leading-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]"
              style={{ fontSize: 'clamp(26px, 5vmin + 1.5vw, 56px)' }}
            >
              Pure South Indian, served on a banana leaf.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#FFF8E7]/90 font-light drop-shadow-md max-w-lg mx-auto">
              Prepared fresh with cold-pressed oils, stone-ground batters, and heirloom spices.
            </p>
          </div>

          <div
            ref={chipsRef}
            className="col-start-1 row-start-1 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            {['Serene ambience', 'Warm service', '100% vegetarian'].map((label) => (
              <div
                key={label}
                className="h-11 px-5 rounded-full flex items-center justify-center text-base sm:text-lg font-medium text-[#FFF8E7] border border-[#FFF8E7]/30 shadow-lg"
                style={{ backgroundColor: 'rgba(31, 58, 31, 0.62)' }}
              >
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div
            ref={ch4Ref}
            className="col-start-1 row-start-1 text-center max-w-md pointer-events-auto"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#FFF8E7] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Your seat is ready.
            </h3>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                onClick={onReserveClick}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-[#C8963E] hover:bg-[#DEAC53] active:bg-[#B38330] text-[#1F3A1F] text-sm sm:text-base font-bold tracking-wider uppercase rounded-xl shadow-xl transition-colors duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a table</span>
              </button>
              <button
                onClick={onMenuClick}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 border border-[#FFF8E7]/60 hover:bg-white/15 active:bg-white/10 text-[#FFF8E7] text-sm sm:text-base font-semibold tracking-wider uppercase rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgba(31, 58, 31, 0.6)' }}
              >
                <UtensilsCrossed className="w-4 h-4 text-[#C8963E]" />
                <span>See the menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. CLOSING TRANSITION: cream leaf-edged panel slides up (progress 0.94 to 1.0) */}
        <div
          ref={wipeRef}
          className="absolute inset-0 z-40 pointer-events-none flex flex-col"
          style={{ transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' }}
        >
          <div className="w-full shrink-0 -mb-[1px]" style={{ height: '14vmin' }}>
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-full h-full block">
              <path
                d="M0,140 L0,70 Q90,0 180,70 Q270,140 360,70 Q450,0 540,70 Q630,140 720,70 Q810,0 900,70 Q990,140 1080,70 Q1170,0 1260,70 Q1350,140 1440,70 L1440,140 Z"
                fill="#FFF8E7"
              />
            </svg>
          </div>
          <div className="w-full flex-1 bg-[#FFF8E7]" />
        </div>

        {/* DEBUG PANEL (only with ?debug=1) */}
        {isDebug && (
          <div
            ref={debugRef}
            className="absolute bottom-3 left-3 z-50 px-3 py-1.5 rounded-lg bg-black/85 text-[#FFF8E7] font-mono text-xs border border-white/20 pointer-events-none shadow-xl"
          >
            debug
          </div>
        )}
      </div>

      <style>{`
        .th-hero-scroll { height: 500svh; }
        @media (min-aspect-ratio: 9/10) { .th-hero-scroll { height: 600svh; } }
        @media (min-aspect-ratio: 9/10) { html:not(.lite) .th-leaves svg { filter: drop-shadow(0 12px 28px rgba(0,0,0,0.45)); } }
        @keyframes kineticWordUp {
          0% { transform: translateY(110%); opacity: 0; }
          100% { transform: translateY(0%); opacity: 1; }
        }
        @keyframes bobbingLine {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(14px); }
        }
      `}</style>
    </div>
  );
};
