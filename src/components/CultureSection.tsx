import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Compass, Flame, Play, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const CultureSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const archFrameRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const manFigureRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const templeBackdrop = '/hero-landscape-last.webp';
  const kathakaliPhoto = '/kathakali-popout.webp';

  useEffect(() => {
    const archFrame = archFrameRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const manFigure = manFigureRef.current;
    const glow = glowRef.current;

    if (!archFrame || !leftDoor || !rightDoor || !manFigure) return;

    // Set initial 2D door positions and initial man state
    gsap.set(leftDoor, { xPercent: 0 });
    gsap.set(rightDoor, { xPercent: 0 });
    gsap.set(manFigure, {
      scale: 0.92,
      y: 10,
    });
    if (glow) {
      gsap.set(glow, { opacity: 0.2, scale: 0.9 });
    }

    // ScrollTrigger timeline:
    // 1. Doors slide open in 2D (strictly horizontal parting, no 3D distortion)
    // 2. The man becomes big and steps forward in 3D (scale up + depth lighting)
    // 3. Background stays flat and stable inside the frame
    // 4. Everything remains strictly clipped inside the arch frame (overflow-hidden)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: archFrame,
        start: 'top 70%',
        end: 'top 15%',
        scrub: 1.2,
        onUpdate: (self) => {
          setIsOpen(self.progress > 0.4);
        },
      },
    });

    timelineRef.current = tl;

    // 2D Doors slide open horizontally inside the frame
    tl.to(
      leftDoor,
      {
        xPercent: -102,
        ease: 'power2.inOut',
        duration: 0.7,
      },
      0
    )
      .to(
        rightDoor,
        {
          xPercent: 102,
          ease: 'power2.inOut',
          duration: 0.7,
        },
        0
      )
      // Only the man becomes big and looks 3D (emerging forward with depth shadow & scale)
      .to(
        manFigure,
        {
          scale: 1.14,
          y: -6,
          ease: 'power2.out',
          duration: 1.0,
        },
        0.1
      );

    if (glow) {
      tl.to(
        glow,
        {
          opacity: 0.85,
          scale: 1.3,
          ease: 'power2.out',
          duration: 0.9,
        },
        0.15
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  // Interactive toggle to smoothly open/close doors on button click or card tap
  const handleToggleDoors = () => {
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const manFigure = manFigureRef.current;
    const glow = glowRef.current;

    if (!leftDoor || !rightDoor || !manFigure) return;

    const targetOpen = !isOpen;
    setIsOpen(targetOpen);

    const dur = 0.9;
    const ease = 'power2.inOut';

    gsap.to(leftDoor, {
      xPercent: targetOpen ? -102 : 0,
      duration: dur,
      ease,
    });

    gsap.to(rightDoor, {
      xPercent: targetOpen ? 102 : 0,
      duration: dur,
      ease,
    });

    gsap.to(manFigure, {
      scale: targetOpen ? 1.14 : 0.92,
      y: targetOpen ? -6 : 10,
      duration: dur,
      ease: 'power2.out',
    });

    if (glow) {
      gsap.to(glow, {
        opacity: targetOpen ? 0.85 : 0.2,
        scale: targetOpen ? 1.3 : 0.9,
        duration: dur,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section
      id="culture"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 bg-[#182312] text-[#FFF8E7] overflow-hidden select-none"
    >
      {/* Background ambient radial aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,150,62,0.12)_0%,transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Sacred Sanctum Arch with 2D Doors & 3D Man contained strictly inside frame */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {/* The Arch Frame: overflow-hidden ensures NOTHING ever escapes outside the boundary */}
            <div
              ref={archFrameRef}
              onClick={handleToggleDoors}
              className="group relative w-full max-w-[380px] sm:max-w-[420px] aspect-[3/4] rounded-t-[210px] sm:rounded-t-[230px] rounded-b-2xl overflow-hidden border-4 border-[#C8963E]/90 shadow-[0_25px_65px_rgba(0,0,0,0.85)] bg-[#0C1508] cursor-pointer"
              title="Click or scroll to open/close temple sanctum doors"
            >
              {/* Decorative inner golden rim inlay */}
              <div className="absolute inset-1.5 rounded-t-[200px] sm:rounded-t-[220px] rounded-b-xl border border-[#C8963E]/40 pointer-events-none z-30" />

              {/* 1. FLAT BACKGROUND: Static sacred temple sanctuary (NOT 3D) */}
              <div className="absolute inset-0 z-0 bg-[#0C1508]">
                <img
                  src={templeBackdrop}
                  alt="Temple Sanctum Background"
                  className="w-full h-full object-cover object-center brightness-[0.55] contrast-[1.15]"
                />
                {/* Serene depth scrims */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/55" />
              </div>

              {/* 2. VOLUMETRIC WARM SPOTLIGHT (Centered behind the man) */}
              <div
                ref={glowRef}
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(255, 218, 130, 0.55) 0%, rgba(200, 150, 62, 0.2) 40%, transparent 70%)',
                }}
              />

              {/* 3. 3D MAN FIGURE: Kathakali Performer emerges big and 3D inside the frame */}
              <div
                ref={manFigureRef}
                className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={kathakaliPhoto}
                  alt="Kathakali divine performer in 3D"
                  decoding="async"
                  className="w-full h-full object-contain object-bottom select-none"
                  style={{ filter: 'drop-shadow(0 20px 32px rgba(0,0,0,0.85))' }}
                />
              </div>

              {/* 4. 2D FLAT SLIDING DOORS (Strictly inside the frame, opening & closing horizontally) */}
              {/* Left Door Panel */}
              <div
                ref={leftDoorRef}
                className="absolute top-0 bottom-0 left-0 w-1/2 z-25 bg-gradient-to-r from-[#172311] via-[#1E2E16] to-[#25381C] border-r border-[#C8963E]/60 shadow-[4px_0_15px_rgba(0,0,0,0.7)] flex flex-col justify-between py-8 px-3 will-change-transform"
              >
                {/* Traditional wood panel vertical fluting & brass studs */}
                <div className="space-y-4 opacity-75">
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                  <div className="flex justify-around">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                  </div>
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                </div>

                {/* Left Brass Door Ring Handle */}
                <div className="flex justify-end pr-1 my-auto">
                  <div className="w-9 h-16 rounded-l-full border-2 border-r-0 border-[#C8963E] bg-[#C8963E]/20 flex items-center justify-end pr-1 shadow-md">
                    <div className="w-4 h-4 rounded-full border border-[#C8963E] bg-[#C8963E]/40" />
                  </div>
                </div>

                {/* Lower brass studs */}
                <div className="space-y-4 opacity-75">
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                  <div className="flex justify-around">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                  </div>
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                </div>
              </div>

              {/* Right Door Panel */}
              <div
                ref={rightDoorRef}
                className="absolute top-0 bottom-0 right-0 w-1/2 z-25 bg-gradient-to-l from-[#172311] via-[#1E2E16] to-[#25381C] border-l border-[#C8963E]/60 shadow-[-4px_0_15px_rgba(0,0,0,0.7)] flex flex-col justify-between py-8 px-3 will-change-transform"
              >
                {/* Traditional wood panel vertical fluting & brass studs */}
                <div className="space-y-4 opacity-75">
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                  <div className="flex justify-around">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                  </div>
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                </div>

                {/* Right Brass Door Ring Handle */}
                <div className="flex justify-start pl-1 my-auto">
                  <div className="w-9 h-16 rounded-r-full border-2 border-l-0 border-[#C8963E] bg-[#C8963E]/20 flex items-center justify-start pl-1 shadow-md">
                    <div className="w-4 h-4 rounded-full border border-[#C8963E] bg-[#C8963E]/40" />
                  </div>
                </div>

                {/* Lower brass studs */}
                <div className="space-y-4 opacity-75">
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                  <div className="flex justify-around">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E]" />
                  </div>
                  <div className="h-0.5 bg-[#C8963E]/30 w-full" />
                </div>
              </div>

              {/* 5. FIXED LOWER BEZEL LABEL (Anchored cleanly at bottom) */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 z-30 text-center rounded-b-2xl border-t border-[#C8963E]/30 pointer-events-none">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C8963E] font-semibold block">
                  Paccha Veshakkar · Divine Host
                </span>
                <p className="text-xs sm:text-sm text-[#FFF8E7] font-display font-medium mt-0.5">
                  The Sacred Sanctum of Kerala
                </p>
              </div>
            </div>

            {/* Interactive Control Pill below Frame */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleDoors}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#202E18] hover:bg-[#2A3C20] border border-[#C8963E]/50 text-xs tracking-wider uppercase font-semibold text-[#FFF8E7] transition-all shadow-md active:scale-95"
              >
                {isOpen ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>Close Sanctum Doors</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>Open Sanctum Doors</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-[#FFF8E7]/60">
                (Scroll or tap to reveal)
              </span>
            </div>
          </div>

          {/* Right Column: Cultural Heritage & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#C8963E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Living Heritage</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl text-[#FFF8E7] font-bold leading-tight text-balance">
              Where Sacred Art Meets Gracious Hospitality.
            </h2>

            <p className="text-base sm:text-lg text-[#FFF8E7]/90 font-light leading-relaxed">
              In Kerala, Kathakali is not merely a dance drama—it is a sacred invocation. The vivid green face makeup (<em>Paccha</em>) embodies virtue, spiritual royalty, and calm benevolence.
            </p>

            <p className="text-sm sm:text-base text-[#FFF8E7]/80 font-light leading-relaxed">
              In identical spirit, a traditional South Indian meal is treated as an offering. When the emerald plantain leaf is laid before you, every curry has its designated quadrant, reflecting millennia of Ayurvedic balance: sour, sweet, pungent, bitter, astringent, and salty.
            </p>

            {/* Cultural hallmarks with Apple liquid glass */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl liquid-glass-dark border border-white/20 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-[#C8963E] text-sm font-semibold mb-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Athithi Devo Bhava</span>
                </div>
                <p className="text-xs text-[#FFF8E7]/80 leading-relaxed font-light">
                  Every guest crossing our threshold is welcomed as divinity incarnate, served with boundless patience.
                </p>
              </div>

              <div className="p-5 rounded-2xl liquid-glass-dark border border-white/20 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-[#C8963E] text-sm font-semibold mb-1.5">
                  <Flame className="w-4 h-4" />
                  <span>The Living Flame</span>
                </div>
                <p className="text-xs text-[#FFF8E7]/80 leading-relaxed font-light">
                  Brass Nilavilakku lamps are lit with native sesame oil at sunrise and dusk to purify the atmosphere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
