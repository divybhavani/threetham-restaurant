import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { DishMarquee } from '../lib/dishMarquee';
import { RESTAURANT_DATA, DishItem } from '../data/restaurantData';
import { Sparkles, ChevronRight, ChevronLeft, Check, Plus, Info, X } from 'lucide-react';

// Fallback Illustrated SVG Plate component
const DishSvgPlateFallback: React.FC<{ dishId: string }> = ({ dishId: _dishId }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EFE6CD] to-[#D5C9A7]">
      <svg viewBox="0 0 160 120" className="w-28 h-20 drop-shadow-md">
        <path d="M10 75 C30 15 130 15 150 75 C130 110 30 110 10 75 Z" fill="#3E7B3A" />
        <polygon points="80,18 25,85 135,85" fill="#E8A33D" stroke="#C8963E" strokeWidth="2" />
        <circle cx="45" cy="95" r="10" fill="#FFF8E7" stroke="#C8963E" strokeWidth="1.5" />
        <circle cx="80" cy="97" r="10" fill="#B3261E" stroke="#C8963E" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export const DishesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<DishMarquee | null>(null);
  // how many times the card set is repeated (the engine asks for more on very wide screens)
  const [copies, setCopies] = useState(3);

  // Filtered dishes
  const filteredDishes = activeCategory === 'all'
    ? RESTAURANT_DATA.dishes
    : RESTAURANT_DATA.dishes.filter((d) => d.category === activeCategory);

  // Repeat the set for a seamless infinite loop
  const loopedDishes = Array.from({ length: copies }).flatMap(() => filteredDishes);

  // Smooth, frame-rate independent auto-scroll (transform based: sub-pixel smooth on every screen)
  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const marquee = new DishMarquee(vp, track, {
      speed: 48,
      mobileSpeed: 34,
      onNeedCopies: (n) => setCopies((c) => Math.max(c, n)),
    });
    marqueeRef.current = marquee;
    return () => {
      marquee.destroy();
      marqueeRef.current = null;
    };
  }, []);

  // When the filter or number of copies changes: start from the first card and re-measure
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    const m = marqueeRef.current;
    if (!m) return;
    if (!firstRender.current) m.reset();
    firstRender.current = false;
    m.measure();
  }, [activeCategory, copies]);

  const toggleShortlist = (dishId: string) => {
    setShortlist((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const manualScroll = (direction: 'left' | 'right') => {
    const m = marqueeRef.current;
    if (!m) return;
    if (direction === 'left') m.prev();
    else m.next();
  };

  const handleImageError = (dishId: string) => {
    setImageErrors((prev) => ({ ...prev, [dishId]: true }));
  };

  return (
    <section
      id="dishes"
      className="relative w-full py-20 lg:py-28 bg-[#FFF8E7]/70 text-[#1F3A1F] overflow-hidden select-none"
    >
      {/* Liquid glass ambient background gradient spheres */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#3E7B3A]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#C8963E]/15 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-8 relative z-10">
        {/* Header Contract */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1F3A1F]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#7A7F45] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>South Indian Heritage Showcase</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-[#1F3A1F] font-bold">
              Signature Dishes & Feasts
            </h2>
            <p className="text-xs sm:text-sm text-[#1F3A1F]/70 font-light mt-1">
              Auto-rotating carousel — glides continuously. Swipe horizontally anytime on mobile or desktop.
            </p>
          </div>

          {/* Right Header Controls: Category Tabs & Left/Right manual arrows (Play/Pause button removed) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Apple Liquid Glass Segmented Category Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 liquid-glass rounded-2xl overflow-x-auto no-scrollbar shadow-lg">
              {[
                { id: 'all', label: 'All Dishes' },
                { id: 'tiffin', label: 'Crispy Tiffin' },
                { id: 'meals', label: 'Sadya Feasts' },
                { id: 'beverage', label: 'Degree Brews' },
                { id: 'dessert', label: 'Sweets' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 whitespace-nowrap min-h-[38px] flex items-center justify-center ${
                    activeCategory === tab.id
                      ? 'bg-[#4F5A2A] text-[#FFF8E7] shadow-md shadow-[#4F5A2A]/20 scale-[1.02]'
                      : 'text-[#1F3A1F]/70 hover:text-[#1F3A1F] hover:bg-white/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Direction Arrows only (Play/Pause removed) */}
            <div className="flex items-center gap-1.5 p-1 liquid-glass rounded-2xl shadow-md">
              <button
                onClick={() => manualScroll('left')}
                aria-label="Previous dishes"
                className="p-2 rounded-xl text-[#4F5A2A] hover:bg-white/60 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => manualScroll('right')}
                aria-label="Next dishes"
                className="p-2 rounded-xl text-[#4F5A2A] hover:bg-white/60 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Shortlist reminder banner */}
        {shortlist.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl liquid-glass border border-white/80 text-[#1F3A1F] flex items-center justify-between text-xs sm:text-sm shadow-md">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3E7B3A]" />
              <strong>{shortlist.length} item{shortlist.length > 1 ? 's' : ''}</strong> saved for your table.
            </span>
            <button
              onClick={() => {
                const visitSection = document.getElementById('visit');
                visitSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#4F5A2A] hover:text-[#C8963E] underline font-semibold transition-colors"
            >
              Reserve a table to taste them →
            </button>
          </div>
        )}
      </div>

      {/* ================= INFINITE AUTO-ROTATING & HORIZONTAL SWIPEABLE TRACK ================= */}
      {/* Works seamlessly with native horizontal swipe on mobile and auto-rotates continuously */}
      <div className="w-full relative z-10">
        <div
          ref={viewportRef}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y', overscrollBehaviorX: 'contain' }}
        >
        <div
          ref={trackRef}
          className="relative flex items-stretch gap-5 sm:gap-8 px-6 sm:px-12 py-4 w-max will-change-transform"
        >
          {loopedDishes.map((dish, idx) => {
            const isDuplicate = idx >= filteredDishes.length;
            return (
              <div
                key={`${dish.id}-${idx}`}
                data-set={Math.floor(idx / filteredDishes.length)}
                aria-hidden={isDuplicate}
                className="w-[275px] sm:w-[340px] md:w-[370px] shrink-0 liquid-glass liquid-glass-card rounded-3xl p-4 sm:p-6 border border-white/75 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_18px_45px_rgba(31,58,31,0.08)] backdrop-blur-md flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(31,58,31,0.13)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <div>
                  {/* REAL CRUNCHY DISH PHOTOGRAPHY IN LIQUID GLASS BEZEL */}
                  <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/60 shadow-inner bg-[#F3EBD4]">
                    {!imageErrors[`${dish.id}-${idx}`] && dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        onError={() => handleImageError(`${dish.id}-${idx}`)}
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                    ) : (
                      <DishSvgPlateFallback dishId={dish.id} />
                    )}

                    {/* Specular reflection sheen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/20 pointer-events-none" />

                    {/* Tag badge with liquid glass aesthetic */}
                    {dish.tag && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[#FFF8E7] bg-[#4F5A2A]/85 backdrop-blur-md border border-white/30 shadow-md">
                        {dish.tag}
                      </div>
                    )}

                    {/* Quick view button */}
                    <button
                      onClick={() => setSelectedDish(dish)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/75 hover:bg-white text-[#1F3A1F] backdrop-blur-md shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                      aria-label={`View details of ${dish.name}`}
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title and Regional translation */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg sm:text-2xl text-[#1F3A1F] font-bold group-hover:text-[#4F5A2A] transition-colors leading-snug">
                        {dish.name}
                      </h3>
                      <span className="text-xs font-medium text-[#7A7F45] shrink-0 font-yatra">
                        {dish.regionalName}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs sm:text-sm text-[#1F3A1F]/75 font-light leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Highlight pill, price, and shortlist toggle */}
                <div className="mt-4 pt-3.5 border-t border-[#1F3A1F]/10 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] tracking-wider uppercase text-[#7A7F45] font-semibold">
                      {dish.tag || `${dish.spiceLevel} Spice`}
                    </span>
                    <span className="font-display text-lg sm:text-xl font-bold text-[#1F3A1F]">
                      ₹{dish.price}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleShortlist(dish.id)}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 min-h-[36px] ${
                      shortlist.includes(dish.id)
                        ? 'bg-[#3E7B3A] text-white shadow-md'
                        : 'liquid-glass hover:bg-[#4F5A2A] hover:text-[#FFF8E7] text-[#1F3A1F] border border-white/60'
                    }`}
                  >
                    {shortlist.includes(dish.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Shortlist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Detail Modal Dialog - Apple Liquid Glass Aesthetic */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl liquid-glass-subtle border border-white/80 bg-[#FFF8E7]/95 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-md animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 text-[#1F3A1F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/60 shadow-md bg-[#F3EBD4]">
              {selectedDish.image && !imageErrors[`modal-${selectedDish.id}`] ? (
                <img
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  className="w-full h-full object-cover object-center"
                  onError={() => handleImageError(`modal-${selectedDish.id}`)}
                />
              ) : (
                <DishSvgPlateFallback dishId={selectedDish.id} />
              )}
              {selectedDish.tag && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-[#FFF8E7] bg-[#4F5A2A]/90 backdrop-blur-md">
                  {selectedDish.tag}
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl sm:text-3xl text-[#1F3A1F] font-bold">
                  {selectedDish.name}
                </h3>
                <span className="text-sm font-medium text-[#7A7F45] font-yatra">
                  {selectedDish.regionalName}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#1F3A1F]/80 leading-relaxed font-light">
                {selectedDish.description}
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-[#4F5A2A]/10 border border-[#4F5A2A]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#7A7F45] font-semibold block">
                    Preparation & Serving
                  </span>
                  <span className="text-sm font-medium text-[#1F3A1F]">
                    {selectedDish.tag || `${selectedDish.spiceLevel} Spice`} · {selectedDish.ingredients.slice(0, 3).join(', ')}
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-[#1F3A1F]">
                  ₹{selectedDish.price}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => toggleShortlist(selectedDish.id)}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    shortlist.includes(selectedDish.id)
                      ? 'bg-[#3E7B3A] text-white'
                      : 'bg-[#4F5A2A] hover:bg-[#3d4621] text-[#FFF8E7] shadow-lg'
                  }`}
                >
                  {shortlist.includes(selectedDish.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved to Table Shortlist</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Table Shortlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
