import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, MailOpen } from 'lucide-react';
import { Butterfly, VILLAGE_DAY_IMG } from './VillageProps';
import { TulipBouquetSVG } from './Characters';

interface Scene5LetterProps {
  onEnvelopeOpen: () => void;
  onNext: () => void;
}

type LetterPhase = 'closed' | 'opening' | 'opened';

const LETTER_LINES: { text: string; className?: string }[] = [
  { text: 'Dear Vinu, 💗', className: 'text-[28px] sm:text-[34px] font-bold text-[#9D174D]' },
  { text: 'Today is all about you!' },
  {
    text: 'I hope your special day is filled with endless happiness, beautiful memories, unexpected surprises and countless reasons to smile.',
  },
  {
    text: 'May all your dreams come true, and may every new day bring something wonderful into your life.',
  },
  {
    text: 'Keep smiling, stay happy and always be the amazing person you are!',
  },
  { text: 'You deserve all the love and happiness in this world.' },
  {
    text: 'Once again, Happiest Birthday, Vinu! 🎂🥳💐',
    className: 'font-semibold text-[#831843]',
  },
  {
    text: 'With lots of love! ❤️',
    className: 'pt-2 text-right text-[26px] sm:text-[31px] font-bold text-[#BE185D]',
  },
];

const FloralAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 80 80"
    className={`w-14 h-14 sm:w-16 sm:h-16 pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <path d="M12 68 Q22 38, 52 16" fill="none" stroke="#D8B4FE" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="30" cy="45" rx="7" ry="3.5" transform="rotate(-35 30 45)" fill="#DDD6FE" />
    <g transform="translate(22, 24)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-7" rx="4.5" ry="7" fill="#F9A8D4" opacity="0.88" transform={`rotate(${deg})`} />
      ))}
      <circle cx="0" cy="0" r="3.5" fill="#FDE68A" />
    </g>
    <g transform="translate(52, 18) scale(0.75)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-6.5" rx="4" ry="6.5" fill="#C084FC" opacity="0.72" transform={`rotate(${deg})`} />
      ))}
      <circle cx="0" cy="0" r="3" fill="#FEF08A" />
    </g>
  </svg>
);

export const Scene5Letter: React.FC<Scene5LetterProps> = ({
  onEnvelopeOpen,
  onNext,
}) => {
  const [phase, setPhase] = useState<LetterPhase>('closed');
  const [bgError, setBgError] = useState(false);

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    onEnvelopeOpen();
    window.setTimeout(() => {
      setPhase('opened');
    }, 1150);
  };

  return (
    <section
      aria-label="Scene 5: Birthday Letters"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 pt-20 pb-14 sm:px-8 overflow-x-hidden"
    >
      {/* Romantic Fairytale Golden-Pastel Village Glow Backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {!bgError && (
          <img
            src={VILLAGE_DAY_IMG}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBgError(true)}
            className="w-full h-full object-cover object-center opacity-35 blur-[2px]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(255, 250, 252, 0.86) 0%, rgba(252, 231, 243, 0.82) 52%, rgba(237, 233, 254, 0.86) 100%)',
          }}
        />
      </div>

      {/* Overhead Glowing Fairy Lights */}
      <svg
        viewBox="0 0 900 70"
        className="pointer-events-none fixed top-14 inset-x-0 w-full h-16 z-10 opacity-90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 10 Q225 60, 450 26 T900 10" fill="none" stroke="#C084FC" strokeWidth="1.5" opacity="0.45" />
        {[80, 170, 260, 350, 450, 550, 640, 730, 820].map((lx, i) => (
          <g key={i}>
            <circle cx={lx} cy={22 + (i % 2) * 14} r="14" fill="#FEF08A" opacity="0.35" className="animate-twinkle" />
            <circle cx={lx} cy={22 + (i % 2) * 14} r="4.5" fill={i % 2 === 0 ? '#FDE047' : '#F9A8D4'} />
          </g>
        ))}
      </svg>

      {/* Fluttering Romantic Butterflies */}
      <Butterfly className="top-24 left-[8%]" wingColor="#F9A8D4" accentColor="#F472B6" duration={7} />
      <Butterfly className="top-28 right-[10%]" wingColor="#DDD6FE" accentColor="#C084FC" duration={6.5} />

      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase !== 'opened' ? (
            <motion.div
              key="envelope-table-stage"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.55 }}
              className="w-full flex flex-col items-center text-center"
            >
              <h1
                className="text-2xl sm:text-4xl font-semibold text-[#521B3A] leading-snug max-w-xl mb-8 sm:mb-10"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                A fairytale letter waiting just for you, Vinu… 💌
              </h1>

              {/* Decorated Fairytale Table with Pastel-Pink Envelope + Flowers */}
              <div className="relative flex flex-col items-center mb-9">
                <div className="relative flex items-end justify-center gap-2 sm:gap-5 z-20 -mb-4">
                  <div className="hidden sm:block w-16 mb-2 -rotate-12">
                    <TulipBouquetSVG />
                  </div>

                  {/* Large Pastel-Pink Envelope with Heart Seal */}
                  <div className="relative perspective-1000">
                    <motion.div
                      onClick={handleOpen}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpen();
                        }
                      }}
                      aria-label="Open your birthday letter"
                      whileHover={phase === 'closed' ? { y: -5, scale: 1.02 } : undefined}
                      whileTap={phase === 'closed' ? { scale: 0.98 } : undefined}
                      className="relative w-[290px] sm:w-[375px] h-[194px] sm:h-[242px] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9468F] focus-visible:ring-offset-4 rounded-2xl"
                    >
                      {/* Envelope back */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FBCFE8] via-[#F9A8D4] to-[#F472B6] shadow-[0_20px_44px_rgba(190,24,93,0.22)] border border-white/65" />

                      {/* Sliding inner letter preview */}
                      <motion.div
                        initial={{ y: 12, opacity: 0.95 }}
                        animate={
                          phase === 'opening'
                            ? { y: -115, scale: 1.04, opacity: 1 }
                            : { y: 12, opacity: 0.95 }
                        }
                        transition={{
                          delay: phase === 'opening' ? 0.35 : 0,
                          duration: 0.75,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="absolute left-5 right-5 top-4 bottom-4 rounded-xl bg-[#FFFDF9] border border-pink-100 shadow-md p-5 flex flex-col items-center justify-start z-10"
                      >
                        <span
                          className="text-xl sm:text-2xl text-[#9D174D] font-semibold"
                          style={{ fontFamily: 'var(--font-handwriting)' }}
                        >
                          Dear Vinu, 💗
                        </span>
                        <div className="w-3/4 h-1.5 rounded-full bg-pink-100 mt-3" />
                        <div className="w-5/6 h-1.5 rounded-full bg-purple-100/80 mt-2" />
                      </motion.div>

                      {/* Front envelope folds */}
                      <svg
                        viewBox="0 0 380 246"
                        className="absolute inset-0 w-full h-full z-20 pointer-events-none rounded-2xl"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="s5EnvLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FCE7F3" />
                            <stop offset="100%" stopColor="#F9A8D4" />
                          </linearGradient>
                          <linearGradient id="s5EnvBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FBCFE8" />
                            <stop offset="100%" stopColor="#F472B6" />
                          </linearGradient>
                        </defs>
                        <polygon points="0,0 190,132 0,246" fill="url(#s5EnvLeft)" />
                        <polygon points="380,0 190,132 380,246" fill="url(#s5EnvLeft)" />
                        <polygon points="0,246 190,118 380,246" fill="url(#s5EnvBottom)" />
                        <polyline points="0,246 190,118 380,246" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                      </svg>

                      {/* 3D Opening Top Flap */}
                      <motion.div
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: phase === 'opening' ? -178 : 0 }}
                        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: 'top center' }}
                        className={`absolute inset-x-0 top-0 h-[138px] sm:h-[164px] preserve-3d ${
                          phase === 'opening' ? 'z-[5]' : 'z-30'
                        }`}
                      >
                        <svg viewBox="0 0 380 168" className="w-full h-full" preserveAspectRatio="none">
                          <path
                            d="M0,12 Q0,0 14,0 L366,0 Q380,0 380,12 L202,150 Q190,160 178,150 Z"
                            fill="#FBCFE8"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </motion.div>

                      {/* Heart-Shaped Wax Seal splitting open */}
                      <div className="pointer-events-none absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 flex items-center justify-center">
                        <motion.div
                          animate={phase === 'opening' ? { x: -24, y: -12, rotate: -25, opacity: 0 } : { x: 0, opacity: 1 }}
                          transition={{ duration: 0.45 }}
                          className="w-8 h-14 sm:h-16 overflow-hidden rounded-l-full bg-gradient-to-br from-[#F43F5E] via-[#DB2777] to-[#BE185D] border-y-2 border-l-2 border-pink-200/80 flex items-center justify-end"
                        >
                          <Heart className="w-7 h-7 sm:w-8 sm:h-8 -mr-3.5 sm:-mr-4 text-white fill-white/95 shrink-0" />
                        </motion.div>
                        <motion.div
                          animate={phase === 'opening' ? { x: 24, y: -12, rotate: 25, opacity: 0 } : { x: 0, opacity: 1 }}
                          transition={{ duration: 0.45 }}
                          className="w-8 h-14 sm:h-16 overflow-hidden rounded-r-full bg-gradient-to-bl from-[#F43F5E] via-[#DB2777] to-[#BE185D] border-y-2 border-r-2 border-pink-200/80 flex items-center justify-start"
                        >
                          <Heart className="w-7 h-7 sm:w-8 sm:h-8 -ml-3.5 sm:-ml-4 text-white fill-white/95 shrink-0" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="hidden sm:block w-16 mb-2 rotate-12">
                    <TulipBouquetSVG />
                  </div>
                </div>

                {/* Decorated Rustic Wooden Table Surface under the Envelope */}
                <svg viewBox="0 0 460 56" className="w-[330px] sm:w-[460px] h-auto z-10" aria-hidden="true">
                  <rect x="16" y="10" width="428" height="22" rx="11" fill="#D97706" opacity="0.88" />
                  <rect x="26" y="10" width="408" height="10" rx="5" fill="#FDE68A" opacity="0.45" />
                  <path d="M130 10 L330 10 L318 44 Q275 54 230 44 Q185 54 142 44 Z" fill="#FFFDF9" stroke="#F9A8D4" strokeWidth="2" />
                </svg>
              </div>

              <motion.button
                type="button"
                onClick={handleOpen}
                disabled={phase !== 'closed'}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2.5 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base sm:text-lg shadow-[0_12px_30px_rgba(219,39,119,0.38)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE185D] focus-visible:ring-offset-2 whitespace-nowrap shrink-0 disabled:opacity-75"
              >
                <MailOpen className="w-5 h-5" aria-hidden="true" />
                <span>Open Your Letter 💌</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Line-by-Line Animated Handwritten Birthday Letter */
            <motion.div
              key="revealed-letter"
              initial={{ opacity: 0, y: 36, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              <article
                aria-label="Birthday letter for Vinu"
                className="relative w-full rounded-3xl bg-[#FFFDF9] border border-pink-200/90 shadow-[0_24px_62px_rgba(157,23,77,0.16)] px-6 py-8 sm:px-11 sm:py-11 overflow-hidden"
              >
                <FloralAccent className="absolute top-2 left-2 opacity-85" />
                <FloralAccent className="absolute top-2 right-2 -scale-x-100 opacity-85" />
                <FloralAccent className="absolute bottom-2 left-2 -scale-y-100 opacity-75" />
                <FloralAccent className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100 opacity-75" />

                <div className="relative z-10 flex justify-center mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-50 border border-pink-200/80">
                    <Heart className="w-5 h-5 text-[#DB2777] fill-[#F472B6]" aria-hidden="true" />
                  </span>
                </div>

                {/* Line-by-line gentle reveal in handwritten style */}
                <div
                  className="relative z-10 space-y-4 sm:space-y-5 text-[#4A1C38] text-[23px] sm:text-[27px] leading-[1.46] font-medium"
                  style={{ fontFamily: 'var(--font-handwriting)' }}
                >
                  {LETTER_LINES.map((line, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.25 + index * 0.42,
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={line.className ?? ''}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </div>
              </article>

              <motion.button
                type="button"
                onClick={onNext}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.4, duration: 0.55 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center justify-center gap-2.5 min-h-[50px] px-8 py-3 rounded-full bg-gradient-to-r from-[#DB2777] via-[#EC4899] to-[#A855F7] text-white font-semibold text-base shadow-[0_12px_30px_rgba(219,39,119,0.38)] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE185D] focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
              >
                <span>Grand Night Sky Surprise 🎆</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
