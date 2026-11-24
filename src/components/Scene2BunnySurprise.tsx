import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Flower2, Heart, Volume2 } from 'lucide-react';
import { BoyCharacter, BunnyCharacter, GirlCharacter } from './Characters';
import { VillageLandscape } from './VillageProps';

interface Scene2BunnySurpriseProps {
  onFirstInteraction: () => void;
  onReceiveBouquet: () => void;
  onReplayVoice: () => void;
  onNext: () => void;
}

type BunnyScenePhase = 'approaching' | 'offering' | 'received';

const PETAL_BURST = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2;
  const dist = 80 + (i % 3) * 38;
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 22,
    isHeart: i % 3 === 0,
    color: i % 4 === 0 ? '#F472B6' : i % 4 === 1 ? '#C084FC' : i % 4 === 2 ? '#FACC15' : '#FB7185',
    rot: (i * 44) % 360,
  };
});

export const Scene2BunnySurprise: React.FC<Scene2BunnySurpriseProps> = ({
  onFirstInteraction,
  onReceiveBouquet,
  onReplayVoice,
  onNext,
}) => {
  const [phase, setPhase] = useState<BunnyScenePhase>('approaching');

  useEffect(() => {
    const arriveTimer = window.setTimeout(() => {
      setPhase('offering');
    }, 2800);
    return () => window.clearTimeout(arriveTimer);
  }, []);

  const handleReceive = () => {
    if (phase !== 'offering') return;
    onFirstInteraction();
    setPhase('received');
    onReceiveBouquet();
  };

  const isApproaching = phase === 'approaching';
  const isOffering = phase === 'offering';
  const isReceived = phase === 'received';

  return (
    <section
      aria-label="Scene 2: Bunny's Birthday Surprise"
      className="relative min-h-screen w-full flex flex-col justify-between pt-20 pb-8 px-4 sm:px-8 overflow-hidden"
    >
      <VillageLandscape showButterflies />

      {/* Top Caption / Happy Birthday Vinu Voice Banner */}
      <div className="relative z-20 w-full max-w-2xl mx-auto text-center pt-2 sm:pt-3 min-h-[92px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isReceived ? (
            <motion.div
              key="bunny-caption"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl bg-white/78 backdrop-blur-md border border-white/85 shadow-[0_10px_28px_rgba(82,27,58,0.12)] px-6 py-3.5 sm:px-8 sm:py-4"
            >
              <p
                className="text-lg sm:text-2xl font-medium text-[#4A1936]"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                {isApproaching
                  ? 'Look! A little white bunny is running down the hill… 🐰'
                  : 'The bunny brought a colorful tulip bouquet just for Vinu! 💐'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="voice-greeting"
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-white/88 backdrop-blur-md border border-pink-200 shadow-[0_14px_36px_rgba(219,39,119,0.2)] px-6 py-4 sm:px-8 sm:py-5 flex flex-col items-center gap-2"
            >
              <h1
                className="animate-birthday-glow text-2xl sm:text-4xl font-bold text-[#9D174D]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                &ldquo;Happy Birthday, Vinu!&rdquo; 💐💗
              </h1>
              <button
                type="button"
                onClick={onReplayVoice}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#8B3D67] hover:text-[#BE185D] transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Play greeting voice again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grassy Hill Stage: Running Bunny approaching Boy & Girl */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex-1 flex items-end justify-center pb-8 sm:pb-12">
        <div className="relative w-full max-w-3xl flex items-end justify-center gap-2 sm:gap-5">
          {/* Bursting petals, sparkles & tiny hearts around bunny & boy on receive */}
          <AnimatePresence>
            {isReceived && (
              <div className="pointer-events-none absolute left-1/2 bottom-28 -translate-x-1/2 z-30">
                {PETAL_BURST.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      scale: [0.3, 1.3, 0.9],
                      opacity: [1, 1, 0],
                      rotate: p.rot,
                    }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute"
                  >
                    {p.isHeart ? (
                      <Heart className="w-5 h-5" fill={p.color} color={p.color} />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={p.color}>
                        <path d="M12 2C15.5 5 19 9.5 18.2 14.8C17.5 19 14.5 21.5 12 22C9.5 21.5 6.5 19 5.8 14.8C5 9.5 8.5 5 12 2Z" />
                      </svg>
                    )}
                  </motion.span>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Fluffy White Bunny Running Down the Distant Hill -> Stopping in Front of Vinu */}
          <motion.div
            initial={{ x: '-46vw', y: -76, scale: 0.34, opacity: 0.25 }}
            animate={
              isApproaching
                ? {
                    x: 0,
                    y: [-76, -62, -46, -32, -16, -6, 0],
                    scale: 1,
                    opacity: 1,
                  }
                : { x: 0, y: 0, scale: 1, opacity: 1 }
            }
            transition={
              isApproaching
                ? { duration: 2.75, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.45 }
            }
            className="relative flex flex-col items-center"
          >
            {/* Dust sparkles behind bunny paws while running */}
            {isApproaching && (
              <div className="pointer-events-none absolute bottom-4 -left-8 flex gap-2">
                {[0, 0.25, 0.5].map((delay, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ x: [0, -28], y: [0, -16], opacity: [0.95, 0], scale: [0.6, 1.3] }}
                    transition={{ duration: 0.6, delay, repeat: 4, ease: 'easeOut' }}
                    className="block w-3 h-3 rounded-full bg-amber-200/90"
                  />
                ))}
              </div>
            )}

            {/* Speech bubble directly from Bunny */}
            <AnimatePresence>
              {isReceived && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mb-1 whitespace-nowrap rounded-2xl bg-white/95 border border-pink-200 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#BE185D] shadow-md"
                >
                  Happy Birthday, Vinu! 💗
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={handleReceive}
              disabled={!isOffering}
              aria-label={isOffering ? 'Receive tulip bouquet from the bunny' : 'Fluffy white bunny'}
              className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899] rounded-3xl ${
                isOffering ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-default'
              }`}
            >
              <BunnyCharacter
                pose={isApproaching ? 'running' : isOffering ? 'offering' : 'jumping'}
                holdingBouquet={!isReceived}
                facing="right"
                className="w-24 sm:w-32 md:w-36"
              />
            </button>
          </motion.div>

          {/* Boy (Vinu) Sitting -> Surprised & Happy Receiving the Tulip Bouquet */}
          <div className="relative flex items-end">
            <BoyCharacter
              pose={isReceived ? 'celebrating' : isOffering ? 'surprised' : 'sitting'}
              holdingBouquet={isReceived}
              facing="left"
              className="w-28 sm:w-36 md:w-40"
            />
          </div>

          {/* Girl (Me) Sitting Happily Beside Vinu */}
          <div className="relative flex items-end -ml-4 sm:-ml-2">
            <GirlCharacter
              pose={isReceived ? 'celebrating' : 'sitting'}
              facing="left"
              className="w-28 sm:w-36 md:w-40"
            />
          </div>
        </div>
      </div>

      {/* Bottom Interactive CTA */}
      <div className="relative z-30 min-h-[64px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isOffering && (
            <motion.button
              key="receive-bouquet-btn"
              type="button"
              onClick={handleReceive}
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.4)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <Flower2 className="w-5 h-5" aria-hidden="true" />
              <span>Receive the Tulip Bouquet 💐</span>
            </motion.button>
          )}

          {isReceived && (
            <motion.button
              key="next-scene-2"
              type="button"
              onClick={onNext}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center justify-center gap-2.5 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.4)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
