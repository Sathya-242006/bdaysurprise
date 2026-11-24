import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { BoyCharacter, BunnyCharacter, GirlCharacter, TulipBouquetSVG } from './Characters';
import { FairytaleCakeSVG, VillageLandscape } from './VillageProps';

interface Scene3HiddenCakeProps {
  onSurpriseDiscover: () => void;
  onNext: () => void;
}

type HideSeekPhase = 'girl_running' | 'boy_curious' | 'boy_searching' | 'discovered';

export const Scene3HiddenCake: React.FC<Scene3HiddenCakeProps> = ({
  onSurpriseDiscover,
  onNext,
}) => {
  const [phase, setPhase] = useState<HideSeekPhase>('girl_running');
  const [boyFacing, setBoyFacing] = useState<'right' | 'left'>('right');

  // Step 1: Girl playfully runs behind the big tree and hides
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPhase('boy_curious');
    }, 1850);
    return () => window.clearTimeout(timer);
  }, []);

  // Step 3: When Vinu searches around the tree -> looks left & right -> discovers hidden birthday setup!
  const handleSearchTree = () => {
    if (phase !== 'boy_curious') return;
    setPhase('boy_searching');
    setBoyFacing('right');

    window.setTimeout(() => setBoyFacing('left'), 950);
    window.setTimeout(() => setBoyFacing('right'), 1750);
    window.setTimeout(() => {
      setPhase('discovered');
      onSurpriseDiscover();
    }, 2350);
  };

  const isDiscovered = phase === 'discovered';

  return (
    <section
      aria-label="Scene 3: The Hidden Birthday Cake"
      className="relative min-h-screen w-full flex flex-col justify-between pt-20 pb-8 px-4 sm:px-8 overflow-hidden"
    >
      <VillageLandscape dimOverlay={isDiscovered} showButterflies />

      {/* Top Story Narrative Banner */}
      <div className="relative z-20 w-full max-w-2xl mx-auto text-center pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-3xl bg-white/82 backdrop-blur-md border border-white/90 shadow-[0_10px_28px_rgba(82,27,58,0.12)] px-6 py-3.5 sm:px-8 sm:py-4"
          >
            <p
              className="text-lg sm:text-2xl font-medium text-[#4A1936]"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              {phase === 'girl_running' &&
                'Hehe… wait right here, Vinu! Something magical is hiding nearby… 🌿'}
              {phase === 'boy_curious' &&
                'Wait… where did she go behind that big tree? 👀🌳'}
              {phase === 'boy_searching' &&
                'Vinu walks around the tree, peeking from side to side…'}
              {phase === 'discovered' &&
                'Surprise, Vinu! A hidden birthday celebration under the fairytale tree! 🎂✨'}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Interactive Fairytale Tree & Hidden Cake Table Stage */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex-1 flex items-end justify-center pb-6 sm:pb-10">
        {!isDiscovered ? (
          /* HIDE & SEEK BEHIND THE BIG TREE STAGE */
          <div className="relative w-full max-w-3xl h-[300px] sm:h-[360px] flex items-end justify-between px-4 sm:px-10">
            {/* Boy (Vinu) searching curiously around the tree */}
            <motion.div
              animate={
                phase === 'boy_searching'
                  ? { x: ['0%', '46%', '30%', '55%'], y: [0, -6, 0, -4] }
                  : { x: '0%', y: 0 }
              }
              transition={
                phase === 'boy_searching'
                  ? { duration: 2.3, ease: 'easeInOut' }
                  : { duration: 0.5 }
              }
              className="relative z-30 flex flex-col items-center"
            >
              {phase === 'boy_curious' && (
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="mb-1 rounded-2xl bg-white/95 border border-pink-200 px-3.5 py-1 text-sm font-bold text-[#9D174D] shadow-md"
                >
                  Where are you? 🤔
                </motion.span>
              )}
              <BoyCharacter
                pose={
                  phase === 'boy_searching'
                    ? 'walking'
                    : phase === 'boy_curious'
                      ? 'searching'
                      : 'standing'
                }
                holdingBouquet
                facing={boyFacing}
                className="w-28 sm:w-36 md:w-40"
              />
            </motion.div>

            {/* Girl playfully running behind the big tree & peeking out */}
            <motion.div
              initial={{ x: '-36vw', opacity: 1 }}
              animate={
                phase === 'girl_running'
                  ? { x: 0, opacity: 1 }
                  : { x: 18, opacity: 0.95 }
              }
              transition={{ duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-12 sm:right-24 bottom-2 z-10"
            >
              <GirlCharacter
                pose={phase === 'girl_running' ? 'running' : 'peeking'}
                facing={phase === 'girl_running' ? 'right' : 'left'}
                className="w-24 sm:w-32"
              />
            </motion.div>

            {/* Big Leafy Fairytale Tree (clickable to search!) */}
            <button
              type="button"
              onClick={handleSearchTree}
              disabled={phase !== 'boy_curious'}
              aria-label="Search around the big tree to find the hidden surprise"
              className={`relative z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899] rounded-3xl ${
                phase === 'boy_curious' ? 'cursor-pointer hover:scale-[1.02] transition-transform' : 'cursor-default'
              }`}
            >
              <svg
                viewBox="0 0 260 310"
                className="w-48 sm:w-64 h-auto overflow-visible drop-shadow-[0_16px_24px_rgba(20,83,45,0.28)]"
                role="img"
                aria-label="Big green fairytale tree"
              >
                <defs>
                  <linearGradient id="treeTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#92400E" />
                    <stop offset="45%" stopColor="#B45309" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <radialGradient id="canopyA" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#86EFAC" />
                    <stop offset="55%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#15803D" />
                  </radialGradient>
                </defs>
                {/* Ground shadow */}
                <ellipse cx="130" cy="296" rx="85" ry="14" fill="rgba(20, 83, 45, 0.25)" />
                {/* Trunk */}
                <path
                  d="M104 168 L92 292 Q130 302 168 292 L154 168 Z"
                  fill="url(#treeTrunk)"
                />
                {/* Plush 3D Leafy Canopy */}
                <circle cx="80" cy="126" r="64" fill="url(#canopyA)" />
                <circle cx="182" cy="126" r="62" fill="url(#canopyA)" />
                <circle cx="130" cy="76" r="74" fill="url(#canopyA)" />
                <circle cx="130" cy="134" r="56" fill="#4ADE80" opacity="0.65" />
                {/* Little pastel blossoms on the tree */}
                {[
                  { x: 92, y: 74, c: '#FBCFE8' },
                  { x: 168, y: 84, c: '#FEF08A' },
                  { x: 126, y: 46, c: '#F9A8D4' },
                  { x: 74, y: 128, c: '#DDD6FE' },
                  { x: 186, y: 132, c: '#FBCFE8' },
                ].map((b, i) => (
                  <circle key={i} cx={b.x} cy={b.y} r="6.5" fill={b.c} opacity="0.92" />
                ))}
              </svg>
            </button>
          </div>
        ) : (
          /* DISCOVERED MAGICAL BIRTHDAY SETUP: Wooden Table + Cake + Flowers + Bunny + Boy & Girl */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl flex flex-col items-center"
          >
            {/* Glowing Warm String Fairy Lights Draped Above the Setup */}
            <svg
              viewBox="0 0 680 65"
              className="w-full max-w-2xl h-14 sm:h-16 mb-2 overflow-visible"
              aria-hidden="true"
            >
              <path
                d="M10 10 Q175 56, 340 24 T670 12"
                fill="none"
                stroke="#78350F"
                strokeWidth="2.5"
                opacity="0.65"
              />
              {[68, 136, 204, 272, 340, 408, 476, 544, 612].map((lx, i) => {
                const ly = 16 + Math.sin((i / 8) * Math.PI) * 26;
                const colors = ['#FEF08A', '#F9A8D4', '#C4B5FD', '#FDE047'];
                const col = colors[i % colors.length];
                return (
                  <g key={i}>
                    <circle cx={lx} cy={ly} r="14" fill={col} opacity="0.32" className="animate-twinkle" />
                    <circle cx={lx} cy={ly} r="5.5" fill={col} />
                  </g>
                );
              })}
            </svg>

            {/* Characters Standing Together + Decorated Wooden Cake Table + Bunny */}
            <div className="relative w-full flex flex-wrap sm:flex-nowrap items-end justify-center gap-3 sm:gap-5">
              {/* Boy & Girl Standing Together Happily */}
              <div className="flex items-end justify-center">
                <BoyCharacter
                  pose="celebrating"
                  holdingBouquet
                  facing="right"
                  className="w-24 sm:w-32 md:w-36"
                />
                <motion.div
                  initial={{ x: 45, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GirlCharacter
                    pose="celebrating"
                    facing="right"
                    className="w-24 sm:w-32 md:w-36 -ml-4 sm:-ml-2"
                  />
                </motion.div>
              </div>

              {/* Decorated Rustic Wooden Table with Cake, Tulips & Flowers */}
              <div className="relative flex flex-col items-center">
                {/* Items on top of wooden table */}
                <div className="relative z-10 flex items-end justify-center -mb-3">
                  <div className="w-12 sm:w-14 -mr-3 mb-2">
                    <TulipBouquetSVG />
                  </div>
                  <FairytaleCakeSVG candlesLit className="w-36 sm:w-48" />
                  <div className="w-12 sm:w-14 -ml-3 mb-2">
                    <TulipBouquetSVG />
                  </div>
                </div>

                {/* Rustic Decorated Wooden Table SVG */}
                <svg
                  viewBox="0 0 320 110"
                  className="w-60 sm:w-76 h-auto drop-shadow-[0_14px_20px_rgba(120,53,15,0.28)]"
                  aria-label="Decorated wooden birthday table"
                >
                  <defs>
                    <linearGradient id="woodTop" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B45309" />
                      <stop offset="50%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>
                  </defs>
                  {/* Table legs */}
                  <rect x="44" y="34" width="18" height="72" rx="5" fill="#78350F" />
                  <rect x="258" y="34" width="18" height="72" rx="5" fill="#78350F" />
                  {/* Tabletop */}
                  <rect x="14" y="14" width="292" height="24" rx="10" fill="url(#woodTop)" />
                  {/* Pastel lace table runner draped across */}
                  <path
                    d="M95 14 L225 14 L218 52 Q195 62 175 52 Q160 62 145 52 Q125 62 102 52 Z"
                    fill="#FFF1F6"
                    stroke="#F9A8D4"
                    strokeWidth="2"
                  />
                  {/* Decorative pastel flowers along the table edge */}
                  {[46, 82, 238, 274].map((fx, i) => (
                    <circle key={i} cx={fx} cy={28} r="6.5" fill={i % 2 === 0 ? '#F472B6' : '#C084FC'} />
                  ))}
                </svg>
              </div>

              {/* Fluffy White Bunny Sitting Happily Beside the Cake */}
              <div className="flex items-end">
                <BunnyCharacter
                  pose="sitting"
                  facing="left"
                  className="w-22 sm:w-28 md:w-32"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="relative z-30 min-h-[64px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'boy_curious' && (
            <motion.button
              key="search-tree-btn"
              type="button"
              onClick={handleSearchTree}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.4)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <span>Search Around the Tree 🌳</span>
            </motion.button>
          )}

          {isDiscovered && (
            <motion.button
              key="next-scene-3"
              type="button"
              onClick={onNext}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center justify-center gap-2.5 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.4)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <span>Go to the Birthday Cake 🎂</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
