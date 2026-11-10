/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { Navbar } from './components/Navbar';
import { HeroScrubber } from './components/HeroScrubber';
import { StorySection } from './components/StorySection';
import { DishesSection } from './components/DishesSection';
import { CultureSection } from './components/CultureSection';
import { AmbienceSection } from './components/AmbienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { VisitSection } from './components/VisitSection';
import { Footer } from './components/Footer';
import { AmbientParticles } from './components/AmbientParticles';
import { startFpsGuard } from './lib/perf';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    hideBoot?: () => void;
  }
}

/** minimum time the loader is shown, so the logo animation is seen (ms since page start) */
const LOADER_MIN_MS = 900;
/** the loader never stays longer than this (ms since page start) */
const LOADER_MAX_MS = 1600;

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const bootHidden = useRef(false);

  // Hide the instant loader (in index.html) as soon as the first hero image and the fonts are ready.
  // The video is NOT waited for: it loads quietly in the background.
  const hideLoader = useCallback(() => {
    if (bootHidden.current) return;
    bootHidden.current = true;
    const wait = Math.max(0, LOADER_MIN_MS - performance.now());
    window.setTimeout(() => {
      window.hideBoot && window.hideBoot();
      // measure everything once, after the loader has gone
      window.setTimeout(() => ScrollTrigger.refresh(), 120);
    }, wait);
  }, []);

  const handleHeroReady = useCallback(() => {
    const fontsReady: Promise<unknown> =
      (document as any).fonts && (document as any).fonts.ready
        ? (document as any).fonts.ready
        : Promise.resolve();
    Promise.race([
      fontsReady,
      new Promise((r) => window.setTimeout(r, Math.max(0, LOADER_MAX_MS - performance.now()))),
    ]).then(hideLoader);
  }, [hideLoader]);

  // Smooth scroll on desktop (mouse / trackpad) ONLY. Touch devices keep native scrolling.
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    startFpsGuard();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktopPointer =
      window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);

    // safety: never keep the loader forever
    const safety = window.setTimeout(hideLoader, LOADER_MAX_MS + 400);

    let cleanup: (() => void) | undefined;
    if (isDesktopPointer && !reduced) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      const updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        lenisRef.current = null;
      };
    }

    // layout can shift after fonts and images finish: re-measure ONCE (debounced)
    let refreshTimer: number | undefined;
    const refreshOnce = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    window.addEventListener('load', refreshOnce, { once: true });
    window.addEventListener('orientationchange', refreshOnce);

    return () => {
      window.clearTimeout(safety);
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', refreshOnce);
      window.removeEventListener('orientationchange', refreshOnce);
      cleanup && cleanup();
    };
  }, [hideLoader]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleReserveClick = () => scrollToId('visit');
  const handleMenuClick = () => scrollToId('dishes');

  return (
    <div className="relative min-h-[100svh] bg-[#FFF8E7] text-[#1F3A1F]">
      {/* Top Bar Navigation */}
      <Navbar onReserveClick={handleReserveClick} />

      <main>
        {/* The Hero: video scrubbed by scroll */}
        <HeroScrubber
          onReserveClick={handleReserveClick}
          onMenuClick={handleMenuClick}
          onReady={handleHeroReady}
        />

        {/* Section 1: Our Story */}
        <StorySection />

        {/* Section 2: Signature Dishes */}
        <DishesSection />

        {/* Section 3: Culture & Kathakali */}
        <CultureSection />

        {/* Section 4: Ambience day-to-night */}
        <AmbienceSection />

        {/* Section 5: Testimonials */}
        <TestimonialsSection />

        {/* Section 6: Visit Us */}
        <VisitSection />
      </main>

      {/* Section 7: Footer */}
      <Footer />

      {/* Ambient petals / embers (capped for mobile) */}
      <AmbientParticles />
    </div>
  );
}
