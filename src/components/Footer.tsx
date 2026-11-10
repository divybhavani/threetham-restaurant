import React from 'react';
import { TheerthamLogo } from './TheerthamLogo';
import { RESTAURANT_DATA } from '../data/restaurantData';
import { Phone, Mail, MapPin, Sparkles, Clock, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const scenicGlimpses = [
    {
      title: "Sacred Coconut Grove",
      subtitle: "Misty Tropical Canopy",
      image: "/hero-landscape-first.webp",
      tag: "Sanctuary"
    },
    {
      title: "Chettinad Pavilion",
      subtitle: "Carved Teak Pillars",
      image: "/hero-landscape-last.webp",
      tag: "Architecture"
    },
    {
      title: "Royal Kerala Sadya",
      subtitle: "24-Item Banana Leaf Feast",
      image: "/dishes/kerala_sadya.webp",
      tag: "Culinary"
    },
    {
      title: "Degree Filter Coffee",
      subtitle: "Brass Davarah Decoction",
      image: "/dishes/filter_coffee.webp",
      tag: "Tradition"
    }
  ];

  return (
    <footer className="relative w-full bg-[#182312] text-[#FFF8E7] overflow-hidden pt-20 pb-16 select-none border-t border-[#C8963E]/40">
      {/* Swaying Palm Silhouettes in the background */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-20 overflow-hidden flex justify-between items-end h-64">
        {/* Left swaying palms */}
        <div
          className="w-48 sm:w-64 h-full origin-bottom"
          style={{ animation: 'palmSwayLeft 7s ease-in-out infinite alternate' }}
        >
          <svg viewBox="0 0 100 120" className="w-full h-full text-[#0B150A]" fill="currentColor">
            <path d="M48 120 C45 80 50 40 45 20 M45 20 C35 10 20 8 5 15 M45 20 C35 2 20 -2 5 2 M45 20 C45 5 40 -8 30 -12 M45 20 C55 2 70 2 85 8 M45 20 C55 12 70 14 85 22" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </div>

        {/* Right swaying palms */}
        <div
          className="w-48 sm:w-64 h-full origin-bottom"
          style={{ animation: 'palmSwayRight 8.5s ease-in-out infinite alternate' }}
        >
          <svg viewBox="0 0 100 120" className="w-full h-full text-[#0B150A]" fill="currentColor">
            <path d="M52 120 C55 80 50 40 55 20 M55 20 C65 10 80 8 95 15 M55 20 C65 2 80 -2 95 2 M55 20 C55 5 60 -8 70 -12 M55 20 C45 2 30 2 15 8 M55 20 C45 12 30 14 15 22" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes palmSwayLeft {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(3.5deg); }
        }
        @keyframes palmSwayRight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-3.5deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* ================= IMPROVED LOGO AT THE END ================= */}
        <div className="flex flex-col items-center text-center pb-12 border-b border-[#FFF8E7]/15">
          <TheerthamLogo size="lg" variant="full" />
          <p className="max-w-lg text-xs sm:text-sm text-[#FFF8E7]/80 mt-4 leading-relaxed font-light">
            Pure Vegetarian South Indian Tiffin & Traditional Banana-Leaf Sadya in Nashik, Maharashtra.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#C8963E] font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Athithi Devo Bhava · Gangapur Road, Nashik</span>
          </div>
        </div>

        {/* ================= SCENIC PHOTO RIBBON IN FOOTER SECTION ================= */}
        <div className="py-12 border-b border-[#FFF8E7]/15">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C8963E] font-semibold block">
                Visual Journey
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8E7]">
                Glimpses of Theertham
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs text-[#FFF8E7]/60 font-light">
              Nashik's South Indian Haven
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scenicGlimpses.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/40 backdrop-blur-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase bg-[#202E18]/80 text-[#C8963E] border border-[#C8963E]/40 backdrop-blur-md">
                  {item.tag}
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h4 className="font-display text-xs sm:text-sm font-semibold text-[#FFF8E7] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#FFF8E7]/70 font-light truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FOOTER NAVIGATION & INFORMATION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 text-xs sm:text-sm border-b border-[#FFF8E7]/15">
          {/* Col 1: Service Hours */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest text-[#C8963E] font-semibold mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Dining Hours</span>
            </h4>
            <p className="text-[#FFF8E7]/80">
              <strong>Morning Tiffin:</strong> 7:00 AM – 11:30 AM
            </p>
            <p className="text-[#FFF8E7]/80">
              <strong>Sadya Feast:</strong> 12:00 PM – 3:45 PM
            </p>
            <p className="text-[#FFF8E7]/80">
              <strong>Evening Tiffin:</strong> 6:30 PM – 10:45 PM
            </p>
            <p className="text-[11px] text-[#C8963E] pt-1">
              Open all 7 days · Valet Parking Available
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest text-[#C8963E] font-semibold mb-3 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Theertham</span>
            </h4>
            <div className="flex flex-col space-y-2 text-[#FFF8E7]/80">
              <a href="#story" className="hover:text-[#C8963E] transition-colors">Our Story & Heritage</a>
              <a href="#dishes" className="hover:text-[#C8963E] transition-colors">Signature Dishes & Pricing</a>
              <a href="#culture" className="hover:text-[#C8963E] transition-colors">Kathakali & Sacred Sanctum</a>
              <a href="#ambience" className="hover:text-[#C8963E] transition-colors">The Light of Theertham</a>
              <a href="#visit" className="hover:text-[#C8963E] transition-colors">Table Reservation</a>
            </div>
          </div>

          {/* Col 3: Direct Contact & Location */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest text-[#C8963E] font-semibold mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Contact & Location</span>
            </h4>
            <p className="flex items-start gap-2 text-[#FFF8E7]/80">
              <MapPin className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
              <span>{RESTAURANT_DATA.address}</span>
            </p>
            <p className="flex items-center gap-2 text-[#FFF8E7]/80 pt-1">
              <Phone className="w-4 h-4 text-[#C8963E] shrink-0" />
              <span>{RESTAURANT_DATA.phone}</span>
            </p>
            <p className="flex items-center gap-2 text-[#FFF8E7]/80">
              <Mail className="w-4 h-4 text-[#C8963E] shrink-0" />
              <span>{RESTAURANT_DATA.email}</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF8E7]/60">
          <p>© {new Date().getFullYear()} THEERTHAM RESTAURANT. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[#C8963E] font-serif italic text-xs">
            <span>अन्नदाता सुखीभव</span>
            <span>·</span>
            <span>May all who nourish and partake be blessed with happiness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
