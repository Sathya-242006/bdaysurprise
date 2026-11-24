import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { AmbientParticles, ParticleTheme } from './components/AmbientParticles';
import { Scene1VillageWalk } from './components/Scene1VillageWalk';
import { Scene2BunnySurprise } from './components/Scene2BunnySurprise';
import { Scene3HiddenCake } from './components/Scene3HiddenCake';
import { Scene4CandleBlowing } from './components/Scene4CandleBlowing';
import { Scene5Letter } from './components/Scene5Letter';
import { Scene6Fireworks } from './components/Scene6Fireworks';
import { audioEngine } from './utils/audioEngine';

type SceneStep = 1 | 2 | 3 | 4 | 5 | 6;

const SCENES: { id: SceneStep; label: string }[] = [
  { id: 1, label: 'Village Hills' },
  { id: 2, label: 'Bunny Surprise' },
  { id: 3, label: 'Hidden Cake' },
  { id: 4, label: 'Make a Wish' },
  { id: 5, label: 'Letter' },
  { id: 6, label: 'Fireworks' },
];

export default function App() {
  const [scene, setScene] = useState<SceneStep>(1);
  const [maxUnlocked, setMaxUnlocked] = useState<SceneStep>(1);
  const [musicOn, setMusicOn] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, []);

  const handleFirstInteraction = useCallback(() => {
    if (!hasStartedAudio) {
      const started = audioEngine.startMusic('fairytale');
      setHasStartedAudio(true);
      setMusicOn(started);
    }
  }, [hasStartedAudio]);

  const handleToggleMusic = () => {
    const audible = audioEngine.toggleMusic();
    setHasStartedAudio(true);
    setMusicOn(audible);
  };

  const goToScene = useCallback((next: SceneStep) => {
    setScene(next);
    setMaxUnlocked((prev) => (next > prev ? next : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReceiveBouquet = useCallback(() => {
    audioEngine.speakHappyBirthdayVinu();
  }, []);

  const handleReplayVoice = useCallback(() => {
    audioEngine.speakHappyBirthdayVinu();
  }, []);

  const handleSurpriseDiscover = useCallback(() => {
    audioEngine.playSurpriseReveal();
  }, []);

  const handleBlowStart = useCallback(() => {
    handleFirstInteraction();
    audioEngine.playCandleBlow();
  }, [handleFirstInteraction]);

  const handleCandlesExtinguished = useCallback(() => {
    const started = audioEngine.playFullBirthdaySong();
    setHasStartedAudio(true);
    setMusicOn(started);
  }, []);

  const handleEnvelopeOpen = useCallback(() => {
    handleFirstInteraction();
    audioEngine.playEnvelopeOpen();
  }, [handleFirstInteraction]);

  const handleCountdownTick = useCallback((step: number) => {
    audioEngine.playCountdownTick(step);
  }, []);

  const handleFireworkBurst = useCallback((intensity = 0.8) => {
    audioEngine.playFireworkBurst(intensity);
  }, []);

  const handleLaunchFinale = useCallback(() => {
    audioEngine.playSurpriseReveal();
    audioEngine.switchTrackSoftly('birthday');
  }, []);

  const handleReplay = useCallback(() => {
    setReplayCount((c) => c + 1);
    setScene(1);
    setMaxUnlocked(1);
    audioEngine.switchTrackSoftly('fairytale');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isNight = scene === 6;

  const particleTheme: ParticleTheme =
    scene === 6 ? 'night' : scene === 5 ? 'letter' : scene === 4 ? 'cake' : 'garden';

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-700 ${
        isNight ? 'bg-[#070620]' : 'bg-[#E0F2FE]'
      }`}
    >
      {/* Floating hearts, petals, sparkles & stars */}
      <AmbientParticles theme={particleTheme} />

      {/* Minimal Floating Top Navigation Bar */}
      <header
        className={`fixed top-0 inset-x-0 z-40 h-14 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-500 ${
          isNight
            ? 'bg-[#090724]/55 backdrop-blur-md border-b border-white/12'
            : 'bg-white/62 backdrop-blur-md border-b border-white/65'
        }`}
      >
        {/* Zone 1: Brand Title */}
        <span
          className={`text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors duration-500 ${
            isNight ? 'text-[#FDF2F8]' : 'text-[#521B3A]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          A Little Birthday World – Vinu
        </span>

        {/* Zone 2: Clean Unlocked Fairytale Chapter Navigation */}
        <nav
          aria-label="Birthday story chapters"
          className="hidden lg:flex items-center gap-3 text-xs font-medium"
        >
          {SCENES.map((step, index) => {
            const unlocked = step.id <= maxUnlocked;
            const active = step.id === scene;
            return (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className={isNight ? 'text-purple-300/35' : 'text-pink-400/55'}
                  >
                    ·
                  </span>
                )}
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && goToScene(step.id)}
                  aria-current={active ? 'step' : undefined}
                  className={`min-h-[34px] px-1 transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:underline ${
                    active
                      ? isNight
                        ? 'text-[#FEF08A] font-semibold underline underline-offset-4'
                        : 'text-[#BE185D] font-semibold underline underline-offset-4'
                      : unlocked
                        ? isNight
                          ? 'text-purple-200/80 hover:text-white'
                          : 'text-[#7A355B] hover:text-[#4A1936]'
                        : isNight
                          ? 'text-purple-300/30 cursor-not-allowed'
                          : 'text-[#A87A95]/60 cursor-not-allowed'
                  }`}
                >
                  {step.id}. {step.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Compact mobile scene indicator */}
        <span
          className={`lg:hidden text-xs font-medium tabular-nums whitespace-nowrap ${
            isNight ? 'text-purple-200/90' : 'text-[#7A355B]'
          }`}
        >
          {scene} / 6
        </span>

        {/* Zone 3: Persistent Music ON/OFF Button */}
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={musicOn ? 'Turn background music off' : 'Turn background music on'}
          aria-pressed={musicOn}
          className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 ${
            isNight
              ? musicOn
                ? 'bg-pink-500/25 text-[#FDF2F8] border border-pink-300/40 hover:bg-pink-500/35 focus-visible:ring-amber-300'
                : 'bg-white/12 text-purple-200 border border-white/18 hover:bg-white/20 focus-visible:ring-amber-300'
              : musicOn
                ? 'bg-[#FCE7F3] text-[#9D174D] border border-pink-300/90 hover:bg-pink-100 focus-visible:ring-[#D9468F]'
                : 'bg-white/85 text-[#6D214F] border border-pink-200/80 hover:bg-white focus-visible:ring-[#D9468F]'
          }`}
        >
          {musicOn ? (
            <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>{musicOn ? 'Music On' : 'Music Off'}</span>
        </button>
      </header>

      {/* Single-Scene Animated Fairytale Movie Stage */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {scene === 1 && (
            <motion.div
              key={`scene-1-${replayCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
            >
              <Scene1VillageWalk
                onFirstInteraction={handleFirstInteraction}
                onNext={() => goToScene(2)}
              />
            </motion.div>
          )}

          {scene === 2 && (
            <motion.div
              key={`scene-2-${replayCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
            >
              <Scene2BunnySurprise
                onFirstInteraction={handleFirstInteraction}
                onReceiveBouquet={handleReceiveBouquet}
                onReplayVoice={handleReplayVoice}
                onNext={() => goToScene(3)}
              />
            </motion.div>
          )}

          {scene === 3 && (
            <motion.div
              key={`scene-3-${replayCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
            >
              <Scene3HiddenCake
                onSurpriseDiscover={handleSurpriseDiscover}
                onNext={() => goToScene(4)}
              />
            </motion.div>
          )}

          {scene === 4 && (
            <motion.div
              key={`scene-4-${replayCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
            >
              <Scene4CandleBlowing
                onBlowStart={handleBlowStart}
                onCandlesExtinguished={handleCandlesExtinguished}
                onNext={() => goToScene(5)}
              />
            </motion.div>
          )}

          {scene === 5 && (
            <motion.div
              key={`scene-5-${replayCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
            >
              <Scene5Letter
                onEnvelopeOpen={handleEnvelopeOpen}
                onNext={() => goToScene(6)}
              />
            </motion.div>
          )}

          {scene === 6 && (
            <motion.div
              key={`scene-6-${replayCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85 }}
            >
              <Scene6Fireworks
                onCountdownTick={handleCountdownTick}
                onFireworkBurst={handleFireworkBurst}
                onLaunchFinale={handleLaunchFinale}
                onReplay={handleReplay}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
