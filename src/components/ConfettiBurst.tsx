import React, { useEffect, useRef } from 'react';

interface ConfettiBurstProps {
  active: boolean;
  continuous?: boolean;
  palette?: string[];
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'heart' | 'star';
  alpha: number;
  wobble: number;
  wobbleSpeed: number;
}

const DEFAULT_PALETTE = [
  '#F472B6',
  '#FB7185',
  '#C084FC',
  '#FBBF24',
  '#FDE68A',
  '#60A5FA',
  '#F9A8D4',
  '#A78BFA',
];

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  active,
  continuous = false,
  palette = DEFAULT_PALETTE,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const shapes: ConfettiPiece['shape'][] = ['rect', 'circle', 'heart', 'star'];

    const spawnPiece = (fromTop: boolean): ConfettiPiece => {
      if (fromTop) {
        return {
          x: Math.random() * width,
          y: -15 - Math.random() * 60,
          vx: (Math.random() - 0.5) * 1.4,
          vy: 1.4 + Math.random() * 2.2,
          size: 5 + Math.random() * 6,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          alpha: 0.9,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.04 + Math.random() * 0.05,
        };
      }

      // Celebratory fountain burst from center-bottom / center
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.65;
      const speed = 6 + Math.random() * 9.5;
      return {
        x: width * (0.25 + Math.random() * 0.5),
        y: height * 0.52,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 6 + Math.random() * 6,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        alpha: 1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.05,
      };
    };

    const pieces: ConfettiPiece[] = [];
    const initialCount = continuous ? 55 : 120;
    for (let i = 0; i < initialCount; i++) {
      pieces.push(spawnPiece(continuous && i < 30));
    }

    let rafId = 0;
    let frame = 0;

    const drawHeart = (c: CanvasRenderingContext2D, s: number) => {
      c.beginPath();
      c.moveTo(0, s * 0.35);
      c.bezierCurveTo(s * 0.55, -s * 0.35, s * 1.1, s * 0.3, 0, s * 1.05);
      c.bezierCurveTo(-s * 1.1, s * 0.3, -s * 0.55, -s * 0.35, 0, s * 0.35);
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, r: number) => {
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2;
        c.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        c.lineTo(Math.cos(ang + Math.PI / 4) * (r * 0.38), Math.sin(ang + Math.PI / 4) * (r * 0.38));
      }
      c.closePath();
      c.fill();
    };

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      if (continuous && frame % 12 === 0 && pieces.length < 70) {
        pieces.push(spawnPiece(true));
      }

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.65;
        p.y += p.vy;
        p.vy = Math.min(p.vy + (continuous ? 0.03 : 0.14), 4.6);
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        if (!continuous && p.y > height * 0.85) {
          p.alpha -= 0.015;
        }

        if (p.y > height + 30 || p.alpha <= 0.02) {
          if (continuous) {
            pieces[i] = spawnPiece(true);
          } else {
            pieces.splice(i, 1);
          }
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'heart') {
          drawHeart(ctx, p.size * 0.62);
        } else {
          drawStar(ctx, p.size * 0.62);
        }

        ctx.restore();
      }

      if (pieces.length > 0 || continuous) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, continuous, palette]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 w-full h-full"
      aria-hidden="true"
    />
  );
};
