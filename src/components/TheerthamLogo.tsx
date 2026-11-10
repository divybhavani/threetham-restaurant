import React from 'react';

interface TheerthamLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'loader';
  variant?: 'full' | 'mark' | 'horizontal';
  animated?: boolean;
  progress?: number;
  inverted?: boolean;
}

export const TheerthamLogo: React.FC<TheerthamLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  animated = false
}) => {
  // Official unedited restaurant logo
  const logoSrc = '/assets/aistudio/reslogo_87cb0913.jpeg';

  const sizeClasses = {
    sm: 'w-14 h-9 sm:w-16 sm:h-10',
    md: 'w-20 h-13 sm:w-24 sm:h-15',
    lg: 'w-32 h-20 sm:w-40 sm:h-26',
    hero: 'w-40 h-26 sm:w-52 sm:h-34',
    loader: 'w-48 h-31 sm:w-64 sm:h-41'
  }[size];

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="relative w-14 h-9 sm:w-16 sm:h-10 rounded-xl overflow-hidden shadow-md border border-white/20 shrink-0">
          <img
            src={logoSrc}
            alt="Theertham Logo"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Wordmark */}
        <div className="flex flex-col">
          <span className="font-display text-xl sm:text-2xl tracking-[0.14em] text-[#FFF8E7] leading-none font-bold drop-shadow-sm">
            THEERTHAM
          </span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#C8963E] font-medium mt-1">
            Tiffin & Meals · Nashik
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'mark') {
    return (
      <div
        className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 shadow-md border border-white/25 select-none group/logo transition-transform duration-300 hover:scale-105 ${className}`}
      >
        <img
          src={logoSrc}
          alt="Theertham Official Logo"
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  }

  // Full Variant
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <div
        className={`relative ${sizeClasses} rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/25 shrink-0 transition-transform duration-300 hover:scale-105`}
      >
        <img
          src={logoSrc}
          alt="Theertham Official Crest"
          className={`w-full h-full object-cover object-center ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      </div>

      <div className="text-center mt-3 sm:mt-4">
        <span className="block font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.16em] text-[#FFF8E7] font-bold drop-shadow-md">
          THEERTHAM
        </span>
        <span className="block text-xs sm:text-sm tracking-[0.25em] uppercase text-[#C8963E] font-medium mt-1">
          Pure Vegetarian · Tiffin & Meals · Nashik
        </span>
      </div>
    </div>
  );
};
