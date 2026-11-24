import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Wind } from 'lucide-react';
import { BoyCharacter, BunnyCharacter, GirlCharacter, TulipBouquetSVG } from './Characters';
import { FairytaleCakeSVG, VillageLandscape } from './VillageProps';
import { ConfettiBurst } from './ConfettiBurst';

interface Scene4CandleBlowingProps {
  onBlowStart: () => void;
  onCandlesExtinguished: () => void;
  onNext: () => void;
}

type BlowPhase = 'lit' | 'blowing' | 'celebrating';

export const Scene4CandleBlowing: React.FC<Scene4CandleBlowingProps> = ({
  onBlowStart,
  onCandlesExtinguished,
  onNext,
}) => {
  const [phase, setPhase] = useState<BlowPhase>('lit');

  const handleBlowCandles = () => {
    if (phase !== 'lit') return;
    setPhase('blowing');
    onBlowStart();

    window.setTimeout(() => {
      setPhase('celebrating');
      onCandlesExtinguished();
    }, 780);
  };

  const isBlowing = phase === 'blowing';
  const isCelebrating = phase === 'celebrating';

  return (
    <section
      aria-label="Scene 4: Candle Blowing and Birthday Song"
      className="relative min-h-screen w-full flex flex-col justify-between pt-20 pb-8 px-4 sm:px-8 overflow-hidden"
    >
      <VillageLandscape dimOverlay showButterflies />
      <ConfettiBurst active={isCelebrating} continuous={isCelebrating} />

      {/* Top Birthday Message Banner */}
      <div className="relative z-20 w-full max-w-3xl mx-auto text-center pt-2 min-h-[104px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isCelebrating ? (
            <motion.div
              key="blow-prompt"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl bg-white/82 backdrop-blur-md border border-white/90 shadow-[0_10px_28px_rgba(82,27,58,0.12)] px-6 py-4 sm:px-8"
            >
              <h1
                className="text-xl sm:text-3xl font-semibold text-[#521B3A]"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                {isBlowing
                  ? 'Make a sweet wish together… 💨✨'
                  : 'Close your eyes, make a wish, and blow the candles together! 🕯️🎂'}
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="happiest-birthday"
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-white/90 backdrop-blur-md border border-pink-200 shadow-[0_16px_42px_rgba(219,39,119,0.24)] px-7 py-5 sm:px-10"
            >
              <h1
                className="animate-birthday-glow text-3xl sm:text-5xl font-bold text-[#9D174D]"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                Happiest Birthday, Vinu! 🎂💗
              </h1>
              <p className="mt-1.5 text-sm sm:text-base font-medium text-[#7A355B]">
                🎵 Playing &ldquo;Happy Birthday to You&rdquo; just for you!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Close-up Cake Table with Leaning Boy & Girl + Jumping Bunny */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-end pb-6 sm:pb-10">
        {/* Warm Glowing Fairy Lights Overhead */}
        <svg
          viewBox="0 0 640 50"
          className="w-full max-w-xl h-12 mb-1 overflow-visible"
          aria-hidden="true"
        >
          <path d="M10 8 Q320 48, 630 8" fill="none" stroke="#92400E" strokeWidth="2" opacity="0.5" />
          {[70, 140, 210, 280, 350, 420, 490, 560].map((lx, i) => (
            <g key={i}>
              <circle cx={lx} cy={14 + Math.sin((i / 7) * Math.PI) * 18} r="13" fill="#FEF08A" opacity="0.34" className="animate-twinkle" />
              <circle cx={lx} cy={14 + Math.sin((i / 7) * Math.PI) * 18} r="4.8" fill={i % 2 === 0 ? '#FEF08A' : '#FBCFE8'} />
            </g>
          ))}
        </svg>

        <div className="relative w-full flex items-end justify-center gap-1 sm:gap-4">
          {/* Boy (Vinu) Leaning Slightly Toward the Cake */}
          <motion.div
            animate={
              isBlowing
                ? { x: 14, rotate: 5 }
                : !isCelebrating
                  ? { x: 6, rotate: 2 }
                  : { x: 0, rotate: 0 }
            }
            transition={{ duration: 0.45 }}
            className="relative z-20"
          >
            {/* Shimmering wind puff from Vinu while blowing */}
            {isBlowing && (
              <motion.svg
                viewBox="0 0 70 40"
                initial={{ opacity: 0, x: 0, scale: 0.6 }}
                animate={{ opacity: [0.9, 0.7, 0], x: 38, scale: 1.25 }}
                transition={{ duration: 0.7 }}
                className="pointer-events-none absolute top-14 -right-10 w-16 h-10 z-30"
              >
                <path d="M6 18 Q28 12 52 18" stroke="#E0F2FE" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M10 26 Q32 24 60 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
              </motion.svg>
            )}
            <BoyCharacter
              pose={isBlowing ? 'blowing' : isCelebrating ? 'celebrating' : 'standing'}
              facing="right"
              className="w-26 sm:w-36 md:w-40"
            />
          </motion.div>

          {/* Center Birthday Cake on Decorated Table */}
          <div className="relative z-20 flex flex-col items-center">
            <div className="relative flex items-end justify-center -mb-3">
              <div className="hidden sm:block w-12 -mr-3 mb-2">
                <TulipBouquetSVG />
              </div>
              <FairytaleCakeSVG
                candlesLit={!isCelebrating}
                showSmoke={isCelebrating}
                className="w-44 sm:w-56 md:w-64"
              />
              <div className="hidden sm:block w-12 -ml-3 mb-2">
                <TulipBouquetSVG />
              </div>
            </div>

            {/* Wooden Tabletop Base */}
            <svg viewBox="0 0 320 75" className="w-56 sm:w-76 h-auto" aria-hidden="true">
              <rect x="44" y="24" width="16" height="50" rx="4" fill="#78350F" />
              <rect x="260" y="24" width="16" height="50" rx="4" fill="#78350F" />
              <rect x="12" y="10" width="296" height="22" rx="9" fill="#B45309" />
              <path
                d="M95 10 L225 10 L216 44 Q188 54 160 44 Q132 54 104 44 Z"
                fill="#FFF1F6"
                stroke="#F9A8D4"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Girl (Me) Leaning Slightly Toward the Cake */}
          <motion.div
            animate={
              isBlowing
                ? { x: -14, rotate: -5 }
                : !isCelebrating
                  ? { x: -6, rotate: -2 }
                  : { x: 0, rotate: 0 }
            }
            transition={{ duration: 0.45 }}
            className="relative z-20"
          >
            {/* Shimmering wind puff from Girl while blowing */}
            {isBlowing && (
              <motion.svg
                viewBox="0 0 70 40"
                initial={{ opacity: 0, x: 0, scale: 0.6 }}
                animate={{ opacity: [0.9, 0.7, 0], x: -38, scale: 1.25 }}
                transition={{ duration: 0.7 }}
                className="pointer-events-none absolute top-14 -left-10 w-16 h-10 z-30 -scale-x-100"
              >
                <path d="M6 18 Q28 12 52 18" stroke="#FCE7F3" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M10 26 Q32 24 60 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
              </motion.svg>
            )}
            <GirlCharacter
              pose={isBlowing ? 'blowing' : isCelebrating ? 'celebrating' : 'standing'}
              facing="left"
              className="w-26 sm:w-36 md:w-40"
            />
          </motion.div>

          {/* Fluffy White Bunny Sitting -> Jumping Happily! */}
          <div className="hidden md:flex items-end -ml-2 z-20">
            <BunnyCharacter
              pose={isCelebrating ? 'jumping' : 'sitting'}
              facing="left"
              className="w-28"
            />
          </div>
        </div>

        {/* Mobile Bunny positioned tidily beside the table */}
        <div className="md:hidden -mt-4 z-20">
          <BunnyCharacter
            pose={isCelebrating ? 'jumping' : 'sitting'}
            facing="right"
            className="w-22"
          />
        </div>
      </div>

      {/* Bottom Interactive Blow Button OR Continue to Letters */}
      <div className="relative z-30 min-h-[64px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'lit' && (
            <motion.button
              key="blow-candles-btn"
              type="button"
              onClick={handleBlowCandles}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base sm:text-lg shadow-[0_14px_34px_rgba(219,39,119,0.42)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <Wind className="w-5 h-5" aria-hidden="true" />
              <span>Blow the Candles Together!</span>
            </motion.button>
          )}

          {isCelebrating && (
            <motion.button
              key="next-scene-4"
              type="button"
              onClick={onNext}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center justify-center gap-2.5 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.4)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <span>Next: Birthday Letter 💌</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
