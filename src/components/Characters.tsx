import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

/* -------------------------------------------------------------------------- */
/* Consistent Colorful Tulip Bouquet (shared across Bunny, Boy & Cake Table)  */
/* -------------------------------------------------------------------------- */
export const TulipBouquetSVG: React.FC<{
  scale?: number;
  bloomed?: boolean;
  className?: string;
}> = ({ scale = 1, bloomed = false, className = '' }) => (
  <motion.svg
    viewBox="0 0 110 120"
    className={`overflow-visible ${className}`}
    style={{ transform: `scale(${scale})` }}
    animate={bloomed ? { scale: [scale, scale * 1.16, scale * 1.08] } : undefined}
    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tulipWrap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFDF9" />
        <stop offset="55%" stopColor="#FCE7F3" />
        <stop offset="100%" stopColor="#F9A8D4" />
      </linearGradient>
      <linearGradient id="tulipPink" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FBCFE8" />
        <stop offset="50%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
      <linearGradient id="tulipPurple" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="55%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="tulipYellow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="55%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="tulipCoral" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FECDD3" />
        <stop offset="55%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
    </defs>

    {/* Cream & blush kraft wrap cone */}
    <path
      d="M22 52 L55 112 L88 52 Q55 40 22 52 Z"
      fill="url(#tulipWrap)"
      stroke="#F9A8D4"
      strokeWidth="2"
    />

    {/* Lush green tulip leaves */}
    <path d="M52 60 Q22 44 16 20 Q34 32 52 54 Z" fill="#4ADE80" />
    <path d="M58 60 Q88 44 94 20 Q76 32 58 54 Z" fill="#22C55E" />
    <path d="M55 58 Q40 34 36 12 Q52 28 55 54 Z" fill="#16A34A" opacity="0.88" />
    <path d="M55 58 Q70 34 74 12 Q58 28 55 54 Z" fill="#4ADE80" opacity="0.92" />

    {/* Tulip stems */}
    <g stroke="#15803D" strokeWidth="3.2" strokeLinecap="round">
      <line x1="55" y1="62" x2="32" y2="34" />
      <line x1="55" y1="62" x2="78" y2="34" />
      <line x1="55" y1="62" x2="45" y2="24" />
      <line x1="55" y1="62" x2="66" y2="24" />
      <line x1="55" y1="62" x2="55" y2="36" />
    </g>

    {/* Colorful 3D Tulip Blossoms (Pink, Lavender, Yellow, Coral) */}
    {[
      { x: 30, y: 31, rot: -20, fill: 'url(#tulipYellow)' },
      { x: 80, y: 31, rot: 20, fill: 'url(#tulipPurple)' },
      { x: 44, y: 21, rot: -8, fill: 'url(#tulipCoral)' },
      { x: 67, y: 21, rot: 9, fill: 'url(#tulipPink)' },
      { x: 55, y: 34, rot: 0, fill: 'url(#tulipPink)' },
    ].map((t, i) => (
      <g key={i} transform={`translate(${t.x}, ${t.y}) rotate(${t.rot})`}>
        {/* Tulip cup petals */}
        <path
          d="M-10 -2 C-12 -14, -4 -20, 0 -12 C4 -20, 12 -14, 10 -2 C10 8, 5 12, 0 12 C-5 12, -10 8, -10 -2 Z"
          fill={t.fill}
        />
        <path
          d="M-5 -12 C-2 -18, 2 -18, 5 -12 C4 2, 2 10, 0 11 C-2 10, -4 2, -5 -12 Z"
          fill="rgba(255,255,255,0.28)"
        />
      </g>
    ))}

    {/* Front satin pink ribbon bow */}
    <rect x="39" y="74" width="32" height="8" rx="4" fill="#EC4899" />
    <path d="M54 78 C40 68, 30 78, 38 87 C44 93, 50 85, 54 80 Z" fill="#F472B6" />
    <path d="M56 78 C70 68, 80 78, 72 87 C66 93, 60 85, 56 80 Z" fill="#F472B6" />
    <circle cx="55" cy="79" r="4.5" fill="#BE185D" />
  </motion.svg>
);

/* Shared blinking hook for liveliness */
function useAutoBlink(offsetMs = 0) {
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    let intervalId = 0;
    const startTimeout = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setBlinking(true);
        window.setTimeout(() => setBlinking(false), 150);
      }, 3400);
    }, offsetMs);
    return () => {
      window.clearTimeout(startTimeout);
      window.clearInterval(intervalId);
    };
  }, [offsetMs]);
  return blinking;
}

/* -------------------------------------------------------------------------- */
/* Consistent Cute 3D Cartoon Boy Character (Vinu)                            */
/* -------------------------------------------------------------------------- */
export type BoyPose =
  | 'walking'
  | 'sitting'
  | 'standing'
  | 'surprised'
  | 'searching'
  | 'blowing'
  | 'celebrating';

export const BoyCharacter: React.FC<{
  pose: BoyPose;
  holdingBouquet?: boolean;
  facing?: 'right' | 'left';
  className?: string;
}> = ({ pose, holdingBouquet = false, facing = 'right', className = 'w-32 sm:w-40' }) => {
  const blinking = useAutoBlink(400);
  const isWalking = pose === 'walking';
  const isSitting = pose === 'sitting';
  const isSurprised = pose === 'surprised';
  const isSearching = pose === 'searching';
  const isBlowing = pose === 'blowing';
  const isCelebrating = pose === 'celebrating';

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 180 250"
        className="w-full h-auto overflow-visible drop-shadow-[0_14px_18px_rgba(30,41,59,0.22)]"
        role="img"
        aria-label="Cute 3D cartoon boy character representing Vinu"
      >
        <defs>
          <radialGradient id="boySkin" cx="40%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFE8D6" />
            <stop offset="72%" stopColor="#FCD3B5" />
            <stop offset="100%" stopColor="#E9B18F" />
          </radialGradient>
          <radialGradient id="boyHair" cx="35%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#5C3D2E" />
            <stop offset="65%" stopColor="#3B2318" />
            <stop offset="100%" stopColor="#23130C" />
          </radialGradient>
          <linearGradient id="boySweater" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="boyPants" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse
          cx="90"
          cy={isSitting ? 228 : 238}
          rx={isSitting ? 46 : 36}
          ry="9"
          fill="rgba(15, 23, 42, 0.2)"
        />

        {/* LEGS */}
        {isSitting ? (
          /* Seated bent legs on grassy hill */
          <g>
            <path
              d="M74 186 Q68 214 96 220"
              stroke="url(#boyPants)"
              strokeWidth="22"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M104 186 Q106 212 128 216"
              stroke="url(#boyPants)"
              strokeWidth="22"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sneakers */}
            <ellipse cx="106" cy="222" rx="16" ry="9.5" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.5" />
            <ellipse cx="136" cy="218" rx="16" ry="9.5" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.5" />
          </g>
        ) : (
          /* Articulated walking/standing legs */
          <g>
            <motion.g
              style={{ transformOrigin: '78px 180px' }}
              animate={
                isWalking
                  ? { rotate: [-22, 22, -22] }
                  : isCelebrating
                    ? { rotate: [0, -8, 0] }
                    : { rotate: 0 }
              }
              transition={
                isWalking
                  ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.5 }
              }
            >
              <rect x="67" y="176" width="21" height="48" rx="10" fill="url(#boyPants)" />
              <ellipse cx="79" cy="228" rx="16" ry="9" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M67 228 Q79 233 93 228" stroke="#60A5FA" strokeWidth="2.5" fill="none" />
            </motion.g>

            <motion.g
              style={{ transformOrigin: '102px 180px' }}
              animate={
                isWalking
                  ? { rotate: [22, -22, 22] }
                  : isCelebrating
                    ? { rotate: [0, 8, 0] }
                    : { rotate: 0 }
              }
              transition={
                isWalking
                  ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.5 }
              }
            >
              <rect x="92" y="176" width="21" height="48" rx="10" fill="url(#boyPants)" />
              <ellipse cx="104" cy="228" rx="16" ry="9" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M92 228 Q104 233 118 228" stroke="#60A5FA" strokeWidth="2.5" fill="none" />
            </motion.g>
          </g>
        )}

        {/* UPPER BODY (gently bobs while walking, leans forward when blowing!) */}
        <motion.g
          style={{ transformOrigin: '90px 180px' }}
          animate={
            isWalking
              ? { y: [0, -5, 0] }
              : isBlowing
                ? { rotate: 9, y: 2 }
                : isCelebrating
                  ? { y: [0, -10, 0] }
                  : { y: 0, rotate: 0 }
          }
          transition={
            isWalking
              ? { duration: 0.325, repeat: Infinity, ease: 'easeInOut' }
              : isCelebrating
                ? { duration: 0.75, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.45 }
          }
        >
          {/* Back Arm */}
          <motion.g
            style={{ transformOrigin: '60px 132px' }}
            animate={
              isWalking
                ? { rotate: [20, -20, 20] }
                : isCelebrating
                  ? { rotate: [-125, -105, -125] }
                  : holdingBouquet
                    ? { rotate: -32 }
                    : { rotate: 6 }
            }
            transition={{
              duration: isWalking ? 0.65 : 0.8,
              repeat: isWalking || isCelebrating ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <rect x="48" y="128" width="18" height="44" rx="9" fill="#60A5FA" />
            <circle cx="57" cy="174" r="8.5" fill="url(#boySkin)" />
          </motion.g>

          {/* Cozy Sky-Blue Sweater Torso */}
          <path
            d="M58 126 Q90 116 122 126 L126 184 Q90 194 54 184 Z"
            fill="url(#boySweater)"
          />
          {/* Cream sweater collar & soft heart knit accent */}
          <path d="M72 123 Q90 135 108 123" fill="none" stroke="#FFFDF9" strokeWidth="6" strokeLinecap="round" />
          <path d="M55 178 Q90 186 125 178" fill="none" stroke="#DBEAFE" strokeWidth="5" strokeLinecap="round" />

          {/* HEAD */}
          <motion.g
            style={{ transformOrigin: '90px 116px' }}
            animate={
              isSearching
                ? { rotate: [-9, 10, -9] }
                : isSurprised
                  ? { rotate: [-3, 3, 0], y: [0, -4, 0] }
                  : { rotate: 0 }
            }
            transition={{
              duration: isSearching ? 1.5 : 0.7,
              repeat: isSearching ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Neck */}
            <rect x="81" y="108" width="18" height="18" rx="7" fill="url(#boySkin)" />

            {/* Ears */}
            <circle cx="47" cy="79" r="9.5" fill="url(#boySkin)" />
            <circle cx="133" cy="79" r="9.5" fill="url(#boySkin)" />

            {/* 3D Round Cute Head */}
            <ellipse cx="90" cy="74" rx="44" ry="42" fill="url(#boySkin)" />

            {/* Soft Dark-Brown Wavy Hair */}
            <path
              d="M44 74 C42 36, 70 22, 96 24 C124 26, 140 44, 136 74 C130 56, 118 46, 104 49 C96 38, 76 40, 68 50 C57 48, 50 58, 44 74 Z"
              fill="url(#boyHair)"
            />
            {/* Hair swoop highlight */}
            <path
              d="M66 36 Q88 28 110 38"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Rosy Cheeks (puffed when blowing candles!) */}
            <ellipse
              cx="63"
              cy="88"
              rx={isBlowing ? 11.5 : 9}
              ry={isBlowing ? 7.5 : 5.5}
              fill="#F472B6"
              opacity={isBlowing ? 0.55 : 0.36}
            />
            <ellipse
              cx="117"
              cy="88"
              rx={isBlowing ? 11.5 : 9}
              ry={isBlowing ? 7.5 : 5.5}
              fill="#F472B6"
              opacity={isBlowing ? 0.55 : 0.36}
            />

            {/* Expressive Sparkling Eyes */}
            {isCelebrating ? (
              <>
                <path d="M64 76 Q73 67 82 76" fill="none" stroke="#2D1610" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M98 76 Q107 67 116 76" fill="none" stroke="#2D1610" strokeWidth="3.6" strokeLinecap="round" />
              </>
            ) : blinking ? (
              <>
                <path d="M65 76 Q73 80 81 76" fill="none" stroke="#2D1610" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M99 76 Q107 80 115 76" fill="none" stroke="#2D1610" strokeWidth="3.2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="73" cy="75" rx="7.5" ry={isSurprised ? 9.5 : 8.5} fill="#2A140E" />
                <circle cx="70.5" cy="71.5" r="3" fill="#FFFFFF" />
                <circle cx="75.5" cy="78" r="1.4" fill="#FFFFFF" opacity="0.85" />

                <ellipse cx="107" cy="75" rx="7.5" ry={isSurprised ? 9.5 : 8.5} fill="#2A140E" />
                <circle cx="104.5" cy="71.5" r="3" fill="#FFFFFF" />
                <circle cx="109.5" cy="78" r="1.4" fill="#FFFFFF" opacity="0.85" />
              </>
            )}

            {/* Eyebrows */}
            <path
              d={isSurprised || isSearching ? 'M64 60 Q73 55 81 60' : 'M65 63 Q73 60 80 63'}
              fill="none"
              stroke="#3B2318"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d={isSurprised || isSearching ? 'M99 60 Q107 55 116 60' : 'M100 63 Q107 60 115 63'}
              fill="none"
              stroke="#3B2318"
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            {/* Mouth */}
            {isBlowing ? (
              <circle cx="93" cy="95" r="4.5" fill="#B45353" />
            ) : isSurprised ? (
              <ellipse cx="90" cy="96" rx="6.5" ry="7.5" fill="#BE4B5E" />
            ) : isSearching ? (
              <path d="M84 95 Q90 92 96 95" fill="none" stroke="#6B2D2D" strokeWidth="2.6" strokeLinecap="round" />
            ) : (
              <path
                d="M78 92 Q90 104 102 92"
                fill="none"
                stroke="#6B2D2D"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </motion.g>

          {/* Front Arm */}
          <motion.g
            style={{ transformOrigin: '120px 132px' }}
            animate={
              isWalking
                ? { rotate: [-20, 20, -20] }
                : isCelebrating
                  ? { rotate: [125, 105, 125] }
                  : holdingBouquet
                    ? { rotate: 28 }
                    : isSearching
                      ? { rotate: -62 }
                      : { rotate: -6 }
            }
            transition={{
              duration: isWalking ? 0.65 : 0.8,
              repeat: isWalking || isCelebrating ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <rect x="114" y="128" width="18" height="44" rx="9" fill="#93C5FD" />
            <circle cx="123" cy="174" r="8.5" fill="url(#boySkin)" />
          </motion.g>

          {/* Tulip Bouquet Held Securely in Vinu's Hands once Bunny gives it */}
          {holdingBouquet && (
            <g transform="translate(86, 108) scale(0.72) rotate(10)">
              <TulipBouquetSVG bloomed />
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Consistent Cute 3D Cartoon Girl Character (Me)                             */
/* -------------------------------------------------------------------------- */
export type GirlPose =
  | 'walking'
  | 'sitting'
  | 'running'
  | 'peeking'
  | 'standing'
  | 'blowing'
  | 'celebrating';

export const GirlCharacter: React.FC<{
  pose: GirlPose;
  facing?: 'right' | 'left';
  className?: string;
}> = ({ pose, facing = 'right', className = 'w-32 sm:w-40' }) => {
  const blinking = useAutoBlink(1300);
  const isWalking = pose === 'walking';
  const isRunning = pose === 'running';
  const isSitting = pose === 'sitting';
  const isBlowing = pose === 'blowing';
  const isCelebrating = pose === 'celebrating';
  const isPeeking = pose === 'peeking';

  const strideSpeed = isRunning ? 0.34 : 0.65;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 180 250"
        className="w-full h-auto overflow-visible drop-shadow-[0_14px_18px_rgba(157,23,77,0.2)]"
        role="img"
        aria-label="Cute 3D cartoon girl character"
      >
        <defs>
          <radialGradient id="girlSkin" cx="40%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFE9DA" />
            <stop offset="72%" stopColor="#FCD6BA" />
            <stop offset="100%" stopColor="#E9B493" />
          </radialGradient>
          <radialGradient id="girlHair" cx="35%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#6D4130" />
            <stop offset="65%" stopColor="#462519" />
            <stop offset="100%" stopColor="#2B140C" />
          </radialGradient>
          <linearGradient id="girlDress" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse
          cx="90"
          cy={isSitting ? 228 : 238}
          rx={isSitting ? 46 : 36}
          ry="9"
          fill="rgba(131, 24, 67, 0.18)"
        />

        {/* Back Flowing Hair Layer */}
        <motion.path
          d="M42 74 C34 114, 38 148, 52 158 L128 158 C142 148, 146 114, 138 74 Z"
          fill="url(#girlHair)"
          animate={isRunning ? { rotate: [-4, 4, -4] } : undefined}
          transition={{ duration: 0.34, repeat: Infinity }}
          style={{ transformOrigin: '90px 75px' }}
        />

        {/* LEGS */}
        {isSitting ? (
          <g>
            <path d="M76 196 Q68 218 96 222" stroke="url(#girlSkin)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M104 196 Q106 216 128 218" stroke="url(#girlSkin)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <ellipse cx="104" cy="223" rx="14" ry="8.5" fill="#EC4899" />
            <ellipse cx="134" cy="219" rx="14" ry="8.5" fill="#EC4899" />
          </g>
        ) : (
          <g>
            <motion.g
              style={{ transformOrigin: '78px 188px' }}
              animate={
                isWalking || isRunning
                  ? { rotate: isRunning ? [-34, 34, -34] : [-20, 20, -20] }
                  : { rotate: 0 }
              }
              transition={{ duration: strideSpeed, repeat: isWalking || isRunning ? Infinity : 0, ease: 'easeInOut' }}
            >
              <rect x="72" y="186" width="13" height="40" rx="6.5" fill="url(#girlSkin)" />
              <ellipse cx="80" cy="228" rx="14" ry="8.5" fill="#EC4899" />
              <circle cx="84" cy="225" r="2.2" fill="#FFFDF9" />
            </motion.g>

            <motion.g
              style={{ transformOrigin: '102px 188px' }}
              animate={
                isWalking || isRunning
                  ? { rotate: isRunning ? [34, -34, 34] : [20, -20, 20] }
                  : { rotate: 0 }
              }
              transition={{ duration: strideSpeed, repeat: isWalking || isRunning ? Infinity : 0, ease: 'easeInOut' }}
            >
              <rect x="95" y="186" width="13" height="40" rx="6.5" fill="url(#girlSkin)" />
              <ellipse cx="103" cy="228" rx="14" ry="8.5" fill="#EC4899" />
              <circle cx="107" cy="225" r="2.2" fill="#FFFDF9" />
            </motion.g>
          </g>
        )}

        {/* UPPER BODY */}
        <motion.g
          style={{ transformOrigin: '90px 180px' }}
          animate={
            isWalking || isRunning
              ? { y: isRunning ? [0, -8, 0] : [0, -5, 0], rotate: isRunning ? 6 : 0 }
              : isBlowing
                ? { rotate: -9, y: 2 }
                : isCelebrating
                  ? { y: [0, -10, 0] }
                  : isPeeking
                    ? { rotate: [0, 8, 0] }
                    : { y: 0, rotate: 0 }
          }
          transition={{
            duration: isRunning ? 0.17 : isWalking ? 0.325 : 0.85,
            repeat: isWalking || isRunning || isCelebrating || isPeeking ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {/* Back Arm */}
          <motion.g
            style={{ transformOrigin: '60px 134px' }}
            animate={
              isWalking || isRunning
                ? { rotate: [24, -24, 24] }
                : isCelebrating || isPeeking
                  ? { rotate: [-130, -108, -130] }
                  : { rotate: 8 }
            }
            transition={{
              duration: strideSpeed,
              repeat: isWalking || isRunning || isCelebrating || isPeeking ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <rect x="52" y="130" width="14" height="40" rx="7" fill="url(#girlSkin)" />
            <circle cx="59" cy="134" r="10" fill="#FBCFE8" />
          </motion.g>

          {/* Pastel Pink & Lavender Fairytale Dress */}
          <path
            d="M66 126 Q90 118 114 126 L132 196 Q90 208 48 196 Z"
            fill="url(#girlDress)"
          />
          {/* Cream lace hem & waist sash */}
          <path d="M51 190 Q90 201 129 190" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeDasharray="6 5" strokeLinecap="round" />
          <path d="M62 152 Q90 159 118 152" fill="none" stroke="#FFFDF9" strokeWidth="6" strokeLinecap="round" />
          <circle cx="90" cy="156" r="5" fill="#FDE68A" />

          {/* HEAD */}
          <g>
            <rect x="82" y="108" width="16" height="18" rx="6" fill="url(#girlSkin)" />
            <circle cx="48" cy="80" r="8.5" fill="url(#girlSkin)" />
            <circle cx="132" cy="80" r="8.5" fill="url(#girlSkin)" />

            {/* Cute Round Face */}
            <ellipse cx="90" cy="75" rx="43" ry="41" fill="url(#girlSkin)" />

            {/* Bangs & Top Hair */}
            <path
              d="M45 75 C44 36, 70 22, 92 23 C118 24, 138 40, 135 75 C126 55, 114 48, 102 52 C92 42, 74 44, 66 53 C56 50, 50 60, 45 75 Z"
              fill="url(#girlHair)"
            />

            {/* Signature Pastel Pink Satin Bow in Hair */}
            <g transform="translate(118, 36) rotate(18)">
              <path d="M0 0 C-14 -12, -22 2, -10 10 C-4 13, -1 6, 0 2 Z" fill="#F472B6" />
              <path d="M0 0 C14 -12, 22 2, 10 10 C4 13, 1 6, 0 2 Z" fill="#F472B6" />
              <circle cx="0" cy="2" r="4.5" fill="#FFF1F6" stroke="#DB2777" strokeWidth="1.5" />
            </g>

            {/* Rosy Cheeks */}
            <ellipse
              cx="63"
              cy="88"
              rx={isBlowing ? 11.5 : 9.5}
              ry={isBlowing ? 7.5 : 5.5}
              fill="#F472B6"
              opacity={isBlowing ? 0.58 : 0.42}
            />
            <ellipse
              cx="117"
              cy="88"
              rx={isBlowing ? 11.5 : 9.5}
              ry={isBlowing ? 7.5 : 5.5}
              fill="#F472B6"
              opacity={isBlowing ? 0.58 : 0.42}
            />

            {/* Sparkling Eyes with cute tiny lashes */}
            {isCelebrating ? (
              <>
                <path d="M64 76 Q73 67 82 76" fill="none" stroke="#2D1610" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M98 76 Q107 67 116 76" fill="none" stroke="#2D1610" strokeWidth="3.6" strokeLinecap="round" />
              </>
            ) : blinking ? (
              <>
                <path d="M65 76 Q73 80 81 76" fill="none" stroke="#2D1610" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M99 76 Q107 80 115 76" fill="none" stroke="#2D1610" strokeWidth="3.2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="73" cy="76" rx="7.6" ry="8.8" fill="#2A140E" />
                <circle cx="70.5" cy="72.5" r="3" fill="#FFFFFF" />
                <circle cx="75.5" cy="79" r="1.4" fill="#FFFFFF" opacity="0.88" />

                <ellipse cx="107" cy="76" rx="7.6" ry="8.8" fill="#2A140E" />
                <circle cx="104.5" cy="72.5" r="3" fill="#FFFFFF" />
                <circle cx="109.5" cy="79" r="1.4" fill="#FFFFFF" opacity="0.88" />
              </>
            )}

            {/* Mouth */}
            {isBlowing ? (
              <circle cx="87" cy="95" r="4.5" fill="#BE4B5E" />
            ) : (
              <path
                d="M78 92 Q90 104 102 92"
                fill="none"
                stroke="#7A2E3F"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Front Arm */}
          <motion.g
            style={{ transformOrigin: '120px 134px' }}
            animate={
              isWalking || isRunning
                ? { rotate: [-24, 24, -24] }
                : isCelebrating
                  ? { rotate: [125, 105, 125] }
                  : { rotate: -8 }
            }
            transition={{
              duration: strideSpeed,
              repeat: isWalking || isRunning || isCelebrating ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <rect x="114" y="130" width="14" height="40" rx="7" fill="url(#girlSkin)" />
            <circle cx="121" cy="134" r="10" fill="#FBCFE8" />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Consistent Cute Fluffy White 3D Bunny Character                            */
/* -------------------------------------------------------------------------- */
export type BunnyPose = 'running' | 'offering' | 'sitting' | 'jumping';

export const BunnyCharacter: React.FC<{
  pose: BunnyPose;
  holdingBouquet?: boolean;
  facing?: 'right' | 'left';
  className?: string;
}> = ({ pose, holdingBouquet = false, facing = 'right', className = 'w-28 sm:w-36' }) => {
  const blinking = useAutoBlink(900);
  const isRunning = pose === 'running';
  const isOffering = pose === 'offering';
  const isJumping = pose === 'jumping';

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined }}
      animate={
        isJumping
          ? { y: [0, -28, 0, -20, 0] }
          : isRunning
            ? { y: [0, -10, 0] }
            : { y: 0 }
      }
      transition={{
        duration: isJumping ? 0.9 : isRunning ? 0.36 : 0.4,
        repeat: isJumping || isRunning ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 260 270"
        className="w-full h-auto overflow-visible drop-shadow-[0_14px_18px_rgba(157,23,77,0.18)]"
        role="img"
        aria-label="Cute fluffy white 3D cartoon bunny"
      >
        <defs>
          <radialGradient id="bunnyWhiteFur" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFF7FA" />
            <stop offset="100%" stopColor="#F1DAE6" />
          </radialGradient>
          <linearGradient id="bunnyInnerEar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="130" cy="248" rx="58" ry="11" fill="rgba(131, 24, 67, 0.16)" />

        {/* Fluffy Wagging Cotton Tail */}
        <motion.g
          style={{ transformOrigin: '80px 192px' }}
          animate={
            isRunning || isJumping
              ? { rotate: [-18, 22, -18], scale: [1, 1.1, 1] }
              : { rotate: [-5, 6, -5] }
          }
          transition={{ duration: isRunning ? 0.3 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="72" cy="190" r="20" fill="url(#bunnyWhiteFur)" />
          <circle cx="65" cy="184" r="10" fill="#FFFFFF" opacity="0.85" />
        </motion.g>

        {/* Left Hind Leg */}
        <motion.g
          style={{ transformOrigin: '104px 206px' }}
          animate={isRunning ? { rotate: [-32, 32, -32] } : { rotate: 0 }}
          transition={{ duration: 0.36, repeat: isRunning ? Infinity : 0, ease: 'easeInOut' }}
        >
          <ellipse cx="102" cy="220" rx="18" ry="23" fill="url(#bunnyWhiteFur)" />
          <ellipse cx="106" cy="238" rx="22" ry="12" fill="url(#bunnyWhiteFur)" />
        </motion.g>

        {/* Right Hind Leg */}
        <motion.g
          style={{ transformOrigin: '154px 206px' }}
          animate={isRunning ? { rotate: [32, -32, 32] } : { rotate: 0 }}
          transition={{ duration: 0.36, repeat: isRunning ? Infinity : 0, ease: 'easeInOut' }}
        >
          <ellipse cx="154" cy="220" rx="18" ry="23" fill="url(#bunnyWhiteFur)" />
          <ellipse cx="160" cy="238" rx="22" ry="12" fill="url(#bunnyWhiteFur)" />
        </motion.g>

        {/* Plush White Body */}
        <ellipse cx="130" cy="184" rx="48" ry="52" fill="url(#bunnyWhiteFur)" />
        <ellipse cx="132" cy="188" rx="30" ry="34" fill="#FFFFFF" opacity="0.72" />

        {/* Head + Long Bouncing Ears */}
        <motion.g
          style={{ transformOrigin: '130px 136px' }}
          animate={
            isRunning
              ? { y: [0, -6, 0], rotate: [2, 6, 2] }
              : isOffering
                ? { rotate: [-3, 5, -3] }
                : { rotate: [-2, 2, -2] }
          }
          transition={{
            duration: isRunning ? 0.36 : 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Left Long Ear */}
          <motion.g
            style={{ transformOrigin: '108px 82px' }}
            animate={
              isRunning
                ? { rotate: [-28, 8, -28] }
                : isJumping
                  ? { rotate: [-18, 4, -18] }
                  : { rotate: [-7, -2, -7] }
            }
            transition={{ duration: isRunning ? 0.36 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ellipse cx="102" cy="46" rx="16" ry="42" transform="rotate(-12 102 46)" fill="url(#bunnyWhiteFur)" />
            <ellipse cx="103" cy="49" rx="8.5" ry="30" transform="rotate(-12 103 49)" fill="url(#bunnyInnerEar)" />
          </motion.g>

          {/* Right Long Ear */}
          <motion.g
            style={{ transformOrigin: '152px 82px' }}
            animate={
              isRunning
                ? { rotate: [28, -6, 28] }
                : isJumping
                  ? { rotate: [18, -4, 18] }
                  : { rotate: [7, 2, 7] }
            }
            transition={{
              duration: isRunning ? 0.36 : 1.8,
              delay: 0.05,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ellipse cx="158" cy="46" rx="16" ry="42" transform="rotate(12 158 46)" fill="url(#bunnyWhiteFur)" />
            <ellipse cx="157" cy="49" rx="8.5" ry="30" transform="rotate(12 157 49)" fill="url(#bunnyInnerEar)" />
          </motion.g>

          {/* Fluffy Head */}
          <ellipse cx="130" cy="108" rx="52" ry="45" fill="url(#bunnyWhiteFur)" />
          <ellipse cx="94" cy="118" rx="17" ry="14" fill="url(#bunnyWhiteFur)" />
          <ellipse cx="166" cy="118" rx="17" ry="14" fill="url(#bunnyWhiteFur)" />

          {/* Rosy Cheeks */}
          <ellipse cx="96" cy="120" rx="12" ry="7.5" fill="#F472B6" opacity="0.45" />
          <ellipse cx="164" cy="120" rx="12" ry="7.5" fill="#F472B6" opacity="0.45" />

          {/* Sparkling Eyes */}
          {isJumping ? (
            <>
              <path d="M100 105 Q109 96 118 105" fill="none" stroke="#3B152B" strokeWidth="3.8" strokeLinecap="round" />
              <path d="M142 105 Q151 96 160 105" fill="none" stroke="#3B152B" strokeWidth="3.8" strokeLinecap="round" />
            </>
          ) : blinking ? (
            <>
              <path d="M100 106 Q109 110 118 106" fill="none" stroke="#3B152B" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M142 106 Q151 110 160 106" fill="none" stroke="#3B152B" strokeWidth="3.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="110" cy="105" rx="9.5" ry="10.8" fill="#3B152B" />
              <circle cx="107" cy="100.5" r="3.6" fill="#FFFFFF" />
              <circle cx="113" cy="109" r="1.7" fill="#FFFFFF" opacity="0.9" />

              <ellipse cx="150" cy="105" rx="9.5" ry="10.8" fill="#3B152B" />
              <circle cx="147" cy="100.5" r="3.6" fill="#FFFFFF" />
              <circle cx="153" cy="109" r="1.7" fill="#FFFFFF" opacity="0.9" />
            </>
          )}

          {/* Tiny Pink Nose & Smile */}
          <path d="M125 116 Q130 113 135 116 Q133 122 130 123 Q127 122 125 116 Z" fill="#F472B6" />
          <path
            d="M120 126 Q125 132 130 127 Q135 132 140 126"
            fill="none"
            stroke="#6D214F"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Front Paws + Rigged Tulip Bouquet held securely inside paws */}
        <motion.g
          style={{ transformOrigin: '136px 176px' }}
          animate={
            isRunning
              ? { y: [0, -6, 0], x: [0, 5, 0], rotate: [-4, 4, -4] }
              : isOffering
                ? { x: [4, 14, 4], scale: [1.04, 1.12, 1.04] }
                : { x: 0 }
          }
          transition={{ duration: isRunning ? 0.36 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {holdingBouquet && (
            <g transform="translate(106, 108) scale(0.92) rotate(12)">
              <TulipBouquetSVG />
            </g>
          )}
          <ellipse cx="114" cy="182" rx="15" ry="11" transform="rotate(20 114 182)" fill="url(#bunnyWhiteFur)" stroke="#F1DAE6" strokeWidth="1.5" />
          <ellipse cx="154" cy="182" rx="15" ry="11" transform="rotate(-20 154 182)" fill="url(#bunnyWhiteFur)" stroke="#F1DAE6" strokeWidth="1.5" />
        </motion.g>
      </svg>
    </motion.div>
  );
};
