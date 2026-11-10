import React, { useRef, useState, useEffect } from 'react';
import { RESTAURANT_DATA } from '../data/restaurantData';
import { Star, ChevronLeft, ChevronRight, Quote, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const reviews = RESTAURANT_DATA.reviews;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.85;
      const offset = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToReview = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const children = container.children;
      if (children[index]) {
        (children[index] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth * 0.85;
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), reviews.length - 1));
  };

  // Mouse Drag Support for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="relative w-full py-20 sm:py-28 bg-[#FFF8E7] text-[#1F3A1F] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 border-b border-[#1F3A1F]/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#7A7F45] mb-2">
              <Heart className="w-3.5 h-3.5 text-[#B3261E]" />
              <span>Words from our Guests</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-[#1F3A1F] font-bold">
              Echoes of the Feast
            </h2>
            <p className="text-xs sm:text-sm text-[#1F3A1F]/70 font-light mt-1">
              Swipe horizontally to read experiences from dining across Maharashtra.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-[#F3EBD4] hover:bg-[#4F5A2A] hover:text-white transition-colors border border-[#C8963E]/30 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-[#F3EBD4] hover:bg-[#4F5A2A] hover:text-white transition-colors border border-[#C8963E]/30 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel with Native Mobile Touch Swipe & Snap */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory px-1 ${
            isDragging ? 'cursor-grabbing active:scale-[0.99]' : ''
          }`}
          style={{
            touchAction: 'pan-x pan-y',
            overscrollBehaviorX: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {reviews.map((rev, idx) => (
            <div
              key={rev.id}
              className="w-[84vw] sm:w-[420px] shrink-0 snap-center liquid-glass liquid-glass-card p-6 sm:p-8 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_18px_40px_rgba(31,58,31,0.08)] backdrop-blur-md flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(31,58,31,0.13)] rounded-tl-[40px] rounded-br-[40px] rounded-tr-2xl rounded-bl-2xl relative overflow-hidden"
            >
              {/* Subtle leaf stem line watermark */}
              <svg
                viewBox="0 0 100 100"
                className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none text-[#3E7B3A]"
                fill="none"
              >
                <path d="M10 90 Q60 50 90 10" stroke="currentColor" strokeWidth="4" />
                <path d="M40 65 Q55 55 70 60" stroke="currentColor" strokeWidth="2.5" />
                <path d="M60 45 Q75 35 90 40" stroke="currentColor" strokeWidth="2.5" />
              </svg>

              <div>
                {/* Star rating + quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C8963E] text-[#C8963E]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#4F5A2A]/25" />
                </div>

                <h3 className="font-display text-base sm:text-xl font-bold text-[#1F3A1F] mb-2 sm:mb-3">
                  "{rev.tagline}"
                </h3>

                <p className="text-xs sm:text-sm text-[#1F3A1F]/85 leading-relaxed font-light">
                  {rev.comment}
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-[#1F3A1F]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm sm:text-base font-bold text-[#4F5A2A]">
                    {rev.author}
                  </h4>
                  <span className="text-xs text-[#1F3A1F]/60">
                    {rev.location}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#7A7F45]">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:hidden">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToReview(idx)}
              aria-label={`Go to review ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 bg-[#4F5A2A]'
                  : 'w-2 bg-[#4F5A2A]/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
