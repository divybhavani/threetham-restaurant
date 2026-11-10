import React, { useState, useEffect } from 'react';
import { TheerthamLogo } from './TheerthamLogo';
import { Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
  onReserveClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReserveClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Our Story', href: '#story' },
    { label: 'Signature Dishes', href: '#dishes' },
    { label: 'Culture', href: '#culture' },
    { label: 'Ambience', href: '#ambience' },
    { label: 'Visit Us', href: '#visit' }
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
          scrolled
            ? 'bg-black/40 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
            : 'bg-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 sm:gap-8">
          {/* Zone 1: Brand Wordmark & Seal */}
          <a
            href="#"
            className="flex items-center gap-3 group whitespace-nowrap shrink-0 text-[#FFF8E7]"
            aria-label="Theertham Pure Vegetarian South Indian Restaurant"
          >
            <TheerthamLogo size="sm" variant="mark" />
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl tracking-[0.14em] font-bold text-[#FFF8E7] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] group-hover:text-[#E8D49E] transition-colors">
                THEERTHAM
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#E8D49E] font-medium mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                Tiffin & Meals · Nashik
              </span>
            </div>
          </a>

          {/* Zone 2: Clean Single-Line Nav Links with NO background section (only words) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-[#FFF8E7] hover:text-[#E8D49E] font-medium text-sm tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 relative py-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E8D49E] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action CTA + Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReserveClick}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#FFF8E7] bg-[#4F5A2A] hover:bg-[#3D4720] active:bg-[#2D3517] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-[#C8963E]/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0 min-h-[42px]"
            >
              Reserve Table
            </button>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#FFF8E7] hover:text-[#E8D49E] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-[82vw] max-w-sm bg-[#FFF8E7] border-l border-[#1F3A1F]/20 p-6 flex flex-col justify-between pt-20 pb-8 shadow-2xl text-[#182B14] backdrop-blur-md animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#1F3A1F]/15">
                <TheerthamLogo size="md" variant="full" />
              </div>
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className="text-base font-semibold text-[#182B14] hover:text-[#4F5A2A] py-2.5 px-3 rounded-xl hover:bg-[#182B14]/5 transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#1F3A1F]/15">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReserveClick();
                }}
                className="w-full py-3.5 text-center font-semibold tracking-wider uppercase text-[#FFF8E7] bg-[#4F5A2A] hover:bg-[#3D4720] rounded-xl shadow-md min-h-[44px]"
              >
                Reserve a Table
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-[#5B6631] font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#4F5A2A]" />
                <span>+91 98230 45678</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
