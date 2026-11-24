import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BoyCharacter, GirlCharacter } from './Characters';
import { VillageLandscape } from './VillageProps';

interface Scene1VillageWalkProps {
  onFirstInteraction: () => void;
  onNext: () => void;
}

type WalkPhase = 'walking' | 'sitting';

export const Scene1VillageWalk: React.FC<Scene1VillageWalkProps> = ({
  onFirstInteraction,
  onNext,
}) => {
  const [phase, setPhase] = useState<WalkPhase>('walking');

  useEffect(() => {
    const sitTimer = window.setTimeout(() => {
      setPhase('sitting');
    }, 3600);
    return () => window.clearTimeout(sitTimer);
  }, []);

  const isWalking = phase === 'walking';

  return (
    <section
      aria-label="Scene 1: Walking Through the Village Hills"
      onClick={onFirstInteraction}
      className="relative min-h-screen w-full flex flex-col justify-between pt-20 pb-8 px-4 sm:px-8 overflow-hidden"
    >
      <VillageLandscape showButterflies />

      {/* Top Fairytale Story Caption */}
      <div className="relative z-20 w-full max-w-2xl mx-auto text-center pt-2 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block rounded-3xl bg-white/75 backdrop-blur-md border border-white/80 shadow-[0_10px_30px_rgba(82,27,58,0.12)] px-6 py-4 sm:px-8 sm:py-5"
        >
          <p
            className="text-lg sm:text-2xl font-medium text-[#4A1936] leading-relaxed"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            &ldquo;A beautiful day, a beautiful place, and a little surprise waiting ahead…&rdquo;
          </p>
        </motion.div>
      </div>

      {/* Middle Village Pathway & Grassy Tulip Hill Character Stage */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex-1 flex items-end justify-center pb-8 sm:pb-12">
        {/* Winding sunlit dirt pathway leading across the green hills */}
        <svg
          viewBox="0 0 900 130"
          className="pointer-events-none absolute bottom-0 inset-x-0 w-full h-24 sm:h-28 opacity-75"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-20 112 Q240 65, 460 88 T920 70 L920 130 L-20 130 Z"
            fill="#FEF3C7"
            opacity="0.52"
          />
        </svg>

        {/* Walking -> Sitting Boy (Vinu) & Girl (Me) Pair */}
        <motion.div
          initial={{ x: '-42vw', scale: 0.86 }}
          animate={
            isWalking
              ? { x: 0, scale: 1 }
              : { x: 0, y: 12, scale: 1.04 }
          }
          transition={
            isWalking
              ? { duration: 3.55, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative flex items-end justify-center gap-1 sm:gap-3"
        >
          {/* Cute tiny resting speech bubble when they sit down */}
          <AnimatePresence>
            {!isWalking && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white/92 backdrop-blur-sm border border-pink-200 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#6D214F] shadow-md"
              >
                What a lovely tulip hill to rest on 🌸
              </motion.div>
            )}
          </AnimatePresence>

          <BoyCharacter
            pose={isWalking ? 'walking' : 'sitting'}
            facing="right"
            className="w-28 sm:w-36 md:w-40"
          />
          <GirlCharacter
            pose={isWalking ? 'walking' : 'sitting'}
            facing="right"
            className="w-28 sm:w-36 md:w-40 -ml-3 sm:-ml-2"
          />
        </motion.div>
      </div>

      {/* Bottom Interactive Story Progression */}
      <div className="relative z-30 min-h-[64px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isWalking ? (
            <motion.p
              key="walking-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs sm:text-sm font-medium text-white bg-[#4A1936]/55 backdrop-blur-md px-5 py-2 rounded-full"
            >
              Strolling together through the village hills...
            </motion.p>
          ) : (
            <motion.button
              key="next-scene-1"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFirstInteraction();
                onNext();
              }}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center gap-2.5 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.4)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <span>Continue the Story</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
