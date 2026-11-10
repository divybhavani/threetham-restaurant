import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
  type: 'petal' | 'ember';
  rotation: number;
}

export const AmbientParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || document.documentElement.classList.contains('lite')) {
      setEnabled(false);
      return;
    }

    const isMobile = window.innerWidth < 768;
    // Lighter on every device: 6 on phones, 12 on desktop (none in lite mode)
    const count = isMobile ? 6 : 12;

    const items: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage horizontal
      duration: 12 + Math.random() * 14, // seconds
      delay: Math.random() * 10,
      size: isMobile ? 4 + Math.random() * 4 : 5 + Math.random() * 6,
      type: i % 3 === 0 ? 'ember' : 'petal',
      rotation: Math.random() * 360
    }));

    setParticles(items);
  }, []);

  if (!enabled || particles.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes floatDownwards {
          0% {
            transform: translateY(-5vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(30px);
            opacity: 0;
          }
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            animation: `floatDownwards ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`
          }}
        >
          {p.type === 'petal' ? (
            // Jasmine / Marigold Petal
            <div
              className="w-full h-full rounded-full bg-[#FFF8E7]/60"
              style={{
                transform: `rotate(${p.rotation}deg)`
              }}
            />
          ) : (
            // Warm golden lamp ember
            <div
              className="w-full h-full rounded-full bg-[#E8A33D]/70"
              style={{
                transform: `rotate(${p.rotation}deg)`
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
