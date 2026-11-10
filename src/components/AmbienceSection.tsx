import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RESTAURANT_DATA } from '../data/restaurantData';
import { Sun, Sunset, Moon, Flame, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const AmbienceSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Only two things re-render React: day/night text colour and the phase (changes 3 times in total).
  // Everything continuous (background colour, lamp glow, progress bar) is written straight to the DOM.
  const [isNight, setIsNight] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    // The section is already sticky (CSS), so ScrollTrigger only measures progress: no pin spacer.
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress;

        const bg =
          p < 0.5
            ? `rgb(${Math.round(245 - p * 2 * 120)}, ${Math.round(237 - p * 2 * 100)}, ${Math.round(213 - p * 2 * 140)})`
            : `rgb(${Math.round(125 - (p - 0.5) * 2 * 97)}, ${Math.round(137 - (p - 0.5) * 2 * 100)}, ${Math.round(73 - (p - 0.5) * 2 * 59)})`;
        pin.style.backgroundColor = bg;

        const glow = Math.min(1, Math.max(0.1, p * 1.2));
        if (glowRef.current) glowRef.current.style.opacity = String(glow * glow);
        if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;

        setIsNight(p > 0.45);
        setPhaseIdx(p < 0.35 ? 0 : p < 0.7 ? 1 : 2);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const activePhaseIndex = phaseIdx;
  const currentPhase = RESTAURANT_DATA.ambiencePhases[activePhaseIndex];

  return (
    <section
      id="ambience"
      ref={containerRef}
      className="relative w-full h-[350vh] select-none"
    >
      <div
        ref={pinRef}
        className="sticky top-0 left-0 w-full h-[100svh] overflow-hidden flex flex-col justify-between p-5 sm:p-10"
        style={{ backgroundColor: 'rgb(245, 237, 213)' }}
      >
        {/* Dynamic ambient lamp lighting overlay that brightens on scroll */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 60%, rgba(232, 163, 61, 0.75) 0%, rgba(200, 150, 62, 0.4) 40%, transparent 80%)',
            opacity: 0.01,
          }}
        />

        {/* Section Header */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#C8963E]">
              <Flame className="w-4 h-4 text-[#E8A33D] animate-pulse" />
              <span>Living Light & Atmosphere</span>
            </div>
            <h2
              className={`font-display text-2xl sm:text-4xl md:text-5xl font-bold transition-colors duration-300 ${
                isNight ? 'text-[#FFF8E7]' : 'text-[#1F3A1F]'
              }`}
            >
              The Light of Theertham
            </h2>
          </div>

          {/* Time Phase Pill with live icon */}
          <div
            className={`flex items-center gap-3 px-4 py-1.5 sm:py-2 rounded-full border transition-colors duration-300 backdrop-blur-md self-start sm:self-auto ${
              isNight
                ? 'bg-black/40 border-[#C8963E]/40 text-[#FFF8E7]'
                : 'bg-white/70 border-[#4F5A2A]/30 text-[#1F3A1F]'
            }`}
          >
            {activePhaseIndex === 0 && <Sun className="w-4 h-4 text-[#E8A33D]" />}
            {activePhaseIndex === 1 && <Sunset className="w-4 h-4 text-[#C8963E]" />}
            {activePhaseIndex === 2 && <Moon className="w-4 h-4 text-[#FFF8E7]" />}
            <span className="text-xs font-mono font-medium tracking-wide">
              {currentPhase.time}
            </span>
          </div>
        </div>

        {/* Middle Content: Narrative + Real Atmospheric Photo Tiles */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-2 sm:py-4">
          {/* Left: Active Phase Narrative */}
          <div className="lg:col-span-5 space-y-2 sm:space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C8963E] font-semibold">
              Phase 0{activePhaseIndex + 1} · {currentPhase.subtitle}
            </span>
            <h3
              className={`font-display text-xl sm:text-3xl lg:text-4xl font-bold transition-colors duration-300 leading-tight ${
                isNight ? 'text-[#FFF8E7]' : 'text-[#1F3A1F]'
              }`}
            >
              {currentPhase.title}
            </h3>
            <p
              className={`text-xs sm:text-base leading-relaxed font-light transition-colors duration-300 ${
                isNight ? 'text-[#FFF8E7]/85' : 'text-[#1F3A1F]/80'
              }`}
            >
              {currentPhase.description}
            </p>

            <div className="pt-1 flex items-center gap-2 sm:gap-3 text-xs text-[#C8963E] font-medium flex-wrap">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{currentPhase.temperature}</span>
              <span>·</span>
              <span>{currentPhase.lightingDescription}</span>
            </div>
          </div>

          {/* Right: High-Res Real Photos of Theertham's Ambience */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Tile 1: Kerala Nilavilakku Brass Lamp Sanctum */}
            <div
              className={`group relative aspect-[4/3] rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden border flex flex-col justify-between transition-all duration-500 shadow-xl backdrop-blur-md ${
                isNight
                  ? 'liquid-glass-dark border-white/20 text-[#FFF8E7]'
                  : 'liquid-glass border-white/70 text-[#1F3A1F]'
              }`}
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/hero-landscape-last.webp"
                  alt="Kerala Nilavilakku Brass Lamp in Temple Sanctum"
                  className="w-full h-full object-cover object-left-bottom brightness-75 group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
              </div>

              {/* Flame indicator top right */}
              <div className="relative z-10 flex justify-end">
                <span className="p-1.5 rounded-full bg-[#E8A33D]/30 border border-[#E8A33D]/60 backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5 text-[#E8A33D] animate-pulse" />
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] tracking-wider uppercase text-[#C8963E] font-semibold block drop-shadow-sm">
                  Pavilion Sanctum
                </span>
                <h4 className="font-display text-xs sm:text-base font-semibold text-[#FFF8E7] drop-shadow-md">
                  Kerala Nilavilakku
                </h4>
              </div>
            </div>

            {/* Tile 2: Chettinad Teak Wood Pillars */}
            <div
              className={`group relative aspect-[4/3] rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden border flex flex-col justify-between transition-all duration-500 shadow-xl backdrop-blur-md ${
                isNight
                  ? 'liquid-glass-dark border-white/20 text-[#FFF8E7]'
                  : 'liquid-glass border-white/70 text-[#1F3A1F]'
              }`}
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/hero-landscape-last.webp"
                  alt="Carved Teak Verandah Pillars"
                  className="w-full h-full object-cover object-center brightness-75 group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
              </div>

              <div className="relative z-10 flex justify-end">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/40 text-[#C8963E] border border-[#C8963E]/40 backdrop-blur-md">
                  Hand-Carved
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] tracking-wider uppercase text-[#C8963E] font-semibold block drop-shadow-sm">
                  Craftsmanship
                </span>
                <h4 className="font-display text-xs sm:text-base font-semibold text-[#FFF8E7] drop-shadow-md">
                  Chettinad Teak Verandah
                </h4>
              </div>
            </div>

            {/* Tile 3: Tropical Coconut Canopy Grove */}
            <div
              className={`group relative aspect-[4/3] rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden border flex flex-col justify-between transition-all duration-500 shadow-xl backdrop-blur-md ${
                isNight
                  ? 'liquid-glass-dark border-white/20 text-[#FFF8E7]'
                  : 'liquid-glass border-white/70 text-[#1F3A1F]'
              }`}
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/hero-landscape-first.webp"
                  alt="Tropical Coconut Grove with Morning Sunbeams"
                  className="w-full h-full object-cover object-center brightness-75 group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
              </div>

              <div className="relative z-10 flex justify-end">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/40 text-[#C8963E] border border-[#C8963E]/40 backdrop-blur-md">
                  Open-Air
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] tracking-wider uppercase text-[#C8963E] font-semibold block drop-shadow-sm">
                  Foliage
                </span>
                <h4 className="font-display text-xs sm:text-base font-semibold text-[#FFF8E7] drop-shadow-md">
                  Shaded Coconut Grove
                </h4>
              </div>
            </div>

            {/* Tile 4: Degree Coffee & Decoction Station */}
            <div
              className={`group relative aspect-[4/3] rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden border flex flex-col justify-between transition-all duration-500 shadow-xl backdrop-blur-md ${
                isNight
                  ? 'liquid-glass-dark border-white/20 text-[#FFF8E7]'
                  : 'liquid-glass border-white/70 text-[#1F3A1F]'
              }`}
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/dishes/filter_coffee.webp"
                  alt="Degree Filter Coffee Station"
                  className="w-full h-full object-cover object-center brightness-75 group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
              </div>

              <div className="relative z-10 flex justify-end">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/40 text-[#C8963E] border border-[#C8963E]/40 backdrop-blur-md">
                  Fresh Brew
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] tracking-wider uppercase text-[#C8963E] font-semibold block drop-shadow-sm">
                  Morning Ritual
                </span>
                <h4 className="font-display text-xs sm:text-base font-semibold text-[#FFF8E7] drop-shadow-md">
                  Degree Filter Station
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-xs border-t border-[#C8963E]/30 pt-3 shrink-0">
          <span
            className={`font-medium transition-colors ${
              isNight ? 'text-[#FFF8E7]/70' : 'text-[#1F3A1F]/70'
            }`}
          >
            Scroll to experience day-to-night transformation
          </span>
          <div className="flex items-center gap-2 font-mono text-[#C8963E]">
            <span>Dawn</span>
            <div className="w-20 h-1 bg-black/20 rounded-full overflow-hidden">
              <div
                ref={barRef}
                className="h-full w-full bg-[#E8A33D] origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <span>Twilight</span>
          </div>
        </div>
      </div>
    </section>
  );
};
