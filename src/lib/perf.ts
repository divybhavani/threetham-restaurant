import gsap from 'gsap';

/**
 * Performance tiers.
 * "lite" mode (class "lite" on <html>) switches off the most expensive effects
 * (blur, big shadows, glass blur, extra particles) on weak devices.
 */
export function initPerformanceTier() {
  if (typeof window === 'undefined') return;
  const nav = navigator as any;
  const conn = nav.connection;

  const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const slowNet = !!(conn && (conn.saveData || /(^|-)2g$|3g/.test(conn.effectiveType || '')));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (lowCores || lowMemory || slowNet || reduced) {
    document.documentElement.classList.add('lite');
  }
}

export const isLite = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('lite');

/**
 * FPS guard: while the visitor scrolls, measure 90 frames. If the average frame
 * is slower than 24 ms (about 42 fps) switch to lite mode once.
 */
export function startFpsGuard() {
  if (typeof window === 'undefined') return;
  let frames = 0;
  let total = 0;
  let last = performance.now();
  let lastScroll = 0;
  let done = false;

  const onScroll = () => {
    lastScroll = performance.now();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const tick = () => {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (done) return;
    if (now - lastScroll < 150 && dt < 200) {
      frames += 1;
      total += dt;
      if (frames >= 90) {
        done = true;
        if (total / frames > 24 && !isLite()) {
          document.documentElement.classList.add('lite');
          window.dispatchEvent(new Event('theertham:lite'));
        }
        gsap.ticker.remove(tick);
        window.removeEventListener('scroll', onScroll);
      }
    }
  };
  gsap.ticker.add(tick);
}
