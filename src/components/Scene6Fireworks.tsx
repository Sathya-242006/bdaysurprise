import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { ConfettiBurst } from './ConfettiBurst';
import { VILLAGE_NIGHT_IMG } from './VillageProps';

interface Scene6FireworksProps {
  onCountdownTick: (step: number) => void;
  onFireworkBurst: (intensity?: number) => void;
  onLaunchFinale: () => void;
  onReplay: () => void;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number }[];
  pattern: 'chrysanthemum' | 'ring' | 'heart' | 'willow' | 'multicolor';
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  twinkle: boolean;
}

interface TextFireworkSpark {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  phase: number;
  settled: boolean;
}

const COLORS = [
  '#FDE047', // Gold
  '#F472B6', // Pink
  '#C084FC', // Purple
  '#60A5FA', // Sky Blue
  '#FB7185', // Coral Rose
  '#38BDF8', // Bright Cyan
  '#FBBF24', // Warm Gold
  '#E879F9', // Lavender Pink
];

/**
 * Samples pixel coordinates from an offscreen canvas to form
 * sparkling firework particles spelling the exact text:
 *   "HAPPIE BDAY"
 *   "AMMU"
 */
function sampleFireworkTextTargets(width: number, height: number): { x: number; y: number; color: string }[] {
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  if (!octx) return [];

  const isSmall = width < 520;
  const isMedium = width < 900;

  // Generous bold legible sizing tailored cleanly to viewport width
  const fontSizeLine1 = isSmall
    ? Math.floor(width / 7.8)
    : isMedium
      ? Math.floor(width / 9.2)
      : Math.min(106, Math.floor(width / 10.8));
  const fontSizeLine2 = Math.floor(fontSizeLine1 * 1.18);

  const line1Y = isSmall ? height * 0.29 : height * 0.28;
  const line2Y = line1Y + fontSizeLine1 * 1.24;

  octx.clearRect(0, 0, width, height);
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillStyle = '#FFFFFF';

  octx.font = `900 ${fontSizeLine1}px "Plus Jakarta Sans", "Arial Black", sans-serif`;
  octx.fillText('HAPPIE BDAY', width / 2, line1Y);

  octx.font = `900 ${fontSizeLine2}px "Plus Jakarta Sans", "Arial Black", sans-serif`;
  octx.fillText('AMMU', width / 2, line2Y);

  const img = octx.getImageData(0, 0, width, height).data;
  const step = isSmall ? 3 : isMedium ? 4 : 5;
  const targets: { x: number; y: number; color: string }[] = [];

  for (let y = Math.floor(height * 0.12); y < Math.floor(height * 0.65); y += step) {
    for (let x = Math.floor(width * 0.03); x < Math.floor(width * 0.97); x += step) {
      const idx = (y * width + x) * 4;
      if (img[idx + 3] > 140) {
        // Assign sparkling gold/pink/lavender/blue firework colors across letters
        const ratioX = x / width;
        const isSecondLine = y > (line1Y + line2Y) / 2;
        let color = '#FEF08A';
        if (isSecondLine) {
          color = ratioX < 0.44 ? '#F472B6' : ratioX < 0.56 ? '#FEF08A' : '#E879F9';
        } else {
          if (ratioX < 0.34) color = '#FDE047';
          else if (ratioX < 0.54) color = '#F472B6';
          else if (ratioX < 0.72) color = '#C084FC';
          else color = '#60A5FA';
        }
        targets.push({ x, y, color });
      }
    }
  }

  return targets;
}

export const Scene6Fireworks: React.FC<Scene6FireworksProps> = ({
  onCountdownTick,
  onFireworkBurst,
  onLaunchFinale,
  onReplay,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [started, setStarted] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const [nightBgErr, setNightBgErr] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const launchManualRef = useRef<((x?: number, y?: number) => void) | null>(null);
  const burstCbRef = useRef(onFireworkBurst);
  const finaleCbRef = useRef(onLaunchFinale);
  const tickCbRef = useRef(onCountdownTick);

  useEffect(() => {
    burstCbRef.current = onFireworkBurst;
    finaleCbRef.current = onLaunchFinale;
    tickCbRef.current = onCountdownTick;
  }, [onFireworkBurst, onLaunchFinale, onCountdownTick]);

  // 3 - 2 - 1 Countdown -> Launch Fireworks & Sparkling "HAPPIE BDAY AMMU"
  useEffect(() => {
    tickCbRef.current(3);
    const t2 = window.setTimeout(() => {
      setCountdown(2);
      tickCbRef.current(2);
    }, 950);
    const t1 = window.setTimeout(() => {
      setCountdown(1);
      tickCbRef.current(1);
    }, 1900);
    const tGo = window.setTimeout(() => {
      setCountdown(0);
      setStarted(true);
      finaleCbRef.current();
    }, 2850);
    const tClosing = window.setTimeout(() => {
      setShowClosing(true);
    }, 5600);

    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t1);
      window.clearTimeout(tGo);
      window.clearTimeout(tClosing);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    let textSparks: TextFireworkSpark[] = [];
    let textFormed = false;

    const buildTextFireworks = () => {
      const targets = sampleFireworkTextTargets(width, height);
      const origins = [
        { x: width * 0.28, y: height * 0.34 },
        { x: width * 0.5, y: height * 0.32 },
        { x: width * 0.72, y: height * 0.34 },
      ];
      textSparks = targets.map((t, idx) => {
        const origin = origins[idx % origins.length];
        const angle = Math.random() * Math.PI * 2;
        const kick = 2 + Math.random() * 5;
        return {
          x: origin.x + (Math.random() - 0.5) * 16,
          y: origin.y + (Math.random() - 0.5) * 16,
          tx: t.x,
          ty: t.y,
          vx: Math.cos(angle) * kick,
          vy: Math.sin(angle) * kick,
          color: t.color,
          size: width < 520 ? 1.85 : 2.35,
          phase: Math.random() * Math.PI * 2,
          settled: false,
        };
      });
      textFormed = true;
      burstCbRef.current(1.0);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (textFormed) {
        buildTextFireworks();
      }
    };
    window.addEventListener('resize', handleResize);

    const patterns: Rocket['pattern'][] = [
      'chrysanthemum',
      'multicolor',
      'ring',
      'willow',
      'heart',
    ];

    const createExplosion = (
      x: number,
      y: number,
      baseColor: string,
      pattern: Rocket['pattern']
    ) => {
      const altColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      if (pattern === 'heart') {
        const count = 60;
        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 2;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          );
          const scale = 0.22 + Math.random() * 0.04;
          sparks.push({
            x,
            y,
            vx: hx * scale,
            vy: hy * scale,
            alpha: 1,
            decay: 0.012 + Math.random() * 0.008,
            color: i % 3 === 0 ? '#FEF08A' : '#F472B6',
            size: 2.2 + Math.random() * 1.2,
            gravity: 0.032,
            twinkle: true,
          });
        }
      } else if (pattern === 'ring') {
        const count = 52;
        const spd = 3.5 + Math.random() * 1.6;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          sparks.push({
            x,
            y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            alpha: 1,
            decay: 0.014 + Math.random() * 0.008,
            color: i % 2 === 0 ? baseColor : '#FFFBEB',
            size: 2.1 + Math.random() * 1.1,
            gravity: 0.045,
            twinkle: i % 2 === 0,
          });
        }
      } else {
        const count = pattern === 'willow' ? 76 : 68;
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 1.4 + Math.random() * 4.8;
          const color =
            pattern === 'multicolor'
              ? COLORS[i % COLORS.length]
              : i % 4 === 0
                ? altColor
                : baseColor;
          sparks.push({
            x,
            y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            alpha: 1,
            decay: pattern === 'willow' ? 0.009 + Math.random() * 0.006 : 0.014 + Math.random() * 0.01,
            color,
            size: 1.7 + Math.random() * 2.0,
            gravity: pattern === 'willow' ? 0.064 : 0.046,
            twinkle: Math.random() > 0.4,
          });
        }
      }

      if (Math.random() > 0.35) {
        burstCbRef.current(0.6 + Math.random() * 0.35);
      }
    };

    const launchRocket = (targetX?: number, targetY?: number) => {
      const zone = Math.random();
      const destX =
        targetX !== undefined
          ? targetX
          : zone < 0.35
            ? width * (0.08 + Math.random() * 0.22)
            : zone < 0.7
              ? width * (0.7 + Math.random() * 0.22)
              : width * (0.18 + Math.random() * 0.64);

      const destY =
        targetY !== undefined
          ? Math.max(height * 0.08, Math.min(height * 0.6, targetY))
          : zone >= 0.7
            ? height * (0.08 + Math.random() * 0.13)
            : height * (0.14 + Math.random() * 0.36);

      const startX = destX + (Math.random() - 0.5) * 70;
      const travelY = height - destY;
      const vy = -Math.sqrt(2 * 0.145 * travelY) - 0.7;
      const flightFrames = Math.abs(vy / 0.145);
      const vx = (destX - startX) / Math.max(flightFrames, 24);

      rockets.push({
        x: startX,
        y: height + 8,
        vx,
        vy,
        targetY: destY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        trail: [],
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
      });
    };

    launchManualRef.current = launchRocket;

    // Launch initial celebratory salvo, then ignite the centerpiece firework text "HAPPIE BDAY AMMU"
    launchRocket(width * 0.18, height * 0.22);
    window.setTimeout(() => launchRocket(width * 0.82, height * 0.22), 180);
    window.setTimeout(() => launchRocket(width * 0.5, height * 0.3), 380);
    const textBurstTimer = window.setTimeout(() => {
      buildTextFireworks();
    }, 950);

    let rafId = 0;
    let lastAutoLaunch = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      frame++;
      // Crisp trail fade preserving night village hills backdrop underneath
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.23)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Continuous colorful background fireworks
      if (now - lastAutoLaunch > 860) {
        launchRocket();
        if (Math.random() > 0.56) {
          window.setTimeout(() => launchRocket(), 220);
        }
        lastAutoLaunch = now;
      }

      // Update & draw ascending rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 9) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.145;

        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          const ratio = (t + 1) / r.trail.length;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.3 * ratio, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = ratio * 0.8;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        if (r.vy >= -0.4 || r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color, r.pattern);
          rockets.splice(i, 1);
        }
      }

      // Update & draw normal explosion sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.974;
        s.vy *= 0.974;
        s.vy += s.gravity;
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0.02) {
          sparks.splice(i, 1);
          continue;
        }

        const flicker = s.twinkle ? 0.65 + Math.random() * 0.45 : 1;
        ctx.globalAlpha = Math.max(0, s.alpha * flicker);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }

      // Update & draw sparkling FIREWORK-FORMED TEXT: "HAPPIE BDAY AMMU"
      if (textFormed && textSparks.length > 0) {
        for (let i = 0; i < textSparks.length; i++) {
          const p = textSparks[i];
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;

          // Springy firework attraction into letter positions
          p.vx = p.vx * 0.82 + dx * 0.085;
          p.vy = p.vy * 0.82 + dy * 0.085;
          p.x += p.vx;
          p.y += p.vy;

          const shimmer = 0.68 + Math.sin(frame * 0.14 + p.phase) * 0.32;
          const jitterX = Math.sin(frame * 0.25 + p.phase) * 0.55;
          const jitterY = Math.cos(frame * 0.22 + p.phase) * 0.55;

          // Colored glowing outer firework spark
          ctx.globalAlpha = shimmer;
          ctx.beginPath();
          ctx.arc(p.x + jitterX, p.y + jitterY, p.size * 1.45, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Hot sparkling white center core
          ctx.globalAlpha = Math.min(1, shimmer + 0.2);
          ctx.beginPath();
          ctx.arc(p.x + jitterX, p.y + jitterY, p.size * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // Occasionally shed a tiny glowing falling stardust ember from the letters!
          if (frame % 4 === 0 && Math.random() > 0.9965 && sparks.length < 750) {
            sparks.push({
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 0.5,
              vy: 0.35 + Math.random() * 0.7,
              alpha: 0.88,
              decay: 0.024,
              color: p.color,
              size: 1.4,
              gravity: 0.03,
              twinkle: true,
            });
          }
        }
      }

      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.clearTimeout(textBurstTimer);
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [started]);

  const handleSkyTap = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!started) return;
      if ((e.target as HTMLElement).closest('button')) return;
      launchManualRef.current?.(e.clientX, e.clientY);
    },
    [started]
  );

  const handleLaunchExtra = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    launchManualRef.current?.(w * 0.16, h * 0.2);
    window.setTimeout(() => launchManualRef.current?.(w * 0.84, h * 0.2), 170);
    window.setTimeout(() => launchManualRef.current?.(w * 0.5, h * 0.12), 340);
  };

  return (
    <section
      aria-label="Scene 6: Grand Birthday Crackers"
      onClick={handleSkyTap}
      className={`relative min-h-screen w-full flex flex-col justify-between px-5 pt-20 pb-10 sm:px-8 overflow-hidden ${
        started ? 'cursor-crosshair' : ''
      }`}
    >
      {/* Night Sky Above the Same Peaceful Village Hills Silhouette */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {!nightBgErr ? (
          <img
            src={VILLAGE_NIGHT_IMG}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setNightBgErr(true)}
            className="w-full h-full object-cover object-bottom"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#070620] via-[#1B1048] to-[#2E135B]" />
        )}
        {/* Subtle dark velvet contrast vignette in the upper sky so firework letters blaze brilliantly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6, 5, 24, 0.56) 0%, rgba(16, 10, 44, 0.42) 55%, rgba(12, 8, 32, 0.25) 100%)',
          }}
        />
      </div>

      {/* Fireworks Canvas (renders both colorful sky crackers AND sparkling firework-formed "HAPPIE BDAY AMMU") */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Colorful night sky fireworks forming sparkling letters HAPPIE BDAY AMMU"
        className="pointer-events-none fixed inset-0 z-20 w-full h-full"
      />

      {/* Celebratory Falling Confetti */}
      <ConfettiBurst
        active={started}
        continuous={true}
        palette={['#FDE047', '#F472B6', '#C084FC', '#60A5FA', '#FBCFE8', '#FFFFFF']}
      />

      {/* Center Countdown Stage (disappears cleanly once fireworks take over the sky!) */}
      <div className="relative z-30 flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              key={`cnt-${countdown}`}
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-3"
            >
              <span className="text-sm sm:text-base font-medium text-purple-200 tracking-wide">
                Look up at the village night sky…
              </span>
              <span
                className="animate-birthday-glow text-7xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#FDE047] to-[#F472B6] tabular-nums"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Closing Message & Interactive Finale Buttons (positioned below firework sky text) */}
      <div className="relative z-30 w-full max-w-2xl mx-auto flex flex-col items-center text-center pb-2">
        <AnimatePresence>
          {showClosing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-[#0D0828]/68 backdrop-blur-md border border-white/18 px-6 py-5 sm:px-9 sm:py-6 shadow-[0_18px_52px_rgba(0,0,0,0.5)]"
            >
              <p
                className="text-xl sm:text-3xl font-semibold text-[#FDF2F8] leading-snug"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                You are special. Keep smiling and keep shining! ❤️
              </p>

              <p className="mt-2 text-xs sm:text-sm text-purple-200/80">
                Tap anywhere in the night sky to launch more birthday crackers
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunchExtra}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#EC4899] via-[#D946EF] to-[#8B5CF6] text-white font-semibold text-sm sm:text-base shadow-[0_10px_28px_rgba(236,72,153,0.42)] hover:brightness-110 active:scale-95 transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Launch More Fireworks</span>
                </button>

                <button
                  type="button"
                  onClick={onReplay}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-white/14 hover:bg-white/24 text-pink-100 border border-white/25 font-medium text-sm sm:text-base backdrop-blur-sm active:scale-95 transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Replay Story</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
