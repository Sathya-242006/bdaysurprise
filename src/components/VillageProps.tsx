import React, { useState } from 'react';
import { motion } from 'motion/react';

export const VILLAGE_DAY_IMG = '/src/assets/images/village_hills_day_1795500928997.jpg';
export const VILLAGE_NIGHT_IMG = '/src/assets/images/village_hills_night_1795500930136.jpg';

/* Animated fluttering fairytale butterfly */
export const Butterfly: React.FC<{
  className?: string;
  wingColor?: string;
  accentColor?: string;
  duration?: number;
}> = ({
  className = '',
  wingColor = '#F9A8D4',
  accentColor = '#C084FC',
  duration = 6.5,
}) => (
  <motion.div
    animate={{
      x: [0, 34, -18, 26, 0],
      y: [0, -24, -8, -30, 0],
      rotate: [-6, 8, -4, 6, -6],
    }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    className={`pointer-events-none absolute z-20 ${className}`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 48 36" className="w-8 h-6 sm:w-10 sm:h-8 drop-shadow-sm">
      <g className="animate-butterfly-wing">
        <path d="M24 18 C14 4, 2 6, 4 16 C6 24, 16 24, 24 20 Z" fill={wingColor} opacity="0.92" />
        <path d="M24 20 C16 22, 8 28, 12 33 C16 36, 22 30, 24 23 Z" fill={accentColor} opacity="0.88" />
        <path d="M24 18 C34 4, 46 6, 44 16 C42 24, 32 24, 24 20 Z" fill={wingColor} opacity="0.92" />
        <path d="M24 20 C32 22, 40 28, 36 33 C32 36, 26 30, 24 23 Z" fill={accentColor} opacity="0.88" />
      </g>
      <ellipse cx="24" cy="20" rx="2" ry="7" fill="#521B3A" />
    </svg>
  </motion.div>
);

/* Daytime Peaceful Village Hills Backdrop + Drifting Clouds + Swaying Foreground Tulips */
export const VillageLandscape: React.FC<{
  dimOverlay?: boolean;
  showButterflies?: boolean;
}> = ({ dimOverlay = false, showButterflies = true }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {!imgErr ? (
        <img
          src={VILLAGE_DAY_IMG}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#86EFAC]" />
      )}

      {/* Subtle warm golden fairytale mist */}
      <div
        className="absolute inset-0"
        style={{
          background: dimOverlay
            ? 'linear-gradient(180deg, rgba(255,245,250,0.28) 0%, rgba(252,231,243,0.22) 55%, rgba(20,83,45,0.18) 100%)'
            : 'linear-gradient(180deg, rgba(224,242,254,0.15) 0%, rgba(255,255,255,0.06) 55%, rgba(22,101,52,0.12) 100%)',
        }}
      />

      {/* Slowly drifting translucent fairytale cloud wisps */}
      <motion.div
        animate={{ x: ['-6%', '6%', '-6%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-[8%] w-40 h-12 rounded-full bg-white/45 blur-xl"
      />
      <motion.div
        animate={{ x: ['6%', '-6%', '6%'] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-[12%] w-52 h-14 rounded-full bg-white/40 blur-xl"
      />

      {showButterflies && (
        <>
          <Butterfly className="top-24 left-[12%]" wingColor="#F9A8D4" accentColor="#F472B6" duration={7.2} />
          <Butterfly className="top-32 right-[15%]" wingColor="#BAE6FD" accentColor="#60A5FA" duration={6.4} />
          <Butterfly className="bottom-36 left-[24%]" wingColor="#DDD6FE" accentColor="#C084FC" duration={8.2} />
        </>
      )}

      {/* Gently swaying foreground tulips framing bottom corners */}
      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-28 flex justify-between items-end px-2 sm:px-6 opacity-95">
        <motion.svg
          viewBox="0 0 220 90"
          className="w-40 sm:w-56 h-auto overflow-visible"
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {[
            { x: 24, h: 52, c: '#F472B6' },
            { x: 56, h: 64, c: '#FACC15' },
            { x: 92, h: 48, c: '#C084FC' },
            { x: 128, h: 58, c: '#FB7185' },
            { x: 166, h: 46, c: '#F472B6' },
          ].map((fl, idx) => (
            <g key={idx}>
              <path d={`M${fl.x} 90 Q${fl.x - 4} ${90 - fl.h * 0.5} ${fl.x} ${90 - fl.h}`} stroke="#16A34A" strokeWidth="4" fill="none" />
              <path d={`M${fl.x} 86 Q${fl.x - 14} 68 ${fl.x - 18} 56 Q${fl.x - 4} 66 ${fl.x} 80`} fill="#22C55E" />
              <path
                d={`M${fl.x - 9} ${90 - fl.h} C${fl.x - 11} ${90 - fl.h - 14}, ${fl.x - 3} ${90 - fl.h - 18}, ${fl.x} ${90 - fl.h - 10} C${fl.x + 3} ${90 - fl.h - 18}, ${fl.x + 11} ${90 - fl.h - 14}, ${fl.x + 9} ${90 - fl.h} C${fl.x + 8} ${90 - fl.h + 8}, ${fl.x - 8} ${90 - fl.h + 8}, ${fl.x - 9} ${90 - fl.h} Z`}
                fill={fl.c}
              />
            </g>
          ))}
        </motion.svg>

        <motion.svg
          viewBox="0 0 220 90"
          className="w-40 sm:w-56 h-auto overflow-visible"
          animate={{ rotate: [1.5, -1.5, 1.5] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {[
            { x: 54, h: 46, c: '#C084FC' },
            { x: 92, h: 60, c: '#F472B6' },
            { x: 128, h: 52, c: '#60A5FA' },
            { x: 164, h: 64, c: '#FACC15' },
            { x: 196, h: 50, c: '#FB7185' },
          ].map((fl, idx) => (
            <g key={idx}>
              <path d={`M${fl.x} 90 Q${fl.x + 4} ${90 - fl.h * 0.5} ${fl.x} ${90 - fl.h}`} stroke="#16A34A" strokeWidth="4" fill="none" />
              <path d={`M${fl.x} 86 Q${fl.x + 14} 68 ${fl.x + 18} 56 Q${fl.x + 4} 66 ${fl.x} 80`} fill="#22C55E" />
              <path
                d={`M${fl.x - 9} ${90 - fl.h} C${fl.x - 11} ${90 - fl.h - 14}, ${fl.x - 3} ${90 - fl.h - 18}, ${fl.x} ${90 - fl.h - 10} C${fl.x + 3} ${90 - fl.h - 18}, ${fl.x + 11} ${90 - fl.h - 14}, ${fl.x + 9} ${90 - fl.h} C${fl.x + 8} ${90 - fl.h + 8}, ${fl.x - 8} ${90 - fl.h + 8}, ${fl.x - 9} ${90 - fl.h} Z`}
                fill={fl.c}
              />
            </g>
          ))}
        </motion.svg>
      </div>
    </div>
  );
};

/* Consistent 3D Pink & Cream Birthday Cake with Animated Candles & Realistic Smoke */
export const FairytaleCakeSVG: React.FC<{
  candlesLit: boolean;
  showSmoke?: boolean;
  className?: string;
}> = ({ candlesLit, showSmoke = false, className = 'w-48 sm:w-64' }) => {
  const candleXs = [78, 104, 130, 156, 182];
  const candleColors = ['#F472B6', '#C084FC', '#FB7185', '#60A5FA', '#F472B6'];

  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 260 225"
        className="w-full h-auto overflow-visible drop-shadow-[0_14px_22px_rgba(157,23,77,0.22)]"
        role="img"
        aria-label="Pink and cream birthday cake with five candles"
      >
        <defs>
          <linearGradient id="ftCakeBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="32%" stopColor="#FBCFE8" />
            <stop offset="72%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="ftCakeTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="38%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <radialGradient id="ftFlameHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FB923C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cake Stand Plate */}
        <ellipse cx="130" cy="202" rx="108" ry="18" fill="#F9A8D4" />
        <ellipse cx="130" cy="197" rx="108" ry="16" fill="#FFFDF9" />

        {/* Bottom Tier */}
        <path d="M40 132 L40 186 C40 200, 220 200, 220 186 L220 132 Z" fill="url(#ftCakeBottom)" />
        <ellipse cx="130" cy="132" rx="90" ry="16" fill="#FCE7F3" />
        {/* Lavender ribbon band */}
        <path d="M40 166 C40 179, 220 179, 220 166 L220 176 C220 189, 40 189, 40 176 Z" fill="#DDD6FE" />

        {/* Top Tier */}
        <path d="M62 76 L62 128 C62 140, 198 140, 198 128 L198 76 Z" fill="url(#ftCakeTop)" />
        <ellipse cx="130" cy="76" rx="68" ry="14" fill="#FFFDF9" />

        {/* Glossy white frosting drips */}
        <path
          d="M62 76 C62 88, 198 88, 198 76 L198 88 C191 88, 188 104, 180 104 C172 104, 169 90, 160 90 C150 90, 148 108, 138 108 C128 108, 125 92, 115 92 C105 92, 102 106, 92 106 C82 106, 78 90, 69 90 C65 90, 62 88, 62 88 Z"
          fill="#FFFDF9"
        />

        {/* Cream rosettes */}
        {[68, 88, 110, 130, 150, 172, 192].map((cx, i) => (
          <circle key={i} cx={cx} cy={134} r="7" fill="#FFFDF9" stroke="#FBCFE8" strokeWidth="1" />
        ))}

        {/* Small decorative flowers & hearts on cake */}
        {[82, 130, 178].map((hx, idx) => (
          <path
            key={idx}
            d={`M ${hx} 174 c -2.5 -3.5 -6.5 -3.5 -6.5 1 c 0 3.5 6.5 6.5 6.5 6.5 c 0 0 6.5 -3 6.5 -6.5 c 0 -4.5 -4 -4.5 -6.5 -1 z`}
            fill="#EC4899"
          />
        ))}

        {/* 5 Candles */}
        {candleXs.map((cx, idx) => (
          <g key={idx}>
            {/* Wax body */}
            <rect
              x={cx - 4.5}
              y={34}
              width="9"
              height="40"
              rx="3.5"
              fill="#FFFDF9"
              stroke={candleColors[idx]}
              strokeWidth="2"
            />
            <line x1={cx - 3.5} y1={44} x2={cx + 3.5} y2={48} stroke={candleColors[idx]} strokeWidth="2.5" />
            <line x1={cx - 3.5} y1={56} x2={cx + 3.5} y2={60} stroke={candleColors[idx]} strokeWidth="2.5" />
            {/* Wick */}
            <line x1={cx} y1={34} x2={cx} y2={28} stroke="#4A1936" strokeWidth="2" strokeLinecap="round" />

            {/* Lit animated flame */}
            {candlesLit && (
              <g>
                <circle cx={cx} cy={20} r="18" fill="url(#ftFlameHalo)" className="animate-twinkle" />
                <motion.path
                  d={`M${cx} 4 C${cx + 5} 12, ${cx + 7} 18, ${cx + 6} 23 C${cx + 5} 27, ${cx - 5} 27, ${cx - 6} 23 C${cx - 7} 18, ${cx - 5} 12, ${cx} 4 Z`}
                  fill="#FB923C"
                  animate={{ scaleY: [1, 1.12, 0.94, 1], scaleX: [1, 0.92, 1.06, 1] }}
                  transition={{ duration: 0.7 + idx * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${cx}px 26px` }}
                />
                <path
                  d={`M${cx} 12 C${cx + 3} 16, ${cx + 3.5} 20, ${cx + 3} 23 C${cx + 2} 25.5, ${cx - 2} 25.5, ${cx - 3} 23 C${cx - 3.5} 20, ${cx - 3} 16, ${cx} 12 Z`}
                  fill="#FEF9C3"
                />
              </g>
            )}

            {/* Realistic Rising Smoke Wisps & Sparkles when blown out! */}
            {!candlesLit && showSmoke && (
              <g>
                <motion.path
                  d={`M${cx} 26 Q${cx - 7} 14, ${cx + 3} 2 Q${cx + 10} -10, ${cx - 2} -24`}
                  fill="none"
                  stroke="rgba(226, 232, 240, 0.85)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.9, y: 0 }}
                  animate={{ pathLength: 1, opacity: [0.9, 0.65, 0], y: -22 }}
                  transition={{ duration: 1.9, delay: idx * 0.06, ease: 'easeOut' }}
                />
                <motion.circle
                  cx={cx}
                  cy={24}
                  r="3.2"
                  fill="#FDE047"
                  initial={{ scale: 0.5, opacity: 1, y: 0 }}
                  animate={{ scale: 1.4, opacity: 0, y: -32, x: (idx - 2) * 8 }}
                  transition={{ duration: 1.1, delay: idx * 0.05, ease: 'easeOut' }}
                />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
