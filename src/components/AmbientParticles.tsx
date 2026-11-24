import React, { useMemo } from 'react';

export type ParticleTheme = 'cake' | 'garden' | 'letter' | 'night';

interface AmbientParticlesProps {
  theme: ParticleTheme;
}

interface FloatingItem {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  spinDeg: number;
  opacity: number;
  kind: 'heart' | 'star' | 'petal' | 'sparkle';
  color: string;
}

interface TwinkleStar {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ theme }) => {
  const floatingItems = useMemo<FloatingItem[]>(() => {
    const count = theme === 'garden' ? 24 : theme === 'night' ? 18 : 20;
    const palettes: Record<ParticleTheme, string[]> = {
      cake: ['#F472B6', '#C084FC', '#FBBF24', '#F9A8D4', '#E9D5FF'],
      garden: ['#F9A8D4', '#FBCFE8', '#F472B6', '#DDD6FE', '#FCE7F3'],
      letter: ['#F472B6', '#E879F9', '#C084FC', '#FBCFE8', '#FDA4AF'],
      night: ['#FDE68A', '#F9A8D4', '#C4B5FD', '#93C5FD', '#F472B6'],
    };

    const kindsByTheme: Record<ParticleTheme, FloatingItem['kind'][]> = {
      cake: ['heart', 'sparkle', 'star', 'heart'],
      garden: ['petal', 'petal', 'heart', 'petal', 'sparkle'],
      letter: ['heart', 'petal', 'sparkle', 'heart'],
      night: ['heart', 'sparkle', 'heart', 'sparkle'],
    };

    const colors = palettes[theme];
    const kinds = kindsByTheme[theme];

    return Array.from({ length: count }, (_, i) => {
      const s = i + (theme === 'cake' ? 10 : theme === 'garden' ? 110 : theme === 'letter' ? 210 : 310);
      const kind = kinds[i % kinds.length];
      return {
        id: i,
        left: 3 + seeded(s * 1.3) * 94,
        size: kind === 'petal' ? 14 + seeded(s * 2.1) * 12 : 10 + seeded(s * 2.1) * 12,
        duration: kind === 'petal' ? 10 + seeded(s * 3.7) * 8 : 11 + seeded(s * 3.7) * 10,
        delay: -(seeded(s * 4.9) * 14),
        driftX: (seeded(s * 5.3) - 0.5) * 90,
        spinDeg: (seeded(s * 6.1) - 0.5) * 80,
        opacity: theme === 'night' ? 0.55 + seeded(s * 7.2) * 0.35 : 0.42 + seeded(s * 7.2) * 0.38,
        kind,
        color: colors[i % colors.length],
      };
    });
  }, [theme]);

  const twinkleStars = useMemo<TwinkleStar[]>(() => {
    const count = theme === 'night' ? 56 : 22;
    return Array.from({ length: count }, (_, i) => {
      const s = i + (theme === 'night' ? 500 : 700);
      return {
        id: i,
        left: 2 + seeded(s * 1.7) * 96,
        top: 3 + seeded(s * 2.9) * (theme === 'night' ? 75 : 88),
        size: theme === 'night' ? 3 + seeded(s * 3.3) * 6 : 6 + seeded(s * 3.3) * 8,
        duration: 2.2 + seeded(s * 4.1) * 3.2,
        delay: seeded(s * 5.5) * 3.5,
        color:
          theme === 'night'
            ? i % 5 === 0
              ? '#FDE68A'
              : i % 4 === 0
                ? '#F9A8D4'
                : '#FFFFFF'
            : i % 2 === 0
              ? '#F59E0B'
              : '#D946EF',
      };
    });
  }, [theme]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Twinkling stars / sparkles */}
      {twinkleStars.map((star) => (
        <span
          key={`star-${theme}-${star.id}`}
          className="animate-twinkle absolute"
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            } as React.CSSProperties
          }
        >
          {theme === 'night' && star.size < 5.5 ? (
            <span
              className="block w-full h-full rounded-full"
              style={{
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              }}
            />
          ) : (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill={star.color}>
              <path d="M12 1.5L14.3 9.7L22.5 12L14.3 14.3L12 22.5L9.7 14.3L1.5 12L9.7 9.7L12 1.5Z" />
            </svg>
          )}
        </span>
      ))}

      {/* Floating hearts, petals, and glowing sparkles */}
      {floatingItems.map((item) => {
        const isPetal = item.kind === 'petal';
        return (
          <span
            key={`float-${theme}-${item.id}`}
            className={isPetal ? 'animate-petal-fall absolute top-0' : 'animate-float-up absolute top-0'}
            style={
              {
                left: `${item.left}%`,
                width: `${item.size}px`,
                height: `${item.size}px`,
                '--duration': `${item.duration}s`,
                '--delay': `${item.delay}s`,
                '--drift-x': `${item.driftX}px`,
                '--spin-deg': `${item.spinDeg}deg`,
                '--particle-opacity': item.opacity,
              } as React.CSSProperties
            }
          >
            {item.kind === 'heart' && (
              <svg viewBox="0 0 24 24" className="w-full h-full" fill={item.color}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
            {item.kind === 'petal' && (
              <svg viewBox="0 0 24 24" className="w-full h-full" fill={item.color}>
                <path d="M12 2C15.5 5 19 9.5 18.2 14.8C17.5 19 14.5 21.5 12 22C9.5 21.5 6.5 19 5.8 14.8C5 9.5 8.5 5 12 2Z" />
              </svg>
            )}
            {(item.kind === 'sparkle' || item.kind === 'star') && (
              <svg viewBox="0 0 24 24" className="w-full h-full" fill={item.color}>
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};
