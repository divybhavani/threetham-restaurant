import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RESTAURANT_DATA } from '../data/restaurantData';
import { Leaf, Clock, Heart, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineMaskRef = useRef<HTMLHeadingElement>(null);
  const kolamPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Mask slide-up animation for headline
    const headline = headlineMaskRef.current;
    if (headline) {
      const spans = headline.querySelectorAll('.headline-line');
      gsap.fromTo(
        spans,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Kolam pattern draw on scroll
    const kolam = kolamPathRef.current;
    if (kolam) {
      const length = kolam.getTotalLength();
      gsap.set(kolam, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(kolam, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom 85%',
          scrub: 1
        }
      });
    }
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 bg-[#FFF8E7] text-[#1F3A1F] overflow-hidden"
    >
      {/* Decorative Traditional Kolam Pattern in the background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[450px] opacity-25 pointer-events-none text-[#7A7F45] -mr-16 sm:-mr-8">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          {/* Kolam Sacred Geometry */}
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1.5" />
          <path
            ref={kolamPathRef}
            d="M200 20 C240 80 320 160 380 200 C320 240 240 320 200 380 C160 320 80 240 20 200 C80 160 160 80 200 20 Z M200 60 C230 110 290 170 340 200 C290 230 230 290 200 340 C170 290 110 230 60 200 C110 170 170 110 200 60 Z M200 100 C215 130 250 170 300 200 C250 230 215 270 200 300 C185 270 150 230 100 200 C150 170 185 130 200 100 Z"
            stroke="#C8963E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots in Kolam Grid */}
          {[120, 160, 200, 240, 280].map((x) =>
            [120, 160, 200, 240, 280].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#4F5A2A" />
            ))
          )}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#7A7F45] mb-4">
          <Leaf className="w-4 h-4 text-[#3E7B3A]" />
          <span>Our Story & Philosophy</span>
        </div>

        {/* Mask Slide-Up Headline */}
        <h2
          ref={headlineMaskRef}
          className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1F3A1F] leading-[1.18] font-bold max-w-3xl text-balance mb-8"
        >
          <span className="block overflow-hidden py-1">
            <span className="headline-line block">From the Kaveri & Malabar,</span>
          </span>
          <span className="block overflow-hidden py-1">
            <span className="headline-line block text-[#4F5A2A]">
              to the Sacred Godavari.
            </span>
          </span>
        </h2>

        {/* Story Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-8">
          <div className="lg:col-span-7 space-y-6 text-[#1F3A1F]/85 text-base sm:text-lg leading-relaxed font-light">
            <p className="text-xl sm:text-2xl text-[#1F3A1F] font-normal leading-snug">
              {RESTAURANT_DATA.story.lead}
            </p>
            {RESTAURANT_DATA.story.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            {/* Unboxed editorial proof marks */}
            <div className="pt-6 border-t border-[#1F3A1F]/10 flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm text-[#4F5A2A]">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#C8963E]" />
                <span>14-Hour Natural Fermentation</span>
              </div>
              <span className="text-[#1F3A1F]/30">·</span>
              <div className="flex items-center gap-2 font-medium">
                <Heart className="w-4 h-4 text-[#B3261E]" />
                <span>100% Native A2 Cow Ghee</span>
              </div>
              <span className="text-[#1F3A1F]/30">·</span>
              <div className="flex items-center gap-2 font-medium">
                <Award className="w-4 h-4 text-[#3E7B3A]" />
                <span>Fresh Harvest Banana Leaves</span>
              </div>
            </div>
          </div>

          {/* Right Column: Culinary Oath Card with Apple Liquid Glass */}
          <div className="lg:col-span-5 liquid-glass rounded-3xl p-7 sm:p-9 border border-white/85 shadow-[0_20px_50px_rgba(31,58,31,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-md">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8963E] font-semibold block mb-3">
              The Theertham Standard
            </span>
            <h3 className="font-display text-2xl text-[#1F3A1F] font-bold mb-4">
              Sacred Kitchen Disciplines
            </h3>
            <ul className="space-y-4 text-sm text-[#1F3A1F]/85">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4F5A2A] text-[#FFF8E7] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="block text-[#1F3A1F] font-semibold">Traditional Stone-Grinding</strong>
                  Wet-ground daily using heirloom granite grinders to keep batters cool and oxygen-rich.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4F5A2A] text-[#FFF8E7] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="block text-[#1F3A1F] font-semibold">Whole Spice Roasting</strong>
                  No pre-packaged curry powders; whole spices toasted every morning in cast iron.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4F5A2A] text-[#FFF8E7] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="block text-[#1F3A1F] font-semibold">Pure Dining Hygiene</strong>
                  Sterilized fresh green plantain leaves that add subtle natural sweetness and aroma to warm food.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
